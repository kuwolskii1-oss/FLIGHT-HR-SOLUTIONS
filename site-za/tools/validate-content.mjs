// Validates site-za/app/src/content/*.json: zod schema, copy limits from the build prompt
// (headline 8 words, paragraph 40 words, home block 60 words, one CTA per block), dashes,
// banned words, placeholders, American spelling, internal hrefs, careful-wording guards.
// Run: cd site-za/app && bun ../tools/validate-content.mjs [--json]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FILES } from "../app/src/site/schema.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(here, "../app/src/content");
const asJson = process.argv.includes("--json");
const findings = [];
const add = (file, sev, p, msg) => findings.push({ file, sev, path: p, msg });

const ROUTES = new Set([
  "/", "/engines", "/engines/engine-360", "/aircraft", "/parts", "/charter", "/advisory", "/about", "/contact", "/privacy", "/legal",
  "/engines#status", "/engines#llp", "/engines#shop-visits", "/engines#reserves", "/engines#lease-return", "/engines#sales-leasing", "/engines#form",
  "/aircraft#buy", "/aircraft#sell", "/aircraft#dry-lease", "/aircraft#acmi", "/aircraft#management", "/aircraft#process", "/aircraft#form",
  "/parts#form", "/parts#engine-families", "/parts#categories", "/parts#aog", "/parts#verify",
  "/charter#corporate", "/charter#group", "/charter#government", "/charter#cargo", "/charter#form",
  "/advisory#fleet", "/advisory#due-diligence", "/advisory#recovery", "/advisory#tenders", "/advisory#form",
  "/about#how", "/about#serve", "/about#commitments", "/about#team", "/about#company", "/about#group",
  "/contact#form", "/contact#urgent", "/legal#disclaimer", "/legal#company", "/legal#paia",
]);
const SKIP = new Set(["notes", "sources", "clientToConfirm", "source", "href", "src", "slug", "seoTitle", "id", "name", "routeTo", "n", "timezone", "kind", "type", "status", "width", "showWhen", "field", "equals", "value", "registrationNumber", "phone", "whatsapp", "updated"]);
const BANNED = /\b(world-leading|one-stop|holistic|seamless(?:ly)?|elevate|unleash|next-gen|revolutioni[sz]e|innovative|cutting-edge|passionate|synergy|best-in-class|state-of-the-art|leverage|unrivalled|unparalleled|trusted partner|end-to-end|bespoke)\b/i;
const AMERICAN = /\b(color|colors|organize[sd]?|optimize[sd]?|analyze[sd]?|center|centers|program|programs|favor|honor|catalog)\b/;
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

const data = {};
for (const [file, schema] of Object.entries(FILES)) {
  const fp = path.join(dir, file);
  if (!fs.existsSync(fp)) { add(file, "blocker", "", "missing file"); continue; }
  let json;
  try { json = JSON.parse(fs.readFileSync(fp, "utf8")); } catch (e) { add(file, "blocker", "", "invalid JSON: " + e.message); continue; }
  data[file] = json;
  const r = schema.safeParse(json);
  if (!r.success) for (const issue of r.error.issues.slice(0, 40)) add(file, "blocker", issue.path.join("."), "schema: " + issue.message);
}

function walk(file, node, p, skip) {
  if (Array.isArray(node)) { node.forEach((v, i) => walk(file, v, `${p}[${i}]`, skip)); return; }
  if (node && typeof node === "object") { for (const [k, v] of Object.entries(node)) walk(file, v, p ? `${p}.${k}` : k, skip || SKIP.has(k)); return; }
  if (typeof node !== "string") return;
  const key = p.split(/[.[]/).pop();
  if (/[—–]/.test(node)) add(file, "major", p, "em or en dash");
  if (/\s-\s|\s--\s/.test(node)) add(file, "major", p, "hyphen used as a dash");
  if (skip) return;
  if (/lorem|TODO|TBD|\bTBA\b|\[CLIENT|\[region\]|placeholder|xxx/i.test(node)) add(file, "blocker", p, "placeholder text: " + node.slice(0, 60));
  if (BANNED.test(node)) add(file, "major", p, "banned word: " + node.match(BANNED)[0]);
  if (/\b\d+\+?\s*years?\b/i.test(node)) add(file, "blocker", p, "years figure: " + node.match(/\b\d+\+?\s*years?\b/i)[0]);
  if (/\b(guarantee[sd]?|lowest price|cheapest|always available|fastest)\b/i.test(node)) add(file, "major", p, "promise wording: " + node.match(/\b(guarantee[sd]?|lowest price|cheapest|always available|fastest)\b/i)[0]);
  const am = node.match(AMERICAN); if (am) add(file, "minor", p, "American spelling: " + am[0]);
  if (/\bMRO\b/.test(node) && /we (overhaul|repair|perform|carry out)\b/i.test(node)) add(file, "major", p, "claims FHS performs MRO work itself");
  if (/^(headline|title)$/.test(key) && words(node) > 8 && !/seoTitle|form\.title|successTitle/.test(p)) add(file, "minor", p, `headline ${words(node)} words: ${node.slice(0, 70)}`);
  if (/^(text|sub|intro|paragraphs|statement|disclaimer|consentText|successText|responsePromise|currencyNote|hint|line|relationship|positioning|legalLine|status)$/.test(key) || /paragraphs\[\d+\]$/.test(p)) {
    if (words(node) > 40 && !/disclaimer|consentText|paragraphs/.test(p)) add(file, "minor", p, `paragraph ${words(node)} words`);
    if (words(node) > 60) add(file, "major", p, `paragraph ${words(node)} words`);
  }
  if (key === "href") return;
}
for (const [f, d] of Object.entries(data)) walk(f, d, "", false);

// hrefs
function hrefs(file, node, p) {
  if (Array.isArray(node)) return node.forEach((v, i) => hrefs(file, v, `${p}[${i}]`));
  if (node && typeof node === "object") return Object.entries(node).forEach(([k, v]) => (k === "href" && typeof v === "string" ? check(file, v, p) : hrefs(file, v, p ? `${p}.${k}` : k)));
}
function check(file, v, p) {
  if (/^(https?:|mailto:|tel:|#)/.test(v)) return;
  const clean = v.replace(/\/$/, "") || "/";
  if (!ROUTES.has(clean)) add(file, "major", p + ".href", "href not in sitemap: " + v);
}
for (const [f, d] of Object.entries(data)) hrefs(f, d, "");

// home: 60 words per block, one CTA per block
const home = data["home.json"];
if (home) {
  const strip = (o) => JSON.parse(JSON.stringify(o, (k, v) => (SKIP.has(k) && k !== "href" ? undefined : v)));
  for (const [block, val] of Object.entries(strip(home))) {
    if (typeof val !== "object") continue;
    let n = 0; const count = (x) => { if (typeof x === "string") n += words(x); else if (x && typeof x === "object") Object.entries(x).forEach(([k, v]) => k !== "href" && k !== "slug" && count(v)); };
    count(val);
    if (n > 60) add("home.json", "major", block, `home block ${n} words (limit 60)`);
    const ctas = JSON.stringify(val).match(/"href":"/g)?.length ?? 0;
    if (block !== "ask" && block !== "closing" && ctas > 2) add("home.json", "major", block, `${ctas} links in one block`);
  }
}
// careful wording present where the brief requires it
const charter = data["charter.json"];
if (charter && !/operat(ed|ing) by licensed operators|Air Operator Certificate/i.test(JSON.stringify(charter))) add("charter.json", "blocker", "disclaimer", "charter operator disclaimer missing");
const e360 = data["engine360.json"];
if (e360 && /\b(live|available now|launched)\b/i.test(JSON.stringify(strip360(e360)))) add("engine360.json", "major", "", "Engine 360 described as live");
function strip360(o) { return JSON.parse(JSON.stringify(o, (k, v) => (SKIP.has(k) && k !== "href" ? undefined : v))); }
const engines = data["engines.json"];
if (engines && !/approved MRO/i.test(JSON.stringify(engines))) add("engines.json", "major", "", "the phrase 'approved MROs' does not appear");
for (const f of ["engines.json", "aircraft.json", "parts.json", "charter.json", "advisory.json", "engine360.json", "contact.json"]) {
  const d = data[f]; if (!d) continue;
  const forms = f === "contact.json" ? [d.general] : [d.form];
  for (const form of forms) if (form && !/POPIA|Protection of Personal Information/i.test(form.consentText)) add(f, "major", "form.consentText", "consent text does not name POPIA");
}
// one label per intent
const labels = {};
for (const [f, d] of Object.entries(data)) for (const m of JSON.stringify(d).matchAll(/"label":"([^"]+)","href":"([^"#]+)(#[^"]*)?"/g)) { const key = m[2] + (m[3] || ""); (labels[key] ||= new Set()).add(m[1]); }
for (const [href, set] of Object.entries(labels)) if (set.size > 2) add("all", "minor", href, "more than two labels for one destination: " + [...set].join(" | "));

const sev = { blocker: 0, major: 1, minor: 2 };
findings.sort((a, b) => sev[a.sev] - sev[b.sev] || a.file.localeCompare(b.file));
if (asJson) console.log(JSON.stringify(findings, null, 1));
else { for (const x of findings) console.log(`${x.sev.padEnd(7)} ${x.file.padEnd(14)} ${x.path}: ${x.msg}`); console.log(`\n${Object.keys(data).length}/${Object.keys(FILES).length} files, ${findings.length} findings (${findings.filter((x) => x.sev === "blocker").length} blockers, ${findings.filter((x) => x.sev === "major").length} major, ${findings.filter((x) => x.sev === "minor").length} minor)`); }
process.exit(findings.some((x) => x.sev === "blocker") ? 1 : 0);
