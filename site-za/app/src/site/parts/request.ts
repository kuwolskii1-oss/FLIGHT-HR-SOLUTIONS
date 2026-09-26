/**
 * The part request dialog of the engine families viewer (Parts page): a plain module that mounts
 * on the viewer section's DOM, so it runs the same on the live site (called from PartsViewer's
 * effect) and in the no-login preview (bundled, no React).
 *
 * Contract with the viewer (same root, `<section class="c-pv" data-pv data-pv-config=…>`):
 * - The viewer dispatches `pv:request` { family, from } when its callout is pressed; this module
 *   opens the dialog for that family beside `from`.
 * - This module dispatches `pv:draft` { total, byFamily } whenever the draft changes (and writes
 *   the total to `data-pv-draft`); the viewer labels its callout "Continue your request" then.
 *   A viewer that mounts later can dispatch `pv:ready` to have the current draft sent again.
 * - While the dialog is open the root carries `data-pv-busy="1"`; the viewer does not turn.
 *
 * One draft for the whole page, kept in memory (and in sessionStorage when it is available):
 * rows { key, family, partNumber, quantity }, one condition and one AOG answer. The dialog shows
 * and edits the rows of the family it was opened for. Closing (Close, Escape, a backdrop click)
 * only hides the dialog; the draft stays. Finish request closes it, fills the page form
 * (fill-form.ts), scrolls to the form and focuses the filled note.
 *
 * Never looks anything up by id (the preview renames ids): elements are found by class and data
 * attributes relative to the root, and generated ids derive from the dialog's live id.
 */
import type { Door } from "@/site/types";
import { fillPartsForm, addPartNumber, filledRows, partLines, quantityOf, type Draft, type DraftRow } from "./fill-form";

export type PvFieldConfig = { label: string; options?: string[]; hint?: string };
export type PvConfig = {
  families: { key: string; name: string }[];
  strings: NonNullable<Door["viewer"]>;
  fields: { partNumber?: PvFieldConfig; quantity?: PvFieldConfig; condition?: PvFieldConfig; aog?: PvFieldConfig };
  whatsapp: string;
  template: string;
};

type StepName = "parts" | "condition" | "aog";
const STEPS: StepName[] = ["parts", "condition", "aog"];
const MAX_ROWS = 20;
const DRAFT_KEY = "fhs-parts-request";
const SEARCH_KEY = "fhs-part-prefill";
const OPEN_MS = 240;
const CLOSE_MS = 150;

type RowError = { field: "partNumber" | "quantity"; msg: string };

export function readPvConfig(root: HTMLElement): PvConfig | null {
  try {
    const cfg = JSON.parse(root.dataset.pvConfig || "null") as PvConfig | null;
    if (!cfg || !Array.isArray(cfg.families) || !cfg.families.length || !cfg.strings) return null;
    cfg.fields = cfg.fields || {};
    return cfg;
  } catch {
    return null;
  }
}

/** The page form beside the viewer (never by id: the section and the form both carry id="form"). */
function pageForm(root: HTMLElement): HTMLFormElement | null {
  return (root.closest("main") ?? document).querySelector<HTMLFormElement>("form.c-form");
}

/** The header search stores a part number before sending the visitor to /parts#form. */
function takeSearchHandoff(root: HTMLElement) {
  try {
    const raw = window.sessionStorage.getItem(SEARCH_KEY);
    if (!raw) return;
    window.sessionStorage.removeItem(SEARCH_KEY);
    const value = (JSON.parse(raw) as { partNumber?: unknown } | null)?.partNumber;
    const form = pageForm(root);
    if (form && typeof value === "string") addPartNumber(form, value.slice(0, 80));
  } catch {}
}

const plural = (n: number) => `${n} ${n === 1 ? "part" : "parts"}`;
const lower = (s: string | undefined, fallback: string) => (s || fallback).toLowerCase();

/* Row markup. Labels, names and ids are filled in per row; the icon is the site's thin cross. */
const ROW_HTML = `<div class="c-field c-preq__pn"><label class="c-field__label"></label><input class="c-field__input t-input" type="text" name="partNumber" spellcheck="false" autocapitalize="characters" autocomplete="off" maxlength="80" aria-required="true"></div><div class="c-field c-preq__qty"><label class="c-field__label"></label><input class="c-field__input t-input" type="text" name="quantity" inputmode="numeric" autocomplete="off" maxlength="6" aria-required="true"></div>`;
const REMOVE_HTML = `<button type="button" class="c-preq__remove" data-preq-remove><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;

export function mountPartsRequest(root: HTMLElement): () => void {
  takeSearchHandoff(root);
  const foundDialog = root.querySelector<HTMLDialogElement>("dialog[data-preq]");
  const foundConfig = readPvConfig(root);
  if (!foundDialog || !foundConfig) return () => {};
  const dialog: HTMLDialogElement = foundDialog;
  const cfg: PvConfig = foundConfig;

  const ac = new AbortController();
  const on = <K extends keyof HTMLElementEventMap>(el: EventTarget | null | undefined, type: K | string, fn: (e: HTMLElementEventMap[K]) => void) =>
    el?.addEventListener(type, fn as EventListener, { signal: ac.signal });
  const q = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = dialog) => scope.querySelector<T>(sel);
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sheetMq = window.matchMedia("(max-width: 699.98px)");

  const S = cfg.strings;
  const names = cfg.families.map((f) => f.name);
  const pnLabel = cfg.fields.partNumber?.label || "Part number";
  const qtyLabel = cfg.fields.quantity?.label || "Quantity";
  const forms = Object.fromEntries(STEPS.map((s) => [s, q<HTMLFormElement>(`form[data-preq-step="${s}"]`)])) as Record<StepName, HTMLFormElement | null>;
  const rowsEl = q<HTMLOListElement>("[data-preq-rows]");
  const addBtn = q<HTMLButtonElement>("[data-preq-add]");
  const limitEl = q("[data-preq-limit]");
  const alsoEl = q("[data-preq-also]");
  const alsoList = q("[data-preq-also-list]");
  const familyEl = q("[data-preq-family]");
  const waEl = q("[data-preq-wa]");
  const waLink = q<HTMLAnchorElement>("[data-preq-wa-link]");
  const idBase = dialog.id || "preq";

  // ---- state -------------------------------------------------------------------------------
  let seq = 0;
  const newKey = () => `r${Date.now().toString(36)}${(seq++).toString(36)}`;
  const state = {
    draft: { rows: [], condition: "", aog: "" } as Draft,
    family: 0,
    step: "parts" as StepName,
    stepFamily: -1,
    open: false,
    closing: 0,
    finishing: false,
    opener: null as HTMLElement | null,
    errors: new Map<string, RowError>(),
  };

  const validFamily = (n: unknown) => typeof n === "number" && Number.isInteger(n) && n >= 0 && n < names.length;
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(DRAFT_KEY) || "null") as (Partial<Draft> & { step?: StepName; stepFamily?: number }) | null;
    if (saved && Array.isArray(saved.rows)) {
      state.draft.rows = saved.rows
        .filter((r): r is DraftRow => !!r && validFamily(r.family) && typeof r.partNumber === "string")
        .slice(0, MAX_ROWS)
        .map((r) => ({ key: newKey(), family: r.family, partNumber: r.partNumber.slice(0, 80), quantity: /^\d{0,6}$/.test(String(r.quantity)) ? String(r.quantity) : "1" }));
      const opts = (f?: PvFieldConfig) => f?.options ?? [];
      if (typeof saved.condition === "string" && opts(cfg.fields.condition).includes(saved.condition)) state.draft.condition = saved.condition;
      if (typeof saved.aog === "string" && opts(cfg.fields.aog).includes(saved.aog)) state.draft.aog = saved.aog;
      if (saved.step && STEPS.includes(saved.step) && validFamily(saved.stepFamily)) {
        state.step = saved.step;
        state.stepFamily = saved.stepFamily as number;
      }
    }
  } catch {}

  const save = () => {
    try {
      const { rows, condition, aog } = state.draft;
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ rows: rows.map(({ family, partNumber, quantity }) => ({ family, partNumber, quantity })), condition, aog, step: state.step, stepFamily: state.stepFamily }));
    } catch {}
  };
  const familyRows = (f = state.family) => state.draft.rows.filter((r) => r.family === f);
  const filledCount = (f?: number) => state.draft.rows.filter((r) => r.partNumber.trim() && (f === undefined || r.family === f)).length;

  // ---- viewer contract: pv:draft ------------------------------------------------------------
  let lastSig = "";
  const emitDraft = (force = false) => {
    const byFamily = names.map((_, f) => filledCount(f));
    const detail = { total: byFamily.reduce((a, b) => a + b, 0), byFamily };
    const sig = JSON.stringify(detail);
    root.dataset.pvDraft = String(detail.total);
    if (!force && sig === lastSig) return;
    lastSig = sig;
    root.dispatchEvent(new CustomEvent("pv:draft", { detail }));
  };

  // ---- rows (step 1) ------------------------------------------------------------------------
  const inputOf = (key: string, field: RowError["field"]) =>
    rowsEl?.querySelector<HTMLInputElement>(`li[data-key="${key}"] input[name="${field}"]`) ?? null;

  function paintRowError(li: HTMLElement, err: RowError | undefined) {
    const errEl = li.querySelector<HTMLElement>(".c-field__error");
    li.classList.toggle("is-error", !!err);
    if (errEl) errEl.textContent = err?.msg ?? "";
    li.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
      const bad = !!err && input.name === err.field;
      input.classList.toggle("is-error", bad);
      if (bad) {
        input.setAttribute("aria-invalid", "true");
        if (errEl) input.setAttribute("aria-describedby", errEl.id);
      } else {
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-describedby");
      }
    });
  }

  function buildRow(row: DraftRow, i: number, fresh: boolean): HTMLLIElement {
    const li = document.createElement("li");
    li.className = `c-preq__row t-input-wrap${fresh ? " is-new" : ""}`;
    li.dataset.key = row.key;
    li.innerHTML = ROW_HTML + (i > 0 ? REMOVE_HTML : "") + `<p class="c-field__error t-error-msg c-preq__row-error" aria-live="polite"></p>`;
    const id = `${idBase}-${row.key}`;
    const [pl, ql] = Array.from(li.querySelectorAll("label"));
    const pn = li.querySelector<HTMLInputElement>('input[name="partNumber"]')!;
    const qty = li.querySelector<HTMLInputElement>('input[name="quantity"]')!;
    const err = li.querySelector<HTMLElement>(".c-field__error")!;
    pn.id = `${id}-pn`;
    qty.id = `${id}-qty`;
    err.id = `${id}-error`;
    pl.htmlFor = pn.id;
    ql.htmlFor = qty.id;
    pl.textContent = i === 0 ? pnLabel : `${pnLabel} ${i + 1}`;
    ql.textContent = i === 0 ? qtyLabel : `${qtyLabel} ${i + 1}`;
    if (i > 0) {
      pl.classList.add("u-visually-hidden");
      ql.classList.add("u-visually-hidden");
      li.querySelector("[data-preq-remove]")?.setAttribute("aria-label", `${S.removeRow} ${i + 1}`);
    }
    pn.value = row.partNumber;
    qty.value = row.quantity;
    paintRowError(li, state.errors.get(row.key));
    return li;
  }

  function renderRows(freshKey?: string) {
    if (!rowsEl) return;
    const rows = familyRows();
    rowsEl.textContent = "";
    rowsEl.classList.toggle("has-many", rows.length > 1);
    rows.forEach((r, i) => rowsEl.append(buildRow(r, i, r.key === freshKey && !reduce())));
    const full = state.draft.rows.length >= MAX_ROWS;
    if (addBtn) addBtn.hidden = full;
    if (limitEl) limitEl.textContent = full ? S.rowLimit : "";
  }

  function renderAlso() {
    if (!alsoEl || !alsoList) return;
    alsoList.textContent = "";
    names.forEach((name, f) => {
      const n = f === state.family ? 0 : filledCount(f);
      if (!n) return;
      const li = document.createElement("li");
      li.className = "c-preq__also-item";
      const a = document.createElement("span");
      a.className = "c-preq__also-name";
      a.textContent = name;
      const b = document.createElement("span");
      b.className = "c-preq__also-count";
      b.textContent = plural(n);
      li.append(a, " ", b);
      alsoList.append(li);
    });
    alsoEl.hidden = !alsoList.childElementCount;
  }

  function addRow() {
    if (state.draft.rows.length >= MAX_ROWS) {
      renderRows();
      return;
    }
    const row: DraftRow = { key: newKey(), family: state.family, partNumber: "", quantity: "1" };
    state.draft.rows.push(row);
    renderRows(row.key);
    inputOf(row.key, "partNumber")?.focus();
    save();
  }

  function removeRow(key: string) {
    const rows = familyRows();
    const i = rows.findIndex((r) => r.key === key);
    if (i < 1) return;
    state.draft.rows = state.draft.rows.filter((r) => r.key !== key);
    state.errors.delete(key);
    renderRows();
    const left = familyRows();
    const target = left[i] ?? left[i - 1];
    (target ? inputOf(target.key, "partNumber") : addBtn)?.focus();
    renderSteps();
    save();
    emitDraft();
  }

  on(rowsEl, "input", (e: Event) => {
    const input = e.target as HTMLInputElement;
    const li = input.closest<HTMLElement>("li[data-key]");
    const row = li && state.draft.rows.find((r) => r.key === li.dataset.key);
    if (!li || !row) return;
    if (input.name === "quantity") {
      // Whole numbers of 1 or more: digits only, no leading zeros.
      const clean = input.value.replace(/\D+/g, "").replace(/^0+/, "").slice(0, 6);
      if (clean !== input.value) {
        const caret = Math.max(0, (input.selectionStart ?? clean.length) - (input.value.length - clean.length));
        input.value = clean;
        try {
          input.setSelectionRange(caret, caret);
        } catch {}
      }
      row.quantity = clean;
    } else if (input.name === "partNumber") {
      row.partNumber = input.value;
    }
    if (state.errors.has(row.key)) {
      state.errors.delete(row.key);
      paintRowError(li, undefined);
    }
    save();
    emitDraft();
  });
  on(rowsEl, "click", (e: Event) => {
    const btn = (e.target as Element).closest("[data-preq-remove]");
    const li = btn?.closest<HTMLElement>("li[data-key]");
    if (li?.dataset.key) removeRow(li.dataset.key);
  });
  on(addBtn, "click", addRow);

  // ---- segmented choices (steps 2 and 3) ----------------------------------------------------
  const seg = (name: "condition" | "aog") => q(`[data-preq-seg="${name}"]`);
  function movePill(bar: HTMLElement | null, animate: boolean) {
    const pill = bar?.querySelector<HTMLElement>(".t-tabs-pill");
    if (!bar || !pill) return;
    const active = Array.from(bar.querySelectorAll<HTMLElement>(".t-tab")).find((t) => t.querySelector("input:checked"));
    const prev = pill.style.transition;
    if (!animate || reduce()) pill.style.transition = "none";
    if (!active) {
      pill.style.width = "0px";
    } else {
      // The dialog's control can wrap onto two rows on a phone, so the pill moves in both axes.
      pill.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
      pill.style.width = `${active.offsetWidth}px`;
      pill.style.height = `${active.offsetHeight}px`;
    }
    if (!animate || reduce()) {
      void pill.offsetWidth;
      pill.style.transition = prev;
    }
  }
  function syncChoice(name: "condition" | "aog") {
    const bar = seg(name);
    bar?.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((r) => {
      r.checked = r.value === state.draft[name];
    });
    movePill(bar, false);
  }
  function choiceError(name: "condition" | "aog", msg: string) {
    const wrap = q(`[data-field="${name}"]`, forms[name] ?? dialog);
    const bar = seg(name);
    const errEl = wrap?.querySelector<HTMLElement>(".c-field__error");
    const hint = wrap?.querySelector<HTMLElement>(".c-field__hint");
    wrap?.classList.toggle("is-error", !!msg);
    bar?.classList.toggle("is-invalid", !!msg);
    if (errEl) errEl.textContent = msg;
    if (bar) {
      if (msg) bar.setAttribute("aria-invalid", "true");
      else bar.removeAttribute("aria-invalid");
      const by = [msg && errEl ? errEl.id : "", hint?.id ?? ""].filter(Boolean).join(" ");
      if (by) bar.setAttribute("aria-describedby", by);
      else bar.removeAttribute("aria-describedby");
    }
  }
  for (const name of ["condition", "aog"] as const) {
    on(forms[name], "change", (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (input.type !== "radio") return;
      // The preview's runtime moves every .c-segmented pill on a document-level change, along x
      // only; this control can wrap onto two rows, so it keeps its own events to itself.
      e.stopPropagation();
      state.draft[name] = input.value;
      choiceError(name, "");
      movePill(seg(name), true);
      if (name === "aog") updateWhatsApp();
      save();
    });
  }
  // Enter on a radio means Next, as in a text field (browsers do not submit from radios).
  on(dialog, "keydown", (e: KeyboardEvent) => {
    const t = e.target as HTMLInputElement;
    if (e.key === "Enter" && t instanceof HTMLInputElement && t.type === "radio" && t.form) {
      e.preventDefault();
      t.form.requestSubmit();
    }
  });

  // ---- WhatsApp line (step 3) ---------------------------------------------------------------
  function whatsappHref(): string {
    const digits = (cfg.whatsapp || "").replace(/[^0-9]/g, "");
    let text = cfg.template || "";
    const rows = filledRows(state.draft, names.length);
    // The template's placeholders take what the visitor already typed; the rest stay for them.
    if (rows.length) {
      text = text.replace(/(Part number:\s*)\[[^\]]*\]/i, (_m, a: string) => a + partLines(state.draft, names).join("; "));
      text = text.replace(/(Quantity:\s*)\[[^\]]*\]/i, (_m, a: string) => a + String(rows.reduce((s, r) => s + quantityOf(r), 0)));
    }
    if (state.draft.condition) text = text.replace(/(Condition:\s*)\[[^\]]*\]/i, (_m, a: string) => a + state.draft.condition);
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }
  function updateWhatsApp() {
    if (!waEl) return;
    const show = !!(cfg.whatsapp || "").replace(/[^0-9]/g, "") && /^yes/i.test(state.draft.aog);
    if (show && waLink) waLink.href = whatsappHref();
    waEl.hidden = !show;
  }

  // ---- steps --------------------------------------------------------------------------------
  function summary(step: StepName) {
    if (step === "parts") return plural(filledCount());
    return state.draft[step];
  }
  function renderSteps() {
    const idx = STEPS.indexOf(state.step);
    STEPS.forEach((s, i) => {
      const li = q(`[data-preq-indicator="${s}"]`);
      if (!li) return;
      if (i === idx) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
      li.classList.toggle("is-done", i < idx);
      const sum = li.querySelector<HTMLElement>("[data-preq-summary]");
      if (sum) sum.textContent = i < idx ? summary(s) : "";
    });
  }
  function showStep(step: StepName, dir: -1 | 0 | 1) {
    state.step = step;
    state.stepFamily = state.family;
    for (const s of STEPS) if (forms[s]) forms[s]!.hidden = s !== step;
    renderSteps();
    if (step === "condition" || step === "aog") syncChoice(step);
    if (step === "aog") updateWhatsApp();
    const form = forms[step];
    if (form) {
      form.classList.remove("is-enter-next", "is-enter-back");
      if (dir && !reduce() && state.open) {
        void form.offsetWidth;
        form.classList.add(dir > 0 ? "is-enter-next" : "is-enter-back");
      }
    }
    save();
  }
  function go(step: StepName, dir: -1 | 1) {
    showStep(step, dir);
    forms[step]?.querySelector<HTMLElement>(".c-preq__h")?.focus();
  }
  on(dialog, "animationend", (e: AnimationEvent) => {
    (e.target as Element).classList?.remove("is-enter-next", "is-enter-back", "is-new");
  });

  function shake(el: Element | null | undefined) {
    if (!el) return;
    el.classList.remove("is-shaking");
    void (el as HTMLElement).offsetWidth;
    el.classList.add("is-shaking");
    window.setTimeout(() => el.classList.remove("is-shaking"), 320);
  }

  function validateParts(): boolean {
    // Blank extra rows are dropped rather than flagged; the family keeps at least one row.
    const mine = familyRows();
    if (mine.length > 1) {
      const keep = mine.filter((r) => r.partNumber.trim());
      const drop = new Set((keep.length ? mine.filter((r) => !r.partNumber.trim()) : mine.slice(1)).map((r) => r.key));
      if (drop.size) state.draft.rows = state.draft.rows.filter((r) => !drop.has(r.key));
    }
    state.errors.clear();
    const rows = familyRows();
    let first: { key: string; field: RowError["field"] } | null = null;
    if (!filledCount() && rows[0]) {
      state.errors.set(rows[0].key, { field: "partNumber", msg: `Please fill in ${lower(pnLabel, "part number")}.` });
      first = { key: rows[0].key, field: "partNumber" };
    } else {
      for (const r of rows) {
        if (r.partNumber.trim() && !/^[1-9]\d*$/.test(r.quantity)) {
          state.errors.set(r.key, { field: "quantity", msg: `Please fill in ${lower(qtyLabel, "quantity")}.` });
          first ??= { key: r.key, field: "quantity" };
        }
      }
    }
    renderRows();
    save();
    emitDraft();
    if (!first) return true;
    const input = inputOf(first.key, first.field);
    shake(input);
    input?.focus();
    return false;
  }

  on(forms.parts, "submit", (e: Event) => {
    e.preventDefault();
    if (validateParts()) go("condition", 1);
  });
  on(forms.condition, "submit", (e: Event) => {
    e.preventDefault();
    if (state.draft.condition) return go("aog", 1);
    choiceError("condition", `Please choose ${lower(cfg.fields.condition?.label, "condition")}.`);
    shake(seg("condition"));
    seg("condition")?.querySelector<HTMLInputElement>("input")?.focus();
  });
  on(forms.aog, "submit", (e: Event) => {
    e.preventDefault();
    if (state.draft.aog) return finish();
    choiceError("aog", `Please choose ${lower(cfg.fields.aog?.label, "aircraft on ground")}.`);
    shake(seg("aog"));
    seg("aog")?.querySelector<HTMLInputElement>("input")?.focus();
  });
  dialog.querySelectorAll<HTMLButtonElement>("[data-preq-back]").forEach((btn) =>
    on(btn, "click", () => {
      const i = STEPS.indexOf(state.step);
      if (i > 0) go(STEPS[i - 1], -1);
    }),
  );

  // ---- placement ----------------------------------------------------------------------------
  // Desktop: beside the callout that opened it (right if there is room, else left, else above or
  // below), clamped inside the viewport, scaling from the callout. Below 700 px: a bottom sheet
  // (CSS only; the inline position is cleared).
  const M = 16;
  const GAP = 16;
  const NOTCH_END = 26; // keeps the notch clear of the 20 px corners
  let anchor: { x: number; y: number } | null = null;
  let side: "right" | "left" | "below" | "above" | "" = "";
  // The notch and the scale origin both point at the callout's centre.
  function aim(left: number, top: number, w: number, h: number) {
    const st = dialog.style;
    if (!anchor) {
      st.removeProperty("transform-origin");
      st.removeProperty("--preq-notch");
      delete dialog.dataset.side;
      return;
    }
    const along = (v: number, size: number) => Math.round(Math.max(NOTCH_END, Math.min(size - NOTCH_END, v)));
    const ox = Math.max(0, Math.min(w, anchor.x - left));
    const oy = Math.max(0, Math.min(h, anchor.y - top));
    st.transformOrigin = `${Math.round(ox)}px ${Math.round(oy)}px`;
    if (side === "right" || side === "left") st.setProperty("--preq-notch", `${along(anchor.y - top, h)}px`);
    else st.setProperty("--preq-notch", `${along(anchor.x - left, w)}px`);
    if (side) dialog.dataset.side = side;
    else delete dialog.dataset.side;
  }
  function place() {
    const st = dialog.style;
    if (sheetMq.matches) {
      for (const p of ["left", "top", "transform-origin", "--preq-notch"]) st.removeProperty(p);
      delete dialog.dataset.side;
      return;
    }
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const w = dialog.offsetWidth;
    const h = dialog.offsetHeight;
    const r = state.opener?.isConnected ? state.opener.getBoundingClientRect() : null;
    // Stay below the site header when it is showing and the dialog still fits under it.
    const headerBottom = document.querySelector<HTMLElement>(".c-header")?.getBoundingClientRect().bottom ?? 0;
    const minTop = headerBottom > 0 && vh - headerBottom - 8 - M >= h ? headerBottom + 8 : M;
    const clampX = (x: number) => Math.max(M, Math.min(x, vw - w - M));
    const clampY = (y: number) => Math.max(minTop, Math.min(y, vh - h - M));
    let left: number;
    let top: number;
    anchor = r && (r.width || r.height) ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
    if (!r || !anchor) {
      side = "";
      left = clampX((vw - w) / 2);
      top = clampY((vh - h) / 2);
    } else if (r.right + GAP + w <= vw - M) {
      side = "right";
      left = r.right + GAP;
      top = clampY(anchor.y - h / 2);
    } else if (r.left - GAP - w >= M) {
      side = "left";
      left = r.left - GAP - w;
      top = clampY(anchor.y - h / 2);
    } else {
      left = clampX(anchor.x - w / 2);
      side = r.bottom + GAP + h <= vh - M ? "below" : "above";
      top = side === "below" ? r.bottom + GAP : clampY(r.top - GAP - h);
    }
    // A notch only makes sense when the callout is actually beside the edge it points from.
    if ((side === "right" || side === "left") && (anchor!.y < top + NOTCH_END / 2 || anchor!.y > top + h - NOTCH_END / 2)) side = "";
    st.left = `${Math.round(left)}px`;
    st.top = `${Math.round(top)}px`;
    aim(left, top, w, h);
  }
  // When a step grows (rows added, an error shown) keep the top where it is unless the dialog
  // would leave the viewport; it never jumps back and forth while someone types.
  function keepInView() {
    if (!state.open || sheetMq.matches) return;
    const w = dialog.offsetWidth;
    const h = dialog.offsetHeight;
    const left = Number.parseFloat(dialog.style.left || "0");
    let top = Number.parseFloat(dialog.style.top || "0");
    const max = Math.max(M, window.innerHeight - h - M);
    if (top > max) {
      top = max;
      dialog.style.top = `${Math.round(top)}px`;
    }
    aim(left, top, w, h);
  }
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => keepInView()) : null;
  ro?.observe(dialog);
  on(window, "resize", () => {
    if (!state.open) return;
    place();
    if (state.step !== "parts") movePill(seg(state.step), false);
  });

  // ---- open and close -----------------------------------------------------------------------
  function initialFocus() {
    const form = forms[state.step];
    if (!form) return;
    // Touch screens get the step heading, so the keyboard does not jump over the sheet at once.
    if (window.matchMedia("(pointer: coarse)").matches) {
      form.querySelector<HTMLElement>(".c-preq__h")?.focus();
      return;
    }
    if (state.step === "parts") {
      const inputs = Array.from(rowsEl?.querySelectorAll<HTMLInputElement>('input[name="partNumber"]') ?? []);
      (inputs.find((i) => !i.value.trim()) ?? inputs[inputs.length - 1])?.focus();
    } else {
      const bar = seg(state.step);
      (bar?.querySelector<HTMLInputElement>("input:checked") ?? bar?.querySelector<HTMLInputElement>("input"))?.focus();
    }
  }

  function open(family: number, from: HTMLElement | null) {
    if (state.open) return;
    window.clearTimeout(state.closing);
    state.closing = 0;
    state.family = validFamily(family) ? family : 0;
    state.opener = from;
    state.finishing = false;
    // Reopening for the same family returns to the step the visitor left; another family starts
    // at its part numbers, which is the only step that differs between families.
    if (state.stepFamily !== state.family) state.step = "parts";
    if (!familyRows().length) state.draft.rows.push({ key: newKey(), family: state.family, partNumber: "", quantity: "1" });
    state.errors.clear();
    choiceError("condition", "");
    choiceError("aog", "");
    if (familyEl) familyEl.textContent = names[state.family];
    renderRows();
    renderAlso();
    dialog.classList.remove("is-open", "is-closing");
    try {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    } catch {
      return;
    }
    state.open = true;
    root.dataset.pvBusy = "1";
    document.documentElement.classList.add("is-preq-open");
    showStep(state.step, 0);
    place();
    void dialog.offsetWidth;
    dialog.classList.add("is-open");
    initialFocus();
    save();
  }

  function close() {
    if (!state.open || state.closing) return;
    dialog.classList.remove("is-open");
    dialog.classList.add("is-closing");
    const done = () => {
      state.closing = 0;
      if (dialog.open) {
        try {
          dialog.close();
        } catch {
          dialog.removeAttribute("open");
          onClosed();
        }
      }
    };
    if (reduce()) done();
    else state.closing = window.setTimeout(done, CLOSE_MS);
  }

  function onClosed() {
    if (!state.open) return;
    state.open = false;
    dialog.classList.remove("is-open", "is-closing");
    delete root.dataset.pvBusy;
    document.documentElement.classList.remove("is-preq-open");
    if (state.finishing) {
      state.finishing = false;
      afterFinish();
    } else if (state.opener?.isConnected) {
      state.opener.focus({ preventScroll: true });
    }
  }

  function finish() {
    state.finishing = true;
    close();
  }

  // Runs once the dialog is closed (the page is no longer inert), so the radio click and focus land.
  function afterFinish() {
    const form = pageForm(root);
    const snapshot: Draft = { rows: state.draft.rows.map((r) => ({ ...r })), condition: state.draft.condition, aog: state.draft.aog };
    // The next time the dialog opens it starts at part numbers, with the answers kept.
    state.step = "parts";
    save();
    if (!form) return;
    const { note } = fillPartsForm(form, snapshot, names, { note: S.filled });
    const target = note ?? form;
    if (note) note.focus({ preventScroll: true });
    const header = document.querySelector<HTMLElement>(".c-header");
    const y = form.getBoundingClientRect().top + window.scrollY;
    const goingUp = y < window.scrollY;
    // Scrolling down hides the fixed header; scrolling up shows it, so leave room for it then.
    const offset = (goingUp ? header?.offsetHeight ?? 0 : 0) + 24;
    window.scrollTo({ top: Math.max(0, y - offset), behavior: reduce() ? "instant" : "smooth" });
    if (!note) target.querySelector<HTMLElement>("textarea, input, select")?.focus({ preventScroll: true });
  }

  on(dialog, "cancel", (e: Event) => {
    e.preventDefault();
    close();
  });
  on(dialog, "close", onClosed);
  on(q("[data-preq-close]"), "click", () => close());
  // A click on the backdrop (the dialog element itself, outside its box) closes it. Both the
  // press and the release must be outside, so a text selection that ends there does not.
  let downOutside = false;
  const outside = (e: MouseEvent) => {
    const r = dialog.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };
  on(dialog, "pointerdown", (e: PointerEvent) => {
    downOutside = e.target === dialog && outside(e);
  });
  on(dialog, "click", (e: MouseEvent) => {
    if (e.target === dialog && downOutside && outside(e)) close();
    downOutside = false;
  });

  on(root, "pv:request", (e: Event) => {
    const d = (e as CustomEvent<{ family?: number; from?: HTMLElement }>).detail ?? {};
    open(Number(d.family ?? 0), d.from instanceof HTMLElement ? d.from : null);
  });
  on(root, "pv:ready", () => emitDraft(true));
  emitDraft(true);

  return () => {
    ac.abort();
    ro?.disconnect();
    window.clearTimeout(state.closing);
    if (dialog.open) {
      try {
        dialog.close();
      } catch {}
    }
    delete root.dataset.pvBusy;
    document.documentElement.classList.remove("is-preq-open");
  };
}
