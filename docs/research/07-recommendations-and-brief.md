# 07 · Recommendations and brief for the new website

This document turns the research (01–06) into a working brief. It is opinionated where the evidence supports an opinion and flags every decision the client must make. Nothing here is final until the open questions in §12 are answered.

## 1. Executive summary

1. **The business is bigger than the website.** The site sells consulting only; LinkedIn shows a second and third business (engine trading/sourcing and aircraft lease brokerage) plus ISO 9001, ASA and Swiss Aerospace Cluster credentials that the site never mentions. The new site must present the whole company.
2. **The niche is winnable.** No Swiss firm and no German-language site owns "engine shop visit management"; head terms such as "engine asset management" are owned by ACC, IBA, Alton and ICF, but the specific shop-visit, workscope, redelivery and Switzerland terms have weak incumbents (06 §3.2).
3. **Proof is the whole game.** Every strong competitor (TGIS, IBA, Willis Asset Management, SGI) wins with named people, counters, case studies and certification badges. The current site has none of these (02 §10, 05 §6).
4. **Independence is the sharpest positioning available.** Most engine "advisors" are lessor-, trader- or OEM-owned. A one-line no-conflict statement, honestly reconciled with the trading activity (see §2.3), is the differentiator nobody in the benchmark states.
5. **The current site is a liability, not a base.** Polish locale and skip-link, a Polish-hosted template privacy policy naming Poland, no H1s, empty alt attributes, three phone numbers, a press photo of unclear licence, a default "Hello world!" post and bot-protection challenge pages served to crawlers. Rebuild, do not iterate (04).
6. **Keep the visual DNA, raise the craft.** Navy `#1C205C` + orange `#EE7203`, the aircraft-swoosh mark and "Keeps you flying" are good assets in a blue-grey sector. Replace stock imagery with real engine-shop photography and data graphics.
7. **Ship English first with German-ready architecture**, a lean static/edge stack, self-hosted fonts, Swiss/EU hosting, privacy-first analytics, a proper Impressum and an FADP/GDPR privacy notice.

## 2. Positioning and messaging platform

### 2.1 One-line positioning (working)
> Flight Hour Solution GmbH is an independent jet-engine management consultancy in Zug, Switzerland. We manage shop visits, protect engine value through leases and transitions, and source engines and aircraft for airlines, lessors, MROs and government operators worldwide.

### 2.2 Message pillars (each backed by 06 §5.1 sources or client facts to be supplied)

| Pillar | Headline idea | Proof needed from client |
|---|---|---|
| Independence | "We don't own shop slots, lease engines or represent an OEM. We work for you." | Confirm no MRO/OEM commissions; write conflicts policy (see 2.3) |
| Multi-million decisions | "A shop visit is a multi-million-dollar purchase. Treat it like one." | Two anonymised invoice-review outcomes |
| Capacity crunch | "We plan around the 2026–2030 engine capacity crunch, not against it." | Slot/TAT examples |
| Lease value | "Workscope discipline protects value on both sides of the lease." | Redelivery/reserve case |
| Legacy proven, new-gen fluent | CFM56/V2500 volume experience plus LEAP/GTF durability programmes | Engine-family experience per consultant |
| Data-led | "Independent read of your ECM/EHM data before the OEM tells you to pull the engine." | Sample redacted trend report |
| Swiss discretion | "Neutral ground in Zug, 30 minutes from Zurich's engine-MRO cluster." | Office/meeting arrangement |
| Senior people on the job | "Principals on site, not juniors." | Team bios with former employers (e.g. Aero Norway) |
| Government | "Independent oversight where the OEM is the only supplier." | Programme types that may be named |

### 2.3 Reconciling consulting with trading
The LinkedIn feed sells engines; the site sells advice. Buyers will notice. Three honest options, in order of recommendation:
1. **Two clearly labelled service lines under one brand:** "Advisory" (fee-only, independent) and "Assets" (engine and aircraft sourcing, sales support, listings), with a written conflicts policy ("when we broker an asset we say so; advisory clients are never sold our own inventory without disclosure").
2. A sub-brand for trading (e.g. "FHS Assets") on the same site.
3. A separate trading site (more cost, weaker SEO).

### 2.4 Naming and brand hygiene
Use "Flight Hour Solution GmbH" in the footer, Impressum and schema; "Flight Hour Solution" in prose; never "Solutions"; avoid "FHS" as a standalone mark (Airbus Flight Hour Services). Keep "Keeps you flying" as the tagline in the logo lock-up and sign-offs. Register the plural domain misspelling if available.

### 2.5 Headline options for the hero (to test with the client)
- "Your engines. Independently managed."
- "Every shop visit under control."
- "Engine management for airlines, lessors and governments — independent, senior, on site."
- "Know what your engine will cost before the MRO does." (bolder; needs proof)

## 3. Audiences and entry points

| Persona (06 §2) | Primary entry page | Primary CTA |
|---|---|---|
| Head of Powerplant / Engine Fleet Manager (airline) | Shop Visit Management; engine-family pages | "Send us your next workscope" (file upload) |
| VP Technical / CTO (airline) | Home; Industries → Airlines | "Book a 30-minute engine review" |
| Technical Asset Manager (lessor) | Lease Return & Asset Management; Industries → Lessors & Investors | "Talk to us before the redelivery clock starts" |
| Procurement / Contracts | Contracts, MRO & Supply Chain | "Benchmark your engine MRO contract" |
| Lender / investor | Technical Due Diligence | "Request our capability statement" |
| Defence programme manager | Military & Government | Dedicated contact route |
| Engine buyer/seller, broker | Assets (available engines and aircraft) | "Request records" / "Offer an asset" |
| Candidate | Careers | Application form |

## 4. Information architecture (proposed sitemap)

```
/                               Home
/services/                      Services hub (situational: buying/leasing · operating · returning · government)
  /shop-visit-management/
  /workscope-and-removal-planning/
  /lease-return-and-asset-management/
  /contracts-mro-and-supply-chain/
  /predictive-maintenance-and-analytics/
  /technical-due-diligence/
  /military-and-government/
  /training-and-knowledge-transfer/     (in the register purpose; confirm)
/assets/                        Engine & aircraft sourcing, current listings, "sell your engine"
/engines/                       Engine families hub
  /cfm56/ /leap/ /v2500/ /pw4000/ /apu-and-turboprop/   (+ later: trent, ge90, genx, cf34)
/industries/                    Airlines · Lessors & investors · MROs · Government & military
/about/                         Story, independence statement, team, memberships & certifications, Zug
/insights/                      Articles, quarterly engine-market notes, case notes
/resources/                     Glossary, checklists, tools (cost estimator, lease-return checklist)
/careers/
/contact/                       Form with attachment, booking link, WhatsApp, phone, AOG line
/impressum/  /privacy/  /cookies/
/de/…                           German mirror (phase 2; hreflang from day one)
```
Redirects: keep the five existing URLs alive (`/services/`, `/about-us/` → `/about/`, `/career/` → `/careers/`, `/contact/`, `/privacy-policy/` → `/privacy/`) and the three anchors.

## 5. Page briefs (key pages)

**Home.** Hero with one headline, one sentence, one primary CTA ("Book an engine review") and one secondary ("Send us a workscope"); a credibility strip (Swiss Aerospace Cluster · ASA member · ISO 9001 · founded 2024 in Zug · engine families covered); "Three situations we are hired for" (shop visit · lease transition · sourcing); a four-counter stats band (engines managed, shop visits overseen, engine families, countries: numbers from client); engine coverage matrix; independence statement; team preview with photos; two case notes; latest insights; contact block with named person, phone, WhatsApp, booking.

**Service page template.** Who it is for → the problem in numbers → what we do (deliverables list using the existing taxonomy from 02 §4) → how an engagement runs (timeline: pre-induction, table inspection, workscope approval, test cell, invoice reconciliation, warranty) → engine families → proof (case note, quote) → FAQ (schema) → named contact card → CTA with file upload.

**Engine family template.** Fleet context and 2026 issues (from 06 §1 with citations), typical visit types and cost drivers (ranges only where sourced), what we do for this family, related insights, CTA. Target keyword "<family> shop visit cost/workscope".

**Assets.** Filterable list of engines/aircraft available or wanted (model, ESN status, cycles/time remaining, location, availability date, contact), "sell or lease your engine" form, subscription to availability alerts, disclosure of broker role.

**About.** Story (founded 2024 by professionals from the engine-MRO world; Aero Norway and other backgrounds once confirmed), independence and conflicts policy, team cards (photo, name, title, engine families, former employers, languages, LinkedIn), memberships and certificates with numbers and PDFs, Zug and how meetings work, the legal entity block.

**Contact.** Short form (name, company, role, engine type, need, message, attachment), response-time promise, calendar booking, WhatsApp, one primary phone, AOG/urgent route, map only if there is an office, Impressum data.

## 6. Design direction

- **Palette.** Keep navy `#1C205C` and orange `#EE7203`; add a near-black text colour (e.g. `#12152E`), warm light neutrals for surfaces, one restrained data colour, and reserve orange for actions and key numbers. Fix body-text contrast (current `#494D84` body text is marginal).
- **Type.** Retire the ad-hoc 22-size scale. Self-hosted pairing with an engineering feel, for example IBM Plex Sans or Space Grotesk for headings, Inter or Source Sans 3 for body, tabular numerals for data. Keep the outlined wordmark as-is; produce mono and reversed versions.
- **Imagery.** Commission or license: engine on a stand in a shop, borescope in use, test-cell view, table inspection with parts laid out, records/documents, team portraits on site. Add line-art engine cross-sections and simple charts (TAT trends, cost drivers) generated from sourced data. Drop the Bundeswehr press photo and unlicensed stock.
- **Layout system.** 12-column grid, 1,200–1,320 px content width, generous but consistent spacing scale, cards with 12–16 px radii (less bubbly than today's 30 px), sticky header with a single orange CTA, in-page sub-navigation on long pages (MTU pattern), contact-person cards per service, stats band (IBA/SGI pattern), certification badge row (TGIS pattern).
- **Tone of the visuals.** Darker, more technical and more confident than the current pastel-light look: navy hero sections with orange accents, real machinery, real numbers, real names.
- **Motion.** Subtle reveal on scroll and counter animation only; no sliders.
- **Accessibility.** WCAG 2.2 AA: contrast, focus states, one H1 per page, alt text, keyboard-navigable menu, form labels (the current form uses placeholders only), reduced-motion support.

## 7. Content plan

**Phase 1 (launch):** Home; 7–8 service pages; 5 engine-family pages; 4 industry pages; About with at least two named people; Assets page with the current listings; Contact; Careers; Impressum, Privacy, Cookies; 6 insights articles seeded from 06 §4.3; glossary with 40 terms; two downloadable checklists (pre-induction, redelivery document pack); capability statement PDF.

**Phase 2 (first 6 months):** German mirror of core pages; shop-visit cost estimator and lease-return checklist tools; quarterly engine-market note; 2 case notes per quarter; newsletter with role segmentation; video walkthrough of a managed shop visit.

Copy rules (from 06 §5.2–5.3): plain, numerate English; every number sourced; no "world-leading", "one-stop", "holistic"; do not quote vendor cost ranges as fact; never imply approvals or clearances not held.

## 8. Conversion and lead capture
One primary CTA repeated at every scroll depth; forms with file upload for workscopes/BSI reports; Cloudflare Turnstile spam protection; calendar booking (Cal.com or Calendly) with a named consultant; WhatsApp Business with a business profile; one primary phone number; email routing to contact@ and sales@ with auto-acknowledgement; simple CRM (HubSpot free or Pipedrive) fed by the form; role-segmented newsletter; gated downloads that ask only for email and role.

## 9. Technical recommendations

| Area | Recommendation | Why |
|---|---|---|
| Platform | Static-first site (Astro, or Next.js) with content in Markdown/MDX or a small headless CMS (Sanity, Storyblok or Decap) for insights and asset listings; deploy on Cloudflare Pages, Vercel or Netlify with EU/CH edge | Tiny content team, security, speed, near-zero maintenance; escapes Elementor bloat |
| Alternative | If WordPress must stay: fresh block theme, no Elementor, Swiss host (Infomaniak, cyon, Hostpoint), WAF, staging | Only if the client insists on WP editing |
| Hosting/DNS | Leave zenbox.pl; Swiss or EU hosting; Cloudflare DNS; HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy headers | Bot-challenge pages are currently served to crawlers; no security headers today |
| Email | Business mail (Google Workspace, Microsoft 365 or Infomaniak) with SPF, DKIM and DMARC `p=quarantine` → `reject` | Today: no DKIM, DMARC `p=none` |
| Analytics | Privacy-first (Plausible or Fathom, EU-hosted) without a consent wall; add GA4 only with consent | Reduces banner friction, FADP/GDPR-friendly |
| Fonts/images | Self-hosted WOFF2; AVIF/WebP with `srcset`; lazy loading below the fold; LCP image preloaded | Current site loads 18 Nunito styles from Google and 825 KB PNGs |
| Structured data | Organization (with UID, address, sameAs LinkedIn/Zefix), ProfessionalService, Service, Person, FAQPage, Article, BreadcrumbList | Win the brand query and rich results |
| i18n | `lang="en"` now; `/de/` with hreflang later; Swiss-standard German | Current `lang="pl-PL"` is wrong |
| Legal | Impressum with GmbH, UID, address, managing director; FADP/GDPR privacy notice naming processors; cookie notice matching actual cookies | Current policy names Poland and non-existent features |
| Performance budget | LCP < 2.5 s on 4G, total page weight < 1 MB, no render-blocking third parties | Boutique credibility; Core Web Vitals |
| Search hygiene | 301 map from old URLs, XML sitemap, robots, canonicals, Search Console (already verified), Google Business Profile, LinkedIn "Website" link, Airframer/Aviation Week directory citations | Brand-name collision mitigation (06 §3.5) |
| Repository | Site source in this repo (`FHS-2` branch), CI build previews, Lighthouse CI budget check | Reviewable, reversible |

## 10. Must-fix list carried from the audit (04)
1. Remove `pl-PL` locale, Polish strings, Polish feed titles; set English (and later German) properly.
2. Replace the TermsFeed privacy policy; add Impressum and a cookie notice that matches reality.
3. One H1 per page; real heading hierarchy; alt text on every image; accessible form labels; unique IDs (the same form is embedded twice per page).
4. One primary phone number; WhatsApp and tel links in sync; LinkedIn icon must link to the company page.
5. Delete the "Hello world!" post and default author; hide WordPress user enumeration if WP stays.
6. Stop loading 18 font styles from Google; self-host two or three.
7. Compress or replace the 825 KB PNG and other oversized images; serve AVIF/WebP.
8. Remove the press photo (Bundeswehr file) and confirm Adobe Stock licences or replace.
9. Add security headers and HSTS; move off the bot-challenge host or whitelist crawlers.
10. Add Organization schema with the legal entity; fix breadcrumb "Strona główna".
11. Replace placeholder CTAs ("Discover Us" anchor to #slide, "Go to Contact" with href="#") with real destinations.
12. Add a 404 page with navigation and search.

## 11. Launch checklist and measurement
Pre-launch: redirects tested; forms deliver to inbox and CRM; DKIM/DMARC live; Search Console and Bing Webmaster verified; sitemap submitted; Google Business Profile claimed with the exact NAP; LinkedIn page updated with the same description, cover image and website link; ASA/SAC directory entries updated; Lighthouse ≥ 90 on all four categories on mobile; axe clean; WCAG spot-check with a screen reader; legal pages reviewed by counsel.
Measure monthly: brand query impressions/clicks for "Flight Hour Solution", rankings for the 10 head terms (06 §3.2), form and booking conversions by source, asset-listing inquiries, newsletter growth.

## 12. Decisions needed from the client
See 01 §9. In priority order: (1) public team and photos, (2) how to present trading and sourcing, (3) certificate and membership numbers, (4) primary phone and office/meeting policy, (5) languages, (6) client references and what may be shown, (7) military/government disclosure limits, (8) domain and email migration timing.

## 13. Suggested project plan
1. **Discovery (1 week):** answers to §12, photo shoot booked, team bios collected, asset listings exported, certificates collected.
2. **Content (2–3 weeks):** copy for all Phase-1 pages using 02 §4 taxonomy and 06 §4–5; glossary; two checklists; German plan.
3. **Design (2 weeks):** design tokens, component library, five key page designs (home, service, engine family, about, assets), mobile first.
4. **Build (3–4 weeks):** static site, CMS for insights/assets, forms, analytics, schema, i18n scaffolding, performance budget, CI previews on this repo.
5. **QA and launch (1 week):** accessibility, Lighthouse, redirects, legal, DNS/email cut-over, monitoring.
6. **Growth (ongoing):** monthly insight, quarterly market note, tools, German mirror, case notes, directory citations.
