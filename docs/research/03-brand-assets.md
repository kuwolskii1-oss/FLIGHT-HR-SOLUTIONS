# 03 · Brand assets, palette, typography and imagery

Extracted 19 September 2026 from the live site's Elementor kit CSS (`assets/site-archive/css/elementor-kit-post-8.css`), the logo SVG and the media library. Files are in `assets/brand/`.

## 1. Logo

| Item | Detail |
|---|---|
| Primary file | `logo-flight-hour-solution.svg` (original name `01_Flight-Hour-Solution_podstawowe.svg`; "podstawowe" is Polish for "basic/primary", and the SVG layer is named "Warstwa 1", Polish for "Layer 1", so the identity was produced by a Polish designer or agency) |
| Construction | Horizontal wordmark, viewBox 668.4 × 157. "Flight Hour" in navy, "Solution" in orange, a small orange dot over the "i" of Flight, an orange swoosh rising from the "S" of Solution ending in a navy aircraft silhouette, and the tagline "Keeps you FLYING" in letter-spaced navy caps underneath. Text is outlined (paths), so the typeface cannot be read from the file; it is a rounded humanist sans close to Nunito/Quicksand |
| Colours in file | `#1C205C` (navy) and `#EE7203` (orange); no gradients |
| Favicon / app icon | `favicon-512.png`: navy rounded square, white aircraft silhouette, orange swoosh. A clean, recognisable mark that works at 16 px; suitable as the basis for a standalone brand symbol |
| Other copies | `linkedin-company-logo-200.jpg` (LinkedIn), `logo-as-published-on-swiss-aerospace-cluster.jpg` (JPG on white, 1,000-px class) |
| Missing | No monochrome or reversed (white-on-navy) version, no stacked version, no clear-space or minimum-size rules, no brand guideline document found anywhere public |

## 2. Colour palette (Elementor global colours)

| Role in kit | Hex | Notes |
|---|---|---|
| Primary | `#1C205C` | Deep navy; headings, nav text, buttons' text, logo |
| Accent | `#EE7203` | Orange; CTAs ("Call us now" pill), highlighted word in headings, icons, logo |
| Secondary | `#BCBDD0` | Cool grey-lavender; icon fills, dividers |
| Text | `#494D84` | Muted indigo body text (low contrast on white: about 5.9:1, passes AA for body, fails AAA) |
| Light surface | `#F5F5F5` | Section backgrounds |
| Supporting tints seen in CSS | `#FF9C43`, `#FFBC7D` (orange tints), `#F0F0F0`, `#C2C2CC`, `#C4C4C4`, `#CCCCCC` (greys), `#FFFFFF` |

Observations: the navy–orange pairing is strong and ownable in a sector dominated by blue-and-grey corporate sites (see the competitor benchmark). Orange is used inconsistently (both as CTA and as decorative headline colour), and the body-text indigo reduces legibility on long passages. The new site can keep navy + orange as the core and add a true neutral (near-black for text, warm greys for surfaces) plus one data colour for charts.

## 3. Typography

| Element | Current setting |
|---|---|
| Family | Nunito (Google Fonts, loaded from fonts.googleapis.com with all 18 weights/styles requested, `latin-ext` subset) — a privacy and performance issue in the EU/CH context (Google Fonts should be self-hosted) |
| Global weights | Primary/headings 700, secondary 600, accent 600, body 400 |
| Body size | 16 px |
| Display sizes found in CSS | 128, 101, 80, 72, 67, 55, 53, 50, 48, 42, 36, 33, 32, 27, 24, 21, 19, 18, 15, 14, 13, 12 px: no type scale, sizes were set ad hoc per widget |
| Secondary family | Montserrat (only inside the host's bot-challenge page, not part of the brand) |
| Heading structure | Every heading on the site is an H2 (no H1 anywhere), including "Phone number:" and "E-mail Address:" labels |

## 4. Shapes, spacing and components
- Rounded everything: 20 px and 30 px radii on cards and images, 51–100 px pill buttons.
- Containers: 1470 px wide sections with 967 px content blocks; heavy vertical padding.
- Components in use: Elementor nav menu with hamburger on mobile, icon list, social icons (LinkedIn, WhatsApp), Elementor Pro form, popup, image cards with arrow-in-circle links, three-column value cards with custom line icons, cookie banner (CookieYes / Cookie Law Info).
- Iconography: seven custom line icons (`icon-*.svg`, 116–255 px artboards, navy `#494D84` strokes with `#EE7203`/`#BCBDD0` fills); rounded-square 85 px icon tiles (`icon-Group-352.svg`); decorative grid lines (`decor-Vector-3.svg`) and masked photo shapes (`decor-Mask-group-1.svg`).

## 5. Imagery inventory (media library, 39 items)

| File | Size | Content | Rights status |
|---|---|---|---|
| image-17 / image-17-1 | 655 × 691 PNG/WebP | Cut-out turbofan front (fan blades with gold tips) used as the hero visual | Source unknown (looks like a stock render); no licence recorded |
| AdobeStock_21354821 | 1920 × 1273 WebP | Wing and engine above clouds (service card "What We Offer") | Adobe Stock asset ID visible in filename; licence holder unknown |
| AdobeStock_271291361 | 1920 × 1080 WebP | Aviation stock photo (service card) | Adobe Stock, licence unknown |
| AdobeStock_271291562, AdobeStock_369977292 | WebP | Aviation stock photos (unused/removed variants) | Adobe Stock, licence unknown |
| 1000_F_369977292…, 1000_F_271291361… | 1000 px JPG | **Adobe Stock comp/preview downloads** (the `1000_F_` prefix is Adobe's watermark-preview naming), later replaced by the WebP versions | Indicates previews were used during build; confirm paid licences exist |
| Bundeswehreinsatz-in-Niger-beendet | 1300 px WebP | Photo of a military aircraft/personnel; the filename is a German news headline ("Bundeswehr deployment in Niger ended"), used on the Military & Government card | **High risk: appears to be a press/news photograph. Do not reuse without a licence.** |
| image-18 | 1920 × 906 PNG (825 KB) | Large hero/background photo | Unknown |
| image-24, image-25, image-26 | 865–1000 px | Section photos (aircraft/engine) | Unknown |
| clouds-footer | 1920 × 341 WebP | Cloud band above footer | Unknown |
| favicon, cropped-favicon | 512 px PNG | App icon | Own |
| 24 SVG files | – | Logo, icons, arrows, masks | Own |

Every image has an empty `alt` attribute. PNG photographs up to 825 KB are served unoptimised alongside WebP variants. Recommendation for the rebuild: commission or license a coherent photo set (engine shop floor, borescope work, test cell, documents/records, the team), keep the cut-out turbofan idea if rights can be confirmed, and drop the press photo.

## 6. Voice and tone as it stands
Formal, generic B2B ("tailored", "seasoned professionals", "long-term success"), with non-native grammar. The one distinctive line is the tagline "Keeps you FLYING". The LinkedIn feed is more concrete and confident (engine models, cycles remaining, direct asks). The new site's copy should sound like the LinkedIn feed: specific engine families, numbers, and plain statements of what is delivered.
