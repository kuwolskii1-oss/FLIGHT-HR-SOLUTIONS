import { useEffect, useId, useRef, type CSSProperties } from "react";

/**
 * Spinning counter, adapted from transitions.dev ("Spinning counter"): each digit is a clipped
 * reel that turns once and lands, reel by reel, the way a departure board settles. The reels draw
 * their digits with CSS generated content, so the page holds the number once, as real text, for
 * screen readers, copying and search; the reels themselves are aria-hidden.
 *
 * It is server-rendered at rest on the true digits, and the turn starts from the digit it lands
 * on, so the right number shows before scripts run, without scripts and under reduced motion (no
 * turn at all). Timing stays inside the brief's caps: 560 ms per reel and 60 ms between reels,
 * where the original runs 1400 ms and 90 ms. The motion blur is vertical only (an SVG
 * feGaussianBlur with stdDeviation "0 y"; CSS blur() would smear sideways) and fades as each reel
 * slows. The preview runtime (site-za/tools/preview/runtime.js) ports the same turn.
 */
export const REEL_DUR = 560;
export const REEL_STAGGER = 60;
const REEL_BLUR = 3;

export function Reel({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const uid = `reel${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  // Digits become reels; everything between them stays one run of text.
  const parts = value.match(/\d|\D+/g) ?? [value];
  const reels = parts.filter((p) => /^\d$/.test(p)).length;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const strips = Array.from(root.querySelectorAll<HTMLElement>(".c-reel__strip"));
    const blurs = Array.from(root.querySelectorAll<SVGFEGaussianBlurElement>("feGaussianBlur"));
    let raf = 0;
    let cancelled = false;
    const spin = () => {
      if (cancelled) return;
      strips.forEach((s, i) => {
        s.style.filter = `url(#${uid}-${i})`;
        s.style.transition = `transform ${REEL_DUR}ms cubic-bezier(0.16, 1, 0.3, 1) ${i * REEL_STAGGER}ms`;
        s.classList.add("is-landed");
      });
      const start = performance.now();
      const tick = (now: number) => {
        let running = false;
        blurs.forEach((b, i) => {
          const t = (now - start - i * REEL_STAGGER) / REEL_DUR;
          const y = t <= 0 || t >= 1 ? 0 : REEL_BLUR * (1 - t) * (1 - t);
          b.setAttribute("stdDeviation", `0 ${y.toFixed(2)}`);
          if (t < 1) running = true;
        });
        if (running) raf = requestAnimationFrame(tick);
        else strips.forEach((s) => (s.style.filter = ""));
      };
      raf = requestAnimationFrame(tick);
    };
    // Turn once the number is on screen, after the fonts settle so the cells line up.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        void document.fonts.ready.then(() => requestAnimationFrame(spin));
      },
      { threshold: 0.6 },
    );
    io.observe(root);
    return () => {
      cancelled = true;
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [uid]);

  return (
    <span ref={ref} className={`c-reel ${className}`.trim()}>
      <span className="u-visually-hidden">{value}</span>
      <span className="c-reel__face" aria-hidden="true">
        {parts.map((p, i) =>
          /^\d$/.test(p) ? (
            <span className="c-reel__col" key={i} style={{ ["--d" as string]: p } as CSSProperties}>
              <span className="c-reel__strip" />
            </span>
          ) : (
            <span className="c-reel__run" key={i}>
              {p}
            </span>
          ),
        )}
      </span>
      <svg className="c-reel__defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          {Array.from({ length: reels }, (_, i) => (
            <filter id={`${uid}-${i}`} key={i} x="0" y="-50%" width="100%" height="200%">
              <feGaussianBlur stdDeviation="0 0" />
            </filter>
          ))}
        </defs>
      </svg>
    </span>
  );
}
