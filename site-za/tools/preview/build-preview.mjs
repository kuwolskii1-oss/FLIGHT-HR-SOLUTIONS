// Builds a single-file, no-login preview of the ZA site from the production build.
//
// The live host asks anonymous visitors to sign in, so the client cannot open the beta from a
// link. This script fetches the server-rendered HTML of every route from a local copy of the
// production build (tools/qa/serve-dist.mjs), keeps one header and footer, stacks the eleven
// <main> elements in one document (one visible at a time, chosen by the URL hash), inlines the
// built stylesheet and the scroll engine, and ports the small amount of client behaviour
// (header, menu, accordions, segmented controls, form validation, the ident) to plain script.
// Nothing is sent from the preview's forms.
//
// Usage: node build-preview.mjs [base-url] [out-dir]
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.resolve(here, "../../app");
const base = process.argv[2] || "http://127.0.0.1:4700";
const out = path.resolve(process.argv[3] || path.join(here, "out"));

const PAGES = [
  { slug: "home", route: "/" },
  { slug: "engines", route: "/engines" },
  { slug: "engine-360", route: "/engines/engine-360" },
  { slug: "aircraft", route: "/aircraft" },
  { slug: "parts", route: "/parts" },
  { slug: "charter", route: "/charter" },
  { slug: "advisory", route: "/advisory" },
  { slug: "about", route: "/about" },
  { slug: "contact", route: "/contact" },
  { slug: "privacy", route: "/privacy" },
  { slug: "legal", route: "/legal" },
];
const ROUTE_TO_SLUG = Object.fromEntries(PAGES.map((p) => [p.route, p.slug]));
const INBOX = {
  engines: "engines@flighthoursolution.com",
  "engine-360": "engines@flighthoursolution.com",
  aircraft: "aircraft@flighthoursolution.com",
  parts: "parts@flighthoursolution.com",
  charter: "charter@flighthoursolution.com",
  advisory: "advisory@flighthoursolution.com",
  contact: "hello@flighthoursolution.com",
};

const identPaths = JSON.parse(fs.readFileSync(path.join(app, "src/site/ident-paths.json"), "utf8"));
const charter = JSON.parse(fs.readFileSync(path.join(app, "src/content/charter.json"), "utf8"));

// ---- fetch ---------------------------------------------------------------------------------
async function fetchHtml(route) {
  const res = await fetch(base + route, { headers: { "accept-encoding": "identity" } });
  if (!res.ok) throw new Error(`${route}: ${res.status}`);
  return res.text();
}

// ---- transform (runs inside Chromium so we get a real HTML parser and serializer) ----------
const transform = ({ html, slug, routeToSlug, wantChrome }) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const title = doc.querySelector("title")?.textContent || "";
  const description = doc.querySelector('meta[name="description"]')?.getAttribute("content") || "";

  const rewriteHref = (href) => {
    if (!href) return href;
    if (href === "#main") return "#main";
    if (href.startsWith("#")) return `#${slug}.${href.slice(1)}`;
    if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
    if (href.startsWith("/")) {
      const [p, h] = href.split("#");
      const pathKey = p.replace(/\/$/, "") || "/";
      const target = routeToSlug[pathKey];
      if (!target) return href;
      return h ? `#${target}.${h}` : `#${target}`;
    }
    return href;
  };
  const rewriteAsset = (v) => v.replace(/^\/(assets|brand|fonts)\//, "$1/");
  const rewriteSrcset = (v) => v.split(",").map((part) => part.trim().replace(/^\/(assets|brand|fonts)\//, "$1/")).join(", ");

  const prefixIds = (root, prefix) => {
    const ids = new Set();
    root.querySelectorAll("[id]").forEach((el) => {
      ids.add(el.id);
      el.id = `${prefix}.${el.id}`;
    });
    if (root.id) { ids.add(root.id); root.id = `${prefix}.${root.id}`; }
    const listAttrs = ["aria-labelledby", "aria-describedby", "aria-controls", "aria-owns"];
    root.querySelectorAll("[for],[aria-labelledby],[aria-describedby],[aria-controls],[aria-owns],[clip-path],[mask],[fill],[stroke],[filter]").forEach((el) => {
      const f = el.getAttribute("for");
      if (f && ids.has(f)) el.setAttribute("for", `${prefix}.${f}`);
      for (const a of listAttrs) {
        const v = el.getAttribute(a);
        if (!v) continue;
        el.setAttribute(a, v.split(/\s+/).map((t) => (ids.has(t) ? `${prefix}.${t}` : t)).join(" "));
      }
      for (const a of ["clip-path", "mask", "fill", "stroke", "filter"]) {
        const v = el.getAttribute(a);
        if (!v) continue;
        const m = v.match(/^url\(#([^)]+)\)$/);
        if (m && ids.has(m[1])) el.setAttribute(a, `url(#${prefix}.${m[1]})`);
      }
    });
    // aria-labelledby on the root itself
    for (const a of listAttrs) {
      const v = root.getAttribute(a);
      if (v) root.setAttribute(a, v.split(/\s+/).map((t) => (ids.has(t) ? `${prefix}.${t}` : t)).join(" "));
    }
  };

  const clean = (root) => {
    root.querySelectorAll("script, noscript, template").forEach((el) => el.remove());
    root.querySelectorAll("[href]").forEach((el) => el.setAttribute("href", rewriteHref(el.getAttribute("href"))));
    root.querySelectorAll("[src]").forEach((el) => el.setAttribute("src", rewriteAsset(el.getAttribute("src"))));
    root.querySelectorAll("[srcset], [srcSet]").forEach((el) => {
      const v = el.getAttribute("srcset");
      if (v) el.setAttribute("srcset", rewriteSrcset(v));
    });
    root.querySelectorAll("[style]").forEach((el) => {
      const s = el.getAttribute("style");
      if (s && s.includes("url(")) el.setAttribute("style", s.replace(/url\((['"]?)\/(assets|brand|fonts)\//g, "url($1$2/"));
    });
  };

  const main = doc.querySelector("main");
  if (!main) throw new Error(`${slug}: no <main>`);
  clean(main);
  prefixIds(main, slug);
  main.setAttribute("data-page", slug);
  main.setAttribute("hidden", "");

  let chrome = null;
  if (wantChrome) {
    const header = doc.querySelector("header.c-header");
    const menu = doc.querySelector(".c-menu");
    const footer = doc.querySelector("footer");
    const skip = doc.querySelector("a.c-skip");
    const wrap = doc.createElement("div");
    for (const el of [header, menu]) {
      clean(el);
      el.querySelectorAll("[aria-current]").forEach((a) => a.removeAttribute("aria-current"));
      el.querySelectorAll(".is-active").forEach((a) => a.classList.remove("is-active"));
      prefixIds(el, "site");
    }
    clean(footer);
    footer.querySelectorAll("[aria-current]").forEach((a) => a.removeAttribute("aria-current"));
    prefixIds(footer, "site");
    chrome = { skip: skip.outerHTML, header: header.outerHTML, menu: menu.outerHTML, footer: footer.outerHTML };
  }
  return { title, description, main: main.outerHTML, chrome };
};

// ---- build ----------------------------------------------------------------------------------
const browser = await chromium.launch();
const page = await browser.newPage({ javaScriptEnabled: true });
await page.setContent("<!doctype html><title>x</title>");
const pages = [];
let chrome = null;
for (const p of PAGES) {
  const html = await fetchHtml(p.route);
  const r = await page.evaluate(transform, { html, slug: p.slug, routeToSlug: ROUTE_TO_SLUG, wantChrome: p.slug === "home" });
  if (r.chrome) chrome = r.chrome;
  pages.push({ ...p, ...r });
  console.log(`${p.route} -> ${p.slug} (${(r.main.length / 1024).toFixed(0)} KB)`);
}
await browser.close();

// The conditional charter field is rendered only once "Cargo" is chosen, so it is absent from
// the server markup. Add it hidden, after the field it depends on, and let the runtime show it.
const cargo = charter.form.fields.find((f) => f.showWhen);
if (cargo) {
  const formId = charter.form.id;
  const fid = `charter.${formId}-${cargo.name}`;
  const block =
    `<div class="c-field t-input-wrap c-field--conditional" data-field="${cargo.name}" data-show-when="${cargo.showWhen.field}" data-show-equals="${cargo.showWhen.equals}" hidden>` +
    `<label class="c-field__label" for="${fid}">${cargo.label} ${cargo.required ? "" : "<small>(optional)</small>"}</label>` +
    `<textarea class="c-field__textarea t-input" rows="4" id="${fid}" name="${cargo.name}" aria-describedby="${fid}-hint" placeholder=""></textarea>` +
    (cargo.hint ? `<p class="c-field__hint" id="${fid}-hint">${cargo.hint}</p>` : "") +
    `<p class="c-field__error t-error-msg" id="${fid}-error" aria-live="polite"></p></div>`;
  const ch = pages.find((p) => p.slug === "charter");
  const anchor = new RegExp(`(<div class="c-field[^"]*" data-field="${cargo.showWhen.field}">[\\s\\S]*?<p class="c-field__error[^>]*>[^<]*</p></div>)`);
  if (!anchor.test(ch.main)) throw new Error("charter: could not place the conditional field");
  ch.main = ch.main.replace(anchor, `$1${block}`);
  const wrapClass = cargo.width === "half" ? " c-field--half" : "";
  ch.main = ch.main.replace('class="c-field t-input-wrap c-field--conditional"', `class="c-field t-input-wrap${wrapClass} c-field--conditional"`);
}

// Stylesheet: the production bundle, with root-relative asset urls made relative.
const cssFile = fs.readdirSync(path.join(app, "dist/client/assets")).find((f) => /^styles-.*\.css$/.test(f));
let css = fs.readFileSync(path.join(app, "dist/client/assets", cssFile), "utf8");
css = css.replace(/url\((['"]?)\/(assets|brand|fonts)\//g, "url($1$2/");
const fontFiles = new Set();
for (const m of css.matchAll(/url\((['"]?)((?:assets|fonts)\/[^)'"]+\.woff2)/g)) fontFiles.add(m[2]);

const engine = fs.readFileSync(path.join(app, "src/vendor/scrollcraft/scrollcraft.js"), "utf8");
const runtime = fs.readFileSync(path.join(here, "runtime.js"), "utf8");
const previewCss = fs.readFileSync(path.join(here, "preview.css"), "utf8");

const config = {
  pages: pages.map((p) => ({ slug: p.slug, title: p.title })),
  inbox: INBOX,
  identEnd: identPaths.end,
};

const doc = [
  `<title>Flight Hour Solution ZA</title>`,
  `<style>${css}\n${previewCss}</style>`,
  chrome.skip,
  chrome.header,
  chrome.menu,
  ...pages.map((p) => p.main),
  chrome.footer,
  `<script id="preview-config" type="application/json">${JSON.stringify(config).replace(/</g, "\\u003c")}</script>`,
  `<script>${engine}</script>`,
  `<script>${runtime}</script>`,
].join("\n");

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "index.html"), doc);

// Supporting files: fonts referenced by the stylesheet, brand marks, images used by the pages.
const copy = (rel, from) => {
  const dest = path.join(out, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(from, dest);
};
for (const f of fontFiles) {
  const from = f.startsWith("fonts/") ? path.join(app, "public", f) : path.join(app, "dist/client", f);
  if (fs.existsSync(from)) copy(f, from);
  else console.warn("missing font", f);
}
const used = new Set();
for (const m of doc.matchAll(/(?:src|srcset|href)="([^"]*)"/g)) {
  for (const part of m[1].split(",")) {
    const u = part.trim().split(/\s+/)[0];
    if (/^(assets\/img|brand)\//.test(u)) used.add(u);
  }
}
for (const u of used) {
  const from = path.join(app, "public", u);
  if (fs.existsSync(from)) copy(u, from);
  else console.warn("missing asset", u);
}
const files = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else files.push(p); } };
walk(out);
const total = files.reduce((s, f) => s + fs.statSync(f).size, 0);
console.log(`index.html ${(doc.length / 1024).toFixed(0)} KB; ${files.length} files, ${(total / 1024 / 1024).toFixed(2)} MB total -> ${out}`);
fs.writeFileSync(path.join(out, "..", "files.json"), JSON.stringify(files.filter((f) => !f.endsWith("index.html")).map((f) => path.relative(out, f)), null, 0));
