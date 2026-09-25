---
name: predictive-empathy
description: Design for what the viewer will feel a few seconds from now and when they leave, not only on arrival. Plot an emotion arc (arrive, 5 seconds, leave), set a target leaving emotion, and tune the four levers from the video's poster remake - headline temperature, breathing space, one emotional cue (a reassurance line or a trust symbol) and palette temperature. Every design choice gets a written reason that includes the target emotion. Includes a before and after rewrite procedure. Use when asked "how should this make people feel", "this feels too pushy", "too salesy", "too aggressive", "make it calmer", "make it reassuring", "emotional design", "what do they feel afterwards", "tone down the hero", or when designing heroes, posters, forms, confirmation and success messages, error and empty states, and in a "design review".
---

# Predictive empathy

Arrival state is where people start (see `../arrival-state-design/SKILL.md`). Predictive empathy is emotional foresight: designing for what they will feel a few seconds from now, and when they leave and carry on with their day.

The video's example is a poster whose headline is about finding inner peace, set in loud red: the headline shouts, the image is dramatic, the colour is intense. It behaves like someone grabbing your arm and saying "look at me now". It assumes the viewer is already convinced, interested and in the same emotional place, and most people are not. The remake keeps the impact but softens the headline, adds breathing space, adds one small emotional cue (a gentle reassurance line or a symbol of trust) and moves the palette to a calmer pale green. The viewer feels understood rather than pressured.

The video also allows the opposite reading: the loud chaos could be deliberate, with the calm found inside it. Either way the point stands. Decide what the audience should feel after they leave, and make every design choice carry a reason, one of which is that emotion.

## When to use

- Heroes, posters, adverts and any first screen with a strong visual voice.
- Moments with a before and an after: forms, submit buttons, confirmations, errors, empty states, pricing, cancellation.
- When a design is "too pushy", "too cold" or "off" and nobody can say why.
- Anything aimed at cautious people: money, health, safety, a new company asking to be trusted.

## When not to use

- Pure utility (a settings toggle) where the only target feeling is "done". Keep the principle, skip the worksheet.
- To manipulate. False urgency, guilt and fake scarcity are out. The target emotion must be one the viewer would agree to if you told them.

## Procedure

1. **Start from the arrival state.** Write it in a line, or take it from the arrival-state worksheet.
2. **Write the target leaving emotion** in one or two words plus one sentence, for example "Reassured: they know what happens next, and nothing was promised that cannot be kept."
3. **Plot the arc.** For arrive, five seconds in, and leave (or just after the action), write what the viewer will feel with the current design and what they should feel.
4. **Find the first moment where predicted and target diverge.** Work there first.
5. **Tune the four levers:**
   - **Headline temperature.** From hot (imperatives, capitals, exclamation marks, superlatives) through confident (a plain statement of the outcome) to quiet (a question, an understatement). Keep the impact by keeping it short and specific; lower the temperature by removing pressure words, not meaning.
   - **Breathing space.** More space around the one thing that matters, fewer items per screen. Space reads as calm and as confidence.
   - **One emotional cue.** A single reassurance line or trust symbol placed exactly where the doubt arises: under the button, beside the price, next to the form field that asks for something sensitive. One cue, not five badges.
   - **Palette temperature.** Saturated reds and oranges raise arousal; cooler, softer and lighter values lower it. If you need heat, spend it on the one action.
6. **Write a reason line for every choice:** "<choice> because <function>, so they feel <emotion>." A choice with neither a functional nor an emotional reason goes.
7. **Design the leaving moment explicitly:** the success message, the confirmation email, the empty state, the error. Many designs stop at the button; people do not.
8. **Test.** After the recall test in `../perception-gap-audit/SKILL.md`, ask two more questions: "How did that make you feel?" and "What do you expect to happen next?" Compare with the target.

## Before and after rewrite

1. Write down the current version: the copy, and a one-line description of the visual.
2. Mark every pressure signal: imperatives, exclamation marks, capitals, countdowns, superlatives, stacked badges, maximum saturation, crowding, looping motion.
3. Write the target emotion and the single doubt the viewer has at that moment.
4. Rewrite the headline one step cooler, keeping its subject and its specific detail.
5. For every element you add, remove one.
6. Add the one cue that answers the doubt, at the place the doubt occurs.
7. Move large areas to calmer values; keep saturated colour for the action only.
8. Write a reason line for each change. Show before and after side by side, and run `glance.mjs` on both.

## Worksheet

| Moment | Predicted feeling now | Target feeling | Lever | Change | Reason (function, then emotion) |
|---|---|---|---|---|---|
| Arrive | | | | | |
| At 5 seconds | | | | | |
| Leave, or after the action | | | | | |

## Worked example: Flight Hour Solution

The South African site already works this way. `site-za/BRIEF.md` writes the home page as a feeling curve (recognition, orientation, confidence, reassurance, curiosity, resolve), with one cause for each feeling. And the copy puts its cues where the doubt arises, quoted from `site-za/app/src/content/`:

- "Can a company registered in 2026 be trusted?" is answered by "Registered in 2026, we expect to be checked." and four things a visitor can check. The visible copy never uses the word "trust"; it shows checks instead.
- "Is Engine 360 real yet?" is answered by the headline "Engine 360 is being designed" and, under the button, "Joining the list places no obligation on you." That is the video's gentle reassurance line almost exactly.
- "Will they want my records up front?" is answered by "We sign an NDA before asking for records."

**Emotion arc, a maintenance controller with an aircraft on ground, Parts page:**

| Moment | Predicted now | Target | Lever | Change | Reason |
|---|---|---|---|---|---|
| Arrive | Oriented: the headline names parts and the check | Oriented | none | keep | Already meets the target |
| At 5 seconds | Unsure: form or WhatsApp? The urgent route is the last sentence of the subline | In control: my route is obvious | one cue | Make "Use the WhatsApp line" a link, or lead with it | The cue sits where the doubt is, so they feel in control |
| After sending | "Your request has gone to the parts inbox and we will reply by email. For an aircraft on ground, use the WhatsApp line as well." | Reassured: I know where it went and what happens next | none in design | Add a reply time only once the client commits to one | A promised time nobody staffs would turn reassurance into doubt |

**Before and after.** The "before" is a deliberately loud draft written for this example. It is not, and never was, on the site.

- Before: "URGENT PARTS? WE DELIVER FAST!" in orange capitals over a full-bleed photo, three badges, a pulsing "Order now" button.
- Pressure signals: capitals, exclamation marks, "fast" (a promise nobody has agreed to staff), stacked badges, looping motion.
- Target: in control. Doubt: "Is the part genuine, and will it be checked?"
- After (the site's real Parts hero): "Aircraft parts, verified before you pay", then "Send the part number, quantity, condition and delivery airport. We check traceability and release documentation before you pay. Aircraft on ground? Use the WhatsApp line.", and the button "Send parts request".

Reason lines for the after:

- Headline: states the outcome and the check, so the buyer feels the risk is handled. Confident, not shouting.
- Subline: says exactly what to send, so they feel able to act now.
- The one cue: "verified before you pay" answers the doubt where it arises.
- Palette: a navy ground where the button is the only large area of orange, so the action is the one warm thing and the rest is calm.
- Removed: "fast". The content validator (`site-za/tools/validate-content.mjs`) flags promise words such as "guaranteed" and "fastest", and bans "trusted partner"; the brief says to promise only what the team can staff.

## Common failure modes

- Designing only the first second: the loud hero that wins the glance and loses the next five seconds.
- Stacking cues: five badges read as doubt, not reassurance.
- Cooling everything until it is flat. Keep one point of energy, the action.
- Reassurance as a claim ("trusted partner") instead of something checkable (a registration number).
- Forgetting the leaving moment: the success screen, the auto-reply, the empty state.
- Using the emotion target to justify false urgency.

## Source

Distilled from Satori Graphics, "The ONLY Video You Need To Learn High-Level Design Thinking", YouTube, 29 June 2026, 10 min 19 s, https://www.youtube.com/watch?v=VzQl1Tl_LPM (the section on predictive empathy and the loud red poster remade in calm pale green with more space and a trust cue). The arc worksheet, rewrite procedure and worked example are additions for UI work.
