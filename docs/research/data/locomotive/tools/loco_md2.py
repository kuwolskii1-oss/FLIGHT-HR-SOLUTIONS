import json, glob, os, sys, re
from collections import Counter
DATA, AWF, SITESF, STATICF = sys.argv[1:5]
AW = json.load(open(AWF)); ST = json.load(open(STATICF))
order = [l.split()[0] for l in open(SITESF) if l.strip()]
sites = {}
for f in glob.glob(os.path.join(DATA, '*.json')):
    d = json.load(open(f)); sites[d['label']] = d

EMOJI = re.compile('[\U0001F300-\U0001FAFF☀-➿️​]')
def _lin2srgb(x):
    x = max(0.0, min(1.0, x))
    return 12.92 * x if x <= 0.0031308 else 1.055 * (x ** (1 / 2.4)) - 0.055
def _oklab2hex(L, a, b):
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s3 = l_ ** 3, m_ ** 3, s_ ** 3
    r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s3
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s3
    bb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s3
    return '#%02X%02X%02X' % tuple(round(_lin2srgb(v) * 255) for v in (r, g, bb))
def rgb2hex(c):
    c = c or ''
    m = re.match(r'rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)', c)
    if m:
        if m.group(4) is not None and float(m.group(4)) == 0: return 'transparent'
        h = '#%02X%02X%02X' % tuple(int(m.group(i)) for i in (1, 2, 3))
        return h + (f" @{round(float(m.group(4)) * 100)}%" if m.group(4) is not None and float(m.group(4)) < 1 else '')
    m = re.match(r'okl(ch|ab)\(([\d.]+)%?\s+([\d.-]+)\s+([\d.-]+)(?:\s*/\s*([\d.]+%?))?\)', c)
    if m:
        kind, L, x, y, alpha = m.groups(); L = float(L); L = L / 100 if '%' in c.split('(')[1].split()[0] else L
        x, y = float(x), float(y)
        if kind == 'ch':
            import math
            a, b = x * math.cos(math.radians(y)), x * math.sin(math.radians(y))
        else: a, b = x, y
        h = _oklab2hex(L, a, b)
        if alpha:
            al = float(alpha.rstrip('%')) / (100 if '%' in alpha else 1)
            if al == 0: return 'transparent'
            if al < 1: h += f" @{round(al * 100)}%"
        return h
    return c or '—'
def clean_text(t):
    raw = re.sub(r'\s+', ' ', t or '').strip()
    t = EMOJI.sub('', raw).strip()
    words = t.split(' '); out = []; dup = 0
    for w in words:
        if out and out[-1] == w: dup += 1; continue
        out.append(w)
    if dup >= 2: t = ' '.join(out)          # whole-phrase duplication from split-text, not a name like "Pangram Pangram"
    parts = re.split(r'(?<=[.!?])\s+', t); out = []; sdup = 0
    for p in parts:
        if out and out[-1] == p: sdup += 1; continue
        out.append(p)
    if sdup >= 1: t = ' '.join(out)
    note = None
    if EMOJI.search(raw): note = 'decorative emoji glyphs in the rendered H1 removed'
    elif t != EMOJI.sub('', raw).strip(): note = 'split-text duplicates collapsed (the DOM carries each word twice for the reveal animation)'
    return t, note
def valid(m):
    if not m or m.get('error'): return False
    try:
        if int(m.get('status') or 0) >= 400: return False
    except Exception: pass
    if not m.get('status'): return False
    h1 = ((m.get('h1') or {}).get('text') or '')
    if '403' in h1 and 'ERROR' in h1.upper(): return False
    if (m.get('maxFontPx') or 0) <= 0: return False
    return True
def partial(m):
    return valid(m) and (m.get('maxFontPx') or 0) < 20 and not m.get('headings')
def status_of(lab):
    d = sites.get(lab) or {}
    de, mo = d.get('desktop'), d.get('mobile')
    if valid(de) and not partial(de): return 'desktop'
    if valid(de) and partial(de): return 'desktop-partial'
    if valid(mo): return 'mobile'
    st = ST.get(lab) or {}
    if st.get('status') == '200': return 'static'
    return 'unreachable'
def fam(m, n=3): return ', '.join(f'{k} ({v})' for k, v in (m.get('fontFamilies') or [])[:n]) or '—'
def hero(m):
    h = m.get('h1')
    if not h: return '—'
    t, _ = clean_text(h['text'])
    up = ' UPPER' if h.get('transform') == 'uppercase' else ''
    return f"{h['size']}px {h['family']} {h['weight']} lh {h['lh']}{up} — “{t[:70]}”"
def flags(m):
    s = m.get('signals', {}); out = []
    for k, lab in [('customCursor', 'custom cursor'), ('marquee', 'marquee'), ('preloader', 'preloader'), ('textSplit', 'split-text reveals'), ('magnetic', 'magnetic'), ('parallax', 'parallax attrs'), ('horizontalScroll', 'horizontal scroll'), ('themeSwitch', 'theme switching'), ('scrollContainer', 'smooth-scroll container'), ('pageTransitions', 'page transitions'), ('darkFirstView', 'dark first view')]:
        if s.get(k): out.append(lab)
    if s.get('sticky'): out.append(f"sticky×{s['sticky']}")
    if s.get('videos'): out.append(f"video×{s['videos']}")
    if s.get('canvases'): out.append(f"canvas×{s['canvases']}")
    return ', '.join(out) or '—'
def libs_of(m):
    sig = m.get('scriptSignatures') or {}; g = m.get('libs') or {}; h = m.get('scriptHints') or {}
    found = [k for k, v in sig.items() if v and k not in ('IntersectionObserver', 'reducedMotion')]
    found += [k for k, v in g.items() if v and k not in found]
    found += [k for k in h if k in ('_nuxt', '_next', '_astro', 'wp-content', 'cpresources', 'webflow', 'shopify', 'contentful', 'sanity', 'prismic', 'storyblok', 'locomotive') and k not in found]
    return sorted(set(found))
def static_libs(lab):
    st = ST.get(lab) or {}
    sig = st.get('scriptSignatures') or {}; h = st.get('hints') or {}
    found = [k for k, v in sig.items() if v and k not in ('IntersectionObserver', 'reducedMotion')]
    if h.get('data-scroll'): found.append('Locomotive Scroll attrs')
    if h.get('lenis') and 'Lenis' not in found: found.append('lenis')
    if h.get('_astro') and 'astro' not in found: found.append('astro')
    if h.get('wp-content'): found.append('wp-content')
    return sorted(set(found))
def kb(m): return (m.get('perf') or {}).get('kb'); 
def req(m): return (m.get('perf') or {}).get('requests')
def hexlist(lst, n): return ', '.join(f'{rgb2hex(k)}' for k, _ in (lst or [])[:n])

lines = []
# ---------------- summary table
lines.append('| Site | Client type | Awwwards record | Capture | Display type: H1 / largest text | Type families (elements) | First-view palette (computed) | Motion & tooling detected | Pattern signals | Weight (KB) / requests |')
lines.append('|---|---|---|---|---|---|---|---|---|---|')
for lab in order:
    d = sites.get(lab) or {}; a = AW.get(lab, {}); stt = status_of(lab); st = ST.get(lab) or {}
    name = f"**{a.get('name', lab)}**"
    if stt in ('desktop', 'desktop-partial'):
        m = d['desktop']
        cap = 'desktop 1440 px' + (' (WebGL first view; DOM nearly text-free)' if stt == 'desktop-partial' else '')
        disp = f"{hero(m)}; largest {m.get('maxFontPx')} px = {m.get('maxFontVwRatio')} % of viewport"
        lines.append(f"| {name} | {a.get('client_type', '')} | {a.get('awards', '')} | {cap} | {disp} | {fam(m)} | bg {hexlist(m.get('backgrounds'), 3)}; text {hexlist(m.get('textColors'), 2)} | {', '.join(libs_of(m)) or '—'} | {flags(m)} | {kb(m)} / {req(m)} |")
    elif stt == 'mobile':
        m = d['mobile']
        disp = f"{hero(m)}; largest {m.get('maxFontPx')} px = {m.get('maxFontVwRatio')} % of a 390 px viewport"
        lb = sorted(set(libs_of(m)) | set(static_libs(lab)))
        lines.append(f"| {name} | {a.get('client_type', '')} | {a.get('awards', '')} | mobile 390 px only (desktop blocked, see §6.3) | {disp} | {fam(m)} | bg {hexlist(m.get('backgrounds'), 3)}; text {hexlist(m.get('textColors'), 2)} | {', '.join(lb) or '—'} | {flags(m)} | {kb(m)} / {req(m)} (mobile) |")
    elif stt == 'static':
        h1 = clean_text((st.get('h1') or ['—'])[0])[0]
        faces = ', '.join(sorted({f for f, w in (st.get('fontFaces') or []) if 'icons' not in f.lower()}))
        cols = ', '.join(k for k, _ in (st.get('hexColors') or [])[:5])
        lines.append(f"| {name} | {a.get('client_type', '')} | {a.get('awards', '')} | static CSS/HTML only (Chromium blocked, see §6.3) | H1 “{h1[:70]}” (size not rendered) | @font-face: {faces} | CSS hex colours: {cols} | {', '.join(static_libs(lab)) or '—'} | data-scroll attrs ×{(st.get('hints') or {}).get('data-scroll', 0)}, clamp() ×{st.get('clamp')}, vw ×{st.get('vwUnits')} | HTML {round(st.get('htmlBytes', 0) / 1024)} + CSS {round(sum(b for _, b in st.get('cssFiles', [])) / 1024)} |")
    else:
        lines.append(f"| {name} | {a.get('client_type', '')} | {a.get('awards', '')} | unreachable from this environment (TLS tunnel refused) | — | — | Awwwards palette: {a.get('colors', '') or 'n/a'} | Awwwards tech: {a.get('tech', '') or 'n/a'} | — | — |")
lines.append('')

# ---------------- per-site sheets
def static_block(lab):
    st = ST.get(lab) or {}
    if st.get('status') != '200': return []
    out = []
    faces = ', '.join(f'{f} {w}' for f, w in (st.get('fontFaces') or []) if 'icons' not in f.lower())
    css_named = ', '.join(nm.split('?')[0] + ' (' + str(round(b / 1024)) + ' KB)' for nm, b in (st.get('cssFiles') or [])[:4])
    out.append(f"- Static analysis (curl, no rendering): HTML {round(st.get('htmlBytes', 0) / 1024)} KB, generator {st.get('generator') or '—'}, lang {st.get('lang')}; stylesheets {css_named}")
    out.append(f"- @font-face: {faces or '—'}; family declarations: {', '.join(f'{k}×{v}' for k, v in (st.get('fontFamilyDecls') or [])[:4])}; letter-spacing: {', '.join(f'{k}×{v}' for k, v in (st.get('letterSpacing') or [])[:3]) or 'none'}; uppercase rules {st.get('textTransformUpper')}")
    out.append(f"- Tokens: {st.get('rootVarCount')} custom properties; font-size declarations {', '.join(f'{k}×{v}' for k, v in (st.get('fontSizeDecls') or [])[:6])}; clamp() {st.get('clamp')}, vw units {st.get('vwUnits')}; max-widths {', '.join(f'{k}×{v}' for k, v in (st.get('maxWidths') or [])[:3] if len(k) < 20)}")
    out.append(f"- Breakpoints: {', '.join(f'{k} ({v})' for k, v in (st.get('media') or [])[:6])}")
    out.append(f"- Motion: durations {', '.join(f'{k}×{v}' for k, v in (st.get('durations') or [])[:6])}; easings {', '.join(f'{k}×{v}' for k, v in (st.get('easings') or [])[:4]) or '—'}; keyframes {st.get('keyframes')}; script signatures {', '.join(k for k, v in (st.get('scriptSignatures') or {}).items() if v) or '—'}; attribute hints {', '.join(f'{k}×{v}' for k, v in (st.get('hints') or {}).items())}")
    out.append(f"- Colours in CSS (hex, by rule count): {', '.join(f'{k}×{v}' for k, v in (st.get('hexColors') or [])[:8])}")
    out.append(f"- H1: “{clean_text((st.get('h1') or ['—'])[0])[0][:90]}”; nav: {', '.join(x for x in (st.get('navLinks') or []) if x)[:220] or '—'}; images {st.get('images')}, videos {st.get('videos')}, canvas {st.get('canvas')}")
    return out
def sheet_lines(lab, m, mo, vp_label):
    c = m.get('css') or {}; out = []
    out.append(f"- Title: “{m.get('title')}” · lang {m.get('lang')} · generator {m.get('generator') or '—'} · DOM nodes {m.get('domNodes')} · page height {m.get('scrollHeight')} px ({vp_label})" + (f" / {mo.get('scrollHeight')} px (mobile)" if mo else ''))
    out.append(f"- Fonts loaded: {', '.join(m.get('fonts') or []) or '—'}; @font-face: {', '.join(c.get('fontFaces') or []) or '—'}")
    h1t, note = clean_text((m.get('h1') or {}).get('text', ''))
    out.append(f"- H1: {hero(m)}" + (f" ({note})" if note else '') + (f"; mobile H1 {mo['h1']['size']} px" if mo and mo.get('h1') else '') + f"; largest text {m.get('maxFontPx')} px ({m.get('maxFontVwRatio')} % of viewport width) “{clean_text(m.get('maxFontText') or '')[0][:60]}”")
    out.append(f"- Type usage: sizes {', '.join(f'{k}×{v}' for k, v in (m.get('fontSizes') or [])[:8])}; weights {', '.join(f'{k}×{v}' for k, v in (m.get('weights') or [])[:4])}; line-heights {', '.join(f'{k}×{v}' for k, v in (m.get('lineHeights') or [])[:4])}; letter-spacing {', '.join(f'{k}×{v}' for k, v in (m.get('letterSpacing') or [])[:3]) or 'none'}; uppercase share {m.get('uppercaseShare')} %")
    bp = (m.get('bodyParagraphs') or [])
    if bp: out.append(f"- Body copy: {bp[0]['size']}px/{bp[0]['lh']} {bp[0]['family']}, measure ≈{bp[0]['measure']} px")
    out.append(f"- Colour (computed): text {', '.join(f'{rgb2hex(k)}×{v}' for k, v in (m.get('textColors') or [])[:4])}; backgrounds by area {hexlist(m.get('backgrounds'), 5)}; body bg {rgb2hex(m.get('bodyBg'))}")
    out.append(f"- Layout: max-widths {', '.join(f'{k}×{v}' for k, v in (m.get('maxWidths') or [])[:4]) or 'fluid (no px max-width found)'}; radii {', '.join(f'{k}×{v}' for k, v in (m.get('radii') or [])[:4]) or 'none'}; grid containers {m.get('signals', {}).get('grid')}; header {m.get('headerPosition')} (mix-blend {m.get('headerMix')}); burger menu {'yes' if m.get('burger') else 'no'}")
    out.append(f"- Nav: {', '.join(m.get('navLinks') or []) or '—'}; CTAs/buttons: {', '.join((m.get('buttons') or [])[:8]) or '—'}")
    out.append(f"- Motion stack (script signatures): {', '.join(k for k, v in (m.get('scriptSignatures') or {}).items() if v) or '—'}; globals: {', '.join(k for k, v in (m.get('libs') or {}).items() if v) or '—'}; script hints: {', '.join(m.get('scriptHints') or {}) or '—'}")
    out.append(f"- Pattern signals: {flags(m)}; images {m.get('signals', {}).get('images')} ({', '.join(f'{k} {v}' for k, v in (m.get('signals', {}).get('imgFormats') or {}).items())}); inline SVG {m.get('signals', {}).get('inlineSvg')}; iframes {m.get('signals', {}).get('iframes')}")
    if c: out.append(f"- CSS tokens (same-origin sheets {c.get('sheets')}, blocked {c.get('blocked')}): {c.get('rootVarCount')} custom properties; breakpoints {', '.join(k for k, _ in (c.get('media') or [])[:6])}; durations {', '.join(f'{k}×{v}' for k, v in (c.get('durations') or [])[:5])}; easings {', '.join(f'{k}×{v}' for k, v in (c.get('easings') or [])[:4])}; keyframes {c.get('keyframes')}; fluid type: clamp() {c.get('clampFontSizes')}, vw {c.get('vwFontSizes')}")
    rv = c.get('rootVarsSample') or {}
    rv = dict(rv) if not isinstance(rv, dict) else rv
    own = {k: v for k, v in rv.items() if not k.startswith(('--cc-', '--wp-', '--swiper-', '--fa-', '--tw-', '--e-', '--elementor'))}
    if own: out.append("- Token sample (vendor tokens such as CookieConsent's `--cc-*` and WordPress presets skipped): " + '; '.join(f'`{k}: {v}`' for k, v in list(own.items())[:14]))
    elif rv: out.append("- Token sample: only vendor tokens were captured in the sample (" + ', '.join(list(rv)[:3]) + ' …)')
    p = m.get('perf') or {}
    out.append(f"- Weight: {p.get('kb')} KB over {p.get('requests')} requests ({', '.join(f'{k} {v} KB' for k, v in sorted((p.get('byTypeKB') or {}).items(), key=lambda kv: -kv[1])[:4])}); DOMContentLoaded {p.get('dcl')} ms, load {p.get('load')} ms (headless Chromium through a proxy, not a field measurement)")
    hs = [f"{h['tag']} {h['size']}px “{clean_text(h['text'])[0][:40]}”" for h in (m.get('headings') or [])[:8]]
    if hs: out.append(f"- Heading ladder: {'; '.join(hs)}")
    return out
for lab in order:
    d = sites.get(lab); a = AW.get(lab, {}); stt = status_of(lab)
    if not d: continue
    lines.append(f"### {a.get('name', lab)} — {d['url']}")
    lines.append(f"Client type: {a.get('client_type', '')}. Awards: {a.get('awards', '') or 'none listed'}. Scores: {a.get('scores', '') or 'n/a'}. Awwwards-listed tech: {a.get('tech', '') or 'n/a'}. Awwwards palette: {a.get('colors', '') or 'n/a'}." + (f" Case study: {a['case']}" if a.get('case') else ''))
    lines.append('')
    de, mo = d.get('desktop'), d.get('mobile')
    if stt in ('desktop', 'desktop-partial'):
        if stt == 'desktop-partial': lines.append('- Capture note: the page renders its first view in WebGL; the DOM carries almost no text, so the type metrics below are not meaningful. Script signatures and tokens are.')
        lines += sheet_lines(lab, de, mo if valid(mo) else None, 'desktop')
        if not valid(mo): lines.append('- Mobile capture: blocked (connection reset by the host after repeated retries).')
    elif stt == 'mobile':
        lines.append('- Capture note: desktop navigation failed (`ERR_TOO_MANY_RETRIES` from the Cloudflare-fronted host when reached through this environment\'s proxy); metrics below come from the **mobile capture (390 × 844 px)**, complemented by static CSS analysis.')
        lines += sheet_lines(lab, mo, None, 'mobile')
        lines += static_block(lab)
    elif stt == 'static':
        lines.append('- Capture note: Chromium was refused by the host (HTTP 403 challenge page); the data below comes from a static fetch of the HTML and stylesheets.')
        lines += static_block(lab)
    else:
        lines.append('- Capture note: host unreachable from this environment (the proxy refused the TLS tunnel); no measurements. Use the Awwwards data above and the case study.')
    shots = [x for x in [f'{lab}-desktop-fold.jpg', f'{lab}-desktop-view2.jpg', f'{lab}-desktop-menu.jpg', f'{lab}-desktop-full.jpg', f'{lab}-mobile-fold.jpg', f'{lab}-mobile-full.jpg'] if os.path.exists(os.path.join(os.environ.get('SHOTS_OUT', ''), x))]
    lines.append(f"- Screenshots: {', '.join(shots) if shots else 'none usable'}")
    lines.append('')

# ---------------- aggregates
agg_fonts = Counter(); agg_ease = Counter(); agg_dur = Counter(); agg_bp = Counter(); agg_libs = Counter(); agg_flags = Counter(); ratios = []; weights = []; dark = 0; n = 0; lh = Counter(); wts = Counter(); body = []; h1s = []
for lab in order:
    if status_of(lab) != 'desktop': continue
    m = sites[lab]['desktop']; n += 1
    for k, v in (m.get('fontFamilies') or [])[:2]: agg_fonts[k] += 1
    if m.get('maxFontVwRatio'): ratios.append(m['maxFontVwRatio'])
    if kb(m): weights.append(kb(m))
    c = m.get('css') or {}
    for k, v in (c.get('easings') or []): agg_ease[k] += v
    for k, v in (c.get('durations') or []): agg_dur[k] += v
    for k, v in (c.get('media') or []): agg_bp[k] += 1
    for k, v in (m.get('scriptSignatures') or {}).items():
        if v: agg_libs[k] += 1
    for k, v in (m.get('signals') or {}).items():
        if v is True: agg_flags[k] += 1
    if (m.get('signals') or {}).get('darkFirstView'): dark += 1
    for k, v in (m.get('lineHeights') or [])[:2]: lh[k] += 1
    for k, v in (m.get('weights') or [])[:2]: wts[k] += 1
    bp = m.get('bodyParagraphs') or []
    if bp: body.append((bp[0]['size'], bp[0]['lh'], bp[0]['measure']))
    if m.get('h1'): h1s.append(m['h1']['size'])
all_libs = Counter()
for lab in order:
    stt = status_of(lab); s = set()
    if stt in ('desktop', 'desktop-partial'): s |= {k for k, v in (sites[lab]['desktop'].get('scriptSignatures') or {}).items() if v}
    if stt == 'mobile': s |= {k for k, v in (sites[lab]['mobile'].get('scriptSignatures') or {}).items() if v}
    if stt in ('mobile', 'static') or lab in ST: s |= {k for k, v in ((ST.get(lab) or {}).get('scriptSignatures') or {}).items() if v}
    if (ST.get(lab) or {}).get('hints', {}).get('data-scroll'): s.add('LocomotiveScroll')
    if (ST.get(lab) or {}).get('hints', {}).get('lenis'): s.add('Lenis')
    for k in s: all_libs[k] += 1
med = lambda xs: sorted(xs)[len(xs) // 2] if xs else None
lines.append('### Cross-site aggregates')
lines.append(f"- Rendered desktop captures used: {n} of 22 sites (L.I.S.A. is WebGL-only and excluded; five sites were blocked for Chromium and one was unreachable, see §6.3). Dark first view: {dark}/{n}.")
lines.append(f"- Type families most used (top-2 per site): {', '.join(f'{k} ({v})' for k, v in agg_fonts.most_common(12))}")
lines.append(f"- H1 sizes: median {med(h1s)} px (range {min(h1s)}–{max(h1s)} px; several sites keep the H1 small and put the display statement in an H2). Largest display text as a share of the 1440 px viewport: median {med(ratios)} % (≈{round(med(ratios) * 14.4)} px), min {min(ratios)} %, max {max(ratios)} % (Editorial New's specimen glyph).")
lines.append(f"- Body copy: median {med([b[0] for b in body])} px at line-height {med([b[1] for b in body])}, measure median {med([b[2] for b in body])} px ({len(body)} sites with a measurable first paragraph).")
lines.append(f"- Dominant weights: {', '.join(f'{k} ({v})' for k, v in wts.most_common(5))}; dominant line-heights: {', '.join(f'{k} ({v})' for k, v in lh.most_common(5))}")
lines.append(f"- Motion libraries in the rendered captures (sites): {', '.join(f'{k} ({v})' for k, v in agg_libs.most_common(16))}")
lines.append(f"- Motion libraries across all sources incl. static analysis of the blocked sites (sites): {', '.join(f'{k} ({v})' for k, v in all_libs.most_common(18))}")
lines.append(f"- Pattern signals (sites): {', '.join(f'{k} ({v})' for k, v in agg_flags.most_common(14))}")
lines.append(f"- Easing functions (rule counts across same-origin CSS): {', '.join(f'{k} ({v})' for k, v in agg_ease.most_common(6))}")
lines.append(f"- Transition durations (rule counts): {', '.join(f'{k} ({v})' for k, v in agg_dur.most_common(8))}")
lines.append(f"- Breakpoints (sites using): {', '.join(f'{k} ({v})' for k, v in agg_bp.most_common(10))}")
lines.append(f"- Page weight at load: median {med(weights)} KB, min {min(weights)} KB, max {max(weights)} KB (headless load through a proxy; media-heavy heroes dominate)")
print('\n'.join(lines))
