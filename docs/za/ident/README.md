# The scroll-driven ident

The two clips the client supplied (`../assets/ident-navy.mp4`, `../assets/ident-white.mp4`, 640 x 640, 24 fps, 4.04 s) are the brand ident: the plane flies an S-shaped route and the orange swoosh forms behind it until the pair locks up into the logo. Playing an mp4 in a hero breaks the brief's data-cost rule (no autoplay video in the hero, mobile first), so the ident is rebuilt as a scroll-driven SVG.

How it is made:

1. `mark-paths.json` holds the swoosh outline and the plane outline, taken from the logo SVG (paths 12 and 20).
2. `skeleton.js` rasterises the swoosh, runs a distance transform and a shortest path along the medial axis between the two ends, smooths it and emits `centreline.json` (a cubic path, its length, its end point under the plane). `centreline-overlay.png` shows the result over the mark.
3. `ident-proto.js` renders the mechanism: the swoosh outline is a clipPath; a thick orange stroke along the centreline is revealed with `stroke-dashoffset` as scroll progress rises from 0 to 1; the plane is translated to the point at that length and rotated by the tangent, relative to its resting angle. `ident-sheet.png` shows eight frames.

In the site the same mechanism lives in the `Ident` component and is driven from the hero act's progress. Under `prefers-reduced-motion` it renders the finished mark and never moves.

Run: `NODE_PATH=/opt/node22/lib/node_modules node skeleton.js <dir>` then `node ident-proto.js <dir>`; both need Playwright's Chromium.
