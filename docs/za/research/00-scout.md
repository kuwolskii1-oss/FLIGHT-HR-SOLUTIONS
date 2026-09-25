# Scout: reference sites for the FHS South Africa build

Date: 25 September 2026. Scout for Agents 1 and 2 (research and critic). Brief: docs/za/brief-fhs-south-africa.html. Principles and limits: docs/za/build-prompt.txt.

## How each candidate was checked

Every candidate was fetched with the configured proxy and a desktop user agent. Thirteen of fourteen returned HTTP 200 and their home page HTML was read for navigation labels, headings, contact routes and motion libraries. Chapman Freeborn was refused at the proxy (502 on CONNECT), so it could not be checked.

Screenshots are not in docs/za/research/shots/ yet. Playwright's Chromium does not trust the proxy's re-signed certificates (net::ERR_CERT_AUTHORITY_INVALID on every site), and the two ways to fix that (importing the CA into the browser trust store, or letting Node fetch pages for the browser) were blocked by the session's permission policy as changes to TLS trust. Nothing was changed. The analysts need one of these before they can capture shots: (a) a permission rule allowing `certutil -A` against the NSS store with the CA from /root/.ccr/ca-bundle.crt, or (b) the same rule the earlier Locomotive research used in this repo (docs/research/data/locomotive/tools/dna.js opened contexts with ignoreHTTPSErrors, which the proxy README forbids). The user should choose.

## The seven picks

| Key | URL | Role | Loads | Why it is in |
|---|---|---|---|---|
| willis | https://www.willislease.com/ (redirects to wlfc.global) | Engine lessor and services | Yes | Closest business match: home page routes by business area (Lease, Services, Financing), "Get AOG Support" is a standing urgent action, and "Keeping you Airborne" is the same promise as "Keeps you flying". Reveals use IntersectionObserver, nothing exotic. |
| lht | https://www.lufthansa-technik.com/ | MRO group | Yes | Best trust pattern: "Find your service contact" and an AOG Material Desk sit at the top, followed by a proof band (customers, aircraft under contract) and regional contact routing. Lightest page of the set at about 36 KB of HTML. |
| acs | https://www.aircharterservice.com/ | Charter broker | Yes | The only charter broker reachable, and a good one: routes Private, Group, Cargo and Urgent "Go Now" in the first screen, shows a four stage process, 24/7 quote line and a WhatsApp link, which is exactly the charter door in the brief. |
| ajw | https://www.ajw-group.com/ | Parts and component support | Yes | Parts door reference: AOG desk 24/7/365 as a persistent action, "Buy parts online", region routing that includes Africa, group divisions as doors. Heavier and busier than it should be, which is useful for the critic to score against. |
| iba | https://www.iba.aero/ | Aviation advisory and data | Yes | Adviser reference: a short home page that routes by segment (finance, lessors, operators) under one line, proof through insight content, restrained IntersectionObserver reveals. Fits the Advisory door and the "conversation starter" form. |
| gea | https://www.geaerospace.com/ | Aerospace brand, motion and layout reference | Yes | One of the two motion references: GSAP ScrollTrigger scroll choreography on an engine brand, with per engine support contacts in the menu. Study its reveal timing and how text stays readable, not its film hero. |
| joby | https://www.jobyaviation.com/ | Award listed aviation site, motion reference | Yes | Second motion reference: Next.js site with clear visitor type routing (Investors, Experience, Technology, Company) and a light home page for an award site. Study its type scale and section rhythm. |

Quota check: engine lessor or MRO (willis, lht), charter broker (acs), parts distributor (ajw), aviation adviser (iba), aerospace brands as motion references only (gea, joby, two of a maximum of two).

## Rejected

| Key | Why |
|---|---|
| chapman | Refused at the egress proxy (CONNECT 502), so it could not be checked. Retry if the proxy policy changes; it would otherwise be a fair second charter reference. |
| mtu | Loads, but the maintenance home page is 520 KB with a navigation of thirty plus subsidiaries and a fourteen item engine portfolio list. It is the opposite of obvious navigation and would push the analysts towards a catalogue. Framer based, heavy. |
| satair | Loads, but the home page is a thin storefront over a Nuxt bundle of 334 KB, with three headings and an AOG banner. AJW covers the parts door with more to learn from. |
| acumen | Loads, but uses the generic AOS reveal library and a mega menu of about thirty links. IBA is the stronger adviser reference for a ten second read. |
| vistajet | Loads, premium and well made, but it is consumer luxury with an autoplay film hero and a membership funnel. Wrong audience for FHS and against the brief's data cost rule. ACS covers charter. |
| rr | Loads, but it is a Sitecore corporate portal (annual report, suppliers, country sites) with no clear motion system to study. GE Aerospace fills the engine brand slot. |
| boom | Loads, but the home page is a careers and news page for a manufacturer with a video hero and no visitor routing. Joby is the better award listed motion reference. |

## Notes for the analysts

- Prefer the desktop and 375 px views of each pick; the brief is mobile first and most South African traffic is on phones.
- For every pick record: nav model, home section order, type scale, motion (durations, easing, reduced motion), image treatment, and the one sentence on why it is understood in ten seconds.
- Study systems, not surfaces. No copy, assets or identifiable layouts are to be taken (build prompt, section 9).
