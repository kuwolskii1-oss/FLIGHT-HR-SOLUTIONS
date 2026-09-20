# Site tools

Quality checks and deploy helpers used to build and verify the website. Nothing here ships;
`site/app` is the site.

## Setup

```bash
cd site/tools
npm install                      # playwright + axe-core (dev only)
npx playwright install chromium  # once per machine
```

## Checks (run against a local dev server: `cd site/app && bun run dev`)

| Script | What it does |
|---|---|
| `node qa/validate-content.js ../app/src/content` | Mechanical content rules: JSON, dashes, banned words, placeholders, headline lengths, fixed slugs, image keys, contact CTA labels and hrefs, hrefs against the sitemap, sourced statistics, identical company facts. Zero findings expected. |
| `bash qa/gate.sh` | The file-level gate (placeholders, palette, SSR safety, reduced-motion coverage, branding, animation mode, film files, JSON validity). |
| `node qa/qa.js http://localhost:3000 qa/out qa/routes.txt` | Every route at 390/700/1000/1440 px: screenshots, axe-core (WCAG 2.x A/AA + best practice), console errors, internal link check, per-route weight. `qa/routes.txt` lists the routes (one per line); regenerate it from the content files when pages are added. |
| `node qa/interact.js http://localhost:3000` | Mobile menu with the keyboard and by tap, skip link, focus trap and Escape, split headings. |
| `node qa/forms.js http://localhost:3000` | Fills and submits the contact and asset forms and reports the fallback. |
| `node qa/rm-film.js http://localhost:3000` | Confirms the film is not fetched under `prefers-reduced-motion`. |
| `node qa/nav.js http://localhost:3000` | Client-side navigation across page types: titles, descriptions, split chunks, 404 handling. |
| `node qa/textdump.js http://localhost:3000 qa/out/text / /about` | Dumps a page's visible copy for proofreading. |

Expected state at hand-over: 36 routes, zero axe violations, zero console errors, zero broken
links, zero hydration warnings (see `docs/website/README.md`).

## Deploy helpers

`deploy/mkzip.sh` and `deploy/overlay.sh` are the two halves of the deploy runbook in
`../DEPLOY.md`.
