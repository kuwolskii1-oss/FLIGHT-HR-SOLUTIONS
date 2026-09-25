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
