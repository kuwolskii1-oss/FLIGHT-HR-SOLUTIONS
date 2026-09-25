---
name: memory-encoding
description: Make a design stick in memory by giving the viewer one thing to resolve - a single conceptual twist that fuses two meanings from the subject's own world, or a purposeful absence or tension that asks a question instead of giving an answer. Includes a concept generation method (objects, rituals, vocabulary, core idea, forced pairings), guardrails for comprehension, accessibility and truth, a 3-second blink test and a checklist against designs that are too safe, too clean and unoriginal. Use when asked to "make it memorable", "make it stick", "it looks generic", "it looks AI-generated", "it needs a concept", "big idea", "signature moment", "hero concept", "poster idea", "logo concept", "key visual", or in a "design review" of heroes, campaigns, posters, covers and brand moments.
---

# Memory encoding

Generated visuals can be flawless and still gone from memory a blink later. What stays is what the brain had to resolve. The video's examples are two posters. In one, for "High Fidelity", two records and a sleeve are arranged into a heart, so music becomes emotion and records become romance in a single twist. In the other, empty clothes are laid out on a chair in the shape of a person who is not there, and the pause the viewer spends working out the story is the memory forming. The method is to give the viewer one thing to complete in a short pause: something slightly off balance that asks a question instead of handing over an answer.

## When to use

- Heroes, posters, covers, campaign key visuals, logo and ident concepts, a page's one signature moment, 404 and empty states.
- When a design is correct but forgettable, or looks generated.

## When not to use

- Task screens (forms, checkout, settings, dashboards). There, memorability comes from clarity and consistency. Put the twist at the entrance, not in the form.
- At moments of stress or time pressure. A puzzle in front of someone with a grounded aircraft is a cost, not a gift.
- Before the message reads correctly. A twist on top of an unclear message is noise; fix the order first with `../perception-gap-audit/SKILL.md`.

## Procedure

1. **Write the core idea** in one short sentence: what the brand or the piece is really about.
2. **List the subject's own world**, ten or more items per column:
   - Objects: things, tools, materials, documents, places.
   - Rituals: actions, routines and checks people in this world repeat.
   - Vocabulary: insiders' words and phrases, especially those with a second meaning.
3. **Force pairings.** Combine an item with the core idea, or two items with each other, and write each as a one-line image. Make fifteen to twenty quickly without judging. Useful moves:
   - Form: arrange objects into the shape of the idea (records into a heart).
   - Absence: show the gap where something should be (clothes without a body).
   - Substitution: swap one object for another with a shared shape.
   - Scale: make the small thing huge, or the huge thing small.
   - Tension: almost balanced, almost complete, almost touching.
4. **Score each candidate** on five tests: resolvable in a pause of one to three seconds; from the subject's own world (not a stock metaphor such as a light bulb, a handshake or a globe); true (it implies no claim you cannot support); survives small and blurred; one idea only.
5. **Pick one.** Sketch it at the smallest size it will be seen, then run `glance.mjs` on the sketch or mock-up.
6. **Apply the guardrails** below.
7. **Run the blink test** with people, or with a fresh subagent.
8. **Protect it.** Remove whatever competes with the twist. One twist per piece.

## Guardrails

- **Comprehension first.** The twist must not hide what the thing is or what to do. The headline and the action still pass the perception-gap audit.
- **Accessibility.** The text alternative describes the idea, not only the objects ("two records and a sleeve arranged as a heart"). No meaning carried by colour alone. Animated versions have a still final state and stop under reduced motion.
- **Truth.** A metaphor can make a claim. Seals, shields, stamps and ticks say "approved" or "guaranteed"; use them only when that is true.
- **One twist per piece.** A second twist halves both.
- **Culture.** Check that the double meaning reads the same for this audience: language, religion, local symbols.

## Blink test

1. Show the piece for three seconds, then take it away.
2. Ask: "Describe what you saw." Later in the session, ask: "What do you remember from that image?"
3. Pass: the viewer describes the idea ("a heart made of records"). Fail: they list parts or give a generic description ("an orange poster with some text").
4. For a subagent, give only the image and this prompt: "You saw this image for three seconds. In one sentence, describe what you saw. Then name the one thing you would remember tomorrow."

## Too safe, too clean, unoriginal: checklist

- Could a competitor use this design by swapping the logo? Then it has no twist.
- Is the main image a stock category (handshake, skyline, laptop, abstract gradient, a plane in a blue sky)?
- Is everything centred, symmetrical and evenly spaced, with no tension anywhere?
- Is there one thing a viewer could describe to a friend in one sentence?
- Does anything ask a question?
- Did the idea come from the subject's world or from this year's design trends?

## Worked example: Flight Hour Solution

**The twist the site already has.** The South African site has exactly one, and it reads well through this method: the core idea is the brand's tagline, "Keeps you flying", and the objects are the logo's plane and its orange swoosh. The client's ident clips show the plane flying an S-shaped route while the swoosh forms behind it, until both lock into the logo. The site rebuilds that as a scroll-driven SVG: the visitor's own scrolling flies the plane along the swoosh until it lands on the logo (`docs/za/ident/README.md`, `site-za/BRIEF.md`). The brief writes the blink test's pass condition in advance as a "tell-someone sentence": "it's the site where you fly the plane in the logo by scrolling, and it lands exactly on the logo." It meets the guardrails: the headline and button are in the first paint, the SVG is under 4 KB, the finished mark shows and never moves under reduced motion, and its text alternative describes the idea: "the plane flies its route and the swoosh forms behind it". So the home page gets no second twist.

**Generating a concept for a future piece,** such as a card promoting the AOG line. Items are taken from `site-za/app/src/content/*.json` and the logo; the candidates are outputs of the method, not assets on the site.

| Objects | Rituals | Vocabulary |
|---|---|---|
| engine, aircraft, part number, release certificate, records, LLP stack, delivery airport, the plane and swoosh of the logo | verify before you commit; sign an NDA before asking for records; Define, Verify, Structure, Execute, Monitor; inspection; redelivery | aircraft on ground, remaining life, traceability, release, exposure, "Keeps you flying" |

| Candidate | Pause | Own world | True | Small | Verdict |
|---|---|---|---|---|---|
| Absence: the logo's plane standing still with its swoosh missing, for "aircraft on ground" | Yes, once the mark is known | Yes | Yes, no claim attached | Yes, one silhouette | Shortlist. `site-za/BRIEF.md` calls it "a company nobody has heard of yet", so the mark is not known; pair it with the words "Aircraft on ground?" until it is |
| The five steps as waypoints along the swoosh, ending on the logo | Probably | Yes | Yes | Weak, five small labels | Only as a replacement for the steps list, never as a second twist beside the ident |
| A release certificate whose signature line becomes the swoosh | Slow | Yes | Risky: could suggest the company issues certificates | Weak | Drop |
| A seal or stamp reading "certified" | Instant | Generic | No: the brief says list only real approvals, and none is confirmed | Yes | Reject |

Blink-test pass for the shortlisted card: the viewer says something like "a plane that isn't flying" or "the logo without its trail", not "a plane logo".

## Common failure modes

- A twist without a message: clever, but the viewer cannot say what the company does.
- Two or three twists competing on one piece.
- Stock metaphors: a light bulb for ideas, a handshake for trust, a globe for international.
- Metaphors that imply claims (seals, shields, "certified") the company cannot back.
- A twist that exists only in the designer's explanation. If it has to be explained, it failed the blink test.
- A twist that only works in motion. It must work as a still.
- Revising the tension away ("can we make it clearer?") until the heart is a plain grid of records again.

## Source

Distilled from Satori Graphics, "The ONLY Video You Need To Learn High-Level Design Thinking", YouTube, 29 June 2026, 10 min 19 s, https://www.youtube.com/watch?v=VzQl1Tl_LPM (the section on memory encoding, with the "High Fidelity" heart of records and the empty clothes on a chair). The generation method, guardrails, blink test and worked example are additions for UI work.
