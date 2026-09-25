# Willis Lease Finance Corporation (willislease.com)

Studied 25 September 2026 with Playwright (Chromium, desktop UA at 1440 x 900, iPhone UA at 390 x 844). The old domain redirects: `willislease.com` now serves from `www.wlfc.global` (HubSpot CMS, "CLEAN" marketplace theme with a custom global header). A HubSpot cookie banner covers the header on first load; it was declined before the screenshots below were taken. The site did not block the headless browser.

Pages studied: home (`/`) and the service page "Willis Services" (`/services`).

Screenshots

| View | File |
| --- | --- |
| Home fold, desktop | [shots/willis-home-desktop-fold.png](shots/willis-home-desktop-fold.png) |
| Home full page, desktop (8014 px tall) | [shots/willis-home-desktop-full.png](shots/willis-home-desktop-full.png) |
| Home fold, mobile | [shots/willis-home-mobile-fold.png](shots/willis-home-mobile-fold.png) |
| Home full page, mobile (11529 px tall) | [shots/willis-home-mobile-full.png](shots/willis-home-mobile-full.png) |
| Desktop mega menu open | [shots/willis-home-desktop-menu.png](shots/willis-home-desktop-menu.png) |
| Mobile menu open | [shots/willis-home-mobile-menu.png](shots/willis-home-mobile-menu.png) |
| Mobile menu with "Product Offerings" expanded | [shots/willis-home-mobile-menu-sub.png](shots/willis-home-mobile-menu-sub.png) |
| Home under prefers-reduced-motion | [shots/willis-home-desktop-reduced-motion.png](shots/willis-home-desktop-reduced-motion.png) |
| Services fold, desktop | [shots/willis-services-desktop-fold.png](shots/willis-services-desktop-fold.png) |
| Services full page, desktop | [shots/willis-services-desktop-full.png](shots/willis-services-desktop-full.png) |
| Services fold, mobile | [shots/willis-services-mobile-fold.png](shots/willis-services-mobile-fold.png) |
| Services full page, mobile | [shots/willis-services-mobile-full.png](shots/willis-services-mobile-full.png) |

## 1. Navigation model

Desktop (1440)

- White bar, 116 px tall, `position: fixed` from the start (a spacer div holds the page down). Logo 264 x 104 px at the left, five text links (Montserrat 16 px / 600, dark grey `rgb(51,50,50)`, blue on the current section), and one filled pill button "Connect with Us" (blue `rgb(0,85,184)`, 60 px tall, radius 24 px, padding 11 px 50 px) at the far right.
- Visible links: Product Offerings, About Us, Investor Center, News & Media, Careers, plus the Connect button. Product Offerings, About Us and Careers each open a mega panel on hover: white box 1200 x 421 px at x 120, no transition (0 s), with a left column (title, 40 word description, three text links) and up to three 246 x 320 px photo cards with a coloured caption bar (Willis Lease blue, Aviation Capital green, Services orange). The three business lines are therefore one hover away, not on the bar itself.
- Sticky behaviour: a `sticky` class is added after 20 px of scroll; nothing visibly changes (same height, same logo size, no shadow). A fixed "Return to Top" 50 x 50 px circle appears bottom left at 20 px inset with a 0.3 s transition.
- Contact: the Connect pill on every page. There is no phone number, email or chat in the header; the phone number appears only in the footer. The urgent action, "Get AOG Support", sits at 3174 px down the home page, inside the blue three card section, and links to a legacy `AOG.aspx` page. No WhatsApp, no sticky urgent control.

Mobile (390)

- Bar 115 px tall: logo 190 x 75 px left, a three bar burger (32 x 24 px, so under the 44 px tap target) at the right. Header is fixed.
- The burger opens a full screen white panel (`position: fixed`, 390 x 844, padding 100 px 15 px) that slides in from the right: `transform: translateX(390px)` to `translateX(0)`, `transition: all 0.4s ease-in-out`. The body receives `menuOpen` and `overflow: hidden`, so the page behind does not scroll. Close is an X drawn from two rotated spans.
- Inside: the same five links at 16 px / 600, 38 px rows on a 48 px rhythm, chevrons on three of them, and the blue Connect pill (54 px tall) below. Tapping a chevron expands the sub items and reloads the three mega menu images inside the panel (panel scroll height grows to 1825 px). Half the screen is empty.

## 2. Home page section order

Measured on desktop; mobile keeps the same order (page 11529 px long, roughly 14 screens).

| # | Section (H2 shortened) | Job | Height (px) | Words | CTAs |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero, "Helping to connect the world through sustainable flight." | Brand statement, one orange pill "View our Business Areas" linking to a portfolio page | 896 | 31 | 1 |
| 2 | "Minimize Downtime and Maximize your Airline" | Empathy paragraph plus three icon claims (repair cost saving, 24/7 access, uptime), in a white card with 80 px radius overlapping the hero | 579 | 114 | 0 |
| 3 | "Your Aviation Services Partner" | Image and text explainer, ends "That Partner is Willis." | 920 | 99 | 0 |
| 4 | "You deserve an Aviation Services Partner..." (blue band) | Router: three white cards, AOG / financing / services, each with an orange pill | 863 | 137 | 3 |
| 5 | "WLFC Gets you Airborne Again" | Heritage and product names (ConstantThrust and ConstantAccess), text only | 500 | 113 | 0 |
| 6 | "A Trusted Partner" | Photo plus 45 years, reliability claims | 920 | 92 | 0 |
| 7 | "A Global Presence" | Dotted world map with facility, office and JV pins | 894 | 13 | 0 |
| 8 | "Power to Spare - Worldwide" | Heading only | 49 | 5 | 0 |
| 9 to 11 | Keeping you Airborne / Engine Leasing and Spare Parts / Consulting and Advisory | Three alternating image and text rows describing service lines, no links | 525 + 544 + 544 | 47 + 39 + 43 | 0 |
| 12 | Footer | Address, phone, social, link columns | 665 | | |

- Words in the first viewport (after the banner is dismissed): desktop 51 including the six nav labels, so 31 in the hero itself (8 word headline, 22 word lead, 3 word button). Mobile 133, because the next section's heading and 76 word paragraph poke into the fold.
- Calls to action per viewport: desktop fold has two competing filled buttons (blue Connect in the header and orange View our Business Areas in the hero). Section 4 has three orange pills side by side in one viewport. Sections 2, 3, 5, 6, 7, 9, 10 and 11 have none, so the last 3500 px of the page is a dead end apart from the footer.
- Body paragraphs run to 76, 62, 46, 44 and 39 words. Headlines are 8 words or fewer except section 4 (12 words).

## 3. Type, spacing, grid

- Families: Montserrat for headings, links and buttons (weights 300 to 900 all loaded, six woff2 files of about 58 KB each); Libre Franklin for body (400, 600, 700, 800). Font Awesome 6 icons. Roboto and Franklin Gothic faces are declared but unused. Total font transfer about 456 KB.
- Headline: H1 Montserrat 52 px / 900 / line height 72.8 px (1.4), white, centred, 1124 px wide on desktop; 32 px / 900 / 44.8 px on mobile. Four line break on mobile.
- Section headings: H2 32 px / 600 / 40 px, blue `rgb(0,85,184)` on white and white on blue; 28 px / 35 px on mobile. H3 24 px / 500 and 18 px / 500.
- Lead: the hero lead is a plain paragraph at 16 px / 400 / 28 px, white on the photo, 1304 px wide (about 130 characters per line, well past a comfortable measure). Mobile 16 px on a 330 px column.
- Body: Libre Franklin 16 px / 400 / 28 px (1.75), black `rgb(0,0,0)`; list items jump to 18 px / 31.5 px on mobile.
- Labels and buttons: pill buttons Montserrat 13 px / 700 (hero pill 211 x 60 px); nav 16 px / 600; footer 12 px Helvetica Neue.
- Spacing: sections use 100 px top and bottom padding on desktop (25 px on mobile). The white overlap card has an 80 px radius. There is no visible scale below 100 px; paragraph and heading margins come from the theme defaults.
- Grid: HubSpot Bootstrap 2 style rows. Content container 1364 px (measured), with 1304 px and 988 px inner widths, three column and four column splits; mobile stacks everything in a 330 px column with 30 px gutters. No CSS `clamp()` in the stylesheets; type steps at breakpoints.

## 4. Motion

Detected libraries: jQuery 3.7.1, WOW.js (reveal), slick carousel (logo strip and testimonial strip), Isotope, Magnific Popup. No GSAP, ScrollTrigger, Lenis, Locomotive, Framer, AOS or Lottie. `scroll-behavior: auto`; scrolling is fully native, nothing is smoothed or hijacked and there is no horizontal scroll at 390 px.

On load

- Nothing animates on load. The hero image is a lazy `background-image` (`cover`, 50 % 50 %, `scroll` attachment, no parallax) behind a blue to transparent gradient; the text is in the first paint.
- Elements carrying `wow fadeIn` (19 on the home page: text blocks, images and the three icon cards) start with `visibility: hidden`, so anything that is already in the viewport on a slow connection is invisible until the script runs.

On scroll

- WOW.js adds `animated` when an element enters the viewport and plays the animate.css `fadeIn` keyframe: **1 s, ease, iteration 1, opacity only**, no translate. Measured opacity while scrolling past section 2: 0.07 at 0 ms, 0.37, 0.66, 0.83, 0.93, 0.98, 1.0 across about 900 ms. All three icon cards in a row fire together (no stagger); the image and text of each two column row fire together.
- Reveals happen once and are not reversed on scroll up.
- Two `.hhs-img` wrappers carry a permanent `translateY(10px)`, which looks like a half finished parallax hook.
- Slick strips (5 client logos, 2 testimonials) sit at the bottom and were not visible as autoplaying in the captures.

Hover and feedback

- Almost everything uses the theme default `transition: all 0.4s ease-in-out` (37 elements on desktop, 44 on mobile) plus `font-size 0.4s`, `height 0.4s` and `background-color 0.4s`. The orange pill turns blue on hover over 400 ms with a small shadow; nav links change colour over 400 ms. No 200 ms tier exists.
- Mega menu appears with no transition (0 s), mobile panel slides in 400 ms ease-in-out. Menu links respond immediately.
- Keyframes present in the CSS bundle include the full animate.css bounce, rubberBand, tada, wobble, jello and heartBeat set, unused on these pages but shipped in 761 KB of CSS.

prefers-reduced-motion (emulated)

- One rule exists: `.animated { animation: unset !important; transition: none !important; }`. Under reduced motion the WOW elements still start hidden and flip straight to visible when they enter the viewport; those below the fold remain `visibility: hidden` until scrolled to, so content is still gated by JavaScript. All 65 hover transitions of 0.4 s remain active; the 0.4 s mobile menu slide is unchanged.

Judgement: the motion is decorative. A uniform 1 s fade on every block neither shows where anything came from nor points to the next step, and the 1 s duration plus the hidden first frame cost orientation on slow connections. The only motion that helps is the mobile panel slide, which confirms the menu action.

## 5. Image treatment

- Photography only: stock style hangar, engine and technician images, a runway nose on aircraft in the hero, business people in the advisory row; a dotted map illustration for global presence; Font Awesome line icons in blue for the three claims. No film, no illustration system.
- Text on media: the hero puts white Montserrat 900 over a blue gradient that fades into the photo; the photo is desaturated and hazy so contrast holds. Elsewhere text never sits on photos: two column rows put the image on one side and text on white or blue on the other. Mega menu cards use a solid colour caption bar under each photo.
- All 30 images have alt text and 25 are `loading="lazy"`; the hero image is a CSS background and so is not lazy and not responsive.
- Weight at 390 px (CDP encoded bytes, fresh profile, cookies declined): **1.40 MB transferred for the initial load (67 requests), 2.42 MB after scrolling the full page (82 requests)**. Breakdown from the resource timing on desktop: images 1.44 MB, CSS 761 KB (including fonts pulled by CSS), scripts 130 KB, HTML 23 KB compressed; the same 362 KB and 172 KB JPEGs are served to mobile and desktop. DOMContentLoaded 2.7 s, load 3.4 s through the proxy at 390 px.

## 6. Trust devices

- Numbers: "45 years", "2+ billion" (assets), 24/7 support, and on the service page "20 years" and a 100+ powerplant fleet claim. NASDAQ listing is mentioned and an Investor Center is in the main nav, which is the strongest proof of scale.
- Address and phone: full corporate headquarters street address, city, state and phone in the footer; nothing in the header; no email address anywhere on the two pages; no form on either page (contact is a separate page).
- Credentials: on the service page, FAA and EASA Part 145 approvals, UK CAA "Known Consignor" status, EASA/FAA dual release, listed by entity and by aircraft family (A320, B737, B737NG, BT3, TCCA and Cayman approvals).
- Place: the world map with facilities, offices and joint ventures; on the service page, named UK and US sites.
- People: none on the home page. One technician photo and two crew photos on the service page; no names, no faces of leadership outside the About section. Client logos (5) and testimonials (2) sit in slick strips near the bottom of the home page.
- Products are named as brands (ConstantThrust, ConstantAccess, Willis Aero, Jet Centre by Willis), which reads as substance to an insider and as jargon to anyone else.

## 7. Ten second test

Not understood within ten seconds: the hero says "sustainable flight" and "asset lifecycle" over an aircraft photo, the three business lines are hidden behind a hover, and the first real router (AOG / finance / services) sits 2500 px down, so a visitor knows it is a large aviation company but not what they can buy or who to call.

## Summary

WLFC is a corporate, template driven HubSpot site: fixed white header with five links and one pill, mega menus with photo cards, a gradient hero over a lazy background photo, and eleven full width sections that alternate white and brand blue. Motion is a single 1 s opacity fade applied to every block via WOW.js, with the theme's global 0.4 s "all" transition on hover; nothing is scroll driven, smoothed or staggered, and the reduced motion rule still leaves content hidden until JavaScript runs. Trust comes from age, listing, regulatory approvals and a street address, not from people. At 390 px the page weighs 1.4 MB before scrolling and 2.4 MB after, with the same JPEGs as desktop.

## Patterns worth borrowing for FHS South Africa

1. One filled pill in the header, always visible on desktop and inside the mobile panel, as the single contact action; it never competes with page content because page CTAs share the same second colour. For FHS the pill is WhatsApp or Contact, with orange for actions and navy for everything else.
2. A three card router with one plain question per card ("Facing an AOG?", "Need to finance engines?") and one button each. The question format is a quick way to send the five FHS doors to the right visitor; it needs to move into the first or second screen, not the fourth.
3. Two column image and text rows with text never placed on the photograph, keeping body text on a solid ground; this is cheap to make legible on mobile and needs no overlay.
4. The mega menu's per business line description in one sentence plus three named links; FHS can use the same idea with a plain dropdown (no photos) for the five doors.
5. Regulatory approvals listed by entity, authority and aircraft family on the service page: the honest, specific version of a "certified" badge. FHS should list only the approvals it or its named partners hold, as the brief requires.
6. Full postal address and phone in the footer on every page; FHS needs this plus registration number and email once the address is settled.

## Patterns to avoid

1. The same 1 s opacity fade on every block, fired with `visibility: hidden` before JavaScript runs. It hides content on slow connections and breaks the "text readable in the first frame" rule; FHS reveals should be 400 to 600 ms, transform and opacity, staggered up to 80 ms, and never gate the hero.
2. Global `transition: all 0.4s ease-in-out` on everything including font size and height; hover feedback should be 200 ms on colour, transform and opacity only.
3. Reduced motion handled by a single `.animated` override that still leaves elements hidden; FHS should switch reveals off and show content in place.
4. A fold with two filled buttons of different colours (header pill and hero pill) and an abstract headline about sustainability; the fold must name the doors.
5. A 76 word paragraph as the second thing on the page and 3500 px of image rows with no link at the end; every FHS section ends with a next step.
6. Nine font files across two families and 761 KB of CSS with the whole animate.css library; FHS has a two family budget already (IBM Plex) and should subset weights.
7. Same JPEGs served to mobile and desktop and a non responsive CSS hero image: 1.4 MB before scrolling is too heavy for South African data costs. Use responsive `srcset` and WebP or AVIF, with a hero under 150 KB at 390 px.
8. A 32 x 24 px burger and 38 px menu rows; tap targets should be 44 px or more.
9. Urgent action buried 3000 px down and pointing at a legacy page; FHS AOG and WhatsApp must be reachable from every screen.
10. Product brand names (ConstantThrust and similar) used as headings; FHS copy should say the job in plain words.
