---
name: streamline-icons
description: Find, license, fetch and use Streamline icons (streamlinehq.com), above all the free Guidance set of signage and wayfinding pictograms (24 px grid, CC BY 4.0). Covers which Streamline sets are free and open source versus Pro, the exact credit the licence needs and where it goes on a website, searching icon names through the Iconify API, Streamline's Figma plugin, VS Code extension and MCP server, and a no-dependency script that turns icon ids into typed React components, an SVG map or an Iconify JSON file. Use when the user mentions Streamline, streamlinehq, Guidance icons, "the best icon library", wayfinding or signage icons, airport-style pictograms, icons for the doors or services, "add icons", "which icon set", "icon credit", "icon attribution", "CC BY icons", Iconify, or needs plane, departure, arrival, luggage, customs, passport, tickets, information desk, phone, mail, clock, globe, map, location or arrow icons.
---

# Streamline icons

Streamline (streamlinehq.com, made by Webalys) is a large library of icons, illustrations and emoji with a web app, design-tool plugins and an MCP server. Most families need a paid licence. A set of free families is released under CC BY 4.0, and the one this project cares most about is **Guidance**: signage and wayfinding pictograms ("designed for signage and wayfinding, perfect for creating clear, directional icon systems"), drawn on a 24 px grid. Its page: https://www.streamlinehq.com/icons/guidance

Facts in this skill were checked on 25 September 2026 against streamlinehq.com, the Streamline help centre, the Iconify API and the `@iconify-json/*` packages on npm.

## Free versus Pro

**Free and open source (CC BY 4.0).** Iconify mirrors 22 Streamline sets, all authored by Streamline with source vectors at https://github.com/webalys-hq/streamline-vectors. Every one is on npm as `@iconify-json/<prefix>`.

| Iconify prefix | Name | Icons | Drawn on | Drawing |
| --- | --- | --- | --- | --- |
| `guidance` | Guidance | 360 (366 on streamlinehq.com) | 24 | line, 1 px stroke inherited from the root, butt caps |
| `streamline` | Core free | 3000 (older names still resolve as hidden icons or aliases) | 14 | line, round caps; `-solid` and `-remix` variants |
| `streamline-flex` | Flex free | 1500 | 14 | line, round caps; `-solid` and `-remix` variants |
| `streamline-sharp` | Sharp free | 1500 | 24 | line, 1.5 stroke, square ends; `-solid`, `-remix` |
| `streamline-plump` | Plump free | 1499 | 48 | chunky line (3 on 48), round joins; `-solid`, `-remix` |
| `streamline-ultimate` | Ultimate free | 1999 | 24 | line, 1.5 stroke, round; `-bold` variants |
| `streamline-freehand` | Freehand free | 1000 | 24 | hand-drawn, filled outlines |
| `streamline-cyber` | Cyber free | 500 | 24 | line, round, techy |
| `streamline-block` | Block | 300 | 16 | solid blocky shapes |
| `streamline-pixel` | Pixel free | 662 | 32 | pixel art, filled |
| `streamline-logos` | Logos free | 1362 | 24 | brand marks; line, `-solid` and `-block` variants |
| `streamline-emojis` | Emojis | 787 | 48 | full-colour emoji |
| `covid` | Covid | 142 | 24 | line, 1.5 stroke |
| `streamline-color`, `streamline-flex-color`, `streamline-sharp-color`, `streamline-plump-color`, `streamline-ultimate-color`, `streamline-freehand-color`, `streamline-cyber-color`, `streamline-kameleon-color`, `streamline-stickies-color` | colour variants | 200 to 2000 each | 14 to 48 | fixed multi-colour palettes (hex fills) |

**Pro (paid plan).** The full families on streamlinehq.com: Ultimate, Core, Flex, Sharp, Plump, Micro, Freehand, Streamline Material, Nova, Cyber and others. The free sets above are subsets of some of them. Without a plan, Pro icons are only available as low-resolution PNG previews (icons up to 48 px); SVG needs a licence. Never lift Pro SVGs from anywhere else.

**Not Streamline's.** streamlinehq.com also hosts third-party open-source sets (Lucide, Phosphor, Tabler, Heroicons, Material, Font Awesome, Remix and more). Those carry their own licences. Streamline also has free sets that are *not* open source (for example UI Icons Line, Kawaii Emoji, Freemoji); they fall under the Streamline Free License only. Check the set description for "CC BY 4.0".

## Licence and credit

Two sets of terms apply to the free sets, and a website should satisfy both:

1. **CC BY 4.0** (https://creativecommons.org/licenses/by/4.0/, section 3(a)): commercial use, modification and redistribution are allowed if you credit the creator in the way they ask, link the material where practicable, name the licence with a link to it, and say if you modified the icons.
2. **Streamline Free License** (https://home.streamlinehq.com/license-free): attribution is required for every free asset, open-source sets included. Use a readable link such as "Free icons from Streamline" pointing to https://streamlinehq.com. On a website, put it on every page that shows the icons (the footer is fine); if space is short, a Credits or About page. Use a normal link: no `rel="nofollow"`. The page also caps free use at **50 icons per project** and forbids offering the icons to your users as a pickable library (site builders, editors, icon pickers). The page says a paid plan removes the credit requirement; paid plans carry their own licence terms.

Ready to paste:

- **Every page** (the global footer is simplest):
  ```html
  <a href="https://streamlinehq.com">Free icons from Streamline</a>
  ```
- **Credits or legal page:**
  > Icons: "Guidance" by Streamline (https://streamlinehq.com), from https://www.streamlinehq.com/icons/guidance, licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Used unchanged apart from size, colour and stroke weight.

  If you edit the paths, replace the last sentence with "Adapted from the original: <what changed>." Name every Streamline set you use.
- **Code:** keep the header comment that `scripts/fetch-icons.mjs` writes (set, licence, source, credit line). For a hand-copied SVG, add `{/* "plane" from Guidance by Streamline, CC BY 4.0, https://streamlinehq.com */}` beside it.

Size, colour through `currentColor` and a stroke weight set in CSS are rendering choices; editing the paths is a modification.

## Finding icons

- **Offline list:** [references/guidance-icons.md](references/guidance-icons.md) has all 360 Guidance names by category plus the upstream quirks. Read it before guessing a name.
- **Search:** `https://api.iconify.design/search?query=plane&prefix=guidance` returns `{"icons": ["guidance:plane", ...]}`. Search several sets with `&prefixes=guidance,streamline-logos`. `limit` is at least 32.
- **List a set by category:** `https://api.iconify.design/collection?prefix=guidance` (add `&info=true` for author, licence and grid).
- **Set metadata:** `https://api.iconify.design/collections?prefixes=guidance,streamline`.
- **One SVG:** `https://api.iconify.design/guidance/plane.svg` (1em square; add `?height=48` or `?color=%231d3557`). Icon data: `https://api.iconify.design/guidance.json?icons=plane,departure`.
- **Browse visually:** https://icon-sets.iconify.design/guidance/ or the Streamline page above.
- **npm:** `@iconify-json/guidance` (and the other prefixes) holds `icons.json` for build tools such as unplugin-icons or `@iconify/tailwind4`. For hand-picked icons, generating components with the script below is lighter and adds no runtime dependency.
- **Source repository:** https://github.com/webalys-hq/streamline-vectors (its README states CC BY 4.0 and the link-to-Streamline credit).
- **Streamline's own tools:** web app https://www.streamlinehq.com/icons; Figma plugin https://www.figma.com/community/plugin/852192486284901337; VS Code extension https://marketplace.visualstudio.com/items?itemName=streamline.streamline-icons; plugins for Framer, Miro and Lucid. The **MCP server** searches and pulls assets from inside the agent: `claude mcp add --transport http streamline https://public-api.streamlinehq.com/mcp`, then run `/mcp`, pick `streamline` and sign in with a Streamline account. Adding an MCP server changes the user's setup, so suggest it rather than adding it unasked. Pro assets pulled through any of these tools still need a paid plan.

## Fetch script

`scripts/fetch-icons.mjs` (Node 22+, no dependencies) downloads icon data from `https://api.iconify.design/<prefix>.json?icons=a,b,c` and writes React components, a raw SVG map or an Iconify-format set, picked by `--out` and `--iconify`:

```bash
# Typed React components
node .claude/skills/streamline-icons/scripts/fetch-icons.mjs \
  --out src/icons/wayfinding.tsx guidance:plane guidance:departure guidance:tools

# Raw SVG map; --from takes a JSON array of ids or an object with an "icons" array
node .claude/skills/streamline-icons/scripts/fetch-icons.mjs --from ids.json --out /tmp/icons.json

# Iconify-format set; --from also reads such a file, so this refreshes it and adds one icon
node .claude/skills/streamline-icons/scripts/fetch-icons.mjs --iconify \
  --from src/icons/pictograms.json --out src/icons/pictograms.json guidance:customs
```

Options: `--iconify` (Iconify format for a `.json` output), `--prefix-names` (GuidancePlane, for mixing sets whose names clash), `--suffix Icon` (PlaneIcon), `--dry-run` (resolve and print only), `--api <url>`, `--help`.

- **`.tsx` output:** one exported component per icon with a PascalCase name (`luggage-check-in` becomes `LuggageCheckIn`). Props: `size` (number or CSS length, default 24) plus every SVG prop, forwarded to the `<svg>`. Icons are `aria-hidden` unless you pass `title` (renders `<title>` and `role="img"`) or `aria-label`. `fill` and `stroke` stay exactly as drawn, so line sets follow `currentColor`. It also exports the `IconProps` type. Names that would shadow a global get `Icon` appended (`Map` becomes `MapIcon`, `Lock` becomes `LockIcon`); names starting with a digit get `Icon` in front (`Icon24Hours`). Element ids in colour icons are rebuilt with React's `useId()` so repeated icons never clash, and aliases, flips and rotations are resolved the way Iconify does.
- **`.json` output:** `{"prefix:name": "<svg ...>...</svg>"}` at the icon's native size.
- **`.json` with `--iconify`:** `{ prefix, width, height, set, author, license, source, icons: { name: { body } } }` for one set, the format Iconify tools read. Names keep the input order, so refreshing an existing file changes only what changed.
- It prints every id it resolved and the credit line. An unknown set, an unknown icon, a malformed id or a name clash stops it with exit code 1 and nothing is written; missing ids come with a search link.
- Behind an HTTPS proxy it re-runs itself with `NODE_USE_ENV_PROXY=1` so the built-in fetch uses the proxy.
- To type-check a generated file outside a project with TypeScript 6, run tsc from a project that has React types and add `--ignoreConfig`, for example `npx tsc --ignoreConfig --noEmit --jsx react-jsx --strict --skipLibCheck file.tsx`.

## Using icons in UI

- **One family per interface.** Pick one Streamline family and stay in it: never mix Guidance with Lucide, Phosphor or another Streamline family on the same surface. Brand marks are the one routine exception (use the brand's own mark or `streamline-logos`).
- **Keep the grid and weight.** Guidance is drawn at 24 px with a 1 px stroke that scales with the icon: 16 px gives 0.67 px lines and 20 px gives 0.83 px, which look faint; 24 px gives 1 px, 32 px 1.33 px, 48 px 2 px. Render at 24 or whole multiples (48, 72, 96) for signage. At 16 or 20 px, pass `strokeWidth={24 / size}` (1.5 at 16, 1.2 at 20) so lines stay near 1 px; this works because Guidance paths inherit the stroke width from the root. Keep one rendered stroke weight across a view. Core, Flex and Cyber inherit the stroke width the same way; Sharp, Ultimate, Plump and Covid set it on each path, so the root override does not reach them.
- **Colour with `currentColor`.** Set `color` in CSS; never hard-code fills on line sets. Do not recolour multi-colour sets (`*-color`, emojis, stickies, kameleon): their palettes are designed, and their dark outlines vanish on dark tiles. Keep them off solid tiles.
- **Optical alignment with text.** Put icon and label in a flex row with `align-items: center` and a gap of about 0.5em. Match the icon to the text's cap height or line height rather than its font size, and nudge by 1 px where a shape looks off-centre (open shapes such as arrows and speech bubbles often need it).
- **Accessibility.** A decorative icon next to a visible label stays `aria-hidden` (the default). A meaningful icon on its own gets `title`. For an icon-only button, put `aria-label` on the button and leave the icon hidden. Graphics that carry meaning need at least 3:1 contrast against their background (WCAG 1.4.11).
- **Wayfinding reads best as signs.** At large sizes, put the pictogram in a solid square tile with the icon at about 60 to 65 percent of the tile (40 px in a 64 px tile), strong contrast and a consistent corner radius, as on airport signs. Always pair it with a text label. Place direction arrows on the side they point to.
- **Check arrows by eye.** In Guidance, `left-arrow` and `left-2-short-arrow` are drawn pointing right and `right-arrow` and `right-2-short-arrow` point left. Alias on import if that helps: `import { LeftArrow as ArrowRight } from "./wayfinding-icons"`.
- **Motion.** For animated swaps (spinner to check, open to close), use the `transitions-dev` skill (icon swap) rather than ad-hoc keyframes.
- **Budget.** Stay under 50 Streamline icons per project (the Free License cap) unless the client buys a plan.

## When to use which set

| Need | Set |
| --- | --- |
| Wayfinding, signage, facilities, transport, safety notices | `guidance` |
| General UI glyphs at 14 to 24 px, widest free coverage | `streamline` (Core) or `streamline-flex` |
| Precise, technical, enterprise UI | `streamline-sharp` |
| Friendly, rounded consumer UI | `streamline-plump` |
| Niche objects (vehicles, finance, industry), regular and bold | `streamline-ultimate` |
| Editorial or playful, hand-drawn | `streamline-freehand` |
| Futuristic or developer products | `streamline-cyber` |
| Brand logos | `streamline-logos` |
| Big graphic shapes in small numbers | `streamline-block` |
| Retro or game UI | `streamline-pixel` |
| Colour spot art for empty states or marketing | a `*-color` set or `streamline-emojis` |
| Health and hygiene notices | `covid` |
| Micro, Nova, Material or anything beyond the free subsets | Pro plan |

## This repository: site-za

The South African aviation site in `site-za/app` uses Guidance for its wayfinding pictograms:

- `src/site/pictograms.json` holds the icon bodies in Iconify format: 48 Guidance icons on 25 September 2026, every one resolved against the Iconify API.
- `src/components/site/Pictogram.tsx` renders them: `Pictogram` (aria-hidden unless given a `title`) and `PictoTile` (the solid sign tile).
- `src/site/wayfinding.ts` maps doors, sections and items to icon names. `src/site/wayfinding.css` sets the stroke weight per context (1.4 to 1.9 on small uses), which works because Guidance paths inherit it.
- The five doors come from `src/content/site.json` (`nav.doors`).

Door pictograms as built, with verified alternatives:

| Door | Icon | Alternatives |
| --- | --- | --- |
| Engines, Engine 360 | `settings` | `tools`. No free Streamline set has a turbine or jet engine. |
| Aircraft | `airplane-mode` | `plane` (the angled signage plane) |
| Parts | `tools` | `luggage-conveyor-belt` |
| Charter | `departure` | `tickets`, `helicopter` |
| Advisory | `conference-room` | `meeting-room`, `information-desk-symbol` |
| About | `information-desk-symbol` | |
| Contact | `chat` | `phone`, `mail` |

When changing it:

- **Budget:** 48 of the 50 icons the Free License allows per project are in use. Swap rather than add, or raise a paid plan with the client.
- **Add or refresh** from the repository root, with `--dry-run` first: `node .claude/skills/streamline-icons/scripts/fetch-icons.mjs --iconify --from site-za/app/src/site/pictograms.json --out site-za/app/src/site/pictograms.json guidance:<name>`. To drop an icon, delete its key from the JSON and its uses in `wayfinding.ts`.
- **Verified swaps worth knowing:** `24-hours` (AOG line, once staffed hours are confirmed), `customs` (parts checks, import clearance), `folder` (technical records). For WhatsApp use the brand's own mark: `streamline-logos:whatsapp-logo` (same 1 px line; generate it through the `.tsx` output, since an Iconify file holds one set) or the hand-drawn glyph in `src/components/site/Icons.tsx`.
- **Arrows:** the site's forward arrow is `left-arrow` on purpose, because Guidance draws it pointing right. Do not "fix" it to `right-arrow`.
- **Credit:** the footer must carry the "Free icons from Streamline" link on every page, and the legal page the full line (see Licence and credit). Check both before launch.
- `src/components/site/Icons.tsx` keeps hand-drawn UI glyphs on a 20 px grid with a 1.5 stroke and round caps (arrows, chevrons, menu, close, WhatsApp). Keep them apart from Guidance pictograms at the same size. Leave `LearnChevron` alone; the transitions.dev learn-more hover animates it.
- `src/layouts/custom.tsx` (the template's `/app` layout, not the public site) imports `lucide-react` and `@phosphor-icons/react`. Do not use either for the site's pictograms.
- If the client wants a literal engine, draw one in the Guidance style (24 px box, 1 px stroke, butt caps, no fills, nearly edge to edge like the originals) and do not credit it to Streamline.
