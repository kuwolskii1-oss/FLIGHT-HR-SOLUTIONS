# BRIEF: Flight Hour Solution, South Africa

The scroll-craft build brief for the South African site. Written under explicit delegation (the
client's build prompt and the FHS South Africa web brief stand in for the interview), before the
acts were authored. The critic's blueprint (`docs/za/blueprint.md`) supplies the design tokens and
the reference study; this file holds the parts scroll-craft asks for: grammar, feeling curve, peak,
signature move, tell-someone sentence, fingerprint.

## Who and what

Flight Hour Solution (Pty) Ltd, registered 2026, sister company of the Swiss engine consultancy.
Ten service lines grouped into five doors (Engines, Aircraft, Parts, Charter, Advisory) for very
different visitors: an AOG parts buyer on a phone with hours to spare, a lessor with months, a
mining logistics manager booking a charter, a government procurement team checking credentials.
The site's first job is routing; its second is trust for a company nobody has heard of yet. Mobile
first, data is expensive, no autoplay video.

## Grammar: chaptered editorial, with one bespoke opening

Not a filmic one-shot: a routing site has to be readable, skimmable and light. The home page is a
short chaptered editorial (six chapters, one idea per screen, at most one action per screen); each
door page is the same grammar at document pace. The one bespoke moment is the opening.

## The signature move

The client's two ident clips show the plane flying an S-shaped route while the orange swoosh forms
behind it until both lock up into the logo. On the site that film is rebuilt as a scroll-driven
SVG: the visitor's own scrolling flies the plane along the swoosh's centreline, the trail
accumulates behind it, and at the end of the first act the pair settles into the logo that sits in
the header. The ident is not a video, weighs under 4 KB, and never moves under reduced motion.

Tell-someone sentence: **it's the site where you fly the plane in the logo by scrolling, and it
lands exactly on the logo.**

## Feeling curve (home)

| # | Feeling | What causes it |
|---|---|---|
| 1 | Recognition | The positioning line and the plane setting off; the trail forms as you scroll and locks into the logo |
| 2 | Orientation | "What do you need?" and five plain doors, one line each, with typical timing |
| 3 | Confidence | Five numbered steps, one per screen, in the order the company actually works |
| 4 | Reassurance | What you can check: verification, process, group, company details |
| 5 | Curiosity | Engine 360, early access, honestly described as being designed |
| 6 | Resolve | The group line, then one closing question with one button and the urgent action as a link |

The peak is act 1 (the lock-up). It gets the largest span on the page (2.6 viewport-heights), the
quiet ground of the paper canvas and the only pinned stage before the steps. Nothing else on the
home page tries to compete: the doors are a list, the proof is a grid, the close is a sentence.

## Devices, in order

Home: pin with a bespoke SVG (ident) → flow with staggered reveal (doors) → pin with cues (steps,
one per screen) → flow with staggered reveal (proof) → flow (Engine 360 band) → flow (group) →
flow (close). Four families (pin, flow, cue, reveal) and never the same device twice in a row at
the pinned level. No scrub clips: the brief bans autoplay video and the mobile byte budget is the
constraint that matters.

Door pages: flow intro → image revealed on scroll → flow sections → pin with cues (the door's
process) or flow list with a progress rule drawn from --sc-p (nine-step transaction) → flow
(verification grid) → accordion (full scope) → form (the only button on the page) → close with
links only.

## Taste floor, applied

One type family (IBM Plex Sans, mono for labels), six colour roles from the shared brand tokens,
one accent (orange) that marks actions, no pure black, paper canvas, measure 60 to 65ch, UI
transitions 150 to 400 ms ease-out from the transitions.dev token scale, focus-visible everywhere,
no scroll cues, no `01 / 06` counters, no em dashes, no custom cursors (the "Early access" label that
rides beside the system cursor over the Engine 360 card was the client's request, and the cursor itself
stays), no invented figures.

## Reduced motion and no JavaScript

The ident renders complete. Every pinned act is rewritten to a flow act before the engine mounts,
so nothing pins; cues and reveals show their final state; the stepped lists stack. Forms post nothing without JavaScript: the
submit button opens a prepared email instead of a GET that would put personal data in the URL.

## Fingerprint row

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| fhs-za | Chaptered editorial | Visible doors with dropdowns, urgent action always on | Pinned bespoke SVG ident | pin, flow, pin, flow, flow, flow, flow | One question, two actions | Scroll flies the plane into the logo | Paper and navy, brand photography to follow | 4600 |

Differs from the Swiss site (its only sibling) on grammar (the Swiss home is a filmic scroll-scrub
journey), hero device (video scrub there), act shape, close pattern and signature move.

## What the verify pass must confirm

The build prompt's Agent 4 table (words per screen, one action per screen, headline and paragraph
length, longest animation 600 ms, stagger 80 ms or less, reduced motion, no horizontal scroll,
axe-core clean, no console errors, first readable text under two seconds on throttled 3G, under
1 MB per page, keyboard) plus the scroll-craft sheet: the plane never sits still while the page
moves, the copy clears contrast on every frame of the hero, the pinned steps read one at a time,
and the end resolves on the closing question with both actions visible.
