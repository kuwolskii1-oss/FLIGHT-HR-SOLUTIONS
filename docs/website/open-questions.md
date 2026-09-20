# Open questions for the client

Collected while the website copy was written from the research dossier (19 and 20 September 2026).
Each point is something the copy either avoids claiming or states in the most defensible form until
the client confirms it. The same points sit in the `clientToConfirm` arrays of the content files
(`site/app/src/content/`), which are not rendered. The short list of launch decisions is in
`docs/website/README.md`.

## Site-wide (identity, navigation, footer) (site.json)

- Which phone number is primary? The file uses +41 76 595 88 61 (hero and contact page since April 2026); +41 76 418 63 50 (current header button and WhatsApp) and +41 76 358 84 90 (Swiss Aerospace Cluster directory) are also in circulation. Is there a landline or switchboard?
- WhatsApp is registered on +41 76 418 63 50, so the tel and WhatsApp links do not match. Should WhatsApp move to the primary number?
- Bahnhofplatz: what is the house number, and is it a visitable office (map, opening hours) or a domicile address (meetings by appointment)?
- ISO 9001: certification body, certificate number, scope, issue and expiry dates, and a PDF, so the badge can move from claimed to verified and link to a verifying page.
- Aviation Suppliers Association: membership number, category and directory link; does the membership relate to a parts-supply activity that should be described on the Assets page?
- Swiss Aerospace Cluster: confirm the membership start month (October or November 2025).
- Is engine and aircraft trading an official service line to present as Assets, and may sales@flighthoursolution.com be published for those enquiries?
- Does the Advisory line take no commissions from MROs, OEMs or lessors, so the disclosure can state fee-only? Please approve the conflicts-policy wording.
- Confirm the singular spelling Flight Hour Solution everywhere (LinkedIn has used the plural) and that linkedin.com/company/flight-hour-solution is the page to link.
- Confirm English only at launch with German as the planned second language (French or Polish were not assumed).

## Home (home.json)

- Confirm the hero headline 'Your engines. Independently managed.' over the alternative 'Every shop visit under control.' (07 section 2.5).
- Is engine and aircraft sourcing an official service line to show on the site, and is 'Assets' the right name for it? The home page renders it as the third situation and discloses the broker role (07 section 12, decision 2).
- Confirm that no commissions or referral fees are received from MROs, OEMs, lessors or parts suppliers on advisory work, and approve the written conflicts policy the independence section points to (07 section 2.2 and 2.3).
- ISO 9001: certification body, certificate number, scope and expiry; ASA: membership number. Neither is rendered until supplied (01 section 5).
- Confirm Hubert Nowosad as the public face (photo, title, bio) and which former employers may be named; the Aero Norway role and title (roughly 2018 to 2022) are unverified. Confirm any other team members who may be named. No years-of-experience figure is used.
- May the site say '30 minutes from Zurich Airport' instead of 'a short drive', and is Bahnhofplatz a visitable office or by appointment?
- Counters the brief wanted (engines managed, shop visits overseen, countries) are omitted for lack of verified numbers; supply them if they should appear.
- Supply anonymised, client-approved case notes for the Results section (08 section 8.3 row 6); none are used on the page.
- Confirm that training and knowledge transfer is offered in practice and in what formats (07 section 4 marks it 'confirm').
- Military and government: confirm which programme types and client categories may be named (07 section 12, decision 7).
- The model count of 17 treats TPE331/T76 as one entry; confirm whether the T76 should be counted separately.
- Confirm the response-time promise for the contact page; none is stated on the home page.

## Services (services.json)

- Training and knowledge transfer: confirm the offer exists in practice, its formats (on site, remote, during engagements), delivery languages, whether any course is accredited, whether checklists and templates may be handed over to client teams, and whether it stays as a service page (07 section 4 marks it 'confirm').
- Military and government: which programme types, platforms and client categories may be named; the security clearance position; any restriction on showing this work (07 section 12, decision 7); and whether the same five engine families apply to government fleets (the page says other types are assessed case by case).
- Case notes and proof: no cases, quotes, client names, savings figures or counters appear on any service page. Supply anonymised, approved cases in the 06 section 4.7 formats for the proof sections.
- Named contact per service: the 07 section 5 template calls for a named contact card; the content schema has no field for it. Decide whether to add one and who leads on each service.
- Fee basis: the pages say 'not owned by an MRO, a lessor or an OEM' and 'acts for the client alone' but never 'fee-only'. Confirm that no commissions or referral fees are received from MROs, OEMs, lessors or parts suppliers on advisory work before that word is added.
- Aviation Suppliers Association membership: does it relate to a parts-supply activity? The analytics page says 'we do not sell a monitoring platform or shop capacity' and deliberately makes no statement about parts until this is confirmed.
- MRO Support Programs (02 section 4): are these programmes for MRO clients, for the customers of MROs, or both? The contracts page currently describes them neutrally.
- Appraisals: does anyone on the team hold an ISTAT or comparable appraiser certification? The due diligence page says certified appraisals are done alongside an appointed appraiser.
- Market figures: only [F]-tagged figures from 06 section 1 are quoted, with publisher and date rendered under each stat. Confirm that quoting these publications is acceptable and whether a footnote with URLs should be rendered on each page.
- Slot policy: the workscope page states plainly that shop slots are not guaranteed and that the company plans against quoted lead times and supports slot negotiation. Confirm this is the position the company wants to publish.

## Engines (engines.json)

- Engine-family experience: which of the seventeen listed models has the team managed shop visits for in practice, and who is the consultant per family (07 section 2.2 asks for engine-family experience per consultant)?
- Is the capability list current, in particular the LEAP-1C, V2500-A1, V2500-D5 and PW4000-112, which have small or shrinking fleets?
- Should any [S]-tagged figures be added once verified against the source: about 2,300 to 2,400 CFM56 shop visits per year through 2026 to 2028 and about 800 V2500 shop visits in 2026 (Aviation Week snippet); the LEAP-1A HPT durability kit certified December 2024 with more than 1,200 kits and 70 per cent of the fleet on the reverse-bleed system (CFM); FAA certification of the LEAP-1B durability improvements on 18 July 2026 (FlightGlobal), which conflicts with IBA's H1 2026, so the page currently says 'in 2026'?
- Aircraft applications: the CFM International and Pratt & Whitney product pages refused automated reading, so applications were cross-checked against GE Aerospace pages and encyclopaedia entries. Should they be re-cited to the type certificate data sheets before launch?
- May the Honeywell OEM figures on the APU and turboprop page (more than 36,000 APUs in service, more than 100 million hours for the 131 family, more than 13,000 TPE331 engines in 18 models and 106 configurations, all undated on Honeywell's pages) be quoted, or should they be replaced with figures from the team's own experience?
- Should widebody families named in 07 section 4 for later (Trent, GE90, GEnx, CF34) get pages, in particular the Rolls-Royce Trent, which the company has sold through its sourcing activity?
- What is the confirmed name of the Assets line, and may CFM56 listings be cross-linked from the CFM56 page?
- Should any approved savings figures, response times or engagement durations appear on these pages (none are stated, per 06 section 5.2)?
- Has the team managed APU shop visits and turboprop overhauls in practice, and may the T76 and other military applications be described (07 section 12, decision 7)?
- The route strips the '| Flight Hour Solution' suffix from seoTitle, renders stat sources publicly, and uses the first sentence of each context.text as the hub row; the copy was written for that behaviour. Confirm the route stays as it is, or the leads should be revisited.

## Industries (industries.json)

- Airlines: confirm the on-site scope that may be promised (table inspection attendance, test cell overview) and the typical mobilisation time from Zug to the shops your clients use.
- Airlines: 07 section 3 proposes a 30-minute engine review for VPs Technical; should a calendar booking link sit behind Talk to us on this page? No new CTA label has been added.
- Airlines: should ACMI and business-aviation operators be included in the airline audience or given a separate line?
- Lessors and investors: can fleet ECM and EHM monitoring be offered for engines on lease, given it depends on each lessee's data-sharing obligations?
- Lessors and investors: is an ISTAT appraiser qualification or professional indemnity insurance held and may either be mentioned to lender clients? Neither is claimed; teardown valuations are described as technical valuations, not certified appraisals.
- Lessors and investors: will a capability statement PDF exist (07 section 3 lender CTA) so the page can link to it, and should this page mention the Assets sourcing line or is the About page disclosure sufficient?
- MROs: are MRO support programmes an active offer, and are the four items shown (material and scrap review, findings and records review, new type induction readiness, training) the ones to sell to shops? No MRO client has been named anywhere.
- MROs: approve the statement that most of the firm's work is on the customer's side of the table, and approve a conflicts rule that the firm does not act for a shop and for that shop's customer on the same shop visit.
- MROs: the phrase 'the team's experience in engine shops and airline engineering' is used without a years figure; confirm which shops and airlines may be named (01 section 2 indicates about four years at Aero Norway for the managing director, role unverified). Also confirm whether the page name should be MROs or Engine shops and MROs.
- Government and military: should a dedicated contact route (separate mailbox or named contact) sit behind Talk to us, as 07 section 3 asks?
- Government and military: what restrictions apply to what may be shown about military and government work, including which programme or engine types, if any, may be named (01 section 9 item 8; 07 section 12 item 7)?
- Government and military: does any team member hold a personnel security clearance that may be stated? None is claimed.
- Government and military: should the Swiss base be presented as neutral ground for non-aligned governments on this page, without implying endorsement by the Swiss state?

## About (about.json)

- Public face: confirm Hubert Nowosad is shown as Managing Director and supply a portrait for the person card.
- Former employers: 01 section 2 points to roughly 2018 to 2022 at Aero Norway (independent CFM56 overhaul shop, Stavanger) from a public LinkedIn post, with role and title unverified. Confirm what may be named, with dates and titles; nothing is rendered until then.
- Languages spoken: none are documented, so the languages array is empty. Supply the languages to show.
- LinkedIn: no personal profile URL is documented in 01 (only a post URL and a profile named Flight Hour Solution GmbH linked from the company page). Supply the profile URL or confirm the field stays empty.
- Other team members: the Swiss Aerospace Cluster directory says 4, LinkedIn says 11 to 50, the register names one person. Confirm whether anyone else may be named, with title, portrait and consent, and confirm the statements that the firm is small and the managing director leads every engagement.
- Founding history: the register shows two founders in 2024 and one exit in July 2025. The page says only that the company has been wholly owned by its managing director since July 2025 and does not name the former co-owner. Confirm this treatment.
- Conflicts policy: approve the five policy lines. Policy 5 (same engine, aircraft or counterparty) goes beyond 07 section 2.3 and can be removed.
- Fee-only Advisory line: confirm that no commissions, referral fees or other payments are received from MROs, OEMs, lessors or parts suppliers on advisory work. If confirmed, add the proposed policy line given in the file; it is not rendered until then.
- Confidentiality: decide whether to add the proposed policy line on non-disclosure agreements and data handling.
- Confirm the name of the second line (Assets) and that engine and aircraft sourcing is an official service line to present publicly.
- ISO 9001: certification body, certificate number, scope, issue and expiry dates and a PDF of the certificate, so the row can move from claimed to verified.
- Aviation Suppliers Association: membership number, category and the directory page to link to.
- Swiss Aerospace Cluster: confirm the membership start month (logo on the cluster site October 2025, welcome post 26 November 2025).
- Whether to add a credentials row stating that no EASA or FAA approvals are held and none are required for consulting work.
- Bahnhofplatz: house number, and whether it is a visitable office (map, hours) or a domicile address; the page says meetings are by appointment.
- Whether 30 minutes from Zurich Airport may replace a short drive from Zurich Airport.
- VAT: confirm VAT registration before adding VAT CHE-196.248.398 MWST to the legal lines.
- Whether to show the registered translations of the name (Flight Hour Solution Sarl, Sagl, LLC) in the legal lines.
- Real photography of Zug or the meeting room to replace the generated illustration at launch.

## Assets (assets.json)

- Is engine and aircraft trading an official line to present publicly as Assets, and is the disclosure wording approved (07 section 2.3 option 1, with the role statement made in writing)?
- Does Flight Hour Solution own the engines it offers, or market them on behalf of their owners? The LinkedIn posts do not say; each listing and the disclosure should state which.
- How is the Assets line paid (commission, margin or retainer), and are the terms disclosed to both parties as step 2 promises?
- Beyond disclosure, are advisory clients ever offered assets the company represents, and does the company decline advisory opinions on assets it is paid to sell? Advisory is not described as fee-only until confirmed.
- May sales@flighthoursolution.com (used on LinkedIn for asset enquiries) be published on this page, and should the request form deliver to it rather than to contact@?
- What is the current status of each recentActivity item (sold, placed, withdrawn, still available), are the LinkedIn dates recorded in 01 section 3 confirmed, and is a live listing wanted at launch (model, ESN, status, time and cycles remaining, location, availability date)?
- May the completed Rolls-Royce Trent engine sale announced on 5 March 2026 be shown, and with what detail? It is omitted because the table shows offered and wanted items only.
- What is the exact remaining-cycles figure for the CFM56-7B26 (the post says about 6,800), and does it refer to the limiting life-limited part?
- Trent 772B and PT6A sit outside the engine families on the Services page: does Assets cover any type or a defined list, and should that list be stated on the page?
- Should parts or modules be an asset type on the form, given the ASA membership and the AircraftParts hashtag? The form currently offers Engine, Aircraft and Other, and no parts activity is described.
- Should an availability-alert subscription (proposed in 07 section 5) be added at launch or in phase 2? None is included because no mailing tool, consent text or retention rule exists yet.
- Are the process promises in How it works (direct approach to owners, lessors, operators and part-out specialists; specification sheet from the records with the owner's name withheld; LinkedIn circulation; written technical view for buy-side clients; delivery documentation check and follow-through to acceptance) things the company does on every Assets engagement?

## Contact (contact.json)

- Confirm the one-working-day reply promise (Monday to Friday, Swiss time) and who monitors the inbox and the phone.
- Confirm the single primary phone number: +41 76 595 88 61 is used; +41 76 418 63 50 (header button and WhatsApp) and +41 76 358 84 90 (Swiss Aerospace Cluster directory) are also in circulation. Is there a landline or switchboard?
- WhatsApp: the documented link is on +41 76 418 63 50, not the primary number. Should WhatsApp move to +41 76 595 88 61 (site.json and this file change together)? Is it a WhatsApp Business profile?
- Out-of-hours and AOG cover: are calls answered outside Swiss working hours, and should a 24-hour AOG line be promised (05 section 5 item 6 recommends one)? Who answers urgent calls?
- Attachments: the form has no upload and tells visitors to send files by email after the first reply. Is that acceptable, or should a file-upload field (workscopes, borescope reports) be added once a storage and virus-scanning route exists?
- Calendar booking: 07 sections 5 and 8 recommend a booking link with a named consultant; none is documented. Supply a URL if wanted.
- Should sales@flighthoursolution.com (used on LinkedIn for engine and aircraft enquiries) be listed for asset enquiries?
- Engine family select: it lists the five families only. Add an Other option for enquiries about types the company has traded (Trent, PT6A)?
- Bahnhofplatz: supply the house number, and confirm whether it is a visitable office (map and opening hours) or a domicile address (the page currently says meetings by appointment).
- Privacy notice: it must name the processors behind the form (Cloudflare through the Higgsfield hosting platform and the email provider, currently Resend when RESEND_API_KEY is configured). Confirm the provider used at launch so the consent text and the notice match.

## Careers (careers.json)

- Application address: contact@flighthoursolution.com is the only documented general address. Confirm it, or supply a dedicated address such as careers@flighthoursolution.com, and say who reads applications.
- Open roles: none are documented, so the page shows the built-in line about speculative applications. Supply title, location and two or three sentences for any role to advertise.
- Employment form: employees, freelance or associate consultants per engagement, or both? Based in Zug, at client sites or remote? The page says the work happens at the shop and, between visits, from Zug; confirm the expected share of travel.
- Backgrounds: the three named (engine shop, airline engineering, lessor technical) follow the brief. Add others (OEM field service, MRO customer support, records and CAMO, defence sustainment for the military and government line)?
- Engine families: confirm the priority families for hiring (for example LEAP for new-generation work); the page names all five families from 02 section 4.
- Languages: English is described as essential and German as useful; the team's languages are undocumented (01 section 9, question 6). Confirm, and say whether French or Polish should be mentioned.
- Reply time: no reply promise is made for applications. If the company commits to one (for example within ten working days), it can be added to the how-to-apply text.
- Subject line: applicants are asked to write Application in the subject line so a shared inbox can sort applications from enquiries. Confirm or remove.
- Small firm and independence wording: the title says small consultancy and item 6 repeats the independence line used on the About page and footer. Approve both (team-size signals conflict: register one person, Swiss Aerospace Cluster 4, LinkedIn 11 to 50).
- Candidate data: applications arrive by email with personal data. Confirm the retention period for unsolicited applications so the privacy notice (legal.json) can state it.
- Cross-file note: the site groups TFE731 under the family named APU and turboprop, following the old site's heading; the TFE731 is a turbofan, so the careers page lists it by designation only. Confirm whether the family name should change in site.json and engines.json.

## Impressum, privacy and cookies (legal.json)

- House number for Bahnhofplatz, and whether it is a visitable office or a domicile address (meetings by appointment).
- Confirm that Hubert Nowosad is named publicly as managing director and as the person responsible for website content and data protection matters, and whether a data protection officer or adviser has been appointed.
- Which of the three phone numbers in circulation is the one for the Impressum (+41 76 595 88 61 is used), and whether WhatsApp moves to it.
- VAT registration: confirm before adding the line VAT CHE-196.248.398 MWST; also whether to show the share capital (CHF 20,000) and the registered name translations (Sàrl, Sagl, LLC).
- Email provider at launch: confirm Resend, that its data processing terms are accepted, and which mailbox receives enquiries (ENQUIRY_TO); if a CRM is added it must be named as a recipient.
- Mailbox host: still zenbox.pl (Cyber_Folks S.A., Poland) at launch, or moving to Google Workspace, Microsoft 365 or Infomaniak as 07 section 9 recommends; the recipient and transfer sections change with it.
- Higgsfield: legal entity, address, data processing terms and processing locations. Cloudflare: data processing terms in force through the platform, the transfer mechanism (standard contractual clauses or the Swiss-US Data Privacy Framework) and the retention period of request and Worker logs, to replace the phrase the providers set the retention period.
- Retention: fix a period for enquiries (for example 24 months after last contact) and for job applications; decide whether a candidate pool with consent is wanted.
- Which mailbox handles privacy requests: contact@flighthoursolution.com (used) or the old privacy@flighthoursolution.com.
- Counsel: whether an EU representative under Article 27 GDPR (and a UK representative) is needed; review of the liability and copyright wording; whether to add a governing-law and jurisdiction clause (Swiss law, Zug); the copyright position on generated illustrations.
- Production build on the launch domain: check for any platform-injected script, sign-in frame or cookie (for example a Cloudflare __cf_bm cookie) and add it to the notices if present; remove fonts.googleapis.com and fonts.gstatic.com from the content security policy so the no third-party fonts statement stays provably true (code change).
- Analytics: none is installed; if Plausible or Fathom is added, the privacy and cookie notices must name it and its host. Confirm that no cookie banner is wanted.
- Launch domain: confirm flighthoursolution.com and whether the same platform serves it; the notice currently says this website rather than naming a domain.
- When real photography replaces the generated illustrations, supply the photographer's credit and licence; confirm who owns the rights in the logo and wordmark for a possible trademark line.
- Confirm the Impressum line stating the company is not an approved maintenance organisation and holds no EASA or FAA approvals is wanted, and that mailbox access is in practice limited to the people who handle enquiries.

## Glossary (glossary.json)

- Term selection: confirm the forty terms, including the five 06 list items folded into neighbouring entries (stub life into Life-limited part, hard time into On-condition, reverse bleed system into Durability kit, Part-M into CAMO, Maintenance Planning Document dropped), or name terms to swap in from the 05 vocabulary (mid-term inspection, invoice reconciliation, warranty claim, scrap review, expert witness, ISTAT appraisal).
- Performance restoration: confirm or remove the phrase 'typically several million US dollars for a narrowbody engine', which follows the 06 section 1.2 copy guidance rather than an audited figure.
- Durability kit: verify the dates against the CFM and GE press releases before launch (CFM says December 2024 for the LEAP-1A HPT kit, FlightGlobal and GE say 18 July 2026 for the LEAP-1B improvements, IBA says H1 2026), and confirm that GE's 'more than doubles time on wing in severe environments' claim may be repeated.
- Powder-metal inspection and Full-life: the fleet figures (April 2026) and the IBA GE90-115BL value (September 2026) will date; confirm a refresh cadence for the glossary or replace them with plain definitions.
- Neutral definitions: no entry names a Flight Hour Solution service; confirm whether Table inspection, Workscope, Back-to-birth records and Test cell acceptance should end with a one-sentence 'what we do' line pointing to the service page.
- Regulatory references are EASA and FAA only; confirm whether Swiss FOCA should be mentioned and whether German equivalents (Triebwerk Shop Visit, Wartungsrücklagen, Leasingrückgabe) should be added for the planned German mirror.
- Technical review by the team: the use of 'dirty fingerprint', the Engine Basic Shop Visit definition as it appears in the leases the company typically works with, the composition of a QEC, and the unit used for shop visit rate (visits per 1,000 engine flight hours).
- Closing band wording 'A term you did not find? Ask us.' with the site-wide primary call to action: confirm.

## Insights (insights.json)

- Verify the four [S]-tagged sources before launch or delete the sentences that use them: CFM kit count and fleet percentages, GE Aerospace time-on-wing figures, FlightGlobal/GE Aerospace LEAP-1B certification date and 2027 cut-over (LEAP article), and the GA Telesis AOG Technics reference (USM article).
- LEAP-1B durability kit certification date: IBA (tag F) says H1 2026, FlightGlobal (tag S) says 18 July 2026; the article body says 'in 2026'. Which date should be used?
- Confirm the team has shop-visit experience on every family named in the closing paragraphs (CFM56, LEAP, V2500, PW4000), in particular LEAP-1A/-1B workscope reviews.
- Confirm the conflicts-policy wording and whether the firm distributes parts (ASA membership and #AircraftParts in 01 section 4.3); the USM and LEAP articles state disclosure when brokering and 'no interest in the parts sold or the slot used'.
- Confirm that no MRO, lessor or OEM holds a stake in or pays commission to the firm ('owned by neither an MRO nor a lessor').
- Publication dates (12 May, 23 June, 7 July, 4 August, 1 and 15 September 2026) are editorial; confirm or replace with actual publishing dates.
- Each source entry renders publicly with the research reference in parentheses (document, section, tag); decide whether to keep it or strip to a plain bibliography at launch.
- Wording checks: 'negotiates slots' in the turnaround article (06 section 5.2 warns against promising slot access; the text promises negotiation only) and 'earns their day rate' in the visit-type article (confirm day-rate pricing).
- Preferred names for the three visit types (quick-turn, hospital visit, performance restoration) so glossary and article agree; preferred lead time for the reserve adequacy check if not 'at least a year before redelivery'.
- ECM/EHM: confirm monitoring is offered as a running programme, which platforms and data formats can be read, and whether a redacted sample trend report may be shown.
- Images are generated illustrations (engine-cradle, table-inspection, cross-section, records-desk, shop-floor, borescope) to be replaced by real photography at launch.
