#!/bin/bash
S=${S:-$(pwd)}   # working directory holding dna.js, the site list and the shots/ output
LIST=$1; LOG=$2; EXTRA=$3
while read -r label url; do
  [ -z "$label" ] && continue
  echo "$label $url" > "$S/one_$label.txt"
  echo "$(date +%T) start $label" >> "$LOG"
  DNA_EXTRA_ARGS="$EXTRA" NODE_PATH=/opt/node22/lib/node_modules timeout -k 10 420 node "$S/dna.js" "$S/one_$label.txt" "$S/shots" >> "$LOG" 2>&1
  echo "$(date +%T) exit $label code $?" >> "$LOG"
  for pid in $(pgrep -f "chromium_headless_shel[l]-1194"); do kill -9 "$pid" 2>/dev/null; done
  sleep 2
done < "$LIST"
echo "$(date +%T) LISTDONE $LIST" >> "$LOG"
