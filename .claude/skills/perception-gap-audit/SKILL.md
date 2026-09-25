---
name: perception-gap-audit
description: Find the gap between what a design is meant to communicate and what a viewer actually takes in, in order. Write the intended reading order for each screen, then test it with a few-seconds recall test with real people, or with a context-free subagent looking at one screenshot, plus squint and "phone at night" views made by the bundled glance.mjs script. Works for web pages, app screens, forms, posters, ads and slides. Use when asked to "check the hierarchy", "what will people notice first", "run a 5-second test", "is the call to action visible", "does this read in the right order", "squint test", "first impression test", "why do people miss the button", or for the hierarchy part of any "design review".
---

# Perception gap audit

A perception gap is the space between what you meant a design to say and what the viewer actually saw. Instead of asking "does this look good?", ask three questions of every screen: where does the eye land first, what gets noticed second, and what gets missed completely. Taste can be argued; confusion can be observed. And if a design has to be explained before it works, it has already failed at that job.

## When to use

- Before shipping or presenting any screen whose job is to make someone understand or act: a landing page, a service page, a form, a dashboard, a poster, an ad, a slide.
- When someone asks whether the hierarchy works, whether the call to action is visible, or what people notice first.
- After a redesign, to check the new version still reads in the intended order at phone width.
- When a debate about looks has stalled: turn it into something you can observe.

## When not to use

- Choosing between two palettes or typefaces that both read in the intended order. That is taste; this audit will not settle it.
- Long reading (articles, documentation). The test measures glancing, not comprehension; use a comprehension task instead.
- Accessibility conformance (contrast ratios, names, focus order). Use `web-design-guidelines` or `audit-website`. This audit often finds the symptom first; confirm the cause there.

## Procedure

1. **List the screens.** A screen is what one viewport shows at one scroll position (web), one page (print) or one slide. Always include the first screen at phone width (390 px) and at desktop width (1440 px), plus the screen where the key action happens (the form, the price, the sign-up).
2. **Write the intended sequence before you look.** For each screen, write the three to five things the viewer should take in, in order, and the one thing they must not miss. Take it from the brief and the content, not from a screenshot, or you will describe what is there instead of what was meant.
3. **Capture each screen at real viewing conditions** with the bundled script (see "The glance script" below). It saves a normal view, a "phone at night" view and a squint view per width.
4. **Squint check.** Open the squint image. List the masses in order of pull: darkest or most saturated, largest, most isolated. The first three masses should be the first three items of your sequence. Anything that survives the blur but is not in the sequence is a competitor. Then open the night image and note which items fade. A must-not-miss item that fades is a gap.
5. **Recall test with people.** This is the real test. Use the script below with three to five people who did not work on the design, ideally from the audience.
6. **Machine proxy when no person is available.** Give one screenshot to a fresh subagent with no context (prompt below). This finds gross failures; it does not replace people.
7. **Compare and name each gap.** Put intended and perceived orders side by side. A gap is any of: the wrong first item, the action missed, the must-not-miss item missed, something unintended in the top three, or viewers using a different word for the product than yours.
8. **Close the gap with hierarchy levers,** roughly in this order: size, weight, contrast (lightness), isolation and space, position (top left for left-to-right readers, next to what it acts on), colour (keep saturated colour for the one action), and motion as a last resort (one cue, never a loop, off under reduced motion). Removing a competitor usually works better than boosting the item. Change one lever at a time.
9. **Retest the changed screen** with new viewers. Stop when most viewers get the first item and the must-not-miss item right.

## The glance script

`scripts/glance.mjs` loads a URL (or a local HTML file, or an image) in headless Chromium through Playwright and saves, for each width:

- `<name>-<width>-normal.png`: the first screen as rendered, viewport only.
- `<name>-<width>-night.png`: the same screen dimmed, lower in contrast, warmer and at 60% size, as on a phone at night with the brightness down.
- `<name>-<width>-squint.png`: the same screen blurred (6 px by default), so only masses, contrast and position remain.

```bash
# from the repository root; write outputs outside the repo
node .claude/skills/perception-gap-audit/scripts/glance.mjs http://127.0.0.1:4700/ 390 1440 --out /tmp/glance
node .claude/skills/perception-gap-audit/scripts/glance.mjs http://127.0.0.1:4700/parts 390 --at "#form" --out /tmp/glance
node .claude/skills/perception-gap-audit/scripts/glance.mjs exports/poster.png 390 1080 --out /tmp/glance
```

Options: `--at <selector>` scrolls an element to the top first; `--height`, `--wait` (ms, default 1200), `--blur` (px), `--night-scale` (0 to 1), `--dpr`, `--name`. Widths default to 390 and 1440. An image input is scaled to each width, so a poster is judged at the size it will be seen. Playwright is loaded from `/opt/node22/lib/node_modules/playwright` when it exists, otherwise from a normal `require('playwright')`. Add `--help` for the full usage text. Keep the outputs out of the repository; they are test material, not source.

## Recall test script (people)

- **Setup.** One person at a time, on the device the audience uses, held as they normally would. Say: "I'll show you a screen for a few seconds, then ask what you remember. I'm testing the design, not you."
- **Show** for 5 seconds (3 for a poster or ad seen in passing, 8 for a dense dashboard), then hide it.
- **Ask**, in this order, and write the answers down word for word in the order they come:
  1. "What do you remember, in the order you noticed it?"
  2. "What is this, and who is it for?"
  3. "If you wanted to act on it, what would you do or tap?"
  4. "Was anything confusing?"
- **Do not** prompt, point or explain. If they ask what it is, ask what they think it is. Show each person one version only.
- **Record** per item the position each person mentioned it at, or "missed":

| Item (intended order) | P1 | P2 | P3 | P4 | P5 | Typical |
|---|---|---|---|---|---|---|
| 1 Headline | 1 | 1 | 2 | | | 1 |
| 2 What it is, for whom | missed | 3 | missed | | | missed |
| 3 The action | 2 | 2 | 1 | | | 2 |
| Not intended: the illustration | 3 | | 3 | | | 3 |

If two of three people miss the action, you have a gap. You do not need statistics for that.

## Subagent prompt (machine proxy)

Spawn a fresh general-purpose subagent (the Agent tool, called Task in older versions) for each image. Tell it nothing about the brief, the intent or the product:

```
You are seeing one screen for the first time, with no background. Look once at the
image at <absolute path>, the way a person glancing at a phone would.
1. List the first five things you noticed, in the order your attention went, one line each. Stop at five.
2. In one sentence: what is this, and who is it for?
3. What would you tap or do first, if anything?
4. What, if anything, was unclear?
Answer only from the image. Do not open other files or search.
```

Run it three times on the normal image, or once each on normal, night and squint, but never show one subagent two versions. A model reads every word at once and has no foveal attention, so it over-reports small text. Treat its result as a floor: if even the model misses or demotes the must-not-miss item, people will too.

## Output template

| Screen | Intended order (must not miss) | Perceived order (viewers, method) | Gap | Fix (lever) | Retest |
|---|---|---|---|---|---|

Add: what was noticed that should not have been, and the words viewers used for the product.

## Worked example: Flight Hour Solution, first screens

Captured with `glance.mjs` from the production build of `site-za/app` at commit 6718d55 on 25 September 2026. The squint and night observations come from the images, from one reviewer who knows the site. No recall test with people has been run yet, so the perceived column is a hypothesis to test, not a result.

Intended sequence, from `site-za/app/src/content/home.json` and `docs/za/blueprint.md`: the positioning line "Engine intelligence. Operational certainty.", then the subline saying what the company does and for whom, then the single hero button "Get in touch". Must not miss, for a maintenance controller with an aircraft on ground: the urgent route, which the blueprint keeps in the header on every screen so the hero can carry one button.

| Screen | Intended order | Perceived order (squint and night) | Gap | Fix to test |
|---|---|---|---|---|
| Home, 390 | headline, subline, Get in touch; must not miss: AOG route | headline, the orange button, the navy plane of the ident; the subline blurs into grey texture; the header urgent control is a faint ring with a WhatsApp glyph and no word, and nearly vanishes at night | The urgent route may be missed at phone width, which is where the brief says AOG buyers arrive | Show the word "AOG" beside the glyph at phone width (the label is hidden at 560 px and narrower in `site-za/app/src/site/za.css`); retest with the task "Your aircraft is grounded. Where do you tap?" |
| Home, 1440 | same | headline, then two orange "Get in touch" buttons (header and hero), then the plane; "AOG on WhatsApp" is readable but light | Two identical actions compete; harmless if viewers read the header one as chrome | Ask viewers how many actions they saw; change nothing unless they are confused |
| Parts, 390 | "Aircraft parts, verified before you pay", what to send, "Send parts request"; must not miss: the WhatsApp route for AOG | headline, the orange button, the paragraph; "Aircraft on ground? Use the WhatsApp line." is the last sentence of a five-line paragraph and is not a link | An AOG buyer may take the form, the slower route | Make "Use the WhatsApp line" a text link (not a second button) or open the subline with it; retest |

A side finding with the same cause: at 390 px the header's urgent link has no accessible name, because its only text is hidden with `display: none`, so a screen reader announces an unnamed link. Perception gaps and accessibility bugs often share a root.

## Common failure modes

- Writing the intended order after looking at the screenshot.
- Testing with the team, who cannot un-know the content.
- Showing the screen too long, or asking leading questions ("did you see the button?").
- Testing only at desktop width when the audience is on phones.
- Closing gaps by adding (a badge, a second button, an animation) instead of removing a competitor.
- Treating the subagent as a verdict. It is a floor.
- Letting the audit slide into taste. Stay with order, missed items and the words people used.
- Explaining the design after the test and counting the explanation as success.

## Source

Distilled from Satori Graphics, "The ONLY Video You Need To Learn High-Level Design Thinking", YouTube, 29 June 2026, 10 min 19 s, https://www.youtube.com/watch?v=VzQl1Tl_LPM (the section on perception gaps and the show-then-recall layout test). The recall script, subagent proxy, glance script and worked example are additions for UI work.
