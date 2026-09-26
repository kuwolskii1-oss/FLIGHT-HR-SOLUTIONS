import pictograms from "@/site/pictograms.json";
import type { Entry } from "./entries";

/**
 * The header search, as a plain module that mounts on the SSR markup of SiteSearch.tsx (the
 * no-login preview mounts the same module on the same markup). A round button grows into a pill
 * over the navigation (desktop) or the whole header row (phones): a combobox input, a Search
 * button and a close button, with a listbox of results under it.
 *
 * Pattern (WAI-ARIA APG combobox with listbox popup): focus stays in the input, Up and Down move
 * the active option (aria-activedescendant, read from the option's live id), Enter opens it or
 * the first result, Tab closes the list, the first Escape closes the list and the second closes
 * the search and returns focus to the button. A polite line announces the number of results once
 * typing pauses.
 *
 * Every element is found through data-* hooks relative to the root, never by id, because the
 * preview renames ids. Strings come from the root's data-search-config (site.json `search`).
 */

export type SearchOptions = {
  /** Loads the index (search/entries.ts), on the first open or on the first hover of the button. */
  loadEntries: () => Promise<Entry[]>;
  /** Maps a site href (/parts#verify) to the href used in this document (the preview's own). */
  hrefFor?: (href: string) => string;
};

type Strings = {
  label: string;
  close: string;
  suggestions: string;
  noResults: string;
  requestPart: string;
};
type Config = { strings: Strings; request: { href: string; page: string } };

type Result = { entry: Entry; kind: "entry" | "request"; query?: string };
type Prepared = { entry: Entry; title: string[]; titleText: string; page: string[]; keywords: string[]; text: string[] };

/** sessionStorage key read by the parts page (parts/request.ts), which fills the part number. */
export const PART_PREFILL_KEY = "fhs-part-prefill";
const MAX_RESULTS = 8;
const OPEN_MS = 280;
const CLOSE_MS = 200;
const LIST_CLOSE_MS = 150;
const ANNOUNCE_MS = 700;

/* ---------- matching (pure) ---------- */

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
const wordsOf = (s: string) => norm(s).split(/[^a-z0-9]+/).filter(Boolean);

/** Letters and digits, dashes between them, at least four characters and one digit, no spaces. */
export function looksLikePartNumber(q: string) {
  return q.length >= 4 && /\d/.test(q) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(q);
}

export function prepare(entry: Entry): Prepared {
  return {
    entry,
    title: wordsOf(entry.title),
    titleText: norm(entry.title),
    page: wordsOf(entry.page),
    keywords: [...new Set(wordsOf((entry.keywords ?? []).join(" ")))],
    text: [...new Set(wordsOf(entry.text ?? ""))],
  };
}

const startsAny = (list: string[], t: string) => list.some((w) => w.startsWith(t));

/** "forms" also finds "form", "leases" "lease": a query word's plural s is dropped when it has to be. */
const singular = (t: string) => (t.length >= 4 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : "");
/** The query words and their singulars, for marking matches. */
export const markTokens = (tokens: string[]) => [...new Set(tokens.flatMap((t) => [t, singular(t)].filter(Boolean)))];

function scoreWord(p: Prepared, t: string) {
  if (p.title.includes(t)) return 120;
  if (startsAny(p.title, t)) return 110;
  if (startsAny(p.page, t)) return 40;
  if (p.keywords.includes(t)) return 30;
  if (startsAny(p.keywords, t)) return 25;
  if (startsAny(p.text, t)) return 10;
  if (t.length >= 3 && p.titleText.includes(t)) return 8;
  return 0;
}

/**
 * Every word of the query must match somewhere (a plural word may match as its singular). A word
 * that starts a word of the title scores highest (a whole word more), then the page name, then
 * the keywords and the text. A query the title starts with, and a door whose name matches, get a
 * little more. Ties go to the shorter title.
 */
export function rank(index: Prepared[], query: string): Entry[] {
  const tokens = wordsOf(query);
  if (!tokens.length) return [];
  const q = norm(query.trim());
  const scored: { entry: Entry; score: number }[] = [];
  for (const p of index) {
    let score = 0;
    let every = true;
    let inTitle = false;
    for (const t of tokens) {
      const one = singular(t);
      const s = scoreWord(p, t) || (one ? Math.max(0, scoreWord(p, one) - 1) : 0);
      if (!s) {
        every = false;
        break;
      }
      if (s >= 110) inTitle = true;
      score += s;
    }
    if (!every) continue;
    if (p.titleText.startsWith(q)) score += 30;
    // A door named by the query comes before its own sections ("engine": Engines first).
    if (p.entry.suggest && inTitle) score += 20;
    scored.push({ entry: p.entry, score });
  }
  scored.sort((a, b) => b.score - a.score || a.entry.title.length - b.entry.title.length);
  return scored.map((s) => s.entry);
}

/* ---------- DOM helpers ---------- */

type Icon = { body: string; width?: number; height?: number };
const SVG_NS = "http://www.w3.org/2000/svg";

function pictogram(name: string | undefined, size: number) {
  const icon = name ? (pictograms.icons as Record<string, Icon>)[name] : undefined;
  if (!icon) return null;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "c-picto");
  svg.setAttribute("viewBox", `0 0 ${icon.width ?? pictograms.width} ${icon.height ?? pictograms.height}`);
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  // The bodies are the site's own pictogram set (pictograms.json), not visitor input.
  svg.innerHTML = icon.body;
  return svg;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text) node.textContent = text;
  return node;
}

/** The text with the start of every word that a query word begins marked. */
function highlight(text: string, tokens: string[]) {
  const frag = document.createDocumentFragment();
  if (!tokens.length) {
    frag.append(text);
    return frag;
  }
  const re = /[\p{L}\p{N}]+/gu;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    const w = norm(m[0]);
    const hit = tokens.filter((t) => w.startsWith(t)).sort((a, b) => b.length - a.length)[0];
    if (!hit) continue;
    const len = Math.min(hit.length, m[0].length);
    frag.append(text.slice(last, m.index));
    frag.append(el("mark", "c-search__mark", m[0].slice(0, len)));
    last = m.index + len;
  }
  frag.append(text.slice(last));
  return frag;
}

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- mount ---------- */

export function mountSiteSearch(root: HTMLElement, options: SearchOptions): () => void {
  const q = <T extends Element>(sel: string) => root.querySelector<T>(sel);
  const toggle = q<HTMLButtonElement>("[data-search-toggle]");
  const panel = q<HTMLElement>("[data-search-panel]");
  const form = q<HTMLFormElement>("[data-search-form]");
  const input = q<HTMLInputElement>("[data-search-input]");
  const closeBtn = q<HTMLButtonElement>("[data-search-close]");
  const results = q<HTMLElement>("[data-search-results]");
  const list = q<HTMLElement>("[data-search-list]");
  const head = q<HTMLElement>("[data-search-head]");
  const empty = q<HTMLElement>("[data-search-empty]");
  const label = q<HTMLElement>("[data-search-label]");
  const live = q<HTMLElement>("[data-search-live]");
  const swap = q<HTMLElement>("[data-search-swap]");
  if (!toggle || !panel || !form || !input || !closeBtn || !results || !list || !head || !empty || !live) {
    return () => {};
  }

  let config: Config;
  try {
    config = JSON.parse(root.dataset.searchConfig ?? "") as Config;
  } catch {
    return () => {};
  }
  const hrefFor = options.hrefFor ?? ((h: string) => h);
  const header = root.closest<HTMLElement>("header");

  let open = false;
  let listShown = false;
  let entries: Entry[] | null = null;
  let index: Prepared[] = [];
  let suggestions: Entry[] = [];
  let loading: Promise<void> | null = null;
  let current: Result[] = [];
  let active = -1;
  let covered: HTMLElement[] = [];
  let hideTimer = 0;
  let listTimer = 0;
  let announceTimer = 0;
  let uncoverTimer = 0;
  let pendingFrame = 0;

  const load = () => {
    loading ??= options
      .loadEntries()
      .then((all) => {
        entries = all;
        index = all.map(prepare);
        suggestions = all
          .filter((e) => e.suggest)
          .sort((a, b) => (a.suggest ?? 0) - (b.suggest ?? 0));
      })
      .catch(() => {
        loading = null;
      });
    return loading;
  };

  /* Geometry: over the navigation when it shows (data-search-area), else over the whole row. */
  const place = () => {
    const row = panel.offsetParent as HTMLElement | null;
    if (!row) return;
    const rr = row.getBoundingClientRect();
    const cs = getComputedStyle(row);
    const rowLeft = rr.left + parseFloat(cs.paddingLeft);
    const rowRight = rr.right - parseFloat(cs.paddingRight);
    const tr = toggle.getBoundingClientRect();
    const area = header?.querySelector<HTMLElement>("[data-search-area]");
    const ar = area?.getBoundingClientRect();
    const wide = !!ar && ar.width > 0;
    const left = wide ? Math.max(rowLeft, ar.left - 12) : rowLeft;
    const right = wide ? tr.right : rowRight;
    root.dataset.searchMode = wide ? "wide" : "narrow";
    panel.style.setProperty("--search-x", `${Math.round(left - rr.left)}px`);
    panel.style.setProperty("--search-y", `${Math.round(tr.top - rr.top)}px`);
    panel.style.setProperty("--search-w", `${Math.round(right - left)}px`);
    panel.style.setProperty("--search-drop", `${Math.max(0, Math.round(rr.bottom - tr.bottom))}px`);
  };

  /* Everything in the header row the pill lies over becomes inert and fades. */
  const cover = () => {
    uncover(true);
    const row = panel.offsetParent as HTMLElement | null;
    if (!row) return;
    const pr = panel.getBoundingClientRect();
    const candidates = Array.from(row.children).flatMap((c) =>
      c.contains(root) ? Array.from(c.children).filter((x) => !x.contains(root)) : [c],
    ) as HTMLElement[];
    covered = candidates.filter((c) => {
      if (c === panel) return false;
      const r = c.getBoundingClientRect();
      return r.width > 0 && r.right > pr.left + 1 && r.left < pr.right - 1;
    });
    for (const c of covered) {
      c.inert = true;
      c.dataset.searchCovered = "out";
    }
  };
  const uncover = (instant = false) => {
    window.clearTimeout(uncoverTimer);
    const was = covered;
    covered = [];
    for (const c of was) {
      c.inert = false;
      c.dataset.searchCovered = "in";
    }
    const clear = () => {
      for (const c of was) if (c.dataset.searchCovered === "in") delete c.dataset.searchCovered;
    };
    if (instant || reduceMotion()) clear();
    else uncoverTimer = window.setTimeout(clear, CLOSE_MS + 40);
  };

  /* ---------- the list ---------- */

  const optionEls = () => Array.from(list.querySelectorAll<HTMLAnchorElement>("[role='option']"));

  const setActive = (i: number, scroll = true) => {
    const opts = optionEls();
    active = i;
    opts.forEach((o, n) => {
      const on = n === i;
      o.classList.toggle("is-active", on);
      o.setAttribute("aria-selected", on ? "true" : "false");
    });
    const cur = opts[i];
    if (cur) {
      input.setAttribute("aria-activedescendant", cur.id);
      if (scroll) cur.scrollIntoView({ block: "nearest" });
    } else input.removeAttribute("aria-activedescendant");
  };

  const renderOption = (r: Result, i: number, tokens: string[]) => {
    const a = el("a", "c-search__option");
    a.id = `${list.id}-opt-${i}`;
    a.setAttribute("role", "option");
    a.setAttribute("aria-selected", "false");
    a.tabIndex = -1;
    a.href = hrefFor(r.entry.href);
    a.dataset.index = String(i);
    if (r.entry.icon === "alarm-bell") a.classList.add("c-search__option--urgent");

    const tile = el("span", "c-search__tile");
    tile.setAttribute("aria-hidden", "true");
    const svg = pictogram(r.entry.icon, 20);
    if (svg) tile.append(svg);

    const body = el("span", "c-search__body");
    const title = el("span", "c-search__title");
    if (r.kind === "request") {
      a.classList.add("c-search__option--request");
      title.append(`${config.strings.requestPart} `, el("span", "c-search__pn", r.query));
    } else {
      title.append(highlight(r.entry.title, tokens));
      if (r.entry.note) title.append(" ", el("span", "c-badge c-badge--quiet c-search__badge", r.entry.note));
    }
    // The quiet second line: the page the result is on, or a page's own description. Only the
    // title carries marks, so a list of one page's sections does not stripe every row.
    const second = r.entry.page !== r.entry.title ? r.entry.page : (r.entry.sub ?? "");
    body.append(title);
    if (second) body.append(el("span", "u-visually-hidden", ", "), el("span", "c-search__page", second));

    const go = el("span", "c-search__go");
    go.setAttribute("aria-hidden", "true");
    const arrow = pictogram("left-arrow", 16);
    if (arrow) go.append(arrow);

    a.append(tile, body, go);
    return a;
  };

  const showList = () => {
    window.clearTimeout(listTimer);
    if (!listShown) {
      results.hidden = false;
      void results.offsetWidth;
      results.classList.add("is-shown");
      listShown = true;
    }
    input.setAttribute("aria-expanded", "true");
  };
  const hideList = () => {
    if (!listShown) return;
    listShown = false;
    results.classList.remove("is-shown");
    input.setAttribute("aria-expanded", "false");
    setActive(-1, false);
    window.clearTimeout(listTimer);
    listTimer = window.setTimeout(
      () => {
        if (!listShown) results.hidden = true;
      },
      reduceMotion() ? 0 : LIST_CLOSE_MS + 20,
    );
  };

  let lastAnnounced = "";
  const announce = (msg: string) => {
    // A repeated message gets a trailing no-break space so it is read again.
    const text = lastAnnounced === msg ? msg + String.fromCharCode(160) : msg;
    lastAnnounced = text;
    live.textContent = text;
  };

  type Mode = "suggest" | "results" | "none";
  let mode: Mode = "suggest";

  const update = (fromTyping: boolean) => {
    if (!entries) {
      void load().then(() => {
        if (open && entries) update(fromTyping);
      });
      return;
    }
    const query = input.value.trim();
    const tokens = wordsOf(query);
    let found: Result[] = [];
    if (tokens.length) {
      const request: Result[] = looksLikePartNumber(query)
        ? [{ kind: "request", query, entry: { href: config.request.href, title: config.strings.requestPart, page: config.request.page, icon: "paper" } }]
        : [];
      found = [...request, ...rank(index, query).map((entry): Result => ({ kind: "entry", entry }))].slice(0, MAX_RESULTS);
    }
    mode = !tokens.length ? "suggest" : found.length ? "results" : "none";
    current = mode === "results" ? found : suggestions.map((entry): Result => ({ kind: "entry", entry }));

    const marks = mode === "results" ? markTokens(tokens) : [];
    list.replaceChildren(...current.map((r, i) => renderOption(r, i, marks)));
    empty.hidden = mode !== "none";
    head.hidden = mode === "results";
    const labelledBy = mode === "results" ? label?.id : head.id;
    if (labelledBy) list.setAttribute("aria-labelledby", labelledBy);
    root.dataset.searchState = mode;
    setActive(-1, false);
    list.scrollTop = 0;
    showList();

    window.clearTimeout(announceTimer);
    if (fromTyping && mode !== "suggest") {
      const msg =
        mode === "none"
          ? config.strings.noResults
          : `${found.length} ${found.length === 1 ? "result" : "results"}`;
      announceTimer = window.setTimeout(() => announce(msg), ANNOUNCE_MS);
    }
  };

  /* ---------- open and close ---------- */

  const openSearch = () => {
    if (open) return;
    open = true;
    window.clearTimeout(hideTimer);
    root.dispatchEvent(new CustomEvent("fhs:search-open", { bubbles: true }));
    header?.classList.add("is-search-open");
    header?.classList.remove("is-hidden");
    panel.hidden = false;
    place();
    cover();
    toggle.setAttribute("aria-expanded", "true");
    void panel.offsetWidth;
    root.classList.add("is-open");
    if (swap) swap.dataset.state = "b";
    input.focus({ preventScroll: true });
    if (input.value) input.select();
    update(false);
  };

  const closeSearch = (returnFocus: boolean, instant = false) => {
    if (!open) return;
    open = false;
    hideList();
    window.clearTimeout(announceTimer);
    root.classList.remove("is-open");
    if (swap) swap.dataset.state = "a";
    toggle.setAttribute("aria-expanded", "false");
    uncover(instant);
    header?.classList.remove("is-search-open");
    if (returnFocus) toggle.focus({ preventScroll: true });
    window.clearTimeout(hideTimer);
    const done = () => {
      if (!open) panel.hidden = true;
    };
    if (instant || reduceMotion()) done();
    else hideTimer = window.setTimeout(done, CLOSE_MS + 40);
  };

  /* ---------- going somewhere ---------- */

  const scrollToEl = (target: HTMLElement) => {
    const smt = parseFloat(getComputedStyle(target).scrollMarginTop);
    const margin = smt > 0 ? smt : (header?.offsetHeight ?? 0) + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - margin;
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion() ? "instant" : "smooth" });
  };

  const focusQuietly = (node: HTMLElement) => {
    if (!node.matches("a[href], button, input, select, textarea, [tabindex]")) node.tabIndex = -1;
    node.focus({ preventScroll: true });
  };
  const shown = (node: Element) => node.getClientRects().length > 0;

  /**
   * The link is followed inside this document to a part that is not showing yet (the preview shows
   * one page at a time): once its page shows, focus goes to the node, as it does on the site.
   */
  const focusWhenShown = (node: HTMLElement) => {
    window.cancelAnimationFrame(pendingFrame);
    let frames = 90;
    const tick = () => {
      if (shown(node)) focusQuietly(node);
      else if (--frames > 0) pendingFrame = window.requestAnimationFrame(tick);
    };
    pendingFrame = window.requestAnimationFrame(tick);
  };

  /**
   * Where a site href lands from here: the href as this document uses it (hrefFor maps
   * /parts#verify to the preview's own #parts.verify), whether it is this document, and the element
   * its fragment names. The fragment is resolved as the browser resolves a link's fragment, from
   * the mapped href, so the preview's renamed ids resolve as well as the site's.
   */
  const resolve = (siteHref: string) => {
    const url = new URL(hrefFor(siteHref), window.location.href);
    const path = (p: string) => p.replace(/\/$/, "") || "/";
    const here = url.origin === window.location.origin && path(url.pathname) === path(window.location.pathname);
    const id = here && url.hash ? decodeURIComponent(url.hash.slice(1)) : "";
    return { here, hash: url.hash, target: id ? document.getElementById(id) : null };
  };

  const headingOf = (target: HTMLElement) =>
    target.matches("h1, h2, h3, h4") ? target : (target.querySelector<HTMLElement>("h1, h2, h3, h4") ?? target);

  /** A result on this page: scroll to its section and move focus to the section's heading. */
  const goToSection = (target: HTMLElement | null) => {
    if (!target) return false;
    if (!shown(target)) {
      focusWhenShown(headingOf(target));
      return false;
    }
    closeSearch(false, true);
    scrollToEl(target);
    focusQuietly(headingOf(target));
    return true;
  };

  /** The part number waits in sessionStorage for the parts page (parts/request.ts reads it). */
  const stash = (partNumber: string) => {
    try {
      sessionStorage.setItem(PART_PREFILL_KEY, JSON.stringify({ partNumber }));
    } catch {
      /* storage blocked: the parts page opens without the part number */
    }
  };

  /**
   * "Request part": when the parts form is in this document (on the parts page, or in the
   * preview), the part number goes straight into it, found inside the form section the request
   * link names; from any other page it waits in sessionStorage and the link goes there.
   */
  const requestPart = (partNumber: string) => {
    const { target } = resolve(config.request.href);
    const field = target?.querySelector<HTMLTextAreaElement | HTMLInputElement>(
      'form.c-form [name="partNumber"]',
    );
    if (!field) {
      stash(partNumber);
      return false;
    }
    const lines = field.value.split(/\r?\n/).map((l) => l.trim());
    if (!lines.includes(partNumber)) {
      field.value = field.value.trim() ? `${field.value.replace(/\s+$/, "")}\n${partNumber}` : partNumber;
    }
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.form?.dispatchEvent(
      new CustomEvent("fhs:prefill", { bubbles: true, detail: { names: ["partNumber"] } }),
    );
    // The form is showing: take the visitor to the field. Otherwise the link shows its page.
    if (shown(field)) {
      closeSearch(false, true);
      scrollToEl(target ?? field);
      field.focus({ preventScroll: true });
      return true;
    }
    focusWhenShown(field);
    return false;
  };

  /** Returns true when handled here; false lets the link navigate as a link. */
  const handle = (r: Result) => {
    if (r.kind === "request" && r.query) return requestPart(r.query);
    const { here, hash, target } = resolve(r.entry.href);
    return here && hash ? goToSection(target) : false;
  };

  /* ---------- events ---------- */

  const onToggle = () => openSearch();
  const onPrefetch = () => void load();
  const onClose = () => closeSearch(true);

  const onInput = () => update(true);

  const onKeyDown = (e: KeyboardEvent) => {
    const n = current.length;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!listShown || e.altKey) {
          update(false);
          if (!e.altKey) setActive(0);
        } else if (n) setActive(active < n - 1 ? active + 1 : 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!listShown) {
          update(false);
          setActive(current.length - 1);
        } else if (n) setActive(active > 0 ? active - 1 : n - 1);
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        if (listShown) hideList();
        else closeSearch(true);
        break;
      case "Tab":
        hideList();
        break;
    }
  };

  const onRootKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape" || !open || e.target === input) return;
    e.preventDefault();
    closeSearch(true);
  };

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!entries) {
      void load().then(() => open && update(false));
      return;
    }
    if (listShown && active >= 0) {
      optionEls()[active]?.click();
      return;
    }
    if (!listShown || mode !== "results") update(false);
    if (mode === "results") optionEls()[0]?.click();
    else input.focus({ preventScroll: true });
  };

  const optionOf = (e: Event) => (e.target as Element).closest<HTMLAnchorElement>("[role='option']");
  /**
   * A Request part row opened in a new tab (Ctrl or Cmd click, middle click). A tab the browser
   * opens from a link starts with empty sessionStorage; one opened by script starts with a copy of
   * this tab's. So the row opens the tab itself with the part number stored, then takes it back
   * out of this tab, which is not going to the parts page. If the tab is blocked, the browser opens
   * the link as usual (without the part number).
   */
  const openRequestTab = (e: MouseEvent, a: HTMLAnchorElement, partNumber: string) => {
    stash(partNumber);
    if (window.open(a.href, "_blank")) e.preventDefault();
    try {
      sessionStorage.removeItem(PART_PREFILL_KEY);
    } catch {
      /* storage blocked */
    }
  };
  const onListClick = (e: MouseEvent) => {
    const a = optionOf(e);
    const r = a ? current[Number(a.dataset.index)] : undefined;
    if (!a || !r) return;
    const newTab = (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey;
    if (e.button === 0 && newTab && r.kind === "request" && r.query) {
      openRequestTab(e, a, r.query);
      return;
    }
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (handle(r)) e.preventDefault();
  };
  // A middle click opens a new tab without a click event.
  const onListAux = (e: MouseEvent) => {
    const a = optionOf(e);
    const r = a ? current[Number(a.dataset.index)] : undefined;
    if (a && e.button === 1 && r?.kind === "request" && r.query) openRequestTab(e, a, r.query);
  };
  // Keep focus in the input while choosing with a pointer.
  const onListDown = (e: PointerEvent) => {
    if (e.button === 0) e.preventDefault();
  };
  const onListMove = (e: PointerEvent) => {
    const a = (e.target as Element).closest<HTMLElement>("[role='option']");
    if (!a) return;
    const i = Number(a.dataset.index);
    if (i !== active) setActive(i, false);
  };
  // A press on the pill outside its controls keeps focus in the input.
  const onBarDown = (e: PointerEvent) => {
    if ((e.target as Element).closest("button, input")) return;
    e.preventDefault();
    input.focus({ preventScroll: true });
  };

  // Focus left the search (Tab past it, a click elsewhere): it collapses, so the nav it covers
  // comes back. What was typed stays, and reopening selects it.
  const onFocusOut = () => {
    window.setTimeout(() => {
      if (!open || !document.hasFocus() || root.contains(document.activeElement)) return;
      closeSearch(false);
    }, 0);
  };
  const onFocusIn = (e: FocusEvent) => {
    if (e.target === input && open && !listShown) update(false);
  };

  const onResize = () => {
    if (!open) return;
    place();
    cover();
  };
  const onExternalClose = () => closeSearch(false, true);
  const onPageHide = () => closeSearch(false, true);
  // A result followed as a link inside this document (a fragment the page could not find, or the
  // preview's one-document pages) leaves the page where it was: the search closes there too.
  const onHashChange = () => closeSearch(false, true);

  toggle.addEventListener("click", onToggle);
  toggle.addEventListener("pointerenter", onPrefetch);
  toggle.addEventListener("focus", onPrefetch);
  closeBtn.addEventListener("click", onClose);
  input.addEventListener("input", onInput);
  input.addEventListener("keydown", onKeyDown);
  form.addEventListener("submit", onSubmit);
  form.addEventListener("pointerdown", onBarDown);
  list.addEventListener("click", onListClick);
  list.addEventListener("auxclick", onListAux);
  results.addEventListener("pointerdown", onListDown);
  list.addEventListener("pointermove", onListMove);
  root.addEventListener("keydown", onRootKeyDown);
  root.addEventListener("focusout", onFocusOut);
  root.addEventListener("focusin", onFocusIn);
  root.addEventListener("fhs:search-close", onExternalClose);
  window.addEventListener("resize", onResize);
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("hashchange", onHashChange);
  root.dataset.searchReady = "1";

  return () => {
    closeSearch(false, true);
    toggle.removeEventListener("click", onToggle);
    toggle.removeEventListener("pointerenter", onPrefetch);
    toggle.removeEventListener("focus", onPrefetch);
    closeBtn.removeEventListener("click", onClose);
    input.removeEventListener("input", onInput);
    input.removeEventListener("keydown", onKeyDown);
    form.removeEventListener("submit", onSubmit);
    form.removeEventListener("pointerdown", onBarDown);
    list.removeEventListener("click", onListClick);
    list.removeEventListener("auxclick", onListAux);
    results.removeEventListener("pointerdown", onListDown);
    list.removeEventListener("pointermove", onListMove);
    root.removeEventListener("keydown", onRootKeyDown);
    root.removeEventListener("focusout", onFocusOut);
    root.removeEventListener("focusin", onFocusIn);
    root.removeEventListener("fhs:search-close", onExternalClose);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pagehide", onPageHide);
    window.removeEventListener("hashchange", onHashChange);
    window.clearTimeout(hideTimer);
    window.clearTimeout(listTimer);
    window.clearTimeout(announceTimer);
    window.clearTimeout(uncoverTimer);
    window.cancelAnimationFrame(pendingFrame);
    delete root.dataset.searchReady;
  };
}
