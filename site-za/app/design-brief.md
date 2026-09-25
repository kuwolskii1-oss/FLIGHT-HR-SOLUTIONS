# Flight Hour Solution — design brief

Design read: airline powerplant managers, lessor technical asset managers and procurement leads
who buy multi-million-dollar engine shop visits want calm technical authority, proof, and a short
route to a senior person; the register is precise, documentary, unhurried.

Concept spine: the site is a shop-visit record. Every screen behaves like a well-kept engine file:
ruled lists, mono metadata, large verifiable numbers, one orange signal, real machinery in the
picture, copy that says what happens and what it costs. The full method behind this brief is
documented in docs/research/08-locomotive-design-blueprint.md (sections 7 and 8).

Delivery tier: cinema (Lenis-style smooth scroll bridged to GSAP for surrounding motion; the
scroll-scrub journey is the Tier-1 hero mechanic; restrained chapter reveals; no custom cursor,
no preloader, no WebGL).

Locked palette: navy #1C205C (canvas of dark sections, brand), ink #12152E (text on light),
paper #F4F1EB (light surface), white #FFFFFF, orange #EE7203 (the single accent, brand),
orange-deep #A84E00 (orange for small text on light), muted #545872 (secondary text on light),
muted-dark #A9ACC6 (secondary text on navy), data #2F6A9E (charts only). Defence: navy and orange
are the client's registered brand colours (docs/research/03-brand-assets.md); the canvas is a
saturated blue, not graphite, and orange is used as a signal (buttons, key numerals, rules on
navy), never as a glow. This overrides the default palette bans by explicit brand instruction.

Locked type: IBM Plex Sans (400, 500, 600) for display and body, IBM Plex Mono (400, 500) for
metadata, engine designations and figures with tabular numerals. Self-hosted WOFF2. Fluid
Utopia ramp from 390 px to 1440 px (17 to 19 px body; display step 56 to 148 px). No serif.

Animation mode: animated-website

Journey shape: single-shot (one continuous 15 s film, generated in one call, scrubbed end to end).

Journey (five chapters over the one film):
1. Establishing, 0-20 %: wide three-quarter view of a turbofan on its stand in a dark hangar.
   Headline "Your engines. Independently managed." One sentence on what Flight Hour Solution does.
   Tags: Zug, Switzerland · Independent · Founded 2024.
2. Push-in, 20-40 %: the nacelle lip passes the frame edge. "A shop visit is a multi-million-dollar
   purchase." One sentence on treating it like one (workscope, invoice, warranty). Tag: shop visit management.
3. Fan face, 40-60 %: the fan fills the frame. "Workscope discipline protects value." One sentence
   on leases, redelivery and maintenance reserves. Tags: lessors · lease return.
4. Blades, 60-80 %: blade leading edges in detail. "An independent read of your engine data."
   One sentence on ECM/EHM trends, borescope and test-cell results. Tags: analytics · borescope.
5. Macro, 80-100 %: spinner and blade macro, the closing beauty state. "From Zug, on site worldwide."
   One sentence on senior people on the job. CTA "Send us a workscope" (underlined arrow link).
The journey enacts the spine: the visitor moves from the whole engine to the detail, exactly the way
a shop-visit file moves from induction to the individual part.

World grammar (byte-identical preamble for every generated asset): photorealistic industrial
documentary grade, deep navy charcoal shadows, clean white key light from the upper left, one
subtle warm orange rim light on metal edges, 35 mm lens at eye level, locked exposure and white
balance, no motion blur, no text, no logos, no watermark, no faces. Subject centered with dark
negative space for the chapter copy; edges expendable.

Mobile framing: the subject stays inside the centre-safe area of the 16:9 film; chapter copy sits
below the centre on mobile; a lighter 720p mobile encode ships beside the desktop encode.

Delivery budget: one desktop clip ≤ 14 MiB and one mobile clip ≤ 6 MiB (well under the 32 / 16 MiB
ceilings); everything else on the home page ≤ 1 MB before the film streams in; LCP element is the
hero headline, not the video.

Section plan (home), one layout family per section, no consecutive repeats:
0. Header: fixed, 72 px, wordmark, four links, one orange button, EN/DE switch, burger below 1000 px.
1. Journey (scroll-scrub film with the five chapters above): family "image-as-canvas".
2. Proof strip: three verifiable figures in the display step with mono captions: family "metrics strip".
3. Three situations we are hired for: asymmetric 3-up on paper with top rules: family "asymmetric grid".
4. Services: eight ruled rows, whole row a link, arrow slides on hover: family "ruled list".
5. Engines we manage: sticky left title, five rows with the cross-section drawing on the right:
   family "editorial split, sticky".
6. How a managed shop visit works: numbered vertical steps with a progress rule that fills as you
   scroll (transform only): family "numbered steps".
7. Independence statement: full-bleed navy band with a single statement and a text link: family "statement band".
8. People: portrait slot, name, role, contact channels: family "split card".
9. Insights: three latest notes with mono dates: family "index grid".
10. Closing statement: navy, display headline, the primary CTA as an oversized link: family "statement".
11. Footer: address, UID, memberships, legal links, language switch.
Eyebrow budget: 4 for 11 sections; used on sections 2, 4, 6 and 9 only. Chapter kickers inside the
journey are the engine's rail labels, not eyebrows.

Asset plan: film (single-shot, from the approved storyboard) with exact-frame posters; content
imagery: hero-engine-stand (fallback poster and OG), shop-floor, borescope, table-inspection,
test-cell, records-desk, fan-macro, zug-lake, apron-dusk, engine-cradle; cross-section line
drawing for the engines section; the client's own SVG logo for wordmark and head kit (favicon,
apple-touch-icon, 192/512 icons, manifest); OG image composed from the hero still in the site's
own typography. No generated people, no invented logos, no icon font: a handful of inline
interface glyphs (arrow, plus, external link) only.

CTA inventory, each with its own interaction identity:
- Header "Talk to us": orange filled button, ink text, arrow nudges 4 px on hover, presses 1 px.
- Journey chapter "Send us a workscope": underlined text link whose arrow travels along the underline.
- Service and engine rows: the whole row is the link; row lifts to white and the arrow slides.
- Closing "Talk to us": oversized text link in the display step, underline draws in from the left.
- Contact form "Send enquiry": full-width bar that shifts grade on hover.
- Footer links: plain, hairline moves under the link.
One label per intent site-wide: "Talk to us" (contact) and "Send us a workscope" (file intent).

Corner language: sharp rectangles for images and rows; 4 px radius on buttons and inputs only.

Previous build identity (flight-hour-solution.higgsfield.app, editorial, non-animated): this build
differs on hero architecture (film journey vs image hero), Tier-1 technique (scroll-scrub vs static),
type pairing (Plex vs Outfit), CTA garments, corner language and section system; the palette is the
same because it is the client's brand.
