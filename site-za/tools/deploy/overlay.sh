#!/usr/bin/env bash
# Runs INSIDE the Higgsfield sandbox (sandbox_exec) after `website_repo_access checkout`.
# Makes the platform repository's app/ an exact mirror of site-za/app: everything authored is
# replaced from the zip; the repo root (CI workflow), app/packages (vendored) and app/node_modules
# are left alone. Arguments: SRC_ZIP_URL CHECKOUT_PATH
set -euo pipefail
SRC_ZIP_URL=$1; R=$2
cd "$R"
curl -fsSL "$SRC_ZIP_URL" -o /home/user/fhs-za-src.zip
unzip -tq /home/user/fhs-za-src.zip >/dev/null
if [ -d app ]; then
  find app -mindepth 1 -maxdepth 1 ! -name packages ! -name node_modules -exec rm -rf {} +
fi
unzip -q -o /home/user/fhs-za-src.zip -d "$R"
echo "images: $(ls app/public/assets/img | wc -l)  engine: $(ls app/src/vendor/scrollcraft)"
git add -A
echo "--- changes: $(git status --short | wc -l)"
git -c user.name="Flight Hour Solution build" -c user.email="build@flighthoursolution.com" commit -q -m "Mirror site-za/app from the FHS-2 branch" || echo "nothing to commit"
git log --oneline | head -3
echo SANDBOX_COMMIT_DONE
