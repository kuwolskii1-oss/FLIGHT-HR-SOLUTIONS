# IBA (www.iba.aero): reference record

Studied 25 September 2026 with Playwright (Chromium, desktop UA at 1440 x 900, iPhone UA at 390 x 844, plus a run with `prefers-reduced-motion: reduce` emulated). Site type: aviation data platform plus advisory (valuations, consulting, asset management, technical, remarketing). Audience overlaps with the client's Advisory and Aircraft doors: lessors, financiers, airlines, MROs. Stack observed: WordPress theme by an agency, Swiper for carousels, three.js for the hero, no GSAP, Lenis, Locomotive or Framer.

Pages studied: home (`/`) and the Advisory Services hub (`/advisory-services/`).

Screenshots

| View | File |
|---|---|
| Home, desktop, first viewport | [shots/iba-home-desktop-fold.png](shots/iba-home-desktop-fold.png) |
| Home, desktop, full page | [shots/iba-home-desktop-full.png](shots/iba-home-desktop-full.png) |
| Home, desktop, mega menu open | [shots/iba-home-desktop-hover-1.png](shots/iba-home-desktop-hover-1.png) |
| Home, desktop, services block just after scrolling into it, and 1.2 s later | [shots/iba-home-desktop-services-early.png](shots/iba-home-desktop-services-early.png), [shots/iba-home-desktop-services.png](shots/iba-home-desktop-services.png) |
| Home, desktop, reduced motion emulated | [shots/iba-home-desktop-rm-fold.png](shots/iba-home-desktop-rm-fold.png) |
| Home, mobile, first viewport | [shots/iba-home-mobile-fold.png](shots/iba-home-mobile-fold.png) |
| Home, mobile, full page | [shots/iba-home-mobile-full.png](shots/iba-home-mobile-full.png) |
| Home, mobile, menu open | [shots/iba-home-mobile-menu.png](shots/iba-home-mobile-menu.png) |
| Home, mobile, reduced motion | [shots/iba-home-mobile-rm-fold.png](shots/iba-home-mobile-rm-fold.png) |
| Advisory, desktop, first viewport and full page | [shots/iba-advisory-desktop-fold.png](shots/iba-advisory-desktop-fold.png), [shots/iba-advisory-desktop-full.png](shots/iba-advisory-desktop-full.png) |
| Advisory, mobile, first viewport and full page | [shots/iba-advisory-mobile-fold.png](shots/iba-advisory-mobile-fold.png), [shots/iba-advisory-mobile-full.png](shots/iba-advisory-mobile-full.png) |

Note on the full-page captures: the browser's full-page stitch caught a mega menu panel in a half-open state at the top of the Advisory capture. That ghosting is an artefact of the capture, not something a visitor sees.

## 1. Navigation model

Desktop (1440). A white sticky header, 61 px tall, `position: sticky`, no shadow, no shrink or colour change on scroll (measured at scrollY 400 and 7000: same height, same background). Left: logo (links home). Centre: seven primary items, `14px/22px` weight 500: Digital Solutions, Advisory Services, Industries, Resources, About (each with a chevron and a mega menu), then Events and Contact as plain links. Right: search icon, language switch (EN, JA, ZH via Weglot), and a filled pill button "Login" in the accent blue `rgb(64,79,217)`, radius 100 px, padding 0 20 px.

The only accent-coloured action in the header is Login, which is a product action for existing customers. Contact is a plain text link at the end of the primary list. There is no urgent channel (no phone, no WhatsApp, no "speak to someone" in the header). Contact is reached by the header link on every page, and each service page ends in a "Speak to the team" banner with one "Get in touch" button.

Mega menus open on hover as a white panel 1300 px wide with 20 px radius below the header, transition `visibility 0s, opacity 0.4s linear`. Layout: a left column with the section name as a small blue tab, a 3 to 4 line intro paragraph (`18px/24px` weight 300) and a pill button, then a two-column grid of child links where every child has a bold title (`14px/22px` weight 700) and a one-line excerpt (`14px/18px` weight 300, navy). In total 66 links become visible across the five panels; the Advisory panel nests a third level (Asset services > Technical, Remarketing, Asset management). A blue 2 px bar above the active primary item shows which panel is open.

Mobile (390). Logo left, three-line burger right, no visible contact or phone in the bar. The menu is a `position: fixed` white panel that slides in from the right (`left: 100%` to `0`, `transition: left 0.2s ease`, panel 390 x 783 px). It lists the primary items as full-width rows 60 px tall; tapping one slides in a nested level with a "Back" row at the top, and the Advisory branch is three levels deep. Body scroll is not locked while the menu is open (`body { overflow: visible }`). Contact is the last row of the top level, so it needs a scroll of the panel on a short phone.

## 2. Home page: section order and the job of each section

Measured section tops and heights at 1440 (desktop) and 390 (mobile), from `getBoundingClientRect`.

| # | Section (class) | Desktop top / height | Mobile top / height | Job | Words | CTAs |
|---|---|---|---|---|---|---|
| 0 | Header | 0 / 61 | 0 / 61 | Route | 9 | 10 links (desktop) |
| 1 | Teaser strip (`home-banner--articles`) | 61 / 132 | 61 / 127 | Four latest content cards (a demo request, a webinar, two market news items), each a thumbnail, a category label and a title | 45 | 4 |
| 2 | Hero (`home-banner`) | 193 / 686 | 188 / 552 | Slogan headline, one sentence of positioning, one pill button | 47 | 1 |
| 3 | Two-column intro | 879 / ~200 | 740 / 183 | h2 left, one paragraph right: what the company is | 27 | 0 |
| 4 | Product panel | ~1080 / ~500 | 923 / 615 | The data platform: blue card, screenshot, two buttons | 36 | 2 |
| 5 | Product cards, 2 x 2 | ~1580 / ~560 | 1538 / 679 | Four platform modules, each a blue card with screenshot and one line | 33 | 4 |
| 6 | Services list (`repeating-blocks`) | 2145 / 1808 | 2216 / 1966 | Four advisory lines as photo plus text rows, each with a "Learn more" link | 69 | 4 |
| 7 | Industries carousel (Swiper, 4 slides) | 3953 / 1955 | 4183 / 700 | Who they serve: full-bleed portrait photo per industry with a label and "Learn more" | 28 | 5 |
| 8 | Logo marquee and testimonial carousel (Swiper, 40 logos, 7 quotes) | ~5900 / ~800 | 5013 / 640 | Proof: client logos, then a quote with name, title and client logo | up to 95 per quote | 0 |
| 9 | Sign-up banner | 6831 / 357 | 5684 / 472 | Newsletter, one button | 23 | 1 |
| 10 | Footer (navy) | 7278 / 688 | 6187 / 713 | Three award badges, sitemap, social, company number | 54 | 30 |

Page length: 7967 px at 1440 (8.9 viewports), 6870 px at 390 (8.1 viewports).

First viewport, measured with `checkVisibility` plus `elementFromPoint` so hidden menu panels are excluded:

- Desktop: 74 words visible, of which 45 belong to the teaser strip, 9 to the header and 20 to the hero (a three-word headline, a 14-word lead, a three-word button). Clickable elements: 15 (10 in the header, 4 teaser cards, 1 hero button). Visually styled buttons: 2 (Login pill in blue, "Ask us anything" pill in white).
- Mobile: 56 words visible (teaser strip shows one card, hero, and the start of the next h2). Styled buttons: 1 (hero pill). Clickable: 6 including the cookie button.

Calls to action per viewport further down: sections 4, 5 and 6 show 2 to 4 links per viewport on desktop (each card or row has its own "Learn more"); the industries carousel shows 2 to 3; sections 3, 8 and 9 show 0 to 1. No screen has two competing filled buttons except the product panel (a filled "Book a demo" next to a text link).

## 3. Type

Families: AvenirPro (self-hosted, weights 300, 350, 500, 600, 700, 800 all in use) for everything; Source Sans Pro appears only for the hidden hero statistic figures (39 px, weight 400). Total font transfer 74 KB.

Sizes actually used (computed styles, most frequent first):

| Role | Desktop | Mobile |
|---|---|---|
| Hero headline (h1) | 85px / 95px, 800 | 40.9px / 45.65px, 800 |
| Page headline on Advisory (h1) | 50px / 55px, 800 | 30px / 36px, 800 |
| Section heading (h2) | 32px / 38px, 600 (some 800) | 24px / 29.6px, 600 |
| Service row title (h3) | 28px / 36px, 800 | 26px / 31px, 800 |
| Card title (h3) | 22px / 29px, 800, letter-spacing -0.22px | 18px / 23px, 800 |
| Lead / menu intro | 18px / 24px, 300 | 18px / 23px, 300 |
| Body | 16px / 22px, 300 | 16px / 22px, 300 or 350 |
| Small body, excerpts, list items | 14px / 18px or 14px / 20px, 300 | same |
| Nav and buttons | 14px / 22px, 500 (buttons add 0.42px tracking) | same |
| Labels (teaser category, footer headings) | 14px, 600 or 12px / 14.4px, 300 | same |

Observations: the body weight is 300 at 14 to 16 px on white, which is light for a trust-critical B2B site; the scale jumps from 32 to 85 px with nothing between on the home page; no uppercase eyebrows or tracking are used, hierarchy comes from weight (300 vs 800) and colour (black, navy `rgb(11,39,87)`, accent blue).

Measure: the two-column intro paragraph runs about 570 px wide at 16 px, about 70 characters per line; menu intro paragraphs 290 px at 18 px (about 32 characters); service row copy about 380 px (about 45 characters).

Spacing and grid: container 1400 px with 50 px side padding (1300 px content), some elements 1380 to 1440 wide; every content block has `padding-top: 90px` and no bottom padding on desktop, `padding-top: 31.2px` on mobile, so the vertical rhythm is one value repeated. Mobile gutter is 20 px (350 px content). Cards use a 20 px radius, buttons 100 px (pills); card grid gap is 10.55 px on mobile and 30 px in the sign-up grid. There is no visible column grid; sections are one column, two columns, or a 2 x 2 card grid.

## 4. Motion

Libraries: none of GSAP, ScrollTrigger, Lenis, Locomotive or Framer are present (checked on `window` and in all script text). `main.js` (529 KB) bundles Swiper and a small IntersectionObserver reveal class (threshold 0.15, 100 ms delay, adds `.in-view` once, then unobserves). `intro.js` (410 KB) is a three.js build (ShaderMaterial, PointsMaterial, WebGL) that draws the hero particle world map.

On load

- The hero canvas animates continuously: 61 `requestAnimationFrame` calls per second measured after load, and 549 to 637 frames requested before the page settled. It never stops.
- Four hero statistic cards (`home-banner--stat`) are authored with `opacity: 0; filter: blur(10px); transform: translateY(20px); transition: opacity .5s, filter .5s, transform .5s` and an `.is-active` state that would show them one at a time. Observed for 12 seconds after load on desktop: none ever became active, so the figures ("Aircraft on record 93k", "MSN-level data points +200", a flights counter reading 0) never appear. Content is shipped and hidden.
- Cookie banner: `onetrust-fade-in 0.4s ease-in-out` and a floating button intro of 0.8 s (third party).

On scroll

- Reveal CSS exists: `.in-view { animation: .6s both fadeInUp }` (opacity 0 to 1, translateY 40 px to 0) and a 1 s `fadeIn` variant. During a full slow scroll of both pages at both widths, zero elements received `.in-view` and zero opacity or transform values changed (3000 elements sampled before and after). In practice the site has no scroll reveals; everything is in its final state in the first frame. The reveal system is dead code.
- Header does not change on scroll.
- Scrolling is native. `html { scroll-behavior: smooth }` smooths anchor jumps only. No scroll-jacking, no pinned sections, no horizontal scroll on touch (the carousels are Swiper and drag within their own box).

Hover and feedback (computed transitions)

- Card images: `transform 0.5s ease`, scale to 1.05 on hover (measured `matrix(1.05, ...)`).
- Backgrounds and colours: `0.3s ease-in-out` (33 elements), borders `0.5s ease`.
- Mega menu: `opacity 0.4s linear` with visibility.
- "Learn more" arrow links: no transition at all (`0s`), the arrow does not move.
- Mobile menu slide: `left 0.2s ease` (animating `left`, not `transform`).
- Two elements use `transform 0.6s ease` (the cookie button flip).

Carousels: industries (4 slides), logo marquee (40 slides, autoplay with a 1 ms delay, i.e. a continuous linear marquee that loops for ever), testimonials (7 slides with arrows). The marquee is the one thing that loops.

Reduced motion (emulated `reduce`): the particle canvas keeps running (242 frames requested in 2 s), the marquee keeps looping, no theme rule adjusts anything. The only `prefers-reduced-motion` rules in the CSS belong to the bundled video player, and the flag in `main.js` is read by a UI library for its own components. Screens under reduced motion are identical to the default.

Verdict on purpose: the hero particles decorate; the hover scale decorates; no motion shows where something came from or points to the next step. The one reveal system that could have paced the page is not wired up. The site is fast to read because nothing is hidden, but motion contributes nothing to orientation.

## 5. Image treatment

- Photography: stock (file names begin `shutterstock_`), used in two ways. In service rows it sits inside a 20 px radius box at about 520 x 293 px on desktop next to text, never behind it. In the industries carousel it is a full-bleed portrait slide (about 1300 x 780 px on desktop) with a darkened bottom band and a white label plus "Learn more" in the corner.
- Product imagery: screenshots of the data platform on blue cards (`rgb(64,79,217)`), white text on the blue, no text over the screenshot.
- Hero: no photograph. A navy to blue gradient with a generated particle world map drawn in WebGL; white headline and lead sit directly on it. Readable, but the canvas costs 410 KB of script and a permanent animation loop.
- Illustration: two diagonal brand slashes (blue and light blue) reused as a motif on the sign-up banner and testimonial card.
- Film: none on home or Advisory (a YouTube API script loads anyway).
- Logos: client logos in a marquee, three award badges in the footer; several are unoptimised PNGs (a 409 KB logo, an 818 KB PNG).

Mobile weight of the home page at 390 px, all resources after network idle: 5.52 MB transferred over 128 requests. Split: images 2.87 MB, scripts 1.92 MB, stylesheets 406 KB, document 151 KB, fonts 74 KB, XHR and fetch 103 KB. Largest single files: 818 KB PNG (testimonial logo), 529 KB `main.js`, 410 KB `intro.js`, 409 KB PNG logo, 248 KB PNG logo, 210 KB and 174 KB JPEGs, 205 KB theme CSS, 117 KB CSS of language flags. Ten analytics and tag scripts load (GTM, two gtag containers, LinkedIn Insight, Pardot, Clarity, Crazy Egg, Matomo, Ahrefs, Cloudflare beacon) plus the cookie SDK. Desktop weighs 4.54 MB; mobile is heavier because the carousel logo PNGs are served at full size. The Advisory page weighs 3.0 MB at either width.

## 6. Trust devices

Present

- Client logo marquee (airlines, lessors, banks and manufacturers are recognisable).
- Seven testimonials, each with the quote, the person's name, their job title and the client logo.
- Three award badges in the footer with the award name and the years won; the Advisory h1 and every service intro repeat "award-winning".
- Footer line with the founding year span, the company registration number and the agency credit.
- A teaser strip of dated market intelligence above the hero: shows the company is active this week.
- On Advisory: each service row lists six to seven concrete deliverables (appraisal types, lease rates, inspections, redelivery), which reads as competence more than adjectives do.
- Header language switch (EN, JA, ZH) implies international reach.

Missing on these two pages

- No physical address or phone number anywhere on home or Advisory; the footer has no address block.
- No people: zero photographs of staff on home or Advisory (an "Our people" page exists behind About).
- No numbers: the statistic cards that would carry the proof figures are hidden by the defect described in section 4.
- No accreditations named in plain terms (memberships, ISO, regulator approvals are not on these pages).

## 7. Ten-second test

The visitor learns that IBA sells aviation data and advice from the navigation labels and the fourteen-word lead sentence, not from the hero, because the headline is a slogan and a strip of four news cards above it competes for the first glance.

## Patterns worth borrowing for Flight Hour Solution South Africa

1. Door descriptions inside the menu: every child link carries a bold name and a one-line excerpt of what it does. For five doors this lets a lessor or a pilgrimage group self-route from the menu without a click.
2. One service row template on the hub page: photo in a box, name, one plain sentence, a short list of concrete deliverables, one link. Repeated identically for each service line, it looks like a catalogue and reads as competence. Suits the Engines, Aircraft, Parts and Advisory doors.
3. Every service page ends with the same "speak to the team" banner and a single button. Replace the newsletter sign-up with the door's form plus the WhatsApp link.
4. Named testimonials with job title and organisation. Only if the client supplies real ones; never invented.
5. A registration line in the footer (name, number, years). The client's version should add the physical address, since South African law and the brief require it.
6. Everything readable in the first frame. Whatever the reveal grammar, the client's page must pass the same test: text visible without JavaScript or before it runs.
7. Slim sticky header at about 60 px with the logo returning home, one filled pill for the primary action. For the client that pill should be the contact or WhatsApp action, not a login.

## Patterns to avoid

1. A news or content strip above the hero. It pushes the message 130 px down and adds 45 words before the headline.
2. A slogan headline. The client's first viewport must say what the company does and which door to take.
3. A WebGL particle hero: 410 KB of script, a permanent 60 fps loop, no reduced-motion handling, and it says nothing. The client's motion budget should go to reveals that pace the doors.
4. Shipping a reveal system and not wiring it, or wiring reveals so that content can stay hidden (the statistic cards). Reveals must degrade to visible.
5. Body copy at weight 300 and 14 px. Use 400 at 16 px minimum for South African phones in sunlight.
6. 5.5 MB on mobile and ten tracking scripts. The brief's data-cost target rules this out; budget images per section and use one analytics tag.
7. Contact as a plain text link while the accent pill goes to Login. The urgent channel must be the accent.
8. A mega menu with 66 links and three nested levels on mobile with "Back" rows; body scroll left unlocked behind the open menu. Five doors plus About fit in one flat panel.
9. Animating `left` on the mobile menu and `all` on several elements; use transform and opacity only.
10. Unoptimised PNG logos and a language flag stylesheet of 117 KB.
11. A section rhythm of one top padding and no bottom padding: fine internally, but with no spacing scale the blocks drift; the client's tokens should define both.
