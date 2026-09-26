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

## Images

`NODE_PATH=/opt/node22/lib/node_modules node img/dither.js` (from the repo root) turns the six
intro photographs into the dithered intro backgrounds: one small indexed PNG per page and layout
in `app/public/assets/img/dither/` (200 x 140 cells for desktop, 80 x 66 for phones, each pixel one
cell), which the site scales up and draws as dots (`app/src/site/dither.css`). Per-photograph
settings (invert, strength, gamma, crop focus) sit at the top of the script. Run it again when an
intro photograph changes.

## Deploy helpers

`deploy/mkzip.sh` and `deploy/overlay.sh` are the two halves of the runbook in `../DEPLOY.md`.

## preview/

A no-login preview of the beta for people without access to the staging host. `build-preview.mjs` fetches the server-rendered HTML of every route from the local production server (port 4700), keeps one header and footer, stacks the eleven `<main>` elements in one document (one visible at a time, chosen by the URL hash), rewrites links and asset paths, inlines the built stylesheet and the scroll engine, and appends `runtime.js`, a plain-script port of the client behaviour (header, menu, accordions, segmented controls, form validation, the ident, the page transition, the Engine 360 lens and its cursor label, and the check that lets a pinned act too tall for the screen flow). `preview.css` holds the few host-frame adjustments. `check-preview.js` walks the result in Chromium inside a stand-in for the host's page skeleton: navigation, deep links, history, forms, menu, keyboard, reduced motion, console and network errors. Output goes to `out/` (ignored by git).
