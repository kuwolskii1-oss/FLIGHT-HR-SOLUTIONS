# 08 · Design blueprint — what Locomotive does, measured, and how to apply it to Flight Hour Solution

Research date: 19 September 2026. This document profiles the Montreal agency **Locomotive** (locomotive.ca), identifies its most celebrated websites, measures how those sites are built (typography, colour, layout, motion, tooling) with headless Chromium, and translates the findings into a blueprint for the new Flight Hour Solution site. Every number is either read from the agency's own code, from Awwwards' jury data, or measured by the extractor described in §6. Screenshots are in `assets/locomotive/`, raw JSON in `data/locomotive/`.

A note on intent: the blueprint borrows Locomotive's **principles, proportions and engineering discipline**, not their assets, copy or identity. Reproducing a reference site would be both a legal problem and a strategic mistake; the value is in the system behind the surface.

## 1. The agency

| Fact | Detail | Source |
|---|---|---|
| Name / positioning | Locomotive®, "Digital-first Design Agency", "Made in Montréal". Manifesto line: "Design and code are only tools of expression. What sets us and our work apart is people." | locomotive.ca |
| Founded | 2008 by three founders: "an ops guy, a designer and a dev". Frédéric Marchand (co-founder, President, 2008) and Mathieu Ducharme (Partner, Technical Director, 2008) are still there | Agency page |
| Size | ~30 people (press release, Sept 2025); the agency page lists 10 in design and 11 in development plus operations | PR Newswire, agency page |
| Address | 1211 Jean-Talon Est, Montréal, QC H2R 1W1 | Site footer |
| Method | "Triforce": operations, design and development working as one team from strategy to deployment and hosting | Agency page |
| Capabilities | Digital strategy, content strategy, UX, copywriting, art direction, web design, web development, hosting, e-commerce; branding (identity, logo, naming, design system); campaigns (content, motion design, photo direction, video) | Agency page |
| Key creatives | Dust Leblanc (Creative Director, since 2014), Julien Jean (Creative Director, 2022), Marie-Christine Dion and Bastien Allard (Senior Art Directors), Sacha Haouzi (Lead UX), Hugo Joseph (Design Lead), Louis Paquet (former Creative Director on Pangram Pangram and Editorial New) | Agency page, case studies |
| Key engineers | Jérémy Minié and Arnaud Pinot (Lead Front-end Developers), Benjamin Roch (Co-Technical Director), Pascal Rioux, Xavier Aymond, Chauncey McAskill, Dominic Lord (back-end) | Agency page, case-study credits |
| Awwwards record | 138 works; **Site of the Year 2021** (Pangram Pangram Foundry, also E-commerce of the Year); 4 Sites of the Month (Design Canada Apr 2018, Locomotive Jun 2019, Editorial New Oct 2019, Locomotive Mar 2023); 92 Sites of the Day; 32 Honorable Mentions; almost every SOTD also carries a Developer Award | awwwards.com/locomotive |
| Agency of the Year | Awwwards **Agency of the Year seven years running (2018–2024)**, the seventh crown awarded February 2025; nominated for Site of the Year with their own site and Lightship, and for E-commerce of the Year with Mate Libre, Ethnocare, Lightship and Scout Motors | PR Newswire 18 Sep 2025, case studies |
| Other awards | Two Webby Awards (own website 2023; the "You = US" HIV anti-stigma campaign for Maggie's Toronto 2025), FWA of the Day (Destigmatize, Mate Libre), Idéa Grand/Gold/Silver prizes (Drake Hotel, K72, Editorial New, Pangram Pangram) | Case studies, press release |
| Open source | Locomotive Scroll (industry-standard smooth-scroll and viewport-detection library, v5 rebuilt on Lenis), Astro boilerplate, Craft boilerplate, component-manager, grid-helper, PostCSS helpers | github.com/locomotivemtl |
| Philosophy in their words | Louis Paquet: "there are tons of similarities between making a film and designing a website: both have the same purpose of telling a story and creating immersive, sometimes extraordinary, experiences"; "take the time to dig into our clients' minds to understand the purpose behind the project"; products that are "not only beautiful, but that will also answer their long term brand and business objectives" | Lovers Magazine interview |

Why this agency is the right benchmark for a technical B2B consultancy: their most recent awarded work is not fashion or gaming but **corporate and industrial**: Wolverine Worldwide (investor and talent site), Truck'N Roll (event logistics and recruitment), Vooban (AI consultancy), Nord Quantique (quantum hardware), Webisoft (software engineering), Populous and GKC (architecture practices), PAVE and BrainBox AI (B2B tech), Lowe's Innovation Labs, Structured (finance built on trust), Désourdy (construction). They repeatedly turn "serious" companies into memorable sites without turning them into circus acts, which is exactly the problem Flight Hour Solution has.

## 2. The shortlist: their best-designed work, and why each is on the list

| # | Site | Type of client | Recognition | Why it matters for Flight Hour Solution |
|---|---|---|---|---|
| 1 | Locomotive® own site (locomotive.ca) | Design agency | SOTM Mar 2023 (8.20; dev 8.34), SOTM 2019, Webby 2023, SOTY nominee | The purest statement of their system: two colours, two typefaces, ruled lists, generous spacing, restrained motion |
| 2 | Pangram Pangram Foundry | Type foundry, Shopify | **Site of the Year 2021**, E-commerce of the Year | Typography-led design at the highest level; a lesson in hierarchy and rhythm |
| 3 | Lightship | Electric RV, pre-orders | SOTD Jan 2026 (dev 8.04), SOTD 2023, SOTY nominee | Product storytelling with engineering credibility; Tailwind + Locomotive Scroll + TypeScript |
| 4 | Vooban | AI consultancy | SOTD Jul 2025 | The closest analogue: a B2B consultancy selling expertise |
| 5 | Nord Quantique | Deep-tech start-up | SOTD May 2024 (dev 7.88) | Making complex engineering legible and premium; dark palette with one saturated accent |
| 6 | Webisoft | Software engineering firm | SOTD Sep 2024 | "Elite team of engineers" positioning translated into a visual identity |
| 7 | Populous | Global architecture firm | SOTD Sep 2024 | Multilingual, project-heavy professional-services site; 3D globe; Contentful |
| 8 | GKC Architecture & Design | Architecture practice | SOTD Nov 2025 | Calm, photographic, GSAP + Lottie micro-interactions |
| 9 | Truck'N Roll | Event logistics | SOTD Jun 2026 (dev 7.73) | Industrial operations turned into a business-development and recruitment platform; custom photoshoot |
| 10 | Scout Motors | Automotive launch | SOTD Jan 2025, E-commerce of the Year | Heritage-plus-technology storytelling with a single hot accent |
| 11 | Wolverine Worldwide | Corporate (investors, talent) | SOTD Jun 2026 | Corporate clarity with brand storytelling; GSAP, Craft CMS, Locomotive Scroll |
| 12 | Lowe's Innovation Labs | Corporate innovation | SOTD Aug 2024 (dev 7.73) | Blue-and-white corporate palette handled with craft |
| 13 | PAVE® | AI inspection SaaS | SOTD Jan 2024 (dev 7.75) | B2B tech with product proof; hero and footer singled out by the jury |
| 14 | BrainBox AI | AI for buildings | SOTD Apr 2022 (design 7.85) | Typography, content architecture; GSAP, Lottie, Locomotive Scroll |
| 15 | Construction Désourdy | Construction | Honorable Mention Oct 2025 | "Minimalist and timeless" direction for a trades business |
| 16 | Structured (maxBTC) | Finance | — | Brand and homepage built explicitly to "build trust in a space defined by complexity" |
| 17 | Editorial New | Type specimen | SOTM Oct 2019 | Micro-interactions and variable type; reference for editorial pacing |
| 18 | L.I.S.A. | Agency AI assistant | SOTD Sep 2026 | Their newest work: WebGL, Blender, conversational UI |
| 19 | Dulcedo | Talent agency platform | SOTD Feb 2026 | Unifying many verticals under one premium system; Craft CMS |
| 20 | Aupale Vodka | Spirits brand | SOTD Mar 2026 | Their Astro build; video and parallax done lightly |
| 21 | McAlpine House | Residential architecture | SOTD Apr 2025 | Photographic minimalism |
| 22 | FUNCTION | Creative studio | SOTD Jun 2025 | Studio portfolio patterns |

Awwwards jury scores are on a 10-point scale across Design, Usability, Creativity and Content; the separate Developer Award scores Semantics/SEO, Animations/Transitions, Accessibility, Web Performance (WPO), Responsive Design and Markup. Across the shortlist the **Animations/Transitions** sub-score is consistently the highest (7.6–8.6) and **Accessibility** the lowest (6.7–7.8): the motion is world-class, the accessibility is merely adequate. The blueprint keeps the first and fixes the second.

## 3. Locomotive's own design system, read from their stylesheet

Their site ships one 31 KB stylesheet (`assets/styles/main.css`) with 77 custom properties on `:root`. This is the system their designers and developers actually use.

**Spacing scale (unitless px; desktop value / mobile value)**

| Token | Desktop | Mobile |
|---|---|---|
| micro | 14 | 8 |
| tiny | 20 | 20 |
| small | 30 | 30 |
| medium | 40 | 40 |
| large | 80 | 52 |
| big | 150 | 80 |
| huge | 200 | 100 |
| enormous | 250 | 140 |

Eight named steps, roughly a 1.4–1.9× progression at the top end. Section spacing lives in the top four steps; component spacing in the bottom four. Mobile compresses the large steps by 35–45 % but leaves the small steps alone.

**Grid:** 12 columns desktop, 4 columns under 700 px; gutter 20 px (10 px on mobile); outer margin 2.667 rem (40 px at the 15 px base; 20 px on mobile). Layout components use `display:grid; grid-template-columns: repeat(var(--grid-columns), 1fr)` (18 declarations) plus 2/3/4/5-column sub-grids.

**Type:** base font-size 15 px (17 px from 2000 px viewports), one weight (400) for both faces. Roles: `--font-size-medium` 1.733 rem (26 px) for body and H2, `--font-size-h1` 4.667 rem (70 px), `--font-size-huge` 7.64 vw (110 px at 1440), H3 1.467 rem (22 px), H4 1.333 rem, H5 1.2 rem. Line-height 1.2 almost everywhere (51 of 74 declarations), 1.1 on the H1, 1.0 on the huge display. No letter-spacing tweaks, almost no uppercase. Faces: **HelveticaNowDisplay Regular** (UI and body) and **PP Locomotive New Light** (a custom serif by Pangram Pangram for display). Measured on the live page: 66 text elements at 26 px, 22 at 70 px, 9 at 110 px, 6 at 15 px; body paragraphs 26 px / 1.2 with a 670 px measure.

**Colour:** `--color: #000000`, `--color-bg: #FFFFFF`; the menu inverts to `--menu-color-bg: #312DFB` (electric blue) with white text; a single red `#DA382E` appears for states. Measured page: text is 100 % black or white; backgrounds are white (109 elements) and black (91 elements). That is the whole palette.

**Motion:** transition durations 0.3 s (40 rules), 0.15 s (24), 0.25 s (15), 0.6 s (4); easing `cubic-bezier(0.215, 0.61, 0.355, 1)` (ease-out-cubic, 43 rules) and `cubic-bezier(0.23, 1, 0.32, 1)` (ease-out-quint, 9 rules); hover effects gated behind `@media (hover: hover)` (14 rules); `prefers-reduced-motion: no-preference` guards for the optional flourishes. Ten keyframe animations, most of them for the L.I.S.A. assistant widget.

**Breakpoints:** 700 px (mobile/tablet), 1025 px (desktop), plus 1200, 1600 and 2000 px steps that only change the base font-size; `max-height: 480px` and `min-aspect-ratio: 4/3` guards for short viewports.

**Architecture:** ITCSS layers with BEM-style prefixes (`o-grid` objects, `c-header`, `c-work`, `c-footer`, `c-wysiwyg` components, `u-` utilities, `is-`/`has-` states). JavaScript bundle (`app.js`, 710 KB) contains GSAP with ScrollTrigger, Lenis and Locomotive Scroll v5, Three.js and OGL with GLSL shaders (107 shader references) for the WebGL moments, Barba for page transitions, IntersectionObserver-based reveals. CMS: Craft (their Craft boilerplate), Google Tag Manager, reCAPTCHA on forms, CookieConsent v3 (the `--cc-*` tokens).

## 4. Their engineering conventions (what they open-source)

- **Astro boilerplate (current):** Astro 6, Tailwind CSS 4 with PostCSS, `postcss-utopia` for **fluid type and space scales** (Utopia generates `clamp()` ramps between a mobile and a desktop viewport), Locomotive Scroll v5, **Swup** for page transitions (head, preload and scripts plugins), Nanostores for state, TypeScript, Prettier, `@locomotivemtl/component-manager` (attribute-driven component instantiation, successor of modularJS) and `@locomotivemtl/grid-helper` (a keyboard-toggled grid overlay for checking alignment).
- **Craft boilerplate:** Craft CMS on PHP 8.2 with Vite for the front-end toolchain; the same front-end stack applies.
- **Legacy boilerplate (retired):** Sass + ITCSS, custom grid system, esbuild, SVG spritesheets, Locomotive Scroll v4, modularJS. The current agency site still reflects this generation.
- **Locomotive Scroll v5 (9.4 kB gzipped, built on Lenis):** native scrollbar and keyboard navigation preserved; `data-scroll` enables viewport detection and toggles `is-inview`; `data-scroll-speed` drives parallax (auto-disabled on touch unless `data-scroll-enable-touch-speed`); `data-scroll-position` (`start`, `middle`, `end`), `data-scroll-offset` ("0,0"), `data-scroll-repeat`, `data-scroll-call` (custom events), `data-scroll-css-progress` (writes a `--progress` custom property from 0 to 1), `data-scroll-event-progress`, `data-scroll-to` anchors with `-offset` and `-duration`, `data-scroll-ignore-fold`. Lenis defaults they ship: `lerp 0.1`, `duration 1.2`, `smoothWheel true`, `smoothTouch false`, `wheelMultiplier 1`, `touchMultiplier 2`, easing `1.001 - 2^(-10t)`; observers use `triggerRootMargin -1px` and `rafRootMargin 100%` so elements only subscribe to the animation frame while near the viewport.
- **Working rule they publish:** one smooth-scroll engine per site (Lenis under Locomotive Scroll), GSAP for choreography, IntersectionObserver for reveals, WebGL only where a scene carries meaning.

## 5. How Locomotive thinks and works, in their own words

Primary sources: their Medium essays (retrieved through the Internet Archive because Medium blocks automated readers), the Lovers Magazine interview with Louis Paquet, their agency page and case-study credits.

**Content first, then design.** Dust Leblanc (Creative Director since 2014): "one thing has always mattered to me: crafting from great original content. Not just making things look good, but building cohesive digital experiences where content and design work together from the start." He describes the classic failure: "You spend weeks crafting a sick layout, only to have it completely butchered when the client drops in their 'pretty good' content." Their answer is to shape content and photography as part of the mandate: a custom photoshoot with Consulat for Truck'N Roll, brand studios (Manual, Baillat, Malvah, Caserne) as partners, copywriters and content strategists credited on projects.

**Understand the purpose, then tell a story.** Louis Paquet: "it's important for me to take the time to dig into our clients' minds to understand the purpose behind the project"; websites and films "have the same purpose of telling a story and creating immersive, sometimes extraordinary, experiences"; the goal is work that is "not only beautiful, but that will also answer their long term brand and business objectives."

**Developers in the room, discipline over ideas.** On Lightship (four months to launch at SXSW): "Developers were in most conversation, grounding ambition in execution. In the end, if ideas do not ship, what good are they." "Half of those four months were pure exploration. That left only two months for development, and the final content landed ten days before launch." "To launch on time, we sacrificed some ideas and doubled down on others." The agency describes itself as a "Triforce" of operations, design and development.

**Motion is a tool with a cost.** Their own 2022 essay on Locomotive Scroll is unusually candid: smooth scrolling "uses the scroll hijacking concept to deliver a more fluid scrolling experience"; it "opens creative possibilities" for "experiential projects that seek to evoke emotions", but "Scroll hijacking is often considered a bad practice. It can shock or perturb user habits, be performance-greedy, and create accessibility concerns". Their rule: "for an e-commerce site, we generally want to prioritize conversion, performance, and native browser experience. A more experiential site, such as an agency portfolio, could prioritize the 'wow factor'." Locomotive Scroll v5 (2024–2026) reflects that lesson: it now keeps the native scrollbar and keyboard navigation and only smooths the wheel.

**Build with a small, known toolkit.** From "Why don't we use front-end frameworks at Locomotive?" (2021): "the vast majority of our sites are built without front-end frameworks"; their boilerplate is "like a 'mini framework'" and "when we see a design, our boilerplate allows us to know very quickly whether it's possible and feasible to develop a certain feature within it." Frameworks are reserved for "application-style" projects with "many components and variations, and a lot of data to manage" (React for Report.Cards and Agora, Nuxt for Fontshare). The 2026 boilerplate keeps that stance with Astro (static-first, islands only where needed), Tailwind 4, Locomotive Scroll, Swup and Nanostores; content sites run on Craft CMS, shops on Shopify, and Contentful or WordPress appear when the client already has them (Populous, The Drake Hotel).

**UX grounded in cognitive rules.** Their UX lead Sacha Haouzi teaches three: the **Halo effect** ("the first screen the user encounters is really a deciding factor, as it will influence their perception of the site and their journey"), **Hick's law** (Air Inuit: "instead of having 8 sections, you put forward only the 4 big ones"), and the **Von Restorff effect** (one visually different element, such as a red notification dot, directs attention).

**Culture and client work.** "A small studio of less than 30 talented humans"; "Talk to the human. Even before you sign." Their case studies always credit the client team and quote them ("More than a design team: a business partner who understands our reality", Truck'N Roll CEO Rémy Auclair).

**What the jury data says about their trade-offs.** Across the shortlisted Developer Awards, Animations/Transitions scores 7.6–8.6 while Accessibility scores 6.7–7.8 and is the lowest sub-score on almost every project (Wolverine 6.8, Vooban 6.8, Dulcedo 6.8, Editorial New 6.7). Web Performance is middling (7.0–8.4). For a B2B consultancy whose visitors arrive on laptops behind corporate networks, the blueprint takes Locomotive's typography, spacing, pacing and choreography, and deliberately raises the accessibility and performance floor above theirs.

## 6. Measured design data for the shortlist

### 6.1 Method

Every site in §2 was loaded with headless Chromium (Playwright 1.56) twice: a **desktop** context of 1440 × 900 px and a **mobile** context emulating an iPhone 13 (390 × 844 px at 3×). The extractor (`data/locomotive/tools/dna.js`) dismissed cookie banners and newsletter modals, scrolled the full page once so lazy content and reveal animations could fire, scrolled back to the top and then recorded:

- **Typography:** computed font family, size, weight, line-height, letter-spacing and text-transform for every visible text element; the H1; the heading ladder; the first real body paragraph and its measure; the largest text on the page as a percentage of the viewport width.
- **Colour:** computed text colours by element count and background colours weighted by painted area; the body background; a "dark first view" flag (the first viewport is mostly dark).
- **Layout:** max-widths, border radii, number of CSS-grid containers, header position and blend mode, whether the navigation collapses to a burger on desktop.
- **Motion and tooling:** transition durations and easing functions counted across all same-origin stylesheets, keyframe count, `clamp()` and `vw` font sizes, breakpoints, `:root` custom properties (count and sample), and library signatures found in the loaded scripts (GSAP, ScrollTrigger, SplitText, Lenis, Locomotive Scroll, Three.js/OGL, GLSL, Barba, Swup, Lottie, Swiper, Splide, Alpine, Vue, React, Astro, Shopify, IntersectionObserver, `prefers-reduced-motion`).
- **Pattern signals:** custom cursor, marquee, preloader, split-text reveals, parallax attributes, horizontal scroll, theme switching, smooth-scroll container, page transitions, sticky and fixed elements, videos, canvases, inline SVG, iframes, image formats, language switch.
- **Weight:** transferred kilobytes and request count by resource type, DOMContentLoaded and load timings (indicative only: headless, through a proxy, no cache).
- **Screenshots:** first viewport, second viewport (scrolled 90 % of one screen), open menu, and full page on desktop; first viewport and full page on mobile.

Awwwards jury scores, notable-element tags, colour tags and listed technologies were collected separately for each project (`data/locomotive/awards.json`), and Locomotive's own case studies supplied credits and client quotes. Where Chromium could not render a site, a static fetch of the HTML and stylesheets (`tools/static_dna.py`) recovered fonts, tokens, breakpoints, durations, easings, colours and script signatures. Raw output is in `data/locomotive/sites/*.json` and `data/locomotive/static_results.json`; the tables below were generated from it with `tools/loco_md2.py`.

### 6.2 Summary table

Reading guide: "Display type" gives the H1 as rendered and the largest text on the page; "Type families (elements)" counts visible text elements per family; palettes are computed from the rendered page, not from brand guidelines; "Weight" is the transfer size at load in this environment.

| Site | Client type | Awwwards record | Capture | Display type: H1 / largest text | Type families (elements) | First-view palette (computed) | Motion & tooling detected | Pattern signals | Weight (KB) / requests |
|---|---|---|---|---|---|---|---|---|---|
| **Locomotive® (own site)** | Design agency | Awwwards SOTM Mar 2023 + Developer Award (8.34), SOTM Jun 2019, Webby Award 2023; SOTY nominee | desktop 1440 px | 70px LocomotiveNew 400 lh 1.1 — “Locomotive® Digital-first Design Agency”; largest 110 px = 7.6 % of viewport | HelveticaNowDisplay (80), LocomotiveNew (31) | bg #FFFFFF, #000000; text #000000, #FFFFFF | Lenis, ScrollTrigger, SplitText, barba, glsl, gsap, locomotive, swiper, three, vue | theme switching, smooth-scroll container, dark first view, video×1, canvas×2 | 962 / 20 |
| **Pangram Pangram Foundry** | Type foundry / e-commerce | Awwwards Site of the Year 2021 + E-Commerce of the Year, SOTD Nov 2021, Developer Award, Mobile Excellence; Idéa Gold & Silver | desktop 1440 px | 14px Neue Montreal 600 lh 1.3 — “Pangram Pangram Foundry”; largest 145 px = 10.1 % of viewport | Neue Montreal (300), palma-fizzy-heavy (3), neue-montreal-semibold (3) | bg #EDEDED, #000000 @99%, #000000; text #000000, #666666 | Alpine, Shopify, alpine, ogl, shopify, swiper, vue | parallax attrs, horizontal scroll, video×1 | 3281 / 94 |
| **Lightship (2026 redesign)** | Electric RV maker, e-commerce pre-orders | SOTD Jan 2026 + Developer Award 8.04; earlier SOTD Apr 2023; SOTY and E-Commerce of the Year nominee | mobile 390 px only (desktop blocked, see §6.3) | 40px F37Bolton 400 lh 1 — “Born for Adventure. Built in America.”; largest 40 px = 10.3 % of a 390 px viewport | F37Bolton (199) | bg #FAF6EF, #000000, #FFFFFF; text #000000, #FFFFFF | — | split-text reveals, parallax attrs, smooth-scroll container, page transitions, dark first view, video×1 | 16050 / 84 (mobile) |
| **Vooban (2025)** | AI consultancy (B2B services) | SOTD Jul 2025 + Developer Award; earlier SOTD Nov 2020 | static CSS/HTML only (Chromium blocked, see §6.3) | H1 “Tout le monde parle d'IA. Chez Vooban, la déployer est notre métier.” (size not rendered) | @font-face: NB International, NB International Mono | CSS hex colours: #FFF, #000, #FD5959, #4358C8, #F0F4F7 | Lenis, Locomotive Scroll attrs, ScrollTrigger, SplitText, Splitting, gsap, ogl, swiper, swup | data-scroll attrs ×57, clamp() ×34, vw ×125 | HTML 171 + CSS 208 |
| **Nord Quantique** | Quantum computing deep-tech | SOTD May 2024 + Developer Award 7.88 | mobile 390 px only (desktop blocked, see §6.3) | 36px ATsurt 500 lh 1.19 — “The Nord Quantique advantage”; largest 36 px = 9.2 % of a 390 px viewport | Outfit (62), ATsurt (16), Poppins (2) | bg transparent, #24222E, #9F8FA9; text #AA987D, #24222E | jQuery, swiper, wp-content | split-text reveals, horizontal scroll, dark first view, video×1 | 9902 / 97 (mobile) |
| **Webisoft®** | Software engineering firm (B2B services) | SOTD Sep 2024 + Developer Award | desktop 1440 px | 55px Helvetica Now Display 500 lh 1 — “A North American team of specialists with profound technical expertise”; largest 200 px = 13.9 % of viewport | Suisse Intl Mono (110), Helvetica Now Display (47), Helvetica Now Text (42) | bg #F0F1F4, #FFFFFF, #DE5849; text #000000, transparent | Astro, _astro, astro | custom cursor, split-text reveals, parallax attrs, theme switching, sticky×8, canvas×2 | 341 / 16 |
| **Populous** | Global architecture firm (professional services) | SOTD Sep 2024 + Developer Award | desktop 1440 px | 79px SuisseIntl 400 lh 1 — “We design the places where people love to be together.”; largest 79 px = 5.5 % of viewport | SuisseIntl (159) | bg #010101, #FFFFFF, #000000 @10%; text #010101, #FFFFFF | Lenis, ScrollTrigger, SplitText, glsl, gsap, locomotive, splide, swup, three | custom cursor, preloader, split-text reveals, smooth-scroll container, page transitions, dark first view, sticky×9, video×2 | 2383 / 34 |
| **GKC Architecture & Design** | Architecture firm (professional services) | SOTD Nov 2025 + Developer Award 7.48 | desktop 1440 px | 32px ABCDiatype 700 lh 1.1 — “GKC Architecture & Design”; largest 230 px = 16 % of viewport | ABCDiatype (121), SuisseIntlCond (34) | bg #FFFFFF, #151F26, #1444F0; text #151F26, #A2A2A2 | Lenis, ScrollTrigger, SplitText, Splitting, gsap, lottie, swiper, swup | preloader, split-text reveals, parallax attrs, horizontal scroll, theme switching, smooth-scroll container, page transitions, dark first view, sticky×4, video×2 | 1771 / 17 |
| **Truck'N Roll®** | Event logistics / transport (industrial B2B, recruitment) | SOTD Jun 2026 + Developer Award 7.73 | desktop 1440 px | 200px National 2 Condensed 900 lh 0.7 UPPER — “FULL TOURS, NO EXCUSES.”; largest 420 px = 29.2 % of viewport | Helvetica Now Display (118), National 2 Condensed (30) | bg #131313, #FEFEFE, #D8D3D3; text #FEFEFE, #D8D3D3 | swup | split-text reveals, parallax attrs, theme switching, smooth-scroll container, page transitions, dark first view | 1590 / 38 |
| **Scout Motors** | Automotive launch (industrial storytelling, e-commerce) | SOTD Jan 2025 + Developer Award; E-Commerce of the Year (per Locomotive case study) | desktop 1440 px | 72px scout-sans-wide-medium 400 lh 0.9 — “Scouts always come back.”; largest 504 px = 35 % of viewport | scout-ibm-plex-mono (43), scout-sans-regular (42), scout-sans-medium (38) | bg #EDE9E8, #FFFFFF, #FF5432; text #FFFFFF, #1C1C1A | Astro, _astro, gsap | custom cursor, marquee, preloader, split-text reveals, parallax attrs, horizontal scroll, smooth-scroll container, page transitions, sticky×4, video×3, canvas×2 | 11787 / 215 |
| **Wolverine Worldwide** | Corporate site for investors and talent | SOTD Jun 2026 + Developer Award 7.58 | desktop 1440 px | 16px ABCDiatype 400 lh 1.5 — “Make. Every Day. Better.”; largest 168 px = 11.7 % of viewport | ABCDiatype (78), ABCDiatype-Mono (20) | bg #010101, #010101 @20%, #FFFFFF; text #FFFFFF, #000000 | SplitText, componentManager, gsap, swup | custom cursor, smooth-scroll container, page transitions, dark first view, sticky×1, video×1 | 615 / 59 |
| **Lowe's Innovation Labs** | Corporate innovation lab | SOTD Aug 2024 + Developer Award | desktop 1440 px | 115px Fellix 500 lh 0.85 — “We bring the future home.”; largest 115 px = 8 % of viewport | Helvetica Now Text (315), Fellix (141) | bg #FAFAFA, #000000, #FFFFFF; text #000000, #FFFFFF | Lenis, ScrollTrigger, SplitText, glsl, gsap, lottie, splide, three | preloader, split-text reveals, parallax attrs, theme switching, smooth-scroll container, dark first view, sticky×1, canvas×2 | 3956 / 32 |
| **PAVE®** | AI vehicle-inspection platform (B2B SaaS) | SOTD Jan 2024 + Developer Award 7.75 | desktop 1440 px | 61px Sora 700 lh 1.06 — “The world's most advanced automated vehicle inspection platform”; largest 61 px = 4.3 % of viewport | Inter (101), Sora (32) | bg #F7FAFC, #F5F8FB, #000000 @86%; text #07101A, #536474 | ScrollTrigger, gsap, wp-content | split-text reveals, theme switching, page transitions, dark first view, video×1 | 1319 / 52 |
| **BrainBox AI** | AI/energy tech (B2B) | SOTD Apr 2022 + Developer Award | desktop 1440 px | 56px Atlas Grotesk 300 lh 1.1 — “Transforming buildings with autonomous and generative AI”; largest 110 px = 7.7 % of viewport | Atlas Grotesk (198), Helvetica Neue (4) | bg #FFFFFF, #F6F6F6, #17171B; text #17171B, #FFFFFF | ScrollTrigger, SplitText, gsap, jQuery, react | split-text reveals, horizontal scroll, dark first view | 2471 / 121 |
| **Construction Désourdy** | Construction / real estate (B2B/B2C) | Honorable Mention Oct 2025 | desktop 1440 px | 16px GT America 400 lh 1.5 — “Désourdy Construction”; largest 48 px = 3.3 % of viewport | GT America (107) | bg #141415, #F1ECE8, #FFFFFF; text #141415, #F1ECE8 | Astro, SplitText, _astro, astro, storyblok | custom cursor, split-text reveals, parallax attrs, smooth-scroll container, page transitions, sticky×3 | 1377 / 52 |
| **Structured (maxBTC)** | Finance / Bitcoin yield product (trust-building) | none listed | unreachable from this environment (TLS tunnel refused) | — | — | Awwwards palette: n/a | Awwwards tech: n/a | — | — |
| **Editorial New** | Type specimen microsite | SOTM Oct 2019, SOTD, Developer Award, Mobile Excellence; Idéa Gold & Silver | desktop 1440 px | 16px Editorial New 400 lh 1.33 — “Editorial New”; largest 1728 px = 120 % of viewport | Editorial New (474), Neue Montreal (76) | bg #F4F4F4, #1A1A1A, #F6F6F6; text #1A1A1A, #F4F4F4 | — | custom cursor, preloader, split-text reveals, parallax attrs, smooth-scroll container | 1253 / 22 |
| **L.I.S.A. (Locomotive Interactive Super Assistant)** | Agency AI assistant microsite | SOTD Sep 2026 + Developer Award 7.52 (with 60fps) | desktop 1440 px (WebGL first view; DOM nearly text-free) | —; largest 15 px = 1 % of viewport | Times New Roman (10) | bg #000000; text #000000 | Lenis, ScrollTrigger, SplitText, barba, glsl, gsap, locomotive, swiper, three, vue | preloader, theme switching, dark first view | 3323 / 8 |
| **Dulcedo** | Talent management agency (portfolio platform) | SOTD Feb 2026 + Developer Award | desktop 1440 px | 16px Helvetica Now Display 500 lh 1.4 — “Dulcedo”; largest 140 px = 9.7 % of viewport | Helvetica Now Display (361), Saol Display (6) | bg #F4F4F4, #0A0A0A, #000000 @5%; text #0A0A0A, #000000 | Vue, cpresources, gsap, lottie, swup | custom cursor, preloader, split-text reveals, parallax attrs, theme switching, smooth-scroll container, page transitions, dark first view, sticky×9, video×2, canvas×1 | 3359 / 76 |
| **Aupale Vodka** | Premium spirits brand | SOTD Mar 2026 + Developer Award | mobile 390 px only (desktop blocked, see §6.3) | 50px InstrumentSerif-20eeea0c6e7eec58 400 lh 0.84 — “Born From The Untouched Wilderness.”; largest 119 px = 30.6 % of a 390 px viewport | Martha-a6f99d8cc2cc3d04 (184), InstrumentSerif-20eeea0c6e7eec58 (94), HelveticaNowDisplay-a2f8c48b330dbb44 (46) | bg #FFFFFF, #0D1015, #D0DED7; text #0D1015, #FFFFFF | Astro, Locomotive Scroll attrs, _astro, astro, barba, lenis, ogl, storyblok | custom cursor, split-text reveals, parallax attrs, smooth-scroll container, page transitions, dark first view, sticky×4 | 3257 / 132 (mobile) |
| **McAlpine House** | Architecture / residential design | SOTD Apr 2025 + Developer Award | mobile 390 px only (desktop blocked, see §6.3) | 28px Canela Text 700 lh 1.1 — “McALPINE”; largest 40 px = 10.3 % of a 390 px viewport | Canela Text (60), Canela (37) | bg #FFFFFF, #EBEBEB, #3E3E43 @65%; text #241C18, #FFFFFF | Lenis, Locomotive Scroll attrs, ScrollTrigger, SplitText, gsap, locomotive, ogl, swiper, swup | preloader, split-text reveals, smooth-scroll container, dark first view, video×3 | 991 / 24 (mobile) |
| **FUNCTION** | Creative studio | SOTD Jun 2025 + Developer Award | desktop 1440 px | 16px TWKEverett 400 lh 1.1 — “Function 10 is a platform for Ballroom culture, stories, and events.”; largest 265 px = 18.4 % of viewport | TWKEverett (85), monospace (5) | bg #000000, #FFFFFF, #111111; text #FFFFFF, #000000 | Lenis, ScrollTrigger, SplitText, gsap, swup | split-text reveals, parallax attrs, theme switching, smooth-scroll container, page transitions, dark first view, sticky×2, video×2 | 2708 / 29 |

### 6.3 Sites that could not be fully rendered, and how they were handled

- **Lightship, Nord Quantique, Aupale Vodka, McAlpine House** (Cloudflare-fronted hosts): the desktop context was refused with `ERR_TOO_MANY_RETRIES` through this environment's proxy on every attempt, including with HTTP/2 and QUIC disabled. The mobile context loaded, so their rows use the **mobile capture** and the sheets add a static CSS analysis. Their desktop type sizes are therefore unknown; the Awwwards notes and case studies fill the gap.
- **Vooban**: the host answered Chromium with an HTTP 403 challenge page in both contexts; curl was accepted, so the row and sheet come from **static analysis only** (fonts, tokens, breakpoints, motion stack, colours, H1 and navigation are reliable; rendered sizes and computed colours are not).
- **Structured (maxBTC)**: the proxy refused the TLS tunnel to the host; no measurements at all. Only the case study and Awwwards data are used.
- **L.I.S.A.**: loaded, but the whole first view is WebGL; the DOM carries almost no text. The script signatures and tokens are valid, the type metrics are not, and it is excluded from the type aggregates.
- **Pangram Pangram and Dulcedo**: desktop captured; the mobile context was reset by the host after retries, so their mobile columns are missing.
- **Video and WebGL heroes** (Locomotive, Populous, Dulcedo, Truck'N Roll, Lowe's Labs, Scout Motors) render as black or empty rectangles in headless Chromium, which ships without proprietary video codecs and renders WebGL in software. Where a first-view screenshot shows a black block, that is the video slot, not the design. The second-view and full-page captures show the real layout.

### 6.4 Per-site data sheets

Each sheet quotes the Awwwards record first, then the measured values. Screenshots are in `assets/locomotive/` (desktop 1440 px wide, mobile at 780 px for the first view and 480 px for the full page; the full-page images are heavily compressed and meant for layout reading, not pixel inspection).

### Locomotive® (own site) — https://locomotive.ca/en
Client type: Design agency. Awards: Awwwards SOTM Mar 2023 + Developer Award (8.34), SOTM Jun 2019, Webby Award 2023; SOTY nominee. Scores: SOTD 8.20 · Design 8.44 · Usability 7.74 · Creativity 8.32 · Content 8.38 · Dev 8.34 (Anim 8.6, Responsive 8.8, WPO 8.4). Awwwards-listed tech: Craft CMS, GSAP + ScrollTrigger, Locomotive Scroll v5 (Lenis), Three.js/OGL shaders, Barba, ITCSS/BEM, HelveticaNowDisplay + PP Locomotive New. Awwwards palette: #000 / #FFF, menu #312DFB, accent #DA382E. Case study: https://locomotive.ca/en/agency

- Title: “Locomotive | Montreal web agency” · lang en · generator — · DOM nodes 310 · page height 6629 px (desktop) / 5385 px (mobile)
- Fonts loaded: HelveticaNowDisplay 400 normal, LocomotiveNew 400 normal; @font-face: HelveticaNowDisplay 400 normal, LocomotiveNew 400 normal, swiper-icons 400 normal
- H1: 70px LocomotiveNew 400 lh 1.1 — “Locomotive® Digital-first Design Agency” (decorative emoji glyphs in the rendered H1 removed); mobile H1 36 px; largest text 110 px (7.6 % of viewport width) “Lightship”
- Type usage: sizes 26px×66, 70px×22, 110px×9, 0px×8, 15px×6; weights 400×111; line-heights 1.2×61, 1.1×22, 1×12, NaN×8; letter-spacing none; uppercase share 0 %
- Body copy: 26px/1.2 HelveticaNowDisplay, measure ≈670 px
- Colour (computed): text #000000×100, #FFFFFF×11; backgrounds by area #FFFFFF, #000000; body bg transparent
- Layout: max-widths fluid (no px max-width found); radii none; grid containers 28; header fixed (mix-blend normal); burger menu yes
- Nav: —; CTAs/buttons: Let's talk, The dynasty, Agency, Careers, Cookie preferences, Newsletter ↓
- Motion stack (script signatures): gsap, ScrollTrigger, Lenis, three, barba, SplitText, vue, swiper, glsl, IntersectionObserver; globals: —; script hints: locomotive, ogl, recaptcha, gtag
- Pattern signals: theme switching, smooth-scroll container, dark first view, video×1, canvas×2; images 7 (other 6, jpg 1); inline SVG 0; iframes 1
- CSS tokens (same-origin sheets 2, blocked 0): 81 custom properties; breakpoints (max-width: 699px), (min-width: 1025px), (max-width: 1024px), (min-width: 700px), (min-width: 700px) and (max-width: 1024px), (hover: hover); durations 0.3s×28, 0.15s×16, 0.25s×10, 200ms×3, 1s×3; easings cubic-bezier(0.215, 0.61, 0.355, 1)×33, ease×10, linear×4, cubic-bezier(0.23, 1, 0.32, 1)×4; keyframes 10; fluid type: clamp() 0, vw 3
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--color: #000000`; `--color-bg: #FFFFFF`; `--font-size: 21px`; `--spacing-micro-mobile: 8`; `--spacing-micro: 14`; `--spacing-tiny-mobile: 20`; `--spacing-tiny: 20`; `--spacing-small-mobile: 30`; `--spacing-small: 30`; `--spacing-medium-mobile: 40`; `--spacing-medium: 40`; `--spacing-large-mobile: 52`; `--spacing-large: 80`; `--spacing-big-mobile: 80`
- Weight: 962 KB over 20 requests (script 694 KB, img 125 KB, css 113 KB, link 31 KB); DOMContentLoaded 7674 ms, load 11551 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H1 70px “Locomotive® Digital-first Design Agency”; H2 26px “Featured work”; H3 15px “Lightship”; H3 15px “Wolverine Worldwide”; H3 15px “The Drake Hotel”; H3 15px “Dulcedo”; H3 15px “Scout Motors”; H3 15px “All Work”
- Screenshots: locomotive-desktop-fold.jpg, locomotive-desktop-view2.jpg, locomotive-desktop-full.jpg, locomotive-mobile-fold.jpg, locomotive-mobile-full.jpg

### Pangram Pangram Foundry — https://pangrampangram.com
Client type: Type foundry / e-commerce. Awards: Awwwards Site of the Year 2021 + E-Commerce of the Year, SOTD Nov 2021, Developer Award, Mobile Excellence; Idéa Gold & Silver. Scores: SOTD 7.79 · Dev 7.73 (Anim 8.4, Content 8.1). Awwwards-listed tech: Shopify, Locomotive Scroll, JavaScript. Awwwards palette: #000 / #9C9C9C / #FFF. Case study: https://locomotive.ca/en/work/pangram-pangram-foundry

- Title: “Pangram Pangram — Free to try, High-Quality Fonts for Designers – Pangram Pangram Foundry” · lang en · generator — · DOM nodes 1458 · page height 8319 px (desktop)
- Fonts loaded: Neue Montreal 1 999 normal, neue-gstaad-normal-normal-semibold 400 normal, palma-fizzy-heavy 400 normal, neue-montreal-semibold 600 normal, neue-york-normal-bold 700 normal, watch-medium 485 normal, kyoto-semibold 600 normal, frama-semibold 580 normal; @font-face: Neue Montreal 1 999 , neue-gstaad-normal-normal-semibold 400 normal, palma-fizzy-heavy 400 normal, neue-montreal-semibold 600 normal, palma-fizzy-heavy 800 normal, neue-york-normal-bold 700 normal, neue-gstaad-normal-bold 700 normal, watch-medium 485 normal, neue-corp-normal-semibold 500 normal, museum-light 300 normal, model-plastic-regular 500 normal, kyoto-semibold 600 normal, mori-bold 700 normal, frama-semibold 580 normal, monument-narrow-medium 525 normal
- H1: 14px Neue Montreal 600 lh 1.3 — “Pangram Pangram Foundry”; largest text 145 px (10.1 % of viewport width) “Palma”
- Type usage: sizes 14px×184, 12px×64, 22px×17, 36px×16, 18px×12, 103px×12, 29px×12, 16px×4; weights 400×249, 600×47, 530×11, 700×6; line-heights 1.3×178, 1.17×55, normal×49, 1×33; letter-spacing none; uppercase share 0 %
- Body copy: 22px/1.3 Neue Montreal, measure ≈846 px
- Colour (computed): text #000000×164, #666666×98, #FAFAFA×36, #FFFFFF×25; backgrounds by area #EDEDED, #000000 @99%, #000000, #FF2F00, #FFFFFF; body bg #FAFAFA
- Layout: max-widths 1440px×14, 720px×5; radii 20px×76, 999px×55, 50%×16; grid containers 53; header static (mix-blend normal); burger menu yes
- Nav: Pangram Pangram Foundry, All fonts, Font starter pack, Font in use, Academy, Support, Pangram Pangram, All fonts, Font starter pack, Font in use, Academy, About us, Search, Contact us, Font licenses; CTAs/buttons: Skip to content, Explore font, Try for Free, Card view, List view, View all fonts, Check it out, View all
- Motion stack (script signatures): shopify, alpine, vue, swiper, IntersectionObserver, ogl; globals: Shopify, Alpine; script hints: shopify, ogl, gtag
- Pattern signals: parallax attrs, horizontal scroll, video×1; images 37 (jpg 16, webp 3, png 5, svg 13); inline SVG 40; iframes 1
- CSS tokens (same-origin sheets 20, blocked 1): 105 custom properties; breakpoints screen and (width >= 768px), screen and (width >= 750px), screen and (width <= 767px), screen and (width <= 749px), screen and (forced-colors: active), screen and (width >= 990px); durations auto×7, 0.2s×4, 1.4s×4, 1s×1, 0.3s×1; easings ease×3, ease-in-out×2, var(--swiper-wrapper-transition-timing-function,initial)×1, ease-out×1; keyframes 25; fluid type: clamp() 0, vw 1
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--color-black: 0 0 0%`; `--color-white: 0 0 100%`; `--color-offwhite: 0 0 98%`; `--color-gray: 0 0 93%`; `--color-gray-medium: 0 0 85%`; `--color-gray-dark: 0 0 67%`; `--color-gray-darker: 0 0 40%`; `--color-red: 11 100% 50%`; `--color-yellow: 43 100% 50%`; `--color-green: 148 100% 68%`; `--color-blue: 209 100% 87.5%`; `--color-orange: 24.9 100% 48.6%`; `--color-primary: var(--color-red)`; `--color-foreground: var(--color-black)`
- Weight: 3281 KB over 94 requests (img 1561 KB, css 1136 KB, script 491 KB, iframe 29 KB); DOMContentLoaded 16526 ms, load 32162 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H1 14px “Pangram Pangram Foundry”; H2 121px “Neue Gstaad”; H2 145px “Palma”; H2 121px “Neue Montreal”; H2 14px “Our newest fonts”; H3 18px “Neue Gstaad Collection”; H3 18px “Palma Collection”; H3 18px “Neue Montreal”
- Mobile capture: blocked (connection reset by the host after repeated retries).
- Screenshots: pangram-desktop-fold.jpg, pangram-desktop-view2.jpg, pangram-desktop-menu.jpg, pangram-desktop-full.jpg

### Lightship (2026 redesign) — https://lightshiprv.com
Client type: Electric RV maker, e-commerce pre-orders. Awards: SOTD Jan 2026 + Developer Award 8.04; earlier SOTD Apr 2023; SOTY and E-Commerce of the Year nominee. Scores: SOTD 7.37 · Dev 8.04 (SEO 8.2, Anim 8.2, WPO 8.2). Awwwards-listed tech: Tailwind, Locomotive Scroll, TypeScript. Awwwards palette: #FFFFFF / #000000. Case study: https://locomotive.ca/en/work/lightship

- Capture note: desktop navigation failed (`ERR_TOO_MANY_RETRIES` from the Cloudflare-fronted host when reached through this environment's proxy); metrics below come from the **mobile capture (390 × 844 px)**, complemented by static CSS analysis.
- Title: “Home — Lightship” · lang en · generator — · DOM nodes 776 · page height 8626 px (mobile)
- Fonts loaded: F37Bolton 400 normal, F37Bolton 700 normal; @font-face: F37Bolton 400 normal, F37Bolton 700 normal
- H1: 40px F37Bolton 400 lh 1 — “Born for Adventure. Built in America.” (split-text duplicates collapsed (the DOM carries each word twice for the reveal animation)); largest text 40 px (10.3 % of viewport width) “Born for Adventure.”
- Type usage: sizes 40px×76, 12px×41, 36px×33, 18px×11, 22px×10, 14px×10, 25px×7, 16px×6; weights 400×192, 700×7; line-heights 1×114, 1.25×83, 1.2×2; letter-spacing -0.05em×116, -0.03em×10; uppercase share 0 %
- Body copy: 18px/1.25 F37Bolton, measure ≈358 px
- Colour (computed): text #000000×93, #FFFFFF×91, #A1A1A1×9, #000000 @40%×6; backgrounds by area #FAF6EF, #000000, #FFFFFF, #F2EFEA, #000000 @70%; body bg transparent
- Layout: max-widths 768px×3, 690px×1, 1000px×1, 990px×1; radii 20px×19, 100px×6, 18px×1; grid containers 11; header fixed (mix-blend normal); burger menu no
- Nav: AE.1, Homepage, Build yours; CTAs/buttons: Access to main content, Open / Close menu, Explore the AE.1, Technology, Skip Carousel, About us, Register
- Motion stack (script signatures): —; globals: —; script hints: ogl, gtag, gtm, recaptcha, hubspot
- Pattern signals: split-text reveals, parallax attrs, smooth-scroll container, page transitions, dark first view, video×1; images 25 (jpg 19, png 6); inline SVG 25; iframes 7
- CSS tokens (same-origin sheets 4, blocked 0): 569 custom properties; breakpoints (min-width: 1000px), not all and (min-width: 1000px), (min-width: 700px), not all and (min-width: 700px), (hover: hover), (min-width: 1200px); durations var(--transition-duration-slower)×7, var(--transition-duration)×4, 0.2s×4, 1s×3, var(--modal-transition-duration-in×3; easings var(--ease-power3-out)×5, var(--ease-power4-out)×5, var(--ease)×3, ease-out×3; keyframes 12; fluid type: clamp() 1, vw 1
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--font-sans: "F37Bolton",sans-serif`; `--font-serif: ui-serif,Georgia,Cambria,"Times New Roman",Times,serif`; `--font-mono: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New`; `--color-red-50: oklch(97.1% .013 17.38)`; `--color-red-100: oklch(93.6% .032 17.717)`; `--color-red-200: oklch(88.5% .062 18.334)`; `--color-red-300: oklch(80.8% .114 19.571)`; `--color-red-400: oklch(70.4% .191 22.216)`; `--color-red-500: oklch(63.7% .237 25.331)`; `--color-red-600: oklch(57.7% .245 27.325)`; `--color-red-700: oklch(50.5% .213 27.518)`; `--color-red-800: oklch(44.4% .177 26.899)`; `--color-red-900: oklch(39.6% .141 25.723)`; `--color-red-950: oklch(25.8% .092 26.042)`
- Weight: 16050 KB over 84 requests (img 12562 KB, script 3135 KB, link 289 KB, xmlhttprequest 57 KB); DOMContentLoaded 3299 ms, load 14837 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H2 25px “”; H1 40px “Born for Adventure. Built in America.”; H2 16px “This is the AE.1”; H2 16px “Smart Systems. Smooth Journeys.”; H3 22px “Twice the Efficiency. All the Freedom.”; H3 22px “Quiet Comes Standard.”; H3 22px “Built to Withstand. Designed to Transfor”; H2 16px “The Journey Starts with a Closer Look.”
- Screenshots: lightship-mobile-fold.jpg, lightship-mobile-full.jpg

### Vooban (2025) — https://vooban.com/
Client type: AI consultancy (B2B services). Awards: SOTD Jul 2025 + Developer Award; earlier SOTD Nov 2020. Scores: SOTD 7.43 · Dev 7.41. Awwwards-listed tech: not listed (2020 version: GSAP, PHP). Awwwards palette: #FFFFFF / #1458E4.

- Capture note: Chromium was refused by the host (HTTP 403 challenge page); the data below comes from a static fetch of the HTML and stylesheets.
- Static analysis (curl, no rendering): HTML 171 KB, generator —, lang fr; stylesheets main.css (208 KB)
- @font-face: NB International 300, NB International 400, NB International 700, NB International Mono 400; family declarations: NB International×3, swiper-icons×2, inherit×2, var(--font-sans)×2; letter-spacing: var(--tw-tracking,var(--text-h6--letter-spacing))×8, 0×7, var(--tw-tracking,var(--text-h5--letter-spacing))×5; uppercase rules 4
- Tokens: 539 custom properties; font-size declarations var(--text-h6)×9, var(--text-h5)×5, var(--text-body)×4, .9em×3, var(--text-h3)×3, var(--text-h1)×3; clamp() 34, vw units 125; max-widths 200px×5, 700px×3, 339px×2
- Breakpoints: (width>=1000px) (46), (width>=700px) (31), (width>=1200px) (30), (width<=1000px) (25), (hover:hover) (13), (prefers-reduced-motion:no-preference) (10)
- Motion: durations 0s×20, .25s×14, .15s×13, .2s×7, .3s×2, .35s×2; easings cubic-bezier(.4,0,.2,1)×2, cubic-bezier(0,0,.2,1)×2, cubic-bezier(.9,0,1,1)×1, cubic-bezier(0,.25,0,1)×1; keyframes 9; script signatures gsap, ScrollTrigger, Lenis, ogl, swup, Splitting, SplitText, swiper, reducedMotion, IntersectionObserver; attribute hints data-scroll×57, lenis×2, hs-scripts×1, recaptcha×6
- Colours in CSS (hex, by rule count): #FFF×10, #000×9, #FD5959×5, #4358C8×5, #F0F4F7×3, #232020×3, #D4DAE0×2, #E9EFF4×2
- H1: “Tout le monde parle d'IA. Chez Vooban, la déployer est notre métier.”; nav: Intelligence artificielle, Développement web + mobile, Gestion des données + BI, Cybersécurité, Approche, Produit, Études de cas, eBooks, À propos; images 36, videos 0, canvas 2
- Screenshots: none usable

### Nord Quantique — https://www.nordquantique.com/
Client type: Quantum computing deep-tech. Awards: SOTD May 2024 + Developer Award 7.88. Scores: SOTD 7.38 · Dev 7.88 (SEO 8.0, Anim 8.0, Markup 8.0). Awwwards-listed tech: not listed. Awwwards palette: #24222E / #843245.

- Capture note: desktop navigation failed (`ERR_TOO_MANY_RETRIES` from the Cloudflare-fronted host when reached through this environment's proxy); metrics below come from the **mobile capture (390 × 844 px)**, complemented by static CSS analysis.
- Title: “Home - Nord Quantique™” · lang en-US · generator WordPress 7.1.1 · DOM nodes 722 · page height 8904 px (mobile)
- Fonts loaded: ATsurt normal normal, eicons 400 normal, Outfit 400 normal, Outfit 500 normal, Outfit 700 normal, Poppins 600 normal, Font Awesome 5 Free 900 normal, Font Awesome 6 Free 900 normal; @font-face: ATsurt normal normal, eicons 400 normal, swiper-icons 400 normal, Outfit 100 normal, Outfit 200 normal, Outfit 300 normal, Outfit 400 normal, Outfit 500 normal, Outfit 600 normal, Outfit 700 normal, Outfit 800 normal, Outfit 900 normal, Yanone Kaffeesatz 200 normal, Yanone Kaffeesatz 300 normal, Yanone Kaffeesatz 400 normal, Yanone Kaffeesatz 500 normal, Yanone Kaffeesatz 600 normal, Yanone Kaffeesatz 700 normal, Poppins 100 italic, Poppins 200 italic, Poppins 300 italic, Poppins 400 italic, Poppins 500 italic, Poppins 600 italic, Poppins 700 italic, Poppins 800 italic, Poppins 900 italic, Poppins 100 normal, Poppins 200 normal, Poppins 300 normal
- H1: 36px ATsurt 500 lh 1.19 — “The Nord Quantique advantage” (decorative emoji glyphs in the rendered H1 removed); largest text 36 px (9.2 % of viewport width) “Error-corrected quantum computers with minimal overhead”
- Type usage: sizes 14px×36, 33px×12, 12px×9, 36px×5, 16px×4, 22px×4, 32px×4, 24px×2; weights 400×62, 500×13, 700×3, 600×2; line-heights 1.57×33, 0.97×12, 1.19×5, 1.3×5; letter-spacing 0.063em×4; uppercase share 8 %
- Body copy: 14px/1.57 Outfit, measure ≈270 px
- Colour (computed): text #AA987D×35, #24222E×33, #9D616E×7, #FFFFFF×4; backgrounds by area transparent, #24222E, #9F8FA9, #D3C9BB, #000000 @50%; body bg #24222E
- Layout: max-widths fluid (no px max-width found); radii 50%×5, 40px×4, 12px×4, 18px×3; grid containers 2; header static (mix-blend normal); burger menu no
- Nav: —; CTAs/buttons: Explore our technology, View All News, Meet some of our people, Explore our careers
- Motion stack (script signatures): —; globals: jQuery; script hints: wp-content, ogl, gtag
- Pattern signals: split-text reveals, horizontal scroll, dark first view, video×1; images 23 (svg 4, jpg 13, webp 3, png 3); inline SVG 5; iframes 0
- CSS tokens (same-origin sheets 42, blocked 0): 59 custom properties; breakpoints (max-width: 767px), (max-width: 1024px), (max-width:-1), (min-width: 768px), (min-width:-1), (min-width: 768px) and (max-width: 1024px); durations 0.3s×20, var(--fa-animation-duration×10, 0.2s×5, 1s×5, 2s×5; easings ease×14, ease-out×4, ease-in-out×2, linear×1; keyframes 25; fluid type: clamp() 0, vw 0
- Token sample: only vendor tokens were captured in the sample (--wp--preset--color--black, --wp--preset--color--cyan-bluish-gray, --wp--preset--color--white …)
- Weight: 9902 KB over 97 requests (img 7072 KB, css 1738 KB, script 565 KB, link 527 KB); DOMContentLoaded 7688 ms, load 11197 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H2 36px “Error-corrected quantum computers with m”; H1 36px “The Nord Quantique advantage”; H3 22px “Error correction at the source”; H3 22px “Proven superconducting platform”; H3 22px “Capital-efficient scaling”; H3 22px “Industry recognized leadership”; H2 36px “Our achievements”; H2 36px “Recent advancements at Nord Quantique”
- Static analysis (curl, no rendering): HTML 141 KB, generator WordPress 7.1.1, lang en-US; stylesheets style.min.css (1 KB), reset.css (5 KB), theme.css (5 KB), header-footer.css (7 KB)
- @font-face: ATsurt normal; family declarations: ATsurt×10, inherit×6, Poppins×6, Outfit×4; letter-spacing: inherit×2, 0px×2, 1.2px×2; uppercase rules 7
- Tokens: 50 custom properties; font-size declarations 14px×12, 16px×11, 36px×7, 1rem×5, 1em×5, 15px×5; clamp() 0, vw units 3; max-widths 500px×2, 1140px×2
- Breakpoints: (max-width:767px) (12), (max-width:1024px) (6), (max-width:-1) (6), (min-width:768px) (5), (min-width:-1) (5), (min-width:768px) and (max-width:1024px) (3)
- Motion: durations .3s×20, .4s×2, 0s×2, .2s×1, 1s×1, .5s×1; easings cubic-bezier(0.470, 0.000, 0.745, 0.715)×1; keyframes 2; script signatures swiper, IntersectionObserver; attribute hints wp-content×172, gtag×12
- Colours in CSS (hex, by rule count): #FFF×18, #69727D×7, #D9534F×5, #333×4, #C36×4, #000000×3, #5CB85C×3, #CCC×2
- H1: “The Nord Quantique advantage”; nav: Home, Technology, People, Careers, The Impact, Contact Us; images 22, videos 1, canvas 0
- Screenshots: nordquantique-mobile-fold.jpg, nordquantique-mobile-full.jpg

### Webisoft® — https://webisoft.com
Client type: Software engineering firm (B2B services). Awards: SOTD Sep 2024 + Developer Award. Scores: SOTD 7.56 · Dev 7.56 (Anim 8.0, Responsive 8.0). Awwwards-listed tech: not listed; 3D/motion by Thys. Awwwards palette: #000000 / #E2E3E6. Case study: https://locomotive.ca/en/work/webisoft

- Title: “Custom Software Development Company | Webisoft” · lang en · generator — · DOM nodes 712 · page height 9762 px (desktop) / 9214 px (mobile)
- Fonts loaded: Helvetica Now Display 500 normal, Helvetica Now Text 400 normal, Suisse Intl Mono 400 normal; @font-face: Helvetica Now Display 500 normal, Helvetica Now Text 400 normal, Suisse Intl Mono 400 normal
- H1: 55px Helvetica Now Display 500 lh 1 — “A North American team of specialists with profound technical expertise”; mobile H1 28 px; largest text 200 px (13.9 % of viewport width) “1”
- Type usage: sizes 12px×92, 16px×45, 19px×14, 24px×10, 200px×9, 32px×8, 10px×7, 18px×5; weights 400×152, 500×47; line-heights 1.1×99, 1×41, 1.47×24, 1.15×9; letter-spacing -0.02em×6, -0.025em×2; uppercase share 64 %
- Body copy: 19px/1.25 Helvetica Now Text, measure ≈451 px
- Colour (computed): text #000000×171, transparent×20, #FFFFFF×7, #DE5849×1; backgrounds by area #F0F1F4, #FFFFFF, #DE5849, #000000, #000000 @30%; body bg #FFFFFF
- Layout: max-widths 1440px×1, 1347px×1; radii 3px×14, 50%×13, 4px×12, 0px×1; grid containers 101; header fixed (mix-blend normal); burger menu yes
- Nav: Webisoft, S01 Advisory, S02 Blockchain, S03 Product Development, S04 Enterprise Software, S05 Artificial Intelligence (AI), 02 Projects, 03 Expertise, 04 Contact, 05 Podcasts, CONTACT US LET'S TALK / F034671; CTAs/buttons: Open menu, 01 Services, LET'S TALK LET'S TALK, EXPLORE EXPLORE, CONTACT US CONTACT US, EXPLORE 9 SERVICES EXPLORE 9 SERVICES, EXPLORE 17 SERVICES EXPLORE 17 SERVICES, EXPLORE 7 SERVICES EXPLORE 7 SERVICES
- Motion stack (script signatures): astro; globals: Astro; script hints: _astro
- Pattern signals: custom cursor, split-text reveals, parallax attrs, theme switching, sticky×8, canvas×2; images 9 (webp 9); inline SVG 34; iframes 1
- CSS tokens (same-origin sheets 1, blocked 0): 120 custom properties; breakpoints (width >= 700px), (width >= 1000px), (width <= 699px), (width >= 500px), (width >= 1200px), (width >= 500px) and (width <= 999px); durations 0.3s×11, 1ms×1, 0.6s×1; easings linear×4, var(--swiper-wrapper-transition-timing-function,initial)×1; keyframes 7; fluid type: clamp() 1, vw 2
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--font-display: "Helvetica Now Display", -apple-system, BlinkMacSystemFont, sans-serif`; `--font-text: "Helvetica Now Text", -apple-system, BlinkMacSystemFont, sans-serif`; `--font-mono: "Suisse Intl Mono", Monaco, Consolas, monospace`; `--ease-power2-in: cubic-bezier(.55, .055, .675, .19)`; `--ease-power2-out: cubic-bezier(.215, .61, .355, 1)`; `--ease-power3-out: cubic-bezier(.165, .84, .44, 1)`; `--grid-columns: 12`; `--grid-gutter: var(--clamp-16)`; `--grid-margin: var(--clamp-16)`; `--grid-12-col-1: calc((100vw - 2 * var(--grid-margin) - 11 * var(--grid-gutter)) / 12)`; `--grid-12-col-2: calc(2 * var(--grid-12-col-1) + 1 * var(--grid-gutter))`; `--grid-12-col-3: calc(3 * var(--grid-12-col-1) + 2 * var(--grid-gutter))`; `--grid-12-col-4: calc(4 * var(--grid-12-col-1) + 3 * var(--grid-gutter))`; `--grid-12-col-6: calc(6 * var(--grid-12-col-1) + 5 * var(--grid-gutter))`
- Weight: 341 KB over 16 requests (img 214 KB, link 106 KB, css 15 KB, script 4 KB); DOMContentLoaded 14712 ms, load 16162 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H1 55px “A North American team of specialists wit”; H2 42px “Tech stacks for a rapidly evolving world”; H3 32px “Advisory”; H3 32px “Blockchain”; H3 32px “Product Development”; H3 32px “Enterprise Software”; H3 32px “Artificial Intelligence (AI)”; H2 42px “We engage with:”
- Screenshots: webisoft-desktop-fold.jpg, webisoft-desktop-view2.jpg, webisoft-desktop-menu.jpg, webisoft-desktop-full.jpg, webisoft-mobile-fold.jpg, webisoft-mobile-full.jpg

### Populous — https://populous.com
Client type: Global architecture firm (professional services). Awards: SOTD Sep 2024 + Developer Award. Scores: SOTD 7.26 · Dev 7.34. Awwwards-listed tech: Contentful (headless CMS), 3D globe. Awwwards palette: #000 / #FFF. Case study: https://locomotive.ca/en/work/populous

- Title: “Global Architectural Design – Stadiums, Arenas, Events | Populous” · lang en-US · generator WPML ver:4.9.7 stt:5,59,1,4,27,28,29,2; · DOM nodes 575 · page height 11022 px (desktop) / 8129 px (mobile)
- Fonts loaded: SuisseIntl 400 normal, SuisseIntl 500 normal, TiemposFine 300 normal; @font-face: SuisseIntl 400 normal, SuisseIntl 500 normal, TiemposFine 300 normal, TiemposFine 200 normal
- H1: 79px SuisseIntl 400 lh 1 — “We design the places where people love to be together.”; mobile H1 36 px; largest text 79 px (5.5 % of viewport width) “We design the places where people love to be together.”
- Type usage: sizes 16px×62, 12px×58, 36px×14, 21px×11, 10px×6, 47px×3, 27px×3, 79px×2; weights 400×116, 500×43; line-heights 1.6×62, 1.5×61, 1.2×18, 1.4×11; letter-spacing 0.04em×32, -0.05em×29; uppercase share 4 %
- Body copy: 27px/1.2 SuisseIntl, measure ≈495 px
- Colour (computed): text #010101×106, #FFFFFF×50, color(srgb 0.00392157 0.00392157 0.00392157 / 0.2)×3; backgrounds by area #010101, #FFFFFF, #000000 @10%, #1C19B5, #E6E6E6; body bg transparent
- Layout: max-widths 1425px×2, 1440px×1, 700.538px×1; radii 4px×26, 50%×1; grid containers 16; header static (mix-blend normal); burger menu yes
- Nav: Explore, Sustainability, Projects, Digital Future, Disciplines, Careers, Explore, Projects, Disciplines, About, Team, Careers, Sustainability, Digital Future, News; CTAs/buttons: ↳ Go to main content, Search, View, ← Previous, → Next, ↳ View all, ↳ Start, ↳ View Project
- Motion stack (script signatures): gsap, ScrollTrigger, Lenis, three, swup, SplitText, splide, glsl, IntersectionObserver, reducedMotion; globals: —; script hints: locomotive, ogl, gtag
- Pattern signals: custom cursor, preloader, split-text reveals, smooth-scroll container, page transitions, dark first view, sticky×9, video×2; images 18 (webp 14, jpg 4); inline SVG 12; iframes 0
- CSS tokens (same-origin sheets 5, blocked 0): 184 custom properties; breakpoints (min-width: 700px), (max-width: 699px), (min-width: 1000px), (max-width: 999px), (prefers-reduced-motion: no-preference), (min-width: 500px); durations 0.9s×147, 0.3s×57, 0.75s×24, 0.15s×23, 0.6s×20; easings cubic-bezier(0.215, 0.61, 0.355, 1)×255, cubic-bezier(0.55, 0.055, 0.675, 0.19)×9, ease×6, ease-out×2; keyframes 20; fluid type: clamp() 1, vw 1
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--animation-duration-factor: 1`; `--color: #010101`; `--color-bg: white`; `--color-accent: #1c19b5`; `--grid-columns: 12`; `--grid-gutter: 20px`; `--grid-margin: calc(7.3611111111 * var(--vw, 1vw))`; `--grid-outer: 32px`; `--container-margin: var(--grid-margin)`; `--container-large-margin: var(--grid-margin)`; `--container-medium-margin: var(--grid-margin)`; `--font-size-body: clamp(14px, 0.0111111111 * calc(100 * var(--vw, 1vw)), 16px)`; `--font-size-body-tiny: clamp(10px, 0.0069444444 * calc(100 * var(--vw, 1vw)), 10px)`; `--font-size-body-small: clamp(12px, 0.0083333333 * calc(100 * var(--vw, 1vw)), 12px)`
- Weight: 2383 KB over 34 requests (img 1637 KB, script 332 KB, video 185 KB, css 143 KB); DOMContentLoaded 14659 ms, load 14732 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H1 79px “We design the places where people love t”; H2 27px “News & Perspectives”; H3 21px “Highmark Stadium Makes Regular Season De”; H3 21px “New Philadelphia Arena Poised to Shape t”; H3 21px “Venezia FC Reveals New Images of Populou”; H3 21px “A Stadium Shaped by Its Fans: How Brand ”; H3 21px “Populous-Designed ONT Field Named 2026 B”; H3 21px “Populous Strengthens Aviation Design Pra”
- Screenshots: populous-desktop-fold.jpg, populous-desktop-view2.jpg, populous-desktop-menu.jpg, populous-desktop-full.jpg, populous-mobile-fold.jpg, populous-mobile-full.jpg

### GKC Architecture & Design — https://gkc.ca/en
Client type: Architecture firm (professional services). Awards: SOTD Nov 2025 + Developer Award 7.48. Scores: SOTD 7.29. Awwwards-listed tech: CSS, GSAP, Lottie. Awwwards palette: #151F26 / #FFFFFF.

- Title: “Home — GKC Architecture & Design” · lang en · generator — · DOM nodes 746 · page height 11513 px (desktop) / 13600 px (mobile)
- Fonts loaded: ABCDiatype 400 italic, ABCDiatype 700 normal, ABCDiatype 700 italic, SuisseIntlCond 400 normal; @font-face: swiper-icons 400 normal, ABCDiatype 400 normal, ABCDiatype 400 italic, ABCDiatype 700 normal, ABCDiatype 700 italic, SuisseIntlCond 400 normal
- H1: 32px ABCDiatype 700 lh 1.1 — “GKC Architecture & Design”; mobile H1 32 px; largest text 230 px (16 % of viewport width) “Our”
- Type usage: sizes 16px×47, 14px×26, 18px×22, 35px×17, 22px×14, 55px×11, 19px×7, 12px×3; weights 400×145, 700×10; line-heights 1.23×67, 1×36, 1.05×26, 1.1×11; letter-spacing 0.01em×29, -0.02em×25, -0.04em×14; uppercase share 22 %
- Body copy: 55px/1 ABCDiatype, measure ≈868 px
- Colour (computed): text #151F26×97, #A2A2A2×33, #FFFFFF×21, #000000×3; backgrounds by area #FFFFFF, #151F26, #1444F0, #D9D9D9 @30%; body bg transparent
- Layout: max-widths 650px×3, 867.5px×1, 690px×1; radii none; grid containers 16; header fixed (mix-blend normal); burger menu yes
- Nav: —; CTAs/buttons: Open the main menu MENU, Skip to main content Skip to main content, Next Next, Previous Previous, Our Areas of Expertise Our Areas of Expertise, See Our Projects See Our Projects, Our approach, See all news See all news
- Motion stack (script signatures): gsap, ScrollTrigger, Lenis, swup, Splitting, SplitText, lottie, swiper, IntersectionObserver, reducedMotion; globals: —; script hints: ogl, gtag, gtm
- Pattern signals: preloader, split-text reveals, parallax attrs, horizontal scroll, theme switching, smooth-scroll container, page transitions, dark first view, sticky×4, video×2; images 29 (png 12, jpg 17); inline SVG 21; iframes 0
- CSS tokens (same-origin sheets 2, blocked 0): 134 custom properties; breakpoints (min-width: 700px), (min-width: 1000px), (max-width: 699px), (max-width: 999px), (hover: hover), (min-width: 700px) and (max-width: 999px); durations 0.6s×14, 1s×8, 0.15s×8, 0.25s×6, 0.5s×1; easings cubic-bezier(0.38, 0.005, 0.215, 1)×6, ease×6, cubic-bezier(0.165, 0.84, 0.44, 1)×3, var(--swiper-wrapper-transition-timing-function, initial)×1; keyframes 10; fluid type: clamp() 7, vw 10
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--spacing-xs-mobile: 12`; `--spacing-xs-desktop: 16`; `--spacing-sm-mobile: 22`; `--spacing-sm-desktop: 32`; `--spacing-md-mobile: 32`; `--spacing-md-desktop: 56`; `--spacing-lg-mobile: 48`; `--spacing-lg-desktop: 96`; `--spacing-xl-mobile: 64`; `--spacing-xl-desktop: 128`; `--spacing-2xl-mobile: 88`; `--spacing-2xl-desktop: 176`; `--spacing-3xl-mobile: 122`; `--spacing-3xl-desktop: 224`
- Weight: 1771 KB over 17 requests (img 1402 KB, script 183 KB, link 173 KB, fetch 13 KB); DOMContentLoaded 13154 ms, load 23740 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H1 32px “GKC Architecture & Design”; H2 75px “Aligning vision and action”; H3 22px “Design Futures”; H3 22px “Key Appointments”; H3 22px “The Impact of Interior Design in the Wor”; H2 55px “The creativity, expertise and strategic ”; H2 35px “Our portfolio speaks for itself.”; H2 35px “A sample of our long-standing clients.”
- Screenshots: gkc-desktop-fold.jpg, gkc-desktop-view2.jpg, gkc-desktop-full.jpg, gkc-mobile-fold.jpg, gkc-mobile-full.jpg

### Truck'N Roll® — https://trucknroll.com
Client type: Event logistics / transport (industrial B2B, recruitment). Awards: SOTD Jun 2026 + Developer Award 7.73. Scores: SOTD 7.23 · Dev 7.73 (SEO 7.8, WPO 7.8, Responsive 8.0). Awwwards-listed tech: Craft CMS, JavaScript, Locomotive Scroll; custom photoshoot by Consulat. Awwwards palette: #131313 / #FEFEFE. Case study: https://locomotive.ca/en/work/truck-n-roll

- Title: “Entertainment logistics - Truck'N Roll” · lang en · generator — · DOM nodes 653 · page height 11159 px (desktop) / 9173 px (mobile)
- Fonts loaded: Helvetica Now Display 700 normal, National 2 Condensed 900 normal; @font-face: Helvetica Now Display 700 normal, National 2 Condensed 900 normal
- H1: 200px National 2 Condensed 900 lh 0.7 UPPER — “FULL TOURS, NO EXCUSES.”; mobile H1 82 px; largest text 420 px (29.2 % of viewport width) “WE”
- Type usage: sizes 20px×49, 16px×41, 200px×22, 32px×10, 72px×9, 51px×6, 420px×4, 12px×3; weights 500×87, 900×31, 700×25, 400×5; line-heights 1.2×49, 1.1×39, 0.7×30, 0.9×15; letter-spacing -0.02em×24, -0.03em×19, -0.01em×12; uppercase share 32 %
- Body copy: 16px/1.1 Helvetica Now Display, measure ≈308 px
- Colour (computed): text #FEFEFE×75, #D8D3D3×51, #131313×20, transparent×1; backgrounds by area #131313, #FEFEFE, #D8D3D3, #4E37FF, #131313 @20%; body bg transparent
- Layout: max-widths 600.036px×6, 1000.06px×1; radii 4.00024px×3, 8.00048px×2; grid containers 36; header fixed (mix-blend normal); burger menu no
- Nav: —; CTAs/buttons: Access to main content, Contact, Plan your logistics, Culture, Start your logistics request, Join the crew, USA openings, Fb
- Motion stack (script signatures): swup, IntersectionObserver, reducedMotion; globals: —; script hints: recaptcha, ogl, gtag
- Pattern signals: split-text reveals, parallax attrs, theme switching, smooth-scroll container, page transitions, dark first view; images 11 (webp 11); inline SVG 28; iframes 2
- CSS tokens (same-origin sheets 2, blocked 0): 160 custom properties; breakpoints (min-width: 1000px), not all and (min-width: 1000px), not all and (min-width: 700px), (min-width: 700px), (hover: hover), not all and (min-width: 1200px); durations 0.15s×8, 0.25s×5, var(--modal-transition-duration-in×3, var(--modal-transition-duration-out×3, var(--transition-duration-fast)×2; easings ease×6, var(--ease-power3-out)×2, var(--ease-power4-out)×1, ease-in-out×1; keyframes 6; fluid type: clamp() 1, vw 1
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--font-sans: "Helvetica Now Display",sans-serif`; `--font-mono: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New`; `--color-gray-200: oklch(92.8% .006 264.531)`; `--color-neutral-200: oklch(92.2% 0 0)`; `--color-neutral-400: oklch(70.8% 0 0)`; `--color-black: #131313`; `--color-white: #fefefe`; `--spacing: .25rem`; `--container-3xl: 48rem`; `--radius-xs: .25rem`; `--radius-sm: .5rem`; `--radius-md: .875rem`; `--radius-lg: 2.5rem`; `--ease-out: cubic-bezier(0,0,.2,1)`
- Weight: 1590 KB over 38 requests (script 931 KB, img 324 KB, link 111 KB, css 97 KB); DOMContentLoaded 6693 ms, load 11245 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H1 200px “FULL TOURS, NO EXCUSES.”; H2 72px “The engine of every show.”; H2 16px “We Move Shows Forward”; H3 51px “Flawless Execution”; H3 51px “Safety-first standards”; H3 51px “Solution oriented”; H2 16px “Every tour is different. We always stay ”; H2 16px “Use Cases”
- Screenshots: trucknroll-desktop-fold.jpg, trucknroll-desktop-view2.jpg, trucknroll-desktop-full.jpg, trucknroll-mobile-fold.jpg, trucknroll-mobile-full.jpg

### Scout Motors — https://www.scoutmotors.com/
Client type: Automotive launch (industrial storytelling, e-commerce). Awards: SOTD Jan 2025 + Developer Award; E-Commerce of the Year (per Locomotive case study). Scores: SOTD 7.60 · Dev 7.36 (Creativity 7.79). Awwwards-listed tech: not listed; back-end by client. Awwwards palette: #FF5432 / #D7D4D7. Case study: https://locomotive.ca/en/work/scout-motors

- Title: “Scout Motors” · lang en · generator Astro v6.4.6 · DOM nodes 768 · page height 17887 px (desktop) / 15226 px (mobile)
- Fonts loaded: scout-sans-regular normal normal, scout-sans-medium normal normal, scout-sans-semicond-bold normal normal, scout-sans-wide-medium normal normal, scout-ibm-plex-mono 400 normal, scout-ibm-plex-mono 500 normal, Source Sans Pro 400 normal; @font-face: scout-sans-regular  , scout-sans-medium  , scout-sans-semicond-bold  , scout-sans-wide-medium  , scout-ibm-plex-mono 400 , scout-ibm-plex-mono 500 , Source Sans Pro 400 normal
- H1: 72px scout-sans-wide-medium 400 lh 0.9 — “Scouts always come back.”; mobile H1 42 px; largest text 504 px (35 % of viewport width) “RESERVE”
- Type usage: sizes 14px×26, 20px×26, 16px×20, 72px×14, 10px×12, 11px×12, 12px×9, 0px×8; weights 400×113, 500×29; line-heights 1.25×32, 1×29, 1.2×26, 1.5×19; letter-spacing -0.02em×31, -0.04em×2, -Infinityem×2; uppercase share 32 %
- Body copy: 16px/1.25 scout-sans-regular, measure ≈411 px
- Colour (computed): text #FFFFFF×48, #1C1C1A×44, #010101×16, #EAEAEA×8; backgrounds by area #EDE9E8, #FFFFFF, #FF5432, #0C0E1C, #000000; body bg #FFFFFF
- Layout: max-widths 1270px×2, 1440px×1, 1240px×1, 1272px×1; radii 4px×16, 2px×14, 3px×12, 8px×10; grid containers 14; header static (mix-blend normal); burger menu yes
- Nav: TRAVELER SUV, TERRA TRUCK, Our story, Community hub, Scout Supply, Newsroom, Events, South Carolina resources, Careers, Support, Contact us, Learn more about Traveler, Learn more about Terra; CTAs/buttons: SKIP TO MAIN CONTENT, TRAVELER SUV, TERRA TRUCK, RESERVE, Sign in, Reserve Now, OUR STORY, SUBSCRIBE
- Motion stack (script signatures): gsap; globals: Astro; script hints: recaptcha, ogl, gtm, _astro, gtag
- Pattern signals: custom cursor, marquee, preloader, split-text reveals, parallax attrs, horizontal scroll, smooth-scroll container, page transitions, sticky×4, video×3, canvas×2; images 52 (other 2, jpg 34, svg 9, webp 7); inline SVG 21; iframes 5
- CSS tokens (same-origin sheets 5, blocked 0): 51 custom properties; breakpoints (max-width: 998px), (max-width: 699px), (max-width: 699px), (hover: none), (min-width: 700px) and (hover: hover), (min-width: 1000px), (min-width: 700px); durations 0.3s×29, 0.4s×28, 0.15s×10, 0.6s×10, 1s×9; easings cubic-bezier(0.38, 0.005, 0.215, 1)×41, cubic-bezier(0.4, 0, 0.2, 1)×23, linear×12, cubic-bezier(0.23, 1, 0.32, 1)×5; keyframes 18; fluid type: clamp() 53, vw 63
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--grid-columns: 12`; `--grid-gutter: .25rem`; `--grid-margin: clamp(1rem, -.5rem + 7.5vw, 6.25rem)`; `--color: #010101`; `--color-bg: #ffffff`; `--outline-color: var(--color)`; `--container-margin: clamp(1rem, -.5rem + 7.5vw, 6.25rem)`; `--container-large-margin: clamp(1rem, .43rem + 2.86vw, 3rem)`; `--container-full-margin: 16px`; `--force-animation-duration: 0s`; `--button-width: auto`; `--button-radius: 2px`; `--button-font-size: 12px`; `--button-gap: 25px`
- Weight: 11787 KB over 215 requests (img 11781 KB, video 4 KB); DOMContentLoaded 5248 ms, load 11708 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H1 72px “Scouts always come back.”; H2 72px “An off-road icon reborn.”; H2 72px “The one that started it all.”; H2 270px “An Icon From Day One”; H2 270px “For The Scout In All Of Us.”; H2 72px “Experience the reveal event.”; H2 72px “The duo that does it all.”; H3 28px “Traveler”
- Screenshots: scoutmotors-desktop-fold.jpg, scoutmotors-desktop-view2.jpg, scoutmotors-desktop-menu.jpg, scoutmotors-desktop-full.jpg, scoutmotors-mobile-fold.jpg, scoutmotors-mobile-full.jpg

### Wolverine Worldwide — https://wolverineworldwide.com
Client type: Corporate site for investors and talent. Awards: SOTD Jun 2026 + Developer Award 7.58. Scores: SOTD 7.45 · Dev 7.58 (Anim 8.0, Responsive 8.2). Awwwards-listed tech: GSAP, Craft CMS, Locomotive Scroll. Awwwards palette: #010101 / #FFFFFF. Case study: https://locomotive.ca/en/work/wolverine-worldwide

- Title: “Home | Wolverine Worldwide” · lang en · generator — · DOM nodes 894 · page height 7954 px (desktop) / 7629 px (mobile)
- Fonts loaded: ABCDiatype 400 normal, ABCDiatype 700 normal, ABCDiatype-Mono 400 700 normal; @font-face: ABCDiatype 400 normal, ABCDiatype 700 normal, ABCDiatype-Mono 400 700 normal
- H1: 16px ABCDiatype 400 lh 1.5 — “Make. Every Day. Better.”; mobile H1 16 px; largest text 168 px (11.7 % of viewport width) “Make.”
- Type usage: sizes 15px×26, 11px×20, 16px×12, 19px×12, 33px×11, 128px×11, 168px×3, 24px×2; weights 400×70, 700×28; line-heights 1.2×38, 1.4×20, 0.79×14, 1×13; letter-spacing -0.02em×38, -0.05em×14, -0.03em×13; uppercase share 20 %
- Body copy: 33px/1 ABCDiatype, measure ≈435 px
- Colour (computed): text #FFFFFF×47, #000000×31, #757575×10, #010101×9; backgrounds by area #010101, #010101 @20%, #FFFFFF, color(srgb 0 0 0 / 0.5), #010101 @10%; body bg transparent
- Layout: max-widths fluid (no px max-width found); radii 12px×7, 10px×3, 20px×2, 16px×2; grid containers 11; header static (mix-blend normal); burger menu yes
- Nav: Home, About, Brands, Careers, Investors; CTAs/buttons: Responsibility, → Learn More About Us →, → Explore Our Brands →, Explore Career Opportunities, Investor Relations, View All, Prev., Next
- Motion stack (script signatures): gsap, swup, SplitText, IntersectionObserver, componentManager; globals: —; script hints: ogl, gtm
- Pattern signals: custom cursor, smooth-scroll container, page transitions, dark first view, sticky×1, video×1; images 77 (webp 77); inline SVG 42; iframes 0
- CSS tokens (same-origin sheets 2, blocked 0): 154 custom properties; breakpoints not all and (min-width: 700px), (hover: hover), (min-width: 700px), (min-width: 1000px), not all and (min-width: 1000px), (min-width: 1200px); durations 0.15s×8, var(--tw-duration×7, 0.25s×5, var(--transition-duration)×2, var(--transition-duration-slow)×2; easings var(--tw-ease×7, ease×6, var(--ease-sine-out)×2, var(--ease-expo-out)×2; keyframes 0; fluid type: clamp() 0, vw 0
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--font-sans: "ABCDiatype",sans-serif`; `--font-mono: "ABCDiatype-Mono",monospace`; `--color-black: #010101`; `--color-white: #fff`; `--spacing: .25rem`; `--font-weight-bold: 700`; `--radius-xs: 6px`; `--radius-sm: 8px`; `--radius-md: 10px`; `--radius-lg: 12px`; `--radius-xl: 16px`; `--radius-2xl: 20px`; `--default-transition-duration: .15s`; `--default-font-family: var(--font-sans)`
- Weight: 615 KB over 59 requests (css 185 KB, link 163 KB, other 148 KB, script 118 KB); DOMContentLoaded 9796 ms, load 12419 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H1 16px “Make. Every Day. Better.”; H2 128px “A portfolio built for every step.”; H2 57px “2025 Annual Report”; H2 33px “Many brands, one shared culture, limitle”; H2 33px “Market Snapshot”; H3 15px “Wolverine World Wide, Inc. (WWW)”; H2 33px “Latest News”; H3 19px “96% of employees said they feel welcomed”
- Screenshots: wolverine-desktop-fold.jpg, wolverine-desktop-view2.jpg, wolverine-desktop-full.jpg, wolverine-mobile-fold.jpg, wolverine-mobile-full.jpg

### Lowe's Innovation Labs — https://lowesinnovationlabs.com
Client type: Corporate innovation lab. Awards: SOTD Aug 2024 + Developer Award. Scores: SOTD 7.40 · Dev 7.73 (Anim 8.0, WPO 8.0). Awwwards-listed tech: not listed; Navigation Menu, Interaction Design tags. Awwwards palette: #1246B9 / #FAFAFA.

- Title: “Home — Lowe's Innovation Labs - Building the Future of Home Improvement.” · lang en · generator — · DOM nodes 1494 · page height 6343 px (desktop) / 6689 px (mobile)
- Fonts loaded: Fellix 400 normal, Fellix 500 normal, Fellix 700 normal, Helvetica Now Text 400 normal; @font-face: Fellix 400 normal, Fellix 500 normal, Fellix 700 normal, Helvetica Now Text 400 normal
- H1: 115px Fellix 500 lh 0.85 — “We bring the future home.” (split-text duplicates collapsed (the DOM carries each word twice for the reveal animation)); mobile H1 54 px; largest text 115 px (8 % of viewport width) “We”
- Type usage: sizes 16px×201, 12px×112, 18px×55, 41px×26, 58px×22, 27px×21, 115px×13, 61px×5; weights 400×367, 500×76, 700×13; line-heights 1.2×273, 1.1×75, 1×74, normal×24; letter-spacing -0.02em×63, -0.03em×13, -0.013em×5; uppercase share 0 %
- Body copy: 58px/1 Fellix, measure ≈1 px
- Colour (computed): text #000000×258, #FFFFFF×180, #1657E8×18; backgrounds by area #FAFAFA, #000000, #FFFFFF, #D9D9D9, #000000 @12%; body bg transparent
- Layout: max-widths fluid (no px max-width found); radii 5px×53, 16px×4, 32px×2, 0px×2; grid containers 34; header fixed (mix-blend normal); burger menu yes
- Nav: Lowe's Innovation Labs, Discover Democratization of Expertise, Discover Spatial Commerce, Discover Future Stores; CTAs/buttons: Go to main content ↵, 0014 / Projects Areas of Exploration, Explore Labs Menu, Back to Labs Close, Partner with us, Learn about Labs, Read, Areas of Exploration
- Motion stack (script signatures): gsap, ScrollTrigger, Lenis, three, SplitText, lottie, splide, glsl, IntersectionObserver, reducedMotion; globals: —; script hints: ogl, gtag
- Pattern signals: preloader, split-text reveals, parallax attrs, theme switching, smooth-scroll container, dark first view, sticky×1, canvas×2; images 62 (jpg 62); inline SVG 49; iframes 0
- CSS tokens (same-origin sheets 2, blocked 0): 88 custom properties; breakpoints (min-width: 1000px), (min-width: 700px), (max-width: 699px), (max-width: 999px), (min-width: 500px), (min-width: 1200px); durations 0.5s×33, 0.25s×24, 0.15s×8, var(--anim-text-enter-duration)×7, var(--anim-container-enter-duration×7; easings cubic-bezier(0.215, 0.61, 0.355, 1)×32, ease×8, var(--anim-text-enter-easing)×7, var(--anim-container-enter-easing×7; keyframes 7; fluid type: clamp() 0, vw 0
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--grid-columns: 12`; `--grid-gutter: 1.25rem`; `--grid-gutter-half: calc(0.5 * var(--grid-gutter))`; `--grid-margin: 1.25rem`; `--grid-margin-small: 4px`; `--container-width: calc(calc(100 * var(--vw, 1vw)) - 2 * var(--grid-margin))`; `--grid-column-width: calc(1 / var(--grid-columns) * var(--container-width) - (1 - 1 / var(--grid-colu`; `--font-size-huge: clamp(90px, 0.15 * calc(100 * var(--vw, 1vw)), 240px)`; `--font-size-h1: clamp(54px, 0.08 * calc(100 * var(--vw, 1vw)), 128px)`; `--font-size-h2: clamp(42px, 0.05625 * calc(100 * var(--vw, 1vw)), 90px)`; `--font-size-h3: clamp(32px, 0.04 * calc(100 * var(--vw, 1vw)), 64px)`; `--font-size-h4: clamp(24px, 0.028125 * calc(100 * var(--vw, 1vw)), 45px)`; `--font-size-h5: 1.6875rem`; `--font-size-body: 1rem`
- Weight: 3956 KB over 32 requests (img 1463 KB, script 1193 KB, xmlhttprequest 692 KB, link 605 KB); DOMContentLoaded 7298 ms, load 9391 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H3 18px “Democratization of Expertise”; H3 18px “Spatial Commerce”; H3 18px “Future Stores”; H1 115px “We bring the future home.”; H2 27px “”; H2 27px “”; H2 27px “Lowe's Style Studio for Apple Vision Pro”; H2 27px “”
- Screenshots: lowes-labs-desktop-fold.jpg, lowes-labs-desktop-view2.jpg, lowes-labs-desktop-menu.jpg, lowes-labs-desktop-full.jpg, lowes-labs-mobile-fold.jpg, lowes-labs-mobile-full.jpg

### PAVE® — https://pave.ai/
Client type: AI vehicle-inspection platform (B2B SaaS). Awards: SOTD Jan 2024 + Developer Award 7.75. Scores: SOTD 7.34 · Dev 7.75 (Anim 8.0). Awwwards-listed tech: not listed. Awwwards palette: #1F66F1 / #FFFFFF.

- Title: “PAVE® | AI-Powered Vehicle Inspection Platform” · lang en-US · generator WordPress 7.1.1 · DOM nodes 573 · page height 6456 px (desktop) / 7425 px (mobile)
- Fonts loaded: Inter 400 normal, Inter 700 normal, Sora 700 normal; @font-face: Inter 400 normal, Inter 500 normal, Inter 700 normal, Sora 500 normal, Sora 700 normal
- H1: 61px Sora 700 lh 1.06 — “The world's most advanced automated vehicle inspection platform”; mobile H1 33 px; largest text 61 px (4.3 % of viewport width) “The world's most advanced”
- Type usage: sizes 12px×33, 16px×28, 11px×15, 13px×13, 34px×9, 14px×8, 51px×8, 26px×7; weights 700×87, 400×25, 600×9, 800×6; line-heights 1.5×68, 1×12, 1.35×10, 1.15×9; letter-spacing 0.08em×6, 0.12em×6, 0.1em×1; uppercase share 13 %
- Body copy: 22px/1.5 Inter, measure ≈650 px
- Colour (computed): text #07101A×75, #536474×32, #1F66F0×11, #FFFFFF×9; backgrounds by area #F7FAFC, #F5F8FB, #000000 @86%, #050607, #07090A; body bg transparent
- Layout: max-widths 760px×5, 800px×1, 650px×1, 680px×1; radii 999px×27, 8px×13, 50%×7, 11.52px×2; grid containers 107; header static (mix-blend normal); burger menu yes
- Nav: Skip to content, Products, Company, Contact Us, Let's Talk, TRY, See the workflow, Try PAVE®, Download Now, Products, Car Dealerships, Fleet & Rental, Insurance, Lenders, Partner Integration; CTAs/buttons: Open menu, Let's Talk, See the workflow, Try PAVE®, Download Now
- Motion stack (script signatures): gsap, ScrollTrigger, IntersectionObserver, reducedMotion; globals: —; script hints: ogl, gtag, wp-content
- Pattern signals: split-text reveals, theme switching, page transitions, dark first view, video×1; images 44 (webp 31, svg 13); inline SVG 24; iframes 0
- CSS tokens (same-origin sheets 9, blocked 0): 98 custom properties; breakpoints (prefers-reduced-motion: reduce), (max-width: 767px), (min-resolution: 192dpi), screen and (max-width: 600px), (max-width: 820px), (max-width: 760px); durations 0.01ms×2, 0.52s×2, 0.88s×1, 0.46s×1, 0.62s×1; easings ease×1; keyframes 7; fluid type: clamp() 19, vw 19
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--color-bg: #0a1017`; `--color-text: #f4f8f9`; `--color-ink: #050607`; `--color-graphite: #0b0f12`; `--color-panel: #10171b`; `--color-panel-strong: #162127`; `--color-line: rgba(218, 236, 242, .14)`; `--color-muted: #93a4ab`; `--color-dim: #5d6b72`; `--color-cyan: #1f66f0`; `--color-blue: #1f66f0`; `--color-lime: #a7ff62`; `--color-amber: #ffc857`; `--color-page-bg: #050607`
- Weight: 1319 KB over 52 requests (img 921 KB, link 174 KB, script 150 KB, other 75 KB); DOMContentLoaded 2060 ms, load 6916 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H2 26px “”; H1 61px “The world's most advanced automated vehi”; H2 51px “A guided inspection flow that turns phot”; H3 26px “Inspect any vehicle anywhere”; H3 26px “Vehicle capture in about 60 seconds”; H3 26px “Complete vehicle condition report automa”; H3 26px “Mobile app or tablet is all you need”; H2 51px “Detailed, Accurate, and Complete Vehicle”
- Screenshots: pave-desktop-fold.jpg, pave-desktop-view2.jpg, pave-desktop-menu.jpg, pave-desktop-full.jpg, pave-mobile-fold.jpg, pave-mobile-full.jpg

### BrainBox AI — https://brainboxai.com
Client type: AI/energy tech (B2B). Awards: SOTD Apr 2022 + Developer Award. Scores: SOTD 7.68 · Design 7.85 · Dev 7.41. Awwwards-listed tech: HTML5, GSAP, Lottie, Swiper.js, Locomotive Scroll. Awwwards palette: #000 / #D14836 / #FFF.

- Title: “BrainBox AI | AI Building management platform for HVAC optimization” · lang en · generator HubSpot · DOM nodes 1223 · page height 8197 px (desktop) / 9542 px (mobile)
- Fonts loaded: Atlas Grotesk 300 normal, Atlas Grotesk 300 italic, Atlas Grotesk 400 normal, Atlas Grotesk 700 normal; @font-face: Atlas Grotesk 300 normal, Atlas Grotesk 300 italic, Atlas Grotesk 400 normal, Atlas Grotesk 500 normal, Atlas Grotesk 700 normal, Atlas Typewriter 400 normal, Atlas Typewriter 600 normal
- H1: 56px Atlas Grotesk 300 lh 1.1 — “Transforming buildings with autonomous and generative AI”; mobile H1 28 px; largest text 110 px (7.7 % of viewport width) “OUR”
- Type usage: sizes 16px×73, 12px×28, 20px×22, 24px×20, 36px×19, 64px×14, 56px×8, 28px×7; weights 300×188, 700×10, 400×4; line-heights 1×56, 1.5×49, 1.1×49, 1.25×38; letter-spacing -0.02em×53, 0.15em×16, 0.08em×7; uppercase share 13 %
- Body copy: 12px/1.5 Helvetica Neue, measure ≈960 px
- Colour (computed): text #17171B×129, #FFFFFF×50, #E21F2C×11, #F7F7F7×4; backgrounds by area #FFFFFF, #F6F6F6, #17171B, #F5F5F5, #000000; body bg transparent
- Layout: max-widths 1000px×6, 680px×1, 700px×1; radii 4px×29, 100%×10, 0px×9, 3px×1; grid containers 3; header absolute (mix-blend normal); burger menu yes
- Nav: Solutions, AI Lab, Resources, About, LET'S TALK, FR, Solutions, ARIA, AI Control, Building Management System, Expertise, GHG Emissions, Net Zero, AI Technology, Resources; CTAs/buttons: LET'S TALK, WATCH VIDEO, DISCOVER ARIA, LEARN MORE, SIGN-UP TO OUR NEWSLETTER
- Motion stack (script signatures): gsap, ScrollTrigger, SplitText, react; globals: gsap, jQuery; script hints: youtube, hubspot
- Pattern signals: split-text reveals, horizontal scroll, dark first view; images 84 (svg 15, png 45, jpeg 2, jpg 6, webp 4, other 12); inline SVG 40; iframes 2
- CSS tokens (same-origin sheets 31, blocked 0): 9 custom properties; breakpoints print, screen and (min-width: 64em), print, screen and (min-width: 40em), print, screen and (max-width: 63.9988em), screen and (min-width: 87.5625em), screen and (min-width: 75em), print, screen and (max-width: 39.9988em); durations 0.6s×42, 0.5s×14, 0.3s×12, 0.9s×6, 0.25s×5; easings cubic-bezier(0.4, 0, 0, 1)×45, ease-in-out×7, ease×5, cubic-bezier(0.55, 0.085, 0.68, 0.53)×3; keyframes 6; fluid type: clamp() 0, vw 11
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--color-black: #17171b`; `--color-grey-med: #939ba0`; `--color-grey: #ddd`; `--color-offwht: #f6f6f6`; `--color-white: #fff`; `--color-red: #e21f2c`; `--color-red-dark: #b82229`; `--color-accent: #e21f2c`; `--border-radius-small: 4px`
- Weight: 2471 KB over 121 requests (css 945 KB, link 662 KB, img 562 KB, script 291 KB); DOMContentLoaded 18099 ms, load 18845 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H1 56px “Transforming buildings with autonomous a”; H2 36px “Your building, only smarter greener more”; H3 36px “ARIA”; H3 36px “AI Control”; H3 36px “Cloud Building Management System”; H2 110px “OUR IMPACT”; H3 16px “Cities impacted”; H3 16px “Daily data points collected”
- Screenshots: brainbox-desktop-fold.jpg, brainbox-desktop-view2.jpg, brainbox-desktop-menu.jpg, brainbox-desktop-full.jpg, brainbox-mobile-fold.jpg, brainbox-mobile-full.jpg

### Construction Désourdy — https://constructiondesourdy.com/en
Client type: Construction / real estate (B2B/B2C). Awards: Honorable Mention Oct 2025. Scores: n/a. Awwwards-listed tech: not listed; minimalist art direction. Awwwards palette: n/a. Case study: https://locomotive.ca/en/work/desourdy

- Title: “Désourdy | Custom home builder” · lang en · generator Astro v5.6.1 · DOM nodes 474 · page height 8772 px (desktop) / 6457 px (mobile)
- Fonts loaded: GT America 900 normal, GT America 500 normal, GT America 400 normal, GT America 300 normal; @font-face: GT America 900 normal, GT America 500 normal, GT America 400 normal, GT America 300 normal
- H1: 16px GT America 400 lh 1.5 — “Désourdy Construction”; mobile H1 16 px; largest text 48 px (3.3 % of viewport width) “Explore our projects”
- Type usage: sizes 42px×35, 16px×31, 14px×12, 32px×8, 13px×5, 48px×5, 12px×4, 20px×3; weights 300×52, 400×28, 900×14, 500×10; line-heights 1.2×46, 1.4×32, 1×18, 1.5×11; letter-spacing -0.011em×35, -0.013em×5, 0.107em×4; uppercase share 9 %
- Body copy: 16px/1.4 GT America, measure ≈453 px
- Colour (computed): text #141415×85, #F1ECE8×16, #FFFFFF×6; backgrounds by area #141415, #F1ECE8, #FFFFFF, #141415 @10%; body bg #FFFFFF
- Layout: max-widths fluid (no px max-width found); radii 6px×17, 8px×6, 30px×6, 4px×3; grid containers 19; header fixed (mix-blend normal); burger menu yes
- Nav: Gallery, Projects, Services, About, Français; CTAs/buttons: Contact, Close contact window, Copy phone number, Copy email address, Copy postal address, PLAY, ABOUT US, DISCOVER
- Motion stack (script signatures): astro, SplitText; globals: Astro; script hints: ogl, gtag, _astro, storyblok
- Pattern signals: custom cursor, split-text reveals, parallax attrs, smooth-scroll container, page transitions, sticky×3; images 14 (other 14); inline SVG 11; iframes 0
- CSS tokens (same-origin sheets 2, blocked 0): 112 custom properties; breakpoints (max-width: 1023px), (min-width: 1024px), screen and (max-width: 640px), (min-width: 40rem), (min-width: 48rem), (hover: hover); durations 0.15s×8, 0.25s×7, var(--tw-duration×3, 0.3s×2; easings ease×6, var(--tw-ease×3, ease-out×1, var(--ease-in-quart)×1; keyframes 0; fluid type: clamp() 4, vw 5
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--font-sans: "GT America",sans-serif`; `--font-mono: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New`; `--color-red-400: oklch(70.4% .191 22.216)`; `--color-black: #141415`; `--color-white: #fff`; `--spacing: 10px`; `--font-weight-light: 300`; `--font-weight-medium: 500`; `--radius-sm: .25rem`; `--radius-md: .375rem`; `--radius-lg: .5rem`; `--default-transition-duration: .15s`; `--default-font-family: var(--font-sans)`; `--default-mono-font-family: var(--font-mono)`
- Weight: 1377 KB over 52 requests (script 1081 KB, link 300 KB, img 0 KB, video 0 KB); DOMContentLoaded 20364 ms, load 20541 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H1 16px “Désourdy Construction”; H2 42px “Specializing in residential construction”; H2 16px “Nos réalisations”; H3 14px “Brill 02”; H3 14px “MaisonArt 01”; H2 48px “Explore our projects”; H2 48px “The art of building Unique homes”; H2 48px “Your vision, our mission”
- Screenshots: desourdy-desktop-fold.jpg, desourdy-desktop-view2.jpg, desourdy-desktop-full.jpg, desourdy-mobile-fold.jpg, desourdy-mobile-full.jpg

### Structured (maxBTC) — https://www.structured.money/
Client type: Finance / Bitcoin yield product (trust-building). Awards: none listed. Scores: n/a. Awwwards-listed tech: n/a. Awwwards palette: n/a. Case study: https://locomotive.ca/en/work/structured

- Capture note: host unreachable from this environment (the proxy refused the TLS tunnel); no measurements. Use the Awwwards data above and the case study.
- Screenshots: none usable

### Editorial New — https://editorialnew.com
Client type: Type specimen microsite. Awards: SOTM Oct 2019, SOTD, Developer Award, Mobile Excellence; Idéa Gold & Silver. Scores: SOTD 7.85 · Creativity 8.07 · Content 8.12. Awwwards-listed tech: GSAP, PHP, Cloudflare. Awwwards palette: #000 / #FFF. Case study: https://locomotive.ca/en/work/editorial-new

- Title: “Ēdìtørîaļ Něw | Pangram Pangram® Foundry + Locomotive®” · lang en · generator — · DOM nodes 1249 · page height 19800 px (desktop) / 10439 px (mobile)
- Fonts loaded: Editorial New 1 999 normal, Neue Montreal 400 normal, Neue Montreal 500 normal; @font-face: Editorial New 1 999 , Neue Montreal 400 normal, Neue Montreal 500 normal
- H1: 16px Editorial New 400 lh 1.33 — “Editorial New”; mobile H1 18 px; largest text 1728 px (120 % of viewport width) “EDITORIAL”
- Type usage: sizes 22px×381, 16px×111, 44px×13, 1111px×8, 864px×6, 53px×5, 12px×4, 37px×3; weights 400×437, 300×44, 500×40, 200×19; line-heights 1×400, 1.33×103, normal×23, 1.6×7; letter-spacing -0.2em×4; uppercase share 1 %
- Body copy: 37px/1.33 Editorial New, measure ≈328 px
- Colour (computed): text #1A1A1A×507, #F4F4F4×21, #FFFFFF×14, #242424×7; backgrounds by area #F4F4F4, #1A1A1A, #F6F6F6, #FFFFFF, #DBDBDB; body bg #F4F4F4
- Layout: max-widths 1461.33px×5; radii 22.2222px×7, 50%×2, 36.4445px×2, 45.3333px×2; grid containers 0; header fixed (mix-blend difference); burger menu yes
- Nav: Pangram Pangram® Foundry, Locomotive®, Editorial New, Get the font; CTAs/buttons: Invert Colors, Get the font, Table of contents, Change, Randomize, Regular — 400, ↑, Buy Editorial New
- Motion stack (script signatures): —; globals: —; script hints: ogl, gtag, gtm
- Pattern signals: custom cursor, preloader, split-text reveals, parallax attrs, smooth-scroll container; images 9 (webp 8, svg 1); inline SVG 4; iframes 0
- CSS tokens (same-origin sheets 2, blocked 0): 0 custom properties; breakpoints (max-width: 699px), (min-width: 700px), (min-width: 1200px), (min-width: 700px) and (max-width: 999px), (min-width: 1000px), (max-width: 1199px); durations 0.3s×6, 0.45s×6, 1s×1, 0.2s×1, 0.6s×1; easings cubic-bezier(0, 0, 0.2, 1)×12, ease×1; keyframes 4; fluid type: clamp() 0, vw 8
- Weight: 1253 KB over 22 requests (img 962 KB, css 138 KB, script 84 KB, link 67 KB); DOMContentLoaded 2574 ms, load 3349 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H1 16px “Editorial New”; H1 213px “Editorial New”
- Screenshots: editorialnew-desktop-fold.jpg, editorialnew-desktop-view2.jpg, editorialnew-desktop-menu.jpg, editorialnew-desktop-full.jpg, editorialnew-mobile-fold.jpg, editorialnew-mobile-full.jpg

### L.I.S.A. (Locomotive Interactive Super Assistant) — https://lisa.locomotive.ca/en
Client type: Agency AI assistant microsite. Awards: SOTD Sep 2026 + Developer Award 7.52 (with 60fps). Scores: SOTD 7.48 · Creativity 7.89 · Responsive 8.6. Awwwards-listed tech: WebGL, GSAP, Blender 3D. Awwwards palette: #000000 / #FFFFFF.

- Capture note: the page renders its first view in WebGL; the DOM carries almost no text, so the type metrics below are not meaningful. Script signatures and tokens are.
- Title: “Locomotive” · lang en · generator — · DOM nodes 98 · page height 900 px (desktop) / 844 px (mobile)
- Fonts loaded: —; @font-face: —
- H1: —; largest text 15 px (1 % of viewport width) “Locomotive®”
- Type usage: sizes 15px×10; weights 400×10; line-heights 1.3×8, normal×2; letter-spacing none; uppercase share 0 %
- Colour (computed): text #000000×10; backgrounds by area #000000; body bg transparent
- Layout: max-widths fluid (no px max-width found); radii none; grid containers 0; header static (mix-blend normal); burger menu yes
- Nav: —; CTAs/buttons: Let's talk, Menu, Close
- Motion stack (script signatures): gsap, ScrollTrigger, Lenis, three, barba, SplitText, vue, swiper, glsl, IntersectionObserver; globals: —; script hints: recaptcha, ogl, gtag, locomotive
- Pattern signals: preloader, theme switching, dark first view; images 0 (); inline SVG 1; iframes 1
- CSS tokens (same-origin sheets 1, blocked 1): 3 custom properties; breakpoints (max-width: 699px), (min-width: 1025px), (max-width: 1024px), (min-width: 700px) and (max-width: 1024px), (min-width: 1025px) and (max-width: 1199px), (min-width: 1200px) and (max-width: 1599px); durations 0.9s×2, 0.3s×1; easings cubic-bezier(0.215, 0.61, 0.355, 1)×2; keyframes 1; fluid type: clamp() 0, vw 0
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--color: #000000`; `--color-bg: #FFFFFF`; `--font-size: 21px`
- Weight: 3323 KB over 8 requests (script 3323 KB, link 0 KB, audio 0 KB, xmlhttprequest 0 KB); DOMContentLoaded 5258 ms, load 7421 ms (headless Chromium through a proxy, not a field measurement)
- Screenshots: none usable

### Dulcedo — https://dulcedo.com
Client type: Talent management agency (portfolio platform). Awards: SOTD Feb 2026 + Developer Award. Scores: SOTD 7.39 · Dev 7.39 (WPO 7.8). Awwwards-listed tech: Craft CMS, JavaScript, jQuery. Awwwards palette: #C5AE79 / #0A0A0A. Case study: https://locomotive.ca/en/work/dulcedo

- Title: “Talent Management Agency in North America - Dulcedo” · lang en-US · generator — · DOM nodes 1353 · page height 12146 px (desktop)
- Fonts loaded: Helvetica Now Display 800 normal, Helvetica Now Display 500 normal, Saol Display 300 italic, Saol Display 400 normal; @font-face: Helvetica Now Display 800 normal, Helvetica Now Display 500 normal, Saol Display 300 italic, Saol Display 400 normal
- H1: 16px Helvetica Now Display 500 lh 1.4 — “Dulcedo”; largest text 140 px (9.7 % of viewport width) “Featured”
- Type usage: sizes 16px×111, 32px×80, 12px×77, 50px×41, 14px×18, 18px×17, 100px×14, 28px×3; weights 800×246, 500×109, 300×6, 400×6; line-heights 1×197, 1.4×128, 0.8×38, 0.7×2; letter-spacing -0.03em×118, -0.055em×1; uppercase share 67 %
- Body copy: 12px/1 Helvetica Now Display, measure ≈276 px
- Colour (computed): text #0A0A0A×163, #000000×86, #C5AE79×65, #FFFFFF×52; backgrounds by area #F4F4F4, #0A0A0A, #000000 @5%, #000000 @50%, #FFFFFF; body bg #1A1A1A
- Layout: max-widths 1440px×1; radii 32px×14, 1000px×11, 2px×10, 100%×1; grid containers 70; header static (mix-blend normal); burger menu no
- Nav: Home, Contact, My Cast (0); CTAs/buttons: Talents, Models, Blog, Agency, Search, Manifesto, History, Our Vision
- Motion stack (script signatures): gsap, swup, lottie, IntersectionObserver; globals: Vue; script hints: cpresources
- Pattern signals: custom cursor, preloader, split-text reveals, parallax attrs, theme switching, smooth-scroll container, page transitions, dark first view, sticky×9, video×2, canvas×1; images 17 (jpg 13, jpeg 2, png 2); inline SVG 74; iframes 0
- CSS tokens (same-origin sheets 4, blocked 1): 134 custom properties; breakpoints not all and (min-width: 1000px), (min-width: 1000px), (hover: hover), (max-width: 768px), not all and (min-width: 700px), (min-width: 700px); durations 0.3s×4, 0.6s×4, var(--transition-duration)×4, 1s×2, var(--transition-duration-slower)×2; easings cubic-bezier(0.215, 0.61, 0.355, 1)×3, linear×2, var(--ease)×2, ease-in×2; keyframes 13; fluid type: clamp() 7, vw 8
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--font-sans: "Helvetica Now Display",sans-serif`; `--font-serif: "Saol Display",serif`; `--font-mono: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New`; `--color-red-100: oklch(93.6% .032 17.717)`; `--color-red-500: oklch(63.7% .237 25.331)`; `--color-red-800: oklch(44.4% .177 26.899)`; `--color-green-100: oklch(96.2% .044 156.743)`; `--color-green-800: oklch(44.8% .119 151.328)`; `--color-gray-100: #f4f4f4`; `--color-gray-200: #e0e0e0`; `--color-gray-300: oklch(87.2% .01 258.338)`; `--color-gray-500: oklch(55.1% .027 264.364)`; `--color-gray-600: oklch(44.6% .03 256.802)`; `--color-gray-900: oklch(21% .034 264.665)`
- Weight: 3359 KB over 76 requests (fetch 1303 KB, script 748 KB, other 612 KB, css 397 KB); DOMContentLoaded 6603 ms, load 9342 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H3 22px “”; H1 16px “Dulcedo”; H2 100px “WE ELEVATE VOICES THAT SHAPE CULTURE: BU”; H2 16px “Featured PROFILES”; H3 16px “CHLOE CHRISTIAN”; H3 16px “ASHTEN BARNES”; H3 16px “MILLY KEURNA”; H3 16px “CINDY COURNOYER”
- Mobile capture: blocked (connection reset by the host after repeated retries).
- Screenshots: dulcedo-desktop-fold.jpg, dulcedo-desktop-view2.jpg, dulcedo-desktop-full.jpg

### Aupale Vodka — https://aupalevodka.com/en
Client type: Premium spirits brand. Awards: SOTD Mar 2026 + Developer Award. Scores: SOTD 7.50 · Design 7.75 · Anim 7.8. Awwwards-listed tech: Astro, HTML5, JavaScript, video. Awwwards palette: #C4CFC6 / #EFF0EF.

- Capture note: desktop navigation failed (`ERR_TOO_MANY_RETRIES` from the Cloudflare-fronted host when reached through this environment's proxy); metrics below come from the **mobile capture (390 × 844 px)**, complemented by static CSS analysis.
- Title: “AUPALE VODKA - Distilled, differently.” · lang en · generator Astro v5.15.9 · DOM nodes 1706 · page height 16284 px (mobile)
- Fonts loaded: Martha-a6f99d8cc2cc3d04 700 normal, HelveticaNowDisplay-a2f8c48b330dbb44 500 normal, InstrumentSerif-20eeea0c6e7eec58 400 normal; @font-face: Martha-a6f99d8cc2cc3d04 400 normal, Martha-a6f99d8cc2cc3d04 700 normal, Martha-a6f99d8cc2cc3d04 fallback: Arial 400 normal, Martha-a6f99d8cc2cc3d04 fallback: Arial 700 normal, HelveticaNowDisplay-a2f8c48b330dbb44 500 normal, HelveticaNowDisplay-a2f8c48b330dbb44 fallback: Arial 500 normal, InstrumentSerif-20eeea0c6e7eec58 400 normal, InstrumentSerif-20eeea0c6e7eec58 fallback: Times New Roman 400 normal
- H1: 50px InstrumentSerif-20eeea0c6e7eec58 400 lh 0.84 — “Born From The Untouched Wilderness.”; largest text 119 px (30.6 % of viewport width) “Taste the Clarity”
- Type usage: sizes 10px×184, 16px×28, 38px×23, 40px×18, 37px×18, 25px×18, 31px×8, 36px×6; weights 600×184, 400×117, 500×23; line-heights 1.25×182, 0.84×59, 0.92×29, 1.5×23; letter-spacing -0.02em×36, -0.06em×18, -0.03em×6; uppercase share 57 %
- Body copy: 10px/1.25 Martha-a6f99d8cc2cc3d04, measure ≈171 px
- Colour (computed): text #0D1015×250, #FFFFFF×72, #D0DED7×2; backgrounds by area #FFFFFF, #0D1015, #D0DED7; body bg #FFFFFF
- Layout: max-widths 896px×2; radii 12px×25, 3.35544e+07px×1; grid containers 61; header fixed (mix-blend normal); burger menu no
- Nav: —; CTAs/buttons: YES, NO, WHERE TO BUY?, MENU, DISCOVER OUR STORY, See product Aupale Vodka, See product Seltzer, SUBSCRIBE
- Motion stack (script signatures): —; globals: Astro; script hints: ogl, gtag, _astro, storyblok
- Pattern signals: custom cursor, split-text reveals, parallax attrs, smooth-scroll container, page transitions, dark first view, sticky×4; images 54 (other 27, png 27); inline SVG 35; iframes 0
- CSS tokens (same-origin sheets 9, blocked 0): 98 custom properties; breakpoints (any-hover: hover), not all and (min-width: 700px), (min-width: 700px), (min-width: 1000px), (min-width: 500px), (min-width: 1200px); durations var(--transition-duration-slow)×3, 0.5s×2, 0.8s×2, 0.25s×1, 1s×1; easings var(--smooth-ease)×5, var(--ease)×2, var(--tw-ease×1, var(--ease-in-out)×1; keyframes 1; fluid type: clamp() 1, vw 0
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--font-mono: var(--font-mono)`; `--font-sans: var(--font-sans)`; `--font-serif: var(--font-serif)`; `--color-black: oklch(17.216% .01154 260.654)`; `--color-white: oklch(100% .00011 271.152)`; `--spacing: .25rem`; `--container-3xl: 48rem`; `--container-4xl: 56rem`; `--radius-sm: var(--border-radius-sm)`; `--radius-md: var(--border-radius-md)`; `--radius-lg: var(--border-radius-lg)`; `--radius-xl: var(--border-radius-xl)`; `--ease-in-out: cubic-bezier(.4,0,.2,1)`; `--default-transition-duration: .15s`
- Weight: 3257 KB over 132 requests (script 2144 KB, fetch 455 KB, css 247 KB, img 214 KB); DOMContentLoaded 14821 ms, load 15491 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H1 50px “Born From The Untouched Wilderness.”; H2 16px “Philosophy”; H3 40px “We go back to basics, only real ingredie”; H3 40px “Water born from a landscape carved for t”; H3 31px “When nature perfects something, we don’t”; H2 63px “The bottle is our tribute to the source.”; H3 16px “Aupale”; H3 16px “Nature's Dancing Lights”
- Static analysis (curl, no rendering): HTML 455 KB, generator Astro v5.15.9, lang en; stylesheets index.BI9LBDU3.css (55 KB), sitemap_xml.Bydj66Mm.css (5 KB), sitemap_xml.2K6Tjdwt.css (7 KB), index.C10_xpup.css (9 KB)
- @font-face: HelveticaNowDisplay-a2f8c48b330dbb44 500, HelveticaNowDisplay-a2f8c48b330dbb44 fallback: Arial 500, InstrumentSerif-20eeea0c6e7eec58 400, InstrumentSerif-20eeea0c6e7eec58 fallback: Times New Roman 400, Martha-a6f99d8cc2cc3d04 400, Martha-a6f99d8cc2cc3d04 700, Martha-a6f99d8cc2cc3d04 fallback: Arial 400, Martha-a6f99d8cc2cc3d04 fallback: Arial 700; family declarations: var(--font-serif)×11, var(--font-mono)×7, var(--font-sans)×5, Martha-a6f99d8cc2cc3d04×2; letter-spacing: -.02em×4, -.03em×2, -.01em×2; uppercase rules 6
- Tokens: 17 custom properties; font-size declarations var(--text-mono-xs)×7, var(--text-heading-sm)×2, var(--text-heading-xxs)×2, var(--text-body-md)×2, var(--text-heading-md)×2, max(9cqi,var(--text-heading-xl))×1; clamp() 30, vw units 59; max-widths 340px×3, 500px×3, 700px×3
- Breakpoints: (any-hover:hover) (11), not all and (min-width:700px) (9), (min-width:700px) (9), (min-width:1000px) (8), (min-width:500px) (4), (min-width:1200px) (4)
- Motion: durations .1s×5, .2s×3, .4s×3, .8s×3, 50ms×3, .5s×2; easings cubic-bezier(.4,0,.2,1)×2, cubic-bezier(.645,.045,.355,1)×1; keyframes 1; script signatures ogl, barba, astro; attribute hints _astro×86, data-scroll×101, lenis×12, gtag×4
- Colours in CSS (hex, by rule count): #929C99×1, #6E9180×1
- H1: “Born FromThe UntouchedWilderness.”; nav: Philosophy, The bottle, Vodka, Seltzers, Mocktails, Creators, Where to buy?; images 54, videos 0, canvas 0
- Screenshots: aupale-mobile-fold.jpg, aupale-mobile-full.jpg

### McAlpine House — https://mcalpinehouse.com
Client type: Architecture / residential design. Awards: SOTD Apr 2025 + Developer Award. Scores: n/a. Awwwards-listed tech: n/a. Awwwards palette: n/a.

- Capture note: desktop navigation failed (`ERR_TOO_MANY_RETRIES` from the Cloudflare-fronted host when reached through this environment's proxy); metrics below come from the **mobile capture (390 × 844 px)**, complemented by static CSS analysis.
- Title: “McALPINE” · lang en-US · generator WordPress 6.9.4 · DOM nodes 637 · page height 3056 px (mobile)
- Fonts loaded: Canela 200 normal, Canela 200 italic, Canela 300 normal, Canela 300 italic, Canela Text 400 normal, Canela Text 400 italic; @font-face: swiper-icons 400 normal, Canela 200 normal, Canela 200 italic, Canela 300 normal, Canela 300 italic, Canela Text 400 normal, Canela Text 400 italic
- H1: 28px Canela Text 700 lh 1.1 — “McALPINE”; largest text 40 px (10.3 % of viewport width) “”
- Type usage: sizes 13px×58, 40px×37, 28px×1, 14px×1; weights 400×59, 250×37, 700×1; line-heights 1.5×45, 0.9×37, normal×11, 1.2×3; letter-spacing none; uppercase share 0 %
- Colour (computed): text #241C18×54, #FFFFFF×43; backgrounds by area #FFFFFF, #EBEBEB, #3E3E43 @65%, #3D3C44, #000000; body bg transparent
- Layout: max-widths 612.5px×1; radii 50%×1, 4px×1; grid containers 4; header static (mix-blend normal); burger menu yes
- Nav: Go to main content; CTAs/buttons: Go to main content, Open / Close menu, Play, Copy info@mcalpinehouse.com to clipboard, Copy jobs@mcalpinehouse.com to clipboard, Copy 844.624.6633 to clipboard, Manage Cookies
- Motion stack (script signatures): —; globals: —; script hints: locomotive, ogl, gtag
- Pattern signals: preloader, split-text reveals, smooth-scroll container, dark first view, video×3; images 77 (webp 77); inline SVG 9; iframes 1
- CSS tokens (same-origin sheets 4, blocked 0): 139 custom properties; breakpoints (min-width: 1000px), (min-width: 700px), (max-width: 699px), (max-width: 999px), (min-width: 1400px), (hover: hover) and (prefers-reduced-motion: no-preference); durations 0.3s×36, 0.5s×25, 0.25s×23, 0.15s×9, 0.75s×6; easings cubic-bezier(0.165, 0.84, 0.44, 1)×43, ease×16, cubic-bezier(0.23, 1, 0.32, 1)×7, linear×2; keyframes 6; fluid type: clamp() 0, vw 0
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--spacing-2xs-mobile: 6`; `--spacing-2xs-desktop: 10`; `--spacing-xs-mobile: 12`; `--spacing-xs-desktop: 16`; `--spacing-sm-mobile: 22`; `--spacing-sm-desktop: 32`; `--spacing-md-mobile: 32`; `--spacing-md-desktop: 56`; `--spacing-lg-mobile: 48`; `--spacing-lg-desktop: 96`; `--spacing-xl-mobile: 64`; `--spacing-xl-desktop: 128`; `--spacing-2xl-mobile: 96`; `--spacing-2xl-desktop: 176`
- Weight: 991 KB over 24 requests (script 352 KB, img 244 KB, css 229 KB, link 163 KB); DOMContentLoaded 7876 ms, load 12016 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H1 28px “McALPINE”
- Static analysis (curl, no rendering): HTML 116 KB, generator WordPress 6.9.4, lang en-US; stylesheets main.css (131 KB), cookie-consent.css (32 KB)
- @font-face: Canela 200, Canela 300, Canela Text 400; family declarations: Canela Text×18, Canela×13, inherit×2, swiper-icons×1; letter-spacing: none; uppercase rules 0
- Tokens: 124 custom properties; font-size declarations var(--font-size-body-small)×13, calc(1.2*var(--font-size-body-small))×13, var(--font-size-h3)×9, var(--font-size-body-medium)×3, calc(1.2*var(--font-size-body-medium))×3, var(--font-size-body-regular)×3; clamp() 186, vw units 195; max-widths 17.5rem×2
- Breakpoints: (min-width: 1000px) (53), (min-width: 700px) (49), (max-width: 699px) (40), (max-width: 999px) (33), (min-width: 1400px) (16), (hover: hover)and (prefers-reduced-motion: no-preference) (13)
- Motion: durations .3s×39, .5s×37, .25s×35, 0s×24, .15s×14, .75s×13; easings cubic-bezier(0.165, 0.84, 0.44, 1)×65, cubic-bezier(0.23, 1, 0.32, 1)×9, cubic-bezier(0.77, 0, 0.175, 1)×2, cubic-bezier(0.25, 0.46, 0.45, 0.94)×1; keyframes 6; script signatures gsap, ScrollTrigger, Lenis, ogl, swup, SplitText, swiper, reducedMotion, IntersectionObserver; attribute hints data-scroll×8, lenis×1, gtag×4
- Colours in CSS (hex, by rule count): #FFF×33, #241C18×27, #EBEBEB×14, #F5F5F5×8, #000×7, #3D3C44×4, #F0F4F7×3, #D3D3D3×2
- H1: “McALPINE”; nav: Projects, Philosophy, Team, Books & Press, Furniture Lines, Contact, Instagram, Facebook, Pinterest, YouTube, TikTok, LinkedIn, info@mcalpinehouse.com; images 77, videos 3, canvas 0
- Screenshots: mcalpine-mobile-fold.jpg, mcalpine-mobile-full.jpg

### FUNCTION — https://function10.ca
Client type: Creative studio. Awards: SOTD Jun 2025 + Developer Award. Scores: n/a. Awwwards-listed tech: n/a. Awwwards palette: n/a.

- Title: “FUNCTION” · lang en-US · generator — · DOM nodes 347 · page height 8469 px (desktop) / 7638 px (mobile)
- Fonts loaded: TWKEverett 400 normal, PPMonument 900 normal, Ayer 500 italic; @font-face: TWKEverett 400 normal, PPMonument 900 normal, Ayer 500 italic
- H1: 16px TWKEverett 400 lh 1.1 — “Function 10 is a platform for Ballroom culture, stories, and events.”; mobile H1 16 px; largest text 265 px (18.4 % of viewport width) “BALLROOM IS FREEDOM”
- Type usage: sizes 10px×29, 12px×23, 42px×12, 80px×9, 22px×8, 16px×3, 72px×3, 265px×2; weights 400×90; line-heights 1×51, 1.4×23, 1.1×10, normal×4; letter-spacing -0.02em×87, -0.015em×1; uppercase share 94 %
- Body copy: 12px/1.4 TWKEverett, measure ≈454 px
- Colour (computed): text #FFFFFF×48, #000000×33, color(srgb 1 1 1 / 0.5)×5, #111111×4; backgrounds by area #000000, #FFFFFF, #111111, #9389C5, #24CEEA; body bg transparent
- Layout: max-widths 1440px×1; radii 2px×6, 50%×4, 8px×1, 4px×1; grid containers 9; header fixed (mix-blend normal); burger menu yes
- Nav: FEED, AUDIO, EVENTS, PORTRAITS, ARTICLES, SWITCH TO VOICES SWITCH TO VOICES; CTAs/buttons: SWITCH TO VOICES SWITCH TO VOICES, BROWSE THE FEED, MANAGE COOKIES
- Motion stack (script signatures): gsap, ScrollTrigger, Lenis, swup, SplitText, IntersectionObserver, reducedMotion; globals: —; script hints: ogl, gtag
- Pattern signals: split-text reveals, parallax attrs, theme switching, smooth-scroll container, page transitions, dark first view, sticky×2, video×2; images 12 (png 2, jpg 10); inline SVG 6; iframes 0
- CSS tokens (same-origin sheets 1, blocked 1): 70 custom properties; breakpoints (max-width: 999px), (min-width: 1000px), (prefers-reduced-motion: no-preference), (max-width: 699px), (hover: hover), (prefers-reduced-motion: no-preference) and (hover: hover); durations 0.3s×25, 0.25s×4, 0.5s×3, 0.75s×3, 0.15s×1; easings cubic-bezier(0.215, 0.61, 0.355, 1)×27, cubic-bezier(0.38, 0.005, 0.215, 1)×2, linear×1, cubic-bezier(0.23, 1, 0.32, 1)×1; keyframes 3; fluid type: clamp() 2, vw 4
- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): `--spacing-3xs-mobile: 6`; `--spacing-3xs-desktop: 6`; `--spacing-2xs-mobile: 6`; `--spacing-2xs-desktop: 10`; `--spacing-xs-mobile: 12`; `--spacing-xs-desktop: 16`; `--spacing-sm-mobile: 22`; `--spacing-sm-desktop: 32`; `--spacing-md-mobile: 32`; `--spacing-md-desktop: 56`; `--spacing-lg-mobile: 48`; `--spacing-lg-desktop: 96`; `--spacing-xl-mobile: 64`; `--spacing-xl-desktop: 128`
- Weight: 2708 KB over 29 requests (img 1784 KB, css 426 KB, script 273 KB, link 218 KB); DOMContentLoaded 8425 ms, load 14244 ms (headless Chromium through a proxy, not a field measurement)
- Heading ladder: H1 16px “Function 10 is a platform for Ballroom c”; H2 22px “ICON KEVIN JZ PRODIGY”; H2 42px “WORLD AIDS DAY BALL: MUSEUM”; H2 22px “SECURE THE BAG: A QUICK GUIDE TO BUDGETI”; H2 42px “JAZMINE MIYAKE-MUGLER”; H2 42px “MAYHEM RELEASE PARTY”; H2 265px “BALLROOM IS FREEDOM”; H2 22px “ICON RICKY ALLURE”
- Screenshots: function10-desktop-fold.jpg, function10-desktop-view2.jpg, function10-desktop-full.jpg, function10-mobile-fold.jpg, function10-mobile-full.jpg

### 6.5 Cross-site aggregates

Computed over the 15 usable desktop captures; the library union at the end also counts the mobile and static results of the blocked sites.

- Rendered desktop captures used: 15 of 22 sites (L.I.S.A. is WebGL-only and excluded; five sites were blocked for Chromium and one was unreachable, see §6.3). Dark first view: 10/15.
- Type families most used (top-2 per site): Helvetica Now Display (3), Neue Montreal (2), ABCDiatype (2), HelveticaNowDisplay (1), LocomotiveNew (1), palma-fizzy-heavy (1), Suisse Intl Mono (1), SuisseIntl (1), SuisseIntlCond (1), National 2 Condensed (1), scout-ibm-plex-mono (1), scout-sans-regular (1)
- H1 sizes: median 55 px (range 14–200 px; several sites keep the H1 small and put the display statement in an H2). Largest display text as a share of the 1440 px viewport: median 10.1 % (≈145 px), min 3.3 %, max 120 % (Editorial New's specimen glyph).
- Body copy: median 22 px at line-height 1.25, measure median 453 px (15 sites with a measurable first paragraph).
- Dominant weights: 400 (12), 500 (6), 700 (4), 300 (3), 600 (1); dominant line-heights: 1 (8), 1.2 (5), 1.1 (4), 1.4 (4), 1.5 (3)
- Motion libraries in the rendered captures (sites): gsap (10), IntersectionObserver (10), SplitText (8), ScrollTrigger (7), swup (6), reducedMotion (6), Lenis (5), three (3), swiper (3), glsl (3), lottie (3), vue (2), astro (2), splide (2), barba (1), shopify (1)
- Motion libraries across all sources incl. static analysis of the blocked sites (sites): IntersectionObserver (14), gsap (13), SplitText (11), ScrollTrigger (10), Lenis (9), reducedMotion (8), swup (8), swiper (7), ogl (5), glsl (4), three (4), vue (3), barba (3), LocomotiveScroll (3), astro (3), lottie (3), Splitting (2), splide (2)
- Pattern signals (sites): langSwitch (12), textSplit (12), scrollContainer (11), darkFirstView (10), parallax (10), pageTransitions (9), themeSwitch (8), customCursor (7), preloader (6), horizontalScroll (4), marquee (1)
- Easing functions (rule counts across same-origin CSS): cubic-bezier(0.215, 0.61, 0.355, 1) (350), ease (59), cubic-bezier(0.38, 0.005, 0.215, 1) (49), cubic-bezier(0.4, 0, 0, 1) (45), cubic-bezier(0.4, 0, 0.2, 1) (24), linear (23)
- Transition durations (rule counts): 0.3s (176), 0.9s (155), 0.6s (95), 0.15s (93), 0.25s (71), 0.5s (57), 0.4s (32), 0.75s (29)
- Breakpoints (sites using): (min-width: 700px) (10), (hover: hover) (10), (min-width: 1000px) (10), (min-width: 1200px) (9), (max-width: 699px) (8), (min-width: 500px) (6), (prefers-reduced-motion) (6), (min-width: 2400px) (5), screen and (max-width: 640px) (5), (max-width: 999px) (5)
- Page weight at load: median 1771 KB, min 341 KB, max 11787 KB (headless load through a proxy; media-heavy heroes dominate)

**What the numbers say.** Four things are consistent enough across fifteen unrelated clients to count as the Locomotive method rather than individual taste:

1. **A small type system with one enormous step.** The median H1 is 55 px, but the largest text on a page is typically 10 % of the viewport width (145 px at 1440), and several sites keep the H1 small and put the statement in an H2 or a specimen. Body copy is large (median 22 px, line-height 1.25) on a wide measure (median 453 px, up to 846 px). Weight 400 dominates (12 of 15 sites); line-heights sit at 1.0–1.2 for display and 1.4–1.5 for body. Letter-spacing is rarely touched except for small caps labels.
2. **Two colours, one accent, dark openings.** Ten of fifteen first views are dark. Computed palettes are almost all a near-black, a near-white and one saturated hue; grey is used for secondary text and, in three sites, at contrast ratios that fail WCAG (GKC's #A2A2A2 on white is 2.6 : 1).
3. **One choreography stack.** GSAP appears on 13 of 21 measurable sites, SplitText on 11, ScrollTrigger on 10, Lenis or Locomotive Scroll on 9, Swup or Barba page transitions on 11. Their own ease-out-cubic curve `cubic-bezier(0.215, 0.61, 0.355, 1)` is the single most common easing (350 rules), followed by `cubic-bezier(0.38, 0.005, 0.215, 1)` and Tailwind's `cubic-bezier(0.4, 0, 0.2, 1)`. Durations cluster at 0.15 s (micro), 0.3 s (hover and UI), 0.6 s (reveals) and 0.9 s (large reveals and transitions). `(hover: hover)` guards appear on 10 sites and `prefers-reduced-motion` on 6 to 8.
4. **The same breakpoints everywhere.** 700 px and 1000 px are the working breakpoints on 10 sites each, with 1200 px and 1400–1600 px steps that mostly change the base font-size, and `min-width: 2400px` guards for very large screens. Layouts are fluid within them: most sites have no pixel max-width at all.

The cost side is equally consistent: median page weight 1.8 MB (up to 11.8 MB for Scout Motors), preloaders on 6 sites, custom cursors on 7, and jury accessibility scores that are the lowest sub-score on almost every project. Those are the parts the blueprint drops or fixes.


## 7. The Locomotive pattern library (what recurs across the shortlist)

Observed in the captures (`assets/locomotive/`), in the measured data of §6, in Awwwards' per-site "notable elements" and in the case studies. Each pattern is stated as a rule the new site can follow; §8 says which ones apply to Flight Hour Solution and how.

**P1 · One typographic idea per site, at scale.** Every site leads with a single display face used enormous: a serif for Locomotive's own featured-work index, a heavy grotesk wordmark filling the viewport width on Webisoft, a light grotesk headline of three lines on Populous ("We design the places where people love to be together."), a two-line statement on GKC ("Aligning vision and action"). Display sizes run from 70 px (Locomotive H1) to 200–230 px (Webisoft wordmark, GKC counters) and to 420–504 px on the industrial launches (Truck'N Roll, Scout Motors); the median largest text is 10 % of the viewport width, while body copy stays at 15–26 px. The contrast between the two sizes is the design.

**P2 · Two colours plus one accent.** Awwwards' colour tags for the shortlist are almost all black/white pairs: Locomotive #000/#FFF, Pangram #000/#9C9C9C/#FFF, Lightship #FFF/#000, Populous #000/#FFF, Wolverine #010101/#FFF, Truck'N Roll #131313/#FEFEFE, Editorial New #000/#FFF, L.I.S.A. #000/#FFF. The exceptions use one saturated field: Webisoft's red-orange ground, Scout Motors #FF5432, Vooban #1458E4, PAVE #1F66F1, Lowe's Labs #1246B9, Nord Quantique #24222E/#843245, GKC #151F26 navy, Dulcedo #C5AE79 gold. Locomotive's own menu flips to electric blue #312DFB. Rule: neutral canvas, one brand colour, used as a field or a state, never as decoration.

**P3 · The ruled list as a hero component.** Locomotive's home presents "Featured work" as full-width rows separated by 1 px rules (Lightship / Wolverine Worldwide / The Drake Hotel / Dulcedo / Scout Motors / All Work), each row a hover target. Pangram's index and Webisoft's service list (Advisory / Blockchain / Product Development / Enterprise Software / AI) do the same. Lists beat cards.

**P4 · Editorial grid with asymmetric image placement.** Populous places a 4-line statement on the left and a small video card on the right; GKC splits the second view into a dark image half and a white text half; Lightship's second view scatters three photographs at different sizes in a 12-column grid. Whitespace is a material: Locomotive's home has entire viewports with a single black block and a caption.

**P5 · Metadata typography.** Small mono or grotesk labels in caps carry the "engineering" feel: Webisoft's "WBSFT® · MTL (CAN) · /0026 · ENGINEERING_", Locomotive's "©2008-2026", "Seven Years Running 2018–2024", GKC's "01 / 03" pager, Populous' "WATCH OUR MISSION IN ACTION · 60 SEC." Labels are 11–14 px, usually uppercase with slight tracking, always aligned to the grid columns.

**P6 · Full-screen or panel menus.** The nav collapses to "Menu" plus a hamburger even on desktop (Populous, GKC, Locomotive on mobile); the open state is a large-type overlay (Pangram) or a right-hand white panel over a dimmed hero (Populous) with two-level structure: three primary destinations in 40–48 px type, secondary groups ("Who we are", "Impact") in 16–18 px. Hick's law in practice: three to five primary links.

**P7 · Media-led heroes with a static safety net.** Locomotive, Populous, Lightship and Truck'N Roll open on autoplaying video or WebGL; the headline and CTA sit on top and remain usable when media fails (the headless captures, taken without video codecs, show the layout surviving with the video slot black). Lightship adds a thin rule and a "Scroll to explore" cue at the bottom of the viewport.

**P8 · Counters and numbers as display elements.** GKC's "+4M sq. ft. designed and built each year" in 200 px grey numerals; Locomotive's "Seven Years Running"; Truck'N Roll's "30 years behind the biggest tours". One number per section, set in the display face, with a short caption in the body face.

**P9 · Scroll choreography, not scroll tricks.** Reveals are line-by-line or word-by-word with restrained stagger; parallax is applied to images at low speed factors (`data-scroll-speed` 0.1–0.5); pinned sections are reserved for one storytelling moment (Lightship's walkthrough, Scout's storytelling). Locomotive Scroll v5 keeps the native scrollbar; page transitions (Barba on their site, Swup in the boilerplate) cross-fade between routes so the site feels like one continuous surface.

**P10 · Microcopy with personality, placed in the chrome.** "Let's talk" as the only header CTA (Locomotive, Webisoft), "Discover the world of GKC", "Build yours" (Lightship), "Explore ↓" (Webisoft). Locomotive's footer sets the postal address in 90 px serif with emoji glyphs replacing punctuation, a deliberate quirk that signals confidence.

**P11 · Bilingual by design.** Every Quebec project ships EN/FR with a one-word language switch in the header or footer (Locomotive "Français", Truck'N Roll "Fr", Lightship none). For a Swiss company the equivalent is EN/DE.

**P12 · Accessibility is the weak spot.** Jury accessibility scores are the lowest of every project; captures show light-grey small labels and text-over-video without guaranteed contrast. The blueprint keeps the patterns and adds contrast tokens, focus states and reduced-motion fallbacks as first-class requirements.

## 8. The blueprint for Flight Hour Solution

This section turns §3–§7 into decisions for the new site. It refines the design direction in [07 §6](07-recommendations-and-brief.md); where the two differ, this section wins (ruled rows instead of cards, a fluid type ramp instead of fixed sizes, a defined motion system instead of "subtle reveal only"). Nothing here copies a Locomotive asset, layout file or line of copy; what is borrowed is the system: proportions, rhythm, tokens, choreography and engineering discipline.

### 8.1 Design thesis

**Engineering precision, presented calmly.** The site should feel like a well-kept shop-visit record turned into a building: a navy canvas, large numerals, ruled lists, one orange signal, real photographs of engines and people, and copy that says exactly what happens and what it costs. The Locomotive precedents are the industrial and professional-services projects, not the brand launches: Truck'N Roll (dark canvas, condensed display type, custom photography of the actual operation), Vooban (a consultancy that leads with a plain-language statement and a services list), Populous and GKC (professional-services calm, numbers as display), Wolverine Worldwide (corporate credibility with restraint), PAVE (B2B proof and a strong footer).

What the thesis rules out: decorative motion, stock imagery, gradient blobs, bento grids, testimonial carousels, and anything that makes a two-person consultancy look like a software start-up.

### 8.2 Tokens

The token names follow Locomotive's own conventions (§3) so that their open-source tooling and habits transfer. Proposed `tokens.css` values:

**Colour.** Two neutrals, one brand dark, one accent, two secondary text colours, one data hue. Contrast ratios are WCAG 2.x computed values.

| Token | Value | Role | Contrast |
|---|---|---|---|
| `--color-navy` | `#1C205C` (brand) | Canvas of dark sections; headings on light | 14.9 : 1 against white, 13.2 : 1 against paper |
| `--color-ink` | `#12152E` | Body text on light surfaces | 17.9 : 1 on white, 15.9 : 1 on paper |
| `--color-paper` | `#F4F1EB` | Default light surface (the warm off-whites of Lightship `#FAF6EF`, Scout `#EDE9E8` and Truck'N Roll `#D8D3D3` are the precedent) | surface |
| `--color-white` | `#FFFFFF` | Inputs, hovered rows, images' mats | surface |
| `--color-orange` | `#EE7203` (brand) | The only accent: button fills, key numerals at 24 px and above, active states, rules and markers on navy | 5.0 : 1 on navy (AA for any text); 3.0 : 1 on white (large text and graphics only) |
| `--color-orange-text` | `#A84E00` | Orange for small text and links on light surfaces | 5.6 : 1 on white, ≈5.0 : 1 on paper |
| `--color-muted` | `#545872` | Secondary text, captions on light | 6.2 : 1 on paper |
| `--color-muted-dark` | `#A9ACC6` | Secondary text on navy | 6.7 : 1 on navy |
| `--color-line` | `rgb(18 21 46 / 0.16)` light, `rgb(255 255 255 / 0.22)` dark | 1 px rules (the ruled-list pattern) | non-text |
| `--color-data` | `#2F6A9E` | Charts and diagrams, one hue only | 5.7 : 1 on white |

Rules: never white text on orange (3.0 : 1); buttons on orange use ink text (6.0 : 1). Never `--color-orange` for text under 24 px on light surfaces; use `--color-orange-text`. No greys lighter than `--color-muted` for text (GKC's `#A2A2A2` on white is 2.6 : 1 and is the kind of thing the jury penalised). Sections carry `data-theme="dark|light"` and the header reads it, the way Locomotive's theme switching works, so the fixed header stays legible over both canvases.

**Spacing.** Locomotive's eight named steps, snapped to a 4 px base, desktop / mobile:

| Token | Desktop | Mobile | Use |
|---|---|---|---|
| `--spacing-micro` | 12 | 8 | icon gaps, label to value |
| `--spacing-tiny` | 20 | 16 | inside rows and buttons |
| `--spacing-small` | 32 | 24 | between text blocks |
| `--spacing-medium` | 40 | 32 | between components |
| `--spacing-large` | 80 | 48 | inside sections |
| `--spacing-big` | 120 | 64 | between related sections |
| `--spacing-huge` | 160 | 96 | between chapters of a page |
| `--spacing-enormous` | 240 | 128 | around the hero and the closing statement |

**Grid.** 12 columns from 1000 px, 6 columns from 700 px, 4 columns below; gutters 20 / 16 / 12 px; outer margins 40 / 32 / 20 px; no pixel max-width up to 1600 px (the layout is fluid, as on 12 of the 15 measured sites); above 1600 px the base font-size steps up (Locomotive: 15 px → 17 px at 2000 px) so proportions hold instead of leaving empty margins. Running text is capped at 65 characters (about eight columns at 1440 px). The grid overlay from `@locomotivemtl/grid-helper` is used in development to check alignment.

**Type.** Two faces, both self-hosted WOFF2, four files, under 130 KB in total:

- Recommended pairing (open licence): **IBM Plex Sans** 400 / 500 / 600 for display and body, **IBM Plex Mono** 400 for metadata labels, engine designations, part numbers and table data, with `font-variant-numeric: tabular-nums` wherever figures appear. Plex was designed for an engineering company, sets numerals well and ships Latin Extended for German.
- Premium alternative if the client funds licences (roughly CHF 600–1,500 per year for a site licence): **Helvetica Now Display** (Locomotive's default face on five shortlisted sites) or **Suisse Int'l** (Populous, Webisoft) with **Suisse Int'l Mono**. Do not pair a serif display face: it reads as luxury or editorial, not engineering.

Fluid ramp generated the Locomotive way (Utopia between a 390 px and a 1440 px viewport; base 17 → 19 px; ratio 1.2 → 1.333); values are the ones to paste into `postcss-utopia` or straight into `tokens.css`:

| Token | 390 px | 1440 px | `clamp()` (root 16 px) | Use |
|---|---|---|---|---|
| `--step--2` | 12.0 px | 13.0 px | `clamp(0.750rem, 0.727rem + 0.095vw, 0.812rem)` | metadata labels (mono, uppercase, +0.06 em) |
| `--step--1` | 14.0 px | 15.5 px | `clamp(0.875rem, 0.840rem + 0.143vw, 0.969rem)` | captions, table body, footer |
| `--step-0` | 17.0 px | 19.0 px | `clamp(1.062rem, 1.016rem + 0.190vw, 1.188rem)` | body copy |
| `--step-1` | 20.4 px | 25.3 px | `clamp(1.275rem, 1.161rem + 0.469vw, 1.583rem)` | lead paragraphs, menu secondary links |
| `--step-2` | 24.5 px | 33.8 px | `clamp(1.530rem, 1.315rem + 0.884vw, 2.110rem)` | H3, ruled-row titles |
| `--step-3` | 29.4 px | 45.0 px | `clamp(1.836rem, 1.473rem + 1.488vw, 2.813rem)` | H2, footer address, menu destinations |
| `--step-4` | 35.3 px | 60.0 px | `clamp(2.203rem, 1.629rem + 2.356vw, 3.749rem)` | H1 on inner pages |
| `--step-5` | 42.3 px | 80.0 px | `clamp(2.644rem, 1.769rem + 3.587vw, 4.998rem)` | hero and closing statements |
| `--step-6` | 50.8 px | 106.6 px | `clamp(3.173rem, 1.876rem + 5.317vw, 6.662rem)` | section numerals |
| `--step-display` | 56.0 px | 148.0 px | `clamp(3.500rem, 1.364rem + 8.762vw, 9.250rem)` | the one enormous step: key figures, single-word statements (≈10 % of a 1440 px viewport, the measured median) |

Line-heights: 1.0–1.05 for steps 5–6, 1.1 for steps 3–4, 1.25 for step 2, 1.45 for body (higher than Locomotive's 1.2 because our body is smaller and more technical), 1.4 for captions. Letter-spacing: −0.02 em on steps 4–6, 0 on body, +0.06 em on uppercase mono labels. One weight per role: 400 for body and display statements, 500 for H2/H3, 600 only for buttons and table headers. The current site's ad-hoc 22 sizes and 18 Nunito files are retired.

**Motion tokens.** Taken from the measured clusters (§6.5):

| Token | Value | Use |
|---|---|---|
| `--duration-micro` | 150 ms | colour and opacity on hover and focus |
| `--duration-ui` | 300 ms | buttons, menu items, accordion panels, row highlight |
| `--duration-reveal` | 600 ms | section and image reveals |
| `--duration-hero` | 900 ms | hero word reveal, page transition, pinned-sequence steps |
| `--ease-out` | `cubic-bezier(0.215, 0.61, 0.355, 1)` | default (350 rules across the shortlist) |
| `--ease-out-strong` | `cubic-bezier(0.23, 1, 0.32, 1)` | large elements arriving |
| `--ease-in-out` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | page transitions, things that leave and return |
| stagger | 40 ms per word, 80 ms per line or row, never more than 12 items | split-text and list reveals |
| parallax | `data-scroll-speed` 0.1–0.25 on images only, off on touch | depth without motion sickness |
| smooth scroll | Locomotive Scroll v5 defaults: lerp 0.1, duration 1.2, `smoothTouch: false`, native scrollbar and keyboard preserved | wheel smoothing only |

Under `prefers-reduced-motion: reduce`: no smooth scroll, no parallax, no scrubbed or pinned sequences, no counters; reveals render in their final state; the hero text is simply there. This is the one place the blueprint is stricter than every shortlisted site.

**Breakpoints.** 700 px, 1000 px, 1200 px, with 1600 px and 2000 px steps that only change the base font-size; `(hover: hover)` guards on every hover effect; container queries for components that appear in both the 8-column and the 4-column context.

### 8.3 Home page choreography

Section sequence, with the pattern it applies (§7) and the motion it is allowed. Every section is complete without JavaScript; motion only adds.

| # | Section | Content | Pattern | Motion |
|---|---|---|---|---|
| 0 | Header | Fixed, 72 px. Wordmark left; four links (Services, Engines, About, Insights); one orange button "Start a conversation"; EN/DE switch; below 1000 px, "Menu" plus burger opening a full-height navy panel with the four destinations at step 3 and secondary links at step 0 | P6, P11 | Panel slides in 300 ms `--ease-out`; header colour follows `data-theme` of the section beneath, 150 ms |
| 1 | Hero | Navy canvas. Statement at step 5 (two lines, from the headline options in 07 §2.5, for example "Independent engine management for operators and lessors"); mono metadata row underneath ("Zug, Switzerland · Independent · CFM56 · LEAP · V2500 · PW4000 · APU"); one orange CTA and one text link "How a managed shop visit works ↓"; right column or full-bleed background: a real photograph of an engine on a stand or in a test cell (07 §6 imagery brief), optionally a muted ambient video with that photograph as poster. Thin rule and scroll cue at the bottom | P1, P5, P7, P10 | Words reveal 900 ms, 40 ms stagger; image from opacity 0 / scale 1.04 to 1 over 900 ms; header fades in last. No preloader |
| 2 | Proof strip | Three figures in step 6 numerals with mono captions, supplied by the client and verifiable (years of experience, shop visits managed, engine families covered); membership marks (Swiss Aerospace Cluster; ISO 9001 and ASA only once the certificates are in hand) | P8 | Numerals count up 600 ms once, not under reduced motion |
| 3 | Services | Ruled list of seven or eight rows: title at step 2, one-line description at step 0, engine families as mono tags, arrow. Whole row is the link | P3 | Rows reveal with 80 ms stagger; hover lifts the row to white and slides the arrow 8 px in 300 ms |
| 4 | Engines we manage | Left column sticky title and short paragraph; right column five rows (CFM56, LEAP, V2500, PW4000, APU and turboprop) each with a line-art cross-section, the services offered for that family and a link | P4 | Sticky title on desktop; row reveal only |
| 5 | How a managed shop visit works | The single pinned sequence on the site: five steps (induction planning, workscope, table inspection, repair approvals, redelivery) advancing with a progress rule driven by `data-scroll-css-progress`; on mobile a vertical numbered list | P9 | Scrubbed 0–1 progress; steps switch at 600 ms; disabled under reduced motion |
| 6 | Results | One number and one paragraph from a real engagement (anonymised if required: "Workscope challenge saved USD 0.4 M on a CFM56-7B shop visit"), or, until a case exists, a "Recent work" ruled list of engagement types | P8, P10 | Reveal only |
| 7 | People | Portrait of the managing director, name, credentials, one paragraph in the first person; contact card with one phone number, email, WhatsApp, calendar link. Locomotive's "Talk to the human" tone, made literal | P10 | Reveal only |
| 8 | Insights | Ruled list of the three latest articles with mono dates and reading time | P3, P5 | Reveal only |
| 9 | Closing statement | Full-bleed navy; statement at step 5; orange CTA; secondary link to the capability statement PDF | P1 | Word reveal 900 ms |
| 10 | Footer | Company name, address at step 3, UID, memberships, legal links (Impressum, Privacy, Cookies), language switch, "© 2024–2026" in mono | P5, P11 | none |

Page transitions (Swup) cross-fade 300 ms between routes with the header persistent; if Swup cannot be made to degrade cleanly with the CMS preview or analytics, leave it out. It is the least important part of the system.

### 8.4 Component rules

- **Buttons:** one primary (orange fill, ink text, 48 px tall, 4 px radius, step 0 at weight 600), one secondary (1 px line, current colour), one text link with arrow. Hover 150 ms colour, focus ring 2 px orange on light and 2 px white on dark, offset 2 px. No gradients, no shadows.
- **Ruled row:** the workhorse component (services, engines, insights, downloads, job listings): 1 px `--color-line` top and bottom, `--spacing-tiny` vertical padding, grid-aligned columns, the entire row a link, arrow at the right.
- **Stat:** numeral at step 6 in tabular figures, caption at step −1 in mono uppercase with +0.06 em tracking, optional unit in `--color-orange`.
- **Metadata label:** mono, step −2 or −1, uppercase, `--color-muted`; used for section numbers ("01 / Services"), dates, engine designations, document types.
- **Media frame:** 3 : 2 on desktop and 4 : 5 on mobile for photography, 16 : 9 for video; `aspect-ratio` set, `srcset` and AVIF/WebP, lazy below the fold, LCP image preloaded; captions in metadata style.
- **Cards** exist only where a row cannot carry an image (engine families, people): 0–4 px radius, no shadow, 1 px line, image on top.
- **Forms:** visible labels, 56 px inputs, ink text on white, error text in `--color-orange-text` with an icon, Turnstile instead of reCAPTCHA, file upload for workscopes and borescope reports, success state that names who will reply and when.
- **Tables** (engine families, service scopes, glossary): mono headers, tabular numerals, zebra with `rgb(18 21 46 / 0.04)`, horizontal scroll on mobile with a fade cue.
- **Badges:** memberships and certifications as monochrome marks on paper, never colour logos on colour; each links to the verifying page.
- **Menu panel:** navy, destinations at step 3 with 80 ms stagger, secondary links and contact at step 0, language switch, close button in the same spot as the burger; focus trapped; Escape closes.

### 8.5 Accessibility and performance budgets

The shortlist's weakest sub-scores become this site's hard gates.

| Measure | Locomotive shortlist (measured or jury) | Flight Hour Solution budget |
|---|---|---|
| Accessibility | Jury 6.7–7.8, lowest sub-score on almost every project | WCAG 2.2 AA; zero axe-core violations on every template; manual keyboard and screen-reader pass |
| Text contrast | Greys down to 2.6 : 1 | ≥ 4.5 : 1 for text, ≥ 3 : 1 for large text (24 px, or 18.5 px bold) and UI graphics |
| Focus and keyboard | Mouse-first menus; two sites ship a skip link | Skip link, visible focus on everything, focus trapped in the menu, no hover-only information |
| Reduced motion | 6–8 sites declare a media query, none disable smooth scroll | All motion classes off; final states rendered; smooth scroll not initialised |
| Page weight at load | Median 1.8 MB, max 11.8 MB | ≤ 1.0 MB home (video excluded and optional), ≤ 600 KB service pages |
| JavaScript | 341–3,323 KB of script | ≤ 150 KB gzipped in total (GSAP core + ScrollTrigger + SplitText ≈ 40 KB, Locomotive Scroll 9.4 KB, site code ≤ 40 KB, no jQuery, no Swiper) |
| Fonts | 2–8 files, some hashed subsets | 4 WOFF2 files ≤ 130 KB, `font-display: swap`, metric-compatible fallbacks so text does not jump |
| Core Web Vitals | Not measurable here | LCP ≤ 2.0 s on 4G mobile with the hero text as LCP element; CLS ≤ 0.05; INP ≤ 200 ms |
| Preloader / custom cursor | 6 / 7 of 15 sites | None |
| Video | Autoplaying hero video on 8 sites | Optional, muted, poster image, ≤ 2 MB, honours reduced motion and reduced data, never carries the message |
| Language | EN/FR switch on 12 sites | `lang="en"` at launch; `/de/` with hreflang in phase 2 (07 §9) |

The gates run in CI: axe-core on rendered templates, Lighthouse CI with the weight budget, a reduced-motion snapshot test, and the same headless extractor used in §6 pointed at the staging URL so the measured type, colour and motion values can be compared with the tokens above.

### 8.6 Stack

Aligned with 07 §9 and with Locomotive's current boilerplate (§4), so that a developer who knows either is at home:

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Astro 6**, static output, islands only for the contact form and the phase-2 estimator | Locomotive's own current boilerplate; ships zero JS by default; content collections for services, engines, glossary |
| Styling | **Tailwind CSS 4** with the tokens above declared as `@theme` custom properties; **postcss-utopia** for the fluid ramps; ITCSS-style layers for the few hand-written components | Same toolchain as the boilerplate; tokens stay readable CSS |
| Scroll and reveals | **Locomotive Scroll v5** (Lenis inside) as the single scroll engine; `data-scroll`, `data-scroll-speed`, `data-scroll-css-progress` attributes; IntersectionObserver-based `is-inview` classes for CSS reveals | 9.4 KB, native scrollbar and keyboard preserved, one engine only |
| Choreography | **GSAP 3.13+** core with ScrollTrigger and SplitText (all plugins are free for commercial use since the 2025 release) | Word reveals, the pinned sequence, counters; connected to Locomotive Scroll's scroll position |
| Transitions | **Swup** with head and preload plugins, optional | 300 ms cross-fade; removed if it complicates the CMS preview |
| Component wiring | `@locomotivemtl/component-manager` or plain `data-module` attributes; `@locomotivemtl/grid-helper` in development | Small, attribute-driven, no framework |
| Content | Markdown/MDX collections in this repository for services, engine families, glossary and legal pages; a small headless CMS (Sanity, Storyblok or Decap, per 07 §9) for insights and asset listings once the client wants to edit without a developer. Craft CMS is Locomotive's default and a fine alternative if PHP hosting is acceptable | Tiny content team; reviewable changes |
| Hosting and services | Cloudflare Pages (or Vercel/Netlify) with EU edge; Cloudflare Turnstile on forms; Plausible or Fathom analytics without a consent wall; Cal.com for bookings | 07 §8–9 |
| Quality gates | axe-core, Lighthouse CI with budgets, Playwright visual snapshots at 390 / 700 / 1000 / 1440 px, reduced-motion run, the §6 extractor against staging | 8.5 |

Suggested repository layout: `site/src/styles/tokens.css`, `site/src/styles/utopia.css`, `site/src/components/` (Header, MenuPanel, RuledList, Stat, MediaFrame, Form, Footer), `site/src/content/{services,engines,insights,glossary}`, `site/src/scripts/modules/` (scroll, reveal, sequence, counter, menu), `site/tests/`.

### 8.7 What is deliberately left out

Preloaders, custom cursors, marquees, WebGL scenes, horizontal-scroll sections, scroll-jacking on touch, 26 px body text, text placed over video without a scrim, grey text below 4.5 : 1, emoji as punctuation, e-commerce patterns, testimonial sliders, and any number or logo that cannot be verified. Each of these appears somewhere in the shortlist; none of them serves an engine-management consultancy whose visitors are procurement managers, fleet engineers and lessors on corporate laptops.

### 8.8 Build sequence

1. **Tokens and specimen** (1 day): `tokens.css`, the Utopia ramp, a type-and-colour specimen page with every contrast pair checked.
2. **Component lab** (2–3 days): header and menu panel, ruled row, stat, buttons, media frame, form field, footer; each with hover, focus, reduced-motion and no-JS states.
3. **Home** (3–4 days): the choreography of 8.3, then the CI gates of 8.5 on the first build, not the last.
4. **Templates** (2–3 days): service page, engine-family page, article, about, contact, legal; the in-page sub-navigation and stats band from 07 §6.
5. **Content and imagery** in parallel from day one, the Locomotive way: the client supplies real numbers, portraits, certificates and engine photographs (the brief is in 07 §6); nothing is designed around placeholder copy.
6. **German mirror** prepared in the architecture from the start (`/de/`, hreflang, translated tokens for labels), filled in phase 2.
7. **Review** against the installed skills before launch: `build-awwwards-quality-sites` (acceptance checklist, one scroll engine, split-text accessibility), `gsap-core` and `animation-on-scroll` (implementation), `design-tokens` and `better-typography` (system checks), `design-critique` (an outside read of the first build).

## 9. Sources, reproducibility and limitations

**Primary sources.** locomotive.ca (home, agency, work index and 17 case studies, `assets/styles/main.css`, `assets/scripts/app.js`, retrieved 19 September 2026); github.com/locomotivemtl (Locomotive Scroll v5 README and source, astro-boilerplate, craft-boilerplate, component-manager, grid-helper); awwwards.com (Locomotive's agency profile and the 23 project pages behind `data/locomotive/awards.json`, with jury scores, notable elements, colours and technologies as listed there); PR Newswire, "Locomotive named Awwwards Agency of the Year for the seventh consecutive year", 18 September 2025; Locomotive's Medium publication (recent essays via its RSS feed; "Why don't we use front-end frameworks at Locomotive?" (2021) and the Locomotive Scroll essay (2022) via the Internet Archive because Medium blocks automated readers); the Lovers Magazine interview with Louis Paquet; the 22 sites listed in `data/locomotive/sites.txt`, captured on 19 September 2026.

**Reproducing the measurements.** From the repository root, with Playwright's Chromium available:

```
node docs/research/data/locomotive/tools/dna.js docs/research/data/locomotive/sites.txt out/
python3 docs/research/data/locomotive/tools/static_dna.py docs/research/data/locomotive/sites.txt out/static
python3 docs/research/data/locomotive/tools/loco_md2.py out/data docs/research/data/locomotive/awards.json docs/research/data/locomotive/sites.txt out/static/static_results.json > sheets.md
```

`run_sites.sh` shows how the sites were run one process at a time with a timeout; `convert_shots.js` re-encodes the captures with Chromium when no image library is installed.

**Limitations.**

- Six sites could not be rendered on desktop in this environment (§6.3): four are represented by their mobile capture plus static CSS analysis, one by static analysis only, one not at all. Their desktop type sizes and computed colours are unknown.
- Video and WebGL heroes render black in headless Chromium; first-view screenshots of eight sites show the video slot as a dark block.
- Weight and timing figures were taken through a proxy without cache and are indicative of order of magnitude only; they are not field data and not comparable with Lighthouse or CrUX.
- Computed colours describe the rendered state after one scroll pass (reveal animations complete), not the designer's palette; Awwwards' colour tags are quoted alongside for that reason.
- Library detection matches strings in loaded scripts. It is reliable for GSAP, ScrollTrigger, SplitText, Lenis, Swup, Barba and Three.js; "vue" and "react" can be false positives from vendored chunks, and Astro's hashed font-family names (Aupale) hide the real face names, which the static analysis recovers.
- Awwwards scores are the jury's; the Developer Award sub-scores were available for 12 of the 22 sites.
- Locomotive's tokens (§3) are read from the production stylesheet of one date; the agency changes its site often.
- The blueprint's budgets (8.5) are targets set for this project, not measurements; the type ramp and colour contrast values are computed and should be re-checked in the specimen page once the faces are licensed and loaded.
