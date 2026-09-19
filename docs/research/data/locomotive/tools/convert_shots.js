// Convert PNG/JPEG screenshots to reduced JPEGs with headless Chromium (no PIL/ImageMagick available).
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const [,, listFile, outDir] = process.argv;
const jobs = fs.readFileSync(listFile, 'utf8').split('\n').filter(Boolean).map(l => { const [src, dst, maxW, q] = l.split('\t'); return { src, dst, maxW: +maxW, q: +q }; });
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  for (const j of jobs) {
    try {
      const b64 = fs.readFileSync(j.src).toString('base64');
      const mime = j.src.endsWith('.png') ? 'image/png' : 'image/jpeg';
      const out = await page.evaluate(async ({ b64, mime, maxW, q }) => {
        const img = new Image();
        img.src = `data:${mime};base64,${b64}`;
        await img.decode();
        const scale = Math.min(1, maxW / img.naturalWidth);
        const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        return { data: c.toDataURL('image/jpeg', q).split(',')[1], w, h };
      }, { b64, mime: mime, maxW: j.maxW, q: j.q });
      fs.mkdirSync(path.dirname(j.dst), { recursive: true });
      fs.writeFileSync(j.dst, Buffer.from(out.data, 'base64'));
      console.log('ok', path.basename(j.dst), out.w + 'x' + out.h, fs.statSync(j.dst).size);
    } catch (e) { console.log('FAIL', j.src, String(e).slice(0, 120)); }
  }
  await browser.close();
})();
