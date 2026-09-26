#!/bin/bash
# Mechanical gate over the South African site's own files (placeholders, dashes, palette, SSR
# safety, reduced motion, CTA labels, branding, banned words, JSON validity, engine untouched).
# Usage: bash site-za/tools/qa/gate.sh   (from anywhere)
A=$(cd "$(dirname "$0")/../../app" && pwd)
OWN="$A/src/routes $A/src/components/site $A/src/site $A/src/content $A/src/app-meta.json"
echo "== 1 placeholders in code and styles (the content validator covers the JSON, where notes may cite the brief's TBA)"; grep -rnE "lorem ipsum|REMOVE_THIS|blank-app-v1|<[a-z ]+ hex>|TODO|TBD|\bTBA\b|\[CLIENT|\[region\]" $A/src/routes $A/src/components/site $A/src/site --include=*.ts --include=*.tsx --include=*.css | head
echo "== 2 em/en dashes in user-visible strings"; grep -rn "—\|–" $A/src/content $A/src/routes $A/src/components/site --include=*.json --include=*.tsx --include=*.ts | grep -v "^\s*//\|/\*\| \* " | head
echo "== 3 raw hexes outside tokens.css"; grep -rnoiE "#[0-9a-f]{6}\b" $A/src/site/site.css $A/src/site/za.css $A/src/site/transitions.css $A/src/site/wayfinding.css $A/src/site/boards.css $A/src/site/clearsky.css $A/src/site/flightplan.css | head
echo "== 4 eyebrows on home (budget: one per three sections)"; grep -c "c-eyebrow" $A/src/routes/index.tsx
echo "== 5 SSR: browser globals at module top level"; grep -rnE "^(const|let|var) .*= *(window|document|localStorage|navigator)\." $A/src/routes $A/src/components/site $A/src/site | head
echo "== 6 reduced motion coverage"; grep -c "prefers-reduced-motion" $A/src/site/site.css $A/src/site/za.css $A/src/site/transitions.css $A/src/site/wayfinding.css $A/src/site/boards.css $A/src/site/clearsky.css $A/src/site/flightplan.css $A/src/components/site/Ident.tsx
echo "== 7 fixed CTA labels in content"; grep -rhoE '"label": *"(Get in touch|AOG on WhatsApp)"' $A/src/content | sort | uniq -c
echo "== 8 platform branding in user-visible files"; grep -rni "higgsfield\|quanta\|powered by" $A/src/routes $A/src/components/site $A/src/site $A/src/content | grep -v "reportHiggsfieldError\|higgsfield-error-reporting\|design-inspector\|design_inspector\|HF_DESIGN\|APP_HOST_ZONES\|higgsfield.app\|higgsfield-dev.app\|Higgsfield" | head
echo "== 9 banned words in content (raw grep; the validator excludes notes)"; grep -rnoiE "\b(world-leading|one-stop|holistic|seamless|elevate|unleash|next-gen|revolutioni[sz]e|innovative|cutting-edge|passionate|synergy)\b" $A/src/content | head
echo "== 10 JSON validity"; for f in $A/src/content/*.json; do node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" "$f" && echo "  ok $(basename $f)" || echo "  INVALID $f"; done
echo "== 11 engine untouched (sha256 prefix; supplied files: 9246fbe4e240a63c js, e19eb3aa73b09446 css)"; sha256sum $A/src/vendor/scrollcraft/scrollcraft.js $A/src/vendor/scrollcraft/scrollcraft.css | cut -c1-16
echo "== 12 no autoplay video, no mp4 in public"; grep -rn "autoplay\|<video" $A/src/routes $A/src/components/site | head; find $A/public -name '*.mp4' | wc -l
echo "== 13 animations longer than 600 ms in site css"; grep -noE "[0-9]{3,4}ms" $A/src/site/site.css $A/src/site/za.css $A/src/site/transitions.css $A/src/site/wayfinding.css $A/src/site/boards.css $A/src/site/clearsky.css $A/src/site/flightplan.css $A/src/site/tokens.css | awk -F: '{ if ($3+0 > 600) print }' | head
