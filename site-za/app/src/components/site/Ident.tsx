import { useEffect, useRef } from "react";
import paths from "@/site/ident-paths.json";

/**
 * The brand ident as a scroll-driven SVG. The swoosh is revealed along its centreline by a
 * clipped stroke whose dash offset is computed in CSS from the act's progress (--sc-p, published
 * by the scrollcraft engine on the nearest [data-sc-act]). The plane is moved to the point on the
 * centreline at that progress and turned to its tangent, by a small rAF loop that reads the same
 * custom property. At progress 1 the pair locks up into the logo. Under prefers-reduced-motion,
 * or when there is no act to read, the finished mark is shown and nothing moves.
 */
const N = 240;

export function Ident({ className = "", tone = "navy", title }: { className?: string; tone?: "navy" | "white"; title?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const plane = svg.querySelector<SVGPathElement>(".c-ident__plane");
    const centre = svg.querySelector<SVGPathElement>(".c-ident__centre");
    const act = svg.closest<HTMLElement>("[data-sc-act]");
    if (!plane || !centre) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !act) {
      svg.style.setProperty("--ident-p", "1");
      return;
    }
    // Look-up table of points and tangent angles along the centreline, measured once.
    const L = centre.getTotalLength();
    const pts: [number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const q = centre.getPointAtLength((L * i) / N);
      pts.push([q.x, q.y]);
    }
    const ang = pts.map((_, i) => {
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(N, i + 1)];
      return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
    });
    const rest = ang[N];
    const [ax, ay] = paths.end;
    let last = -1;
    let raf = 0;
    let visible = true;
    const place = (p: number) => {
      const f = Math.max(0, Math.min(1, p)) * N;
      const i = Math.floor(f);
      const j = Math.min(N, i + 1);
      const t = f - i;
      const x = pts[i][0] + (pts[j][0] - pts[i][0]) * t;
      const y = pts[i][1] + (pts[j][1] - pts[i][1]) * t;
      const a = ang[i] + (ang[j] - ang[i]) * t;
      plane.setAttribute("transform", `translate(${(x - ax).toFixed(2)} ${(y - ay).toFixed(2)}) rotate(${(a - rest).toFixed(2)} ${ax} ${ay})`);
    };
    const tick = () => {
      raf = 0;
      const v = parseFloat(act.style.getPropertyValue("--sc-p"));
      const p = Number.isFinite(v) ? v : 0;
      if (p !== last) {
        last = p;
        // A little of the trail is on screen from the first frame, so the plane never sits alone.
        const eff = 0.1 + 0.9 * Math.max(0, Math.min(1, p));
        svg.style.setProperty("--ident-p", eff.toFixed(4));
        place(eff);
      }
      if (visible) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(svg);
    place(0.1);
    svg.style.setProperty("--ident-p", "0.1");
    raf = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className={`c-ident c-ident--${tone} ${className}`.trim()}
      viewBox={paths.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <clipPath id="c-ident-swoosh">
          <path d={paths.swoosh} />
        </clipPath>
      </defs>
      <g clipPath="url(#c-ident-swoosh)">
        <path className="c-ident__trail" d={paths.centre} pathLength={1000} />
      </g>
      <path className="c-ident__centre" d={paths.centre} fill="none" stroke="none" />
      <path className="c-ident__plane" d={paths.plane} />
    </svg>
  );
}
