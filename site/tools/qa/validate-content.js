// Mechanical rules over the content JSON: parse, dashes, banned words, placeholders, headline lengths,
// fixed slugs, image keys, CTA labels/hrefs, internal hrefs against the sitemap, source fields on stats.
const fs = require('fs'); const path = require('path');
const dir = process.argv[2];
const IMAGE_KEYS = new Set(['hero-engine-stand','shop-floor','borescope','table-inspection','test-cell','records-desk','fan-macro','zug-lake','apron-dusk','engine-cradle','cross-section']);
const SERVICE_SLUGS = ['shop-visit-management','workscope-and-removal-planning','lease-return-and-asset-management','contracts-mro-and-supply-chain','predictive-maintenance-and-analytics','technical-due-diligence','military-and-government','training-and-knowledge-transfer'];
const FAMILY_SLUGS = ['cfm56','leap','v2500','pw4000','apu-and-turboprop'];
const INDUSTRY_SLUGS = ['airlines','lessors-and-investors','mros','government-and-military'];
const BANNED = /\b(world-leading|one-stop|holistic|seamless(?:ly)?|elevate|unleash|next-gen|revolutioni[sz]e|innovative|cutting-edge|passionate|synergy|best-in-class|state-of-the-art|leverage)\b/i;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
const data = {}; const findings = [];
const add = (file, sev, p, msg) => findings.push({ file, sev, path: p, msg });
for (const f of files) { try { data[f] = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { add(f, 'blocker', '', 'invalid JSON: ' + e.message); } }
const articleSlugs = (data['insights.json'] && data['insights.json'].articles || []).map(a => a.slug);
const ROUTES = new Set(['/', '/services', '/engines', '/industries', '/about', '/assets', '/insights', '/glossary', '/careers', '/contact', '/contact#workscope', '/impressum', '/privacy', '/cookies', '/about#independence', '/about#team', '/about#credentials', '/about#story', '/about#zug', '/about#legal', ...SERVICE_SLUGS.map(s => '/services/' + s), ...FAMILY_SLUGS.map(s => '/engines/' + s), ...INDUSTRY_SLUGS.map(s => '/industries/' + s), ...articleSlugs.map(s => '/insights/' + s)]);
const RENDER_SKIP = new Set(['source', 'sources', 'clientToConfirm', 'notes', 'credit', 'href', 'src', 'url', 'slug', 'seoTitle', 'keywords']);
function walk(file, node, p, inSkip) {
  if (Array.isArray(node)) { node.forEach((v, i) => walk(file, v, `${p}[${i}]`, inSkip)); return; }
  if (node && typeof node === 'object') { for (const [k, v] of Object.entries(node)) walk(file, v, p ? `${p}.${k}` : k, inSkip || RENDER_SKIP.has(k)); return; }
  if (typeof node !== 'string') return;
  const key = p.split(/[.\[]/).pop();
  if (/[—–]/.test(node)) add(file, 'major', p, 'em/en dash');
  if (/<[a-z][^>]*>/i.test(node) && !inSkip) add(file, 'major', p, 'angle-bracket token or html: ' + node.slice(0, 60));
  if (/lorem|TODO|TBD|\[CLIENT|placeholder/i.test(node) && !inSkip) add(file, 'blocker', p, 'placeholder text: ' + node.slice(0, 60));
  if (!inSkip && BANNED.test(node)) add(file, 'major', p, 'banned word: ' + node.match(BANNED)[0]);
  if (!inSkip && /\b(\d+|many|several)\+? years? of experience\b/i.test(node)) add(file, 'blocker', p, 'years-of-experience claim');
  if (!inSkip && /\b(color|organize|optimize|analyze|center|program\b(?!me))/i.test(node) && !/programme/i.test(node)) { const m = node.match(/\b(color|organize|optimize|analyze|center)\b/i); if (m) add(file, 'minor', p, 'American spelling: ' + m[0]); }
  if (/^(headline|title)$/.test(key) && !inSkip) { const words = node.trim().split(/\s+/).length; if (words > 8 && !/^(seo|meta)/i.test(p) && !/faq|questions|glossary|articles|sections|deliverables|steps|policies|rows|items|whatWeDo|visitTypes|costDrivers|howItWorks|terms|situations|columns|legal|privacy|cookies|impressum|urgent|office|requestForm|form/.test(p)) add(file, 'minor', p, `headline ${words} words: ${node.slice(0, 70)}`); }
  if (key === 'sub' && !inSkip && node.trim().split(/\s+/).length > 25) add(file, 'minor', p, `sub ${node.trim().split(/\s+/).length} words`);
  if (key === 'src' && /image/i.test(p) && !IMAGE_KEYS.has(node) && !/^\//.test(node)) add(file, 'major', p, 'unknown image key: ' + node);
  if (key === 'href') { if (/^(https?:|mailto:|tel:|#)/.test(node)) return; const clean = node.replace(/\/$/, '') || '/'; if (!ROUTES.has(clean)) add(file, 'major', p, 'href not in sitemap: ' + node); }
  if (key === 'label' && /cta|Cta|CTA/.test(p)) { const sib = p.replace(/\.label$/, ''); const obj = sib.split(/\.|\[|\]/).filter(Boolean).reduce((o, k) => (o == null ? o : o[k]), data[file]); if (obj && typeof obj.href === 'string' && obj.href.startsWith('/contact') && !['Talk to us', 'Send us a workscope'].includes(node)) add(file, 'minor', p, 'contact CTA label not fixed: ' + node); }
}
for (const [f, d] of Object.entries(data)) walk(f, d, '', false);
// cross-file: CTA hrefs paired with labels
for (const [f, d] of Object.entries(data)) { const s = JSON.stringify(d); const m = s.match(/"label":"Talk to us","href":"([^"]+)"/g) || []; for (const x of m) if (!x.includes('"/contact"')) add(f, 'major', 'cta', 'Talk to us href: ' + x); const m2 = s.match(/"label":"Send us a workscope","href":"([^"]+)"/g) || []; for (const x of m2) if (!x.includes('/contact#workscope')) add(f, 'major', 'cta', 'workscope href: ' + x); }
// slugs
const sv = data['services.json']; if (sv) { const got = sv.services.map(s => s.slug); if (JSON.stringify(got) !== JSON.stringify(SERVICE_SLUGS)) add('services.json', 'blocker', 'services[].slug', 'slugs differ: ' + got.join(',')); }
const en = data['engines.json']; if (en) { const got = en.families.map(s => s.slug); if (JSON.stringify(got) !== JSON.stringify(FAMILY_SLUGS)) add('engines.json', 'blocker', 'families[].slug', 'slugs differ: ' + got.join(',')); }
const ind = data['industries.json']; if (ind) { const got = ind.industries.map(s => s.slug); if (JSON.stringify(got) !== JSON.stringify(INDUSTRY_SLUGS)) add('industries.json', 'blocker', 'industries[].slug', 'slugs differ: ' + got.join(',')); }
// stats need sources
for (const [f, d] of Object.entries(data)) { const s = JSON.stringify(d); const stats = [...s.matchAll(/\{"value":"[^"]*","unit":"[^"]*","label":"[^"]*"(,"source":"[^"]*")?\}/g)]; for (const m of stats) if (!m[1]) add(f, 'major', 'stat', 'stat without source: ' + m[0].slice(0, 80)); }
// company facts identical
const rendered = (d) => JSON.stringify(d, (k, v) => (RENDER_SKIP.has(k) && k !== 'href' ? undefined : v));
const site = data['site.json']; if (site) { const phone = site.company.phone, email = site.company.email, uid = site.company.uid; for (const [f, d] of Object.entries(data)) { const s = rendered(d); const phones = new Set((s.match(/\+41[\d ]{9,14}/g) || []).map(x => x.replace(/\s/g, ''))); phones.delete(phone.replace(/\s/g, '')); if (phones.size) add(f, 'major', 'phone', 'other phone numbers: ' + [...phones].join(', ')); const uids = new Set((s.match(/CHE-[\d.]+\d/g) || [])); uids.delete(uid); if (uids.size) add(f, 'major', 'uid', 'other UIDs: ' + [...uids].join(', ')); const emails = new Set((s.match(/[\w.-]+@flighthoursolution\.com/g) || [])); emails.delete(email); if (emails.size) add(f, 'minor', 'email', 'other company emails: ' + [...emails].join(', ')); } }
const sev = { blocker: 0, major: 1, minor: 2 }; findings.sort((a, b) => sev[a.sev] - sev[b.sev] || a.file.localeCompare(b.file));
for (const x of findings) console.log(`${x.sev.padEnd(7)} ${x.file.padEnd(16)} ${x.path}: ${x.msg}`);
console.log(`\n${files.length} files, ${findings.length} findings (${findings.filter(x => x.sev === 'blocker').length} blockers, ${findings.filter(x => x.sev === 'major').length} major, ${findings.filter(x => x.sev === 'minor').length} minor)`);
