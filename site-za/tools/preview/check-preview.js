// Walks the built preview the way a visitor would, inside a stand-in for the artifact host's
// page skeleton. Usage: node check-preview.js [shots-dir]
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const out = path.join(__dirname, "out");
const shots = process.argv[2] || path.join(__dirname, "shots");
fs.mkdirSync(shots, { recursive: true });
const PORT = 4711;
const MIME = { html: "text/html", css: "text/css", js: "text/javascript", webp: "image/webp", svg: "image/svg+xml", woff2: "font/woff2", png: "image/png", json: "application/json" };
const skeleton = (content) =>
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif;background:#f6f6f4}img{max-width:100%}[hidden]{display:none!important}</style></head><body>${content}</body></html>`;
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/" || p === "/index.html") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    return res.end(skeleton(fs.readFileSync(path.join(out, "index.html"), "utf8")));
  }
  const file = path.join(out, p);
  if (!file.startsWith(out) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end("nf"); }
  res.writeHead(200, { "content-type": MIME[path.extname(file).slice(1)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

const fails = [];
const notes = [];
const check = (name, ok, detail) => { (ok ? notes : fails).push(`${ok ? "ok  " : "FAIL"} ${name}${detail !== undefined ? ` (${JSON.stringify(detail)})` : ""}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const base = `http://127.0.0.1:${PORT}/`;

const visible = (page) => page.evaluate(() => (document.querySelector("main:not([hidden])") || {}).dataset?.page || null);
const topOf = (page, id) => page.evaluate((id) => { const el = document.getElementById(id); return el ? Math.round(el.getBoundingClientRect().top) : null; }, id);
const consoleTap = (page, bucket) => {
  page.on("console", (m) => { if (m.type() === "error") bucket.push(`console: ${m.text()}`); });
  page.on("pageerror", (e) => bucket.push(`pageerror: ${e.message}`));
  page.on("requestfailed", (r) => bucket.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
  page.on("response", (r) => { if (r.status() >= 400) bucket.push(`http ${r.status()}: ${r.url()}`); });
};
const ready = async (page) => { await page.waitForSelector("html.sc-ready", { timeout: 15000 }); await page.waitForLoadState("networkidle"); };

(async () => {
  await new Promise((r) => server.listen(PORT, "127.0.0.1", r));
  const browser = await chromium.launch();

  // ---- desktop ----
  try {
    const errs = [];
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    consoleTap(page, errs);
    await page.goto(base);
    await ready(page);
    check("home visible on load", (await visible(page)) === "home");
    const theme0 = await page.evaluate(() => ({ header: document.querySelector(".c-header").dataset.theme, util: !!document.querySelector(".c-util") && getComputedStyle(document.querySelector(".c-util")).display !== "none" }));
    check("header light, with its utility strip on desktop", theme0.header === "light" && theme0.util, theme0);
    check("document title set", (await page.title()).includes("Flight Hour Solution"));
    check("html.site applied", await page.evaluate(() => document.documentElement.classList.contains("site")));
    check("no horizontal overflow (1440)", await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    const broken = await page.evaluate(() => Array.from(document.images).filter((i) => i.offsetParent !== null && i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src")));
    check("no broken visible images", broken.length === 0, broken);
    const fontsOk = await page.evaluate(async () => { await document.fonts.ready; const l = Array.from(document.fonts).filter((f) => f.status === "loaded").map((f) => f.family + " " + f.weight); return { sans: l.includes("IBM Plex Sans 400"), display: l.includes("Jost 500"), body: getComputedStyle(document.body).fontFamily.startsWith('"IBM Plex Sans"') }; });
    check("brand fonts loaded", fontsOk.sans && fontsOk.display && fontsOk.body, fontsOk);
    await page.screenshot({ path: path.join(shots, "desktop-home-top.png") });
    const photo = () => page.evaluate(() => { const i = document.querySelector("main:not([hidden]) .c-sky__plane"); const sky = document.querySelector("main:not([hidden]) .c-sky__photo"); return i && sky ? { t: getComputedStyle(i).transform, loaded: i.complete && i.naturalWidth > 0 && sky.complete && sky.naturalWidth > 0 } : null; });
    const p0 = await photo();
    check("hero sky and aircraft cut-out loaded", !!p0 && p0.loaded, p0);
    const layers = await page.evaluate(() => [".c-sky__photo", ".c-sky__plane"].map((c) => (document.querySelector("main:not([hidden]) " + c).currentSrc || "").split("/").pop()));
    check("hero sky is its own plate, the aircraft its own layer", /^hero-sunset-/.test(layers[0]) && /^hero-jet-/.test(layers[1]), layers);
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.5));
    await sleep(700);
    const p1 = await photo();
    check("aircraft lifts out of its capsule with scroll", !!p1 && p1.t !== p0.t, { p0: p0 && p0.t, p1: p1 && p1.t });
    const panel = await page.evaluate(() => { const st = document.querySelector("main:not([hidden]) .c-sky__photo"); const f = document.querySelectorAll("main:not([hidden]) .c-sky__fact").length; return { capsule: !!st && getComputedStyle(st).clipPath.includes("inset"), facts: f }; });
    check("hero capsule and two fact fields", panel.capsule && panel.facts === 2, panel);
    await sleep(1600);
    const reels = await page.evaluate(() => [...document.querySelectorAll("main:not([hidden]) .c-reel")].map((r) => ({ value: r.querySelector(".u-visually-hidden").textContent, reels: r.querySelectorAll(".c-reel__strip").length, landed: r.querySelectorAll(".c-reel__strip.is-landed").length, blurLeft: r.querySelectorAll('.c-reel__strip[style*="filter: url"]').length })));
    check("fact reels turn and land on the true numbers", reels.length === 2 && reels.every((r) => r.reels > 0 && r.landed === r.reels && r.blurLeft === 0), reels);
    await page.screenshot({ path: path.join(shots, "desktop-home-scrolled.png") });
    // How we work: the stairs. All five names on screen from the start; the line walks down them,
    // lighting each step and showing its words, with the orange dot where it is; it ends at the link.
    const stairs = async (p) => {
      await page.evaluate((p) => { const s = document.getElementById("home.how"); const top = s.getBoundingClientRect().top + scrollY; window.scrollTo({ top: top + p * (s.offsetHeight - innerHeight), behavior: "instant" }); }, p);
      await sleep(300);
      return page.evaluate(() => {
        const s = document.getElementById("home.how");
        const li = [...s.querySelectorAll(".c-stair")];
        const tip = li.map((l) => +getComputedStyle(l.querySelector(".c-stair__tip")).opacity);
        const onScreen = li.filter((l) => { const r = l.querySelector(".c-stair__title").getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && +getComputedStyle(l.querySelector(".c-stair__title")).opacity === 1; }).length;
        const t = li[li.length - 1].querySelector(".c-stair__tip").getBoundingClientRect();
        const c = s.querySelector(".c-stairs__cta").getBoundingClientRect();
        return { act: s.getAttribute("data-sc-act"), names: onScreen, lit: li.filter((l) => +getComputedStyle(l.querySelector(".c-stair__text")).opacity > 0.5).length, here: tip.findIndex((o) => o > 0.5) + 1, tips: tip.filter((o) => o > 0.5).length, digits: /\d/.test(s.querySelector(".c-stairs__list").textContent), end: { dx: Math.round(c.right - (t.left + t.width / 2)), dy: Math.round(c.top - t.bottom) } };
      });
    };
    const f0 = await stairs(0.05);
    const f1 = await stairs(0.55);
    await page.screenshot({ path: path.join(shots, "desktop-stairs.png") });
    const f2 = await stairs(0.95);
    check("how we work: pinned, every step name on screen from the start", f0.act === "pin" && f0.names === 5, f0);
    check("how we work: the line lights the steps in order, one dot where it is", f0.lit === 1 && f0.here === 1 && f1.lit === 4 && f1.here === 4 && f2.lit === 5 && f2.here === 5 && [f0, f1, f2].every((f) => f.tips === 1), { f0, f1, f2 });
    check("how we work: the line ends at the link, no numbers", Math.abs(f2.end.dx) < 24 && f2.end.dy >= 0 && f2.end.dy < 60 && !f2.digits, f2);
    // Engine 360: the lens rests on the fan; over the card, the lens follows the pointer and the label
    // grows beside the cursor; off the card, the label goes and the lens returns to the fan.
    await page.evaluate(() => { const s = document.getElementById("home.engine-360"); window.scrollTo({ top: s.getBoundingClientRect().top + scrollY - (innerHeight - s.offsetHeight) / 2, behavior: "instant" }); });
    await page.mouse.move(2, 2);
    await sleep(700);
    const e360 = () => page.evaluate(() => {
      const art = document.querySelector('main[data-page="home"] .c-e360__art'), card = art.parentElement, r = art.getBoundingClientRect();
      const m = (el) => { const t = new DOMMatrix(getComputedStyle(el).transform); return [Math.round(t.m41), Math.round(t.m42)]; };
      const lit = card.querySelector(".c-e360__drawing--lit");
      const c = card.getBoundingClientRect();
      return { art: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], card: [Math.round(c.left), Math.round(c.top), Math.round(c.right), Math.round(c.bottom)], lens: m(card.querySelector(".c-e360__lens")), tag: m(card.querySelector(".c-peek")), peek: card.classList.contains("is-peeking"), pill: +getComputedStyle(card.querySelector(".c-peek__pill")).opacity, filter: getComputedStyle(lit).filter, filterEl: !!document.getElementById("home.e360-lit"), loaded: lit.complete && lit.naturalWidth > 0 };
    });
    const e0 = await e360();
    const near = (a, b, tol) => Math.abs(a[0] - b[0]) <= tol && Math.abs(a[1] - b[1]) <= tol;
    check("engine 360: the drawing loads and the lens rests on the fan, lit orange", e0.loaded && !e0.peek && e0.pill === 0 && near(e0.lens, [e0.art[2] * 0.19, e0.art[3] * 0.5], 3) && /home\.e360-lit/.test(e0.filter) && e0.filterEl, e0);
    const at = [e0.art[0] + e0.art[2] * 0.45, e0.art[1] + e0.art[3] * 0.4].map(Math.round);
    await page.mouse.move(at[0], at[1], { steps: 8 });
    await sleep(700);
    const e1 = await e360();
    await page.screenshot({ path: path.join(shots, "desktop-e360-hover.png") });
    check("engine 360: over the card, the label grows beside the cursor and the lens follows", e1.peek && e1.pill === 1 && near(e1.tag, [at[0] + 16, at[1] + 20], 3) && near(e1.lens, [at[0] - e1.art[0], at[1] - e1.art[1]], 4), { at, e1 });
    await page.mouse.move(at[0], e1.card[1] - 30, { steps: 6 });
    await sleep(700);
    const e2 = await e360();
    check("engine 360: off the card the label goes and the lens returns to the fan", !e2.peek && e2.pill === 0 && near(e2.lens, [e2.art[2] * 0.19, e2.art[3] * 0.5], 3), e2);
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(400);

    // header navigation
    await page.click('.c-header a.c-navlink[href="#engines"]');
    await page.waitForSelector('main[data-page="engines"]:not([hidden])');
    await sleep(600);
    check("nav click shows engines", (await visible(page)) === "engines");
    check("hash is #engines", await page.evaluate(() => location.hash), "#engines");
    check("scrolled to top on page change", (await page.evaluate(() => window.scrollY)) < 4);
    const cur = await page.evaluate(() => ({ engines: document.querySelector('.c-header a.c-navlink[href="#engines"]').getAttribute("aria-current"), logo: document.querySelector(".c-header__logo").getAttribute("aria-current"), active: document.querySelector('.c-header a.c-navlink[href="#engines"]').classList.contains("is-active") }));
    check("aria-current on engines link", cur.engines === "page" && cur.active, cur);
    check("home logo not current", cur.logo === null, cur);
    check("title follows page", (await page.title()).startsWith("Engine management"));
    await page.screenshot({ path: path.join(shots, "desktop-engines-top.png") });

    // dropdown → section on the same page
    await page.hover('.c-navgroup[data-group="/engines"]');
    await sleep(250);
    check("dropdown opens on hover", await page.evaluate(() => !!document.querySelector(".t-dropdown.is-open")));
    await page.click('.c-navgroup[data-group="/engines"] a[href="#engines.status"]');
    await sleep(700);
    const statusTop = await topOf(page, "engines.status");
    check("same-page section link scrolls", statusTop !== null && statusTop >= -2 && statusTop < 220, statusTop);
    check("dropdown closed after click", await page.evaluate(() => !document.querySelector(".t-dropdown.is-open")));

    // cross-page section link from the dropdown
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(400);
    await page.hover('.c-navgroup[data-group="/parts"]');
    await sleep(250);
    await page.click('.c-navgroup[data-group="/parts"] a[href="#parts.verify"]');
    await page.waitForSelector('main[data-page="parts"]:not([hidden])');
    await sleep(700);
    const verifyTop = await topOf(page, "parts.verify");
    check("cross-page section link lands on section", verifyTop !== null && verifyTop >= -2 && verifyTop < 220, verifyTop);

    // history
    await page.goBack();
    await sleep(600);
    check("back returns to engines", (await visible(page)) === "engines", await page.evaluate(() => location.hash));
    await page.goBack(); await page.goBack();
    await sleep(600);
    check("back to home", (await visible(page)) === "home", await page.evaluate(() => location.hash));

    // deep link (fresh load, not a same-document hash change)
    await page.goto("about:blank");
    await page.goto(base + "#parts.form");
    await ready(page);
    await sleep(500);
    check("deep link shows parts", (await visible(page)) === "parts");
    const formTop = await topOf(page, "parts.form");
    check("deep link scrolls to form", formTop !== null && formTop >= -2 && formTop < 260, formTop);

    // form validation
    await page.click('main[data-page="parts"] form.c-form button[type="submit"]');
    await sleep(300);
    const v = await page.evaluate(() => {
      const form = document.querySelector('main[data-page="parts"] form.c-form');
      const errs = Array.from(form.querySelectorAll(".c-field.is-error"));
      return { count: errs.length, firstMsg: errs[0]?.querySelector(".c-field__error")?.textContent, focusInside: form.contains(document.activeElement), status: !!form.querySelector(".c-form__status") };
    });
    check("empty submit shows errors", v.count > 0 && !!v.firstMsg && v.focusInside && !v.status, v);
    await page.screenshot({ path: path.join(shots, "desktop-parts-form-errors.png") });
    const sent = await page.evaluate(() => {
      const form = document.querySelector('main[data-page="parts"] form.c-form');
      form.querySelectorAll(".c-field[data-field]").forEach((wrap) => {
        if (wrap.hidden) return;
        const seg = wrap.querySelector(".c-segmented");
        if (seg) { seg.querySelector("input").click(); return; }
        const c = wrap.querySelector("input, select, textarea");
        if (!c) return;
        if (c.type === "checkbox") { if (!c.checked) c.click(); return; }
        if (c.tagName === "SELECT") { c.selectedIndex = 1; return; }
        c.value = c.type === "email" ? "preview@example.com" : c.type === "tel" ? "+27 11 000 0000" : c.type === "number" ? "2" : "Preview test";
      });
      form.querySelector('button[type="submit"]').click();
      return { errors: form.querySelectorAll(".c-field.is-error").length, left: Array.from(form.querySelectorAll(".c-field.is-error")).map((w) => w.dataset.field), status: form.querySelector(".c-form__status")?.textContent || "" };
    });
    check("valid submit shows preview note", sent.errors === 0 && /preview/i.test(sent.status) && /parts@/.test(sent.status), sent);

    // conditional charter field
    await page.goto(base + "#charter.form");
    await page.waitForSelector('main[data-page="charter"]:not([hidden])');
    await sleep(400);
    const cond = await page.evaluate(() => {
      const form = document.querySelector('main[data-page="charter"] form.c-form');
      const wrap = form.querySelector("[data-show-when]");
      const before = wrap.hidden;
      const cargo = Array.from(form.elements.load).find((r) => r.value === "Cargo");
      cargo.click();
      const afterCargo = wrap.hidden;
      const other = Array.from(form.elements.load).find((r) => r.value !== "Cargo");
      other.click();
      const afterOther = wrap.hidden;
      const pill = other.closest(".c-segmented").querySelector(".t-tabs-pill").style.width;
      return { before, afterCargo, afterOther, pill };
    });
    check("charter cargo field toggles", cond.before === true && cond.afterCargo === false && cond.afterOther === true, cond);
    check("segmented pill sized", parseFloat(cond.pill) > 20, cond.pill);

    // skip link
    await page.goto(base);
    await ready(page);
    await page.keyboard.press("Tab");
    check("first tab reaches skip link", await page.evaluate(() => document.activeElement.classList.contains("c-skip")));
    await page.keyboard.press("Enter");
    await sleep(200);
    check("skip link focuses main", await page.evaluate(() => document.activeElement === document.querySelector("main:not([hidden])")));

    // accordions on a door page
    const accPage = await page.evaluate(() => { const b = document.querySelector(".c-acc__button"); return b ? b.closest("main[data-page]").dataset.page : null; });
    if (accPage) {
      await page.goto(base + "#" + accPage);
      await page.waitForSelector(`main[data-page="${accPage}"]:not([hidden])`);
      await sleep(300);
    }
    const acc = !accPage ? null : await page.evaluate(() => {
      const btn = document.querySelector('main:not([hidden]) .c-acc__button');
      if (!btn) return null;
      btn.click();
      const a = btn.closest(".t-acc");
      return { open: a.dataset.open, expanded: btn.getAttribute("aria-expanded") };
    });
    if (accPage) check("page accordion opens", acc !== null && acc.open === "true" && acc.expanded === "true", { accPage, acc });
    else notes.push("skip page accordion (none in the markup)");

    // door board: the kinetic hover, and the footer curtain at the bottom of the page
    await page.goto(base);
    await ready(page);
    await page.evaluate(() => document.querySelector(".c-board").scrollIntoView({ block: "center" }));
    await sleep(1400); // let the rows' entry reveal finish before pointing at one
    await page.hover(".c-board__item:nth-child(2)");
    await sleep(700);
    const board = await page.evaluate(() => {
      const item = document.querySelector(".c-board__item:nth-child(2)");
      const fill = item.querySelector(".c-board__fill").getBoundingClientRect();
      return { kinetic: document.querySelector(".c-board").classList.contains("is-kinetic"), active: item.classList.contains("is-active"), fillRatio: Math.round((fill.width / item.getBoundingClientRect().width) * 100) / 100 };
    });
    check("door board hover runs (GSAP)", board.kinetic && board.active && board.fillRatio > 0.95, board);
    await page.mouse.move(5, 5);
    await page.evaluate(async () => { await document.fonts.ready; window.scrollTo(0, document.documentElement.scrollHeight); });
    await sleep(600);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); // again, after late reflow
    await sleep(500);
    const foot = await page.evaluate(() => ({ curtain: document.documentElement.classList.contains("has-curtain"), fp: getComputedStyle(document.querySelector(".c-footer")).getPropertyValue("--fp").trim(), pos: getComputedStyle(document.querySelector(".c-footer")).position }));
    check("footer curtain and parallax at the bottom", foot.curtain && foot.pos === "sticky" && parseFloat(foot.fp) > 0.98, foot);

    // Intro backgrounds: the photographs are the intros' dithered backgrounds, no longer a band below.
    const intros = await page.evaluate(() => ({ bands: document.querySelectorAll(".c-doorimg").length, dithered: [...document.querySelectorAll("main[data-page]")].filter((m) => m.querySelector(".c-page-intro .c-dither")).map((m) => m.dataset.page) }));
    check("intro backgrounds: six dithered intros, no image band", intros.bands === 0 && intros.dithered.length === 6, intros);
    // Page switch: the page leaves at once and the next arrives with its picture already decoded.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await sleep(400);
    const from = await visible(page);
    const to = from === "parts" ? "charter" : "parts";
    await page.route("**/dither/**", async (route) => { await sleep(300); await route.continue(); });
    await page.locator(`.c-header a[href="#${to}"]`).first().click();
    await sleep(120);
    const mid = await page.evaluate(() => ({ leaving: document.documentElement.classList.contains("is-leaving"), page: [...document.querySelectorAll("main[data-page]")].find((m) => !m.hidden).dataset.page }));
    await page.waitForSelector(`main[data-page="${to}"]:not([hidden])`, { timeout: 3000 });
    await sleep(500);
    const arrived = await page.evaluate((to) => {
      const g = document.querySelector(`main[data-page="${to}"] .c-dither__grid`);
      const name = (getComputedStyle(g).backgroundImage.match(/dither\/([^"')]+)/) || [])[1];
      return { leaving: document.documentElement.classList.contains("is-leaving"), grid: name, fetched: performance.getEntriesByType("resource").some((e) => e.name.endsWith("dither/" + name)) };
    }, to);
    await page.unroute("**/dither/**");
    check("page switch: leaves at once, arrives with its picture ready", mid.leaving && mid.page === from && !arrived.leaving && /-d\.png$/.test(arrived.grid || "") && arrived.fetched, { from, to, mid, arrived });

    check("desktop: no console/network errors", errs.length === 0, errs.slice(0, 8));
    await ctx.close();
  } catch (e) { check("desktop section completed", false, [String(e).split("\n")[0], ...errs.slice(0, 5)]); }

  // ---- mobile ----
  try {
    const errs = [];
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    consoleTap(page, errs);
    await page.goto(base);
    await ready(page);
    check("no horizontal overflow (375)", await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]));
    await page.screenshot({ path: path.join(shots, "mobile-home-top.png") });
    await page.click(".c-header__burger");
    await sleep(400);
    const m = await page.evaluate(() => {
      const menu = document.querySelector(".c-menu");
      return { hidden: menu.hidden, open: menu.dataset.open, focusIn: menu.contains(document.activeElement), expanded: document.querySelector(".c-header__burger").getAttribute("aria-expanded"), lock: document.documentElement.classList.contains("is-menu-open") };
    });
    check("burger opens menu", !m.hidden && m.open === "true" && m.focusIn && m.expanded === "true" && m.lock, m);
    await page.screenshot({ path: path.join(shots, "mobile-menu.png") });
    await page.click(".c-menu .c-menu__toggle");
    await sleep(400);
    const accOpen = await page.evaluate(() => document.querySelector(".c-menu .c-menu__item").dataset.open);
    check("menu accordion opens", accOpen === "true", accOpen);
    await page.click('.c-menu a[href="#engines.llp"]');
    await page.waitForSelector('main[data-page="engines"]:not([hidden])');
    await sleep(700);
    const llpTop = await topOf(page, "engines.llp");
    check("menu link closes menu and lands on section", (await page.evaluate(() => document.querySelector(".c-menu").hidden)) && llpTop !== null && llpTop >= -2 && llpTop < 220, llpTop);
    check("header stays after landing on a section", await page.evaluate(() => !document.querySelector(".c-header").classList.contains("is-hidden")));
    await page.click(".c-header__burger");
    await sleep(300);
    await page.keyboard.press("Escape");
    await sleep(520);
    check("escape closes menu and returns focus", await page.evaluate(() => document.querySelector(".c-menu").hidden && document.activeElement === document.querySelector(".c-header__burger")));
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(300);
    await page.evaluate(() => window.scrollTo(0, 900));
    await sleep(300);
    await page.evaluate(() => window.scrollTo(0, 1200));
    await sleep(400);
    check("header hides on scroll down", await page.evaluate(() => document.querySelector(".c-header").classList.contains("is-hidden")));
    await page.evaluate(() => window.scrollTo(0, 900));
    await sleep(400);
    check("header returns on scroll up", await page.evaluate(() => !document.querySelector(".c-header").classList.contains("is-hidden")));
    await page.screenshot({ path: path.join(shots, "mobile-engines.png") });
    const mgrid = await page.evaluate(() => { const g = document.querySelector('main[data-page="engines"] .c-dither__grid'); return (getComputedStyle(g).backgroundImage.match(/dither\/([^"')]+)/) || [])[1]; });
    check("mobile: the intro uses the phone dither grid", /-m\.png$/.test(mgrid || ""), mgrid);
    const mPeek = await page.evaluate(() => getComputedStyle(document.querySelector('main[data-page="home"] .c-peek')).display);
    check("mobile: no cursor label on a touch screen", mPeek === "none", mPeek);
    check("mobile: no console/network errors", errs.length === 0, errs.slice(0, 8));
    await ctx.close();
  } catch (e) { check("mobile section completed", false, [String(e).split("\n")[0], ...errs.slice(0, 5)]); }

  // ---- reduced motion ----
  try {
    const errs = [];
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    consoleTap(page, errs);
    await page.goto(base);
    await ready(page);
    check("rm: sc-reduce set", await page.evaluate(() => document.documentElement.classList.contains("sc-reduce")));
    const rmPins = await page.evaluate(() => document.querySelectorAll('[data-sc-act="pin"]').length);
    check("rm: no pinned acts", rmPins === 0, rmPins);
    const rm0 = await page.evaluate(() => getComputedStyle(document.querySelector("main:not([hidden]) .c-sky__plane")).transform);
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.5));
    await sleep(500);
    const rm1 = await page.evaluate(() => getComputedStyle(document.querySelector("main:not([hidden]) .c-sky__plane")).transform);
    await page.evaluate(() => window.scrollTo(0, 0));
    check("rm: aircraft still", rm0 === rm1, { rm0, rm1 });
    const rmReels = await page.evaluate(() => document.querySelectorAll(".c-reel__strip.is-landed").length);
    check("rm: fact reels do not turn", rmReels === 0, rmReels);
    const hidden = await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      await new Promise((r) => setTimeout(r, 400));
      const els = Array.from(document.querySelectorAll("main:not([hidden]) [data-sc-cue], main:not([hidden]) [data-sc-in], main:not([hidden]) [data-sc-stagger] > *"));
      return els.filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99).map((el) => el.className.toString().slice(0, 40));
    });
    check("rm: nothing left hidden on home", hidden.length === 0, hidden.slice(0, 6));
    const rmPlan = await page.evaluate(() => { const s = document.getElementById("home.how"); const li = [...s.querySelectorAll(".c-stair")]; return { act: s.getAttribute("data-sc-act"), words: li.filter((l) => +getComputedStyle(l.querySelector(".c-stair__text")).opacity > 0.99).length, drawn: li.filter((l) => getComputedStyle(l, "::after").transform === "none" || new DOMMatrix(getComputedStyle(l, "::after").transform).a > 0.99).length, dotAtEnd: +getComputedStyle(li[li.length - 1].querySelector(".c-stair__tip")).opacity > 0.99 }; });
    check("rm: the stairs flow, drawn to the end with every step's words", rmPlan.act === "flow" && rmPlan.words === 5 && rmPlan.drawn === 5 && rmPlan.dotAtEnd, rmPlan);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await sleep(300);
    await page.locator('.c-header a[href="#about"]').first().click();
    await sleep(60);
    const rmNav = await page.evaluate(() => ({ leaving: document.documentElement.classList.contains("is-leaving"), shown: !document.querySelector('main[data-page="about"]').hidden }));
    check("rm: page switch is immediate, no leaving state", rmNav.shown && !rmNav.leaving, rmNav);
    check("rm: no console/network errors", errs.length === 0, errs.slice(0, 8));
    await ctx.close();
  } catch (e) { check("reduced-motion section completed", false, [String(e).split("\n")[0], ...errs.slice(0, 5)]); }

  await browser.close();
  server.close();
  notes.forEach((n) => console.log(n));
  fails.forEach((n) => console.log(n));
  console.log(`\n${fails.length ? fails.length + " FAILED" : "all checks passed"}; shots in ${shots}`);
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error(e); server.close(); process.exit(2); });
