# Flight Hour Solution GmbH — Competitor & Design-Inspiration Benchmark

Prepared: 2026-09-19. Method: WebFetch (HTML-to-text extraction, no rendered screenshots) plus WebSearch; 40 fetches/searches in total. Because pages were read as extracted text, colour/typography notes are limited to what the HTML/CSS exposed; where nothing was visible the entry says "not shown". Four sites blocked or failed automated fetching (Alton 403, BeauTech 403, Jet Engine Management returned an empty body twice, swic.aero 503 once then succeeded); their entries are built from search snippets and are marked "provisional".

Nothing below is invented: every verbatim quote and number was visible on the page or in the search result cited in Section 6.

---

## 0. Baseline: Flight Hour Solution today (https://flighthoursolution.com)

| Item | Finding |
|---|---|
| HQ | "Bahnhofplatz, 6300 Zug, Switzerland" (legal-entity name / UID not shown) |
| Founded | 2024 |
| Positioning (verbatim) | "Tailored consulting for aviation industry, business and more"; "Your Partner for optimized engines management" |
| Navigation | Services (What We Offer, Capabilities, Military & Government Programs), About Us, Career, Contact |
| Target clients | Airlines, leasing businesses, MROs, engine manufacturers, aviation-related businesses |
| Proof points | "more than 40 years experience in engineering, operation, supply chain"; "seasoned aviation professionals with decades of experience". Named people: not shown. Logos, case studies, certifications, statistics: not shown |
| CTAs / lead capture | Form: First Name, Last Name, Company Name (optional), Phone, Email, Message. Phones +41 76 418 63 50 / +41 76 595 88 61. Email contact@flighthoursolution.com. WhatsApp link. Calendar booking, newsletter, downloads: not shown |
| Content assets | Careers page linked. Blog/insights, whitepapers, glossary: not shown |
| Design | WordPress (/wp-content/). Light theme, stock aviation photography + vector graphics, hero + service cards + about section, slider. A Polish skip-link string ("Przejdź do treści") is left in the template — a localisation bug visible to screen readers and crawlers |
| Languages | English (with the stray Polish string) |
| Gaps | No named team, no credentials, no logos/testimonials/case studies, no numbers, no certifications, no insights, no calendar booking, no newsletter, thin service detail, generic tagline ("aviation industry, business and more" dilutes the engine focus), brand name collides with Airbus "Flight Hour Services (FHS)" in search |

---

## 1. Site-by-site benchmark

Classification key: **Direct** = independent engine/technical consultancy selling shop-visit management or engine advisory; **Adjacent** = lessor/trader/MRO/marketplace/strategy house with overlapping pages; **Benchmark** = large brand, design reference only.

### 1.1 TGIS Aviation — Direct (closest analogue)
- URLs: https://www.tgis.aero/ ; https://www.tgis.aero/services/ ; https://tgis.aero/services/engine-management-services/ (the requested /engine-management-consultancy/ URL returns 404)
- HQ: Cubo Pride Park, 1 Pride Place, Pride Park, Derby, DE24 8QR, UK
- Founded: 2002
- Positioning (verbatim): "Know Your Engines. Control Your Costs. Focus Where It Matters."
- Service taxonomy (exact headings): Engine Management Services · Expert Witness · Off-Wing Engine CAMO Services · Optima – Engine Fleet Optimisation Service · Aircraft Management Services · Continuing Airworthiness Management Services (CAMO). Engine page is segmented by buyer situation: "If you're buying or leasing engines" ("Time Kills Deals": Engine Selection, Contract Negotiation, Pre Purchase Inspections, Lease Review & Negotiation, Delivery Acceptance, BSI Reviews) · "If you're selling your engines" ("You Want to Get the Best Price": Records Packs Production, Off Wing Engine CAMO, Shop Visit Management, Engine Valuations, Transition Management, BSI Reviews, Redelivery planning & Management) · "Shop Visit Management" ("Maximise Your Cost Savings, Reduce Your Risk": Workscope Production / Review, Attending strip inspections, Review Back to Birth records, Invoice reconciliation against workscope, Warranty Management, Spare Engine Solutions, MRO Contract Negotiations, Managing tenders and proposals) · "Maintaining your Engines" ("Your Assets, Our Experience": Outsourced Powerplant CAMO Support, Engine Fleet Financial Cost Modelling, Mid-Term Audits, Technical Records Support, Maintenance Management, Ad-Hoc Support). "Why choose" pillars: Industry Expertise and Instinct · Proactive Risk Management · Commercially Minded Technical Support · Controlled Environment with CAMO Assurance
- Target clients (verbatim): Start-up Airlines · Expanding Airlines · Airlines Exiting OEM Support · Leasing Companies & Asset Managers; on the engine page: "Start-up airlines with minimal technical resources", "Established carriers with constrained internal technical teams", "Airlines nearing end of OEM engine support contracts", "Asset managers and lessors with mid-to-end-of-life engine portfolios"
- Proof points: client logos British Airways, SMBC Aviation Capital, Etihad, Avolon, World Star Aviation, Spectre Air Capital; 9 case studies (Minsheng Financial Leasing, Etihad Airways with "$100M in identified cost avoidance", 737 MAX 8 redelivery, CargoLogicAir, A320 repossession, etc.); named person Trish Gray (Expert Witness); certifications "CAA CAMO Approved" (2024), "Cyber Essentials Certified", "ISTAT Members"; "over 40 years in the industry"
- CTAs / lead capture: "Speak to an expert", "Let's Discuss Your Project", "Contact Us", "Stay Updated"; contact form; phone +44 (0) 1335 630030; info@tgis.aero; newsletter with role selector (Lessor / Airline / MRO / Job Opportunities). WhatsApp, calendar booking, gated downloads: not shown
- Content assets: Case Studies (9), Latest News (2 visible articles), Events, Sponsored Webinars, FAQ section on the engine page, Careers, The Team
- Design: white background, dark navy/charcoal text, green accent icon set (SVG), sticky header, 3-column feature cards, client logo carousel, circular engine-lifecycle diagram, full-width case-study cards, lazy-loaded placeholders (#cfd4db), FAQ accordion. Light theme
- Languages: English only
- Notable UX: situational segmentation of one service into four buyer journeys; role-based newsletter; certification badges in footer
- Weaknesses: only 2 news posts, no downloadable resources or calculators, no glossary, no multilingual, team page thin apart from one named expert

### 1.2 SGI Aviation — Direct
- URLs: https://www.sgiaviation.com/ ; https://www.sgiaviation.com/lessors-engine-services/ (operators page: /operators-engine-services/)
- HQ: Amsterdam, Netherlands (+31 20 880 4222); "global network" claimed, other offices not listed
- Founded: not shown
- Positioning (verbatim): "Driven by a team of aircraft passionate experts, SGI provides industry-best Services."; "SGI Aviation believes in utilizing its knowledge and expertise contributing to Efficient and Safe aviation in a connected world"
- Service taxonomy: four pillars Aircraft Management | Engine Services | Regulatory Services | IT Services, each split Operators vs Owners. Engine Services (Owners): Asset Analysis · Aircraft Valuation · Engine Management · Contract Negotiations · Engine Inspections · Shop Visit Management · Engine Storage. Engine Services (Operators): Engine Fleet Management · Shop Visit Management · Negotiation Support
- Target clients (verbatim): "Lessors and financiers, airlines, corporate aircraft owners, aircraft manufacturers and MROs, aviation authorities and regulators"
- Proof points: 2023 activity band — "65 redeliveries, 75 Engine Re/deliveries, 45 engine shop visit management, 105 Aircraft and engine pre-purchase inspections, Asset-managed aircraft and engines 60+, 30 lease reviews and 250 cash flow analysis and valuations. Delivered over 12.000 mandays."; shop-visit copy: "SGI can achieve overall cost savings of up to 10%". Named team, logos, certifications: not shown
- CTAs: email info@sgiaviation.com, phone only. No form, newsletter, booking or downloads
- Content assets: News (4 posts, undated), People page, Careers link
- Design: blue/white corporate palette (inferred from logo), icon-led service categories (management/engine/law/IT icons), no photography on the engine page, modular cards. Light theme
- Languages: English
- Notable UX: dual navigation for Owners vs Operators
- Weaknesses: no people bios despite "People" page, no lead capture beyond email, undated news, no certifications, dated feel

### 1.3 mba Aviation — Adjacent (advisory house with a technical practice)
- URLs: https://www.mba.aero/ ; https://www.mba.aero/service/technical/
- HQ: not shown on fetched pages
- Founded: "Since its founding in 1992"
- Positioning (verbatim): "From Asset Valuation to Asset Management and Aviation Safety, we are a World Leader in Aviation Advisory Services"; product line "Aircraft Valuation Simplified™" (REDBOOK)
- Service taxonomy: Asset Valuations · Airline & Airport Services · Asset Management – FleetWatch · Technical · Forecasting & Modeling · Aviation Safety; Digital Products REDBOOK, AERO, JumpseatSMS. Technical page: Pre-Purchase Aircraft Inspection & Technical Records Survey · Heavy Maintenance Management & Oversight · End of Lease Project Management and Aircraft Redelivery · Aircraft Storage Maintenance · Aircraft Repossession · Engine Shop Visit Management ("For individual aircraft owners and small lessors, mba provides oversight and management of engine shop visits, especially where an engine has been removed due to an unplanned event, and damage has occurred." — bullets: "Development / verification of off-wing workscope", "Table inspection subsequent to engine teardown, and reporting to the asset owner", insurance-claim liaison, AD/SB workscope updates)
- Target clients (verbatim): "investment banks, airlines, lessors, and government agencies worldwide"
- Proof points: leadership team page exists (names not on homepage); "24 year old eFAV product". Logos, case studies, certifications: not shown
- CTAs: "Free Trial", "Request A Demo", "Contact Us", "Login". Phone, form fields, booking, newsletter: not shown
- Content assets: 12 recent "Aviation Insights" articles, Events, Press Releases, REDBOOK mobile apps, Career Center
- Design: navy header, light body, insights carousel with Previous/Next, consistent article thumbnail template, cookie manager
- Languages: English, Spanish, Japanese, Korean via Google Translate widget
- Notable UX: multi-tier dropdowns, app-store badges, social links (X, Vimeo, LinkedIn)
- Weaknesses: technical page is text-only with two spot images, no numbers, no named engineers, engine offer framed as a niche add-on for "small lessors"

### 1.4 Willis Asset Management (WAML) — Direct (lessor-owned)
- URLs: https://www.willisasset.com/ ; https://www.willisasset.com/waml-engine-technical
- HQ: not shown; world map with regional Sales Directors (Americas, EMEA, APAC)
- Founded: "launched as TES Aviation in 1995; acquired by Willis Lease Finance Corporation in 2016; acquired by Willis Mitsui & Co. Engine Support Limited in 2025"
- Positioning (verbatim): "Your Trusted Partner for Asset Management"; "Decades of proven expertise, now strengthened for the future"
- Service taxonomy: Engine Technical & Consultancy Services · Aircraft Technical & Consultancy Services · Airworthiness Management (CAMO) · Quality & Regulatory Services. Engine page groups: Custom Fleet & Portfolio Programs (Lessor & Airline Portfolio Support Programs, MRO Support Programs, Fleet ECM / EHM Monitoring Program, Technical Publication Support Programs, Investor Portfolio Monitoring Programs) · Customized Fleet Management (Fleet Planning Optimization, Maintenance Cost Forecasting, Exit Strategy Modeling and Optimization, Maintenance Reserve Calculations / Reserve Claim Analysis) · Contract Negotiations (Power by the Hour Programs Assessment / Negotiation Support, Engine Overhaul & Repair Contract Negotiation, Engine Purchase / Sale Negotiation Support / Remarketing Advice, Lease Contract Negotiation Support) · Asset Appraisals (Engine Evaluation & Selection, Engine Valuations (ISTAT Appraiser Certified), Part-out Valuations) · Engine Transition Management (Transitions (Delivery / Redelivery), Pre-purchase Inspections) · Full Shop Visit Support Services (Full Shop Visit Management, Overview Shop Visit Management, Workscope Compilation / Review, Dirty Condition / Table Inspection) · Physical Inspection and Technical Advisory (Physical Inspection, External Engine Component Check & Engine Stand Assessment; Borescope Overview and Video Analysis; QEC / Accessory / Avionics Inventory Check; Engine Test Cell / Test Result Analysis; On-wing Run Overview and Results Analysis; Transportation Inspection) · Records Management and Auditing (Technical Documentation Audit, LLP Back to Birth Trace Audit) · Commercial and Industry Knowledge, Best Practice Advice and Training · Insurance Claims Support / Expert Witness
- Key copy (verbatim): "We can support all aspects of shop visit management on your behalf to control costs, optimize work scopes and interact with the MRO."; "Representation and management during onsite engine hardware condition reviews."; "The usability and value of a Life Limited Part relies on the completeness and validity of its back-to-birth traceability records."
- Target clients: airlines, lessors, financiers, MROs, operators, investors. Logos: ACS, ALM, SalamAir, Air Astana, Allegiant, Icelandair, Macquarie, Airbus
- Proof points: 11 named leaders with titles and photos (Karl Gibson, General Manager / CAMO Accountable Manager; Russell Jones, VP Asset Management Services; Andre Fischer, Chief Digital Officer; Mark Rowlands, Finance Director; Marc Griffiths, Compliance Director; Rachel Barbour, HR Director; Jon Owens / Alan Ashe / Ben Lee, Sales Directors Americas / EMEA / APAC; Ian Fraser, AVP Engine Management; Darragh O'Donoghue, AVP Aircraft Services); counters "30 years history", "1.0M+ man hours delivered", "50+ team members"; "25+ years of industry data"; "over 200 engines" part-out track record; "ISTAT Appraiser Certified"
- CTAs: "Contact Us" only (HubSpot-hosted, ?hsLang=en). Phone, booking, newsletter, downloads: not shown
- Content assets: none visible on homepage (no blog, papers, careers)
- Design: white background, navy navigation, SVG service icons, leadership photo grid, logo carousel, long list-heavy service page. Light theme
- Languages: English
- Weaknesses: exhaustive list reads as a wall of bullets; single CTA; no case studies; parent-lessor ownership limits "independent" claim

### 1.5 Jet Engine Management Ltd (JEM) — Direct (provisional: site returned an empty body to the fetcher twice; data from search snippets)
- URLs: https://jetenginemanagement.com/ ; pages found: /history/, /services/fleet-management/, /consultancy-management/, /our-team/, /dave-carr/, /contact-us/
- HQ: Tec Marina, Penarth (Cardiff area), Wales, UK ("In 2017 JEM opened its new headquarters in Tec Marina, Penarth")
- Founded: 2009 by Simon Mermod
- Positioning (from snippet): "aviation powerplant consultancy support for airlines, lessors and financial institutions in technical, financial and commercial jet engine management"
- Service taxonomy: Fleet Management · Consultancy Management (shop visit management, engine technical appraisals, financial and budgetary planning, lease handover management, borescope overviews, MPA run overviews, engine off-wing and on-wing troubleshooting, maintenance contract negotiations); "dedicated engine shop visit management of off-wing maintenance activity"
- Engine types named: CFM56 series, Rolls-Royce Trent and BR700, IAE V2500, "various GE powerplants"
- Target clients: airlines, lessors, financial institutions, engine owners
- Proof points: "over 80 years of OEM, airline and lessor experience supporting over 30 worldwide airline, lessor and engine owner customers"; named team pages exist (e.g., Dave Carr)
- CTAs, content, design, languages: not shown (page not renderable to the fetcher). The HTML <title> in search reads "Welcome to Jet Engine Management - Jet Engine Mananagement" (typo)
- Weaknesses: site appears JavaScript-dependent or bot-blocked (bad for SEO/AI discovery), typo in title tag, small content footprint

### 1.6 Aeolus Engine Services — Adjacent (CFM56 lessor/trader with technical services)
- URL: https://aeolus-engineservices.com/
- HQ: Unit 2, 2050 Orchard Avenue, Citywest Business Campus, Dublin D24 ER27, Ireland
- Founded: "Established in July 2000"
- Positioning (verbatim): "#1 for CFM56 Engine Leasing – Sales – Asset Management"; "Engine Solutions: Delivered"
- Service taxonomy: Engine Leasing · Engine Sales & Exchanges · Engine Technical Services; nav: Home, About Us (Meet The Team), Engines, Asset Management & Technical Advisory, Careers
- Target clients (verbatim): "passenger and cargo airlines worldwide"; "airlines and commercial aircraft owners"
- Proof points: none visible (no logos, case studies, certifications, numbers); one author name (F. Whelan)
- CTAs: phone +353 1 821 9095, info@aeolus-engineservices.com, AESHARE customer portal login. No form, newsletter, booking
- Content assets: not shown
- Design: standard WordPress template, logo-led, no visible colour system, no animation
- Languages: English
- Vocabulary (verbatim): "on-wing issues", "on-wing life", "unscheduled removals", "shop visit workscoping", "trend monitoring", "troubleshooting", "airworthiness compliance"
- Weaknesses: minimal authority signals, sparse CTAs, dated template

### 1.7 Airsource Partners — Adjacent (expert marketplace, not engine-focused)
- URL: https://www.airsource-partners.com/
- HQ / founded: not shown
- Positioning (verbatim): "AVIATION EXPERTISE MARKETPLACE FOR THE AIR TRANSPORT INDUSTRY"
- Service taxonomy: Network Planning · Airline Strategy · Airline Management · Sales & Marketing · Flight Operations · Airport Operations · Information Technology; nav: Home, Our Approach, Project Board, Aircraft Database, Experts Sign Up, Contact
- Target clients: airlines and airports (dual pathway: airlines vs experts)
- Proof points: none (no team, logos, cases, certifications, network size)
- CTAs: "click here" links, footer contact, LinkedIn/Twitter; PDF presentation download
- Content assets: Project Board (3 sample projects)
- Design: minimal centred layout, blue/teal accents, single aircraft photo, light
- Weaknesses: no engine capability, no trust indicators; relevant only as a model of "network of experts" framing

### 1.8 IBA — Adjacent/Benchmark (data + advisory; technical services practice)
- URLs: https://www.iba.aero/ ; https://www.iba.aero/advisory-services/technical/
- HQ: not shown on fetched pages
- Founded: copyright line "© 2004 - 2026"; founding year not stated
- Positioning (verbatim): "Insights in flight"; "We are the global leader in aviation data, consultancy, and asset management."
- Service taxonomy: Digital Solutions (IBA Insight, Fleets and Values, Airlines, Sustainability, Total Values, Market Reports) · Advisory Services (Asset services: Technical, Remarketing, Asset management; Strategic decisions: Consulting; Valuations; Market Reports) · Industries (Finance, Airlines, Lessors, MROs). Technical page headline: "Technical services: Expert advice and global hands-on support for technical and operational requirements." Services: Operator risk reviews · Technical due diligence · Records review and management · Aircraft delivery and redelivery management · Unscheduled incident inspections · Aircraft and engine storage solutions · Maintenance and inspection programmes · Airworthiness directives and service bulletins · Modification assessments and pricing · Final assembly line inspections · Pre-purchase inspections, mid-lease and damage assessments; categories Aircraft inspections · Cargo conversions · Technical acceptance · Transitions; "MRO Support: Support with MRO selection, negotiation of contracts and evaluation and advice of terms, including MRO visits, reviews and cost benchmarking"
- Proof points: logos JetBlue, BOC Aviation, Barclays, Boeing, HSBC, Virgin, Job Air Technic, TRecs; testimonial carousel with names/titles/companies (e.g., Liam Duffy, VP Asset Management, Abelo; Keith Downey, Head of Investor Relations, AviLease; Fabian van Stralen, Director Aircraft Procurement, AELS); stats band "36m flights tracked annually", "93k aircraft on record", "200+ MSN-level data points", "103m annual updates"; awards "Appraiser of the Year", "Sustainability Technology of the Year", "Data Initiative of the Year 2026"
- CTAs: "Book a demo" (repeated), "Get in touch", "View our on-demand demos", contact form, newsletter "Sign up", login portal, WeChat QR code
- Content assets: articles/news, webinars, podcasts, market reports, events, careers
- Design: light, modular rounded cards, hero with fleet imagery, logo slider repeated 4x, award badge PNGs, tabbed mobile menu with "Back"
- Languages: EN, JA, ZH
- Weaknesses: no dedicated engine page; technical services described generically; no office address on homepage

### 1.9 Alton Aviation Consultancy — Adjacent (management consultancy; provisional — both fetches returned 403, data from search snippets)
- URLs: https://www.altonaviation.com/ ; https://altonaviation.com/mro-aftermarket/ ; /about/ ; /team/ ; /expertise ; /transaction-advisory ; /technology-mobility/
- HQ / offices: New York, Dublin, Dubai, Hong Kong, Beijing, Tokyo, Singapore
- Founded: not shown
- Positioning (page title): "Global Aviation Consulting Firm"
- Service taxonomy (from page titles): MRO & Aftermarket Support (OEM) · Expertise · Investors / Transaction Advisory · Technology / Air Mobility; typical engagements "strategy and business plan development, operational performance improvement, restructuring, and transaction support"
- Target clients: MRO providers ("OEM-affiliated, airline-affiliated players and independents"), airlines, OEMs, parts traders/distributors, investors
- Proof points: named practice lead Jonathan Berger (global MRO & Aftermarket advisory practice); team page; annual press releases on growth (2022, 2023/2024)
- CTAs, content, design, languages: not shown (blocked). Press-release archive exists
- Relevance: strategy/M&A, not hands-on shop-visit management; useful as a model of practice-lead bios and press cadence

### 1.10 BeauTech Power Systems — Adjacent (engine lessor/trader; provisional — both fetches returned 403, data from search snippets)
- URLs: https://beautech.aero/ ; https://beautech.aero/services ; https://beautech.aero/news/ ; https://beautech.aero/table/cfm56-engine/
- HQ: Dallas, Texas, "with offices in key aviation hubs"
- Founded: 2011
- Positioning (page titles): "Engine Leasing"; "Integrated Engine Leasing and Asset Solutions"
- Service taxonomy (from snippets): engine leasing, asset management, aircraft and engine trading; "spare engine cover for AOG events, shop visit gaps, and seasonal capacity across CF34, CFM56, LEAP, and V2500 fleets"
- Target clients: airlines, leasing companies, MRO providers
- Proof points: press releases (JetBlue CF34-10 engine acquisition; twelve CF34-10E from Alliance; four E175 on lease to LOT from Altavair); named authors Igor Tchounkovskii, Ashvin Sivajothi; per-ESN LLP sheet PDFs published; engine-type table pages
- CTAs, design, languages: not shown (blocked). WordPress (wp-content)
- Relevance: not a consultancy; shows how engine-type landing pages and LLP data sheets can work as SEO assets

### 1.11 Iris Aero — Direct (boutique, Middle East)
- URL: https://irisaero.com/
- HQ: Shumeisani, Queen Noor St, Housing Bank Complex, Ground Floor, Office 102, Amman, Jordan
- Founded: not shown
- Positioning (verbatim): "Elevating your aviation assets"
- Service taxonomy: Engine & Aircraft Asset Management (FMV/CMV & LLP analytics; Deal structuring & LOI/SPA support; USM strategies & teardowns) · Technical Services (Records audit & AD/SB compliance; BSI programs & workscope templates; QEC, modules, shipping & stands) · Shop Visit Management (Workscopes & price benchmarking; Slot negotiation & TAT control; 15–20% cost-down target) · Consignments & Trading (Exclusive mandates & remarketing; Margin-protection frameworks; Global buyer access) · Start-up & Fleet Advisory (Route & fleet scenarios; Powerplant selection; Lease/buy analysis) · Compliance & Quality (ASA-100 / ISO 9001 pathways; Export controls & document hygiene; CAME/CAMO alignment)
- Target clients: not explicitly named (implicitly airlines, lessors, traders)
- Proof points: "15–20% cost-down target"; certifications mentioned only as "pathways" (ASA-100, ISO 9001). Team, logos, case studies: not shown
- CTAs: form (Name, Email, File attachment) with reCAPTCHA; phone +962 7 9828 6038; WhatsApp wa.me link; newsletter; personal email m.soub@irisaero.com; "Drop us a line!"
- Content assets: not shown
- Design: video hero (wsimg — GoDaddy Website Builder), modular card grid, light theme, placeholder GIFs in cards
- Languages: English
- Weaknesses: one-person feel, no team page, generic template, certification claims soft ("pathways"), no insights

### 1.12 Switzerland-based players (search: "aviation consulting Switzerland engine…", "aircraft technical advisory Zurich OR Zug OR Geneva…", "Luftfahrt Beratung Triebwerk Schweiz…")

Finding: **no Switzerland-based consultancy dedicated to jet-engine / shop-visit management was found.** The closest Swiss advisors are airframe-, asset- and compliance-oriented. Swiss MROs and software vendors are adjacent but not consultancies.

**Swiss Aviation Consulting (SAC) — closest Swiss adjacent (same canton as FHS)**
- URL: https://swic.aero/ (first fetch 503, second succeeded); CAPA profile https://centreforaviation.com/data/profiles/suppliers/swiss-aviation-consulting
- HQ: Rothusstrasse 23, 6331 Hünenberg/Zug, Switzerland; offices Malaysia, UAE, South Africa; bases São Paulo, Florida
- Founded: 2005
- Positioning (verbatim): "Maximise Value, Mitigate Risk"
- Service taxonomy: Aircraft Life Cycle Management (Asset Management; Risk Management; Sales & Acquisition Support; Repossessions) · Financial Review · Compliance (Authoring; Compliance Management & Auditing) · Corporate Finance. CAPA profile adds Continuing Airworthiness Management (CAMO+), Flight Training, Aviation Expert Opinion, Aviation Investment Management. Engine-specific services: not shown
- Target clients (verbatim): "Financial and Legal Community, Lessors"; "Current/Future Private Aircraft Owners"; "Scheduled, Cargo, Charter Airlines; Business Aviation; Helicopter Operators"; "MRO and FBO providers"
- Proof points: "20 years of experience"; "more than 2'000 audits, inspections and appraisals"; team described as consultants, auditors, engineers, pilots, instructors, financial and legal experts. Named people, logos, cases, certifications: not shown
- CTAs: sales@swic.aero, +41 41 798 2100, "Get a Quote" block. Form, newsletter, booking: not shown
- Design: navy blue with red accents, monochrome black-and-white photography, hero image carousel with parallax, card-based services, light theme, skip-to-content link, LinkedIn in header
- Languages: English only
- Weaknesses: business-aviation-heavy, no engine depth, no team bios/logos/insights

**Swiss Aviation Group AG (SAG) — Swiss adjacent (asset management)**
- URL: https://www.swissaviationgroup.com/aircraft-asset-management
- HQ: "Switzerland | Dubai | Africa" (city not shown)
- Founded: not shown
- Positioning (verbatim): "WORKING SOLUTIONS."; "KEEP YOUR ASSET AT IT'S MAXIMUM VALUE." (sic)
- Service taxonomy: Airline Solutions · AOC Startup · ACMI Wet Lease · AAM (Aircraft Asset Management: Asset Management, Risk Monitoring, Maintenance Supervision, Remarketing, Mid Term Inspections, Test & Ferryflight Services; building blocks Aircraft Inspections, Appraisals, A/C Record Audit, SAG AAM Database, AAM Task Management) · Lease & Purchase. Engine-specific: not shown
- Target clients: airlines, leasing companies, investors, lessors, banks, bondholders, financial institutions; team "previously worked for Original Equipment Manufacturers, aircraft and aero engine lessors as well as airlines"
- Proof points: none quantified; client dashboard/database mentioned
- CTAs: "E-MAIL US" buttons, info@satgroup.ch, contact page. Phone, form fields, newsletter: not shown
- Design: Squarespace, white/navy, aircraft photography, collapsible menus, light theme
- Weaknesses: typo in hero, email-only contact, no proof

**Other Swiss names surfaced (not consultancies — note the distinction):** SR Technics, Zurich (MRO for aircraft, engines, components — a potential partner/client, not a competitor); Jet Aviation Zurich (business-aviation MRO/FBO); Swiss Aviation Software (AMOS — MRO software); MLL Legal and Bird & Bird (aviation finance/leasing law); ZHAW "Firmenliste der Schweizer Luftfahrt" (PDF directory of Swiss aviation firms, useful for prospecting). Non-Swiss firms appearing in the Swiss-city searches: ARTS Group (Germany; "End of Lease and Redelivery support… records audits, airframe and engine inspections, back-to-birth traceability, liaison with lessors or authorities"), ACC Aviation (UK; "aircraft inspections, returns, recovery, transition, maintenance event management, airworthiness assessment and technical due diligence"), Aviation Technical Consultants (location not shown; "Annual Inspections/Mid Lease Inspections, Pre-Purchase Inspections and Lease Return/Delivery Projects").

### 1.13 Design benchmarks (large brands — design reference only, not competitors)

**Airbus Flight Hour Services (FHS)** — https://www.aircraft.airbus.com/en/services/maintain/flight-hour-services-fhs (the /enhance/ path 404s); sub-page https://www.aircraft.airbus.com/en/services/maintain/flight-hour-services/fhs-tsp
- Headline/tagline (verbatim): "Flight Hour Services (FHS)"; "Ensuring your aircraft is always ready to take off"
- Structure: "We keep your aircraft flying" · "Flexible, Contractual Maintenance Solutions" · "Why Choose Airbus Flight Hour Services?" with benefit triad Guaranteed Parts Availability / Cost Predictability / Enhanced Reliability · "Explore our comprehensive FHS service offerings": FHS-Tailored Support Package ("Boost fleet reliability and performance thanks to tailored packages") and FHS-Components ("Benefit from guaranteed parts availability and secure your aircraft technical performance")
- CTA (verbatim): "Contact us today to speak with an expert and get a personalised consultation"
- Design: hero image, two large offer cards, accordion "show more/show less", breadcrumb, multi-column footer, maintenance-technician photography. Stats, customers, downloads: not shown on this page
- Note: brand/SEO collision — "Flight Hour Services (FHS)" vs "Flight Hour Solution". FHS-branded queries are dominated by Airbus.

**Lufthansa Technik AVIATAR** — https://www.aviatar.com/ (the LHT aviation-consulting page at /en/aviation-consulting returned 404 and was not benchmarked)
- Headline (verbatim): "Optimize your Tech Ops"; "AVIATAR is the platform for airline operations, offering a wide range of digital products and services..."
- Structure: About AVIATAR · Digital Tech Ops Ecosystem · Our customers · Join the team · Explore our products (APU & Cabin Temperature Monitoring, Condition Monitoring, Line Maintenance Planning Optimization, MRO Management, Predictive Health Analytics, Reliability Suite, Technical Logbook, "...and more to come")
- CTAs: "LOGIN", "Learn more", "Contact us"
- Design: dark navigation with white logo over a light body, Helvetica-style sans, product interface screenshots, uniform product cards, integration messaging (AMOS, flydocs). Stats and logos: not shown
- Borrowable: product-card grid with identical "Learn more" architecture; screenshots as proof of a data offer

**MTU Maintenance SERVICEPlus / Engine Trend Monitoring** — https://mtu.de/maintenance/commercial-maintenance/serviceplus/engine-trend-monitoring (the /commercial-aircraft-engine-services/ path 404s); product sheet https://www.mtu.de/fileadmin/EN/3_Maintenance/Commercial_Maintenance/Produkdatenblaetter/MTU_Produktblatt_ETM_20210615.pdf
- Headline (verbatim): "Our individual services"; "Excellent support whenever you need it"
- Structure: seven SERVICEPlus offerings — AOG support · ON-SITEPlus services · Digital services (WebETM 3.0, myEFM) · Leasing services · Technical asset management · Parts repair expertise ("Repair beats replacement") · Damage analysis; cross-links to MTUPlus Intelligent Solutions (PERFORMPlus, SAVEPlus, MOVEPlus, VALUEPlus)
- Numbers: "~100 owned engines" leasing pool; "24/7"; "20+ years" damage-analysis experience. ETM snippet: monitors CF34, CF6-80, CFM56, GE90, LEAP, PW2000, V2500; "24/7 analysis by MTU experts, longer and optimized on-wing times and reduced cost of ownership"; "adjust the respective work scopes right down to module level"
- CTAs: "More information - product sheet" (PDF), "Learn more", "Available engines and material", "Sign up for the newsletter"; named contact-person cards (headshot, title, site e.g. "MTU Maintenance Hannover", phone, cell, email, region)
- Design: navy/white, sans-serif, technical product photography, headshots on white, sticky sub-navigation with anchor links, breadcrumb, tabbed responsive comparison tables, embedded YouTube, DE/EN toggle, light theme
- Borrowable: contact-person cards per service; one-page PDF product sheets per service; sticky in-page nav

---

## 2. Comparison table

Design grade is a judgement on structure, proof density and CTA clarity as visible in extracted HTML (A = best-in-class pattern source, D = template with little proof). "prov." = provisional (site not renderable).

| Site | Type | HQ / founded | Positioning (verbatim) | Core services (as headed) | Proof points | CTA style | Grade |
|---|---|---|---|---|---|---|---|
| Flight Hour Solution (today) | — | Zug CH / 2024 | "Your Partner for optimized engines management" | What We Offer · Capabilities · Military & Government Programs | "40 years" claim only | Form + 2 phones + WhatsApp | C- |
| TGIS Aviation | Direct | Derby UK / 2002 | "Know Your Engines. Control Your Costs. Focus Where It Matters." | Engine Management Services · Off-Wing Engine CAMO · Optima fleet optimisation · Expert Witness · CAMO | 6 logos, 9 case studies, "$100M cost avoidance", CAA CAMO, Cyber Essentials, ISTAT | "Speak to an expert", role-segmented newsletter, form, phone | A |
| SGI Aviation | Direct | Amsterdam NL / not shown | "Driven by a team of aircraft passionate experts…" | Engine Services split Owners/Operators: Shop Visit Management, Engine Management, Engine Inspections, Engine Storage… | 2023 activity counters (45 shop visits, 12,000 mandays), "up to 10%" savings | Email + phone only | B- |
| mba Aviation | Adjacent | not shown / 1992 | "…World Leader in Aviation Advisory Services" | Technical: PPI & Records Survey, Heavy Maintenance Oversight, End of Lease & Redelivery, Storage, Repossession, Engine Shop Visit Management | Longevity; insights engine; products; no logos/cases | "Request A Demo", "Contact Us" | B |
| Willis Asset Management | Direct (lessor-owned) | not shown / 1995 (TES) | "Your Trusted Partner for Asset Management" | Engine Technical & Consultancy: Full Shop Visit Support, Physical Inspection & Technical Advisory, Records & LLP audits, Fleet & Portfolio Programs, Contract Negotiations, Appraisals, Transitions | 11 named leaders w/ photos, 8 logos, "30 years / 1.0M+ man hours / 50+ team", ISTAT appraiser | "Contact Us" only | B+ |
| Jet Engine Management Ltd | Direct | Penarth UK / 2009 | "aviation powerplant consultancy support for airlines, lessors and financial institutions…" | Fleet Management · Consultancy Management (shop visit mgmt, appraisals, budgeting, lease handover, BSI, MPA overviews, troubleshooting, contract negotiation) | "80 years" team, "30 customers", named team | not shown (prov.) | C (prov.) |
| Aeolus Engine Services | Adjacent | Dublin IE / 2000 | "#1 for CFM56 Engine Leasing – Sales – Asset Management" | Engine Leasing · Engine Sales & Exchanges · Engine Technical Services | none | Phone/email, portal login | D |
| Airsource Partners | Adjacent | not shown | "AVIATION EXPERTISE MARKETPLACE…" | Airline strategy/ops categories; no engine | none | Links, PDF | D |
| IBA | Adjacent/benchmark | not shown / © 2004 | "Insights in flight"; "global leader in aviation data, consultancy, and asset management" | Technical: due diligence, records, delivery/redelivery mgmt, MRO selection & cost benchmarking, transitions, storage | 8 logos, named testimonials, 4 data counters, 3 awards | "Book a demo" repeated, newsletter, form, WeChat | A |
| Alton Aviation Consultancy | Adjacent | NY/Dublin/Dubai/HK/Beijing/Tokyo/Singapore / not shown | "Global Aviation Consulting Firm" | MRO & Aftermarket · Transaction Advisory · Technology/Air Mobility | practice lead named, press cadence | not shown (prov.) | B (prov.) |
| BeauTech Power Systems | Adjacent | Dallas US / 2011 | "Integrated Engine Leasing and Asset Solutions" | Engine leasing, asset management, trading; CF34/CFM56/LEAP/V2500 | press releases, LLP sheets per ESN | not shown (prov.) | B- (prov.) |
| Iris Aero | Direct (boutique) | Amman JO / not shown | "Elevating your aviation assets" | Engine & Aircraft Asset Mgmt · Technical Services · Shop Visit Management · Consignments & Trading · Start-up & Fleet Advisory · Compliance & Quality | "15–20% cost-down target"; no team/logos | Form w/ file upload, WhatsApp, newsletter | C+ |
| Swiss Aviation Consulting | Swiss adjacent | Hünenberg ZG / 2005 | "Maximise Value, Mitigate Risk" | Aircraft Life Cycle Mgmt · Financial Review · Compliance · Corporate Finance (no engine) | "20 years", "2'000 audits, inspections and appraisals" | "Get a Quote" (email/phone) | B- |
| Swiss Aviation Group | Swiss adjacent | CH/Dubai/Africa / not shown | "KEEP YOUR ASSET AT IT'S MAXIMUM VALUE." | AAM: Asset Mgmt, Risk Monitoring, Maintenance Supervision, Remarketing, Mid Term Inspections (no engine) | none | "E-MAIL US" | C |
| Airbus FHS | Benchmark | — | "Ensuring your aircraft is always ready to take off" | FHS-TSP · FHS-Components | benefit triad | "speak with an expert… personalised consultation" | A |
| LHT AVIATAR | Benchmark | — | "Optimize your Tech Ops" | 7 product cards incl. Condition Monitoring, Predictive Health Analytics | screenshots | "LOGIN", "Learn more" | A- |
| MTU SERVICEPlus / ETM | Benchmark | — | "Excellent support whenever you need it" | 7 services incl. Digital services (WebETM 3.0) | "~100 owned engines", "24/7", named contacts | Product-sheet PDFs, contact cards, newsletter | A |

---

## 3. The five best-designed sites in this niche — and exactly what to borrow

1. **TGIS Aviation (A)** — the model for a boutique engine consultancy.
   - Outcome-led three-beat headline ("Know Your Engines. Control Your Costs. Focus Where It Matters.") instead of a category label.
   - One service page segmented by the visitor's situation ("If you're buying or leasing engines", "If you're selling your engines", "Shop Visit Management", "Maintaining your Engines"), each with a punchy sub-headline ("Time Kills Deals") and a bullet list of deliverables.
   - Case studies with a dollar figure in the teaser ("$100M in identified cost avoidance").
   - Certification badges in the footer (CAMO, Cyber Essentials, ISTAT) linked to PDFs.
   - Newsletter with a role selector (Lessor / Airline / MRO) — segmentation at capture.
   - Circular engine-lifecycle diagram, FAQ accordion, sticky header, role-based "Who TGIS help" list.

2. **IBA (A)** — the model for proof density and a single repeated CTA.
   - Numeric stats band (four big counters) directly under the hero.
   - Testimonial carousel with full name, title and company on every quote.
   - Award badges as image tiles.
   - One primary CTA ("Book a demo") repeated at every scroll depth; secondary "Get in touch".
   - Language switcher (EN/JA/ZH) and resource hub (articles, webinars, podcasts, market reports).

3. **Willis Asset Management (B+)** — the model for people and taxonomy.
   - Leadership grid with photo, name, title, and regional sales contacts (Americas/EMEA/APAC).
   - Company-history line that converts ownership changes into a trust arc ("launched as TES Aviation in 1995…").
   - Counters "30 years / 1.0M+ man hours / 50+ team members".
   - The most complete engine service taxonomy in the niche (see Section 4) — excellent long-tail SEO vocabulary, but present it as expandable groups, not a flat wall.

4. **SGI Aviation (B-)** — the model for annual activity metrics and audience split.
   - "In 2023 we did…" activity band (65 redeliveries, 45 engine shop visit managements, 105 pre-purchase inspections, 12,000 mandays) — cheap for a small firm to replicate and refresh yearly.
   - Owners vs Operators dual navigation for the same service family.
   - Concrete savings claim inside the service copy ("overall cost savings of up to 10%").

5. **MTU SERVICEPlus (A, benchmark)** — the model for a services page with human contacts and downloadable sheets.
   - Contact-person card per service (headshot, title, location, phone, email, region).
   - One-page PDF "product sheet" per service.
   - Sticky in-page sub-navigation with anchors, breadcrumb, DE/EN toggle, embedded video, tabbed comparison tables.

Also worth lifting: Airbus FHS's benefit triad (Guaranteed Parts Availability / Cost Predictability / Enhanced Reliability) and "speak with an expert" CTA; AVIATAR's uniform product-card grid with interface screenshots (use for a monitoring/analytics offer); Iris Aero's WhatsApp deep link and file-upload field on the form (useful for "send us your workscope/BSI report").

---

## 4. Common service taxonomy and the exact vocabulary the niche uses

**Standard top-level pillars** (appear on 3+ sites): Engine Management / Engine Services · Shop Visit Management · Technical Services / Inspections · Records & Compliance · Transitions (Delivery / Redelivery) · Contract Negotiation & MRO Support · Asset Analysis / Valuations · Fleet Management & Cost Modelling · CAMO / Airworthiness · Expert Witness / Insurance Claims Support.

**Verbatim vocabulary by theme (site in brackets):**
- Shop visits: "Shop Visit Management" (TGIS, SGI, mba, WAML, Iris, JEM), "Full Shop Visit Management" / "Overview Shop Visit Management" (WAML), "shop visit workscoping" (Aeolus), "Engine Shop Visit Management" (mba), "Slot negotiation & TAT control" (Iris), "Managing tenders and proposals" (TGIS)
- Workscope: "Workscope Production / Review" (TGIS), "Workscope Compilation / Review" (WAML), "off-wing workscope" (mba), "Workscopes & price benchmarking" (Iris), "adjust the respective work scopes right down to module level" (MTU)
- Table / strip inspection: "Dirty Condition / Table Inspection" (WAML), "dirty table inspections" (SGI), "Attending strip inspections" (TGIS), "Table inspection subsequent to engine teardown" (mba)
- Borescope: "BSI Reviews" (TGIS), "Borescope Overview and Video Analysis" (WAML), "borescope overviews" (JEM), "BSI programs & workscope templates" (Iris), "Verification of Engine and APU Borescope Inspection" (mba)
- LLP / records: "LLP Back to Birth Trace Audit" (WAML), "Review Back to Birth records" (TGIS), "Records Packs Production" / "Technical Records Support" (TGIS), "Technical Documentation Audit" (WAML), "Records audit & AD/SB compliance" (Iris), "records review and management" (IBA), "FMV/CMV & LLP analytics" (Iris)
- Transitions: "Transitions (Delivery / Redelivery)" / "Engine Transition Management" (WAML), "Redelivery planning & Management" / "Delivery Acceptance" / "Transition Management" (TGIS), "lease handover management" (JEM), "End of Lease Project Management and Aircraft Redelivery" (mba), "Aircraft delivery and redelivery management" (IBA), "Mid-Term Audits" (TGIS), "mid-lease" (IBA)
- Condition monitoring / data: "Fleet ECM / EHM Monitoring Program" (WAML), "trend monitoring" (Aeolus), "engine trend monitoring (ETM)" / "WebETM 3.0" (MTU), "Condition Monitoring" / "Predictive Health Analytics" (AVIATAR), "On-wing Run Overview and Results Analysis" (WAML), "MPA run overviews" (JEM), "Engine Test Cell / Test Result Analysis" (WAML)
- Reserves & cost: "Maintenance Reserve Calculations / Reserve Claim Analysis" (WAML), "maintenance reserves" (SGI), "Engine Fleet Financial Cost Modelling" (TGIS), "Maintenance Cost Forecasting" / "Exit Strategy Modeling and Optimization" (WAML), "financial and budgetary planning" (JEM), "Invoice reconciliation against workscope" / "Warranty Management" (TGIS)
- Valuation: "Engine Valuations (ISTAT Appraiser Certified)" / "Part-out Valuations" (WAML), "Engine Valuations" (TGIS), "engine technical appraisals" (JEM), "Aircraft Valuation" (SGI)
- MRO selection & contracting: "MRO Contract Negotiations" (TGIS), "Engine Overhaul & Repair Contract Negotiation" / "Power by the Hour Programs Assessment / Negotiation Support" (WAML), "MRO selection, negotiation of contracts… MRO visits, reviews and cost benchmarking" (IBA), "maintenance contract negotiations" (JEM), "Negotiation Support" (SGI)
- On-site representation: "Representation and management during onsite engine hardware condition reviews" (WAML), "Attending strip inspections" (TGIS), "hands-on support" (IBA)
- Airworthiness: "Off Wing Engine CAMO" / "Outsourced Powerplant CAMO Support" (TGIS), "Airworthiness Management (CAMO)" (WAML), "CAME/CAMO alignment" (Iris), "airworthiness compliance" (Aeolus)
- Asset/strategy: "Engine Selection" (TGIS), "Powerplant selection" / "Lease/buy analysis" (Iris), "Spare Engine Solutions" (TGIS), "Engine Storage" (SGI), "Engine Stand Assessment" / "QEC / Accessory / Avionics Inventory Check" (WAML), "USM strategies & teardowns" (Iris), "DER, PMA" (SGI), "unscheduled removals" / "on-wing life" (Aeolus), "Expert Witness" (TGIS, WAML), "Insurance Claims Support" (WAML), "Damage analysis" (MTU)
- Outcome claims in use: "up to 10%" savings (SGI); "15–20% cost-down target" (Iris); "$100M in identified cost avoidance" (TGIS); "longer and optimized on-wing times and reduced cost of ownership" (MTU)

**Buyer segments named across the niche:** start-up airlines · airlines exiting OEM support / end of OEM contract · established carriers with constrained technical teams · lessors & asset managers with mid-to-end-of-life portfolios · financiers / investors / banks · insurers (claims) · MROs · "individual aircraft owners and small lessors" (mba).

---

## 5. Positioning gaps and opportunities for Flight Hour Solution

1. **"Switzerland's dedicated jet-engine consultancy."** Searches found no Swiss firm specialising in engine shop-visit management; the nearest Swiss advisors (SAC in Hünenberg ZG, SAG) are airframe/asset/compliance generalists. Claim the category; verify the wording ("only" vs "first") before publishing.
2. **Independence as a product.** WAML is lessor-owned (Willis Mitsui), Aeolus and BeauTech are lessors/traders, MTU/LHT/Airbus are OEM/MRO. A one-line independence statement ("We don't lease engines, sell parts or own shop capacity — our only revenue is your fee") plus a conflicts policy is a differentiator almost nobody states explicitly; pair it with the Swiss-neutrality narrative.
3. **Military & Government Programs.** No peer site has this vertical. Give it its own page with defence-relevant proof (clearance/eligibility statements, export-control awareness, programme types), and separate contact routing.
4. **Lessor–airline liaison.** Only SGI and TGIS split content by owner vs operator; nobody owns the "between lessor and lessee" position (redelivery disputes, reserve claims, workscope approval under lease terms). Build owner/operator journeys plus a third "transition" journey.
5. **Vendor-neutral data & predictive maintenance.** In-niche consultancies mention ECM/EHM in passing; the OEM/MRO benchmarks own it with named products. FHS can be the independent analytics layer: show a sample dashboard or redacted monitoring report, name the data sources (OEM portals, AMOS, ACARS/QAR) and outputs (removal forecasts, workscope recommendations).
6. **Speed and seniority.** TGIS uses "Time Kills Deals"; FHS can promise principal-led engagements, a stated response time, and on-site coverage from Zurich (hours to most European MRO shops). WhatsApp is already there — add a 24/7 AOG/removal hotline and a calendar-booking link (none of the direct competitors offer booking).
7. **Languages.** Only mba (machine translation) and IBA (JA/ZH) offer languages. EN + DE (optionally FR) covers DACH airlines and Swiss/German financiers — no peer does German.
8. **Content assets nobody has.** No direct competitor publishes a glossary, calculators (shop-visit cost / maintenance-reserve estimator), checklists (redelivery, workscope review, table-inspection attendance) or gated PDFs. Even one gated "Shop Visit Readiness Checklist" would out-capture the field. MTU's per-service PDF sheet is the pattern.
9. **Name collision with Airbus "Flight Hour Services (FHS)".** Avoid the "FHS" abbreviation in headings, use "Flight Hour Solution GmbH · independent engine consultancy, Zug" in title tags, and target long-tail terms ("independent engine shop visit management", "engine consultant Switzerland", "Triebwerksberatung Schweiz").
10. **Fix the basics competitors also miss.** Named team with photos and former employers, engine-type coverage matrix (peers name CFM56, LEAP, V2500, CF34, Trent, BR700, GE90, CF6, PW2000), activity counters refreshed yearly (SGI pattern), and case studies with a number in the teaser (TGIS pattern). Remove the stray Polish skip-link string.

---

## 6. Trust-signal checklist for a best-in-class site in this niche

**Identity & legal**
- [ ] Legal entity name, UID/CHE number, registered Zug address, Impressum, privacy notice (Swiss nFADP + GDPR), cookie consent
- [ ] Independence / no-conflict statement; professional-indemnity insurance mentioned; NDA-ready wording
- [ ] Engine-type coverage matrix and geography/time-zone coverage map

**People**
- [ ] Every consultant: photo, name, title, years, former employers (OEM/airline/lessor/MRO), licences/qualifications (e.g., EASA Part-66, ISTAT appraiser, engineering degree), LinkedIn link
- [ ] Named contact per service (MTU pattern) and a "who you will actually work with" promise

**Track record**
- [ ] Counters: shop visits managed, engines transitioned/redelivered, table inspections attended, MRO shops visited, countries, savings identified, mandays (refresh yearly, SGI pattern)
- [ ] 3+ case studies in problem → action → quantified result format (TGIS pattern); anonymised client descriptors if logos are not permitted ("European flag carrier", "top-10 lessor")
- [ ] Testimonials with name, title, company (IBA pattern); client/partner logos if cleared
- [ ] Memberships and certifications: ISTAT, ISO 9001 (or roadmap), Cyber Essentials/ISO 27001, CAMO partnership or Part-M/Part-145 affiliations; badges linked to certificates (TGIS pattern)
- [ ] Press mentions, conference appearances (MRO Europe, Engine Leasing Trading & Finance, ISTAT), published articles

**Offer clarity**
- [ ] Situational service pages (buying/leasing · selling · shop visit · maintaining · lessor-airline transition · military/government)
- [ ] "How a managed shop visit works" timeline (induction → table inspection → workscope approval → invoice reconciliation → warranty follow-up)
- [ ] Engagement formats explained (per-event, fleet programme/retainer, ad-hoc day rate) even without prices
- [ ] Downloadable capability statement and per-service one-page PDF; redacted sample report
- [ ] FAQ and glossary using the vocabulary in Section 4

**Conversion & access**
- [ ] Single primary CTA repeated at every scroll depth ("Speak to an engine expert"), secondary "Send us your workscope" with file upload
- [ ] Short form (name, company, role, engine type, need, attachment) with visible response-time promise; phone with country code; WhatsApp; calendar booking; 24/7 AOG line
- [ ] Newsletter with role segmentation (Lessor / Airline / MRO / Government)
- [ ] EN/DE language toggle; fast, accessible, mobile-first, HTTPS; no template artefacts

**Content cadence**
- [ ] Insights section with at least monthly posts; one gated asset; event calendar; careers page with real roles

---

## 7. Sources (every URL used)

Fetched successfully
- https://flighthoursolution.com
- https://www.tgis.aero/
- https://www.tgis.aero/services/
- https://tgis.aero/services/engine-management-services/
- https://www.sgiaviation.com/
- https://www.sgiaviation.com/lessors-engine-services/
- https://www.mba.aero/
- https://www.mba.aero/service/technical/
- https://www.willisasset.com/
- https://www.willisasset.com/waml-engine-technical
- https://aeolus-engineservices.com/
- https://www.airsource-partners.com/
- https://www.iba.aero/
- https://www.iba.aero/advisory-services/technical/
- https://irisaero.com/
- https://swic.aero/ (second attempt; first returned 503)
- https://www.swissaviationgroup.com/aircraft-asset-management
- https://www.aircraft.airbus.com/en/services/maintain/flight-hour-services-fhs
- https://www.aviatar.com/
- https://mtu.de/maintenance/commercial-maintenance/serviceplus/engine-trend-monitoring

Fetched but failed (status noted)
- https://www.tgis.aero/engine-management-consultancy/ (404)
- https://jetenginemanagement.com/ and https://www.jetenginemanagement.com/ (empty body returned twice)
- https://www.altonaviation.com/ and https://altonaviation.com/mro-aftermarket/ (403)
- https://beautech.aero/ and https://beautech.aero/services (403)
- https://aircraft.airbus.com/en/services/enhance/flight-hour-services (404)
- https://www.lufthansa-technik.com/en/aviation-consulting (404)
- https://www.mtu.de/maintenance/commercial-aircraft-engine-services/engine-trend-monitoring/ (404)

Search results relied on (snippets)
- Jet Engine Management: https://www.aerospacewalesforum.com/item/jet-engine-management-limited/ ; https://www.jetenginemanagement.com/history/ ; https://www.jetenginemanagement.com/services/fleet-management/ ; https://jetenginemanagement.com/consultancy-management/ ; https://jetenginemanagement.com/our-team/ ; https://jetenginemanagement.com/dave-carr/ ; https://jetenginemanagement.com/contact-us/ ; https://cardiff.infoisinfo.co.uk/card/jet-engine-management-ltd/1059459
- Alton: https://altonaviation.com/mro-aftermarket/ ; https://altonaviation.com/about/ ; https://altonaviation.com/expertise ; https://altonaviation.com/team/ ; https://altonaviation.com/transaction-advisory ; https://altonaviation.com/technology-mobility/ ; https://altonaviation.com/press_release/alton-expanded-team-and-capabilities-in-2022 ; https://altonaviation.com/press_release/alton-aviation-consultancy-enters-2024-well-positioned-for-continued-growth-following-a-successful-2023/
- BeauTech: https://beautech.aero/news/ ; https://beautech.aero/author/igor/ ; https://beautech.aero/author/ashvin/ ; https://beautech.aero/latest-news/press-release-beautech-strengthens-cf34-10-leadership-with-jetblue-engine-acquisition/ ; https://beautech.aero/latest-news/press-release-beautech-acquires-twelve-cf34-10e-engines-from-alliance/ ; https://beautech.aero/latest-news/press-release-beautech-acquires-four-embraer-e175-aircraft-on-lease-to-lot-polish-airlines-from-altavair/ ; https://beautech.aero/table/cfm56-engine/ ; https://beautech.aero/wp-content/uploads/2018/04/LLP-Sheet-ESN-779145R1.pdf
- Swiss market: https://centreforaviation.com/data/profiles/suppliers/swiss-aviation-consulting ; https://www.linkedin.com/company/swiss-aviation-consulting ; https://www.consultancy.org/firms/switzerland/aviation ; https://www.swissaviationgroup.com/aircraft-asset-management ; https://www.srtechnics.com/ ; https://www.jetaviation.com/location/zurich/ ; https://www.linkedin.com/company/swiss-aviation-software ; https://mll-legal.com/expertise/luft-raumfahrt-schifffahrt/ ; https://www.twobirds.com/de/capabilities/sectors/aviation ; https://www.zhaw.ch/storage/engineering/studium/bachelorstudium/studiengaenge/aviatik/Karriere-nach-dem-Studium-Aviatik-Firmen.pdf ; https://www.europages.de/unternehmen/schweiz/luftfahrtindustrie.html ; https://en.wikipedia.org/wiki/Seabury_Capital ; https://www.linkedin.com/in/andrew-muti/
- Adjacent technical consultancies surfaced by the Swiss-city searches: https://arts.aero/technical-aviation-consulting ; https://arts.aero/de/technisches-aviation-consulting ; https://accaviation.com/aviation-consultancy/ ; https://accaviation.com/aviation-consultancy/strategic-advisory/ ; https://accaviation.com/aviation-consultancy/consultancy-services/technical-services/ ; https://aviationtechconsultants.com/ ; https://www.aerotime.aero/articles/engine-transitions-strategic-camo-consultancy-value ; https://www.wlfc.global/ ; https://www.aviation-cc.com/luftfahrt-consulting-beratung-fuer-erfolgreiche-projekte/ ; https://www.bain.com/de/branchenkompetenzen/fluggesellschaften-und-logistik/air-transportation-services/ ; https://www.schaeffler.ch/de/produkte-und-loesungen/industrie/branchenloesungen/aerospace/ ; https://www.brainguide.de/experten/Luftfahrt-Raumfahrt/_tb
- Airbus: https://www.aircraft.airbus.com/en/services/maintain/flight-hour-services/fhs-tsp ; https://www.airbus.com/en/newsroom/stories/2019-02-airbus-flight-hour-services ; https://www.aircraft.airbus.com/en/newsroom/news/2021-06-airbus-flight-hour-services-fhs-cover-scoot-new-a321neo-fleet ; https://services.airbus.com/en/aircraft-availability/flight-hour-services/flight-hour-services/fhs-tailored-support-package.html
- MTU: https://www.mtu.de/fileadmin/EN/3_Maintenance/Commercial_Maintenance/Produkdatenblaetter/MTU_Produktblatt_ETM_20210615.pdf ; https://www.mtu.de/fileadmin/EN/3_Maintenance/Commercial_Maintenance/Produkdatenblaetter/MTU_Produktblatt_EFM_CORTEX_20211008_Ansicht.pdf ; https://www.mtu.de/fileadmin/EN/3_Maintenance/Commercial_Maintenance/Produkdatenblaetter/MTU_Produktblatt_TAMS_20240110_Ansicht.pdf ; https://www.mtu.de/maintenance/ ; https://www.mtu.de/maintenance/commercial-maintenance/ ; https://www.mtu.de/maintenance/commercial-maintenance/mtuplus-intelligent-solutions/
