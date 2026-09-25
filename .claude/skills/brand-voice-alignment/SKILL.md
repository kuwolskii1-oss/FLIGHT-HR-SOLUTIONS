---
name: brand-voice-alignment
description: Define how a brand speaks before designing how it looks, then make the visuals match. A worksheet (five words the brand would never say, five it would overuse, one sentence it would post to introduce itself), a way to derive the brand's emotional temperature, a mapping table from voice traits to visual decisions (shape psychology and angles, weight, contrast, colour temperature, spacing, type style, motion character and easing, icon style) and a mismatch check for existing logos and UI. Use when asked about "brand voice", "tone of voice", "does the logo match the brand", "this feels off-brand", "brand identity", "logo brief", "brand personality", "which fonts fit the brand", "microcopy tone", "error message tone", or before starting a logo, identity, design system or a site's visual direction, and in a "design review" of brand work.
---

# Brand voice alignment

Brands live in captions, landing pages, push notifications and posts far more than in their logo. Designing the logo before you understand how the brand speaks is designing almost blind. The voice sets the emotional temperature, and the visuals have to match it: a brand that sounds bold should not get a timid mark, and a brand that speaks calmly should not get aggressive shapes and sharp angles. Jumping to visuals feels productive, but if the mark does not speak the same language as the copy and its audience, it will always feel slightly off, however well it is crafted. The video draws this as a balance, voice on one side and visuals on the other.

## When to use

- Before a logo, identity, design system or a site's visual direction.
- When something "feels off-brand" and nobody can say why.
- Microcopy, errors, notifications and emails, where the voice has to hold in the smallest text.
- A sister company or sub-brand that must sound like one family.

## When not to use

- To decide strategy or positioning. This assumes the positioning exists; if it does not, settle that first.
- To change legally required wording (disclaimers, consent text). Voice can shape the words around it, not the words themselves.

## Procedure

1. **Collect evidence of how the brand already speaks:** site copy, emails, posts, decks, the founder's own phrases. If nothing exists, interview the owner and write down their words verbatim.
2. **Fill the worksheet from the evidence:**
   - Five words the brand would never say. These set boundaries.
   - Five words the brand would overuse online. These reveal the tone: sharp and direct, playful, technical, warm.
   - One sentence the brand would post to introduce itself, in 140 characters or fewer.
   Count frequent words in existing copy, read any banned-word list the project keeps, and note which words never appear.
3. **Derive the emotional temperature.** Score the voice from 1 to 5 on five scales: calm to excited, formal to casual, reserved to expressive, serious to playful, precise to loose. Then write one line: "The voice is <temperature>. It sounds like <a person in a situation>."
4. **Map voice to visuals** with the table below. Decide each row deliberately and write the reason.
5. **Run the mismatch check** on any existing logo, UI or page: for each row, does the visual say what the voice says? Mark aligned, drifting or contradicting. Check the words inside the design too: buttons, errors, empty states, notifications, alt text.
6. **Fix contradictions first, then drifts.** Change the visual to fit the voice, unless the voice is the real problem; say which.
7. **Keep the worksheet with the design system** so new designers and writers can check new work against it.

## Worksheet

| Five words it would never say | Five words it would overuse | One sentence, 140 characters or fewer |
|---|---|---|
| | | |

Temperature (1 to 5): calm to excited __; formal to casual __; reserved to expressive __; serious to playful __; precise to loose __.

## Voice to visual mapping

| Visual decision | Calm, exact, reserved | Bold, direct, energetic | Warm, playful, casual | Technical, precise |
|---|---|---|---|---|
| Shape psychology and angles | Stable rectangles, modest radius, horizontals | Sharp angles, diagonals, forward lean | Circles, rounded and organic forms | Grid-true geometry, right angles, one consistent radius |
| Weight | Regular to medium, few weights | Heavy, strong weight contrast | Medium, friendly | Light to regular, many exact sizes |
| Contrast | Moderate, never harsh, one accent | High, black and white with one loud colour | Medium, tints and pastels | High for data, neutral elsewhere |
| Colour temperature | Cool or neutral grounds, one warm accent for action | Hot, saturated primaries | Warm and varied | Cool neutrals with semantic colours |
| Spacing | Generous and even | Tight and punchy, or extreme scale contrast | Airy, loose rhythm | Dense but ordered, strict rhythm |
| Type style | Humanist or neo-grotesque sans, sentence case | Heavy or condensed display, very large | Rounded sans or soft serif | Grotesque, with mono and tabular figures for data |
| Motion character and easing | Short ease-out, no bounce, about 150 to 400 ms | Fast snaps, strong curves, some overshoot | Springs with gentle overshoot | Linear or ease-out, functional only |
| Icon style | Outline, even stroke, rounded joins | Filled, heavy | Rounded, filled, with character | Outline, geometric, pixel-snapped |

These are defaults for making a deliberate choice, not laws. Write down the reason whenever you break one.

## Mismatch check template

| Decision | The voice says | The design says | Verdict (aligned, drifting, contradicting) | Fix |
|---|---|---|---|---|

## Worked example: Flight Hour Solution (South Africa)

Evidence: all visible copy in `site-za/app/src/content/*.json` (about 5,000 words, editorial notes excluded), the brief `docs/za/brief-fhs-south-africa.html`, and the banned and promise word lists in `site-za/tools/validate-content.mjs`.

| Five never (validator lists, zero uses in the copy) | Five overused (counted in the copy) | One sentence (120 characters, built only from the site's own claims) |
|---|---|---|
| guaranteed, fastest, world-leading, seamless, trusted partner. The copy also has no exclamation marks and never uses the word "trust". | records (52), before (31), status (29), verify and verified (27), counterparties (15). The phrase "subject to aircraft availability" appears 11 times. | "Engine, aircraft, parts, charter and advisory from South Africa. We verify records and counterparties before you commit." |

Temperature: calm 1, formal 2, reserved 1, serious 1, precise 1. The voice is cool and exact. It sounds like a careful inspector explaining what will be checked before anyone signs.

Mismatch check against the site as built at commit 6718d55 on 25 September 2026 (`docs/za/blueprint.md`, `site-za/app/src/site/tokens.css` at that commit, and the production build). Rerun it after any visual refresh:

| Decision | The voice says | The design says | Verdict |
|---|---|---|---|
| Colour temperature | Calm, with heat only where the visitor acts | Navy #1C205C and paper #F4F1EB grounds. The blueprint reserves orange #EE7203 for actions; the built pages also use orange for the "Early access" badge, step and section numerals and list bullets | Aligned in the large areas, drifting in the small accents: harmless at that size, but if orange keeps spreading it stops meaning "act here" |
| Type style and weight | Plain, precise, reserved | IBM Plex Sans throughout, Plex Mono for labels and numbers; hierarchy by weight and size, not uppercase headings; the home headline is set at weight 400 | Aligned |
| Spacing | One thing at a time | One idea per screen; measure 60 to 65 characters | Aligned |
| Motion | Calm, exact | Ease-out transitions of 150 to 500 ms and reveals up to 600 ms; nothing bounces except the checkbox tick and the success check | Aligned |
| Shape and angles | Stable | 4 px radius on buttons and fields, pills only for the urgent control, badges and segmented switches; the only strong diagonals are the plane and swoosh in the mark | Aligned: the energy is kept inside the mark |
| Icon style | Exact | Outline icons with a 1.5 px stroke (`site-za/app/src/components/site/Icons.tsx`) | Aligned |
| Microcopy | No drama, says what to do | Errors read "Please fill in part number." and "Please tick the consent box so that we may reply." | Aligned |
| Tagline | Verification first, promises nothing | "Keeps you flying" is warmer and reads as an outcome | Drifting, accepted: the brief keeps one tagline across both group companies. Let the mark carry the warmth and never stretch it into a promise in body copy |

Neither drift needs a redesign; each becomes a rule. The tagline is a decision already taken, so body copy never turns "Keeps you flying" into a time or availability promise. And no new orange is added except on actions.

## Common failure modes

- Starting with the logo because it feels productive.
- Adjectives without evidence ("innovative, trustworthy, dynamic"). Every brand claims these; the never and overused lists are more honest.
- A calm voice in headlines and a jokey voice in errors and notifications.
- Mapping by cliche (blue means trust) instead of by temperature.
- Letting a strong visual system pull the copy into promises the brand cannot keep.
- Rewriting the voice to fit a logo someone already likes.

## Source

Distilled from Satori Graphics, "The ONLY Video You Need To Learn High-Level Design Thinking", YouTube, 29 June 2026, 10 min 19 s, https://www.youtube.com/watch?v=VzQl1Tl_LPM (the section on brand voice before visuals, with the five never, five overused and one tweet worksheet and the voice and logo balance). The temperature scales, mapping table, mismatch check and worked example are additions for UI work.
