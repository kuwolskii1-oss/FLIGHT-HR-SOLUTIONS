# scrollcraft engine (vendored, unmodified)

`scrollcraft.js` and `scrollcraft.css` are the engine of the scroll-craft skill by Nate Herk (public release 0.3.0, 4 September 2026), supplied to this project as `scrollcraft.zip`. They are copied byte for byte: the skill's rule is never to edit the engine, because the verification harness and the mobile video fixes depend on it. Page-specific behaviour lives in `src/components/site` and `src/site/site.css`.

The supplied archive carried no licence file. Confirm the licence terms with the skill's author before the public launch (listed in the open questions).

Engine facts that shape the site:

- `ScrollCraft.mount(root)` collects `[data-sc-act]` once and installs window listeners with no teardown, so the site navigates between pages as full documents (plain anchors, cross-document view transitions) and mounts the engine once per document.
- Every act publishes its progress as `--sc-p` on the act element; the ident and the CSS read it.
- Under `prefers-reduced-motion` the engine drops every translation and never fetches a clip; the site's own CSS finishes the job (ident static, reveals shown).
