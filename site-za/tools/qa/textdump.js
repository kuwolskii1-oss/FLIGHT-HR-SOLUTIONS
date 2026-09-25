// Dumps the visible copy of routes (headings, paragraphs, list items, buttons, links) for proofreading.
const { chromium } = require('playwright'); const fs = require('fs');
const [,, base, outDir, ...routes] = process.argv;
(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1300, height: 900 } });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
    const text = await page.evaluate(() => {
      const out = [];
      const walk = (el) => {
        for (const n of el.children) {
          const tag = n.tagName.toLowerCase();
          if (['script', 'style', 'svg', 'noscript'].includes(tag)) continue;
          if (n.closest('.c-menu')) continue;
          if (/^h[1-6]$/.test(tag)) out.push(`\n${'#'.repeat(+tag[1])} ${n.innerText.trim()}`);
          else if (['p', 'li', 'dt', 'dd', 'blockquote', 'figcaption', 'summary', 'label', 'button', 'legend', 'small', 'address'].includes(tag)) { const t = n.innerText.trim().replace(/\s+\n/g, '\n'); if (t) out.push(`${tag === 'li' ? '- ' : tag === 'button' ? '[btn] ' : tag === 'dt' ? '(dt) ' : tag === 'dd' ? '(dd) ' : tag === 'label' ? '(label) ' : ''}${t}`); }
          else if (tag === 'a' && !n.querySelector('h1,h2,h3,h4,p,li')) { const t = n.innerText.trim(); if (t) out.push(`[link ${n.getAttribute('href')}] ${t}`); }
          else walk(n);
        }
      };
      walk(document.body);
      return out.join('\n');
    });
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_');
    fs.writeFileSync(`${outDir}/${slug}.txt`, text);
    console.log(`${route}: ${text.split('\n').length} lines, ${text.length} chars`);
  }
  await browser.close();
})();
