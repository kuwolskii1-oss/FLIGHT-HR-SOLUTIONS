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

Supporting material: `assets/brand/` (logo, favicon, icons), `assets/screenshots/` (desktop and mobile captures of every page), `assets/site-archive/` (plain-text copy of every page and the Elementor kit CSS), `data/` (WordPress REST exports, commercial-register JSON and SOGC XML, validator output, certificate log, Wayback index).

## Ten things to know

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

## Skills installed for this project
Third-party agent skills were installed into `.claude/skills/` with the `skills` CLI (versions pinned in `skills-lock.json`): frontend-design (Anthropic), web-design-guidelines (Vercel), research (mattpocock), seo-audit, copywriting and customer-research (coreyhaines31), design-taste-frontend and brandkit (leonxlnx), audit-website (squirrelscan), landing-page-conversion-audit (autonnel), competitive-analysis (claude-office-skills). They are reference instructions for the build phase; review before relying on them.
