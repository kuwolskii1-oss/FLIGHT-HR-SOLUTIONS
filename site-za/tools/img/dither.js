// Dithered intro backgrounds: turns each page's intro photograph into a small grid of pale tones,
// the light version of a dot-matrix dither (in the manner of browserbase.com's hero). One PNG per
// page per layout, each pixel one cell; the site scales it up pixel-exact and draws every cell as
// a dot with a CSS mask (src/site/dither.css), so a page downloads a few kilobytes, not a photo.
//
// Tone: the photo's luminance is stretched (2nd to 98th percentile), then mapped so the page stays
// light. Each photograph is art-directed: `invert` draws a lit subject in dots on white (the dark
// hangar and store scenes), otherwise the light parts stay white and the dark parts take the dots
// (the aircraft on their aprons); `strength` caps how dark the darkest dots get and `gamma` above
// 1 thins out the middle tones. Error diffusion
// (Atkinson, which spreads only three quarters of the error, so highlights open up) quantises to
// four tints of the brand navy plus "no dot"; strongly warm light becomes peach. The top rows and
// the outer columns thin out, so the grid never ends on a hard edge.
//
// Output: indexed PNG (4-bit palette, colour 0 transparent), written by hand below (zlib only).
// Usage (repo root): NODE_PATH=/opt/node22/lib/node_modules node site-za/tools/img/dither.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const APP = path.join(__dirname, "../../app");
const SRC = path.join(APP, "public/assets/img");
const OUT = path.join(APP, "public/assets/img/dither");
// Layouts: cells across and down. The site's CSS sizes one cell at 8 px (desktop) and 5 px (phone).
// Desktop: 200 x 140 cells (1600 x 1120 px), the intro's whole background, anchored at its foot.
// Phone: 80 x 66 cells (400 x 330 px), a band at the foot of the intro, under the boarding pass.
const LAYOUTS = { d: { cols: 200, rows: 140 }, m: { cols: 80, rows: 66 } };
// The six intro photographs (src/site/images.ts: DOOR_IMAGES and About's). fx, fy: crop focus.
const IMAGES = [
  { key: "hero-engine-stand", invert: true, strength: 1, fx: 0.42, fy: 0.5 },
  { key: "apron-dusk", invert: false, strength: 0.8, gamma: 1.25, fx: 0.45, fy: 0.55 },
  { key: "parts-store", invert: true, strength: 0.95, fx: 0.5, fy: 0.5 },
  { key: "charter-apron", invert: false, strength: 0.72, gamma: 1.3, fx: 0.42, fy: 0.7 },
  { key: "records-desk", invert: false, strength: 0.78, gamma: 1.3, fx: 0.5, fy: 0.5 },
  { key: "apron-dawn", invert: false, strength: 0.85, gamma: 1.15, fx: 0.55, fy: 0.55 },
];
// Palette index 0 is "no dot" (transparent); 1 to 4 are light to dark navy tints; 5 and 6 peach.
const PALETTE = ["#ffffff", "#e4e9f5", "#ccd4ea", "#b1bcdc", "#929fcb", "#fbdcc0", "#f5c29a"];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

function png(width, height, idx) {
  // 4-bit indexed PNG; each scanline starts with filter byte 0.
  const stride = Math.ceil(width / 2);
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const v = idx[y * width + x];
      raw[y * (stride + 1) + 1 + (x >> 1)] |= x & 1 ? v : v << 4;
    }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 4; // bit depth
  ihdr[9] = 3; // indexed colour
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("PLTE", Buffer.from(PALETTE.flatMap(hex))),
    chunk("tRNS", Buffer.from(PALETTE.map((_, i) => (i === 0 ? 0 : 255)))),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function dither(px, cols, rows, { invert, strength, gamma = 1 }) {
  const n = cols * rows;
  const lum = new Float32Array(n);
  const warm = new Uint8Array(n);
  for (let k = 0; k < n; k++) {
    const r = px[k * 4] / 255, g = px[k * 4 + 1] / 255, b = px[k * 4 + 2] / 255;
    lum[k] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    warm[k] = r > g && g > b && (mx - mn) / (mx + 1e-6) > 0.45 && mx > 0.5 ? 1 : 0;
  }
  const sorted = Array.from(lum).sort((a, b) => a - b);
  const lo = sorted[Math.floor(n * 0.02)], hi = sorted[Math.floor(n * 0.98)];
  const levels = 4;
  const v = new Float32Array(n);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const k = y * cols + x;
      let t = Math.min(1, Math.max(0, (lum[k] - lo) / (hi - lo + 1e-6)));
      t = Math.pow(t, 0.9);
      let dark = Math.pow(invert ? t : 1 - t, gamma) * strength;
      // Thin out towards the top rows and the outer columns, so the grid has no hard edge.
      const top = Math.min(1, y / (rows * 0.22));
      const side = Math.min(1, Math.min(x, cols - 1 - x) / (cols * 0.1));
      const s = (e) => e * e * (3 - 2 * e);
      dark *= s(top) * s(side);
      v[k] = dark * levels;
    }
  }
  const idx = new Uint8Array(n);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const k = y * cols + x;
      const q = Math.min(levels, Math.max(0, Math.round(v[k])));
      const e = (v[k] - q) / 8;
      for (const [dx, dy] of [[1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]]) {
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && xx < cols && yy < rows) v[yy * cols + xx] += e;
      }
      idx[k] = q === 0 ? 0 : warm[k] && q >= 2 ? (q >= 3 ? 6 : 5) : q;
    }
  }
  return idx;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const im of IMAGES) {
    const file = path.join(SRC, `${im.key}-1800.webp`);
    await page.setContent(`<img id="i" src="data:image/webp;base64,${fs.readFileSync(file).toString("base64")}">`);
    await page.waitForFunction(() => document.getElementById("i").complete);
    for (const [name, { cols, rows }] of Object.entries(LAYOUTS)) {
      // Cover-fit the photograph into the grid around the focus, averaging down in two steps.
      const px = await page.evaluate(([cols, rows, fx, fy]) => {
        const i = document.getElementById("i");
        const s = Math.max(cols / i.naturalWidth, rows / i.naturalHeight);
        const sw = cols / s, sh = rows / s;
        const sx = (i.naturalWidth - sw) * fx, sy = (i.naturalHeight - sh) * fy;
        const m = document.createElement("canvas");
        m.width = cols * 4;
        m.height = rows * 4;
        const mx = m.getContext("2d");
        mx.imageSmoothingQuality = "high";
        mx.drawImage(i, sx, sy, sw, sh, 0, 0, m.width, m.height);
        const c = document.createElement("canvas");
        c.width = cols;
        c.height = rows;
        const x = c.getContext("2d");
        x.imageSmoothingQuality = "high";
        x.drawImage(m, 0, 0, cols, rows);
        return Array.from(x.getImageData(0, 0, cols, rows).data);
      }, [cols, rows, im.fx, im.fy]);
      const idx = dither(px, cols, rows, im);
      const buf = png(cols, rows, idx);
      const out = path.join(OUT, `${im.key}-${name}.png`);
      fs.writeFileSync(out, buf);
      console.log(`${path.relative(APP, out)}  ${cols}x${rows}  ${buf.length} bytes${im.invert ? "  (inverted)" : ""}`);
    }
  }
  await browser.close();
})();
