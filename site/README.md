# Flight Hour Solution website

The new website for Flight Hour Solution GmbH, built on the Higgsfield website platform
(React 19 + TanStack Start, server-rendered on a Cloudflare Worker) and designed from the
research and blueprint in `docs/research/` (in particular `08-locomotive-design-blueprint.md`).

Live review address: https://flighthoursolution.higgsfield.app (Higgsfield website id
`48176c0d-f47e-45a3-936f-789c3cdf7424`). The site is deployed from the Higgsfield-hosted
repository through the Higgsfield website tools; this folder is the mirror of that
repository's `app/` project and of the content brief.

## Layout

| Path | What it is |
|---|---|
| `app/design-brief.md` | The design brief the Higgsfield build flow requires (concept, palette, type, animation mode, journey, section plan, CTA inventory) |
| `app/src/site/tokens.css` | Design tokens: colour, fluid type ramp, spacing scale, motion, breakpoints, section themes |
| `app/src/site/site.css` | The site's own stylesheet: base, objects (`o-`), components (`c-`), journey restyling, reveals |
| `app/src/site/fonts.css` | Self-hosted IBM Plex Sans and Mono (SIL Open Font License), files in `app/public/fonts/` |
| `app/src/site/*.ts` | Config (`INDEXABLE`, site URL), content types and loader, SEO head helper, image map, the contact server function |
| `app/src/components/site/` | Header with menu panel, footer, motion provider (Lenis + GSAP), ruled lists, stats, media frames, steps, FAQ, forms, CTAs |
| `app/src/routes/` | File-based routes: home (scroll-scrub journey), services, engines, industries, about, assets, insights, glossary, careers, contact, legal pages, robots and sitemap |
| `app/src/scroll-scrub-scenes.ts` | The five chapters of the home-page film and their clip and poster paths |
| `app/src/content/*.json` | All copy, written from the research dossier and validated against `content-brief/CONTENT-SCHEMA.md` |
| `app/public/assets/world/` | The generated 15 second film cut into five segments (desktop and mobile encodes, exact-frame posters) |
| `app/public/assets/img/` | Generated illustration set (WebP, two sizes); real photography replaces it at launch |
| `app/public/brand/`, favicons, `site.webmanifest`, `og/` | The client's own logo, the head kit and the social preview image |
| `content-brief/` | The schema and the voice-and-facts rules the copy was written and checked against |

Template-owned files (`app/src/module/**`, `app/packages/**`, the shadcn kit under
`app/src/components/ui/`, `app/src/layouts/`, `app/src/landing-content.ts`) are left as the
platform ships them; the `/app` scaffold route redirects to the home page.

## Working on it

```bash
cd site/app
bun install            # dependencies (Bun 1.4)
bun run dev            # local preview at http://localhost:3000
bun run typecheck      # regenerates the route tree and type-checks
bun run lint
bun run build          # runs the template's UI contract check, then the Worker build
```

Deploying goes through the Higgsfield website tools (checkout in the hosted sandbox, commit,
push, `deploy_website`). Every deploy ships the live site; there is no separate preview.

## Switches and secrets

- `INDEXABLE` in `app/src/site/config.ts` is `false` while the site is in review: every page
  carries `noindex` and `robots.txt` disallows crawling. Set it to `true` (and update
  `SITE_URL` to the production domain) at launch.
- The contact form calls a server function. When the hosting settings hold a `RESEND_API_KEY`
  (and optionally `ENQUIRY_TO`, `ENQUIRY_FROM`), enquiries are emailed to the company;
  without it the visitor's email program opens with the enquiry prepared. No personal data is
  stored on the server either way.
- No analytics and no marketing cookies are loaded.

## Provenance of the visuals

The film, the storyboard and the eleven illustrations were generated with Higgsfield
(Seedance 2.5 and Nano Banana 2, 19 September 2026) from prompts written for this brief; they
are illustrations of the work, not photographs of the company. The logo, favicon and colours are
the client's own. Fonts: IBM Plex, SIL Open Font License.
