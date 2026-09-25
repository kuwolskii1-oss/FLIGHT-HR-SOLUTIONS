# Blueprint: Flight Hour Solution South Africa

Agent 2 (critic) output, 25 September 2026. Built from the five reference records in
`docs/za/research/` (Willis Lease, Lufthansa Technik, Air Charter Service, AJW Group, IBA). Two
further candidates (GE Aerospace, Joby) were shortlisted as motion references but their studies
did not complete in this run; the motion grammar below therefore comes from the brief's principles
and the group's existing design system rather than from a studied aviation site, and both remain
worth studying before the second iteration.

## Concept sentence

A South African aviation services company that routes every visitor to the right door in one
screen, then earns trust by showing how it verifies before it commits.

## 1. Scoring table

Scores 1 to 5. Fit: to the client's audience and the five doors. Clarity: contribution to being
understood within ten seconds. A11y: accessibility cost (5 = none). Perf: performance and data cost
(5 = none). Orig: originality (1 = recognisable as another studio's work). Mobile: how well it
survives a 390 px phone on expensive data.

| # | Pattern (where seen) | Fit | Clarity | A11y | Perf | Orig | Mobile | Verdict |
|---|---|---|---|---|---|---|---|---|
| 1 | Service doors as real links in the header, plus one accent action (ACS, Willis) | 5 | 5 | 5 | 5 | 4 | 4 | Borrow |
| 2 | Persistent urgent channel in the header at both widths (AJW pennant, LHT side tab, ACS bottom strip) | 5 | 4 | 4 | 5 | 4 | 5 | Borrow, as one control, one colour |
| 3 | Question-format router directly under the hero (Willis cards, AJW tiles) | 5 | 5 | 5 | 5 | 3 | 5 | Adopt as the "What do you need?" list |
| 4 | Light first form with a passengers or cargo switch (ACS) | 5 | 4 | 4 | 5 | 4 | 5 | Borrow for the charter form |
| 5 | Same closing banner with a single button on every service page (IBA) | 4 | 4 | 5 | 5 | 3 | 5 | Borrow as the closing band |
| 6 | Text never placed on photographs; solid ground beside or below (LHT, Willis, ACS) | 5 | 4 | 5 | 5 | 3 | 5 | Rule |
| 7 | One-line description under each menu link (IBA, Willis mega menu) | 3 | 4 | 4 | 5 | 4 | 3 | Not now: adds words to a menu of 27 links |
| 8 | Proof tiles with figures under the intro (LHT, ACS) | 2 | 4 | 5 | 5 | 3 | 5 | Rejected: the company has no sourced figures yet |
| 9 | Named people with a direct line at the end of each door (LHT, AJW) | 5 | 3 | 5 | 5 | 4 | 5 | Wanted; blocked until the client names people |
| 10 | Company details page and a registration line in the footer (AJW, IBA, Willis) | 5 | 3 | 5 | 5 | 3 | 5 | Adopt (Companies Act s32) |
| 11 | Slim sticky header of about 60 px with the logo returning home (IBA) | 4 | 4 | 5 | 5 | 3 | 5 | Adopt, 72 px for the badge and two actions |
| 12 | Mobile drawer as a flat accordion with Escape and a focus trap (ACS) | 5 | 4 | 5 | 5 | 3 | 5 | Adopt |
| 13 | Hover and state transitions of 100 to 300 ms ease-out (LHT) | 4 | 3 | 5 | 5 | 2 | 5 | Adopt as the token scale |
| 14 | Mobile bottom action strip with three cells (ACS) | 3 | 3 | 3 | 4 | 4 | 3 | Rejected: a third fixed band and a second action per screen |
| 15 | Rotating hero carousel (LHT, AJW) | 1 | 1 | 2 | 1 | 1 | 1 | Rejected |
| 16 | Autoplay film hero, 6.9 MB, no words (ACS) | 1 | 1 | 3 | 1 | 2 | 1 | Rejected |
| 17 | Uniform 1 s opacity fade on every block with a hidden first frame (Willis) | 1 | 1 | 1 | 3 | 1 | 2 | Rejected |
| 18 | WebGL particle hero that never stops (IBA) | 1 | 1 | 2 | 1 | 2 | 1 | Rejected |
| 19 | Mega menu of 60 or more links, three levels deep on mobile (IBA, AJW, LHT) | 1 | 1 | 2 | 4 | 1 | 1 | Rejected |
| 20 | Newsletter pop-up over the fold (LHT) | 1 | 1 | 1 | 4 | 1 | 1 | Rejected |

## 2. Primary reference and borrowed patterns

Primary reference for the design system: the group's own system, already built for the Swiss site
(`docs/research/08-locomotive-design-blueprint.md`, tokens in `site/app/src/site/tokens.css`). The
brief asks for one brand across both companies, and none of the five studied sites has a type or
spacing system worth taking over it; IBA and Lufthansa Technik confirm its choices (hierarchy by
weight and size rather than uppercase, body at 16 to 18 px, a measure near 60 characters).

Borrowed patterns, at most four:

1. Doors in the bar with one accent action (pattern 1).
2. The persistent urgent control, one colour, at both widths (pattern 2).
3. The light first form with a segmented switch (pattern 4).
4. The identical closing band on every door page (pattern 5).

Everything else on the page is the brief's structure or the group's system. Nothing is taken from
a studied site as an asset, a sentence or an identifiable layout.

## 3. Design tokens

Colour (six roles and one accent): navy `#1C205C` (brand ground), deep navy `#0C1022`, ink
`#12152E` (text), paper `#F4F1EB` (page ground), white `#FFFFFF` (raised), muted `#545872` on light
and `#A9ACC6` on dark, hairline `rgb(18 21 46 / 0.16)`. Accent orange `#EE7203` marks actions
only; `#A84E00` is the orange for text on paper (4.5:1). Error `#9B2C1F`, success `#1F6B45`. No
pure black anywhere.

Type: IBM Plex Sans (400, 500, 600) for everything, IBM Plex Mono (400, 500) for labels and
numbers. Fluid scale (Utopia, 390 to 1440 px): step -2 12 to 13 px, -1 14 to 15.5, 0 17 to 19, 1 20 to
25, 2 24.5 to 34, 3 29 to 45, 4 35 to 60, 5 42 to 80, display 56 to 148. Leading: display 1.02,
headings 1.1, sub 1.25, body 1.45. Measure 65ch; door copy 60ch.

Space: fluid scale micro 8 to 12 px, tiny 16 to 20, small 24 to 32, medium 32 to 40, large 48 to 80,
big 64 to 120, huge 96 to 160. Gutter 12 to 20 px, margin 20 to 40 px, header 72 px.

Motion (transitions.dev token scale, within the brief's factors): quick 150 ms (closes, text
swaps), fast 250 ms (dropdown and modal opens, tabs, icon swap), medium 350 ms (panel close,
toast), slow 400 ms (panel open), very slow 500 ms (success check, text reveal). Reveals 400 to
600 ms, stagger 40 to 70 ms, never more than 80. Easing `cubic-bezier(0.22, 1, 0.36, 1)` for
surfaces and reveals, `ease-in-out` only for swaps. Transform, opacity and filter only.

## 4. Navigation model

Desktop (1000 px and up): fixed 72 px header; logo returns home; five doors and About as visible
links, each with a chevron that opens a dropdown of that door's sections (menu dropdown, 250 ms
open, 150 ms close); the urgent control (AOG on WhatsApp, outlined pill) and the primary action
(Get in touch, filled orange) at the right. Below 1000 px: logo, urgent control, burger; the burger
opens a full-height navy panel (panel reveal, 400 ms) with an accordion per door, Contact, both
actions and the group line. Escape closes, focus is trapped, the page behind does not scroll. The
header hides on scroll down and returns on scroll up; it never hides while a dropdown or the panel
is open. Country switch (Switzerland) in the panel and the footer.

## 5. Page plan, one action per screen

Home (six screens in order: what this is, why it matters, proof, how to start, reassurance):

| Screen | Content | Action |
|---|---|---|
| 1 Hero (pinned, 2.6 viewport-heights) | Positioning line, one plain subline, the ident flying its route into the logo as the visitor scrolls | Get in touch |
| 2 What do you need? | Five doors, one line each and the typical timing | Each door is the action |
| 3 How we work (pinned, one step per screen) | Five steps in the brief's order | Read how we work |
| 4 What you can check | Verification, process, group, company details | Read our commitments |
| 5 Engine 360 | Early access, "is being designed" | Join the early access list |
| 6 Group, then close | Part of the group; one closing question | Get in touch, with AOG on WhatsApp beside it |

Door pages (Engines, Aircraft, Parts, Charter, Advisory), same skeleton: intro with who comes in,
typical timing and what to bring (action: the door's form label); one placeholder image revealed
on scroll; one section per capability (four to six), each a screen with title, one paragraph and up
to four bullets; the door's process (pinned steps) or verification grid; the full scope accordion
for procurement readers; the form (the only screen with a submit button); the closing band.
Charter carries the operator disclaimer on the page and under the form; Parts shows the WhatsApp
route when the visitor answers AOG yes.

Engine 360: early access page, what it is meant to do, status line, waitlist form. About: how we
work, who we serve, commitments, team (intro only until people are named), company details, group.
Contact: the five doors, the urgent block, the general form. Privacy notice (POPIA) and Legal
(company details, charter operator disclaimer, PAIA, website terms).

## 6. Motion principles for this site

- Purpose first. The ident shows the visitor's own scrolling doing something and resolves into the
  logo; pinned steps show one idea at a time; reveals confirm arrival. Nothing else moves.
- Transform, opacity and filter only. Hover and feedback about 200 ms; opens 250 to 400 ms;
  reveals 400 to 600 ms; every close faster than its open; ease-out curves; nothing bounces except
  the checkbox tick and the success check, which are feedback.
- Reveals fire once on entry, stagger 70 ms or less, and never hide content the visitor is already
  looking at: text is in the first paint, the reveal is a transform on top of visible markup, and
  nothing waits for JavaScript.
- Scrolling stays native. The engine's pinned stages are `position: sticky`, so the wheel is never
  trapped; there is no smooth-scroll library and no horizontal scroll on touch.
- Reduced motion removes every translation, shows the ident finished and every cue open.
- Under 1 MB per page without video. No autoplay video anywhere; the ident is an SVG of under 4 KB.

## 7. Rejected, one reason each

- Hero carousel: hides the message on every change and ignores reduced motion.
- Autoplay film hero: the brief bans it for data cost, and it said nothing on the studied site.
- Uniform long fades with hidden first frames: content gated by JavaScript on slow connections.
- WebGL particle hero: 410 KB and a permanent frame loop for decoration.
- Mega menus of 60 or more links: the opposite of obvious navigation; five doors fit in one level.
- Proof tiles with figures: no sourced figures exist; invented numbers are banned.
- Mobile bottom action strip: a third fixed band and a second action on every screen.
- Newsletter and campaign pop-ups over the fold.
- Uppercase heading systems and 130 character measures: flatten hierarchy and tire the eye.
- Third-party chat, captcha and multiple analytics tags on every page: most of the studied sites'
  weight, none of their value.
