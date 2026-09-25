# Air Charter Service (aircharterservice.com)

Studied 25 September 2026 with Playwright (Chromium, desktop UA at 1440 x 900, iPhone UA at 390 x 844). The site served the headless browser without blocking. From this network location it redirects to the United States edition of the site (the header shows "United States" and the footer lists the US offices); the layout, header, scripts and styles are shared across the country editions. Two caveats on the screenshots: the OneTrust cookie banner never appeared for this region, and a Wisepops app promotion popup ("Get our Private Jet Prices app") covers the mobile screen on first load and was removed before the mobile screenshots. Headless Chromium has no H.264 decoder, so the hero film area renders white in the desktop screenshots; the element and its bytes were measured from the DOM and the network log instead.

Pages studied: home (`/`) and the service page Private Charter (`/private-charter/`).

Screenshots

| View | File |
| --- | --- |
| Home fold, desktop (hero film area blank, see caveat) | [shots/acs-home-1440-fold.png](shots/acs-home-1440-fold.png) |
| Home full page, desktop (5453 px tall) | [shots/acs-home-1440-full.png](shots/acs-home-1440-full.png) |
| Home fold, mobile | [shots/acs-home-390-fold.png](shots/acs-home-390-fold.png) |
| Home full page, mobile (7656 px tall) | [shots/acs-home-390-full.png](shots/acs-home-390-full.png) |
| Desktop mega menu open on Private Charter | [shots/acs-home-1440-menu.png](shots/acs-home-1440-menu.png) |
| Mobile drawer open | [shots/acs-home-390-menu.png](shots/acs-home-390-menu.png) |
| Mobile drawer with Private Charter expanded | [shots/acs-home-390-menu-sub.png](shots/acs-home-390-menu-sub.png) |
| Home under prefers-reduced-motion, desktop | [shots/acs-home-1440-reduced-motion.png](shots/acs-home-1440-reduced-motion.png) |
| Home under prefers-reduced-motion, mobile | [shots/acs-home-390-reduced-motion.png](shots/acs-home-390-reduced-motion.png) |
| Private Charter fold, desktop | [shots/acs-private-1440-fold.png](shots/acs-private-1440-fold.png) |
| Private Charter full page, desktop (3770 px) | [shots/acs-private-1440-full.png](shots/acs-private-1440-full.png) |
| Private Charter fold, mobile | [shots/acs-private-390-fold.png](shots/acs-private-390-fold.png) |
| Private Charter full page, mobile (5589 px) | [shots/acs-private-390-full.png](shots/acs-private-390-full.png) |

Stack, for context: server rendered .aspx pages, jQuery 3.4.1, Slick carousel, flatpickr date picker, Google Tag Manager, reCAPTCHA v3, OneTrust, Wisepops, LinkedIn Insight. A 2026 header script (`acs-2026-header.js`) and stylesheet are newer than the rest.

## 1. Navigation model

Desktop (1440)

- Two stacked bars, `position: fixed`, 111 px in total, no change on scroll (no shrink, no shadow, `transition: 0s`). `main` carries 111 px of top padding to compensate.
- Top bar (60 px, white): logo 265 x 37 px at x 80, then a utility row of five small items in Montserrat 12 px / 600 uppercase, grey `rgb(88,106,121)`: Search, Jet Portal (client login), Contact, country ("United States", a link to the list of country sites) and a language menu. Contact is therefore a plain text link, not a button.
- Second bar (50 px, near black `rgb(43,51,58)`): a filled cyan button "Inquire now" (`rgb(31,182,235)`, 162 x 50 px, square corners, plane icon) sits first, at x 240, then five white 12 px / 600 uppercase text links: Private Charter, Group Charter, Cargo Charter, Aircraft & Destinations, About Us. The three service doors are the first three items and the quote button is glued to them. The active section keeps a lighter background and a cyan underline.
- Each of the five links opens a mega panel on hover: 1200 x 383 px white panel at x 120, under the bar, no transition (0 s, appears instantly). Layout is 900 px of link columns plus a 300 px grey aside. For Private Charter: three columns headed by 12 px cyan uppercase labels (Charter Services, Products & Pricing, Beyond Charter), 12 links as 14.8 px / 600 titles with a one line 13 px grey description under each, 99 words in total, one 251 x 160 px photo card with title, two line blurb and "Learn more" link, and a 45 px footer strip with three icon links (Industries Served, Testimonials, Global Network). The other doors have 14, 14, 12 and 13 links.
- Hover feedback on the quote button: background and colour transition 0.15 s ease (cyan to white). Text links: colour 0.15 s.
- Contact on desktop: the "Inquire now" button (a quote form page) on every screen, the "Contact" text link in the utility bar, and a fixed footer strip described under section 2. There is no phone number in the header. Urgent contact is not distinguished from ordinary contact on desktop.

Mobile (390)

- Single 57 px white bar, static (scrolls away): logo 180 x 26 px, Search icon, language menu, and a burger `button.acs-burger` (47 x 38 px, `aria-label="Open menu"`, no `aria-expanded`).
- The burger opens a full screen white drawer `aside#mnav` (390 x 844, `position: fixed`) that slides in from the right: `transform: translateX(390px)` to `0`, `transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)`, behind it a `rgba(43,51,58,0.5)` scrim fading in over 0.25 s. `body` gets `acs-noscroll` (`overflow: hidden`). Close is a 34 x 34 px X with `aria-label="Close menu"`. Escape closes the drawer. Tab focus stayed inside the drawer for 40 presses, so it traps focus.
- Drawer content: five accordion buttons (50 px rows, 14 px / 700 uppercase, chevrons), then three quieter links (Jet Portal, Contact, Global Websites, 12 px / 700 letterspaced), and a full width cyan "Inquire now" button pinned to the bottom of the drawer (`acs-mnav__cta`, 50 px). Half the drawer is empty when nothing is expanded.
- Tapping a section expands a `max-height 0.3s ease` panel: for Private Charter it grows to 1087 px with the same three groups as the desktop mega menu (13 links visible in one screen, 44 px rows, 14 px / 500). The heading turns cyan with a left border, so the open state is obvious. The panel, not the drawer, scrolls.
- Below the fold on mobile a fixed action bar appears: `div.site-bar` (390 x 41 px at the bottom, `el-fixed` class added after roughly 300 px of scroll, no transition, so it simply appears). Three equal cells: Call Us (grey, links to the contact page rather than `tel:`), Callback (grey, opens a form), Inquire Now (cyan). On desktop the same strip appears as a 1440 x 48 px band of four cells (Call Us, Email Us, Callback, Inquire Now) fixed at the bottom of the viewport, from about 300 px of scroll until the footer. The markup also contains hidden WhatsApp cells (`wa.me/…`, 0 x 0 here) that other country editions show, so WhatsApp is a supported slot in this bar.
- The hero on mobile is a 390 x 183 px still, then a pale blue box with one line ("ACS charter experts are available 24/7…", 15 words) and a cyan "Inquire now" button.

## 2. Home page section order

Measured on desktop; mobile keeps the same order at 7656 px (about nine screens).

| # | Section (class) | Job | Height (px) | Words | CTAs |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero (`main-hero`) | Silent looping film behind a white quote form: Passenger / Cargo tabs, Departure, Destination, Date, Passengers, "Inquire now". No headline in the hero at all | 600 | 9 (form labels) | 1 form submit plus 2 tabs |
| 2 | Three doors (`spotlight-list`) | The H1 (7 words, uppercase) over three 400 x 225 photo cards: Private Jet, Group, Cargo, each with 25 to 30 words and a "Learn more" pill | 641 | 105 | 3 |
| 3 | Campaign band (`section-cta`) | Photo plus video thumbnail on the left, navy box on the right with a 7 word heading, 16 word line and "Book now" | 540 | 25 | 1 |
| 4 | Why choose us (`section-bg__light`) | Four proof tiles on grey: "35,000+ flights per year", "40+ offices on 6 continents", "50,000 aircraft", "24/7 personal service" | 347 | 42 | 0 |
| 5 | Regulatory notice (`real__id`) | US specific banner with "Learn more" | 153 | 14 | 1 |
| 6 | Global network (`global__reach`) | Dark gradient band with a dotted world map of office pins and a "Learn more" | 362 | 16 | 1 |
| 7 | Story and process (`section-cta`) | Two rows: founder video with "Our History", then a 40 word paragraph about the four stage process and a globe graphic with "Watch video" | 929 | 90 | 2 |
| 8 | Popular jets / destinations (`spotlight-aircraft-list`) | Tabbed row of four aircraft cards (name, seat count) and "View aircraft guide" | 543 | 29 | 1 plus 2 tabs |
| 9 | Blog (`spotlight-list`) | Three article cards with "Read more" | 433 | 87 | 3 |
| 10 | Footer | Link row, app store badges, then a wall of legal text listing every US entity, address and phone number (about 300 words) | 395 | 300+ | |

- Words in the first viewport (hit tested, so only text a person can see): desktop 44 (11 nav labels, 2 tabs, 4 form labels, the submit button, the H1 which just peeks in at y 771, and the four cells of the bottom strip). Mobile 34.
- Calls to action per viewport, desktop: screen 1 has the header quote button, the form submit and the four cell bottom strip at once (three routes to the same quote form visible together). Screen 2 has the three "Learn more" pills plus the strip, screen 3 "Book now" plus the strip. No screen has fewer than four filled controls because the strip is always there. Mobile: three (the strip) on every screen, plus whatever the section adds.
- Headlines: H1 7 words, section H2s 3 to 7 words except "Learn about our simple, four-stage process" (7) and the blog titles. Body paragraphs 25 to 40 words; the longest on the service page is 47.
- Per screen word counts, desktop: 44, 151, 84, 78, 59, then 445 for the footer legal wall. Mobile: 34, 70, 60, 61, 28, 46, 76, 51, 88, then 305 for the footer.
- Section rhythm: sections butt against each other (gaps of 0, 0, 60, 60, 55, 0, 0, 0 px) with their own padding of 60 / 60 or 60 / 20 px; grey `rgb(245,246,248)` bands alternate with white.

## 3. Type, spacing, grid

- One family: Montserrat (400, 600, 700 loaded, 300 also loaded on mobile), plus an icon font `_acs`. Body 15.4 px / 23.1 px (a 1.5 ratio) on desktop, 14.09 px / 21.13 px on mobile, colour `rgb(88,106,121)` on white. Every headline is uppercase.
- Headline: H1 28.2 px / 33.84 px, 700, navy `rgb(35,58,119)`; 24.26 px on mobile. Section H2s 18 px / 21.6 px, 700, letterspacing 0.5 to 0.9 px, and 24 px / 28.8 px for the larger ones. Stat figures 28 px / 42 px, 700, italic. Card H3 18 px / 27 px 700, aircraft names 17 px 700.
- Lead: the service page intro is 14.8 px / 22.2 px 400, so there is no true lead size; the only larger paragraph is 21 px / 29.4 px in one campaign box.
- Labels and nav: 12 px / 18 px, 600 or 700, uppercase, letterspacing 0.24 to 0.84 px. Card body 14.8 or 15 px. Footer legal 11 px / 18 px.
- Buttons: 12 px / 600 uppercase, 50 px tall in the header, 48 px form submit, small "Learn more" pills 14 px / 700 uppercase, square corners throughout (`border-radius: 0`).
- Measure: the H1 spans the full 1280 px container centred, so a long H1 runs to 45 characters on one line; service page intro paragraph 1024 px wide at 14.8 px, about 130 characters per line, well over a comfortable measure. Cards hold 30 words in 400 px at 15 px (about 50 characters per line).
- Grid: 1280 px content width at 80 px side gutters (containers measured at 1280 and 1320 with 20 px cell padding); three column card rows of 400 px with 40 px gutters; the quote form 500 x 258 px left aligned in the hero, 440 px wide inputs in two 210 px columns. No CSS grid in use; floats and flex.
- Colour: navy `rgb(35,58,119)` headings, near black `rgb(43,51,58)` bar, two cyans (`rgb(31,182,235)` for the main button, `rgb(83,180,230)` for pills and tabs) plus a darker `rgb(2,138,194)` for one button, grey `rgb(235,236,238)` secondary cells. The accent is used for actions, but two cyans and a navy tab colour dilute it.

## 4. Motion

- Libraries: none of GSAP, ScrollTrigger, Lenis, Locomotive, Framer, AOS or Lottie. jQuery 3.4.1 with Slick; `animate(` appears nine times in `script-main.js` for carousels and accordions. No `IntersectionObserver` in the page scripts. `scroll-behavior: auto`. Wheel test: 500 px of wheel delta moved `scrollY` to 500 within 60 ms and it stayed at 500, so scrolling is native and unsmoothed.
- On load: nothing animates. The film starts silently in the hero (`autoplay muted loop playsinline`, `preload="metadata"`, `object-fit: cover`, 1440 x 600, no overlay, no text on it). The only keyframe animations in the page are third party: OneTrust fade in 0.4 s, OneTrust floating button 0.8 s, and a search overlay slide `searchSlide 0.18s ease-out`.
- On scroll: no reveals, no parallax, no counters (the "35,000+" figure was sampled eight times while scrolled into view and never changed). The only scroll linked behaviour is the bottom action strip gaining `el-fixed` after about 300 px and losing it at the footer, with no transition, and it is driven by a jQuery scroll handler. Elements hidden before scroll: none apart from the off canvas drawer and the strip's hidden sub panel.
- Transitions in computed styles (counts of elements): `all 0.3s ease` (119), `all 0.2s ease` (66), `color 0.15s ease` (37), `all 0.4s ease-in-out` (28), `transform, color 0.15s` (22), `max-height 0.3s ease` (5, the accordions), `transform 0.28s cubic-bezier(0.4,0,0.2,1)` (the drawer), `opacity 0.6s` and `transform 0.6s` (2 each, carousel slides). In the stylesheets the recurring curve is `cubic-bezier(0.215, 0.61, 0.355, 1)` at 0.35 s (an ease out cubic) plus a lot of `all .3s ease`. Longest declared transition: `all 1.5s` once in the custom stylesheet.
- prefers-reduced-motion: no rule in either stylesheet (`grep` count 0) and no JavaScript check. With the media query emulated the page is identical: the same transitions and third party animations remain, and the film is still `autoplay` (it showed as paused only because Chromium cannot decode it). Nothing is hidden, so content is all visible, but nothing is reduced either.
- Verdict: motion neither helps orientation nor decorates. It is limited to hover colour changes, the drawer slide and the accordions, which is honest but leaves the page feeling static and dated next to the amount of imagery it loads.

## 5. Image treatment

- Photography only: aircraft on aprons, people at work (a consultant on the phone in the service page banner), a founder portrait as a video poster, product shots (the jet card). One illustration style element: a dotted world map with office pins on a dark gradient. No icon illustration beyond four small line icons in the proof tiles.
- Film: the desktop hero is a 6.9 MB MP4 (`acs-generic-homepage.mp4`) with no poster image (the poster attribute points at the page URL, so a slow connection shows white). The service page hero is a different 5.7 MB MP4. On mobile the video element is display none and a 390 x 183 px JPEG hero is used instead, yet the network log shows the full 6.9 MB MP4 was still transferred at 390 px, because the `<video>` element stays in the DOM.
- Text on media: none. The hero film carries no text; the quote form sits on a white card over it. The only text on an image is the mobile hero caption which sits under the photo in a pale blue box, and the dark gradient network band (white 30 px text on `linear-gradient(270deg, rgb(73,90,99), rgb(28,36,44))`). Card photos are plain 16:9 images with the title and text beneath, never overlaid.
- Formats: JPEG and PNG served as WebP by the image CDN, one SVG logo set, 37 `<img>` (14 lazy, 27 with alt), 51 inline SVGs.
- Weight at 390 px (all responses observed by Playwright, home page, no scrolling): 12.44 MB across 96 requests. Breakdown: video 7.08 MB, images 2.15 MB (WebP 2.09 MB), JavaScript 2.46 MB (of which reCAPTCHA 346 KB loaded three times, GTM and gtag 493 KB, OneTrust 136 KB plus a 109 KB consent JSON, Wisepops 348 KB), CSS 483 KB, HTML 158 KB, fonts 85 KB. Desktop is 12.21 MB. Excluding the film the mobile home page is about 5.4 MB, of which roughly 3.5 MB is third party script, consent and popup tooling. The `performance` API only reported 429 KB because most responses are cross origin without timing headers, so the Playwright response log is the trustworthy figure.
- Timing on this connection: first contentful paint 1.24 s on mobile and 1.64 s on desktop, DOMContentLoaded 1.25 to 1.65 s, load 2.5 to 2.9 s (home) and 6.2 s (service page, mobile). The network never went idle on the service page within 45 s.

## 6. Trust devices

- Numbers: "35,000+ flights per year", "40+ offices on 6 continents", "50,000 aircraft", "24/7 personal service" in a four tile band (icons plus one line each), repeated on the service page banner; "30+ years" appears in the story section; the company was founded by one person "from his house" and the founder appears in a video thumbnail.
- People: the founder portrait (video), a consultant photographed on the phone in an office as the service page closing banner. No named team members or bios on either page.
- Process: a "simple, four-stage process" is claimed on the home page (video) and the service page (a 44 word paragraph), but the stages themselves are not listed on either page.
- Presence: dotted world map of offices; a "Global Network" link in every mega menu footer; the footer lists nine US legal entities each with street address and phone number. There is no phone number anywhere above the footer and no `tel:` link at all; "Call us" goes to the contact page.
- Credentials: "award winning cargo department" is claimed in one card; no logos of regulators, associations or auditors appear; no ratings widget. Testimonials are one click away in every mega menu.
- Legal: Modern Slavery Statement, legal and privacy policy, cookie policy links in the footer; consent management by OneTrust; reCAPTCHA on forms.
- Product: a client login ("Jet Portal") in the utility bar, and a pre paid jet card product, both of which signal an established operation.
- Forms: the hero quote form asks only for departure, destination, date and passenger count (cargo tab: weight and dimensions), so the first contact is very light.

## 7. Ten second test

The page is understood in under ten seconds on mobile because a photo of a jet, one line saying charter experts answer 24/7 and a quote button are all that is on screen; on desktop it is understood from the second bar (three doors plus a quote button) and the route form, not from the hero, because the H1 sits below the fold and the film carries no words.

## What this means for Flight Hour Solution

Patterns worth borrowing

1. Doors in the bar. The three service lines are the first three links, and the quote button sits beside them in the same bar. FHS can do the same with its five doors and one action.
2. A light first form. Four fields (from, to, date, count) and a Passenger / Cargo switch is the right level for a charter request at first contact; FHS's charter form can mirror the field count while adding one way / return and flexibility.
3. A bottom action strip on mobile that appears after the first screen with three cells, one of them coloured. For FHS the cells would be WhatsApp (AOG), Call and the door's form, with `tel:` and `wa.me` links, not a contact page.
4. Mega menu columns with a one line description under each link, and a mobile drawer whose accordion opens the same groups. The drawer's Escape handling and focus trap are correct and worth matching.
5. Proof tiles: four figures with one line each, placed right after the doors. FHS has no volume figures yet, so its tiles should be facts it can support (registration number, group experience labelled as such, response hours in SAST, currencies).
6. Photos stay clean and text sits beside or under them, never over them, which keeps text readable on cheap screens and removes the need for overlays.

Patterns to avoid

1. A 6.9 MB autoplay film that downloads even on phones where it is hidden, with no poster, so the hero is white until it arrives. The brief rules this out for South African data costs.
2. No headline in the hero. The H1 lands below the fold on desktop and the film says nothing; FHS needs the positioning line and plain subline in the first screen.
3. Three routes to the same quote form in one viewport (header button, form submit, fixed strip) and a strip that is always present, so no screen has a single call to action.
4. Roughly 3.5 MB of tag, consent, captcha and popup script, and a popup that covers the mobile screen on first visit.
5. No reduced motion handling and no scroll orientation at all; the opposite failure to a heavy motion site, but still a gap. FHS should have reveals that are short, staggered under 80 ms and removed under reduced motion.
6. Trust claims without the evidence next to them: a "four-stage process" that is never listed, "award winning" with no award named, and addresses and phones only in an 11 px legal wall in the footer. FHS should list its five steps and put its registration number, address and phone in readable type.
7. Paragraph measure of about 130 characters on the service page, and an all uppercase heading system that flattens the hierarchy (H1 28 px versus H2 24 px).
