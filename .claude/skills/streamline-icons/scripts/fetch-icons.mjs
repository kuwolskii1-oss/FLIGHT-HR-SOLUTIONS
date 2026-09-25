#!/usr/bin/env node
/**
 * fetch-icons.mjs
 *
 * Download icons from the Iconify API (which mirrors the free Streamline sets) and write
 * them as a typed React module (.tsx) or as a JSON map of raw SVG strings (.json).
 *
 *   node fetch-icons.mjs --out wayfinding-icons.tsx guidance:plane guidance:departure
 *   node fetch-icons.mjs --out icons.json --from ids.json
 *
 * Node 22 or newer. No dependencies: built-in modules and the global fetch only.
 * Exits with code 1, and writes nothing, on an unknown set, an unknown icon or a network error.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HELP = `Usage: node fetch-icons.mjs --out <file.tsx|file.json> [--from ids.json] [prefix:name ...]

Downloads icons from the Iconify API and writes:
  .tsx   one React component per icon (PascalCase name; props: size = 24, title, any SVG prop)
  .json  a map of "prefix:name" to a raw SVG string
  .json with --iconify: an Iconify-format subset of one set ({ prefix, width, height, icons: {name: {body}} })

Options
  --out, -o <file>   Output path. Must end in .tsx or .json.
  --from <file>      JSON file holding ["prefix:name", ...], { "icons": [...] },
                     or an Iconify-format set (its prefix and icon names are used).
  --iconify          With a .json output, write the Iconify format instead of the SVG map.
  --prefix-names     Put the set in every component name (GuidancePlane) to avoid clashes.
  --suffix <text>    Append text to every component name (--suffix Icon gives PlaneIcon).
  --api <url>        Iconify API base. Default: $ICONIFY_API or https://api.iconify.design
  --dry-run          Resolve the ids and print the result without writing a file.
  --help, -h         Show this help.

Examples
  node fetch-icons.mjs -o src/icons/wayfinding.tsx guidance:plane guidance:departure guidance:tools
  node fetch-icons.mjs -o /tmp/preview.json --from icons.json
Find names: https://api.iconify.design/search?query=plane&prefix=guidance`;

// Node's fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY=1 (Node 22.21+ / 24.5+).
// Behind a proxy, re-run this script once with that flag so requests go through it.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const child = spawnSync(
    process.execPath,
    [
      ...process.execArgv,
      "--disable-warning=UNDICI-EHPA", // "EnvHttpProxyAgent is experimental" noise
      fileURLToPath(import.meta.url),
      ...process.argv.slice(2),
    ],
    { stdio: "inherit", env: { ...process.env, NODE_USE_ENV_PROXY: "1" } },
  );
  process.exit(child.status ?? 1);
}

const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CHUNK = 80; // icon names per API request, keeps URLs short
const STREAMLINE_SET_PAGES = { guidance: "https://www.streamlinehq.com/icons/guidance" };

// Component names that would shadow a JavaScript or browser global in the importing file
// (for example `import { Map } from "./icons"` breaks `new Map()` there). These get "Icon" appended.
const GLOBAL_NAMES = new Set([
  ...Object.getOwnPropertyNames(globalThis).filter((n) => /^[A-Z]/.test(n)),
  ..."Image Audio Option Text Comment Node Element Document Window Location History Screen Selection Range Touch Lock Notification Worker Animation Plugin Report Clipboard Gamepad Cache Attr Geolocation Highlight Keyboard Presentation Serial Credential Scheduler Permissions Storage Style".split(
    " ",
  ),
]);

function fail(message) {
  console.error(`fetch-icons: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const opts = {
    out: null,
    from: null,
    prefixNames: false,
    suffix: "",
    api: (process.env.ICONIFY_API || "https://api.iconify.design").replace(/\/+$/, ""),
    dryRun: false,
    ids: [],
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = () => {
      const v = argv[++i];
      if (v === undefined || v.startsWith("-")) fail(`${arg} needs a value. Run with --help.`);
      return v;
    };
    switch (arg) {
      case "--out":
      case "-o":
        opts.out = value();
        break;
      case "--from":
        opts.from = value();
        break;
      case "--prefix-names":
        opts.prefixNames = true;
        break;
      case "--suffix":
        opts.suffix = value();
        break;
      case "--api":
        opts.api = value().replace(/\/+$/, "");
        break;
      case "--dry-run":
        opts.dryRun = true;
        break;
      case "--iconify":
        opts.iconify = true;
        break;
      case "--help":
      case "-h":
        console.log(HELP);
        process.exit(0);
        break;
      default:
        if (arg.startsWith("-")) fail(`Unknown option ${arg}. Run with --help.`);
        opts.ids.push(...arg.split(/[\s,]+/).filter(Boolean));
    }
  }
  return opts;
}

function readIdFile(path) {
  let data;
  try {
    data = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`Cannot read ${path}: ${error.message}`);
  }
  // An Iconify-format file (like one written with --iconify): take its prefix and icon names.
  if (typeof data?.prefix === "string" && data.icons && !Array.isArray(data.icons)) {
    return Object.keys(data.icons).map((name) => `${data.prefix}:${name}`);
  }
  const list = Array.isArray(data) ? data : data?.icons;
  if (!Array.isArray(list) || list.some((id) => typeof id !== "string")) {
    fail(
      `${path} must hold an array of "prefix:name" strings, an object with an "icons" array, ` +
        "or an Iconify-format icon set.",
    );
  }
  return list;
}

async function getJson(url) {
  let res;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  } catch (error) {
    throw new Error(`Network error for ${url}: ${error.cause?.message || error.message}`);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const text = await res.text();
  if (text.trim() === "404") return null; // Iconify's answer for an unknown set
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Expected JSON from ${url}, got: ${text.slice(0, 120)}`);
  }
}

// Resolve an icon or alias (aliases may chain) into one flat record, as Iconify does.
function resolveIcon(data, name) {
  const dims = {};
  let hFlip = false;
  let vFlip = false;
  let rotate = 0;
  let current = name;
  for (let depth = 0; depth < 8; depth++) {
    const icon = data.icons?.[current];
    const source = icon || data.aliases?.[current];
    if (!source) return null;
    for (const key of ["left", "top", "width", "height"]) {
      if (source[key] !== undefined && dims[key] === undefined) dims[key] = source[key];
    }
    if (source.hFlip) hFlip = !hFlip;
    if (source.vFlip) vFlip = !vFlip;
    rotate += source.rotate ?? 0;
    if (icon) {
      return {
        body: icon.body,
        left: dims.left ?? data.left ?? 0,
        top: dims.top ?? data.top ?? 0,
        width: dims.width ?? data.width ?? 16,
        height: dims.height ?? data.height ?? 16,
        hFlip,
        vFlip,
        rotate: ((rotate % 4) + 4) % 4,
      };
    }
    current = source.parent;
  }
  return null;
}

// Apply flips and rotation the way Iconify's iconToSVG does; returns the body and its viewBox.
function applyTransforms(icon) {
  const box = { left: icon.left, top: icon.top, width: icon.width, height: icon.height };
  const transforms = [];
  let rotation = icon.rotate;
  if (icon.hFlip) {
    if (icon.vFlip) rotation += 2;
    else {
      transforms.push(`translate(${box.width + box.left} ${0 - box.top})`, "scale(-1 1)");
      box.top = box.left = 0;
    }
  } else if (icon.vFlip) {
    transforms.push(`translate(${0 - box.left} ${box.height + box.top})`, "scale(1 -1)");
    box.top = box.left = 0;
  }
  rotation %= 4;
  if (rotation === 1) {
    const c = box.height / 2 + box.top;
    transforms.unshift(`rotate(90 ${c} ${c})`);
  } else if (rotation === 2) {
    transforms.unshift(`rotate(180 ${box.width / 2 + box.left} ${box.height / 2 + box.top})`);
  } else if (rotation === 3) {
    const c = box.width / 2 + box.left;
    transforms.unshift(`rotate(-90 ${c} ${c})`);
  }
  if (rotation % 2 === 1) {
    [box.left, box.top] = [box.top, box.left];
    [box.width, box.height] = [box.height, box.width];
  }
  const body = transforms.length ? `<g transform="${transforms.join(" ")}">${icon.body}</g>` : icon.body;
  return { body, box };
}

function toPascal(text) {
  return text
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function componentName(prefix, name, opts) {
  let base = toPascal(opts.prefixNames ? `${prefix}-${name}` : name);
  if (/^[0-9]/.test(base)) base = `Icon${base}`;
  if (opts.suffix) return base + opts.suffix;
  return GLOBAL_NAMES.has(base) ? `${base}Icon` : base;
}

// ---- SVG body to JSX ----------------------------------------------------------------------

const SPECIAL_ATTRS = {
  class: "className",
  "xlink:href": "xlinkHref",
  "xml:space": "xmlSpace",
  "xml:lang": "xmlLang",
  "xmlns:xlink": "xmlnsXlink",
};

function jsxAttrName(name) {
  if (SPECIAL_ATTRS[name]) return SPECIAL_ATTRS[name];
  if (/^(data|aria)-/.test(name)) return name;
  return name.replace(/[-:]([a-z])/g, (_, c) => c.toUpperCase());
}

function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function styleObject(css) {
  const entries = css
    .split(";")
    .map((decl) => decl.trim())
    .filter(Boolean)
    .map((decl) => {
      const i = decl.indexOf(":");
      const prop = decl.slice(0, i).trim();
      const key = prop.startsWith("--")
        ? prop
        : (prop.startsWith("-ms-") ? prop.slice(1) : prop).replace(/-([a-z])/g, (_, c) =>
            c.toUpperCase(),
          );
      return `${JSON.stringify(key)}: ${JSON.stringify(decl.slice(i + 1).trim())}`;
    });
  return `{ ${entries.join(", ")} } as CSSProperties`;
}

// Element ids must be unique per rendered instance, so they are rebuilt from React's useId().
function idExpression(attr, value, ids) {
  if (!ids.size) return null;
  const escape = (s) => s.replace(/[`\\]/g, "\\$&").replace(/\$\{/g, "\\${");
  if (attr === "id" && ids.has(value)) return `\`\${uid}-${ids.get(value)}\``;
  let touched = false;
  const parts = value.split(/(#[A-Za-z_][\w.:-]*)/);
  const literal = parts
    .map((part) => {
      if (part.startsWith("#") && ids.has(part.slice(1))) {
        touched = true;
        return `#\${uid}-${ids.get(part.slice(1))}`;
      }
      return escape(part);
    })
    .join("");
  return touched ? `\`${literal}\`` : null;
}

function bodyToJsx(body, baseIndent) {
  const clean = body.replace(/<!--[\s\S]*?-->/g, "");
  const ids = new Map([...clean.matchAll(/\sid="([^"]+)"/g)].map((m, i) => [m[1], i]));
  const lines = [];
  let usesStyle = false;
  let depth = 0;
  const pad = () => " ".repeat(baseIndent + depth * 2);
  const tagRe = /<(\/?)([a-zA-Z][\w:.-]*)((?:\s+[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s*(\/?)>|([^<]+)/g;
  let m;
  while ((m = tagRe.exec(clean))) {
    const [, closing, tag, rawAttrs, selfClosing, text] = m;
    if (text !== undefined) {
      if (text.trim()) lines.push(`${pad()}{${JSON.stringify(decodeEntities(text.trim()))}}`);
      continue;
    }
    if (closing) {
      depth--;
      lines.push(`${pad()}</${tag}>`);
      continue;
    }
    const attrs = [];
    for (const a of rawAttrs.matchAll(/([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
      const name = a[1];
      const raw = a[2] ?? a[3];
      const jsxName = jsxAttrName(name);
      if (jsxName === "style") {
        usesStyle = true;
        attrs.push(`style={${styleObject(decodeEntities(raw))}}`);
        continue;
      }
      const expr = idExpression(name, raw, ids);
      if (expr) attrs.push(`${jsxName}={${expr}}`);
      else if (raw.includes('"')) attrs.push(`${jsxName}={${JSON.stringify(decodeEntities(raw))}}`);
      else attrs.push(`${jsxName}="${raw}"`);
    }
    const open = `${pad()}<${tag}${attrs.length ? " " + attrs.join(" ") : ""}`;
    if (selfClosing) lines.push(`${open} />`);
    else {
      lines.push(`${open}>`);
      depth++;
    }
  }
  if (depth !== 0) throw new Error("unbalanced tags in SVG body");
  return { jsx: lines.join("\n"), usesIds: ids.size > 0, usesStyle };
}

// ---- output writers -----------------------------------------------------------------------

function creditFor(prefix, info) {
  const setName = info?.name ?? prefix;
  const author = info?.author?.name ?? "unknown author";
  const licence = info?.license?.title ?? "unknown licence";
  const licenceUrl = info?.license?.url ?? "";
  const isStreamline = /streamline|webalys/i.test(`${author} ${info?.author?.url ?? ""}`);
  const title = `"${setName}"${/icons?$/i.test(setName) ? "" : " icons"}`;
  return {
    setName,
    title,
    author,
    licence,
    licenceUrl,
    isStreamline,
    page: STREAMLINE_SET_PAGES[prefix] ?? `https://icon-sets.iconify.design/${prefix}/`,
    source: info?.author?.url ?? "",
    short: isStreamline
      ? `Free icons from Streamline (link the words to https://streamlinehq.com)`
      : `${title} by ${author}, ${licence}`,
    full: `${title} by ${author} (${isStreamline ? "https://streamlinehq.com" : (info?.author?.url ?? "")}), licensed under ${licence} (${licenceUrl}).`,
  };
}

function writeTsx(outPath, resolved, credits, script) {
  const today = new Date().toISOString().slice(0, 10);
  const header = [
    "/**",
    ` * Generated by ${script} on ${today}.`,
    " * Do not edit by hand: change the icon list and run the script again.",
    " *",
    " * Icon sets",
  ];
  for (const [prefix, c] of credits) {
    header.push(
      ` *   ${c.setName} (Iconify prefix "${prefix}") by ${c.author}. ${c.licence}, ${c.licenceUrl}`,
      ` *     Set page: ${c.page}`,
      ...(c.source ? [` *     Source vectors: ${c.source} (fetched through the Iconify API)`] : []),
    );
  }
  const streamline = [...credits.values()].filter((c) => c.isStreamline);
  const others = [...credits.values()].filter((c) => !c.isStreamline);
  header.push(" *", " * Credit (required by the licence)");
  if (streamline.length) {
    const titles = streamline.map((c) => c.title).join(" and ");
    const licences = [...new Set(streamline.map((c) => `${c.licence} (${c.licenceUrl})`))].join(", ");
    header.push(
      " *   On every page that shows these icons (a site-wide footer link is enough), as a normal",
      ' *   link without rel="nofollow": <a href="https://streamlinehq.com">Free icons from Streamline</a>',
      " *   On the credits or legal page:",
      ` *   ${titles} by Streamline (https://streamlinehq.com), licensed under ${licences}.`,
      " *   The drawings are unchanged; they are packaged as React components.",
    );
  }
  for (const c of others) header.push(` *   ${c.full}`);
  header.push(" *", " * Components");
  for (const r of resolved) header.push(` *   ${r.component} <- ${r.id}`);
  header.push(" */");

  const needsId = resolved.some((r) => r.usesIds);
  const needsStyle = resolved.some((r) => r.usesStyle);
  const typeImports = ["ReactNode", "SVGProps", ...(needsStyle ? ["CSSProperties"] : [])].sort();
  const lines = [
    ...header,
    ...(needsId ? ['import { useId } from "react";'] : []),
    `import type { ${typeImports.join(", ")} } from "react";`,
    "",
    "export type IconProps = Omit<SVGProps<SVGSVGElement>, \"children\" | \"title\"> & {",
    "  /** Width and height: a number of px or any CSS length. Defaults to 24, the native grid. */",
    "  size?: number | string;",
    "  /** Accessible name. Renders <title> and role=\"img\". Without it (or aria-label) the icon is aria-hidden. */",
    "  title?: string;",
    "};",
    "",
    "function Icon({",
    "  size = 24,",
    "  title,",
    "  aspect = 1,",
    "  children,",
    "  ...rest",
    "}: IconProps & { aspect?: number; children: ReactNode }) {",
    '  const labelled = Boolean(title || rest["aria-label"] || rest["aria-labelledby"]);',
    "  const width =",
    "    aspect === 1",
    "      ? size",
    '      : typeof size === "number"',
    "        ? Math.round(size * aspect * 1000) / 1000",
    "        : `calc(${size} * ${aspect})`;",
    "  return (",
    "    <svg",
    '      xmlns="http://www.w3.org/2000/svg"',
    "      width={width}",
    "      height={size}",
    '      focusable="false"',
    '      role={labelled ? "img" : undefined}',
    "      aria-hidden={labelled ? undefined : true}",
    "      {...rest}",
    "    >",
    "      {title ? <title>{title}</title> : null}",
    "      {children}",
    "    </svg>",
    "  );",
    "}",
  ];
  for (const r of resolved) {
    const { box } = r;
    const aspect = box.width / box.height;
    const aspectProp = aspect === 1 ? "" : ` aspect={${Math.round(aspect * 10000) / 10000}}`;
    lines.push(
      "",
      `/** ${r.id}${r.alias ? ` (alias of ${r.alias})` : ""} */`,
      `export function ${r.component}(props: IconProps) {`,
      ...(r.usesIds ? ["  const uid = useId();"] : []),
      "  return (",
      `    <Icon viewBox="${box.left} ${box.top} ${box.width} ${box.height}"${aspectProp} {...props}>`,
      r.jsx,
      "    </Icon>",
      "  );",
      "}",
    );
  }
  writeFileSync(outPath, lines.join("\n") + "\n");
}

// Iconify-format subset of one set: { prefix, width, height, set, author, license, source, icons }.
function writeIconifyJson(outPath, resolved, credit, setBox, api) {
  const { prefix } = resolved[0];
  const out = {
    prefix,
    width: setBox.width,
    height: setBox.height,
    set: credit.isStreamline ? `Streamline ${credit.setName}` : credit.setName,
    author: `${credit.author} (${credit.isStreamline ? "https://streamlinehq.com" : credit.source})`,
    license: `${credit.licence} (${credit.licenceUrl})`,
    source: `${credit.page} via the Iconify API (${api}/${prefix}.json)`,
    icons: {},
  };
  for (const r of resolved) {
    const entry = { body: r.body };
    if (r.box.left) entry.left = r.box.left;
    if (r.box.top) entry.top = r.box.top;
    if (r.box.width !== setBox.width) entry.width = r.box.width;
    if (r.box.height !== setBox.height) entry.height = r.box.height;
    out.icons[r.name] = entry;
  }
  writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
}

function writeJson(outPath, resolved) {
  const map = {};
  for (const r of resolved) {
    const { box, body } = r;
    map[r.id] =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${box.width}" height="${box.height}" ` +
      `viewBox="${box.left} ${box.top} ${box.width} ${box.height}">${body}</svg>`;
  }
  writeFileSync(outPath, JSON.stringify(map, null, 2) + "\n");
}

// ---- main ---------------------------------------------------------------------------------

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.from) opts.ids.unshift(...readIdFile(opts.from));
  if (!opts.out && !opts.dryRun) fail("Missing --out <file.tsx|file.json>. Run with --help.");
  const format = opts.out ? extname(opts.out).toLowerCase() : ".tsx";
  if (![".tsx", ".json"].includes(format)) fail(`--out must end in .tsx or .json (got ${opts.out}).`);
  if (opts.iconify && format !== ".json") fail("--iconify needs a .json output.");
  if (!opts.ids.length) fail("No icon ids given. Pass prefix:name ids or --from <file.json>.");

  const ids = [...new Set(opts.ids.map((id) => id.trim()))];
  const malformed = ids.filter((id) => {
    const [prefix, name, extra] = id.split(":");
    return extra !== undefined || !NAME_RE.test(prefix ?? "") || !NAME_RE.test(name ?? "");
  });
  if (malformed.length) fail(`Malformed ids (expected prefix:name, lowercase): ${malformed.join(", ")}`);

  const byPrefix = new Map();
  for (const id of ids) {
    const [prefix, name] = id.split(":");
    if (!byPrefix.has(prefix)) byPrefix.set(prefix, []);
    byPrefix.get(prefix).push(name);
  }
  if (opts.iconify && byPrefix.size > 1) {
    fail(`--iconify writes one set per file, but the ids use ${[...byPrefix.keys()].join(", ")}.`);
  }

  const prefixes = [...byPrefix.keys()];
  const collections = (await getJson(`${opts.api}/collections?prefixes=${prefixes.join(",")}`)) ?? {};
  const unknownSets = [];

  const data = new Map();
  for (const [prefix, names] of byPrefix) {
    const merged = { icons: {}, aliases: {} };
    for (let i = 0; i < names.length; i += CHUNK) {
      const chunk = names.slice(i, i + CHUNK);
      const json = await getJson(`${opts.api}/${prefix}.json?icons=${chunk.join(",")}`);
      if (!json) {
        unknownSets.push(prefix);
        break;
      }
      Object.assign(merged.icons, json.icons);
      Object.assign(merged.aliases, json.aliases);
      for (const key of ["left", "top", "width", "height"]) {
        if (json[key] !== undefined) merged[key] = json[key];
      }
    }
    data.set(prefix, merged);
  }

  const resolved = [];
  const missing = [];
  for (const id of ids) {
    const [prefix, name] = id.split(":");
    if (unknownSets.includes(prefix)) {
      missing.push(`${id} (unknown set "${prefix}")`);
      continue;
    }
    const icon = resolveIcon(data.get(prefix), name);
    if (!icon) {
      missing.push(id);
      continue;
    }
    const { body, box } = applyTransforms(icon);
    const alias = data.get(prefix).aliases?.[name]?.parent;
    resolved.push({ id, prefix, name, alias, body, box, component: componentName(prefix, name, opts) });
  }

  if (missing.length) {
    console.error(`fetch-icons: ${missing.length} of ${ids.length} ids did not resolve. Nothing was written.`);
    for (const id of missing) {
      const [p, n] = id.split(" ")[0].split(":");
      const hint = unknownSets.includes(p)
        ? `sets: ${opts.api}/collections`
        : `search: ${opts.api}/search?query=${n}&prefix=${p}`;
      console.error(`  MISSING  ${id}   ${hint}`);
    }
    if (resolved.length) console.error(`  (resolved: ${resolved.map((r) => r.id).join(", ")})`);
    process.exit(1);
  }

  const seen = new Map();
  for (const r of resolved) {
    if (seen.has(r.component)) {
      fail(
        `${seen.get(r.component)} and ${r.id} both become component ${r.component}. ` +
          "Re-run with --prefix-names, or drop one of them.",
      );
    }
    seen.set(r.component, r.id);
  }

  if (format === ".tsx") {
    for (const r of resolved) {
      const converted = bodyToJsx(r.body, 6);
      Object.assign(r, converted);
    }
  }

  const credits = new Map(prefixes.map((p) => [p, creditFor(p, collections[p])]));
  for (const p of prefixes.filter((p) => !collections[p])) {
    console.warn(`Warning: no licence metadata for "${p}". Check its licence before shipping.`);
  }
  console.log(`Resolved ${resolved.length} of ${ids.length} ids:`);
  for (const r of resolved) {
    const label = format === ".tsx" ? ` -> ${r.component}` : "";
    const note = r.alias ? `  (alias of ${r.alias})` : "";
    console.log(`  ok  ${r.id}${label}${note}`);
  }

  if (opts.dryRun) {
    console.log("Dry run: nothing written.");
  } else {
    const outPath = resolve(opts.out);
    mkdirSync(dirname(outPath), { recursive: true });
    const script = ".claude/skills/streamline-icons/scripts/fetch-icons.mjs";
    if (format === ".tsx") writeTsx(outPath, resolved, credits, script);
    else if (opts.iconify) {
      const { prefix } = resolved[0];
      const set = data.get(prefix);
      const setBox = { width: set.width ?? 16, height: set.height ?? 16 };
      writeIconifyJson(outPath, resolved, credits.get(prefix), setBox, opts.api);
    } else writeJson(outPath, resolved);
    console.log(`Wrote ${outPath}`);
  }
  for (const [prefix, c] of credits) {
    console.log(`Licence for ${prefix}: ${c.licence}. Credit: ${c.short}`);
  }
}

main().catch((error) => fail(error.message));
