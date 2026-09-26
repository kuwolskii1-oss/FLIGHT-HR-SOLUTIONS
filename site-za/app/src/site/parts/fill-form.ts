/**
 * Writes a finished part request from the engine families viewer into the Parts page form.
 *
 * Plain DOM on purpose: the same module runs on the live site (next to React's DoorForm) and in
 * the no-login preview (no React at all). Fields are found by `name` inside the form element and
 * never by id, because the preview renames every id.
 *
 * - partNumber: one line per row, "<Family>: <part number>, quantity <n>". The lines written last
 *   time are remembered in a data attribute, so a second Finish replaces them and keeps anything
 *   the visitor typed by hand.
 * - quantity: the total of all rows. condition: the select's value. aog: a click on the matching
 *   radio, so React's onChange runs and the segmented pill moves (the preview's runtime listens
 *   for the same change event).
 * - Every other field is left alone. Then `fhs:prefill` is dispatched on the form with the names
 *   it wrote, so DoorForm can clear stale errors for them.
 */

export type DraftRow = { key: string; family: number; partNumber: string; quantity: string };
export type Draft = { rows: DraftRow[]; condition: string; aog: string };

export const PREFILL_EVENT = "fhs:prefill";
/** DoorForm dispatches this on its form (bubbling) once the enquiry was sent; the draft is then cleared. */
export const SENT_EVENT = "fhs:sent";
const LINES_ATTR = "prefillLines"; // data-prefill-lines on the part number field

/** A quantity as the whole number the dialog validated (1 when it is missing or malformed). */
export function quantityOf(row: DraftRow): number {
  const n = Number.parseInt(row.quantity, 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

/** The rows that carry a part number, in family order and then in the order they were added. */
export function filledRows(draft: Draft, familyCount: number): DraftRow[] {
  const out: DraftRow[] = [];
  for (let f = 0; f < familyCount; f++) for (const r of draft.rows) if (r.family === f && r.partNumber.trim()) out.push(r);
  return out;
}

/** The lines written into the part number field, one per filled row. */
export function partLines(draft: Draft, familyNames: string[]): string[] {
  return filledRows(draft, familyNames.length).map((r) => `${familyNames[r.family]}: ${r.partNumber.trim()}, quantity ${quantityOf(r)}`);
}

/** Removes one occurrence of each of `drop` from `lines` (exact match after trimming). */
function without(lines: string[], drop: string[]): string[] {
  const pending = drop.map((l) => l.trim());
  return lines.filter((line) => {
    const i = pending.indexOf(line.trim());
    if (i === -1) return true;
    pending.splice(i, 1);
    return false;
  });
}

function trimBlankEnds(lines: string[]): string[] {
  let a = 0;
  let b = lines.length;
  while (a < b && !lines[a].trim()) a++;
  while (b > a && !lines[b - 1].trim()) b--;
  return lines.slice(a, b);
}

function announce(el: Element) {
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

/**
 * Fills the page form from the draft. Returns the names it wrote and the revealed note (or null
 * when the form has no note element).
 */
export function fillPartsForm(
  form: HTMLFormElement,
  draft: Draft,
  familyNames: string[],
  opts: { note?: string } = {},
): { names: string[]; note: HTMLElement | null } {
  const names: string[] = [];
  const field = (name: string) => form.elements.namedItem(name);
  const rows = filledRows(draft, familyNames.length);

  const pn = field("partNumber");
  if (pn instanceof HTMLTextAreaElement || pn instanceof HTMLInputElement) {
    const lines = partLines(draft, familyNames);
    let before: string[] = [];
    try {
      const parsed: unknown = JSON.parse(pn.dataset[LINES_ATTR] || "[]");
      if (Array.isArray(parsed)) before = parsed.map(String);
    } catch {}
    // A textarea holds one line per part; a single-line input (not used today) separates with "; ".
    const area = pn instanceof HTMLTextAreaElement;
    const typed = trimBlankEnds(without(pn.value.split(area ? /\r?\n/ : /\s*;\s*/), before));
    pn.value = [...typed, ...lines].join(area ? "\n" : "; ");
    pn.dataset[LINES_ATTR] = JSON.stringify(lines);
    announce(pn);
    names.push("partNumber");
  }

  const qty = field("quantity");
  if (qty instanceof HTMLInputElement && rows.length) {
    qty.value = String(rows.reduce((sum, r) => sum + quantityOf(r), 0));
    announce(qty);
    names.push("quantity");
  }

  const condition = field("condition");
  if (condition instanceof HTMLSelectElement && draft.condition && Array.from(condition.options).some((o) => o.value === draft.condition)) {
    condition.value = draft.condition;
    announce(condition);
    names.push("condition");
  }

  if (draft.aog) {
    const radio = Array.from(form.querySelectorAll<HTMLInputElement>('input[type="radio"][name="aog"]')).find((r) => r.value === draft.aog);
    if (radio) {
      // A click (not a property write) so React's onChange and the preview's change listener run.
      if (!radio.checked) radio.click();
      names.push("aog");
    }
  }

  const note = form.querySelector<HTMLElement>("[data-form-filled]");
  if (note && opts.note) {
    const text = note.querySelector<HTMLElement>("[data-form-filled-text]") ?? note;
    text.textContent = opts.note;
    note.hidden = false;
  }

  form.dispatchEvent(new CustomEvent(PREFILL_EVENT, { bubbles: true, detail: { names, note: opts.note ?? "" } }));
  return { names, note: note && !note.hidden ? note : null };
}

/**
 * The search handoff: a part number stored by the header search before it sent the visitor to
 * /parts#form. Adds it to the part number field unless it is already there.
 */
export function addPartNumber(form: HTMLFormElement, partNumber: string): boolean {
  const pn = form.elements.namedItem("partNumber");
  if (!(pn instanceof HTMLTextAreaElement || pn instanceof HTMLInputElement)) return false;
  const value = partNumber.trim();
  if (!value) return false;
  const area = pn instanceof HTMLTextAreaElement;
  const lines = pn.value.split(area ? /\r?\n/ : /\s*;\s*/).map((l) => l.trim());
  if (!lines.includes(value)) {
    const current = pn.value.replace(/\s+$/, "");
    pn.value = current ? `${current}${area ? "\n" : "; "}${value}` : value;
    announce(pn);
  }
  form.dispatchEvent(new CustomEvent(PREFILL_EVENT, { bubbles: true, detail: { names: ["partNumber"], note: "" } }));
  return true;
}
