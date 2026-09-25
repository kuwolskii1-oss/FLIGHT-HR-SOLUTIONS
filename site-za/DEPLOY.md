# Deploy runbook: South African site

How to rebuild and redeploy the South African site from this repository alone. Nothing outside
the repository is needed except access to the Higgsfield account that hosts it. The Swiss site's
runbook (`site/DEPLOY.md`) is the same procedure with different ids and paths.

## What you need

- This branch (`FHS-2`), Bun 1.4 and Node 22 for the local checks.
- The Higgsfield website tools (the `higgsfield` MCP server) connected to the account that owns
  the site. The site record: id `36a9708e-a93f-4760-bcbe-e2528e1a0b17`, slug
  `flighthoursolution-za`, live at `https://flighthoursolution-za.higgsfield.app`. If the id is
  ever in doubt, `list_websites` returns it.
- No secrets live in the repository. The optional secrets are the forms' mail provider key
  (`RESEND_API_KEY`), the sender (`ENQUIRY_FROM`) and per-door inbox overrides
  (`ENQUIRY_TO`, `ENQUIRY_TO_PARTS`, `ENQUIRY_TO_AOG` and so on), set with the platform's
  `website_secrets` tool, never in source. Without the key every form falls back to a prepared
  email to the door's inbox, which is how the beta was handed over.

## 1. Check the tree locally

```bash
cd site-za/app
bun install --frozen-lockfile
bun run typecheck && bun run lint && bun run build
cd ../tools && bash qa/gate.sh && (cd ../app && bun ../tools/validate-content.mjs)
```

`bun run build` runs the platform's `check:ui` gate first, then the Worker build, exactly as the
platform's CI does. The Playwright checks in `site-za/tools/README.md` run against a local
server: `bun run dev --port 4600` for the dev tree, or `node tools/qa/serve-dist.mjs app 4700`
for the production build (it serves `dist/` with a stub of the Workers runtime).

## 2. Package the authored tree

```bash
bash site-za/tools/deploy/mkzip.sh /tmp/fhs-za-src.zip
```

The zip holds `app/` without dependencies, build output or the vendored `app/packages` (the
platform repository already has those). Images, the engine and the content are in the zip:
everything the site needs is in git.

## 3. Hand the zip to the platform

1. `media_upload` with filename `fhs-za-src.zip` (content type `application/zip`). It returns a
   presigned `upload_url`, a `media_id` and a permanent download `url`.
2. Upload the bytes: `curl -X PUT -H "Content-Type: application/octet-stream" --data-binary @/tmp/fhs-za-src.zip '<upload_url>'` (expect HTTP 200).
3. `media_confirm` with that `media_id` and type `file`.

## 4. Mirror it into the platform repository

1. `website_repo_access` with operation `checkout` for the website id. It returns
   `checkout_path` and reserves the hosted sandbox for 15 minutes.
2. `sandbox_exec` (timeout 120 seconds) with the contents of `site-za/tools/deploy/overlay.sh`
   written to a file and run as `bash overlay.sh '<download url>' '<checkout_path>' '<commit
   message>'` (the message is optional). The script replaces everything under `app/` except
   `app/packages`, keeps the repository root (the CI workflow) untouched, stages and commits.
   It ends with `SANDBOX_COMMIT_DONE`. The sandbox is discarded about ten seconds after a call
   returns, so push straight away.
3. `website_repo_access` with operation `push`.

## 5. Deploy and confirm

1. `deploy_website` for the website id. The platform's CI installs, typechecks, lints, tests and
   builds, then ships the live site. The call may time out at sixty seconds while the build runs;
   that does not cancel the build.
2. `website_status` until `production.status` is `deployed` with `error` null.
3. The address answers HTTP 401 to visitors who are not signed in to Higgsfield until the account
   owner opens it; that is a platform setting, not a build fault.

Do not call `publish_website`: it lists the site on the platform's public community feed.

## Moving to the client's own hosting

The app is a standard TanStack Start site built for Cloudflare Workers (`dist/server/server.js`
plus `dist/client`). It can be deployed to the client's own Cloudflare account with Wrangler,
which is the recommended end state so that the repository, hosting, domain
(`flighthoursolution.co.za`) and secrets belong to the client.
