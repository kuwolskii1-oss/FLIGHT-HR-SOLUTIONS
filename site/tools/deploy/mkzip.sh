#!/bin/bash
# Zips the authored site (site/app) for the Higgsfield sandbox: everything except dependencies,
# build output and the platform's vendored packages (which the platform repository already holds).
# Usage: bash site/tools/deploy/mkzip.sh [output.zip]   (default: /tmp/fhs-src.zip)
set -e
OUT=${1:-/tmp/fhs-src.zip}
cd "$(dirname "$0")/../.."
rm -f "$OUT"
zip -qr "$OUT" app -x 'app/node_modules/*' 'app/dist/*' 'app/.tanstack/*' 'app/.output/*' 'app/.wrangler/*' 'app/packages/*' 'app/packages/*/node_modules/*'
ls -la "$OUT"
unzip -l "$OUT" | tail -1
