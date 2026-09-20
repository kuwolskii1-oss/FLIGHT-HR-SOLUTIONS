// Under prefers-reduced-motion: is the film fetched? What does the journey show?
const { chromium } = require('playwright');
const [,, base] = process.argv;
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  for (const rm of ['reduce', 'no-preference']) {
    const ctx = await browser.newContext({ viewport: { width: 1300, height: 850 }, reducedMotion: rm });
    const page = await ctx.newPage();
    const world = [];
    page.on('request', (r) => { if (r.url().includes('/assets/world/')) world.push(r.url().split('/').pop()); });
    await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.evaluate(async () => { for (let y = 0; y < 6000; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } });
    await page.waitForTimeout(1500);
    const info = await page.evaluate(() => { const v = document.querySelector('.scroll-scrub__video'); const p = document.querySelector('.scroll-scrub__poster'); const root = document.querySelector('.scroll-scrub'); return { video: v ? `${v.tagName} src=${(v.getAttribute('src')||'').slice(0,30)} display=${getComputedStyle(v).display}` : 'none', poster: p ? `${p.tagName} src=${(p.getAttribute('src')||'').slice(0,40)}` : 'none', journeyHeight: root ? root.getBoundingClientRect().height : null, rmAttr: root ? (root.getAttribute('data-reduced-motion') || root.className.slice(0, 80)) : null }; });
    console.log(`${rm}: world requests ${world.length}${world.length ? ' [' + [...new Set(world)].slice(0, 6).join(', ') + ']' : ''}; ${JSON.stringify(info)}`);
    await ctx.close();
  }
  await browser.close();
})();
