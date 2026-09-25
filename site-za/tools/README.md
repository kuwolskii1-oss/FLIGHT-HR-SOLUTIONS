# Site tools (South African site)

Quality checks and deploy helpers for `site-za/app`. Nothing here ships.

## Setup

Playwright is expected as a global install (`NODE_PATH=/opt/node22/lib/node_modules` on the
build machine) and axe-core in `site-za/tools/node_modules` (`npm install axe-core`).

## Checks

| Script | What it does |
|---|---|
| `cd site-za/app && bun ../tools/validate-content.mjs` | Content rules over `src/content/*.json`: zod schema, headline and paragraph limits, home block word counts, dashes, placeholders, banned words, careful wording, hrefs against the sitemap, POPIA consent, one label per intent. |
| `bash qa/gate.sh` | File gate: placeholders, dashes, raw hexes, SSR safety, reduced motion coverage, fixed labels, branding, JSON validity, the vendored engine's checksums, no video, no animation over 600 ms. |
| `node qa/qa.js <base> qa/out/qa qa/routes.txt` | Every route at 390/700/1000/1440 px: screenshots, axe-core (WCAG 2.x A/AA and best practice), console errors, internal links, weight. |
| `node qa/factors.js <base> qa/routes.txt qa/out/factors.json` | The build prompt's Agent 4 table: words and actions per screen, headline and paragraph length, longest animation, stagger, reduced motion, horizontal overflow, page weight, first readable text on throttled 3G. |
| `node qa/interact.js <base>` | Header dropdowns and the mobile panel with the keyboard and by tap, skip link, focus trap, Escape, accordion. |
| `node qa/forms.js <base>` | Submits every form empty and filled; reports validation, the shake, the consent check and the mailto fallback. |
| `node qa/serve-dist.mjs ../app 4700` | Serves the production build locally (Worker bundle with a stubbed `cloudflare:workers`, gzip-compressed assets) so weight and load times are measured on real output. |
| `node qa/textdump.js <base> qa/out/text / /about` | Dumps a page's visible copy for proofreading. |

`<base>` is `http://127.0.0.1:4600` for the dev server or `http://127.0.0.1:4700` for the
production server.

## Deploy helpers

`deploy/mkzip.sh` and `deploy/overlay.sh` are the two halves of the runbook in `../DEPLOY.md`.
