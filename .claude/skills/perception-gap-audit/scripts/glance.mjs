#!/usr/bin/env node
// glance.mjs: capture a screen the way a real viewer glances at it.
//
// For each width it saves three PNG files:
//   <name>-<width>-normal.png   the first screen as rendered (viewport only, no scrolling)
//   <name>-<width>-night.png    the same screen dimmed, lower in contrast, warmer and smaller:
//                               a phone at night, brightness down, seen by someone half tired
//   <name>-<width>-squint.png   the same screen blurred, so only masses, contrast and position remain
//
// Usage:
//   node glance.mjs <url | page.html | image.png> [width ...] [options]
//
// Options:
//   --out <dir>          output folder (default ./glance-out)
//   --name <slug>        file name prefix (default: taken from the URL path or file name)
//   --at <selector>      scroll this element to the top of the viewport before capturing
//   --height <px>        viewport height (default 844 below 700 px wide, 900 otherwise)
//   --wait <ms>          settle time after load and after scrolling (default 1200)
//   --blur <px>          squint blur radius in CSS px (default 6)
//   --night-scale <n>    size of the night version relative to the normal one (default 0.6)
//   --dpr <n>            device pixel ratio of the capture (default 1)
//
// Widths default to 390 and 1440. An image input (a poster, a mock-up export) is scaled to each
// width instead of being loaded in a browser, so the same three views work for graphic design.
//
// Examples:
//   node glance.mjs http://127.0.0.1:4700/ 390 1440 --out /tmp/glance
//   node glance.mjs http://127.0.0.1:4700/parts 390 --at "#form"
//   node glance.mjs exports/poster.png 390 1080
//
// Playwright is loaded from /opt/node22/lib/node_modules/playwright when present, otherwise from a
// normal require('playwright') (next to this script, then from the current folder). Install it with
// "npm i -D playwright && npx playwright install chromium" if neither is found.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// The usage text is the comment block at the top of this file.
const USAGE = (() => {
  const lines = fs.readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1);
  const header = [];
  for (const line of lines) {
    if (!line.startsWith("//")) break;
    header.push(line.replace(/^\/\/ ?/, ""));
  }
  return header.join("\n");
})();

const IMAGE_TYPES = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" };
// Night: contrast first (blacks lift, whites drop), then the brightness cut, then a Night Shift warmth.
const NIGHT_FILTER = "contrast(0.78) brightness(0.55) sepia(0.25)";

function loadPlaywright() {
  const attempts = [
    () => createRequire(import.meta.url)("/opt/node22/lib/node_modules/playwright"),
    () => createRequire(import.meta.url)("playwright"),
    () => createRequire(path.join(process.cwd(), "noop.js"))("playwright"),
  ];
  for (const attempt of attempts) {
    try {
      return attempt();
    } catch {
      // try the next location
    }
  }
  console.error("glance: Playwright was not found. Install it with: npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

function parseArgs(argv) {
  const opts = { widths: [], out: "glance-out", name: "", at: "", height: 0, wait: 1200, blur: 6, nightScale: 0.6, dpr: 1 };
  const valueFlags = { "--out": "out", "--name": "name", "--at": "at", "--height": "height", "--wait": "wait", "--blur": "blur", "--night-scale": "nightScale", "--dpr": "dpr" };
  let target = "";
  for (let i = 0; i < argv.length; i++) {
    let arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      console.log(USAGE);
      process.exit(0);
    }
    let inline = null;
    if (arg.startsWith("--") && arg.includes("=")) {
      inline = arg.slice(arg.indexOf("=") + 1);
      arg = arg.slice(0, arg.indexOf("="));
    }
    if (arg in valueFlags) {
      const value = inline ?? argv[++i];
      if (value === undefined) throw new Error(`${arg} needs a value`);
      const key = valueFlags[arg];
      opts[key] = typeof opts[key] === "number" ? Number(value) : value;
      if (typeof opts[key] === "number" && !Number.isFinite(opts[key])) throw new Error(`${arg} needs a number`);
    } else if (arg.startsWith("--")) {
      throw new Error(`unknown option ${arg}`);
    } else if (!target) {
      target = arg;
    } else {
      for (const part of arg.split(",")) {
        const width = Number(part);
        if (!Number.isInteger(width) || width < 200 || width > 4000) throw new Error(`width "${part}" should be a whole number of CSS px between 200 and 4000`);
        opts.widths.push(width);
      }
    }
  }
  if (!target) {
    console.log(USAGE);
    process.exit(1);
  }
  if (opts.widths.length === 0) opts.widths = [390, 1440];
  if (!(opts.nightScale > 0 && opts.nightScale <= 1)) throw new Error("--night-scale should be above 0 and at most 1");
  return { target, opts };
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function resolveTarget(target) {
  if (/^(https?|file):/i.test(target)) {
    const url = new URL(target);
    const slug = slugify(decodeURIComponent(url.pathname)) || "home";
    return { kind: "page", url: url.href, slug };
  }
  if (!fs.existsSync(target)) throw new Error(`"${target}" is neither a URL nor an existing file`);
  const ext = path.extname(target).toLowerCase();
  const slug = slugify(path.basename(target, ext)) || "file";
  if (IMAGE_TYPES[ext]) return { kind: "image", file: path.resolve(target), mime: IMAGE_TYPES[ext], slug };
  return { kind: "page", url: pathToFileURL(path.resolve(target)).href, slug };
}

async function capturePage(browser, url, width, opts) {
  const isMobile = width < 700;
  const height = opts.height || (isMobile ? 844 : 900);
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: opts.dpr, isMobile, hasTouch: isMobile });
  try {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    await page.evaluate(() => (document.fonts ? document.fonts.ready.then(() => true) : true)).catch(() => {});
    await page.waitForTimeout(opts.wait);
    if (opts.at) {
      const found = await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (!element) return false;
        element.scrollIntoView({ block: "start", behavior: "instant" });
        return true;
      }, opts.at);
      if (!found) console.warn(`glance: no element matches ${opts.at}; capturing the top of the page`);
      await page.waitForTimeout(opts.wait);
    }
    return await page.screenshot({ type: "png" });
  } finally {
    await context.close();
  }
}

// Redraws an image inside Chromium at a given CSS width, through CSS filter functions on a canvas,
// and returns a PNG. For a blur, the edge pixels are first repeated outward (clamp to edge) so the
// blurred screen does not fade into a border.
async function renderVariant(browser, buffer, mime, { width, filter = "none", blur = 0, dpr = 1 }) {
  const page = await browser.newPage();
  try {
    const dataUrl = await page.evaluate(
      async ({ src, width, filter, blur, dpr }) => {
        const image = new Image();
        image.src = src;
        await image.decode();
        const w = Math.max(1, Math.round(width * dpr));
        const h = Math.max(1, Math.round((image.naturalHeight / image.naturalWidth) * width * dpr));
        const pad = Math.ceil(blur * dpr * 3);
        const source = document.createElement("canvas");
        source.width = w + 2 * pad;
        source.height = h + 2 * pad;
        const s = source.getContext("2d");
        s.imageSmoothingQuality = "high";
        s.drawImage(image, pad, pad, w, h);
        if (pad > 0) {
          s.drawImage(source, pad, pad, 1, h, 0, pad, pad, h);
          s.drawImage(source, pad + w - 1, pad, 1, h, pad + w, pad, pad, h);
          s.drawImage(source, 0, pad, w + 2 * pad, 1, 0, 0, w + 2 * pad, pad);
          s.drawImage(source, 0, pad + h - 1, w + 2 * pad, 1, 0, pad + h, w + 2 * pad, pad);
        }
        const output = document.createElement("canvas");
        output.width = w;
        output.height = h;
        const o = output.getContext("2d");
        o.filter = [filter === "none" ? "" : filter, blur > 0 ? `blur(${blur * dpr}px)` : ""].filter(Boolean).join(" ") || "none";
        o.drawImage(source, -pad, -pad);
        return output.toDataURL("image/png");
      },
      { src: `data:${mime};base64,${buffer.toString("base64")}`, width, filter, blur, dpr },
    );
    return Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
  } finally {
    await page.close();
  }
}

async function main() {
  const { target, opts } = parseArgs(process.argv.slice(2));
  const source = resolveTarget(target);
  const name = slugify(opts.name) || source.slug + (opts.at ? `-at-${slugify(opts.at) || "selector"}` : "");
  fs.mkdirSync(opts.out, { recursive: true });

  const { chromium } = loadPlaywright();
  let browser;
  try {
    browser = await chromium.launch({ args: ["--disable-dev-shm-usage"] });
  } catch (error) {
    console.error(`glance: Chromium did not start (${String(error.message || error).split("\n")[0]}). Try: npx playwright install chromium`);
    process.exit(1);
  }

  const written = [];
  try {
    const imageBuffer = source.kind === "image" ? fs.readFileSync(source.file) : null;
    for (const width of opts.widths) {
      let normal;
      if (source.kind === "page") {
        normal = await capturePage(browser, source.url, width, opts);
      } else {
        normal = await renderVariant(browser, imageBuffer, source.mime, { width, dpr: opts.dpr });
      }
      const night = await renderVariant(browser, normal, "image/png", { width: width * opts.nightScale, filter: NIGHT_FILTER, dpr: opts.dpr });
      const squint = await renderVariant(browser, normal, "image/png", { width, blur: opts.blur, dpr: opts.dpr });
      for (const [variant, data] of [["normal", normal], ["night", night], ["squint", squint]]) {
        const file = path.join(opts.out, `${name}-${width}-${variant}.png`);
        fs.writeFileSync(file, data);
        written.push(file);
      }
    }
  } finally {
    await browser.close();
  }

  for (const file of written) console.log(path.resolve(file));
  console.log("\nNext: show ONE of these images to a viewer who has no context (a person, or a fresh subagent) and ask what they notice, in order.");
}

main().catch((error) => {
  console.error(`glance: ${String(error.message || error).split("\n")[0]}`);
  process.exit(1);
});
