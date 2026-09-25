const fs = require('fs'); fs.mkdirSync(__dirname + '/out', { recursive: true });
const { chromium } = require('playwright');
const [,, base] = process.argv;
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  for (const [route, formSel] of [['/contact', 'form'], ['/assets', 'form']]) {
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(String(e).slice(0, 160))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
    const posts = []; page.on('request', r => { if (r.method() === 'POST') posts.push(r.url().slice(0, 90)); });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    const form = await page.$(formSel);
    if (!form) { console.log(route, 'NO FORM'); await ctx.close(); continue; }
    // describe fields
    const fields = await form.$$eval('input, select, textarea', els => els.map(e => `${e.tagName.toLowerCase()}#${e.id || e.name}${e.required ? '*' : ''}${e.type ? ':' + e.type : ''}`));
    console.log(route, 'fields:', fields.join(' '));
    // fill required-looking fields
    for (const el of await form.$$('input, select, textarea')) {
      const info = await el.evaluate(e => ({ tag: e.tagName.toLowerCase(), type: e.type, name: e.name || e.id, hidden: e.type === 'hidden' || getComputedStyle(e).display === 'none' || e.closest('[aria-hidden="true"]') !== null || e.tabIndex < 0 }));
      if (info.hidden) continue;
      if (info.tag === 'select') { await el.selectOption({ index: 1 }); continue; }
      if (info.type === 'checkbox') { await el.check(); continue; }
      const v = /email/i.test(info.name) ? 'qa@example.com' : /phone/i.test(info.name) ? '+41 79 000 00 00' : /message|need|detail/i.test(info.name) ? 'CFM56-7B26 going to shop in November; please review the proposed workscope.' : /company/i.test(info.name) ? 'QA Airline' : /name/i.test(info.name) ? 'QA Tester' : /role/i.test(info.name) ? 'Head of Powerplant' : 'Test value';
      await el.fill(v);
    }
    await page.click(`${formSel} .c-cta-submit, ${formSel} button[type=submit]`);
    await page.waitForTimeout(2500);
    const state = await page.evaluate(() => { const st = document.querySelector('.c-form__status, [role="status"], .c-form__result, .c-form__fallback'); const mail = document.querySelector('a[href^="mailto:"].c-cta-talk, .c-form__status a[href^="mailto:"], [role="status"] a[href^="mailto:"]'); return { status: st ? st.innerText.trim().slice(0, 300) : null, mailto: mail ? mail.getAttribute('href').slice(0, 220) : null, invalid: document.querySelectorAll('[aria-invalid="true"]').length }; });
    console.log(route, 'posts:', posts.length, JSON.stringify(state));
    if (errors.length) console.log(route, 'errors:', errors.slice(0, 3));
    await page.screenshot({ path: `${__dirname}/out/form-${route.replace('/', '')}.png` });
    await ctx.close();
  }
  await browser.close();
})();
