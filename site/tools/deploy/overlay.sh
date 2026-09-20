#!/usr/bin/env bash
# Runs INSIDE the Higgsfield sandbox (sandbox_exec) after `website_repo_access checkout`.
# Makes the platform repository's app/ an exact mirror of site/app: everything authored is
# replaced from the zip; the repo root (CI workflow), app/packages (vendored) and app/node_modules
# are left alone. Arguments: SRC_ZIP_URL CHECKOUT_PATH
set -euo pipefail
SRC_ZIP_URL=$1; R=$2
cd "$R"
curl -fsSL "$SRC_ZIP_URL" -o /home/user/fhs-src.zip
unzip -tq /home/user/fhs-src.zip >/dev/null
if [ -d app ]; then
  find app -mindepth 1 -maxdepth 1 ! -name packages ! -name node_modules -exec rm -rf {} +
fi
unzip -q -o /home/user/fhs-src.zip -d "$R"
echo "film files: $(ls app/public/assets/world | wc -l)"
git add -A
echo "--- changes: $(git status --short | wc -l)"
git -c user.name="Flight Hour Solution build" -c user.email="build@flighthoursolution.com" commit -q -m "Mirror site/app from the FHS-2 branch" || echo "nothing to commit"
git log --oneline | head -3
echo SANDBOX_COMMIT_DONE
