---
name: arrival-state-design
description: Tune a design to the state people are already in when they arrive, not only to the message. Map each audience's emotional and practical arrival state (mood, urgency, trust, expertise, attention) and real viewing context (device, light, brightness, tiredness, connection), then set tone, density, contrast, pace, typography and the primary route to meet them there. Includes the "phone at night, half tired, brightness down, not a designer" test and a worksheet. Use when asked "does this feel right for the audience", "who is this for", "what mindset are they in", "is the tone right", "match the audience", "design for mobile users", "persona check", "one page for very different visitors", or as part of a "design review".
---

# Arrival state design

Every design is met by a person who is already in some state. Someone scrolling a charity site may be cautious, looking for trust and emotionally open; someone flicking through a fashion magazine is relaxed and not thinking hard. The same layout cannot suit both. The fashion advert can lean on bold contrast and confident type to create a feeling in an instant; the charity page has to earn trust first. If the design ignores the state people arrive in, it feels off straight away, however good the message. So before tuning the message, meet the person where they already are.

The second half of the idea: you are not designing for a designer zooming into your kerning. You are designing for someone on a phone at night, half tired, with the brightness turned down, who has no design background. Remembering that person leads to better choices.

## When to use

- At the start of any page, screen, campaign or poster, before layout.
- When one surface serves very different visitors (a routing homepage, pricing for self-serve and enterprise buyers).
- When the copy is right but the page "feels off".
- Urgent or stressful flows (outages, emergencies, money, health, legal), and any mobile-first work.

## When not to use

- As a substitute for research. If you do not know how people arrive, mark the worksheet as assumptions and get evidence: analytics, entry points, support tickets, interviews (see `customer-research`).
- Internal tools used by experts in controlled conditions. Keep the context row; the emotional rows matter less.

## Procedure

1. **List who actually arrives.** One row per audience, taken from the brief, analytics and entry points (an ad, a search, a link shared in a chat, a procurement portal). Merge two audiences only if their state is the same.
2. **Fill the arrival state.** What happened just before they came; emotional state (calm, anxious, sceptical, excited, bored); urgency (seconds, hours, weeks); trust (what they already believe about you); expertise (do they know the vocabulary?); attention (glancing, reading, comparing).
3. **Fill the viewing context.** Device and width; light (office, sun, bed at night); brightness; connection and data cost; one hand or two; interruptions; language.
4. **Write what each audience needs first** (to feel safe, to find the route, to see the price, to check credentials) and what would feel off to them (too loud, too salesy, too slow, too dense, too playful).
5. **Translate into settings** for each audience or entry point:
   - Tone: warmth and formality of the words.
   - Density: how much per screen, how much reading is asked.
   - Contrast and size: set for the worst plausible viewing context, not the best.
   - Pace: how fast to the action; how much motion.
   - Typography: size, weight, measure, case.
   - Route: the one primary action for that state.
6. **Resolve conflicts on shared surfaces.** The most urgent state gets the fastest visible route; the most sceptical state gets the proof; everyone else gets a clear door to their own page.
7. **Run the phone at night test** (below) against the worst-case context.
8. **Check with a person in that state** where you can, briefing them into it ("It is late, your aircraft is grounded, find the part"), using the recall test in `../perception-gap-audit/SKILL.md`.

## The phone at night test

Picture the viewer: on a phone, at night, half tired, brightness down, not a designer. Then:

1. Capture the screen: `node .claude/skills/perception-gap-audit/scripts/glance.mjs <url> 390 --out /tmp/glance`, and open the `night` image at its small size. Do not zoom in.
2. Can you read the headline and find the one action within three seconds?
3. Which labels, hints and secondary text survive? Small muted text often passes contrast checks and still vanishes here.
4. Is anything carried only by a thin outline, an icon without a word, or colour alone?
5. Does the screen ask for more reading than a tired person will do?
6. Flip it: in bright sun at full brightness, do pale tints and hairlines disappear?

A must-not-miss item that fails any of these is a bug, not a matter of taste.

## Worksheet

| Audience | Arrives from | Emotional state | Urgency | Trust | Expertise | Device, light, attention | Needs first | Would feel off | Settings (tone, density, contrast, pace, type, route) |
|---|---|---|---|---|---|---|---|---|---|

## Worked example: Flight Hour Solution doors

The South African site (`site-za/app`) routes very different visitors through five doors. States below come from `docs/za/brief-fhs-south-africa.html` (sections 2, 4 and 6) and `site-za/BRIEF.md`; quotes are the brief's or the site's own words. "Assumption" marks what the brief does not say.

| Audience (door) | Arrival state | Context | Needs first | Would feel off | Settings |
|---|---|---|---|---|---|
| Maintenance controller with an aircraft on ground (Parts) | Typical timing "Hours (AOG)"; under time pressure; expert, arrives with a part number | The brief: AOG buyers "often arrive from a phone"; data is expensive; out of hours is an assumption | The fastest route to a person, with the part number in the first message | A form as the only visible route; a heavy hero; a response time nobody has agreed to staff | WhatsApp as the urgent channel with a pre-filled AOG message; the route visible without scrolling; plain, short words |
| Airline, lessor or engine owner (Engines) | "Weeks to months"; records are sensitive (the brief: records only after an NDA) | Desktop, office, reading (assumption) | Proof of method: "We verify before you commit, and we sign an NDA before asking for records." | Upload fields at first contact; hype | Calm and specific; five numbered steps; no uploads on the form |
| Charter booker: corporate, group or pilgrimage, mining, humanitarian (Charter) | "Days to weeks"; may be booking for many people; must be able to show the booking is legitimate | Phone or desktop | What to send (route, dates, count or cargo weight) and who flies the aircraft | Anything implying the company operates the flight | The operator disclaimer on the page and under the form; "subject to aircraft availability" kept |
| Government procurement team | Checking credentials; the brief: a company registered in 2026 "will be checked hard" | Desktop, formal (assumption) | Registered name and number; B-BBEE and CSD if held | Informality; claims that cannot be verified | Registered name and number in the footer of every page; B-BBEE and CSD badges shown only once held |
| New airline or government buyer (Aircraft, Advisory) | "Months"; the brief: new airlines and governments "often know the mission, not the type" | Desktop (assumption) | Permission to describe the mission; a conversation, not a proposal | Forms that demand a type | "Know the type, or only the mission? Either works." and "This form starts a conversation, not a proposal." |

**Phone at night result, Parts page at 390 px** (night image from `glance.mjs`, production build at commit 6718d55, 25 September 2026): the headline and the orange "Send parts request" button survive. The header's urgent control shows as a faint ring with a WhatsApp glyph and no word, because the "AOG on WhatsApp" label is hidden at 560 px and narrower. The small monospace labels ("Who comes in", "Typical timing", set in uppercase at 12 px) nearly vanish, although their contrast on navy is about 6.9:1 and passes WCAG. So the most urgent visitor gets the least visible route.

Two fixes are design changes: show "AOG" beside the glyph at phone width, and make "Use the WhatsApp line" in the Parts hero a link. Two are decisions the site already lists as open with the client (`clientToConfirm` in `site-za/app/src/content/site.json`): the WhatsApp Business number (until it exists, the urgent button goes to the contact page's urgent block) and staffed AOG hours in SAST. The brief's rule applies: only promise what the team can actually staff.

## Common failure modes

- Designing for an average visitor who does not exist. Pick real states.
- Treating "mobile" as a width rather than a state: one hand, glare, interruptions, data cost.
- Matching the message but not the mood: a correct but loud page for a cautious visitor.
- Judging the work the way designers do, at 200% zoom on a calibrated screen.
- Answering an arrival-state gap with decoration when it needs a decision (hours, a phone number, a price).
- Serving every state on one screen instead of giving each its own door.

## Source

Distilled from Satori Graphics, "The ONLY Video You Need To Learn High-Level Design Thinking", YouTube, 29 June 2026, 10 min 19 s, https://www.youtube.com/watch?v=VzQl1Tl_LPM (the sections on the viewer's emotional starting point, with the charity site and fashion magazine comparison, and on designing for the tired phone user rather than for other designers). The worksheet, the test steps and the worked example are additions for UI work.
