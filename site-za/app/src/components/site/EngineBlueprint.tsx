import { useEffect, useRef } from "react";
import { imageSources } from "@/site/images";

/** Where the lens rests, as a share of the drawing: over the fan. */
const REST = { x: 0.19, y: 0.5 };
/** How far each frame closes on the pointer: the lens trails a little, the label less. */
const LENS_FOLLOW = 0.2;
const TAG_FOLLOW = 0.35;
/** The label sits below and to the right of the pointer, clear of the arrow. */
const TAG_OFFSET = { x: 16, y: 20 };

/**
 * Engine 360 as a drawing still on the board (e360.css): the engine's cross-section on its own
 * blueprint ground, under a lens that turns the lines beneath it orange. The lens rests on the fan.
 * With a mouse or trackpad over the card it follows the pointer, and an "Early access" label grows
 * out of the cursor and hovers beside it; when the pointer leaves, the label shrinks back and the
 * lens returns to the fan. Touch screens get the resting lens and no label.
 *
 * The lens is a window, not a mask that moves: the lens box and the lit copy of the drawing inside
 * it move in opposite directions by transform, so following the pointer costs no repaint. The
 * section's words carry the meaning (its badge says Early access too), so all of this is hidden
 * from assistive technology.
 */
export function EngineBlueprint({ label }: { label: string }) {
  const artRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const litRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const art = artRef.current;
    const lens = lensRef.current;
    const lit = litRef.current;
    const tag = tagRef.current;
    // The card, not the whole section: the section's white margins do not read as Engine 360.
    const card = art?.parentElement;
    if (!art || !lens || !lit || !tag || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let w = 0;
    let h = 0;
    // lens position and target, in the drawing's pixels; label position and target, in the viewport's
    let lx = 0;
    let ly = 0;
    let lxTo = 0;
    let lyTo = 0;
    let tx = 0;
    let ty = 0;
    let txTo = 0;
    let tyTo = 0;
    let px = 0;
    let py = 0;
    let inside = false;
    let raf = 0;

    const paint = () => {
      lens.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      lit.style.transform = `translate3d(${-lx}px, ${-ly}px, 0)`;
      tag.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    };
    const frame = () => {
      raf = 0;
      const snap = reduce.matches;
      lx += (lxTo - lx) * (snap ? 1 : LENS_FOLLOW);
      ly += (lyTo - ly) * (snap ? 1 : LENS_FOLLOW);
      tx += (txTo - tx) * (snap ? 1 : TAG_FOLLOW);
      ty += (tyTo - ty) * (snap ? 1 : TAG_FOLLOW);
      paint();
      const rest = Math.abs(lxTo - lx) + Math.abs(lyTo - ly) + Math.abs(txTo - tx) + Math.abs(tyTo - ty);
      if (rest > 0.4) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const aim = () => {
      const r = art.getBoundingClientRect();
      lxTo = px - r.left;
      lyTo = py - r.top;
      txTo = px + TAG_OFFSET.x;
      tyTo = py + TAG_OFFSET.y;
    };
    const home = () => {
      lxTo = w * REST.x;
      lyTo = h * REST.y;
    };
    const show = () => {
      inside = true;
      aim();
      // the label starts at the cursor, then grows (e360.css)
      tx = txTo;
      ty = tyTo;
      card.classList.add("is-peeking");
      kick();
    };
    const hide = () => {
      if (!inside) return;
      inside = false;
      card.classList.remove("is-peeking");
      home();
      kick();
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      show();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      if (!inside) {
        show();
        return;
      }
      aim();
      kick();
    };
    // The page can scroll under a still pointer: keep the lens and label on it, and let them go if
    // the card has moved out from under it.
    const onScroll = () => {
      if (!inside) return;
      const r = card.getBoundingClientRect();
      if (px < r.left || px > r.right || py < r.top || py > r.bottom) {
        hide();
        return;
      }
      aim();
      kick();
    };
    const measure = () => {
      w = art.clientWidth;
      h = art.clientHeight;
      if (inside) return;
      home();
      lx = lxTo;
      ly = lyTo;
      paint();
    };

    const ro = new ResizeObserver(measure);
    ro.observe(art);
    measure();
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", hide);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", hide);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      card.classList.remove("is-peeking");
    };
  }, []);

  const img = imageSources("cross-section");
  const drawing = (lit?: boolean) => (
    <img
      className={lit ? "c-e360__drawing c-e360__drawing--lit" : "c-e360__drawing"}
      // an inline reference, so the preview can rename the filter's id with the page's others
      style={lit ? { filter: "url(#e360-lit)" } : undefined}
      src={img.src}
      srcSet={img.srcSet}
      sizes="(min-width: 900px) 80vw, 170vw"
      width={1800}
      height={1018}
      alt=""
      loading="lazy"
      decoding="async"
    />
  );
  return (
    <>
      <div className="c-e360__art" ref={artRef} aria-hidden="true">
        {drawing()}
        <div className="c-e360__lens" ref={lensRef}>
          <div className="c-e360__lit" ref={litRef}>
            {drawing(true)}
          </div>
        </div>
        {/* The lens's colour: the drawing's navy ground stays put and its pale lines turn orange
            (per channel, ground to ground and line to orange; values from the image). */}
        <svg className="c-e360__filter" width="0" height="0" focusable="false">
          <filter id="e360-lit" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.187" intercept="-0.0007" />
              <feFuncG type="linear" slope="0.681" intercept="0.0313" />
              <feFuncB type="linear" slope="-0.0183" intercept="0.2678" />
            </feComponentTransfer>
          </filter>
        </svg>
      </div>
      <span className="c-peek" ref={tagRef} aria-hidden="true">
        <span className="c-peek__pill">{label}</span>
      </span>
    </>
  );
}
