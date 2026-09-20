# Website build notes

Companion to the research dossier (`docs/research/`) and the site source (`site/`). Written
19 September 2026 during the first build; the sections marked "measured" are filled from the
local quality run.

## What was built

A complete, content-rich site for Flight Hour Solution GmbH on the Higgsfield website platform,
designed from the Locomotive blueprint (`docs/research/08-locomotive-design-blueprint.md`):

- Home page opening on a scroll-driven film: one continuous 15 second take of a turbofan on its
  maintenance stand, generated from a storyboard and cut into five segments, with five chapters
  of copy read over it (the company, the purchase, the workscope, the evidence, the base). Then a
  proof strip with verifiable figures, three situations, the eight services as ruled rows, the
  five engine families beside a cross-section drawing, the five steps of a managed shop visit
  with a progress rule, the independence statement, the person who does the work, the latest
  insights, questions and a closing statement.
- Services hub and eight service pages (deliverables from the existing taxonomy, sourced problem
  figures, engagement steps, FAQ with schema, related services).
- Engine families hub and five family pages (models, fleet context with sourced figures, visit
  types, cost drivers, what we do).
- Industries hub and four entry pages (airlines, lessors and investors, MROs, government and
  military).
- About (story, independence and conflicts policy, team, credentials with verified or claimed
  status, Zug, legal entity), Assets (the sourcing line with its disclosure, how it works, recent
  activity, request form), Insights (six technical notes with sources), Glossary (forty terms),
  Careers, Contact (form with a server function and an email fallback, direct channels, urgent
  route), Impressum, Privacy (FADP and GDPR), Cookies.
- Structured data (Organization, ProfessionalService, Person, WebSite, Service, Article,
  FAQPage, ContactPage), canonical URLs, Open Graph and Twitter cards, robots and sitemap
  routes, security headers, legacy redirects from the old site's addresses.

## Design system as implemented

Tokens in `site/app/src/site/tokens.css`: the brand navy `#1C205C` and orange `#EE7203`, ink,
paper, muted and line colours with computed contrast; a fluid Utopia type ramp from 17 to 19 px
body up to a 148 px display step; the eight-step spacing scale; durations 150/300/600/900 ms and
the ease-out-cubic and ease-out-quint curves; breakpoints 700/1000/1200 with base-size steps at
1600 and 2000 px. Type: self-hosted IBM Plex Sans and Mono. Components follow the blueprint's
list (ruled rows, stat strip, media frame, steps with progress rule, statement bands, person
card, index grid, page intro, local navigation, forms with labels above inputs). Motion: Lenis
smooth scroll bridged to GSAP; transform-only reveals; line-split headings; everything off under
`prefers-reduced-motion`, where the film is never fetched and the chapters read as a static page.

## Platform choice and deviations from the blueprint

The blueprint recommended Astro. At the client's request the site was built and hosted with the
Higgsfield website tools, whose stack is React 19 + TanStack Start on a Cloudflare Worker. The
design system is stack-agnostic and was carried over unchanged. Two consequences:

1. The home page carries a film (7.5 MB across five desktop segments, 4.6 MB mobile) that the
   blueprint's one-megabyte page budget did not foresee. The engine streams segments lazily, the
   first paint is a still, the LCP element is the headline, and reduced-motion users never fetch
   video. Every other page stays inside the budget.
2. Deploys ship to `flighthoursolution.higgsfield.app`. During this build the address answered
   HTTP 401 ("unauthenticated") to visitors who are not signed in to Higgsfield, both from the
   build environment and from Higgsfield's own sandbox, and the same was true of the earlier
   review site at `flight-hour-solution.higgsfield.app`. The site owner can open it while signed
   in; sharing it with third parties, and moving it to `flighthoursolution.com`, are questions for
   the Higgsfield side (publishing to their community feed was not done, as it makes the site
   public on their marketplace).

## Deployment record

- Higgsfield website id `48176c0d-f47e-45a3-936f-789c3cdf7424`, slug `flighthoursolution`, live at
  `https://flighthoursolution.higgsfield.app`. The platform repository holds the mirror of
  `site/app` (commit "Build the Flight Hour Solution website", 20 September 2026, on top of the
  scaffold and film-asset commits); its CI ran install, typecheck, lint, tests and the production
  build and reported the deploy as live at 09:58 UTC.
- The address still answers HTTP 401 ("unauthenticated") to anyone not signed in to Higgsfield,
  so the live pages could not be inspected from outside; every check in this document was made
  on the identical local build. Opening the site to the public (and the move to
  `flighthoursolution.com`) is a platform-side step for the account owner.
- The site is not listed on the Higgsfield community feed or entered in any contest.
- Generation spend in this build session: 210.5 Higgsfield credits (the eleven illustration
  renders and one wide render, 28.5; the fifteen-second film and one test clip, 182); the
  account held 2,319 credits afterwards.

## Content provenance

Every copy file in `site/app/src/content/` was written from the research dossier under the
rules in `site/content-brief/VOICE-AND-FACTS.md`, with sources recorded in the files and open
points listed in `clientToConfirm` arrays (not rendered). Nothing was invented: no client names,
no testimonials, no statistics without a source, no years-of-experience claim for a company
founded in 2024, no certification presented as verified unless the register or the directory
confirms it.

## Build details worth knowing

- Content is JSON per page under `site/app/src/content/`, typed in `src/site/types.ts` and loaded
  through one module per file (`src/site/data/*.ts`). Routes read their page's module in a
  loader and in the component, and the router splits loaders as well as components into their
  own chunks (`codeSplittingOptions` in `vite.config.ts`), so a page's copy travels in that
  page's chunk and the entry bundle carries only the shared `site.json`. A small Vite transform
  strips the editorial fields no page renders (`sources`, `notes`, `clientToConfirm`) from the
  JSON at import time; the files on disk keep them as the audit trail.
- The stylesheet keeps the platform's Quanta Tailwind entry wired (the template requires it) but
  limits utility generation to the files the site renders, which took the shipped CSS from 82 kB
  to 54 kB gzipped. The site's own layer (`src/site/tokens.css`, `fonts.css`, `site.css`) is
  unlayered CSS with zero-specificity element resets (`:where(html.site …)`) so component rules
  always win.
- Route files carry no raw colour literals (the platform's `check:ui` gate); the browser theme
  colour lives in `src/site/config.ts` with the site URL, names and the `INDEXABLE` switch that
  drives robots, sitemap and the `noindex` meta until the launch domain is live.
- Redirects handled in the Worker (`src/server.ts`): trailing slashes, the old site's addresses
  (`/about-us`, `/career`, `/privacy-policy`, `/resources/glossary`) and the scaffold's `/app`.
- The contact and asset forms are one component that renders whichever fields its content file
  lists (the contact form: name, company, email, phone, role, engine family, need, message; the
  asset form: name, company, email, asset type, engine or aircraft type, offered or wanted,
  message). Both post to a server function that sends through Resend when the `RESEND_API_KEY`,
  `ENQUIRY_TO` and `ENQUIRY_FROM` bindings exist and otherwise hand the visitor a prepared email
  (mailto) with the same fields, so the form never dead-ends. A hidden honeypot field filters
  automated submissions. The key is set with the platform's secrets tool, never in source.
- Motion is split in two: a root provider that only runs Lenis and the GSAP ticker, and a
  route-level component that wires reveals, the steps progress rule and split headings after
  hydration, keyed on the pathname. This is what removed the hydration mismatches an earlier
  version produced.

## Quality checks (measured)

Run on 19 September 2026 against the local build (`bun run typecheck`, `lint`, `test`, `build`
all clean; the build runs the platform's `check:ui` gate first) and a Playwright pass over every
route at 390, 700, 1000 and 1440 px:

- Accessibility: axe-core 4.10 (WCAG 2.0/2.1/2.2 A and AA plus best practice) reports zero
  violations on every route after three fixes made during the pass (definition-list order in the
  stat strip, heading order on the hub pages, contrast of the orange stat unit on light
  sections).
- Keyboard: skip link moves focus to the main landmark; the header links, call-to-action and menu
  button are reachable in order; the menu is a modal dialog that traps focus, closes on Escape
  and returns focus to its button; the form reports validation errors on submit.
- Reduced motion: no hidden reveals, the steps rule reads complete, Lenis is not started and the
  film is not fetched.
- Header: the theme probe switches the header between light, dark and deep sections on every
  page type; the header hides on scroll down and returns on scroll up.
- Hydration: zero React hydration warnings on all routes.
- Weight, home page, production assets: five desktop film segments 7.5 MB in total (mobile
  segments 4.6 MB), fetched progressively and within the platform's 32/16 MB ceilings; images
  0.7 MB across the page (0.45 MB on mobile); fonts 164 kB (four Plex files on the first
  paint); CSS 54 kB gzipped; JavaScript 103 kB gzipped for the entry (React, the router, the
  scroll engine, header and footer) plus the page's own chunk (home 16 kB of copy; the largest,
  the services pages, 54 kB before compression) with GSAP and Lenis loaded after hydration.
  Other pages carry no film.
- Redirects, robots, sitemap, 404 pages for unknown services, engines, industries and articles,
  and the security headers (CSP with `media-src blob:`, HSTS, nosniff, referrer and permissions
  policies) were checked by request.

## Decisions the client must take before launch

The full list of points the copy leaves open, page by page, is in `open-questions.md` beside this
file. The six that gate a launch:

1. The single phone number (three are in circulation) and whether WhatsApp moves to it.
2. Whether the Assets line (engine and aircraft sourcing) is presented publicly and under what
   disclosure wording; whether the advisory line is fee-only.
3. Certificates and membership numbers for ISO 9001 and the Aviation Suppliers Association, so the
   claims can move from "claimed" to "verified".
4. Portrait, biography and named former employers for the managing director; any other named
   people.
5. Real photography to replace the generated illustrations, and the house number of the office.
6. The email provider key for the contact form (or a preferred CRM), and the launch domain.
