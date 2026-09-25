#!/bin/bash
# Mechanical gate over the site's own files (placeholders, dashes, palette, assets, SSR safety,
# reduced motion, CTA labels, branding, animation mode, banned words, JSON validity).
# Usage: bash site/tools/qa/gate.sh   (from anywhere)
A=$(cd "$(dirname "$0")/../../app" && pwd)
OWN="$A/src/routes $A/src/components/site $A/src/site $A/src/scroll-scrub-scenes.ts $A/src/content $A/src/app-meta.json $A/design-brief.md"
echo "== 1 placeholders"; grep -rnE "lorem ipsum|REMOVE_THIS|blank-app-v1|<[a-z ]+ hex>|<kicker>|<scene headline>|TODO|TBD|\[CLIENT" $OWN --include=*.ts --include=*.tsx --include=*.json --include=*.md | grep -v "clientToConfirm" | head
echo "== 2 em/en dashes in user-visible strings (comments and the template README excluded)"; grep -rn "—\|–" $A/src/content $A/src/routes $A/src/components/site $A/src/scroll-scrub-scenes.ts | grep -v "^\s*//\|/\*\| \* \|routes/README.md" | head
echo "== 3 off-palette hexes"; grep -rnoiE "#ff5c1a|#ff6b35|#e8590c|#f97316|#ea580c|#d9480f|#22d3ee|#00e5ff|#00ff88|#4ade80|#8b5cf6|#a855f7|#7c3aed|#0a0a0a" $A/src/site $A/src/scroll-scrub-scenes.ts | head
echo "== 4 eyebrows on home (budget 4)"; grep -c "eyebrow=" $A/src/routes/index.tsx
echo "== 5 h-screen"; grep -rn "h-screen" $A/src/routes $A/src/components/site $A/src/site | head
echo "== 6 SSR: browser globals at module top level"; grep -rnE "^(const|let|var) .*= *(window|document|localStorage|navigator)\." $A/src/routes $A/src/components/site $A/src/site | head
echo "== 7 reduced motion coverage (site.css, MotionProvider)"; grep -c "prefers-reduced-motion" $A/src/site/site.css $A/src/components/site/MotionProvider.tsx
echo "== 8 contact CTA labels in content"; grep -rhoE '"label": *"(Talk to us|Send us a workscope)"' $A/src/content | sort | uniq -c
echo "== 9 platform branding in user-visible files"; grep -rni "higgsfield\|quanta\|powered by" $A/src/routes $A/src/components/site $A/src/site $A/src/content $A/src/scroll-scrub-scenes.ts | grep -v "reportHiggsfieldError\|higgsfield-error-reporting\|design-inspector\|HF_DESIGN\|APP_HOST_ZONES\|higgsfield.app\|higgsfield-dev.app\|Higgsfield hosting\|Higgsfield platform\|Higgsfield (Seedance\|hosted by\|hosting platform\|Higgsfield website platform\|Higgsfield provides\|Higgsfield, the website\|Higgsfield may" | head
echo "== 10 animation mode and film"; grep -n "^Animation mode:" $A/design-brief.md; ls $A/public/assets/world/*.mp4 | wc -l; grep -c "<" $A/src/scroll-scrub-scenes.ts
echo "== 11 banned words in rendered content (sources/notes excluded by the validator; this is the raw grep)"; grep -rnoiE "\b(world-leading|one-stop|holistic|seamless|elevate|unleash|next-gen|revolutioni[sz]e|innovative|cutting-edge|passionate|synergy)\b" $A/src/content | head
echo "== 12 JSON validity"; for f in $A/src/content/*.json; do node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" "$f" && echo "  ok $(basename $f)" || echo "  INVALID $f"; done
