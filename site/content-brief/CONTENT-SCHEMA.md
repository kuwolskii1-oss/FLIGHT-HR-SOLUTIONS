# Content schema for the Flight Hour Solution website

All content lives as JSON files in `site/app/src/content/`. Files are imported by React
components, so they must be strict JSON (double quotes, no comments, no trailing commas),
UTF-8, and must validate against the shapes below. Every object may carry an optional
`"notes"` string and an optional `"clientToConfirm": [string]` array; neither is rendered.
Every factual number, date, name or claim carries its source in a sibling `"source"` field
or in the page-level `"sources"` array (document + section of docs/research, or a URL).

Shared shapes
- Cta: { "label": string, "href": string, "kind": "primary" | "secondary" | "link" }
- Faq: { "q": string, "a": string }               (a: 1-3 sentences, plain, extractable)
- Row: { "title": string, "text": string, "href": string, "meta": [string] }  (meta = short mono tags)
- Stat: { "value": string, "unit": string, "label": string, "source": string }  (only verifiable facts)
- ImageRef: { "src": string, "alt": string, "credit": string }   (src is a path under /assets/... that
  the build will supply; use the placeholder keys listed in "Image keys" below, never invent paths)

Image keys available (use as "src" values exactly): "hero-engine-stand", "shop-floor", "borescope",
"table-inspection", "test-cell", "records-desk", "fan-macro", "zug-lake", "apron-dusk",
"engine-cradle", "cross-section". Alt text describes what is in the picture; credit is
"Generated illustration" for all of them (real photography replaces them at launch).

Files and their top-level shapes

1. site.json
{ "company": { "legalName", "shortName", "tagline", "uid", "street", "postalCode", "city",
    "country", "phone", "phoneDisplay", "email", "whatsapp", "linkedin", "founded",
    "managingDirector", "registerUrl" },
  "nav": { "primary": [ { "label", "href" } ], "secondary": [ { "label", "href" } ] },
  "cta": { "primary": Cta, "secondary": Cta },          // ONE label per intent, reused site-wide
  "memberships": [ { "name", "status": "verified" | "claimed", "since", "url", "source" } ],
  "engineFamilies": [ { "slug", "name", "models": [string] } ],
  "languages": { "current": "en", "planned": ["de"] },
  "footer": { "legalLine", "disclosure" },
  "sources": [string] }

2. home.json
{ "hero": { "headline", "sub", "metaLine": [string], "ctas": [Cta] },
  "chapters": [ { "id", "label", "kicker", "title", "body", "tags": [string] } ],   // exactly 5, for the scroll film
  "proof": { "stats": [Stat], "memberships": [string] },
  "situations": { "title", "items": [ { "title", "text", "href" } ] },             // three situations we are hired for
  "services": { "title", "intro", "rows": [Row] },
  "engines": { "title", "intro", "rows": [Row] },
  "process": { "title", "intro", "steps": [ { "n", "title", "text" } ] },          // 5 steps of a managed shop visit
  "independence": { "title", "text", "href" },
  "people": { "title", "intro", "href" },
  "insights": { "title", "href" },
  "closing": { "headline", "sub", "ctas": [Cta] },
  "faq": [Faq],
  "sources": [string] }

3. services.json
{ "hub": { "title", "intro", "situations": [ { "title", "text", "serviceSlugs": [string] } ] },
  "services": [ { "slug", "name", "shortName", "oneLiner", "seoTitle", "metaDescription",
     "keywords": [string], "audience": [string], "problem": { "title", "text", "stats": [Stat] },
     "deliverables": [ { "title", "text" } ], "engagement": [ { "n", "title", "text" } ],
     "engineFamilies": [string], "proof": { "title", "text" }, "faq": [Faq],
     "related": [string], "image": ImageRef, "cta": Cta } ],
  "sources": [string] }
Service slugs (fixed): shop-visit-management, workscope-and-removal-planning,
lease-return-and-asset-management, contracts-mro-and-supply-chain,
predictive-maintenance-and-analytics, technical-due-diligence, military-and-government,
training-and-knowledge-transfer.

4. engines.json
{ "hub": { "title", "intro" },
  "families": [ { "slug", "name", "seoTitle", "metaDescription", "keywords": [string],
     "models": [string], "context": { "title", "text", "stats": [Stat] },
     "visitTypes": [ { "title", "text" } ], "costDrivers": [ { "title", "text" } ],
     "whatWeDo": [ { "title", "text", "serviceSlug" } ], "faq": [Faq], "image": ImageRef, "cta": Cta } ],
  "sources": [string] }
Family slugs (fixed): cfm56, leap, v2500, pw4000, apu-and-turboprop.

5. industries.json
{ "hub": { "title", "intro" },
  "industries": [ { "slug", "name", "seoTitle", "metaDescription", "audience", "situation",
     "whatWeDo": [ { "title", "text", "serviceSlug" } ], "entryCta": Cta, "image": ImageRef } ],
  "sources": [string] }
Industry slugs (fixed): airlines, lessors-and-investors, mros, government-and-military.

6. about.json
{ "seoTitle", "metaDescription",
  "story": { "title", "paragraphs": [string] },
  "independence": { "title", "statement", "policy": [string] },
  "team": { "title", "intro", "people": [ { "name", "role", "text", "languages": [string], "linkedin" } ] },
  "credentials": { "title", "items": [ { "name", "status", "text", "url" } ] },
  "zug": { "title", "text", "image": ImageRef },
  "legal": { "title", "lines": [string] },
  "sources": [string] }

7. assets.json
{ "seoTitle", "metaDescription", "title", "intro", "disclosure",
  "howItWorks": [ { "n", "title", "text" } ],
  "recentActivity": [ { "date", "type": "offered" | "wanted", "item", "text", "source" } ],
  "requestForm": { "title", "text", "fields": [ { "name", "label", "type", "required": boolean } ] },
  "cta": Cta, "sources": [string] }

8. contact.json
{ "seoTitle", "metaDescription", "title", "intro",
  "form": { "title", "responsePromise", "fields": [ { "name", "label", "type", "required": boolean,
      "options": [string] } ], "consentText", "submitLabel", "successTitle", "successText" },
  "channels": [ { "label", "value", "href", "note" } ],
  "urgent": { "title", "text" },
  "office": { "title", "lines": [string] },
  "sources": [string] }

9. careers.json
{ "seoTitle", "metaDescription", "title", "intro", "whatWeLookFor": [string],
  "howToApply": { "title", "text", "email" }, "openRoles": [ { "title", "location", "text" } ],
  "sources": [string] }

10. legal.json
{ "impressum": { "title", "sections": [ { "title", "lines": [string] } ] },
  "privacy": { "title", "updated", "sections": [ { "title", "paragraphs": [string] } ] },
  "cookies": { "title", "sections": [ { "title", "paragraphs": [string] } ] },
  "sources": [string] }

11. glossary.json
{ "seoTitle", "metaDescription", "title", "intro", "terms": [ { "term", "definition", "related": [string] } ] }
(40 terms, alphabetical, definitions of 1-3 sentences.)

12. insights.json
{ "seoTitle", "metaDescription", "title", "intro",
  "articles": [ { "slug", "title", "date", "readingMinutes", "excerpt", "tags": [string],
     "sections": [ { "heading", "paragraphs": [string] } ], "sources": [string], "image": ImageRef } ] }
(six articles, each 450-800 words, every figure sourced in the article's sources array.)
