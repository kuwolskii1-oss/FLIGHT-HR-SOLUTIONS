# Deploy runbook

How to rebuild and redeploy the website from this repository alone. Nothing outside the
repository is needed except access to the Higgsfield account that hosts the site.

## What you need

- This branch (`FHS-2`), Bun 1.4 and Node 22 for the local checks.
- The Higgsfield website tools (the `higgsfield` MCP server) connected to the account that owns
  the site. The site record: id `48176c0d-f47e-45a3-936f-789c3cdf7424`, slug
  `flighthoursolution`, live at `https://flighthoursolution.higgsfield.app`. If the id is ever
  in doubt, `list_websites` returns it.
- No secrets live in the repository. The only optional secret is the contact form's mail
  provider key (`RESEND_API_KEY`, plus `ENQUIRY_TO` and `ENQUIRY_FROM`), set with the
  platform's `website_secrets` tool, never in source. Without it the form falls back to a
  prepared email, which is how the site was handed over.

## 1. Check the tree locally

```bash
cd site/app
bun install --frozen-lockfile
bun run typecheck && bun run lint && bun run test && bun run build
```

`bun run build` runs the platform's `check:ui` gate first, then the Worker build, exactly as
the platform's CI does. Optional but recommended before a deploy: the checks in
`site/tools/README.md` (content validator, gate, Playwright pass).

## 2. Package the authored tree

```bash
bash site/tools/deploy/mkzip.sh /tmp/fhs-src.zip
```

The zip holds `app/` without dependencies, build output or the vendored `app/packages`
(the platform repository already has those). The film and images are in the zip: everything
the site needs is in git, nothing has to be regenerated.

## 3. Hand the zip to the platform

1. `media_upload` with filename `fhs-src.zip` (content type `application/zip`). It returns a
   presigned `upload_url`, a `media_id` and a permanent download `url`.
2. Upload the bytes: `curl -X PUT -H "Content-Type: application/octet-stream" --data-binary @/tmp/fhs-src.zip '<upload_url>'` (expect HTTP 200).
3. `media_confirm` with that `media_id` and type `file`.

## 4. Mirror it into the platform repository

1. `website_repo_access` with operation `checkout` for the website id. It returns
   `checkout_path` (for this site it has been `/home/user/website-4f80079f26b866cccce8d98a`)
   and reserves the hosted sandbox for 15 minutes.
2. `sandbox_exec` (timeout 120 seconds) with the contents of `site/tools/deploy/overlay.sh`
   written to a file and run as `bash overlay.sh '<download url>' '<checkout_path>'`. The
   script replaces everything under `app/` except `app/packages`, keeps the repository root
   (the CI workflow) untouched, stages and commits. It ends with `SANDBOX_COMMIT_DONE`.
   The sandbox is discarded about ten seconds after a call returns, so push straight away.
3. `website_repo_access` with operation `push`. It refuses uncommitted files and
   non-fast-forward updates.

## 5. Deploy and confirm

1. `deploy_website` for the website id. The platform's CI installs, typechecks, lints, tests
   and builds, then ships the live site (there is no separate preview). The call may time out
   at sixty seconds while the build runs; that does not cancel the build.
2. `website_status` until `production.status` is `deployed` with `error` null. A failed
   build returns its log in the `deploy_website` result.
3. The address answers HTTP 401 to visitors who are not signed in to Higgsfield until the
   account owner opens it; that is a platform setting, not a build fault.

Do not call `publish_website`: it lists the site on the platform's public community feed and
was deliberately not done.

## Starting again from nothing

If the site record no longer exists: call `get_workflow_instructions` with
`{ workflow: "website-builder-flow" }`, then `create_website` with type `website` and the
`scroll-scrub` template, and run steps 2 to 5 against the new id. The overlay replaces the
scaffold's `app/` wholesale, so the result is this repository's site on the new record; only
the subdomain (and therefore `SITE_URL` in `site/app/src/site/config.ts`) would differ.

## Going live on the client's domain

Set `INDEXABLE` to `true` and `SITE_URL` to the production origin in
`site/app/src/site/config.ts`, redeploy, and attach the domain on the platform side. The
launch decisions the copy still waits for are listed in `docs/website/README.md` and
`docs/website/open-questions.md`.
