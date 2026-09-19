# 04 · Technical, SEO, accessibility and UX audit of the current site

Audited 19 September 2026 with curl, the WordPress REST API, DNS-over-HTTPS, RIPE RDAP, crt.sh, the Wayback Machine, the W3C Nu validator and headless Chromium (Playwright with axe-core). Google PageSpeed Insights could not be used (the public API quota for the day was exhausted), so performance was measured in Chromium instead (§6). Raw data is in `data/`.

## 1. Stack, hosting and infrastructure

| Item | Finding |
|---|---|
| CMS | WordPress 6.7.8 (generator meta). Theme Hello Elementor 3.1.1 with a child theme "hello-theme-child-master" 2.0.0 |
| Page builder | Elementor 3.25.8 and Elementor Pro 3.25.2 (both late-2024 builds; the site has not had its plugins updated since launch, only WordPress core point releases). JetElements 2.7.1.1 (Crocoblock) is also loaded |
| SEO / consent | Yoast SEO 24.0; Cookie Law Info / CookieYes 3.2.8 ("We value your privacy" banner) |
| Fonts | Nunito from fonts.googleapis.com, all 18 weights/styles requested, `latin-ext` subset (external Google request on every visit: a Swiss FADP / EU GDPR concern) |
| Analytics / tags | No Google Analytics, Tag Manager, Meta pixel, LinkedIn Insight tag or heat-mapping script is present on any of the six pages. The only third-party scripts are Google Fonts and the Google reCAPTCHA loader that Elementor Pro injects on every page. The company therefore has no web-traffic data, and Chrome UX Report field data is unavailable |
| Hosting | Shared hosting at zenbox.pl (Cyber_Folks S.A., Poland), server `s32.zenbox.pl`, IP 2.57.139.23 (RIPE range PL-ZENBOX-NETWORK), LiteSpeed; an openresty edge in front serves a JavaScript bot-challenge page ("Please wait while your request is being verified…") or silently resets connections under moderate request rates, including for headless browsers, the sitemap index and CSS files. Measured: fetching the site's 86 page assets one at a time, one request per second, produced 21 connection resets and 4 challenge pages; a headless Chromium page load that requested all assets in parallel received challenge pages instead of about a third of its stylesheets. Search-engine and social crawlers are exposed to the same behaviour |
| DNS | Nameservers ns1/ns2.zenbox.pl; A 2.57.139.23; no AAAA (no IPv6); no CAA record |
| Email | MX mx1/mx2/mx3.zenbox.pl; SPF `v=spf1 a mx include:_spf.zenbox.pl -all`; DMARC `v=DMARC1; p=none; sp=none`; no DKIM record under common selectors. Mail is therefore spoofable and deliverability is unmonitored |
| TLS | Let's Encrypt certificates renewed roughly every 60 days since 3 December 2024 (22 certificates logged), covering the apex and www. Grade of the TLS configuration could not be tested through the session proxy |
| Redirects | `http://` → `https://` 301; `www` → apex 301 (issued by WordPress). Correct |
| Security headers | None: no Strict-Transport-Security, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy or Permissions-Policy |
| Mixed content | Every page requests two icons of the cookie banner over plain HTTP (`http://flighthoursolution.com/wp-content/plugins/cookie-law-info/lite/frontend/images/close.svg` and `revisit.svg`), which browsers log as Mixed Content warnings; the WordPress site URL or the plugin settings still hold the pre-HTTPS address |
| Exposure | `/wp-json/wp/v2/users` lists the account "admin" (username disclosure); `xmlrpc.php` is enabled; `/license.txt` and plugin `readme.txt` files are readable (version disclosure); `?author=1` redirects to the homepage (enumeration mitigated); `wp-cron.php` is publicly triggerable; `/readme.html` and `/wp-login.php` were blocked by the host's WAF during testing |
| Search Console | A `google-site-verification` TXT record exists, so the property has been verified in Google Search Console at some point |
| Crawl budget | Yoast `sitemap_index.xml` → `page-sitemap.xml` with 6 URLs (the index request itself was answered with a bot-challenge page once during testing); `robots.txt` allows everything |

## 2. SEO findings

| Area | Finding | Severity |
|---|---|---|
| Language | `<html lang="pl-PL">`, `og:locale pl_PL`, breadcrumb schema "Strona główna", RSS feed titles and search-results title in Polish, skip link "Przejdź do treści", and Polish strings in Elementor's JavaScript UI config ("Udostępnij na Facebooku", "Pobierz", "Powiększ") | High (wrong language signal to search engines and assistive tech) |
| Headings | No H1 on any page; every heading is an H2, including "Phone number:" and "E-mail Address:" labels; 20+ H2s per page | High |
| Content depth | About 2,200 words across five pages; no blog, no engine-family pages, no case studies, no FAQ; service items are bare bullet lists | High |
| Structured data | Yoast emits only WebSite and WebPage; no Organization/LocalBusiness (site representation not configured), no Service, no FAQ; the WebSite schema `description` is "Keeps your flying" (typo) | Medium |
| Titles / descriptions | Present and unique except the privacy policy (no description); home title 59 characters | Low |
| Images | Every image has an empty `alt`; file names are meaningless (image-17-1.webp); decorative SVGs are listed in the image sitemap | Medium |
| Internal links | Navigation and footer only; "Discover Us" points to `#slide`, one "Go to Contact" has `href="#"`; the LinkedIn icon has no URL at all | Medium |
| Indexing hygiene | Default "Hello world!" post still published (noindex) with comments open; internal search pages indexable | Low |
| Brand SERP | "Flight Hour Solution" results are dominated by Airbus "Flight Hour Services (FHS)"; no Google Business Profile or knowledge panel observed | Medium |
| International | No hreflang, no German version despite a German-speaking home market | Medium |
| Freshness | Services/About/Career last edited 3 December 2024; only phone number and copyright year changed since | Medium |

## 3. HTML validity (W3C Nu validator, homepage)

| Type | Count | Main causes |
|---|---|---|
| Errors | 16 | Duplicate IDs (the same Elementor form is embedded twice per page: `form-field-name`, `form-field-email`… ; SVG `Layer_1` ×4; `offer-box` ×2), three `<a>` elements without `href`, `aria-required` on elements that already have `required` |
| Warnings | 22 | Redundant ARIA, heading and section structure |
| Info | 70 | Trailing slashes on void elements |

Full output: `data/w3c-validator-home.json`.

## 4. Accessibility (static review; automated axe results in §6)
- Empty `alt` on all images, including the logo (the site's name is never announced to screen readers in the header).
- Links without accessible names (social icons), buttons rendered as icon-only arrows in service cards.
- Form fields use placeholders instead of visible labels; the consent checkbox text links to the privacy policy but the checkbox itself has no label association.
- Body text colour `#494D84` on white is about 5.9:1 (AA pass, AAA fail); light-grey secondary text and orange-on-white button text (`#EE7203` on white ≈ 3.0:1) fail AA for normal text.
- Heading structure carries no hierarchy (no H1, no H3s), which defeats heading navigation.
- The skip link exists but reads "Przejdź do treści".
- Full-page mobile menu is a JavaScript hamburger with a very large icon; focus handling not verified.

## 5. UX and content observations
- One generic conversion path: every CTA leads to the same six-field form or a phone number; the form appears twice on every page (footer and popup/inline), which is why IDs are duplicated.
- Three phone numbers are in circulation; the header "Call us now" dials +41 76 418 63 50 while the hero shows +41 76 595 88 61.
- "Our Office / Meet Us Here" heading on the Contact page has no map, address details or hours beneath it.
- No named people, photos, logos, numbers, certifications, memberships or news anywhere, although ISO 9001, ASA and Swiss Aerospace Cluster credentials exist (01 §5).
- The services taxonomy is strong but presented as unformatted bullet columns without explanations, pricing logic or examples.
- Hero: a large cut-out engine render pushes the headline below the fold on a 1440 × 900 viewport; the headline itself ("Welcome to Flight Hour Solution") says nothing about the offer.
- Duplicate "Stay in Touch" blocks and repeated paragraphs (Home = About) make the pages feel padded.
- The cookie banner appears on every first visit although no analytics cookies are set; the banner's "Customize" dialog lists generic categories.
- Career page has no vacancies and no application form.

## 6. Measured performance and accessibility (headless Chromium)

### 6a. Measured in headless Chromium (Playwright 1.56, Chromium 141), served from a byte-exact local mirror of the live site

The live host serves JavaScript bot-challenge pages to automated browsers after a few dozen requests, which made repeated live measurement unreliable (itself a finding: see §1). Page weight and DOM figures below come from the mirrored assets, so they equal what a first-time visitor downloads (uncompressed, before HTTP compression). Timing was sampled live with curl (below).

| Page | Viewport | Requests | Transfer (KB, uncompressed) | of which images | CSS | JS | DOM nodes | Page height (px) | Horizontal overflow | H1 | Images without alt | Links without a name | Text < 12 px | Tap targets < 24 px |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| home | desktop | 55 | 2777 | 1234 | 284 | 448 | 835 | 5892 | no | 0 | 9/11 | 1 | 4 | 3 |
| services | desktop | 50 | 2078 | 545 | 278 | 448 | 979 | 4951 | no | 0 | 3/5 | 1 | 2 | 3 |
| about-us | desktop | 51 | 1787 | 321 | 239 | 448 | 615 | 3450 | no | 0 | 4/6 | 1 | 2 | 3 |
| career | desktop | 50 | 1722 | 311 | 223 | 448 | 498 | 2112 | no | 0 | 1/3 | 1 | 2 | 3 |
| contact | desktop | 106 | 3626 | 285 | 254 | 448 | 957 | 2674 | no | 0 | 79/85 | 1 | 7 | 6 |
| privacy-policy | desktop | 48 | 1590 | 13 | 320 | 448 | 885 | 5642 | no | 0 | 1/3 | 1 | 2 | 5 |
| home | mobile | 51 | 2017 | 1043 | 284 | 448 | 835 | 7066 | no | 0 | 9/11 | 1 | 4 | 8 |
| services | mobile | 48 | 1509 | 545 | 278 | 448 | 979 | 5957 | no | 0 | 3/5 | 1 | 2 | 7 |
| about-us | mobile | 49 | 1219 | 321 | 239 | 448 | 615 | 3900 | no | 0 | 4/6 | 1 | 2 | 7 |
| career | mobile | 48 | 1153 | 311 | 223 | 448 | 498 | 1378 | no | 0 | 1/3 | 1 | 2 | 7 |
| contact | mobile | 79 | 2823 | 285 | 254 | 448 | 846 | 2453 | no | 0 | 57/63 | 1 | 6 | 10 |
| privacy-policy | mobile | 46 | 1021 | 13 | 320 | 448 | 885 | 10657 | no | 0 | 1/3 | 1 | 2 | 9 |

**Live timing samples (curl, from the session's European egress):**

```
Homepage document, three requests 6 s apart, default headers (no compression negotiated):
  #1 HTTP 200, 179,029 B, TTFB 2.47 s, total 2.82 s
  #2 HTTP 200, 179,029 B, TTFB 0.99 s, total 1.21 s
  #3 HTTP 200, 179,029 B, TTFB 1.17 s, total 1.39 s
compressed: http=200 bytes=39796 ttfb=0.968411s total=1.074207s
```

**Fonts actually loaded (home, desktop):** Nunito 400 normal, Nunito 500 normal, Nunito 600 normal, Nunito 700 normal

**Most used text colours (home, desktop, computed):** rgb(255, 255, 255), rgb(28, 32, 92), rgb(73, 77, 132), rgb(238, 114, 3), rgb(33, 33, 33), rgb(24, 99, 220), rgb(0, 128, 0)

**Largest background colours by area (home, desktop):** rgb(255, 255, 255), rgb(28, 32, 92), rgba(196, 196, 196, 0), rgb(245, 245, 245), rgba(238, 114, 3, 0.87), rgba(238, 114, 3, 0), rgb(238, 114, 3), rgb(24, 99, 220)

**Font sizes/weights most used (home):** 16px/400, 14px/400, 18px/700, 24px/700, 27px/400, 16px/700, 18px/600, 24px/600, 15px/400, 21px/400

**Buttons/CTAs found (home):** Customise, Reject All, Accept All, Call us now, Discover Us, Go to Contact, Read More, Read more About Us, Contact Us, About Us, Submit

**First heading position (home, desktop):** 295 px from the top (viewport height 900 px), heading text "Welcome to Flight Hour Solution"

**Images delivered at more than twice their displayed size:**

- home-desktop: AdobeStock_21354821-1-1024x679.webp 800×530 shown at 337×490
- home-desktop: AdobeStock_271291361-2-1024x576.webp 800×450 shown at 337×490
- home-desktop: Bundeswehreinsatz-in-Niger-beendet-1024x647.webp 800×505 shown at 337×490
- home-mobile: 01_Flight-Hour-Solution_podstawowe.svg 300×70 shown at 140×33
- services-mobile: 01_Flight-Hour-Solution_podstawowe.svg 300×70 shown at 140×33
- services-mobile: Mask-group-1.svg 921×420 shown at 370×169
- about-us-mobile: 01_Flight-Hour-Solution_podstawowe.svg 300×70 shown at 140×33
- about-us-mobile: Mask-group-1.svg 921×420 shown at 370×169
- career-mobile: 01_Flight-Hour-Solution_podstawowe.svg 300×70 shown at 140×33
- contact-mobile: 01_Flight-Hour-Solution_podstawowe.svg 300×70 shown at 140×33
- privacy-policy-mobile: 01_Flight-Hour-Solution_podstawowe.svg 300×70 shown at 140×33

**Automated accessibility violations (axe-core 4.10, desktop, all six pages, aggregated):**

| Rule | Impact | Pages | Elements | Example |
|---|---|---|---|---|
| `aria-allowed-attr` — Elements must only use supported ARIA attributes | critical | 1 | 21 | `<p aria-level="2"><b><span data-contrast="none">Interpretation and Definitions</span></b><span data-ccp-props=` |
| `color-contrast` — Elements must meet minimum color contrast ratio thresholds | serious | 6 | 35 | `<span class="elementor-button-text">Call us now</span>` |
| `link-name` — Links must have discernible text | serious | 6 | 6 | `<a href="https://flighthoursolution.com/"> 							<img fetchpriority="high" width="668" height="157" src="http` |
| `region` — All page content should be contained by landmarks | moderate | 6 | 102 | `<div class="elementor-element elementor-element-f69dd49 elementor-widget elementor-widget-button" data-id="f69` |
| `page-has-heading-one` — Page should contain a level-one heading | moderate | 6 | 6 | `<html lang="pl-PL">` |

**Console errors/warnings (deduplicated):** the 404 and ChunkLoadError entries are artefacts of the mirror (Elementor loads some JavaScript chunks lazily and they were not part of the mirrored asset list); the Mixed Content warnings are real, see the row added to §1.

- error: Failed to load resource: the server responded with a status of 404 (Not Found) (×56)
- pageerror: ChunkLoadError: Loading chunk 334 failed.
(error: https://flighthoursolution.com/wp-content/plugins/elementor (×8)
- error: Failed to load resource: net::ERR_FAILED (×4)
- warning: Mixed Content: The page at 'https://flighthoursolution.com/' was loaded over HTTPS, but requested an insecure e (×4)
- warning: Mixed Content: The page at 'https://flighthoursolution.com/services/' was loaded over HTTPS, but requested an i (×4)
- warning: Mixed Content: The page at 'https://flighthoursolution.com/about-us/' was loaded over HTTPS, but requested an i (×4)
- warning: Mixed Content: The page at 'https://flighthoursolution.com/career/' was loaded over HTTPS, but requested an ins (×4)
- warning: Mixed Content: The page at 'https://flighthoursolution.com/contact/' was loaded over HTTPS, but requested an in (×4)

Assets referenced by the pages but not resolvable in the mirror (fetched live by real visitors): 7 — e.g. /wp-content/plugins/cookie-law-info/lite/frontend/images/close.svg, /wp-content/plugins/cookie-law-info/lite/frontend/images/revisit.svg, /wp-content/plugins/elementor-pro/assets/js/form.a8f0864f4b4fda696ad1.bundle.min.js, /wp-content/plugins/elementor-pro/assets/js/nav-menu.7e665d03657d48aef483.bundle.min.js, /wp-content/plugins/elementor-pro/assets/js/popup.f7b15b2ca565b152bf98.bundle.min.js, /wp-content/plugins/elementor/assets/js/text-editor.2c35aafbe5bf0e127950.bundle.min.js


Screenshots of every page (desktop 1440 px and iPhone 13 emulation) are in `assets/screenshots/`; raw metrics in `data/playwright-results-mirror.json`.

## 7. Privacy, legal and licensing
- Privacy policy: TermsFeed template dated 22 November 2024, "Country refers to: Poland", references user accounts, purchases and push notifications that do not exist, names no legal entity, no controller address, no processors, no Swiss FADP rights; contact privacy@flighthoursolution.com.
- No Impressum (legal notice) with company name, UID, address and managing director: expected for a Swiss commercial site and required for EU visitors' trust.
- Google Fonts loaded from Google servers without consent (a known FADP/GDPR issue).
- Consent checkbox wording refers to "the data protection statement" but the policy does not match the form's processing.
- Image rights: two Adobe Stock preview files (`1000_F_…jpg`, comp naming) and a press photo named after a German news headline ("Bundeswehreinsatz in Niger beendet") are in the media library; licences must be confirmed or the images removed (03 §5).

## 8. Content operations
- One WordPress user ("admin") created everything; no editorial workflow, no staging, no backups visible.
- Elementor Pro and JetElements are commercial plugins whose licence status is unknown; unlicensed builders stop receiving updates.
- The Polish agency footprint (locale, hosting, file names) suggests the site was built by a Polish freelancer or agency and handed over without localisation clean-up. No agency credit is present in the HTML.

## 9. Severity-ranked issue list

| # | Severity | Issue | Fix in the rebuild |
|---|---|---|---|
| 1 | Critical | Wrong site language (pl-PL) and Polish UI strings | English site with correct `lang`, hreflang for German later |
| 2 | Critical | Template privacy policy naming Poland; no Impressum | FADP/GDPR notice, Impressum, cookie notice |
| 3 | Critical | Zero proof (team, credentials, cases) | Content programme (07 §7) |
| 4 | High | No H1s, empty alts, unlabeled forms, duplicate IDs | Semantic templates, accessibility budget (WCAG 2.2 AA) |
| 5 | High | Bot-challenge host serving challenge pages and resets to crawlers; no security headers; mixed content from the cookie plugin; plugins two years old | New hosting, static build, headers, no page builder |
| 6 | High | Email spoofable (no DKIM, DMARC none) | Business mail with DKIM and DMARC quarantine/reject |
| 7 | High | Google Fonts from Google; 825 KB PNGs; 18 font styles | Self-hosted fonts, AVIF/WebP, performance budget |
| 8 | High | Unlicensed/press imagery | New photo set, licence register |
| 9 | Medium | Three phone numbers, broken LinkedIn link, `href="#"` CTAs | Single NAP, verified links |
| 10 | Medium | Missing Organization schema; brand SERP collision | Schema, Google Business Profile, citations |
| 11 | Medium | Thin services presentation; no engine-family or industry pages | IA in 07 §4 |
| 12 | Low | Default post, username disclosure, xmlrpc enabled | Not applicable on a static site; otherwise harden |
