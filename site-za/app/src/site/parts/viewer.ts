/**
 * The Parts page's engine families viewer: a plain DOM module (no React), mounted on the section
 * that PartsViewer.tsx renders. It owns the tablist of the four families, the Back and Next turn
 * buttons, page-level arrow keys, pointer drag, the callout with its leader line, and the three.js
 * stage (scene.ts, loaded with a dynamic import only when WebGL is usable and the stage is near
 * the viewport). Without WebGL, on Save-Data or if the context fails, the server-rendered poster
 * stays and everything else still works: the poster switches per family and the callout sits at
 * the stop's stored poster position.
 *
 * Elements are found relative to the root by data-* attributes, never by id (the no-login preview
 * renames ids). Contract with the request dialog (request.ts):
 * - the callout dispatches `pv:request` on the root, detail { family, from };
 * - request.ts dispatches `pv:draft` on the root, detail { total, byFamily };
 * - while `root.dataset.pvBusy === "1"` the viewer ignores keys, drags and buttons.
 */
import type { EngineStage, Insets } from "./scene";
import { POSTERS, posterFiles, STOPS } from "./viewer-config";

type Family = { key: string; name: string };
type Strings = { prompt: string; promptContinue: string };
type Config = { families: Family[]; strings: Strings };

type Source = "tab" | "key" | "button" | "drag" | "init";
type Rect = { l: number; t: number; r: number; b: number };

const DEG_PER_PX = 0.35;
const DRAG_THRESHOLD = 6;
const MAX_TURN_MS = 600;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mod = (n: number, m: number) => ((n % m) + m) % m;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

declare global {
  interface Window {
    /** Tests and the poster renderer run on SwiftShader; this lets them opt in to software WebGL. */
    __pvAllowSoftwareGL?: boolean;
  }
}

export function mountPartsViewer(root: HTMLElement): () => void {
  const q = <T extends Element>(sel: string) => root.querySelector<T>(sel);
  const stageEl = q<HTMLElement>("[data-pv-stage]");
  const tablist = q<HTMLElement>("[data-pv-tabs]");
  const callout = q<HTMLButtonElement>("[data-pv-callout]");
  const panel = q<HTMLElement>("[data-pv-panel]");
  const bar = q<HTMLElement>("[data-pv-bar]");
  if (!stageEl || !tablist || !callout || !panel || !bar) return () => {};
  const stageBox: HTMLElement = stageEl;

  let config: Config;
  try {
    config = JSON.parse(root.dataset.pvConfig ?? "{}") as Config;
  } catch {
    return () => {};
  }
  const families = config.families ?? [];
  if (families.length !== STOPS.length) return () => {};

  const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>("[data-pv-tab]"));
  const pill = tablist.querySelector<HTMLElement>(".t-tabs-pill");
  const prevBtn = q<HTMLButtonElement>("[data-pv-prev]");
  const nextBtn = q<HTMLButtonElement>("[data-pv-next]");
  const live = q<HTMLElement>("[data-pv-live]");
  const poster = q<HTMLImageElement>("[data-pv-poster]");
  const posterTall = q<HTMLSourceElement>("[data-pv-poster-tall]");
  const glHost = q<HTMLElement>("[data-pv-gl]");
  const leaders = Array.from(root.querySelectorAll<SVGPathElement>("[data-pv-leader]"));
  const dot = q<SVGGElement>("[data-pv-dot]");
  const lines = q<SVGSVGElement>("[data-pv-lines]");
  const promptEl = callout.querySelector<HTMLElement>("[data-pv-prompt]");
  const names = Array.from(root.querySelectorAll<HTMLElement>("[data-pv-name]"));

  const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => reducedMq.matches;
  const busy = () => root.dataset.pvBusy === "1";

  let family = Math.max(0, tabs.findIndex((t) => t.getAttribute("aria-selected") === "true"));
  let az: number = STOPS[family];
  let anim: { from: number; to: number; v0: number; t0: number; dur: number } | null = null;
  let stage: EngineStage | null = null;
  let mode: "poster" | "gl" = "poster";
  let draftTotal = 0;
  let raf = 0;
  let dirty = true;
  let inView = false;
  let halfInView = false;
  let disposed = false;
  let pillReady = false;
  const cleanups: (() => void)[] = [];
  const on = (el: EventTarget, type: string, fn: (e: never) => void, opts?: AddEventListenerOptions) => {
    const h = fn as unknown as EventListener;
    el.addEventListener(type, h, opts);
    cleanups.push(() => el.removeEventListener(type, h, opts));
  };

  /* ---------------------------------------------------------------- selection */

  const movePill = (animate: boolean) => {
    const tab = tabs[family];
    if (!pill || !tab) return;
    const prev = pill.style.transition;
    if (!animate) pill.style.transition = "none";
    pill.style.transform = `translateX(${tab.offsetLeft}px)`;
    pill.style.width = `${tab.offsetWidth}px`;
    if (!animate) {
      void pill.offsetWidth;
      pill.style.transition = prev;
    }
    // Keep the selected tab in view when the row scrolls (narrow phones).
    const row = tablist;
    if (row.scrollWidth > row.clientWidth + 1) {
      const left = tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2;
      row.scrollTo({ left, behavior: animate && !reduced() ? "smooth" : "auto" });
    }
    root.classList.toggle("is-tabs-scroll", row.scrollWidth > row.clientWidth + 1);
  };

  const announce = (text: string) => {
    if (!live) return;
    live.textContent = "";
    window.setTimeout(() => {
      if (!disposed) live.textContent = text;
    }, 60);
  };

  const renderLabels = () => {
    const f = families[family];
    for (const n of names) n.textContent = n.dataset.pvName === "sentence" ? `${f.name}. ` : f.name;
    if (promptEl) promptEl.textContent = draftTotal > 0 ? config.strings.promptContinue : config.strings.prompt;
  };

  function select(index: number, source: Source, dir = 0, turn = true) {
    const next = mod(index, families.length);
    const changed = next !== family;
    family = next;
    tabs.forEach((t, i) => {
      const selected = i === family;
      t.setAttribute("aria-selected", selected ? "true" : "false");
      t.tabIndex = selected ? 0 : -1;
    });
    const tab = tabs[family];
    if (tab?.id) panel!.setAttribute("aria-labelledby", tab.id);
    root.dataset.family = String(family);
    root.dataset.stop = String(STOPS[family]);
    renderLabels();
    movePill(pillReady && !reduced());
    if (source !== "tab" && source !== "init" && changed) announce(families[family].name);
    if (source === "init" || !turn) return;
    if (mode === "gl") turnTo(STOPS[family], dir);
    else showPosterStop();
  }

  /* ---------------------------------------------------------------- camera moves */

  /** The unwrapped angle for `stopDeg` reached from the current angle in direction `dir`. */
  const targetAngle = (stopDeg: number, dir: number) => {
    if (dir > 0) {
      const d = mod(stopDeg - az, 360);
      return az + (d < 0.5 ? 0 : d);
    }
    if (dir < 0) {
      const d = mod(az - stopDeg, 360);
      return az - (d < 0.5 ? 0 : d);
    }
    let d = mod(stopDeg - az + 180, 360) - 180;
    if (d === -180) d = 180;
    return az + d;
  };

  const currentVelocity = (now: number) => {
    if (!anim) return 0;
    const t = clamp((now - anim.t0) / anim.dur, 0, 1);
    const dt = 1 / anim.dur;
    if (anim.v0 !== 0) {
      const dp = anim.to - anim.from;
      const h = (tt: number) => dp * (6 * tt - 6 * tt * tt) + anim!.v0 * anim!.dur * (1 - 4 * tt + 3 * tt * tt);
      return h(t) * dt;
    }
    const e = 1e-3;
    return (((easeInOutCubic(Math.min(1, t + e)) - easeInOutCubic(Math.max(0, t - e))) / (2 * e)) * (anim.to - anim.from)) * dt;
  };

  function turnTo(stopDeg: number, dir: number) {
    const now = performance.now();
    const to = targetAngle(stopDeg, dir);
    if (reduced()) {
      anim = null;
      az = to;
      settle();
      return;
    }
    const delta = Math.abs(to - az);
    if (delta < 0.01) {
      anim = null;
      settle();
      return;
    }
    const v0 = currentVelocity(now);
    anim = { from: az, to, v0, t0: now, dur: clamp((delta / 90) * 560, 260, MAX_TURN_MS) };
    setMoving(true);
    kick();
  }

  const step = (now: number) => {
    if (!anim) return;
    const t = clamp((now - anim.t0) / anim.dur, 0, 1);
    if (anim.v0 !== 0) {
      // Interrupted turn: a cubic Hermite from the current angle and speed, so a second press
      // turns on without a jolt.
      const dp = anim.to - anim.from;
      az = anim.from + dp * (3 * t * t - 2 * t * t * t) + anim.v0 * anim.dur * (t - 2 * t * t + t * t * t);
    } else {
      az = anim.from + (anim.to - anim.from) * easeInOutCubic(t);
    }
    if (t >= 1) {
      az = anim.to;
      anim = null;
      settle();
    }
    dirty = true;
  };

  const settle = () => {
    // Fold the unwrapped angle back into 0..360 at rest.
    az = mod(az, 360);
    dirty = true;
    setMoving(false);
    kick();
  };

  /* ---------------------------------------------------------------- render loop */

  const frame = (now: number) => {
    raf = 0;
    if (disposed) return;
    step(now);
    if (dirty && stage && inView) {
      stage.setAzimuth(az);
      stage.render();
      dirty = false;
      if (!firstFrame) onFirstFrame();
      if (!moving) placeCallout();
    }
    if ((anim || dragging) && inView) raf = requestAnimationFrame(frame);
  };
  const kick = () => {
    if (!raf && !disposed) raf = requestAnimationFrame(frame);
  };

  /* ---------------------------------------------------------------- callout */

  let moving = false;
  function setMoving(v: boolean) {
    moving = v;
    stageBox.classList.toggle("is-moving", v);
    if (!v) {
      if (mode === "poster") placeCallout();
      else kick();
    }
  }

  const insets = (): Insets => {
    const s = stageBox.getBoundingClientRect();
    const cap = q<HTMLElement>("[data-pv-caption]")?.getBoundingClientRect();
    const narrow = s.width < 700;
    // The controls over the bottom of the card: the bar on desktop; on phones (where the bar is
    // display: contents) the round Back and Next buttons, the tabs sitting under the card.
    let controlsTop = s.bottom;
    for (const el of [bar, prevBtn, nextBtn]) {
      const r = el?.getBoundingClientRect();
      if (r && r.height > 0 && r.top < s.bottom && r.bottom > s.top) controlsTop = Math.min(controlsTop, r.top);
    }
    // On phones the caption sits over the top of the card; keep the engine clear of it.
    // On phones also leave the callout a line of its own between the caption and the engine.
    const top =
      narrow && cap && cap.top - s.top < s.height / 2
        ? cap.bottom - s.top + 8 + callout!.offsetHeight * 0.8
        : Math.max(16, s.height * 0.05);
    return {
      top,
      bottom: s.bottom - controlsTop + (narrow ? 8 : 14),
      left: narrow ? 8 : 24,
      right: narrow ? 8 : 24,
    };
  };

  type Anchor = { x: number; y: number; l: number; t: number; r: number; b: number };

  /** The anchor and bounds on the displayed poster, through object-fit: cover maths. */
  const posterAnchor = (): Anchor | null => {
    if (!poster || !poster.naturalWidth) return null;
    const set = poster.naturalWidth / poster.naturalHeight < 1 ? POSTERS.tall : POSTERS.wide;
    const s = set.stops[family];
    const W = stageBox.clientWidth;
    const Hh = stageBox.clientHeight;
    const iw = poster.naturalWidth;
    const ih = poster.naturalHeight;
    const k = Math.max(W / iw, Hh / ih);
    const ox = (W - iw * k) / 2;
    const oy = (Hh - ih * k) / 2;
    const X = (f: number) => ox + f * iw * k;
    const Y = (f: number) => oy + f * ih * k;
    return { x: X(s.ax), y: Y(s.ay), l: X(s.l), t: Y(s.t), r: X(s.r), b: Y(s.b) };
  };

  const glAnchor = (): Anchor | null => {
    if (!stage) return null;
    const a = stage.anchor(family);
    if (!a.visible) return null;
    const b = stage.bounds();
    return { x: a.x, y: a.y, l: b.left, t: b.top, r: b.right, b: b.bottom };
  };

  function placeCallout() {
    const A = mode === "gl" ? glAnchor() : posterAnchor();
    if (!A) {
      stageBox.classList.remove("is-callout-ready");
      return;
    }
    const W = stageBox.clientWidth;
    const Hh = stageBox.clientHeight;
    const ins = insets();
    const narrow = W < 700;
    const capBox = q<HTMLElement>("[data-pv-caption]");
    const safeTop = narrow && capBox ? capBox.offsetTop + capBox.offsetHeight + 8 : 12;
    const safe = { l: 12, t: safeTop, r: W - 12, b: Hh - ins.bottom - 4 };
    const bw = callout!.offsetWidth;
    const bh = callout!.offsetHeight;
    const side = A.x < (A.l + A.r) / 2 ? -1 : 1;
    const gap = clamp(W * 0.05, 28, 72);
    const lift = clamp(Hh * 0.13, 34, 90);

    // Things the label must not cover: the caption (and the bar, kept out by `safe`).
    const s = stageBox.getBoundingClientRect();
    const obstacles: Rect[] = [];
    const cap = q<HTMLElement>("[data-pv-caption]")?.getBoundingClientRect();
    if (cap && cap.width) obstacles.push({ l: cap.left - s.left - 6, t: cap.top - s.top - 6, r: cap.right - s.left + 6, b: cap.bottom - s.top + 6 });
    const engine: Rect = { l: A.l, t: A.t, r: A.r, b: A.b };
    const overlap = (a: Rect, b: Rect) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));

    // Candidate centres around the anchor, in order of preference: beside and above the anchor on
    // the open side, beside it level, above the engine (open side, then inner side), beside and
    // below, then the other side. Each is clamped into the card and scored.
    const sideX = A.x + side * (gap + bw / 2);
    const candidates: [number, number][] = [
      [sideX, A.y - lift],
      [sideX, A.y - lift * 0.35],
      [A.x + side * bw * 0.15, Math.min(A.t, A.y) - 24 - bh / 2],
      [A.x - side * (gap * 0.6 + bw / 2), Math.min(A.t, A.y) - 24 - bh / 2],
      [sideX, A.y + lift * 0.6],
      [A.x - side * (gap + bw / 2), A.y - lift],
    ];
    let best: { x: number; y: number; score: number } | null = null;
    candidates.forEach(([cx, cy], i) => {
      const x0 = cx - bw / 2;
      const y0 = cy - bh / 2;
      const x = clamp(x0, safe.l, Math.max(safe.l, safe.r - bw));
      const y = clamp(y0, safe.t, Math.max(safe.t, safe.b - bh));
      const box: Rect = { l: x, t: y, r: x + bw, b: y + bh };
      let score = i * 40 + (Math.abs(x - x0) + Math.abs(y - y0)) * 1.5;
      for (const o of obstacles) score += overlap(box, o) * 10;
      score += overlap(box, engine) * 0.5;
      // The label must not sit on its own dot.
      if (A.x > box.l - 10 && A.x < box.r + 10 && A.y > box.t - 10 && A.y < box.b + 10) score += 1e6;
      if (!best || score < best.score) best = { x, y, score };
    });
    const x = Math.round(best!.x);
    const y = Math.round(best!.y);
    callout!.style.transform = `translate(${x}px, ${y}px)`;

    // Leader: a short stub out of the label's nearest edge, then straight to the dot.
    let d: string;
    if (x + bw <= A.x || x >= A.x) {
      const left = x + bw <= A.x;
      const px = left ? x + bw : x;
      const py = y + bh / 2;
      const stub = Math.min(20, Math.abs(A.x - px) * 0.4) * (left ? 1 : -1);
      d = `M${px} ${py}H${px + stub}L${A.x} ${A.y}`;
    } else {
      const px = clamp(A.x, x + 24, x + bw - 24);
      const above = y + bh <= A.y;
      const py = above ? y + bh : y;
      const stub = Math.min(14, Math.abs(A.y - py) * 0.4) * (above ? 1 : -1);
      d = `M${px} ${py}V${py + stub}L${A.x} ${A.y}`;
    }
    if (lines) lines.setAttribute("viewBox", `0 0 ${W} ${Hh}`);
    leaders.forEach((l) => l.setAttribute("d", d));
    if (dot) dot.setAttribute("transform", `translate(${A.x} ${A.y})`);
    stageBox.classList.add("is-callout-ready");
  }

  /* ---------------------------------------------------------------- posters (no WebGL) */

  function showPosterStop() {
    if (!poster) {
      placeCallout();
      return;
    }
    const f = posterFiles(families[family].key, STOPS[family]);
    const swap = () => {
      poster.srcset = `${f.wide800} 800w, ${f.wide1600} 1600w`;
      poster.src = f.wide1600;
      if (posterTall) posterTall.srcset = f.tall800;
    };
    if (poster.currentSrc && poster.currentSrc.includes(`-${STOPS[family]}-`)) {
      placeCallout();
      return;
    }
    stageBox.classList.add("is-swapping");
    setMoving(true);
    const done = () => {
      stageBox.classList.remove("is-swapping");
      setMoving(false);
    };
    poster.addEventListener("load", done, { once: true });
    poster.addEventListener("error", done, { once: true });
    swap();
  }

  /* ---------------------------------------------------------------- input: tabs and buttons */

  on(tablist, "keydown", (e: KeyboardEvent) => {
    if (busy()) return;
    const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    const moves: Record<string, [number, number]> = {
      ArrowRight: [i + 1, 1],
      ArrowLeft: [i - 1, -1],
      Home: [0, 0],
      End: [tabs.length - 1, 0],
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    const n = mod(move[0], tabs.length);
    tabs[n].focus();
    select(n, "tab", move[1]);
  });
  tabs.forEach((t, i) =>
    on(t, "click", () => {
      if (busy() || i === family) return;
      const d = mod(i - family, 4);
      select(i, "tab", d === 1 ? 1 : d === 3 ? -1 : 0);
    }),
  );
  if (prevBtn) on(prevBtn, "click", () => !busy() && select(family - 1, "button", -1));
  if (nextBtn) on(nextBtn, "click", () => !busy() && select(family + 1, "button", 1));

  on(callout, "click", () => {
    if (busy()) return;
    root.dispatchEvent(new CustomEvent("pv:request", { detail: { family, from: callout } }));
  });

  on(root, "pv:draft", (e: Event) => {
    const detail = (e as CustomEvent<{ total?: number }>).detail;
    draftTotal = Number(detail?.total) || 0;
    renderLabels();
    if (!moving) placeCallout();
  });

  /* ---------------------------------------------------------------- input: page arrow keys */

  const WIDGET_ROLES = /^(radiogroup|radio|slider|spinbutton|listbox|option|combobox|menu|menuitem|menubar|grid|tree|treegrid|tablist|tab|textbox|searchbox|scrollbar)$/;
  const keyAllowed = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return false;
    if (busy() || !halfInView) return false;
    if (document.documentElement.classList.contains("is-menu-open")) return false;
    if (document.querySelector("dialog[open]")) return false;
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body || el === document.documentElement) return true;
    if (!root.contains(el)) return false;
    if (el.matches("input, select, textarea, [contenteditable=''], [contenteditable='true']")) return false;
    const role = el.getAttribute("role");
    if (role && WIDGET_ROLES.test(role)) return false;
    return true;
  };
  on(document, "keydown", (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (!keyAllowed(e)) return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    select(family + dir, "key", dir);
  });

  /* ---------------------------------------------------------------- input: drag */

  let dragging = false;
  let pointerId = -1;
  let startX = 0;
  let startY = 0;
  let startAz = 0;
  let lastX = 0;
  let lastT = 0;
  let vel = 0; // degrees per ms
  let suppressClick = false;
  let pending = false;

  const surface = stageBox;
  const isControl = (t: EventTarget | null) =>
    t instanceof Element && !!t.closest("button, a, [data-pv-bar], [data-pv-callout], dialog");

  on(surface, "pointerdown", (e: PointerEvent) => {
    if (busy() || (mode === "gl" && !stage) || e.button !== 0 || isControl(e.target)) return;
    pending = true;
    pointerId = e.pointerId;
    startX = lastX = e.clientX;
    startY = e.clientY;
    lastT = e.timeStamp;
    vel = 0;
  });
  on(surface, "pointermove", (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return;
    if (pending && !dragging) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dy) > DRAG_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
        pending = false; // a vertical swipe: the page scrolls (touch-action: pan-y)
        pointerId = -1;
        return;
      }
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      if (busy()) return;
      dragging = true;
      pending = false;
      startAz = az;
      startX = e.clientX;
      anim = null;
      try {
        surface.setPointerCapture(e.pointerId);
      } catch {}
      stageBox.classList.add("is-dragging");
      setMoving(true);
    }
    if (!dragging) return;
    if (mode === "poster") {
      lastX = e.clientX;
      return;
    }
    const dt = Math.max(1, e.timeStamp - lastT);
    const dAz = -(e.clientX - lastX) * DEG_PER_PX;
    vel = vel * 0.6 + (dAz / dt) * 0.4;
    lastX = e.clientX;
    lastT = e.timeStamp;
    // Dragging left turns the camera forward (towards the next family), as a swipe to "next".
    az = startAz - (e.clientX - startX) * DEG_PER_PX;
    dirty = true;
    kick();
  });
  const endDrag = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return;
    pending = false;
    pointerId = -1;
    if (!dragging) return;
    dragging = false;
    suppressClick = true;
    window.setTimeout(() => (suppressClick = false), 0);
    stageBox.classList.remove("is-dragging");
    if (mode === "poster") {
      // Without WebGL a swipe steps to the next or previous family's poster.
      const dx = lastX - startX;
      if (Math.abs(dx) > 48) select(family + (dx < 0 ? 1 : -1), "drag", dx < 0 ? 1 : -1);
      else setMoving(false);
      return;
    }
    // Settle on the nearest stop, nudged by a flick.
    const projected = az + clamp(vel * 140, -60, 60);
    const k = Math.round((projected - 45) / 90);
    const to = 45 + k * 90;
    select(mod(k, 4), "drag", 0, false);
    if (reduced()) {
      anim = null;
      az = to;
      settle();
      return;
    }
    const delta = Math.abs(to - az);
    anim = { from: az, to, v0: 0, t0: performance.now(), dur: clamp((delta / 90) * MAX_TURN_MS, 160, MAX_TURN_MS) };
    kick();
  };
  on(surface, "pointerup", endDrag);
  on(surface, "pointercancel", endDrag);
  on(
    surface,
    "click",
    (e: MouseEvent) => {
      if (suppressClick) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    { capture: true },
  );

  /* ---------------------------------------------------------------- visibility */

  let firstFrame = false;
  function onFirstFrame() {
    firstFrame = true;
    stageBox.classList.add("is-live");
    root.dataset.pvMode = "gl";
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        inView = en.isIntersecting;
        halfInView = en.intersectionRatio >= 0.5;
      }
      if (inView) {
        dirty = true;
        kick();
      }
    },
    { threshold: [0, 0.5, 1] },
  );
  io.observe(stageBox);
  cleanups.push(() => io.disconnect());

  /* ---------------------------------------------------------------- WebGL start */

  const sizeStage = () => {
    if (!stage) return;
    const w = stageBox.clientWidth;
    const h = stageBox.clientHeight;
    const coarse = window.matchMedia("(pointer: coarse)").matches || w < 700;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    stage.setSize(w, h, dpr, insets());
    dirty = true;
    kick();
  };

  const ro = new ResizeObserver(() => {
    movePill(false);
    if (stage) sizeStage();
    else if (!moving) placeCallout();
  });
  ro.observe(stageBox);
  cleanups.push(() => ro.disconnect());

  const fallback = () => {
    mode = "poster";
    root.dataset.pvMode = "poster";
    stageBox.classList.remove("is-live");
    if (stage) {
      try {
        stage.dispose();
      } catch {}
      stage = null;
    }
    glHost?.replaceChildren();
    showPosterStop();
  };

  const saveData = !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const allowSoftware = window.__pvAllowSoftwareGL === true;

  const startGL = async () => {
    if (disposed || stage || !glHost) return;
    try {
      const mod3d = await import("./scene");
      if (disposed) return;
      if (!mod3d.canRenderWebGL(allowSoftware)) {
        fallback();
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.className = "c-pv__canvas";
      canvas.setAttribute("aria-hidden", "true");
      glHost.appendChild(canvas);
      stage = mod3d.createEngineStage(canvas, mod3d.readPalette(root), { allowSoftware });
      mode = "gl";
      canvas.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        fallback();
      });
      az = STOPS[family];
      sizeStage();
    } catch {
      fallback();
    }
  };

  if (saveData || !glHost) {
    root.dataset.pvMode = "poster";
  } else {
    // Start when the stage is near the viewport; the poster covers the wait.
    const near = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          near.disconnect();
          void startGL();
        }
      },
      { rootMargin: "400px 0px" },
    );
    near.observe(stageBox);
    cleanups.push(() => near.disconnect());
  }

  /* ---------------------------------------------------------------- start */

  select(family, "init");
  pillReady = true;
  root.classList.add("is-mounted");
  if (poster && !poster.complete) poster.addEventListener("load", () => mode === "poster" && placeCallout(), { once: true });
  placeCallout();
  const onMq = () => {
    if (reduced()) anim = null;
  };
  reducedMq.addEventListener("change", onMq);
  cleanups.push(() => reducedMq.removeEventListener("change", onMq));

  return () => {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    cleanups.forEach((fn) => fn());
    stage?.dispose();
    stage = null;
    glHost?.replaceChildren();
    root.classList.remove("is-mounted");
  };
}
