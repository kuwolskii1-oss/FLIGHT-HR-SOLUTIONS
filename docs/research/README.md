# Flight Hour Solution GmbH — research dossier

Prepared 19 September 2026 as the foundation for a new website for **Flight Hour Solution GmbH**, Zug, Switzerland (flighthoursolution.com). The repository name says "HR"; the company is **Flight *Hour* Solution**, an independent jet-engine management consultancy, not a human-resources firm.

## Documents

| # | File | What it contains |
|---|---|---|
| 01 | [01-company-profile.md](01-company-profile.md) | Legal identity (UID CHE-196.248.398, GmbH founded Sept 2024), owners and managers from the commercial register, timeline, what the company really does (consulting plus engine/aircraft trading), memberships and certifications, digital footprint, discrepancies, open questions for the client |
| 02 | [02-website-content-inventory.md](02-website-content-inventory.md) | Sitemap and metadata, every page's copy verbatim, forms, CTAs, copy-quality issues, content worth keeping |
| 03 | [03-brand-assets.md](03-brand-assets.md) | Logo, favicon, palette (navy `#1C205C`, orange `#EE7203`), typography (Nunito), components, imagery inventory with licensing flags |
| 04 | [04-technical-audit.md](04-technical-audit.md) | Stack and hosting, DNS/email, security headers, SEO, HTML validity, accessibility, UX, measured performance, privacy/legal, ranked issue list |
| 05 | [05-competitor-benchmark.md](05-competitor-benchmark.md) | 17 competitor and benchmark sites (TGIS, SGI, mba, Willis Asset Management, IBA, Swiss players, Airbus FHS, MTU…), comparison table, best-designed sites and why, niche vocabulary, positioning gaps, trust-signal checklist |
| 06 | [06-market-context-and-seo.md](06-market-context-and-seo.md) | Sourced 2025–2026 engine-MRO market facts, buyer personas, 46 English + German keywords with SERP competition, content strategy (pillars, service pages, 20 article topics, tools, glossary), messaging inputs |
| 07 | [07-recommendations-and-brief.md](07-recommendations-and-brief.md) | Positioning, sitemap, page briefs, design direction, content plan, conversion, technical stack, must-fix list, launch checklist, decisions needed, project plan |
| 08 | [08-locomotive-design-blueprint.md](08-locomotive-design-blueprint.md) | Design benchmark: profile of the Montreal agency Locomotive (Awwwards Agency of the Year 2018–2024), a 22-site shortlist of their best work, their own token system read from their stylesheet, measured typography, colour, layout, motion and tooling data per site (headless Chromium + static analysis), a 12-rule pattern library, and the resulting blueprint for the Flight Hour Solution site: tokens, type ramp, motion rules, page choreography, component list, accessibility and performance budgets, stack |

Supporting material: `assets/brand/` (logo, favicon, icons), `assets/screenshots/` (desktop and mobile captures of every page, taken from a byte-exact mirror of the live site because the host's bot protection breaks live captures), `assets/site-archive/` (plain-text copy of every page and the Elementor kit CSS), `data/` (WordPress REST exports, commercial-register JSON and SOGC XML, validator output, certificate log, Wayback index). For the design benchmark: `assets/locomotive/` (first-view, second-view, menu and full-page captures of the shortlisted Locomotive sites, desktop and mobile) and `data/locomotive/` (per-site measurement JSON, static-analysis results, Awwwards records, and the extraction scripts in `tools/`).

## Eleven things to know

1. Flight Hour Solution GmbH was registered in Zug on 26 September 2024 with CHF 20,000 capital by Hubert Nowosad (Polish national, Dielsdorf ZH) and Stefan Kühne-Zabre (German national, Thalwil ZH). Since July 2025 Hubert Nowosad is the sole owner and managing director.
2. The registered purpose is consulting, technical expertise, training, cost optimisation and financial planning in the aviation industry. Public evidence adds engine trading (CFM56, Trent, PT6A engines offered for sale in 2026) and aircraft sourcing (two 737-800s sought on dry lease).
3. Credentials the website never mentions: Swiss Aerospace Cluster member (Nov 2025), ISO 9001 (claimed May 2026), Aviation Suppliers Association member (claimed July 2026).
4. The website (WordPress + Elementor, launched 3 December 2024, hosted in Poland) is set to Polish locale, uses a template privacy policy naming Poland, has no H1s, no alt text, no named people and three different phone numbers.
5. Service content is the one strong asset: a specific taxonomy (shop visit management, workscope, table inspection, borescope analysis, LLP back-to-birth audits, maintenance reserves, contract negotiation) across CFM56, LEAP, V2500, PW4000, Honeywell APU and turboprop families.
6. No Swiss consultancy and no German-language site owns "engine shop visit management"; the terms with weak incumbents are listed in 06 §3.2.
7. The best-designed direct competitor is TGIS Aviation (situational service pages, case studies with dollar figures, certification badges); IBA, Willis Asset Management, SGI and MTU supply the other patterns worth borrowing.
8. Engines are now the largest, fastest-growing part of a roughly US$136–140 bn MRO market, with shop-visit turnaround times up 35 % (legacy) to 150 % (new-generation) and capacity constrained to the end of the decade (sources in 06 §1).
9. Independence, Swiss neutrality, a Military & Government line, German language and real proof are the open positioning gaps.
10. Recommendation: rebuild rather than iterate: static-first stack, Swiss/EU hosting, English first with German-ready architecture, a content programme built on the existing taxonomy, and the client decisions listed in 01 §9 / 07 §12.
11. Design benchmark (08): the new site borrows Locomotive's system rather than any single site: an eight-step spacing scale, a 12-column fluid grid with 700/1000/1200 px breakpoints, one grotesk plus one mono face with a single very large display step, a two-colour palette with orange as the only accent, GSAP + Locomotive Scroll choreography at 0.15/0.3/0.6/0.9 s with their ease-out-cubic curve, and a deliberately higher accessibility and performance floor than the agency's own award-winning work.

## Skills installed for this project
Third-party agent skills were installed into `.claude/skills/` with the `skills` CLI (versions pinned in `skills-lock.json`): frontend-design (Anthropic), web-design-guidelines (Vercel), research (mattpocock), seo-audit, copywriting and customer-research (coreyhaines31), design-taste-frontend and brandkit (leonxlnx), audit-website (squirrelscan), landing-page-conversion-audit (autonnel), competitive-analysis (claude-office-skills). For the design phase a second set was added: build-awwwards-quality-sites and animation-on-scroll (mengto), gsap-core (GreenSock), motion-design (LottieFiles), design-motion-principles (kylezantos), better-typography (jakubkrehel), design-tokens (julianoczkowski), design-critique (owl-listener), extract-design-system (arvindrk), threejs-webgl (freshtechbro), and design plus design-system (nextlevelbuilder). They are reference instructions for the build phase; review before relying on them.

## The website itself

The site built from this research lives in [`site/`](../../site/README.md) (Higgsfield-hosted React 19 + TanStack Start project, design tokens, components, routes, content and generated assets). Build notes, platform deviations and the client decisions still open are in [`docs/website/README.md`](../website/README.md).
