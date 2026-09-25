#!/bin/bash
# Zips the authored South African site (site-za/app) for the Higgsfield sandbox: everything except
# dependencies, build output and the platform's vendored packages (the platform repository holds those).
# Usage: bash site-za/tools/deploy/mkzip.sh [output.zip]   (default: /tmp/fhs-za-src.zip)
set -e
OUT=${1:-/tmp/fhs-za-src.zip}
cd "$(cd "$(dirname "$0")" && pwd)/../.."
rm -f "$OUT"
zip -qr "$OUT" app -x 'app/node_modules/*' 'app/dist/*' 'app/.tanstack/*' 'app/.output/*' 'app/.wrangler/*' 'app/packages/*' 'app/packages/*/node_modules/*'
ls -la "$OUT"
unzip -l "$OUT" | tail -1
