// Fills and submits every form (invalid first, then valid) and reports validation, the shake,
// the segmented control, the consent check and the mailto fallback. Usage: node forms.js <base>
const fs = require('fs'); fs.mkdirSync(__dirname + '/out', { recursive: true });
const { chromium } = require('playwright');
const [,, base] = process.argv;
const ROUTES = ['/engines', '/aircraft', '/parts', '/charter', '/advisory', '/engines/engine-360', '/contact'];
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  for (const route of ROUTES) {
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(String(e).slice(0, 160))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
    const posts = []; page.on('request', r => { if (r.method() === 'POST') posts.push(r.url().slice(0, 90)); });
    let navigatedTo = null; page.on('framenavigated', f => { if (f === page.mainFrame() && !f.url().startsWith(base)) navigatedTo = f.url().slice(0, 120); });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.documentElement.classList.contains('sc-ready'), null, { timeout: 15000 }).catch(() => {});
    const form = await page.$('form.c-form');
    if (!form) { console.log(route, 'NO FORM'); await ctx.close(); continue; }
    const fields = await form.$$eval('input:not([type=hidden]):not([name=website]), select, textarea', els => els.map(e => `${e.tagName.toLowerCase()}#${e.name}${e.required ? '*' : ''}${e.type ? ':' + e.type : ''}`));
    // 1. submit empty: expect errors, shake, focus on first invalid
    await page.click('form.c-form .c-cta-submit');
    await page.waitForTimeout(150);
    const invalid = await page.evaluate(() => ({ count: document.querySelectorAll('form.c-form [aria-invalid="true"]').length, shaking: document.querySelectorAll('.is-shaking').length, errorWraps: document.querySelectorAll('form.c-form .t-input-wrap.is-error').length, focus: document.activeElement && (document.activeElement.name || document.activeElement.id) }));
    // 2. fill everything
    for (const el of await form.$$('input:not([type=hidden]), select, textarea')) {
      const info = await el.evaluate(e => ({ tag: e.tagName.toLowerCase(), type: e.type, name: e.name || e.id, hidden: e.closest('[aria-hidden="true"]') !== null || e.tabIndex < 0 && e.type !== 'radio' }));
      if (info.hidden || info.name === 'website') continue;
      if (info.tag === 'select') { await el.selectOption({ index: 1 }); continue; }
      if (info.type === 'checkbox') { await el.evaluate(e => { if (!e.checked) e.click(); }); continue; }
      if (info.type === 'radio') { await el.evaluate(e => { if (!e.checked) e.click(); }); continue; }
      const v = /email/i.test(info.name) ? 'qa@example.com' : /phone/i.test(info.name) ? '+27 11 000 0000' : /date/i.test(info.name) && info.type === 'date' ? '2026-11-03' : /number|quantity|size|count|weight/i.test(info.name) && info.type === 'number' ? '2' : /summary|message|description|mission|part/i.test(info.name) ? 'QA test text describing the requirement in one line.' : /company|organisation/i.test(info.name) ? 'QA Airline' : /^name$/i.test(info.name) ? 'QA Tester' : 'Test value';
      await el.fill(v);
    }
    // radios: pick the first of each group so showWhen fields appear, then re-fill any new text inputs
    await page.evaluate(() => { const seen = new Set(); document.querySelectorAll('form.c-form input[type=radio]').forEach(r => { if (!seen.has(r.name)) { seen.add(r.name); r.click(); } }); });
    await page.waitForTimeout(150);
    for (const el of await form.$$('input[type=text]:not([name=website]), textarea')) { if (!(await el.inputValue())) await el.fill('Test value'); }
    const aog = await page.$('.c-form__aog');
    await page.click('form.c-form .c-cta-submit');
    await page.waitForTimeout(2500);
    const state = await page.evaluate(() => { const st = document.querySelector('.c-form__status, .c-form__sent'); return { status: st ? st.innerText.trim().slice(0, 160) : null, invalid: document.querySelectorAll('[aria-invalid="true"]').length, sent: !!document.querySelector('.c-form__sent'), check: document.querySelector('.t-success-check')?.getAttribute('data-state') }; });
    console.log(route, '\n  fields:', fields.join(' '), '\n  empty submit:', JSON.stringify(invalid), '\n  aog block:', !!aog, ' posts:', posts.length, ' mailto nav:', navigatedTo ? navigatedTo.slice(0, 60) : null, '\n  result:', JSON.stringify(state));
    if (errors.length) console.log('  errors:', errors.slice(0, 3));
    await page.screenshot({ path: `${__dirname}/out/form${route.replace(/\//g, '_')}.png`, fullPage: false });
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error('FAILED', e); process.exit(1); });
