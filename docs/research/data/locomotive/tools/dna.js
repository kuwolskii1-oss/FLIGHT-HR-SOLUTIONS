// Design-DNA extractor: screenshots + typography, colour, layout, motion and tech signals per site.
const { chromium, devices } = require('playwright');
const fs = require('fs'); const path = require('path');
const [,, LIST, OUT] = process.argv;
const sites = fs.readFileSync(LIST, 'utf8').split('\n').map(l => l.trim()).filter(Boolean).map(l => { const [label, url] = l.split(/\s+/); return { label, url }; });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const withTimeout = (p, ms, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout: ' + what)), ms))]);
async function acceptCookies(page) {
  const sels = ['button:has-text("Accept all")', 'button:has-text("Accept All")', 'button:has-text("Accept")', 'button:has-text("I agree")', 'button:has-text("Agree")', 'button:has-text("OK")', 'button:has-text("Got it")', 'button:has-text("Allow all")', '[class*="cookie"] button', '#onetrust-accept-btn-handler', '.cc-btn.cc-allow', 'button:has-text("Accepter")', 'button:has-text("J\'accepte")'];
  for (const s of sels) { try { const b = page.locator(s).first(); if (!(await b.count())) continue; const ok = await b.evaluate(el => { const r = el.getBoundingClientRect(); const t = (el.innerText || '').toLowerCase(); return r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight && !/prefer|setting|manage|customi/.test(t); }); if (ok) { await b.click({ timeout: 2000, noWaitAfter: true }); await sleep(600); return s; } } catch (e) {} }
  return null;
}
const METRICS = () => {
  const vw = window.innerWidth, vh = window.innerHeight;
  const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
  const inc = (o, k, v = 1) => { if (k == null) return; o[k] = (o[k] || 0) + v; };
  // ---- text & colour stats
  const fontFam = {}, fontSize = {}, textColor = {}, bgColor = {}, weights = {}, lineHeights = {}, letterSp = {}, radii = {}, maxW = {};
  let maxFontPx = 0, maxFontEl = null, uppercaseCount = 0, textEls = 0;
  const all = document.querySelectorAll('body *');
  for (const el of all) {
    if (!vis(el)) continue;
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (own) {
      textEls++;
      inc(fontFam, cs.fontFamily.split(',')[0].replace(/["']/g, '').trim());
      const fs = parseFloat(cs.fontSize); inc(fontSize, Math.round(fs) + 'px'); inc(weights, cs.fontWeight); inc(textColor, cs.color);
      inc(lineHeights, cs.lineHeight === 'normal' ? 'normal' : (Math.round(parseFloat(cs.lineHeight) / fs * 100) / 100).toString());
      if (cs.letterSpacing !== 'normal') inc(letterSp, (Math.round(parseFloat(cs.letterSpacing) / fs * 1000) / 1000) + 'em');
      if (cs.textTransform === 'uppercase') uppercaseCount++;
      if (fs > maxFontPx) { maxFontPx = fs; maxFontEl = el; }
    }
    if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') inc(bgColor, cs.backgroundColor, Math.round(r.width * r.height / 10000));
    if (cs.borderRadius && cs.borderRadius !== '0px' && (cs.borderWidth !== '0px' || cs.backgroundColor !== 'rgba(0, 0, 0, 0)')) inc(radii, cs.borderRadius.split(' ')[0]);
    if (cs.maxWidth && cs.maxWidth !== 'none' && cs.maxWidth.endsWith('px') && parseFloat(cs.maxWidth) > 600 && parseFloat(cs.maxWidth) <= 2200) inc(maxW, cs.maxWidth);
  }
  // ---- headings
  const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(vis).slice(0, 40).map(h => { const cs = getComputedStyle(h); return { tag: h.tagName, text: h.innerText.trim().replace(/\s+/g, ' ').slice(0, 100), size: Math.round(parseFloat(cs.fontSize)), weight: cs.fontWeight, family: cs.fontFamily.split(',')[0].replace(/["']/g, ''), lh: cs.lineHeight === 'normal' ? 'normal' : Math.round(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) * 100) / 100, ls: cs.letterSpacing, transform: cs.textTransform, color: cs.color, top: Math.round(h.getBoundingClientRect().top + scrollY) }; });
  const h1 = heads.find(h => h.tag === 'H1') || heads[0] || null;
  const bodyP = [...document.querySelectorAll('p')].filter(p => vis(p) && p.innerText.trim().length > 60).slice(0, 5).map(p => { const cs = getComputedStyle(p); return { size: Math.round(parseFloat(cs.fontSize)), lh: Math.round(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) * 100) / 100, family: cs.fontFamily.split(',')[0].replace(/["']/g, ''), color: cs.color, measure: Math.round(p.getBoundingClientRect().width) }; });
  // ---- nav / cta
  const header = document.querySelector('header, [class*="header"], nav');
  const navLinks = header ? [...header.querySelectorAll('a')].filter(vis).map(a => a.innerText.trim().replace(/\s+/g, ' ')).filter(t => t && t.length < 40).slice(0, 15) : [];
  const buttons = [...document.querySelectorAll('a,button')].filter(el => vis(el) && /btn|button|cta/i.test(el.className + ' ' + el.tagName)).map(b => b.innerText.trim().replace(/\s+/g, ' ')).filter(t => t && t.length < 50);
  const burger = !!document.querySelector('[class*="burger"],[class*="hamburger"],[class*="menu-toggle"],[class*="nav-toggle"],button[aria-label*="menu" i],[class*="c-header_toggle"]');
  const headerCS = header ? getComputedStyle(header) : null;
  // ---- interaction pattern signals
  const cls = [...document.querySelectorAll('[class]')].map(e => e.className.baseVal !== undefined ? e.className.baseVal : e.className).join(' ');
  const has = re => re.test(cls);
  const signals = {
    customCursor: getComputedStyle(document.body).cursor === 'none' || getComputedStyle(document.documentElement).cursor === 'none' || has(/(^|\s)[a-z-]*cursor[a-z_-]*/i),
    marquee: has(/marquee/i), preloader: has(/preloader|c-loader|page-loader|intro-loader/i), textSplit: has(/split|_line\b|-line\b|_word\b|-word\b|_char\b|-char\b/i), magnetic: has(/magnetic/i), parallax: has(/parallax/i) || !!document.querySelector('[data-scroll-speed],[data-speed]'),
    sticky: [...all].filter(e => getComputedStyle(e).position === 'sticky').length, fixed: [...all].filter(e => getComputedStyle(e).position === 'fixed').length,
    horizontalScroll: has(/horizontal|hscroll|h-scroll/i), themeSwitch: !!document.querySelector('[data-theme],[class*="theme-dark"],[class*="is-dark"],[data-bg]'),
    scrollContainer: !!document.querySelector('[data-scroll-container],[data-scroll],.has-scroll-smooth,html.lenis,.lenis,#smooth-wrapper,[data-lenis]'),
    pageTransitions: !!document.querySelector('[data-barba],[data-taxi],[data-swup],[class*="transition"]'), grid: [...all].filter(e => getComputedStyle(e).display === 'grid').length,
    videos: document.querySelectorAll('video').length, autoplayVideos: document.querySelectorAll('video[autoplay]').length, canvases: document.querySelectorAll('canvas').length, inlineSvg: document.querySelectorAll('svg').length, iframes: document.querySelectorAll('iframe').length,
    images: document.images.length, imgFormats: (() => { const o = {}; for (const i of document.images) { const src = (i.currentSrc || i.src || '').split('?')[0]; const ext = (src.match(/\.(avif|webp|png|jpe?g|gif|svg)$/i) || [, 'other'])[1].toLowerCase(); inc(o, ext); } return o; })(),
    langSwitch: !!document.querySelector('a[hreflang], [class*="lang"], a[href*="/fr"], a[href*="/en"]'), darkFirstView: (() => { const c = getComputedStyle(document.body).backgroundColor.match(/\d+/g); return c ? (parseInt(c[0]) * 0.299 + parseInt(c[1]) * 0.587 + parseInt(c[2]) * 0.114) < 100 : false; })(),
  };
  // ---- libs via globals
  const g = k => { try { return typeof window[k] !== 'undefined'; } catch (e) { return false; } };
  const libs = { gsap: g('gsap'), ScrollTrigger: g('ScrollTrigger') || (window.gsap && window.gsap.plugins && !!window.gsap.plugins.scrollTrigger) || false, Lenis: g('Lenis') || g('lenis'), LocomotiveScroll: g('LocomotiveScroll'), THREE: g('THREE'), barba: g('barba'), Swup: g('Swup'), Splitting: g('Splitting'), lottie: g('lottie') || g('bodymovin'), PIXI: g('PIXI'), nuxt: g('__NUXT__') || !!document.getElementById('__nuxt'), next: g('__NEXT_DATA__') || !!document.getElementById('__next'), Vue: g('Vue') || !!document.querySelector('[data-v-app],[data-server-rendered]'), React: !!document.querySelector('[data-reactroot]') || g('React'), Shopify: g('Shopify'), Webflow: g('Webflow') || !!document.querySelector('[data-wf-page]'), Alpine: g('Alpine'), jQuery: g('jQuery'), Astro: !!document.querySelector('astro-island,[data-astro-cid],astro-slot') || !!document.querySelector('script[src*="/_astro/"]'), Svelte: !!document.querySelector('[class*="svelte-"]') };
  const scripts = [...document.scripts].map(s => s.src).filter(Boolean).map(s => s.replace(/^https?:\/\//, '').slice(0, 90));
  const scriptHints = {}; for (const s of scripts) for (const k of ['gsap', 'lenis', 'locomotive', 'three', 'barba', 'swup', 'splitting', 'lottie', 'pixi', 'ogl', '_nuxt', '_next', '_astro', 'webflow', 'shopify', 'wp-content', 'cpresources', 'craft', 'sanity', 'prismic', 'contentful', 'storyblok', 'hubspot', 'gtag', 'gtm', 'recaptcha', 'vimeo', 'youtube', 'mux', 'cloudinary', 'imgix', 'plausible', 'fathom']) if (s.toLowerCase().includes(k)) inc(scriptHints, k);
  // ---- stylesheet-derived tokens (same-origin only)
  const css = { rootVars: {}, media: {}, durations: {}, easings: {}, fontFaces: [], keyframes: 0, clampFontSizes: 0, vwFontSizes: 0, sheets: 0, blocked: 0 };
  for (const sh of document.styleSheets) {
    let rules; try { rules = sh.cssRules; css.sheets++; } catch (e) { css.blocked++; continue; }
    const walk = list => { for (const r of list) {
      if (r.type === 1) { if (/(^|,)\s*(:root|html)\s*(,|$)/.test(r.selectorText)) for (const p of r.style) if (p.startsWith('--')) css.rootVars[p] = r.style.getPropertyValue(p).trim().slice(0, 80);
        const td = r.style.transitionDuration, tf = r.style.transitionTimingFunction, ad = r.style.animationDuration;
        if (td && td !== '0s') inc(css.durations, td.split(',')[0].trim()); if (ad && ad !== '0s') inc(css.durations, ad.split(',')[0].trim());
        if (tf && tf !== 'ease') inc(css.easings, tf.split(/,(?![^(]*\))/)[0].trim()); const fs = r.style.fontSize; if (fs && fs.includes('clamp(')) css.clampFontSizes++; if (fs && /\dv[wh]|\dsvw|\ddvw/.test(fs)) css.vwFontSizes++; }
      else if (r.type === 4) { inc(css.media, r.conditionText || r.media.mediaText); walk(r.cssRules); }
      else if (r.type === 5) { css.fontFaces.push((r.style.fontFamily || '').replace(/["']/g, '') + ' ' + (r.style.fontWeight || '') + ' ' + (r.style.fontStyle || '')); }
      else if (r.type === 7) css.keyframes++;
      else if (r.cssRules) walk(r.cssRules); } };
    try { walk(rules); } catch (e) {}
  }
  css.fontFaces = [...new Set(css.fontFaces)].slice(0, 30); css.media = top(css.media, 14); css.durations = top(css.durations, 10); css.easings = top(css.easings, 8);
  const rv = Object.keys(css.rootVars); css.rootVarCount = rv.length; css.rootVarsSample = Object.fromEntries(rv.filter(k => /color|font|space|spacing|gap|ease|duration|radius|grid|container|width|size|scale|lh|line|letter|shadow|z-/i.test(k)).slice(0, 80).map(k => [k, css.rootVars[k]])); delete css.rootVars;
  const perf = performance.getEntriesByType('resource'); const byType = {}; let bytes = 0; for (const r of perf) { const b = r.transferSize || r.encodedBodySize || 0; bytes += b; inc(byType, r.initiatorType, Math.round(b / 1024)); }
  const nav = performance.getEntriesByType('navigation')[0] || {};
  return { title: document.title, lang: document.documentElement.lang, generator: (document.querySelector('meta[name="generator"]') || {}).content || null, description: (document.querySelector('meta[name="description"]') || {}).content || null,
    viewport: [vw, vh], scrollHeight: document.documentElement.scrollHeight, domNodes: all.length, textEls, fonts: [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight + ' ' + f.style))].slice(0, 25),
    fontFamilies: top(fontFam, 6), fontSizes: top(fontSize, 14), weights: top(weights, 6), lineHeights: top(lineHeights, 6), letterSpacing: top(letterSp, 6), uppercaseShare: textEls ? Math.round(uppercaseCount / textEls * 100) : 0,
    maxFontPx: Math.round(maxFontPx), maxFontText: maxFontEl ? maxFontEl.innerText.trim().replace(/\s+/g, ' ').slice(0, 80) : null, maxFontVwRatio: Math.round(maxFontPx / vw * 1000) / 10,
    textColors: top(textColor, 8), backgrounds: top(bgColor, 10), bodyBg: getComputedStyle(document.body).backgroundColor, radii: top(radii, 6), maxWidths: top(maxW, 6), h1, headings: heads.slice(0, 18), bodyParagraphs: bodyP,
    navLinks, buttons: [...new Set(buttons)].slice(0, 15), burger, headerPosition: headerCS ? headerCS.position : null, headerMix: headerCS ? headerCS.mixBlendMode : null, signals, libs, scriptHints, scripts: scripts.slice(0, 25), css,
    perf: { requests: perf.length, kb: Math.round(bytes / 1024), byTypeKB: byType, dcl: Math.round(nav.domContentLoadedEventEnd || 0), load: Math.round(nav.loadEventEnd || 0), ttfb: Math.round(nav.responseStart || 0) } };
};
(async () => {
  const launchOpts = { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required', ...((process.env.DNA_EXTRA_ARGS || '').split(' ').filter(Boolean))] };
  if (process.env.HTTPS_PROXY) launchOpts.proxy = { server: process.env.HTTPS_PROXY };
  const browser = await chromium.launch(launchOpts);
  for (const { label, url } of sites) {
    const t0 = Date.now(); const out = { label, url, capturedAt: new Date().toISOString() };
    for (const vp of ['desktop', 'mobile']) {
      const ctx = await browser.newContext(vp === 'desktop' ? { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, ignoreHTTPSErrors: true, locale: 'en-US' } : { ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true, locale: 'en-US' });
      // retry subresource fetches through Playwright's request layer (transient proxy resets otherwise drop CSS/JS)
      try { await ctx.route('**/*', async route => { const t = route.request().resourceType(); if (!['stylesheet', 'script', 'font', 'image', 'xhr', 'fetch'].includes(t)) return route.continue(); for (let i = 0; i < 3; i++) { try { const r = await route.fetch({ timeout: 30000 }); return await route.fulfill({ response: r }); } catch (e) { await sleep(700 * (i + 1)); } } try { await route.abort(); } catch (e) {} }); } catch (e) {}
      const page = await ctx.newPage(); page.setDefaultTimeout(30000); const errors = [];
      page.on('pageerror', e => errors.push(String(e).slice(0, 120)));
      try {
        await withTimeout((async () => {
          let status = null; try { const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); status = r && r.status(); } catch (e) { errors.push('nav: ' + e.message.slice(0, 100)); }
          await sleep(vp === 'desktop' ? 6000 : 4000);
          const cookie = await acceptCookies(page);
          // close newsletter / promo modals that sit over the hero
          try { const closed = await page.evaluate(() => { const fixedAncestor = el => { let n = el; while (n && n !== document.body) { const p = getComputedStyle(n).position; if (p === 'fixed' || p === 'sticky') return true; n = n.parentElement; } return false; }; const cands = [...document.querySelectorAll('button, a, [role="button"]')].filter(el => { const r = el.getBoundingClientRect(); if (!(r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight)) return false; const t = ((el.getAttribute('aria-label') || '') + ' ' + (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '') + ' ' + (el.innerText || '')).toLowerCase(); return /close|dismiss|×|✕|fermer/.test(t) && !/cookie|menu|nav|burger/.test(t) && fixedAncestor(el); }); if (cands.length) { cands[0].click(); return cands[0].outerHTML.slice(0, 80); } return null; }); if (closed) await sleep(700); } catch (e) {}
          try { await page.keyboard.press('Escape'); } catch (e) {}
          try { await page.waitForFunction(() => !document.querySelector('[class*="preloader"]:not([class*="hidden"]):not([class*="is-done"]):not([class*="is-loaded"])') || true, null, { timeout: 8000 }); } catch (e) {}
          await sleep(1500);
          try { await page.evaluate(() => { try { if (window.lenis && window.lenis.scrollTo) window.lenis.scrollTo(0, { immediate: true }); } catch (e) {} window.scrollTo(0, 0); }); } catch (e) {}
          await sleep(1500);
          await page.screenshot({ path: path.join(OUT, `${label}-${vp}-fold.png`) });
          if (vp === 'desktop') {
            try { await page.evaluate(() => window.scrollTo(0, Math.round(innerHeight * 0.9))); await sleep(1400); await page.screenshot({ path: path.join(OUT, `${label}-desktop-view2.png`) }); await page.evaluate(() => window.scrollTo(0, 0)); await sleep(800); } catch (e) {}
            try { const mb = page.locator('button:has-text("Menu"), a:has-text("Menu"), [class*="burger"], [class*="hamburger"], [class*="menu-toggle"], [class*="nav-toggle"], button[aria-label*="menu" i], [class*="header_toggle"], [class*="c-header_button"]').first(); if (await mb.count() && await mb.isVisible({ timeout: 800 })) { await mb.click({ timeout: 2500, noWaitAfter: true }); await sleep(1800); await page.screenshot({ path: path.join(OUT, `${label}-desktop-menu.png`) }); try { await page.keyboard.press('Escape'); } catch (e) {} await sleep(300); try { if (await mb.isVisible({ timeout: 500 })) await mb.click({ timeout: 1500, noWaitAfter: true }); } catch (e) {} await sleep(800); } } catch (e) {}
          }
          // scroll pass to trigger reveals / lazy loads
          try { await page.evaluate(async () => { const H = () => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); let y = 0, steps = 0; while (y < H() && steps < 70) { y += 700; steps++; window.scrollTo(0, y); await new Promise(r => setTimeout(r, 260)); } await new Promise(r => setTimeout(r, 800)); window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 1000)); }); } catch (e) { errors.push('scroll: ' + e.message.slice(0, 80)); }
          const m = await page.evaluate(METRICS); m.status = status; m.cookieDismissed = cookie; m.errors = errors.slice(0, 6);
          if (vp === 'desktop') { const sig = {}; const origin = new URL(url).origin; const srcs = [...new Set((await page.evaluate(() => [...document.scripts].map(s => s.src).filter(Boolean))))].filter(u => u.startsWith(origin) || /_nuxt|_next|_astro|assets|static|bundle|chunk/.test(u)).slice(0, 10);
            const pats = { gsap: /gsap|greensock/i, ScrollTrigger: /ScrollTrigger/, Lenis: /lenis/i, LocomotiveScroll: /locomotive-scroll|LocomotiveScroll/, three: /three\.module|THREE\.|three\.js|WebGLRenderer/, ogl: /\bogl\b|OGL/, barba: /barba/i, swup: /swup/i, taxi: /@unseenco\/taxi|taxi\.js/i, Splitting: /Splitting/, SplitText: /SplitText/, lottie: /lottie|bodymovin/i, PIXI: /PIXI/, framerMotion: /framer-motion/, alpine: /Alpine/, vue: /Vue|__vue/, react: /React\.createElement|react-dom|__reactFiber/, svelte: /svelte/i, astro: /astro/i, swiper: /Swiper/, splide: /Splide/, embla: /embla/i, matterjs: /Matter\./, glsl: /gl_FragColor|precision (high|medium)p float/, IntersectionObserver: /IntersectionObserver/, reducedMotion: /prefers-reduced-motion/, curtainsjs: /curtains/i, shopify: /Shopify/, modularjs: /modujs|modularJS/i, componentManager: /component-manager|ComponentManager/ };
            for (const u of srcs) { try { const r = await page.request.get(u, { timeout: 20000 }); if (!r.ok()) continue; const t = await r.text(); if (t.length > 6e6) continue; for (const [k, re] of Object.entries(pats)) if (re.test(t)) sig[k] = (sig[k] || 0) + 1; } catch (e) {} }
            m.scriptSignatures = sig; m.scriptsChecked = srcs.length; }
          if (vp === 'desktop') { try { await page.screenshot({ path: path.join(OUT, `${label}-desktop-full.jpg`), fullPage: true, type: 'jpeg', quality: 70 }); } catch (e) { m.fullPageError = e.message.slice(0, 80); } }
          else { try { await page.screenshot({ path: path.join(OUT, `${label}-mobile-full.jpg`), fullPage: true, type: 'jpeg', quality: 65 }); } catch (e) { m.fullPageError = e.message.slice(0, 80); } }
          out[vp] = m;
        })(), 170000, label + ' ' + vp);
      } catch (e) { out[vp] = { error: e.message.slice(0, 160), errors }; }
      try { await Promise.race([(async () => { await page.close(); await ctx.close(); })(), sleep(10000)]); } catch (e) {}
    }
    out.seconds = Math.round((Date.now() - t0) / 1000);
    fs.writeFileSync(path.join(OUT, 'data', label + '.json'), JSON.stringify(out, null, 1));
    const d = out.desktop || {}; log('done', label, out.seconds + 's', 'status', d.status, 'h1', d.h1 ? `${d.h1.size}px ${d.h1.family}` : '-', 'maxFont', d.maxFontPx, 'libs', d.libs ? Object.entries(d.libs).filter(([k, v]) => v).map(([k]) => k).join(',') : '-', 'err', (d.error || (d.errors || []).slice(0, 1).join('') || '').slice(0, 80));
  }
  await Promise.race([browser.close(), sleep(8000)]); log('ALL DONE'); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
