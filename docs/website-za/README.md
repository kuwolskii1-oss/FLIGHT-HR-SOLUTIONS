# The South African website: build note

Flight Hour Solution (Pty) Ltd, beta built 25 September 2026 from
`docs/za/brief-fhs-south-africa.html` and the build prompt `docs/za/build-prompt.txt`. Source:
`site-za/app`. Live (behind the platform's sign-in until the owner opens it):
https://flighthoursolution-za.higgsfield.app

## What was made

- Eleven routes: home, five doors (Engines, Aircraft, Parts, Charter, Advisory), Engine 360 early
  access, About, Contact, Privacy notice (POPIA), Legal; plus `sitemap.xml` and `robots.txt`
  (noindex until launch).
- One form per door with the brief's fields, a POPIA consent check, routing to a proposed role
  inbox per door, a WhatsApp route when a parts request is AOG, a prepared-email fallback while no
  mail provider key is configured, and a general form and the Engine 360 waitlist.
- Navigation: five doors and About as visible links with dropdowns of their sections; the urgent
  action (AOG on WhatsApp) and the primary action (Get in touch) on every screen; a burger panel
  with an accordion per door below 1000 px; a country switch to the Swiss site.
- Motion: the scroll-craft engine (vendored unmodified under `src/vendor/scrollcraft`) drives the
  page from one scroll value. The brand ident from the two supplied clips is rebuilt as a
  scroll-driven SVG: the visitor's scrolling flies the plane along the swoosh until it locks up
  into the logo (`docs/za/ident/`). The five steps of "How we work" pin and show one step per
  screen; sections reveal once on entry; door images wipe in. UI transitions come from the
  transitions.dev token scale (dropdown, panel, icon swap, accordion, segmented tabs, error
  shake, success check, checkbox, learn-more chevron), all within the prompt's factors.
- Pages navigate as full documents with a cross-document view transition, so the engine mounts
  once per page; door pages are prefetched on hover through speculation rules.
- Reduced motion: every pinned act becomes a flowing one before the engine mounts, every cue is
  open, the ident renders finished, and nothing translates.

## Placeholders and what is not done

- Imagery: seven images are the Swiss site's generated illustrations and three were generated
  for the doors with Higgsfield (`soul_location`, 0.5 credits in total); all are placeholders
  for the client's photography, listed in `src/site/images.ts`.
- Facts the brief did not give are empty and listed in
  `site-za/content-brief/OPEN-QUESTIONS.md` (154 items, 37 of them launch blockers): address,
  phone, WhatsApp number, staffed hours, the managing director's name, the Information Officer,
  approvals, engine and aircraft coverage, regions, the relationship to the Swiss company.
- Forms deliver by prepared email until the mail provider key is set as a platform secret
  (`site-za/DEPLOY.md`).
- The reference study covers five of the seven shortlisted sites; the two motion references
  (GE Aerospace, Joby) did not complete and are noted in the blueprint.
- The content was written from the brief by one pass of writers and checked by the validator and
  a manual read; the second fact-tracing pass planned in the workflow did not complete in this
  run and remains worth doing before launch.

## Measured checks (production build served locally, 25 September 2026)

Method: `site-za/tools/qa/factors.js`, `qa.js`, `interact.js` and `forms.js` against
`node tools/qa/serve-dist.mjs app 4700` (the Worker bundle with gzip like a CDN). Widths 375,
768 and 1440 px.

| Check | Factor | Measured |
|---|---|---|
| Words per viewport-height screen, home | 60 or fewer | 41 at 1440 px and 59 at 375 px in the busiest screen (66 before the chapters were sized to a screen and three lines trimmed); door pages 71 to 125, About 165, legal pages up to 260 (long-form by design) |
| Calls to action (buttons) per screen | 1 | 1 on every page; door lists and text links reported separately |
| Headline length | 8 words or fewer | 7 at most |
| Body paragraph length | 40 words or fewer | 38 at most on the pages; the privacy notice has one paragraph of 55 |
| Longest animation | 600 ms | 560 ms (the engine's flow reveal, capped from 620) |
| Animations that block interaction | 0 | 0 (transform, opacity and filter only) |
| Reveal stagger | 80 ms or less | 70 ms |
| prefers-reduced-motion | no movement, all content visible | 0 pinned acts, 0 hidden cues, ident still |
| Scroll on touch | native, no horizontal scroll | 0 px overflow at 375 |
| Accessibility (axe-core 4.12, WCAG 2.x A/AA and best practice) | 0 violations | 0 on all 11 routes at 1440 |
| Console errors and broken links | 0 | 0 errors, 0 broken links (after allowing data-URI fonts in the CSP) |
| Time to first readable text, throttled 3G | under 2 s | 1.44 to 1.53 s on the Fast 3G profile (1.6 Mbps, 150 ms); 5.4 s on Slow 3G (400 kbps, 400 ms) |
| Page weight without video | under 1 MB | 312 to 418 KB transferred per page at 375 px |
| Keyboard | every action reachable, menu traps focus, Escape closes | skip link, dropdowns, panel trap, Escape and accordion all pass |
| Facts | every figure traces to the brief | the only figures are the registration number and the year; sources are recorded per block in the content files |

## Deployment record

- Site record `36a9708e-a93f-4760-bcbe-e2528e1a0b17`, slug `flighthoursolution-za`, created
  25 September 2026 05:13 UTC with the `scroll-scrub` website template; the template's `app/`
  was replaced wholesale by `site-za/app` (only `app/packages` is the platform's).
- Deploys: 05:33 UTC (first), 05:41 UTC (CSP font rule, link-only closings on form pages,
  reduced-motion flow, 560 ms reveals), and the final one at the time recorded in the git log of
  this file (full-screen home chapters, trimmed home copy, uncontrolled segmented radios).
- Raw measurements: `factors-run3.json` (all routes), `factors-home-final.json` (home after the
  last trim), `qa-report.json` (axe, console, weight per route).
- Runbook: `site-za/DEPLOY.md`. Higgsfield credits used by this build: 0.5 for three images.

## Finding on the Swiss site

The same Content-Security-Policy refusal of the template's inlined IBM Plex Mono data-URI fonts
applies to `site/app` (its `font-src` lacks `data:`), so its live pages log the same console
errors. One-line fix in `site/app/src/lib/security-headers.server.ts`; not applied here because
this run did not touch the Swiss site.
