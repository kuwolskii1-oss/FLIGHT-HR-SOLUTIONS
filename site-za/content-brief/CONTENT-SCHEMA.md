# Content rules for the South African site

Client: Flight Hour Solution (Pty) Ltd, South Africa (registered 2026, registration number 2026/294346/07). Sister site of the Swiss company's site. Read `docs/za/brief-fhs-south-africa.html` (plain text copy: `site-za/content-brief/brief.txt`) and `docs/za/build-prompt.txt` sections 2, 3 and 7 before writing anything.

## Sources of truth, in order

1. The brief (`brief.txt`). Everything about the South African company comes from here. It is a digest of the corporate profile; the profile itself is not available, so the brief is the boundary.
2. The Swiss site's content, for facts about the group only: `site/app/src/content/site.json` (company, engine families, memberships) and `site/app/src/content/about.json` (team, credentials). Anything taken from there is labelled as the Swiss company's or the group's, never as the South African company's.
3. Nothing else. No memory, no industry knowledge, no example figures. If the brief does not say it, it is unknown: leave the field empty (empty string or empty array) and add a line to `clientToConfirm`.

## Files and schema

Output: `site-za/app/src/content/<file>.json`, one file per writer. Shape: the zod schemas in `site-za/app/src/site/schema.ts` (the `FILES` map at the bottom names which schema each file uses). Every file may also carry `notes` (string), `sources` (string or array, naming the brief section for each block) and `clientToConfirm` (array of strings). Those three keys are stripped at build time.

Validate after every save:

```
cd site-za/app && bun ../tools/validate-content.mjs
```

Fix every blocker and major in your own file. Minors are allowed only with a reason in `notes`.

## Copy limits (from the build prompt, measured by Agent 4)

- Headlines and titles: 8 words or fewer.
- Body paragraphs (`text`, `sub`, `intro`, paragraph items): 40 words or fewer. Sentences of about 20 words.
- Home page: each block (hero, ask, how, trust, engine360, group, closing) 60 words or fewer including labels. One call to action per block, two at most in `closing` (primary plus the urgent action).
- Bullets: 6 or fewer per section, 8 words or fewer each.
- Every section ends with a natural next step: a link, a form, or the next section.

## Voice

- British English. Plain words. No dashes as punctuation (no em dash, no en dash, no spaced hyphen). Hyphenated compounds such as "dry-lease" are fine.
- Sentence case for titles. No exclamation marks. No superlatives, no "leading", "trusted partner", "end-to-end", "seamless", "bespoke".
- Second person is allowed where it helps the visitor act ("Send the part number"), not as flattery.
- Never write a figure, a client name, a quote, a testimonial, a response time, a year count or a region that the brief does not give. The brief gives exactly these: registered 2026, registration number 2026/294346/07, email domain flighthoursolution.com. The "40+ years" line in the brief is a Swiss-site claim the Swiss build chose not to render; do not render it here either (the validator blocks year figures).
- Keep the brief's careful wording exactly where it applies: "through appropriately approved MROs" (engines), "subject to aircraft availability" (charter and ACMI), Engine 360 "is being designed" (never live, never launched), the charter operator disclaimer on the charter page and under the charter form: FHS is not the operating airline; flights are operated by licensed operators under their own Air Operator Certificates.
- FHS arranges, coordinates, sources, verifies and advises. It does not overhaul, repair or operate aircraft itself.

## Fixed decisions (do not vary)

Navigation (site.json `nav.doors`, in this order, with these hrefs):

| Door | href | Sub-items (anchor ids) |
|---|---|---|
| Engines | /engines | Technical status and records (#status), LLPs and remaining life (#llp), Shop visits and MRO coordination (#shop-visits), Maintenance reserves (#reserves), Lease return and redelivery (#lease-return), Engine sales and leasing (#sales-leasing), Engine 360, early access (/engines/engine-360) |
| Aircraft | /aircraft | Buy an aircraft (#buy), Sell an aircraft (#sell), Dry lease (#dry-lease), ACMI and wet lease (#acmi), Aircraft management (#management) |
| Parts | /parts | One page: request form (#form), categories (#categories), AOG line (#aog), how we verify parts (#verify) |
| Charter | /charter | Corporate and VIP (#corporate), Group and pilgrimage (#group), Government (#government), Cargo, mining and humanitarian (#cargo) |
| Advisory | /advisory | Fleet planning and lease versus buy (#fleet), Due diligence (#due-diligence), Aircraft recovery (#recovery), Tenders and investor packs (#tenders) |

About: /about with How we work (#how), Who we serve (#serve), Our commitments (#commitments), Team and company details (#team, #company). Contact: /contact. Legal: /privacy (POPIA notice) and /legal (company details, charter operator disclaimer, PAIA note, website terms).

Door `sections[].id` must use the anchor ids above, in that order. Door `slug` values: engines, aircraft, parts, charter, advisory.

Labels, one per intent:

- Primary action everywhere: `Get in touch` → `/contact`.
- Urgent action everywhere: `AOG on WhatsApp` → `/contact#urgent` (the component upgrades it to the WhatsApp deep link once the number exists).
- Door form submit labels, also used for the door hero call to action (href `#form`): Engines `Send engine enquiry`; Aircraft `Send aircraft requirement`; Parts `Send parts request`; Charter `Request a charter quote`; Advisory `Start the conversation`; Engine 360 `Join the early access list`; Contact general form `Send message`.
- Country switch label: `Switzerland` (href `https://flighthoursolution.com`), group line: `Part of the Flight Hour Solution group`.

Forms (brief section 5), field lists are fixed; you write labels, hints and options:

- Engines: issue (select), engine type (select: CFM56, LEAP, V2500, PW4000, APU, TPE331 or TFE731, Other or not sure; these are options, not a coverage claim, flag it), aircraft type, owned or leased (segmented), timing (select), region, serial number (optional), name, company, email, phone. Note under the form: "We sign an NDA before asking for records." No upload field.
- Aircraft: need (segmented: Buy, Sell, Dry lease, ACMI), aircraft type or mission (seats, payload, range), budget or monthly rate, start date and term, base country, acting as (segmented: End buyer or owner, Acting for one), name, company, email, phone. Proof of funds is step 2 of the process, not a field.
- Parts: part number, description, quantity, condition (select: New, Overhauled, Serviceable, As removed), release certificate needed (select), delivery airport, aircraft type, AOG (segmented: Yes, No), name, company, email, phone. Hint that several lines can be pasted or a spreadsheet can be sent by email for RFQs. If AOG is Yes the page shows the WhatsApp route (write the `disclaimer` or `intro` line for that).
- Charter: passengers or cargo (segmented), from, to, dates, one-way or return (segmented), passenger count or cargo weight, dimensions and dangerous goods, date flexibility (select), name, organisation, email, phone. Currency note and the operator disclaimer under the button.
- Advisory: organisation type (select), project summary (textarea), stage (select), timeframe (select), name, organisation, email, phone.
- Engine 360 waitlist: role, fleet size, engine types, email, organisation.
- Contact general: name, organisation, email, phone, which door (select of the five plus Other), message.
- Every form: `consentText` names POPIA and links the privacy notice; `routeTo` is a proposed role inbox on the group domain (engines@, aircraft@, parts@, aog@, charter@, advisory@, and hello@ for general), flagged to confirm; `currencyNote` where money is involved: aircraft, engines and parts in US dollars, charter may be quoted in rand.

Unknown facts (leave empty, list in clientToConfirm): physical address, South African phone, WhatsApp number, staffed hours, the managing director's name, the Information Officer, B-BBEE level, CSD number, SACAA approvals or accreditations, engine and aircraft types actually covered, regions served, the exact relationship to the Swiss company (subsidiary, sister company or partner), team members, the domain.

## Page briefs

- home.json: hero headline is the brief's positioning line `Engine intelligence. Operational certainty.` with a plain subline saying what FHS does from South Africa (no region beyond that). `ask` is "What do you need?" with the five doors, one line each naming who it is for. `how` is the five-step How we work sequence condensed to a few words per step. `trust` states what the visitor can check (verification, process, group, company details). `engine360` early access band. `group` band. `closing` with the primary and urgent actions.
- Door files: lead with the problem and the outcome, then the sub-sections (four to six grouped capabilities each, short), then the door's process or verification block, an optional `fullScope` accordion for procurement readers (only content the brief supports), the form. Aircraft carries the nine-step transaction process as `process`. Parts carries `verify` (traceability, release documentation, certification status, incident and accident history, remaining life) and the AOG line. Charter carries `disclaimer` and a short section per audience.
- engine360.json: early access, "is being designed", what it is meant to do only as far as the brief says (engine intelligence, status, exposure), waitlist form that asks fleet size, engine types and role.
- about.json: how we work (five steps with the brief's words), who we serve (group the sixteen client types the brief names across the doors table into three or four groups), commitments (careful wording, verification before claims, NDA before records, licensed operators, POPIA), team (intro only; people array empty unless the brief names someone; it names only "the MD" without a name), company details lines (legal name, registration number, registered 2026, country; address line omitted), group.
- contact.json: route to the five doors, the urgent WhatsApp block (hours empty), channels (general email), office lines empty, general form.
- legal.json: privacy notice drafted for POPIA (who we are, what we collect per form, why, consent, sharing with operators and partners, retention, rights, Information Officer, cookies, contact) marked in notes as a draft for legal review; legal page with company details, the charter operator disclaimer in full, PAIA manual note, website terms in plain words, group line.
