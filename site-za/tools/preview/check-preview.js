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
    // Flight plan: one step at a time, the aircraft flies, each waypoint lights with its step, and
    // the sky goes from sunset to night.
    const plan = async (p) => {
      await page.evaluate((p) => { const s = document.getElementById("home.how"); const top = s.getBoundingClientRect().top + scrollY; window.scrollTo({ top: top + p * (s.offsetHeight - innerHeight), behavior: "instant" }); }, p);
      await sleep(300);
      return page.evaluate(() => {
        const s = document.getElementById("home.how");
        const op = [...s.querySelectorAll(".c-cuestep")].map((li) => +getComputedStyle(li).opacity);
        const lit = [...s.querySelectorAll(".c-route__dot")].filter((d) => ((c) => (c.startsWith("color(") ? +c.split(" ")[1] * 255 : +c.match(/\d+/)[0]))(getComputedStyle(d).backgroundColor) > 200).length;
        return { shown: op.filter((o) => o > 0.5).length, step: op.findIndex((o) => o > 0.5) + 1, lit, jet: getComputedStyle(s.querySelector(".c-route__jet")).transform, sunset: +(+getComputedStyle(s.querySelector(".c-dusk__sunset")).opacity).toFixed(2), stars: +(+getComputedStyle(s.querySelector(".c-dusk__stars")).opacity).toFixed(2) };
      });
    };
    const f0 = await plan(0.05);
    const f1 = await plan(0.55);
    await page.screenshot({ path: path.join(shots, "desktop-flightplan.png") });
    const f2 = await plan(0.95);
    check("flight plan: one step at a time, lit with its waypoint", [f0, f1, f2].every((f) => f.shown === 1 && f.lit === f.step) && f0.step === 1 && f1.step === 4 && f2.step === 5, { f0, f1, f2 });
    check("flight plan: the aircraft flies the route", f0.jet !== f1.jet && f1.jet !== f2.jet, [f0.jet, f1.jet, f2.jet]);
    check("flight plan: sunset to night", f0.sunset > 0.8 && f2.sunset < 0.1 && f0.stars === 0 && f2.stars > 0.5, { f0: [f0.sunset, f0.stars], f2: [f2.sunset, f2.stars] });
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
    const rmPlan = await page.evaluate(() => { const s = document.getElementById("home.how"); return { steps: [...s.querySelectorAll(".c-cuestep")].filter((li) => +getComputedStyle(li).opacity > 0.99).length, lit: [...s.querySelectorAll(".c-route__dot")].filter((d) => ((c) => (c.startsWith("color(") ? +c.split(" ")[1] * 255 : +c.match(/\d+/)[0]))(getComputedStyle(d).backgroundColor) > 200).length }; });
    check("rm: every step listed, the route shown flown", rmPlan.steps === 5 && rmPlan.lit === 5, rmPlan);
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
