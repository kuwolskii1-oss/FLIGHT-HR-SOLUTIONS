# Lufthansa Technik (lufthansa-technik.com): analyst record

Date: 25 September 2026. Role in the study: MRO group, trust and contact routing reference (see 00-scout.md). Studied with Playwright 1.56 (Chromium 1194, desktop UA at 1440 x 900, iPhone UA at 390 x 844, DPR 2). The home page resolves to /en; the service page studied is /en/aircraft-engines, the closest match to the client's Engines door. Every figure below was read from the browser (getComputedStyle, bounding boxes, CDP network events) unless it says otherwise.

Setup note: the proxy CA was not yet in the Chromium NSS store, so the first probe failed with ERR_CERT_AUTHORITY_INVALID. The CA at /root/.ccr/agent-proxy-ca.crt was imported into ~/.pki/nssdb with certutil, which is the setup the proxy README describes as intended. TLS verification and proxy settings were not changed.

## Screenshots

| File | What it shows |
|---|---|
| shots/lht-home-1440-fold.png | Home, desktop, as a first visitor sees it: cookie dialog over a newsletter pop-up over the hero |
| shots/lht-home-1440-fold-clean.png | Home, desktop, after both overlays are dismissed |
| shots/lht-home-1440-full.png | Home, desktop, full page (7692 px tall) |
| shots/lht-home-1440-menu.png | Home, desktop, "Maintain" opened: a one row sub navigation of five links |
| shots/lht-home-1440-aog.png | Home, desktop, the AOG side tab opened: "Find your service contact" panel with two desks |
| shots/lht-home-390-fold.png | Home, mobile, first visit with overlays |
| shots/lht-home-390-fold-clean.png | Home, mobile, overlays dismissed |
| shots/lht-home-390-full.png | Home, mobile, full page (12 336 px tall) |
| shots/lht-home-390-menu.png | Home, mobile, burger menu open (drawer from the right) |
| shots/lht-home-390-aog.png | Home, mobile, AOG panel open |
| shots/lht-engines-1440-fold.png, shots/lht-engines-1440-fold-clean.png | Engines page, desktop fold, with and without the cookie dialog |
| shots/lht-engines-1440-full.png | Engines page, desktop, full page (6226 px) |
| shots/lht-engines-390-fold.png, shots/lht-engines-390-fold-clean.png | Engines page, mobile fold |
| shots/lht-engines-390-full.png | Engines page, mobile, full page (12 751 px) |

## Stack

Scrivito CMS (React SPA, meta generator "Scrivito by JustRelate Group GmbH"), Bootstrap grid classes (row, col-12, container), slick carousel for the hero, Font Awesome, Usercentrics consent, etracker analytics, Mindbreeze site search. No GSAP, Lenis, Locomotive, Framer, AOS or Swiper detected (window globals, data attributes and script URLs all checked). One IntersectionObserver is created (threshold 0, rootMargin 0px) and no Web Animations API calls were recorded during load or scroll.

## 1. Navigation model

Desktop (1440). A 96 px high bar, navy rgb(5, 22, 77), position fixed, with the logo at left (273 x 30 px SVG, links to /en) and seven text items: AOG, Maintain, Optimize, Specialize, Company, Career, Media (LufthansaText 18 px, weight 700, white). At right: DE | EN (16 px, weight 700, active language in teal rgb(0, 175, 203)) and a search icon. The seven items are not links; they are divs that open a second row on click (hover does nothing). "Maintain" opens a 156 px high white row containing five bold 18 px links (Aircraft, Engines, Components, Composite Structures, Landing Gears) with no images and no descriptions, the active top item marked by a teal block behind it; there is no transition on the row (computed transition 0 s). Escape does not close it; clicking away does. The bar wrapper carries `transition: all 0.5s ease-in-out` and stays fixed for the whole scroll; it does not shrink or change colour at 700 px of scroll.

Urgent action. Contact is not in the top bar. It is handled by two devices:
- A fixed AOG tab at the left edge (`.floating-button`, 130 x 60 px, positioned at x = -70 so only a 60 px square with an aircraft icon shows, `transition: all 0.2s ease-in-out`). Clicking it opens a full height white panel from the left (`.sidebar.open`, `transition: all 0.3s ease-in-out`) headed "Aircraft On Ground / FIND YOUR SERVICE CONTACT", with one navy card, "AOG Material Desk", giving an email and phone number for the Americas and for Europe, Middle East and Africa (mailto: and tel: links). The panel is the only place on the home page where a phone number appears.
- A full width teal band under the hero, "Need Support?" (128 px high, 18 px text, one link to /en/sales-expert, a contact finder by region and product).

The AOG item in the top menu opens a sub row with four links (Aircraft on Ground, Part 21J Support, Airline Support Teams, AOG Material Desk). So the urgent path exists three times, but none of them is a button in the bar and none is visible as text on first paint at desktop other than the word "AOG".

Mobile (390). Bar 96 px, logo 170 px wide, burger (Font Awesome bars icon, 17 px wide, no aria-label, not a button element) and search icon at right. The burger opens a drawer from the right (`.sub-nav.mobile-main-page.is-active`, 375 px wide over a 390 px screen, navy, `transition: all 0.5s ease-in-out`), listing the same seven items in uppercase 18 px with DE | EN and a close icon at the top. Each item expands in place as an accordion (`transition: max-height 0.5s ease, overflow`), 26 such accordions exist in the DOM. Body scroll is not locked (body overflow stays `hidden auto`), Escape closes it. Horizontal document width equals the viewport (398 px both), so nothing overflows sideways. The AOG tab and its panel work the same on mobile (panel 398 x 862 px). The fingerprint button bottom right is the Usercentrics privacy button, not a contact action.

## 2. Home page section order and jobs

Measured at 1440 (section top offsets and heights from getBoundingClientRect).

| # | Section (top, height) | Job | Words | CTAs |
|---|---|---|---|---|
| 0 | Newsletter pop-up, fixed, appears 1.9 s after DOMContentLoaded over everything, plus the cookie dialog | Marketing capture | 9 | 1 (the image is the link) |
| 1 | Hero carousel (0, 896 px), five slides, autoplay | Rotating campaign messages: AOG major repairs, MRO APAC fair, AeroSHARK, VIP cabin, cockpit recorder | 31 in the visible slide | 1 (the whole teal box is a link); 5 dot buttons |
| 2 | "Need Support?" teal band (981, 128 px) | Route to a contact finder | 2 | 1 |
| 3 | "Welcome to Lufthansa Technik" (1189, 1587 px) | Who we are: one 80 word paragraph, an autoplay muted film (poster 145 KB), then five stat tiles | 114 | 0 |
| 4 | "Our products and services" (2856, 1288 px) | Twelve image cards in a 3 x 4 grid, one button "View all our capabilities" | 209 | 1 |
| 5 | News (4223, 574 px) | Three dated press items, "Overview" | 71 | 1 |
| 6 | "Meet us personally" (4877, 869 px) | Events carousel with dates and cities | 119 | 1 |
| 7 | Career (5826, 438 px) | Recruitment banner with photo of three staff | 59 | 1 |
| 8 | "Lufthansa Technik Worldwide" (6343, 746 px) | Map, "More than 35 subsidiaries", "Discover our network" | 36 | 1 |
| 9 | Footer (7169, 95 px plus social row) | Newsletter button, social links, Career, Imprint, Privacy, Legal | | 1 |

First viewport (after dismissing the overlays, text nodes hit tested at their centre): 30 words at 1440, 21 words at 390. Interactive elements in the first viewport: 8 at 1440 (logo, DE, EN, five slide dots; the seven menu items are divs), 7 at 390. Calls to action per viewport on the rest of the page: never more than one button, but sections 4 to 8 are each a grid of clickable cards, so the number of clickable targets per screen is 3 to 12.

At 390 the same order applies; the hero is 602 px high (0.7 screens) and the teal text box sits below the image, so the headline is readable without the photo. Products and services become a single column 3547 px tall (4.1 screens of cards). Total body text 718 words at 1440, 901 at 390 (the drawer's link labels are counted at 390).

The story order is: campaign, contact, who we are, proof numbers, catalogue, news, events, careers, footprint. Proof is early (section 3) and specific, which is the page's strength; the hero, by contrast, does not say what the company does.

## 3. Type

Families loaded (document.fonts): LufthansaHead (headlines, one weight file) and LufthansaText (regular and bold), plus Font Awesome and the slick icon font. Two brand families and two icon fonts; 352 KB of font transfer.

Sizes actually in use on the home page at 1440 (font-size/line-height weight, count of text elements):

| Role | Measured |
|---|---|
| Hero headline (h1 inside the teal box) | LufthansaHead 45/55 px, weight 400, white, box 440 x 440 px with 43 px padding, so about 15 characters per line |
| Section h2 | LufthansaHead 36/46 px (and 40/50 px for the AOG panel heading), weight 400 or 100 |
| Card h3 | LufthansaHead 22/28 or 24/28 px, weight 400 |
| Body | LufthansaText 18/26 px, weight 400 (the most common style: 21 elements at 1440, 114 at 390) |
| Bold body and nav | LufthansaText 18/26 or 18/24 px, weight 700 |
| Buttons | LufthansaText 16/24 px, weight 700, white on navy, 230 px wide |
| Small print | 14.4/26 px, weight 700 (dates in cards) |
| Stat tiles | 24/28 px, weight 300 (the number line) |

Mobile: h1 30/40 px, h2 36/46 px unchanged, body 18/26 px unchanged. So the headline drops one step and everything else stays.

Measure: the welcome paragraph runs about 1080 px wide at 18 px, which is roughly 120 characters per line, well over a comfortable measure. Card text runs 303 px wide (about 34 characters). Engines page intro paragraphs run 865 px (about 95 characters).

Grid and spacing: Bootstrap 12 column grid; content container 1342 px at 1440 (64 px side padding on the outer wrapper), a 3 column card grid of 342.6 px columns with a 30.24 px gutter. At 390 the container is 358 px (16 px side padding). Sections carry no padding of their own (all `padding: 0`); rhythm comes from inner margins, and the measured gaps between sections are irregular (80 to 130 px at 1440). Two colours do the work: navy rgb(5, 22, 77) and teal rgb(0, 175, 203); teal marks the current language, the current menu item and the hero box; navy marks buttons and dark tiles.

## 4. Motion

What moves on load: the hero carousel autoplays, and a newsletter pop-up fades in at 1.9 s (`newsletter-popup-fade-in 0.3s ease`, content `0.35s ease`, both play once). No entrance reveals: a snapshot of every element below the fold before scrolling found nothing with opacity 0 or an offset transform except the card hover overlays (`.cards-wrapper__hover-box`, opacity 0, `opacity 0.15s ease-in-out`), which stay hidden after scrolling because they are hover states, not reveals. The one IntersectionObserver is not used for reveals.

Carousel: slick, transform based (`translate3d` on `.slick-track`, inline width 10 080 px for 7 slides including clones). Slide changes were logged at 0.8, 6.0, 11.7, 17.3 and 23.0 s, so an interval of about 5.7 s. The teal text box has `transition: opacity 0.5s ease-in-out, margin-top 0.2s ease-in-out` and the box link `all 0.1s ease-in-out`; the box text is blank for about half a second on each change (the fold screenshot lht-home-1440-fold-clean.png from the first pass caught an empty box). The carousel keeps rotating under prefers-reduced-motion (the h1 text still changed within 9 s in the emulated run).

Transition census (computed styles, all elements, home at 1440): 42 elements `all 0.1s ease-in-out`, 12 `opacity 0.15s ease-in-out`, 12 `color 0.2s ease-in-out`, 11 `all 0.3s ease-in-out`, 6 `background-color 0.3s ease-in-out`, 3 `all 0.5s ease-in-out` (menu bar, drawer), 1 `transform 0.7s ease, opacity 0.3s ease` (the largest value found), 26 accordions at 390 with `max-height 0.5s ease`. Everything is ease or ease-in-out; nothing uses a custom cubic-bezier, nothing loops except the spinner keyframes defined for forms, and none of the fourteen @keyframes rules is used for content.

Scrolling: `html { scroll-behavior: smooth }` is set, so a wheel step of 600 px animates over about 350 ms (scrollY samples at 50 ms intervals after one wheel event: 3675, 2842, 2051, 1356, 794, 278, 68, 0 for a return to top). Scrolling is native otherwise; no scroll hijacking, no pinned sections, no horizontal scroll on touch. Under prefers-reduced-motion `scroll-behavior` becomes `auto` (the same wheel step lands instantly: 0 then 600) and the pop-up and carousel behave exactly as before; transition durations are unchanged (census identical in both modes). So reduced motion is handled only for smooth scrolling, not for the carousel or the pop-up.

Does motion help orientation? Mostly it decorates or interrupts: the carousel replaces the message under the reader, the pop-up covers the page, and the only transitions that guide are the sub row and drawer open states (0.3 to 0.5 s) and the 0.1 to 0.2 s hover colours, which are correct in size and timing.

## 5. Image treatment

Photography throughout: full bleed hero photographs (rendered 1440 x 900, source 1448 px wide JPEG and PNG, 120 to 230 KB each, all five preloaded), workshop and engine photographs in the card grids (417 x 179 px renders from 1448 px sources), one autoplay muted film in the welcome section (poster 145 KB), a flat teal world map illustration in the footprint section, and one infographic PNG of 361 KB. Portraits appear on the engines page (three heads of sales, 268 px square). No illustration system, no icon set beyond Font Awesome glyphs.

Text on media: text is never placed directly on a photograph. The hero uses a solid teal box (440 x 440 px at 1440) over the image; at 390 the box moves below the image. Card titles sit on white below the image. This is the reason the type stays readable regardless of the picture.

Weight (CDP, total encoded bytes at network idle, before consent):
- Home at 390: 5.74 MB over 231 requests (script 2.85 MB, images 1.90 MB, fonts 352 KB, stylesheets 112 KB, fetch and XHR 518 KB). The two largest files are the Mindbreeze search client (1.27 MB) and its telemetry bundle (0.96 MB), loaded although nobody has opened search.
- Home at 1440: 6.40 MB, 164 requests (images 2.71 MB).
- Engines at 390: 6.37 MB, 181 requests; at 1440: 8.52 MB (images 4.92 MB, six card photos served at 1448 px for a 417 px slot, no srcset, no lazy loading on that page).
Load to network idle took 6.7 to 8.0 s on the session's connection. Only 13 images on the home page use `loading="lazy"`, none uses `<picture>`.

## 6. Trust devices

- Numbers, early and specific: five tiles under the welcome text ("Every 5th aircraft is under contract with us", about 22 580 employees, 800+ customers, about 5 100 aircraft under contract, "Certified maintenance, design, production & CAMO organization"). The engines page repeats the device with a single teal band, "25,000,000 engine flight hours have already been supported by us".
- People with names and direct lines: the engines page ends with three named heads of sales by region, each with portrait, title, personal email, phone and city. The AOG panel gives desk emails and phone numbers by region.
- Process and footprint: "Our specialists around the world" lists ten named engine shops; "More than 35 subsidiaries" with a map; "Discover our network" to a locations page.
- Recency: news items dated within the last two weeks and a trade fair calendar with dates and cities, which shows the company is active now.
- Credentials: only the word FAA appears on the engines page; no certificate list or numbers on either page. No physical address on the home page; the footer has Imprint, Privacy Policy and Legal Terms links (the address is behind Imprint, as German law expects).
- Parent link: "Lufthansa Group" in the footer and the Lufthansa crane mark in the logo carry most of the weight; the page itself relies on scale numbers rather than certificates.

## 7. Ten second test

The page is understood only through the logo and the menu words (AOG, Maintain, Optimize), because the first screen shows a rotating campaign slide behind a newsletter pop-up and a cookie dialog rather than a sentence that says what the company does; the plain statement arrives in the third section, 1189 px down.

## For the client (study, not copy)

Worth borrowing:
- Proof numbers as tiles directly under the introduction, before the service catalogue. For FHS the tiles would hold only sourced facts (registration number, group experience labelled as the group's, response hours in SAST).
- Named people with a direct line at the end of each door page, one per region or role. This is the strongest trust page pattern in the set and matches the brief's "route each form to a named inbox".
- Text in a solid brand coloured box rather than on the photograph, moving below the image at phone width. It keeps text readable in the first frame and lets images compress hard.
- An urgent AOG device that is persistent on every screen size and opens a panel with email and phone by region, rather than a page. For FHS this becomes the WhatsApp and AOG button in the bar, visible as text.
- A regional service band ("Need Support?", one line, one link) between the hero and the introduction as the first step of the contact route.
- Hover and state transitions in the 100 to 300 ms range with plain ease-out, and menu open states at 300 ms; the site shows these are enough for a serious industrial brand.
- Dated news and events to signal that the company is active; for a 2026 company, a short "latest" list is a cheap recency signal once there is something to list.

To avoid:
- A rotating hero carousel: it hides the message for half a second on every change, keeps running under reduced motion, and forces five hero images (over 800 KB) on a phone.
- A newsletter pop-up at 1.9 s over the fold, on top of the consent dialog.
- Menu items that are not links and open a second row on click only, with no Escape handling; the client's brief wants the five doors as real links.
- Loading a 2.2 MB search client and telemetry on every page before anyone searches; 5.7 MB at 390 px is more than five times the client's 1 MB budget.
- Serving 1448 px images into 417 px slots without srcset or lazy loading (engines page 8.5 MB at desktop).
- A 120 character line length for body text at desktop.
- Twelve identical image cards as the service catalogue; a visitor who needs a part or a charter scans twelve equal tiles before finding a door. The brief's five doors need to be five, distinct, and above the catalogue.
- Contact details hidden inside a side tab; on the client's site the phone and WhatsApp numbers should be visible text in the bar and footer, with the physical address in the footer rather than behind an Imprint link.
