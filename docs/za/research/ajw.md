# AJW Group (ajw-group.com)

Studied 25 September 2026 with Playwright (Chromium, desktop UA at 1440 x 900, iPhone UA at 390 x 844, device scale 2). Parts, component MRO and PBH supply chain support, HQ in Slinfold, West Sussex. The site is a custom jQuery build (jQuery 3.6, Owl Carousel, jQuery Cycle, Fancybox; no GSAP, Lenis, Locomotive, Framer or AOS anywhere in the page's scripts). A OneTrust cookie banner and a HubSpot chat bubble load on every page; the banner was rejected and both were hidden before the clean screenshots. The site did not block the headless browser. Note: the first automated run clicked a news headline by mistake (a regex for "ok" matched "PhuQuoc"), so every value below comes from the corrected runs.

Pages studied: home (`/`) and the service page "Supply Chain Management" (`/services/supply-chain-management/supply-chain-management/`). Footer trust pages were fetched as text: `/registered-company-details/`, `/quality-and-certifications/`, `/contact-us/`, and the service contact page.

Screenshots

| View | File |
| --- | --- |
| Home fold, desktop, with cookie banner as served | [shots/ajw-home-1440-fold-raw.png](shots/ajw-home-1440-fold-raw.png) |
| Home fold, desktop | [shots/ajw-home-1440-fold.png](shots/ajw-home-1440-fold.png) |
| Home full page, desktop (900 px: the whole home page is one viewport) | [shots/ajw-home-1440-full.png](shots/ajw-home-1440-full.png) |
| Home fold, mobile, as served | [shots/ajw-home-390-fold-raw.png](shots/ajw-home-390-fold-raw.png) |
| Home fold, mobile | [shots/ajw-home-390-fold.png](shots/ajw-home-390-fold.png) |
| Home full page, mobile (1596 px) | [shots/ajw-home-390-full.png](shots/ajw-home-390-full.png) |
| Desktop mega menu open (Services) | [shots/ajw-home-1440-menu.png](shots/ajw-home-1440-menu.png) |
| Desktop mega menu, second column selected | [shots/ajw-home-1440-menu-sub.png](shots/ajw-home-1440-menu-sub.png) |
| Desktop AOG desk panel open | [shots/ajw-home-1440-aog.png](shots/ajw-home-1440-aog.png) |
| Mobile menu open | [shots/ajw-home-390-menu.png](shots/ajw-home-390-menu.png) |
| Mobile menu with Services expanded | [shots/ajw-home-390-menu-sub.png](shots/ajw-home-390-menu-sub.png) |
| Mobile AOG desk panel open | [shots/ajw-home-390-aog.png](shots/ajw-home-390-aog.png) |
| Home under prefers-reduced-motion, desktop and mobile | [shots/ajw-home-1440-reduced-motion.png](shots/ajw-home-1440-reduced-motion.png), [shots/ajw-home-390-reduced-motion.png](shots/ajw-home-390-reduced-motion.png) |
| Supply Chain Management fold, desktop | [shots/ajw-scm-1440-fold.png](shots/ajw-scm-1440-fold.png) |
| Supply Chain Management full page, desktop (2961 px) | [shots/ajw-scm-1440-full.png](shots/ajw-scm-1440-full.png) |
| Supply Chain Management fold, mobile | [shots/ajw-scm-390-fold.png](shots/ajw-scm-390-fold.png) |
| Supply Chain Management full page, mobile (3585 px) | [shots/ajw-scm-390-full.png](shots/ajw-scm-390-full.png) |

## 1. Navigation model

Desktop (1440)

- Two stacked fixed bars, 117 px in total, held in place by a 115 px spacer div. Bar one (`.menu0`, white, 78 px): logo 122 x 53 px at x 220, then four utility links at the right in 14 px / 400 uppercase grey `rgb(102,102,102)`: Latest, Careers, RFQ, Contact. To their right two coloured pennant tabs hang from the top edge: "AOG DESK" in red `rgb(232,44,42)` and "PBH PORTAL" in the brand purple `rgb(43,15,84)`, each 90 x 67 px. Bar two (`.menu1`, purple, 39 px): six primary labels in 16 px / 400 uppercase white, 38 px tall with 10 px padding: Services, Parts, MRO, Engines, Digital, About AJW, and a search icon at the right edge of the 1000 px column.
- The primary labels are not links. They are `li` elements with `data-href`; a click opens the mega menu (`slideDown(1000)`) and at the same time animates the page to `scrollTop: 0` over 1600 ms with `easeInOutQuart`. Measured: the panel grew from 0 to 750 px over about 1000 ms, then locked to 750 px, filling the viewport below the bars (`min-height` is set by script to viewport minus 155 px). There is no close control; the panel closes only by clicking the label again or navigating.
- Inside the mega menu (Services): row one on purple with the five section labels (15 px, uppercase, grey `rgb(160,170,178)`, 6 px vertical padding), which swap a second column on click; a dotted rule; a row of three icon links "Search for parts / repairs / engines" and a red "AOG DESK 24/7/365" button; row two on a photographic purple overlay with four columns: Supporting Info (8 links), Resources (5), Contact Us by region (9, including Africa), and an Upcoming Event card with a logo. 67 visible links in one panel.
- Contact and urgent action: the red AOG DESK tab is visible on every page, desktop and mobile. Clicking it slides a fixed red panel (212 px tall, `slideDown`, measured 0 to 212 px over about 400 ms) down over the top of the page with two hotline numbers as `tel:` links (16 px / 700 white), an email link, a one sentence promise about 24/7/365 staffing and a CLOSE tab. Contact otherwise is the grey "Contact" utility link, which leads to a contact directory page with five routes (AOG, parts, MRO, engines, asset or supply chain), and a right edge fixed purple tab "CONNECT" (48 x 232 px at x 1392) with four social icons; its Connect link opens a red email form strip. A HubSpot chat bubble also floats bottom right. No WhatsApp.
- A 35 px purple footer strip (Sitemap, Cookie Policy, Company Details, Terms, Quality and Certifications, RSS, copyright) is fixed to the bottom of the viewport on every page, so on inner pages three fixed bands (117 px top, 35 px bottom, 48 px right) frame the content.

Mobile (390)

- One fixed white bar, 60 px: logo 60 x 26 px, a three bar burger 27 x 22 px directly beside it (both under the 44 px target size), then the same two pennant tabs "AOG DESK" and "PBH PORTAL", 90 x 67 px each, taking half the bar. The AOG panel works the same way and grows to 380 px, with three `tel:` links 18 px tall.
- The burger opens a 350 px wide, full height purple drawer (`.mmenu-wrapper`, `position: fixed`, `z-index 9999`, `overflow-y: scroll`) that jQuery animates in from the right: measured left edge 478 to 40 px in 400 ms (jQuery default swing). No overlay, and the page behind still scrolls (`body overflow: visible`, scrolling by 300 px succeeded with the drawer open). The X is 27 x 27 px at the top right.
- Rows are 36 px tall at 14 px / 400: Search the Website, the six primary sections (each with a chevron), three coloured "Search for ..." rows in grey, cyan and red, then Latest, Careers, RFQ, Contact on white. Tapping a section expands a grey second level (Services shows 8 rows, 288 px), and most of those hold a third level, so the drawer reaches three levels deep. The drawer's scroll height was 861 px with one section open.

## 2. Home page section order

The desktop home page is exactly one viewport tall: 900 px document height, no scrolling. The mobile home page is 1596 px, about two screens.

| # | Section | Job | Height 1440 (px) | Height 390 (px) | Words | CTAs |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero carousel, three slides, full bleed illustration with text at the left | Brand mood plus one deep link per slide (buy parts online, the MRO facility, the online shop) | 750 | 784 | 4 to 8 per slide | 1 per slide |
| 2 | News ticker | One headline at a time, cycling through four | 68 (overlaid on the hero, at y 647) | 394 (overlaid at y 300) | 11 to 13 | 0 |
| 3 | Three finder tiles: Parts, Component MRO, Engines | Router to the three search tools | 120 (overlaid at y 705) | 411 | 16 | 3 |
| 4 | Fixed footer strip | Legal links, copyright | 35 | 35 stacked | 20 to 25 | 0 |

- The ticker and the tiles are positioned over the bottom of the hero on desktop, so the illustration runs behind them. On mobile the ticker sits on top of the illustration itself (see the mobile fold shot: the headline runs across the drawn figure's face) and the slides move under it every six seconds.
- Words in the first viewport: desktop 163 including the 12 nav labels, the AOG and portal tabs, the ticker headline and the tile labels; the hero itself carries 4 to 8 words plus a button. Mobile 111. Body paragraphs: none on the home page.
- Calls to action per viewport: desktop fold shows the hero button, the three finder tiles, the AOG tab, the PBH tab and the Connect tab at once, so seven coloured actions in four colours (purple, grey, cyan, red) compete in one screen. Each slide's button also changes every six seconds. The three finder tiles do the routing job well: label, icon, verb, one colour each.
- The home page is therefore a switchboard, not a story: there is no what, why, proof or how to start. All explanation lives on inner pages.

Service page (Supply Chain Management), desktop, 2961 px

| # | Block | Job | Height (px) | Words |
| --- | --- | --- | --- | --- |
| 1 | Header band, 1920 x 383 photo composite (aircraft with grey swooshes) shown at 1440 x 287 | Decorative page header | 287 | 0 |
| 2 | Breadcrumb (14 px, grey `rgb(199,199,199)`, low contrast) | Orientation | 41 | 11 |
| 3 | H1 | Page name | 55 | 3 |
| 4 | Intro: H2 "The aviation partner of choice", four paragraphs in a 500 px left column, illustration at the right, one red text link "Speak to our experts' today >", second H2 and paragraph | Explain and route to contact | 646 | 120 |
| 5 | Video block: dark grey band with a 1000 x 490 iframe that did not render (empty `src`) | Film | 533 | 0 |
| 6 | OEM partners list (four linked names), testimonials H2, two quotes attributed by job title and airline, closing "Contact our experts >" | Proof | 654 | 157 |
| 7 | Feature card carousel (Owl, 3 of 8 visible, 326 px cards, photo, uppercase label, MORE) | Cross links | 310 | 88 |
| 8 | The same three finder tiles on a grey band | Router | 255 | 16 |

Paragraph lengths on the service page: 31, 22, 30, 20, 17, 21, 19, 31, 22, 17 words, all under 40. The first fold of the service page carries 194 words and no button; the only actions are red inline text links.

## 3. Type, spacing, grid

- Two self hosted webfonts, one family: `museo_sans300` (used as regular, with synthetic bold where `font-weight: 700` is set) and `museo_sans500`. Lato is declared for the HubSpot widget only. Sans throughout, no serif, no mono.
- Sizes in use (desktop): hero line 1 100 px / 700 (museo 500, line height 100 px), hero line 2 70 px / 300 (line height 70 px), hero line 3 27 px / 400 (line height 20 px, tighter than the size), H1 on inner pages 40 px / 700 purple, H2 22 px / 700 black, body 18 px / 400 black on a 24 px line (measure about 56 characters in the 500 px column), tile labels 18 px / 700 uppercase, tile sub labels 14 px uppercase, primary nav 16 px uppercase, utility nav 14 px uppercase, mega menu 15 px uppercase, footer 12 px, buttons 16 px / 400 with 7 px 15 px padding, 32 px tall.
- Mobile: hero lines drop to 30 / 20 / 15 px, H1 stays 40 px (wraps to two lines in 370 px), body stays 18 px.
- Colours: purple `rgb(43,15,84)` for bars, tiles and headings; red `rgb(232,44,42)` for AOG, the news tag, the engine tile and every inline link; cyan `rgb(0,177,240)` for the MRO tile; grey `rgb(160,170,178)` for the parts tile, the mega menu labels and the mega menu top border. Four working colours, none reserved for "the action".
- Grid: one fixed 1000 px column at x 220 (`.inner-width`), no gutters, no columns system; the service page uses `.half` blocks of 500 px. Mobile: full width with 10 px side padding. Breakpoints in the responsive sheet at 1017, 915, 880, 713, 600, 550 and 450 px plus height queries; the JS treats under 810 px as mobile.
- Spacing: no scale. Section padding values seen were 0, 8, 10, 20, 30, 35 and 40 px; mega menu rows 6 px; menu rows 36 px; tile heights 120 px desktop, 127 px mobile with 10 px gaps.

## 4. Motion

- On load: the hero carousel autoplays from the first frame (Owl settings read from the site's own `default.min.js`: `autoplay: true`, `autoplayTimeout` at the 5000 ms default plus a 1000 ms `smartSpeed` slide, `loop: true`, `autoplayHoverPause: true`, no dots, no arrows). Measured active slide changes at 5.5 s and 11.6 s; the `.owl-stage` carries `transition: all 1s ease` and slides 1440 px horizontally each time. The news ticker runs on jQuery Cycle with `fx: scrollUp, speed: 1000, timeout: 8000`; measured headline changes at 3.5 s and 11.5 s. Both loop forever. Nothing fades in on load and no element starts hidden.
- On scroll: nothing. A full page scroll sweep at 250 px steps on both pages logged zero opacity or transform changes. There is no reveal system, no parallax, no sticky elements beyond the fixed bars. Scrolling is native (`scroll-behavior: auto`, no smooth scroll library). Two scripted scrolls exist: clicking a primary nav label animates the page to the top over 1600 ms `easeInOutQuart` before the mega menu drops, and accordion titles on capability pages animate the page to their position over 1600 ms.
- Transitions in the stylesheets (all colour, none transform or opacity apart from one): tile hover `background .25s ease-in-out`, share bar links `background-color .2s ease`, form buttons `.25s ease-in-out`, video play button `.5s ease`, the popup close `.2s all ease` with a 90 degree rotate. The hero button's hover swaps a background image (blue arrow to grey arrow) with no transition. Mega menu and AOG panel use jQuery `slideDown` (height animation, 1000 ms and 400 ms), the mobile drawer animates the `right` property over 400 ms; all of these animate layout properties, not transforms.
- prefers-reduced-motion: no `@media (prefers-reduced-motion)` rule in any of the three site stylesheets (grep count 0). With the emulated preference on, the carousel still changed slide at 5.9 s and the ticker at 3.8 s on both widths, so the site ignores the preference entirely.
- Verdict: the only motion on the site is looping decoration (carousel and ticker) and utility panels that animate height. Nothing shows where an element came from or where to go next; the auto scroll to top before the mega menu opens actively disorients on inner pages.

## 5. Image treatment

- Home hero: three flat vector illustrations of stylised people in the brand purple, red and cyan, exported as JPEGs (66 to 81 KB each) and set as `background-size: cover`, `background-position: 100% 50%`. Text sits directly on the white or pale area of the illustration at the left; no overlay or scrim, and readability depends on the illustration leaving space. On mobile the same images are used and the cover crop pushes the figure under the text and the ticker.
- Inner pages: a 1920 x 383 photographic header composite (aircraft, gears, swooshes, purple tint) served at 1440 px, plus one illustrated figure beside the intro text and small 300 px photos in the feature cards. The service page video block is an empty iframe, so the film never appears.
- Icons: PNG sprites for gears, spirals and search glasses; the mega menu columns are text only. Logos appear in the event card (ERAA) and the AJW Technique wordmark inside the hero.
- Mobile weight, home at 390 px, measured with CDP `encodedDataLength` (bytes on the wire): 2879 KB over 102 requests. First party 970 KB, third party 1909 KB. By type: scripts 1741 KB, images 804 KB, stylesheets 113 KB, fonts 87 KB, document 68 KB. The biggest single files are HubSpot's `visitor.js` (442 KB), reCAPTCHA (346 KB), three Google tag bundles (185, 146 and 133 KB), OneTrust (80 KB); the three hero slides together are 227 KB and the logo PNG is 45 KB. Decoded size is about 9 MB. Navigation timing at 390 px: TTFB 864 ms, first contentful paint 1.8 s, DOMContentLoaded 2.8 s, load 3.9 s, 2604 DOM nodes.

## 6. Trust devices

- Urgency and reach: the AOG tab is the strongest device, visible on every page at both widths with two `tel:` hotlines and an email in the panel, and repeated in the mega menu. A PBH customer portal tab signals existing contracted customers.
- Company facts: the fixed footer links to a "Company Details" page listing seven group companies with street addresses and registration numbers (UK, Ireland, Canada, Singapore, China, BVI, Isle of Man), and a "Quality & Certifications" page with a long quality statement and a certifications section. The service contact page gives the HQ street address, a switchboard number, a satellite navigation postcode, and two named people with title, photo, biography, email and LinkedIn.
- People: none on the home page. Named staff appear on the per service contact pages and the "Our Key People" page linked from the contact directory.
- Numbers and clients: the contact directory states "over 90 years' experience"; the service page names four OEM partners as links and quotes two customers attributed by job title and company (easyJet, Bombardier Business Aircraft). No counters, no logo wall on the home page.
- Regions: the mega menu Contact Us column lists nine regions including Africa, and a news item about component support demand across Africa sits in the ticker. There is no local address or number for Africa on the pages studied.
- Cost: the same footer strip covers 35 px of every viewport, and the home page hides all of this behind the footer link "Company Details"; a visitor would not see a single address, person or credential without leaving the home page.

## 7. Ten second test

The home page is understood as "a big aviation parts and repair company with a 24 hour AOG line and three search tools" within ten seconds because the three finder tiles and the red AOG tab say exactly that; what it does not say, anywhere on the screen, is what the company is or why to trust it, because the hero is a rotating mood illustration with a greeting instead of a statement.

## Patterns worth borrowing for FHS South Africa

1. A persistent urgent channel as a fixed, coloured control in the header at both widths, opening a small panel with tappable phone and email links rather than a page. For FHS this is the WhatsApp and phone control the brief asks for, kept to one colour and animated with transform and opacity instead of height.
2. A three tile router directly under the hero: label, icon, single verb, one destination each, and the same tiles repeated at the foot of every inner page so no page ends dead. FHS has five doors; the same device at five tiles, or three plus two, gives the routing the brief needs.
3. Per door contact pages with a named person, photo, title, direct email and the physical address, and with a short form. This is the strongest trust device on the AJW site and it maps directly to "one form per door".
4. Body copy discipline on inner pages: 18 px on a 24 px line, a measure near 56 characters, and paragraphs of 17 to 31 words with a red inline "talk to our experts" link after each idea.
5. A registered company details page with entity name, registration number and street address, linked from every page. For FHS this is the Companies Act s32 material in the brief.

## Patterns to avoid

1. Auto playing hero carousel and news ticker that loop forever, change the call to action every six seconds, and ignore prefers-reduced-motion. One hero, one action.
2. Seven coloured actions in four colours in the first viewport; the accent should mark one action.
3. Primary navigation labels that are not links and that open a full viewport mega menu with 67 links, while the page is scrolled to the top over 1.6 s. Primary links should go to pages; the menu should be one level with the five doors visible on desktop.
4. Animating height, `right` and background images with jQuery, and colour only hovers with no transform or opacity. FHS motion is transform and opacity only, 200 ms feedback, 400 to 600 ms reveals.
5. Three fixed bands (117 px top, 35 px footer, 48 px social tab) plus a cookie banner and a chat bubble, which on mobile leave roughly half the screen for content and put the burger and logo under 44 px.
6. A mobile drawer with no overlay and a page that keeps scrolling behind it, three levels deep, rows of 36 px at 14 px type.
7. Almost 2 MB of third party scripts (chat, reCAPTCHA, three analytics tags, consent) on a 2.9 MB home page; for South African data costs the whole home page should weigh less than AJW's tracking alone.
8. A hero illustration under `background-size: cover` that puts text and the ticker across the artwork on mobile; on mobile the text needs its own plain area or a scrim.
9. A decorative 287 px header image and an empty video iframe before the first sentence of a service page; the first viewport of a door page should state the service and offer the action.
