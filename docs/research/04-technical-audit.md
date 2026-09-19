# 04 · Technical, SEO, accessibility and UX audit of the current site

Audited 19 September 2026 with curl, the WordPress REST API, DNS-over-HTTPS, RIPE RDAP, crt.sh, the Wayback Machine, the W3C Nu validator and headless Chromium (Playwright with axe-core). Google PageSpeed Insights could not be used (the public API quota for the day was exhausted), so performance was measured in Chromium instead (§6). Raw data is in `data/`.

## 1. Stack, hosting and infrastructure

| Item | Finding |
|---|---|
| CMS | WordPress 6.7.8 (generator meta). Theme Hello Elementor 3.1.1 with a child theme "hello-theme-child-master" 2.0.0 |
| Page builder | Elementor 3.25.8 and Elementor Pro 3.25.2 (both late-2024 builds; the site has not had its plugins updated since launch, only WordPress core point releases). JetElements 2.7.1.1 (Crocoblock) is also loaded |
| SEO / consent | Yoast SEO 24.0; Cookie Law Info / CookieYes 3.2.8 ("We value your privacy" banner) |
| Fonts | Nunito from fonts.googleapis.com, all 18 weights/styles requested, `latin-ext` subset (external Google request on every visit: a Swiss FADP / EU GDPR concern) |
| Analytics / tags | No Google Analytics, Tag Manager, Meta pixel, LinkedIn Insight tag or heat-mapping script found in the HTML. The company therefore has no traffic data, which is also why Chrome UX Report field data is unavailable |
| Hosting | Shared hosting at zenbox.pl (Cyber_Folks S.A., Poland), server `s32.zenbox.pl`, IP 2.57.139.23 (RIPE range PL-ZENBOX-NETWORK), LiteSpeed; an openresty edge in front serves a JavaScript bot-challenge page ("Please wait while your request is being verified…") under moderate request rates, including to headless browsers and to sitemap/CSS requests |
| DNS | Nameservers ns1/ns2.zenbox.pl; A 2.57.139.23; no AAAA (no IPv6); no CAA record |
| Email | MX mx1/mx2/mx3.zenbox.pl; SPF `v=spf1 a mx include:_spf.zenbox.pl -all`; DMARC `v=DMARC1; p=none; sp=none`; no DKIM record under common selectors. Mail is therefore spoofable and deliverability is unmonitored |
| TLS | Let's Encrypt certificates renewed roughly every 60 days since 3 December 2024 (22 certificates logged), covering the apex and www. Grade of the TLS configuration could not be tested through the session proxy |
| Redirects | `http://` → `https://` 301; `www` → apex 301 (issued by WordPress). Correct |
| Security headers | None: no Strict-Transport-Security, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy or Permissions-Policy |
| Exposure | `/wp-json/wp/v2/users` lists the account "admin" (username disclosure); `xmlrpc.php` is enabled; `/license.txt` and plugin `readme.txt` files are readable (version disclosure); `?author=1` redirects to the homepage (enumeration mitigated); `wp-cron.php` is publicly triggerable; `/readme.html` and `/wp-login.php` were blocked by the host's WAF during testing |
| Search Console | A `google-site-verification` TXT record exists, so the property has been verified in Google Search Console at some point |
| Crawl budget | Yoast `sitemap_index.xml` → `page-sitemap.xml` with 6 URLs (the index request itself was answered with a bot-challenge page once during testing); `robots.txt` allows everything |

## 2. SEO findings

| Area | Finding | Severity |
|---|---|---|
| Language | `<html lang="pl-PL">`, `og:locale pl_PL`, breadcrumb schema "Strona główna", RSS feed titles and search-results title in Polish, skip link "Przejdź do treści" | High (wrong language signal to search engines and assistive tech) |
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
See §6a below (appended after the measurement run).

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
| 5 | High | Bot-challenge host serving challenge pages to crawlers; no security headers; plugins two years old | New hosting, static build, headers, no page builder |
| 6 | High | Email spoofable (no DKIM, DMARC none) | Business mail with DKIM and DMARC quarantine/reject |
| 7 | High | Google Fonts from Google; 825 KB PNGs; 18 font styles | Self-hosted fonts, AVIF/WebP, performance budget |
| 8 | High | Unlicensed/press imagery | New photo set, licence register |
| 9 | Medium | Three phone numbers, broken LinkedIn link, `href="#"` CTAs | Single NAP, verified links |
| 10 | Medium | Missing Organization schema; brand SERP collision | Schema, Google Business Profile, citations |
| 11 | Medium | Thin services presentation; no engine-family or industry pages | IA in 07 §4 |
| 12 | Low | Default post, username disclosure, xmlrpc enabled | Not applicable on a static site; otherwise harden |
