# Wayfinding: the South African site's UI refresh (25 September 2026)

The client judged the beta's UX and content right and its UI "very lame", and asked for the look
to be improved in varied, creative ways without changing the UX, for a parallax footer, for the
list style of a supplied navigation component, and for the Streamline icon library. This note
records what changed, why, and how it was checked. Structure, content, flows, URLs, anchors, form
fields, the scroll acts and their timing are unchanged.

## The idea

An airport tells strangers where to go with a small set of honest signs. The site now does the
same for aviation business: five doors, each signposted with a wayfinding pictogram in a solid
tile, a departure board for the doors, a boarding pass for "who comes in, typical timing, what to
bring", a flight plan for the process, and the logo's flight path as the thread from the hero to
the footer, which lands on a dusk horizon. The icon set the client chose, Streamline's Guidance
set, was drawn for signage and wayfinding, which is where the idea came from.

## How the design thinking was applied

The five skills distilled from the Satori Graphics video (see `.claude/skills/design-thinking-pass`)
set the direction before any CSS:

- **Voice first.** The site's copy is calm, exact and verification-first ("We verify before you
  commit", "Registered in 2026, we expect to be checked"). The visuals follow that temperature:
  precise geometry, solid signs, restrained orange, short damped motion, no bounce, no blobs.
- **Arrival states.** A lessor weighing an engine arrives cautious and wants proof; a maintenance
  controller with an aircraft on the ground arrives stressed, often on a phone. The urgent
  WhatsApp pill stays on every screen, the doors read at a glance, and proof sits beside decisions.
- **Predictive empathy.** The hero is quiet night navy with one warm horizon, not a shout. The
  one emotional cue is the company's registration number, set large in the data face on the
  "What you can check" card.
- **Perception gaps.** The intended order on the home page is positioning, then the doors, then
  proof. The old page made the doors a hairline table and left the process screens nearly empty;
  the board and the flight plan fix both.
- **Memory encoding.** The boarding pass on every door page and the departure board are the
  things to resolve: the brain recognises the airport and the metaphor does the remembering.

## What changed

- **Ground and colour.** The warm paper cream (a common generated-site tell) became a cool cloud
  (`#F2F3F7`) tinted toward the brand navy; night (`#080B1C`) and a mid navy were added for depth.
  Orange marks actions and the flight path only.
- **Type.** IBM Plex Sans Condensed 600 for display and headings: the brand's own Plex family in
  the proportions of airport signage. Labels lost their monospace capitals (sentence case, Plex
  Sans 500). Plex Mono is kept for real data only (the registration number).
- **Icons.** 37 pictograms from Streamline Guidance (CC BY 4.0, credited in every footer), in
  `src/site/pictograms.json`, mapped to doors, sections and items in `src/site/wayfinding.ts`.
  The 01 to 06 numbers on door sections are gone (those sections are not a sequence); each has a
  pictogram and a large faint one in its corner.
- **Buttons.** Pills with an arrow chip; the label rolls to a second copy on hover (the copy is
  hidden from assistive technology) and the arrow swaps. Controls are pills, tiles and inputs
  12 px, panels and media 20 px.
- **Home.** Night hero with the white plane and orange trail; the doors as a departure board
  (`DoorBoard.tsx`); the pinned steps over a flight plan whose route fills and whose waypoints light
  as each step cues in; credentials with a navy company card; Engine 360 as an instrument dial
  around the engine; the group as a route from Zug to South Africa; a closing band with the
  brand swoosh drifting behind it.
- **Door pages.** Pictogram label, the boarding pass, local navigation as chips, section
  pictograms, checklist bullets, the flight plan, credentials for what is verified, an
  information sign for the charter disclaimer, and the form as a white panel.
- **Footer (parallax).** A generated dusk horizon (`footer-horizon`, gpt_image_2_5, 21:9) that
  settles as the footer arrives, the tagline in display type on solid ground below it, and a
  curtain on wide screens: the page lifts off a footer that waits beneath it (`html.has-curtain`,
  set only when the footer fits the viewport). Reduced motion: no curtain, no parallax.
- **Menu.** The phone menu opens like the supplied kinetic navigation: orange, night and navy
  layers slide in, then the big condensed links rise, each with its door's tile.

## The supplied component

`Sterling Gate kinetic navigation` (21st.dev) is copied into `src/components/ui/` for reference;
only type-level edits were needed for the strict build. The project already had everything its
instructions ask for: shadcn is configured (`components.json`, `@/components/ui` resolves to
`src/components/ui`), Tailwind 4 and TypeScript are the stack, and `gsap` 3.15 and `tw-animate-css`
were already dependencies. The site's adaptation is `DoorBoard.tsx`: the list look, the "main"
CustomEase, the hover fill and the ambient shapes, drawn from each door's world (an engine face,
contrails, a parts rack, a route, a chart). The component's CSS variables were scoped to `.c-board`
and mapped to the brand instead of being added to `:root`, where names like `--color-neutral-100`
and `--gap` would shadow Tailwind and template tokens. GSAP (free for commercial use) loads only
on the two pages with a board.

## Checked (production build served locally)

| Check | Factor | Measured |
|---|---|---|
| Words per screen, home | 60 or fewer | 52 at 1440 px, 44 at 375 px (includes the hidden roll copies) |
| Buttons per screen | 1 | 1 on every page |
| Longest animation, stagger | 600 ms, 80 ms | 560 ms, 70 ms |
| Reduced motion | nothing moves, all visible | 0 pinned acts, 0 hidden cues, ident still, route and dial complete |
| Horizontal overflow at 375 px | 0 | 0 |
| axe-core, 11 routes | 0 | 0 |
| Console errors, broken links | 0 | 0 |
| First readable text, Fast 3G | under 2 s | 1.53 to 1.72 s on all 11 routes; 5.6 to 6.4 s on Slow 3G (the display font is not preloaded; preloading it cost about 0.1 s) |
| Weight per page | under 1 MB | 369 to 425 KB transferred |
| Keyboard and forms | as before | skip link, dropdowns, menu trap and Escape, accordions, every form's validation and mail fallback pass |

The footer curtain engages at 1366 x 768, 1280 x 800, 1536 x 864 and 1440 x 900.

## Open

- The template's `tests/landing-contract.test.ts` expects the home route to mention `ScrollScrub`;
  it failed before this refresh as well and does not block the platform's deploys.
- The GE Aerospace and Joby motion studies from the first pass are still open.

## Second pass: the runway hero, one list style, no page shortcuts (25 September 2026, evening)

The client kept the UX and picked out the home page's "What do you need?" list as the elegance
they want everywhere. They sent a reference for the home page (a travel landing page: an
airliner head-on at sunset, full bleed; the links in a frosted pill with the wordmark centred;
two frosted fact cards floating in the sky; a frosted panel on the runway holding a very large
capitalised headline, a line of text and one button), and asked for the in-page navigation
shortcuts to go, because the header already carries them.

### What changed

- **The home hero is a runway under glass** (`.c-runway`, `src/site/runway.css`). A generated
  photograph (gpt_image_2_5): a plain white twin-engine airliner lifting off at golden hour, the
  sun hidden behind the fuselage, navy sky at the top and a dark runway below. The first round
  put the sun disc exactly where the headline sits, which no amount of glass makes readable, so
  it was regenerated with the sun behind the aircraft. Desktop uses a 16:9 frame, phones a
  separate 9:16 one; the WebP files are 27 to 88 KB. The headline sits on a glass panel over the
  runway, in capitals in the display face, one sentence per line (the text is unchanged), with
  the line and the one button beside it. Two glass cards float in the sky with facts that are
  already on the page and can be checked: "5 steps, define to monitor" and the registration
  number. They were added to `home.json` with their sources; there are no counts of clients,
  years or deals. Glass is always tinted navy, and a scrim darkens the top of the photograph for
  the header and the bottom for the panel, so no text depends on the photograph being dark.
- **The ident no longer flies in the hero.** The pinned act is gone; the hero is one screen. The
  photograph eases in by a few per cent and drifts slower than the page as the hero leaves, and
  the cards drift faster (scroll-linked, transform only, still under reduced motion).
- **The header floats as glass on every page.** The links sit in a pill on the left, the logo is
  centred from 1200 px, and the urgent action and the burger are glass pills. The header now
  takes its colours from what is under the logo rather than from the page's left edge, so a navy
  board on a light section gets the white logo; photographs in light sections count as dark.
- **Every list reads like the door board** (`InfoBoard.tsx`, `src/site/boards.css`). One navy
  panel on a light ground, hairline rows, a pictogram tile and a big condensed title per row:
  "What you can check" on the home page, each door's capabilities (one board with a row per
  section; the section ids stay on the rows, so the header's dropdown links land on them), "How
  we verify parts", "Who we serve" and "Our commitments" on About, and "What it is meant to do"
  on Engine 360. These rows have no hover state, because they go nowhere; the door board keeps
  its hover. Company details on About, the charter operator disclaimer and the Engine 360 status
  note became navy signs of the same material.
- **The page shortcuts are gone.** The "On this page" chips under the intro of the five door
  pages and About repeated the header's dropdowns item for item; the component is deleted. The
  short "Related" lists beside the forms stay: they point to things the header does not list
  (the operator disclaimer, the transaction process, company details), so they are not
  duplicates.
- The old hero, card grid and door section styles were deleted with the markup that used them.

### Checked (production build served locally)

| Check | Factor | Measured |
|---|---|---|
| Words per screen, home | 60 or fewer | 47 at 1440 px, 40 at 375 px |
| Buttons per screen | 1 | 1 on every page |
| Longest animation, stagger | 600 ms, 80 ms | 560 ms, 70 ms |
| Reduced motion | nothing moves, all visible | 0 pinned acts, 0 hidden cues, hero photograph still |
| Horizontal overflow at 375 px | 0 | 0 |
| axe-core, 11 routes | 0 | 0 |
| Console errors, broken links | 0 | 0 |
| First readable text, Fast 3G | under 2 s | home 1.79 to 1.83 s over three runs (about 1.7 s before this pass), other routes 1.55 to 1.74 s; 5.6 to 7.1 s on Slow 3G |
| Weight per page | under 1 MB | 370 to 451 KB transferred (the home photograph adds 36 KB on a phone, 61 KB on a desktop) |
| Keyboard and forms | as before | skip link, dropdowns, menu trap and Escape, section links landing on board rows, every form's validation and mail fallback pass |

### The spinning counter (added the same evening)

The client supplied transitions.dev's "Spinning counter" and suggested it for a line about more
than 40 years in the business. That line is not on this site and cannot be: it comes from the
old Swiss website ("Our Team with more than 40 years experience", the Swiss team's combined
experience), this company was registered in 2026, the brief makes showing the Swiss engineers
conditional on their working South African jobs, and the content rules block any years figure
(`site-za/content-brief/CONTENT-SCHEMA.md`). The counter went where the page already shows
numbers that can be checked: the two glass fact cards in the hero, whose digits turn once and
land reel by reel, like a departure board settling (`Reel.tsx`, styles in `runway.css`).

Adapted to the brief: 560 ms per reel and 60 ms between reels (the original is 1400 ms and
90 ms); the digits are drawn as generated content, so the number exists once as real text for
screen readers and copying; the page is server-rendered on the true digits and the turn starts
from them, so no wrong number ever shows, with or without scripts; reduced motion gets no turn.
If the client confirms a years figure it can stand on, a third card can turn to it the same way.

The hero photograph is deliberately not marked high priority. With the hint, first paint on
Fast 3G rose to 1.87 s because the photograph competed with the stylesheet; without it the
stylesheet goes first and the navy gradient behind the glass holds the place until the photo
arrives. Raw measurements: `factors-runway.json`.

## Third pass: clear sky (25 September 2026, night)

The client sent a third reference, a bright flight-booking landing page, and asked for the whole
UI to be modelled on it: a grey utility strip over a white navigation row with centred links, a
dotted marker under the current link and one blue pill; a centred headline; a capsule-shaped sky
photograph whose aircraft breaks out past the capsule's ends; a rounded white card of fields
with round icon chips and a round action button; one accent colour on a white ground.

### How it maps onto this site

- **Header** (`SiteHeader.tsx`, `src/site/clearsky.css`). The strip carries what this site has
  in place of the reference's support, language and sign-in links: the group line, "AOG on
  WhatsApp" (the urgent action, in the orange text colour), the general inbox and the Swiss site.
  The row below holds the logo, the five doors and About with their dropdowns, and "Get in touch"
  as a navy pill. The current page is marked with a short row of orange dots. The header is solid
  and light on every page, so it no longer reads the section beneath it. On phones the strip
  folds away and the urgent action stays as an icon next to the menu button.
- **Hero.** The headline and line are centred. The photograph (gpt_image_2_5: a plain white
  twin-engine airliner head-on in a blue sky) is clipped to a capsule, and the aircraft, cut out
  of the same photograph with Higgsfield's background remover, is drawn on top without the clip,
  so its wings run past the capsule's ends as in the reference. On scroll the aircraft rises and
  grows a little while the capsule drifts the other way. The card below holds the two facts as
  fields with round icon chips and their spinning counters, and the one action. The reference's
  class tabs and search fields have no honest counterpart here (this site books nothing), so the
  card carries facts, not controls.
- **Colour and type.** A white ground with mist sections (`--color-mist`), hairline rings instead
  of heavy panels, one navy action colour (the reference's blue, taken from the brand's navy
  rather than a new blue) and orange kept for small signals: the current-page dots, the urgent
  line, checklist ticks, the counters' focus. Jost (OFL), a geometric sans in the Futura manner
  like the reference's, for headings, navigation and actions; IBM Plex Sans stays for reading.
- **Everything else.** Every board is now a white rounded card with hairline rows, round icon
  chips and a round navy arrow that turns orange on hover; inner page intros are white, the
  boarding pass a mist card, door and About images capsules like the hero's, the steps, Engine
  360 dial, group route, signs, company card and forms all on light grounds, and the closing band
  a centred mist panel. The phone menu keeps its navy layers (its button inverts to white), and
  the footer stays the one dark ground with its dusk horizon and parallax.

### Checked (production build served locally)

| Check | Factor | Measured |
|---|---|---|
| Words per screen, home | 60 or fewer | 56 at 1440 px, 36 at 375 px |
| Buttons per screen | 1 | 1 on every page |
| Longest animation, stagger | 600 ms, 80 ms | 560 ms, 70 ms |
| Reduced motion | nothing moves, all visible | 0 pinned acts, 0 hidden cues, aircraft and counters still |
| axe-core, 11 routes | 0 | 0 |
| Console errors, broken links | 0 | 0 |
| First readable text, Fast 3G | under 2 s | home 1.85 s, engines 1.58 s, contact 1.74 s |
| Weight per page | under 1 MB | 399 to 466 KB on a phone (the sky and the cut-out are 25 and 23 KB there) |
| Keyboard, menu and forms | as before | all pass; the preview's 49 checks pass |

The stylesheets are layered: `clearsky.css` is loaded last and restyles the wayfinding and board
layers underneath rather than rewriting them, so a later pass can still reach any earlier look.

## Fourth pass: sunset (26 September 2026)

The client reported that the hero aircraft was doubled, asked for the hero to be sunset themed,
and asked for the "How we work" stepper to be spruced up, leaving the idea open.

### The doubled aircraft

The third pass drew the aircraft twice: once inside the capsule photograph and once as the cut-out
on top. The cut-out moves with the scroll (it rises and grows) while the photograph drifts the
other way, so as soon as the page moved the photograph's own aircraft showed behind the cut-out:
two sets of wings and engines. Even at rest the two sat a few pixels apart, because the hero's
progress is not exactly 0.5 at the top of the page.

The fix is structural rather than a tweak to the motion: the capsule now holds a sky with no
aircraft in it at all, and the aircraft exists only as its own layer. Both come from one scene so
the light matches. The sky plate was generated first (gpt_image_2_5, 21:9, "only sky and clouds,
no aircraft"); the aircraft was then added to that exact plate with the same model's reference
editing, and cut out with Higgsfield's background remover. Two stray cloud fragments the remover
kept were cleared by keeping only the aircraft's own connected shape. Laid over the plate, the
cut-out matches the edited frame to within 4 levels in 255 across the sky, with no halo. The
preview check "hero sky is its own plate, the aircraft its own layer" guards against the old
combined photograph coming back.

### Sunset

The plate is a sunset: gold light flooding in from the left, coral and rose clouds low on the
right, dusky blue above. The aircraft carries that light (warm on its left side, violet shade on
its right). A soft gold and rose glow spills from the capsule onto the white page. The sunset
colours are tokens in `tokens.css` (`--color-sun`, `--color-sunglow`, `--color-ember`,
`--color-rose`, `--color-plum`, `--color-dusk`, `--color-twilight`), sampled from the plate and
deepened where white text sits on them. Files: `hero-sunset-{900,1800,2600}.webp` (the plate,
19, 45 and 65 KB) and `hero-jet-{900,1800,2600}.webp` (the aircraft with transparency, 25, 65
and 101 KB). The old `hero-sky` and `hero-plane` files are gone.

### The stepper: one evening's flight

`Steps.tsx` and `src/site/flightplan.css` (the pinned variant, used by How we work on Home and
About and the process sections of Engines and Advisory; the aircraft page's seven-step list keeps
its flowing variant).

- The pinned stage is a rounded sky panel that goes from sunset to night as the act plays: the
  sunset layer fades, the sun sinks below the horizon and the stars come out.
- The steps are waypoints on an arc that runs from one horizon to the other. An aircraft (the
  Streamline Guidance "airplane-mode" pictogram, filled) flies the arc; the part flown turns
  gold. Each waypoint lights as the aircraft passes over it, and its step's title and line
  appear at that moment, so the line, the lit number and the words always agree. The aircraft
  flies a few degrees ahead of the waypoint it last passed, so it never covers a number at rest,
  and it ends its flight near the far horizon.
- One step shows at a time. The outgoing step fades as the aircraft nears the next waypoint and
  the next fades in as it passes it; they never overlap (measured every 2 % of the act).
- Everything is driven by the act's progress in CSS (`--sc-p`), so it scrubs with the scroll
  and needs no script; the preview runs it unchanged. Waypoints and the aircraft are placed on
  the arc by rotation (turn, move out by the radius, turn back), so no trigonometric CSS is
  needed; the arc is a dotted circle border masked to its span.
- Reduced motion: the act flows instead of pinning, every step is listed in a grid, the route is
  shown flown with every waypoint lit and the aircraft at its end.
- Phones: the arc is sized from the screen's width, the labels give way to the numbered
  waypoints, and the step sits centred between the heading and the route. Short laptop screens
  (720 px) keep the whole route in view with the longest step copy (About).

### Checked (production build served locally)

| Check | Factor | Measured |
|---|---|---|
| Words per screen, home | 60 or fewer | 48 at 1440 px, 36 at 375 px |
| Buttons per screen | 1 | 1 on every page |
| Longest animation, stagger | 600 ms, 80 ms | 560 ms, 70 ms (the flight plan scrubs with the scroll and has no timed animation) |
| Reduced motion | nothing moves, all visible | 0 pinned acts, 0 hidden cues, aircraft and counters still, every step listed |
| axe-core, 11 routes | 0 | 0 |
| Console errors, broken links | 0 | 0 |
| First readable text, Fast 3G | under 2 s | home 1.90 s, other pages 1.54 to 1.75 s |
| Weight per page | under 1 MB | 371 to 452 KB on a phone |
| Keyboard, menu and forms | as before | all pass; the preview's 54 checks pass (5 new: the two hero layers, the flight plan's steps, aircraft, sky, and its reduced-motion state) |

The home page's first text on Fast 3G moved from 1.83 s to 1.90 s. An A/B of the two builds on
the same harness shows the stylesheet grew by under 1 KB compressed; the rest is how the
throttled connection shares bandwidth between the stylesheet and the page's scripts, which varies
between runs (36 ms apart on a second trace). It stays inside the 2 s budget. Raw measurements:
`factors-sunset.json`.

## Fifth pass: dithered intros, a page transition (26 September 2026)

The client pointed to the dithered hero on browserbase.com and asked for the photographs that sat
below each nav page's intro to become the intro's background in a lighter version of that effect,
optimised; for a transition between pages to hide the moments a page takes to load; and for the
number in the middle of How we work to go, since the arc already numbers the steps.

### Dithered intro backgrounds

Browserbase draws its hero through a coarse grid: each cell one colour from a small palette, the
tones mixed by a dither pattern, every cell a round dot with the page showing where dots meet. The
light version here uses the same grammar with four tints of the brand navy (and a peach for
strongly warm light), so each intro keeps a white ground and its text keeps its contrast.

- **Where.** Engines, Aircraft, Parts, Charter, Advisory and About. The capsule image bands below
  those intros are gone; each photograph is now its intro's background, full strength at the foot
  (a space kept open for it) and a faint texture behind the words (32 %, which keeps the grey lead
  text at 5.1:1 over the darkest dot). On phones it is a band at the foot, under the boarding pass.
- **How it is made.** `site-za/tools/img/dither.js` reduces each photograph to a grid (200 x 140
  cells for desktop, 80 x 66 for phones), stretches its tones, maps them (the dark hangar and
  store scenes inverted, so the lit subject is drawn in dots on white; the apron, desk and charter
  scenes not, so the dark scene takes the dots and the bright subject stays white), and quantises
  them with Atkinson error diffusion. It writes a 4-bit indexed PNG with one pixel per cell.
- **How it is drawn.** `IntroDither.tsx` and `src/site/dither.css`: the grid is scaled up
  pixel-exact (8 px cells on desktop, 5 px on phones, whole pixels at every common screen density)
  and a CSS mask one cell in size draws each cell as a round dot. Image and mask start at the
  grid's own corner, so dots and cells always line up; the checks confirm crisp single-colour dots
  at twice the pixel density.
- **Cost.** 2 to 5 KB per page for desktop and about 1 KB for phones, and only the grid for the
  current layout is downloaded. No script, nothing animated, so nothing repaints on scroll. The
  door pages got lighter: 368 to 379 KB on a phone, where the 900 px photographs used to load.

### Page transition

Pages load as full documents, and the browser keeps showing the old page, unchanged, until the
next one is ready, so a slow response read as a click that did nothing.

- **Leaving** (`PageTransition.tsx`, `za.css`): the moment an internal link is followed, the page
  content fades and lifts away, an open dropdown settles, and a thin orange line sweeps the top edge
  until the next page replaces this one (it waits 120 ms, so a page that is already fetched shows no
  flash of it). Links within the same page, new-tab clicks and downloads are left alone; a page
  restored from the back-forward cache comes back unfaded; a navigation stopped by the visitor
  unfades after eight seconds.
- **Arriving**: the cross-document view transition keeps the header in place, lets the old page go
  and brings the new one up from 12 px below (320 ms). Browsers without cross-document
  transitions get the same entrance from a small head script, only after an internal link.
- **Faster, too**: the hover prefetch already in place (speculation rules) means most pages are
  fetched before the click.
- **Preview**: the same leaving state, and the swap waits until the next page's first screen (its
  images and dither grid) is decoded: at least 200 ms, so the fade reads, at most 900 ms.
- Every animation is 600 ms or less (the line repeats a 600 ms sweep); under reduced motion the
  line shows still and nothing moves.

### How we work

The gold number above the step's title is gone; the lit waypoint on the arc carries it, and the
list is still an ordered list for assistive technology.

### Checked (production build served locally)

| Check | Factor | Measured |
|---|---|---|
| Words per screen, home | 60 or fewer | 48 at 1440 px, 35 at 375 px |
| Buttons per screen | 1 | 1 on every page |
| Longest animation, stagger | 600 ms, 80 ms | 560 ms, 70 ms (the line's sweep repeats at 600 ms) |
| Reduced motion | nothing moves, all visible | 0 pinned acts, 0 hidden cues, the page switch immediate |
| axe-core, 11 routes | 0 | 0 |
| Console errors, broken links | 0 | 0 |
| First readable text, Fast 3G | under 2 s | home 1.92 to 1.96 s over three runs, other pages 1.56 to 1.78 s |
| Weight per page | under 1 MB | 368 to 453 KB on a phone |
| Keyboard, menu and forms | as before | all pass; the preview's 59 checks pass (5 new: six dithered intros, no step number, the page switch, the phone grid, the reduced-motion switch) |

Home's first text moved by 20 to 60 ms against the sunset pass (the stylesheet grew by under
0.4 KB compressed); on the local server, which speaks HTTP/1.1, the stylesheet shares the line with
the 121 KB application script, which the live host's HTTP/2 prioritises behind it. Raw
measurements: `factors-dither.json`.
