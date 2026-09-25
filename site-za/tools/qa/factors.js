// Measures the build prompt's Agent 4 factors on a running site.
// Usage: node factors.js <base-url> <routes-file> [out.json]
// Rows: words per screen (home), calls to action per screen, headline length, paragraph length,
// longest CSS animation, stagger, reduced motion, horizontal scroll, page weight, time to first
// readable text on throttled 3G, console errors. Keyboard and axe are covered by interact.js and qa.js.
const { chromium } = require('playwright'); const fs = require('fs');
const [,, base, routesFile, outFile] = process.argv;
const routes = fs.readFileSync(routesFile, 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
const WIDTHS = [375, 768, 1440];
const CTA = '.c-cta-talk, .c-cta-urgent, .c-cta-closing, .c-cta-submit, .c-cta-link, .c-door__title a';
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = {};
  for (const route of routes) {
    const r = report[route] = {};
    for (const w of WIDTHS) {
      const ctx = await browser.newContext({ viewport: { width: w, height: w < 700 ? 812 : 900 }, deviceScaleFactor: 1, isMobile: w < 700, hasTouch: w < 700 });
      const page = await ctx.newPage();
      const errors = []; page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); }); page.on('pageerror', e => errors.push('PAGEERROR ' + String(e).slice(0, 160)));
      let bytes = 0, videoBytes = 0; page.on('response', async (res) => { try { const b = await res.body(); const ct = res.headers()['content-type'] || ''; if (/video/.test(ct) || /\.mp4/.test(res.url())) videoBytes += b.length; else bytes += b.length; } catch {} });
      await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(500);
      // walk the page so every reveal has fired, then measure
      await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 300) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); });
      await page.waitForTimeout(400);
      const m = await page.evaluate((CTA) => {
        const vh = innerHeight; const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const bands = {}; const ctas = {};
        const visible = (el) => { const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && !el.closest('[hidden], [aria-hidden="true"], script, style, noscript, .c-menu, .c-dropdown'); };
        let n; while ((n = walker.nextNode())) { const t = n.textContent.trim(); if (!t) continue; const el = n.parentElement; if (!el || !visible(el)) continue; const range = document.createRange(); range.selectNodeContents(n); const rect = range.getBoundingClientRect(); if (!rect.height) continue; const band = Math.floor((rect.top + scrollY + rect.height / 2) / vh); bands[band] = (bands[band] || 0) + t.split(/\s+/).length; }
        for (const el of document.querySelectorAll(CTA)) { if (!visible(el)) continue; const rect = el.getBoundingClientRect(); if (!rect.height) continue; const band = Math.floor((rect.top + scrollY + rect.height / 2) / vh); ctas[band] = (ctas[band] || 0) + 1; }
        const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
        const heads = [...document.querySelectorAll('h1, h2')].filter(visible).map(h => ({ t: h.textContent.trim().slice(0, 60), n: words(h.textContent) }));
        const paras = [...document.querySelectorAll('main p')].filter(visible).map(p => ({ t: p.textContent.trim().slice(0, 50), n: words(p.textContent) }));
        // longest CSS transition or animation on any element
        let longest = 0, longestSel = ''; const toMs = (v) => v.split(',').map(s => s.trim()).map(s => s.endsWith('ms') ? parseFloat(s) : parseFloat(s) * 1000);
        for (const el of document.querySelectorAll('body *')) { const cs = getComputedStyle(el); for (const v of [...toMs(cs.transitionDuration), ...toMs(cs.animationDuration)]) { if (v > longest) { longest = v; longestSel = el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0]; } } }
        const stagger = Math.max(0, ...[...document.querySelectorAll('[data-sc-stagger]')].map(e => parseFloat(e.getAttribute('data-sc-stagger')) || 0));
        return { maxWordsPerScreen: Math.max(...Object.values(bands)), wordsBands: bands, maxCtasPerScreen: Math.max(0, ...Object.values(ctas)), ctaBands: ctas, longestHeadline: heads.sort((a, b) => b.n - a.n)[0], longestParagraph: paras.sort((a, b) => b.n - a.n)[0], longestAnimationMs: longest, longestAnimationOn: longestSel, maxStaggerMs: stagger, horizontalOverflow: document.documentElement.scrollWidth - innerWidth, scrollHeightVh: +(document.documentElement.scrollHeight / vh).toFixed(1) };
      }, CTA);
      m.weightKB = Math.round(bytes / 1024); m.videoKB = Math.round(videoBytes / 1024); m.consoleErrors = errors;
      // reduced motion: nothing moves between two scroll positions inside the hero, all cues visible
      if (w === 1440 || w === 375) {
        const rctx = await browser.newContext({ viewport: { width: w, height: w < 700 ? 812 : 900 }, reducedMotion: 'reduce', isMobile: w < 700, hasTouch: w < 700 });
        const rp = await rctx.newPage(); await rp.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 }); await rp.waitForTimeout(400);
        const snap = async () => rp.evaluate(() => ({ plane: document.querySelector('.c-ident__plane')?.getAttribute('transform') || 'none', trail: document.querySelector('.c-ident__trail') ? getComputedStyle(document.querySelector('.c-ident__trail')).strokeDashoffset : 'none' }));
        const a = await snap(); await rp.evaluate(() => scrollTo(0, innerHeight * 0.8)); await rp.waitForTimeout(300); const b = await snap();
        await rp.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 300) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } });
        await rp.waitForTimeout(300);
        const hidden = await rp.evaluate(() => { const bad = []; for (const el of document.querySelectorAll('main [data-sc-cue], main [data-sc-in], main [data-sc-stagger] > *')) { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); if (!r.height) continue; if (parseFloat(cs.opacity) < 0.95 && !el.closest('.c-cuesteps__list')) bad.push(el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0] + ':' + cs.opacity); } return bad.slice(0, 8); });
        m.reducedMotion = { identStill: a.plane === b.plane && a.trail === b.trail, hiddenContent: hidden };
        await rctx.close();
      }
      // time to first readable text on slow 3G (400 ms latency, 400 kbps down)
      if (w === 375) {
        const sctx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
        const sp = await sctx.newPage(); const cdp = await sctx.newCDPSession(sp);
        await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 400 * 1024 / 8, uploadThroughput: 400 * 1024 / 8 });
        await sp.goto(base + route, { waitUntil: 'commit', timeout: 120000 });
        const fcp = await sp.evaluate(() => new Promise((res) => { const done = (v) => res(v); const e = performance.getEntriesByName('first-contentful-paint')[0]; if (e) return done(e.startTime); new PerformanceObserver((l) => { const x = l.getEntriesByName('first-contentful-paint')[0]; if (x) done(x.startTime); }).observe({ type: 'paint', buffered: true }); setTimeout(() => done(-1), 60000); }));
        m.firstTextMs3G = Math.round(fcp);
        await sctx.close();
      }
      r[w] = m;
      await ctx.close();
    }
    console.log(route, JSON.stringify({ words: r[1440].maxWordsPerScreen, ctas: r[1440].maxCtasPerScreen, head: r[1440].longestHeadline?.n, para: r[1440].longestParagraph?.n, anim: r[1440].longestAnimationMs, stagger: r[1440].maxStaggerMs, overflow375: r[375].horizontalOverflow, kb: r[375].weightKB, fcp3g: r[375].firstTextMs3G, rm: r[375].reducedMotion, errors: r[375].consoleErrors.length + r[1440].consoleErrors.length }));
  }
  if (outFile) fs.writeFileSync(outFile, JSON.stringify(report, null, 1));
  await browser.close();
})().catch(e => { console.error('FAILED', e); process.exit(1); });
