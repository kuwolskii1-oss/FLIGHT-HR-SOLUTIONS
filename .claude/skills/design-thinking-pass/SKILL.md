---
name: design-thinking-pass
description: Run the whole high-level design thinking pass on a new design or a redesign in a fixed order - brand voice, arrival state, predictive empathy, perception gaps, memory encoding, then the experience around the work (how the deliverable is received). Points to the five focused skills and gives a report format. Use when asked for a "design review", "design thinking", "review this design end to end", "is this design ready to ship", "critique the page before launch", "what would a senior designer say", "think it through before we design", or when starting a new page, screen, poster, campaign or identity.
---

# Design thinking pass

Colours, fonts and styles matter, but professionals spend most of their thinking elsewhere: what the audience actually understands, feels and remembers, and how the work is received. This pass runs five focused skills in the order that avoids rework, then checks the experience around the work.

## When to use

- A new page, screen, poster, campaign or identity, before pixels.
- A redesign, or a review before launch or before presenting to a client.

## When not to use

- A single narrow question. Go straight to the focused skill: "is the button visible?" is `../perception-gap-audit/SKILL.md`.
- Code-level UI compliance. Use `web-design-guidelines` for that.

## Procedure

1. **Brand voice**, `../brand-voice-alignment/SKILL.md`. The voice sets the temperature everything else must match.
2. **Arrival state**, `../arrival-state-design/SKILL.md`. Who arrives, in what state, on what device and in what light.
3. **Predictive empathy**, `../predictive-empathy/SKILL.md`. What they should feel five seconds in and when they leave.
4. **Perception gaps**, `../perception-gap-audit/SKILL.md`. Whether people take it in, in the intended order. Run `glance.mjs`.
5. **Memory encoding**, `../memory-encoding/SKILL.md`. One twist, and only once the message reads correctly.
6. **The experience around the work**, below.

For something already built, start at step 4, because it is observable, and use steps 1 to 3 to explain what you find.

## Step 6: the experience around the work

The same project can arrive as a random PDF with no context, or as a walkthrough with a clear structure; a file can open as a mess, or organised, named and obvious. The work is identical; the perception is not, and perception creates value. Clients pay for how confident, clear and easy the whole experience feels, not only for how the work looks. Check:

- **The link opens without friction:** no login wall, no download for a web page, the right first screen, works on a phone.
- **A walkthrough with structure:** context, the problem, the decision, the design, what to look at, what is still open.
- **Files organised and named:** pages, layers, components and exports named for what they are.
- **The first few seconds:** the first slide, screen or line of the message says what this is and what you need from the reader.
- **Open questions as questions,** each with an owner.
- **Nothing broken on the path:** links, fonts, images, reduced-motion and dark states.

## Report template

```
Design thinking pass: <piece>, <date>
1 Voice: temperature; mismatches
2 Arrival: audiences and states; phone at night result
3 Emotion arc: target leaving emotion; where it diverges
4 Perception gaps: screen | intended | perceived | gap | fix
5 Memory: the one twist, or none yet; blink test result
6 Delivery: link, walkthrough, files, first seconds
Top three changes, in order of impact:
Open questions and owners:
```

## Worked example: Flight Hour Solution, summary

The full examples are in each skill; this is the pass for the South African site (`site-za/app`) as built at commit 6718d55 on 25 September 2026.

1. Voice: calm, exact, verification-first ("records" 52 times, no exclamation marks); the visuals largely match. Two small drifts, each handled by a rule: the shared tagline "Keeps you flying", and orange spreading from actions into badges, numerals and bullets.
2. Arrival: five doors, with typical timings from "Hours (AOG)" to "Months". The worst case is a maintenance controller with a grounded aircraft, on a phone.
3. Emotion arc: written down in `site-za/BRIEF.md`; the copy puts cues where doubt arises ("Registered in 2026, we expect to be checked.").
4. Perception gaps: at 390 px the urgent route is an unlabelled ring, and the link has no accessible name.
5. Memory: one twist, the scroll-driven ident. No second twist on the home page.
6. Delivery: a no-login preview for people without staging access (`site-za/tools/preview/`), and the content files keep `clientToConfirm` lists of open questions.

Top three changes: show and name the AOG route at phone width; make "Use the WhatsApp line" a link on the Parts page; get two client decisions, the WhatsApp Business number and staffed AOG hours in SAST.

## Common failure modes

- Starting at step 5 with a clever concept before steps 1 to 4.
- Treating the steps as a list of opinions instead of observations.
- Skipping step 6 and sending good work as a bare file.
- Reporting twenty findings. Lead with the three that matter.

## Source

Distilled from Satori Graphics, "The ONLY Video You Need To Learn High-Level Design Thinking", YouTube, 29 June 2026, 10 min 19 s, https://www.youtube.com/watch?v=VzQl1Tl_LPM. Step 6 comes from the video's section on how work is received (a bare PDF versus a structured walkthrough, a messy file versus an organised one). The order and the report format are additions.
