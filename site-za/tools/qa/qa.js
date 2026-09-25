// Local QA: screenshots at four widths, axe-core accessibility scan, console errors, link check, per-route weight.
// Usage: node qa.js <base-url> <out-dir> <routes-file>   (see ../README.md)
const { chromium, devices } = require('playwright');
const fs = require('fs'); const path = require('path');
const [,, base, outDir, routesFile] = process.argv;
const routes = fs.readFileSync(routesFile, 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
const widths = [390, 700, 1000, 1440];
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { routes: {} };
  const seenLinks = new Set();
  for (const route of routes) {
    const r = { consoleErrors: [], pageErrors: [], axe: null, weightKB: null, requests: 0, status: null, title: null, h1: null, links: [] };
    report.routes[route] = r;
    for (const w of widths) {
     try {
      const isMobile = w < 700;
      const ctx = await browser.newContext({ viewport: { width: w, height: isMobile ? 844 : 900 }, deviceScaleFactor: 1, isMobile, hasTouch: isMobile, reducedMotion: 'no-preference' });
      const page = await ctx.newPage();
      let bytes = 0, reqs = 0;
      page.on('response', async (res) => { try { const b = await res.body(); const cl = parseInt(res.headers()['content-length'] || '', 10); bytes += Number.isFinite(cl) && cl > 0 ? cl : b.length; reqs++; } catch {} });
      page.on('console', (m) => { if (m.type() === 'error') r.consoleErrors.push(`[${w}] ${m.text().slice(0, 200)}`); });
      page.on('pageerror', (e) => r.pageErrors.push(`[${w}] ${String(e).slice(0, 200)}`));
      const res = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => { r.pageErrors.push(`[${w}] goto: ${e.message.slice(0, 120)}`); return null; });
      if (w === 1440) { r.status = res && res.status(); r.title = await page.title(); r.h1 = await page.$$eval('h1', (els) => els.map(e => e.textContent.trim().slice(0, 80))); }
      await page.waitForTimeout(800);
      const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_');
      await page.screenshot({ path: path.join(outDir, `${slug}-${w}-fold.png`) });
      // scroll through for reveals, then full page
      await page.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(600);
      if (w === 1440 || w === 390) await page.screenshot({ path: path.join(outDir, `${slug}-${w}-full.jpg`), fullPage: true, type: 'jpeg', quality: 60 });
      if (w === 1440) {
        r.weightKB = Math.round(bytes / 1024); r.requests = reqs;
        await page.addScriptTag({ content: AXE });
        r.axe = await page.evaluate(async () => { const res = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }); return res.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map(n => n.target.join(' ')) , count: v.nodes.length })); });
        r.links = await page.$$eval('a[href]', (as) => as.map(a => a.getAttribute('href')).filter(h => h && h.startsWith('/')));
        r.links.forEach(l => seenLinks.add(l.split('#')[0]));
      }
      if (w === 1440 && route === '/') {
        // menu screenshot at 700 handled below; here check header theme attribute changes
        r.headerTheme = await page.$eval('.c-header', (h) => h.dataset.theme);
      }
      await ctx.close();
     } catch (e) { r.pageErrors.push(`[${w}] run: ${String(e.message || e).slice(0, 120)}`); }
    }
    // mobile menu open
    if (route === '/') try {
      const ctx = await browser.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.click('.c-header__burger'); await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(outDir, 'home-390-menu.png') });
      await ctx.close();
    } catch (e) { r.pageErrors.push(`menu: ${String(e.message || e).slice(0, 120)}`); }
  }
  // link check
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  report.brokenLinks = [];
  for (const l of seenLinks) { const res = await page.goto(base + l, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => null); const st = res ? res.status() : 0; if (st >= 400 || st === 0) report.brokenLinks.push({ href: l, status: st }); }
  await ctx.close();
  await browser.close();
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 1));
  // summary
  for (const [route, r] of Object.entries(report.routes)) {
    const ax = r.axe ? r.axe.length : 'n/a';
    console.log(`${route}\tstatus ${r.status}\t${r.weightKB} KB/${r.requests} req\taxe ${ax}\th1 ${JSON.stringify(r.h1)}\terrors ${r.consoleErrors.length + r.pageErrors.length}`);
  }
  console.log('broken links:', JSON.stringify(report.brokenLinks));
})();
