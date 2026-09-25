// Client-side navigation after hydration: titles, content, split loader chunks, 404 handling, console errors.
const { chromium } = require('playwright');
const [,, base] = process.argv;
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1300, height: 900 } });
  const errors = []; page.on('pageerror', e => errors.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text().slice(0, 200)); });
  const chunks = []; page.on('response', r => { const u = r.url(); if (/\/assets\/.*\.js$|\?tsr-split|\.tsx|\/src\//.test(u) && r.status() === 200) chunks.push(u.split('/').pop().slice(0, 60)); });
  await page.goto(base + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  const step = async (label, action, expectPath) => { chunks.length = 0; await action(); await page.waitForFunction((p) => location.pathname === p, expectPath, { timeout: 15000 }).catch(() => {}); await page.waitForLoadState('networkidle').catch(() => {}); await page.waitForTimeout(500); const t = await page.title(); const h1 = await page.$eval('h1', e => e.textContent.trim().slice(0, 60)).catch(() => '(no h1)'); const desc = await page.$eval('meta[name="description"]', e => e.content.slice(0, 50)).catch(() => '(no desc)'); console.log(`${label.padEnd(30)} ${await page.evaluate(() => location.pathname)} | title: ${t.slice(0, 60)} | h1: ${h1} | desc: ${desc}… | ${chunks.filter(c => /content|json|services|glossary|insights|home|legal|about|contact|careers|assets|industries|engines/.test(c)).slice(0, 4).join(',')}`); };
  await step('click Services (nav)', () => page.click('nav a[href="/services"]'), '/services');
  await step('click first service row', () => page.click('.c-rows a[href="/services/shop-visit-management"]'), '/services/shop-visit-management');
  await step('click related service', () => page.click('a[href="/services/workscope-and-removal-planning"]'), '/services/workscope-and-removal-planning');
  await step('nav Engines', () => page.click('nav a[href="/engines"]'), '/engines');
  await step('engine LEAP', () => page.click('a[href="/engines/leap"]'), '/engines/leap');
  await step('nav Insights', () => page.click('nav a[href="/insights"]'), '/insights');
  await step('first article', () => page.click('.c-index a[href^="/insights/"], a[href^="/insights/"]'), null);
  await step('nav About', () => page.click('nav a[href="/about"]'), '/about');
  await step('footer Glossary', () => page.click('footer a[href="/glossary"]'), '/glossary');
  await step('footer Privacy', () => page.click('footer a[href="/privacy"]'), '/privacy');
  await step('Talk to us (header)', () => page.click('header a[href="/contact"]'), '/contact');
  await step('logo home', () => page.click('a.c-header__logo'), '/');
  // client-side 404
  await step('router.navigate unknown', () => page.evaluate(() => { history.pushState({}, '', '/services/does-not-exist'); dispatchEvent(new PopStateEvent('popstate')); }), '/services/does-not-exist');
  console.log('errors:', errors.length, errors.slice(0, 5));
  await browser.close();
})().catch(e => { console.error('FAILED', e); process.exit(1); });
