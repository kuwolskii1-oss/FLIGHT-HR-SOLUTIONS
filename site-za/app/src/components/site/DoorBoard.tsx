import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Pictogram, PictoTile, type PictogramName } from "./Pictogram";
import { SmartLink } from "./SmartLink";

/**
 * The doors as a departure board: a navy panel of big rows, one per door. Adapted from the
 * Sterling Gate kinetic navigation the client supplied (src/components/ui/): the list look, the
 * CustomEase "main" curve, the hover fill and the ambient shapes that pop in behind the hovered
 * item. Here the shapes are drawn from each door's world (an engine face, contrails, a parts rack,
 * a route, a chart), the fill is the action orange, and the same choreography runs on keyboard
 * focus. Fine pointers only; touch devices get the static board, reduced motion gets the end
 * state without the travel. Durations stay inside the brief's 600 ms and 80 ms stagger caps.
 */
export type BoardItem = {
  key: string;
  href: string;
  title: string;
  text: string;
  meta?: string;
  picto: PictogramName;
  shape: ShapeKind;
};
export type ShapeKind = "fan" | "contrail" | "rack" | "route" | "chart";

export function DoorBoard({
  items,
  headingLevel = 3,
}: {
  items: BoardItem[];
  headingLevel?: 2 | 3;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const Heading = headingLevel === 2 ? "h2" : "h3";

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(CustomEase);
    const EASE = "fhs-board";
    if (!gsap.parseEase(EASE)) CustomEase.create(EASE, "0.65, 0.01, 0.05, 0.99");
    const off: (() => void)[] = [];
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>(".c-board__item").forEach((item) => {
        const fill = item.querySelector(".c-board__fill");
        const els = item.querySelectorAll(".c-board__el");
        const rolls = item.querySelectorAll(".c-roll__line");
        const go = item.querySelector(".c-board__go .c-picto");
        const t = (s: number) => (reduce ? 0 : s);
        const enter = () => {
          item.classList.add("is-active");
          gsap.set(fill, { transformOrigin: "left center" });
          gsap.to(fill, { scaleX: 1, duration: t(0.5), ease: EASE, overwrite: "auto" });
          gsap.to(rolls, { yPercent: -100, duration: t(0.45), ease: EASE, overwrite: "auto" });
          gsap.to(go, { x: 0, duration: t(0.35), ease: "power3.out", overwrite: "auto" });
          gsap.fromTo(
            els,
            { scale: 0.6, opacity: 0, rotation: -8, transformOrigin: "50% 50%" },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: t(0.5),
              stagger: t(0.06),
              delay: t(0.08),
              ease: "power3.out",
              overwrite: "auto",
            },
          );
        };
        const leave = () => {
          item.classList.remove("is-active");
          gsap.set(fill, { transformOrigin: "right center" });
          gsap.to(fill, { scaleX: 0, duration: t(0.4), ease: EASE, overwrite: "auto" });
          gsap.to(rolls, { yPercent: 0, duration: t(0.35), ease: EASE, overwrite: "auto" });
          gsap.to(els, {
            scale: 0.85,
            opacity: 0,
            duration: t(0.25),
            ease: "power2.in",
            overwrite: "auto",
          });
        };
        const onFocusIn = (e: FocusEvent) => {
          if ((e.target as HTMLElement).matches(":focus-visible")) enter();
        };
        item.addEventListener("pointerenter", enter);
        item.addEventListener("pointerleave", leave);
        item.addEventListener("focusin", onFocusIn);
        item.addEventListener("focusout", leave);
        off.push(() => {
          item.removeEventListener("pointerenter", enter);
          item.removeEventListener("pointerleave", leave);
          item.removeEventListener("focusin", onFocusIn);
          item.removeEventListener("focusout", leave);
        });
      });
    }, root);
    root.classList.add("is-kinetic");
    return () => {
      off.forEach((f) => f());
      ctx.revert();
      root.classList.remove("is-kinetic");
    };
  }, []);

  return (
    <ul ref={ref} className="c-board" data-theme="light" data-sc-in data-sc-stagger="70">
      {items.map((d) => (
        <li className="c-board__item" key={d.key}>
          <span className="c-board__fill" aria-hidden="true" />
          <BoardShape kind={d.shape} picto={d.picto} />
          <PictoTile name={d.picto} className="c-board__tile" />
          <Heading className="c-board__title">
            <SmartLink href={d.href}>
              <span className="c-roll">
                <span className="c-roll__line">{d.title}</span>
                <span className="c-roll__line" aria-hidden="true">
                  {d.title}
                </span>
              </span>
            </SmartLink>
          </Heading>
          <p className="c-board__text">{d.text}</p>
          {d.meta ? (
            <p className="c-board__meta">
              <Pictogram name="clock" size={18} />
              <span>{d.meta}</span>
            </p>
          ) : null}
          <span className="c-board__go" aria-hidden="true">
            {/* Guidance draws "left-arrow" pointing right: it is the forward arrow. */}
            <Pictogram name="left-arrow" size={22} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Each door's ambient shape: a few primitive elements that pop in, staggered, on the fill. */
function BoardShape({ kind, picto }: { kind: ShapeKind; picto: PictogramName }) {
  return (
    <svg
      className="c-board__shape"
      viewBox="0 0 420 200"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMaxYMid meet"
    >
      {kind === "fan" ? (
        <g transform="translate(300 100)">
          <circle className="c-board__el" r="92" />
          <circle className="c-board__el" r="64" />
          {Array.from({ length: 12 }, (_, i) => (
            <g key={i} className="c-board__el">
              <path d="M0 -22 C 14 -40 18 -64 10 -88" transform={`rotate(${i * 30})`} />
            </g>
          ))}
          <circle className="c-board__el c-board__el--solid" r="18" />
        </g>
      ) : null}
      {kind === "contrail" ? (
        <g>
          <path className="c-board__el" d="M20 176 L300 36" />
          <path className="c-board__el" d="M60 190 L316 62" />
          <path className="c-board__el c-board__el--dash" d="M110 196 L330 86" />
          <g className="c-board__el">
            <g transform="translate(304 8) scale(4.6)">
              <PictogramBody name={picto} />
            </g>
          </g>
        </g>
      ) : null}
      {kind === "rack" ? (
        <g>
          {Array.from({ length: 12 }, (_, i) => (
            <rect
              key={i}
              className="c-board__el"
              x={196 + (i % 4) * 52}
              y={22 + Math.floor(i / 4) * 54}
              width="40"
              height="40"
              rx="8"
            />
          ))}
        </g>
      ) : null}
      {kind === "route" ? (
        <g>
          <path className="c-board__el c-board__el--dash" d="M40 170 C 140 20, 300 20, 392 120" />
          <circle className="c-board__el c-board__el--solid" cx="40" cy="170" r="9" />
          <circle className="c-board__el" cx="392" cy="120" r="16" />
          <circle className="c-board__el c-board__el--solid" cx="392" cy="120" r="6" />
        </g>
      ) : null}
      {kind === "chart" ? (
        <g>
          <rect className="c-board__el" x="200" y="130" width="34" height="56" rx="6" />
          <rect className="c-board__el" x="250" y="100" width="34" height="86" rx="6" />
          <rect className="c-board__el" x="300" y="64" width="34" height="122" rx="6" />
          <rect className="c-board__el" x="350" y="24" width="34" height="162" rx="6" />
          <path className="c-board__el" d="M180 150 L236 116 L286 92 L336 52 L400 14" />
        </g>
      ) : null}
    </svg>
  );
}

/** A pictogram's paths inside another SVG (no nested <svg>, so it scales with the group). */
function PictogramBody({ name }: { name: PictogramName }) {
  return <Pictogram name={name} size={24} className="c-board__picto" />;
}
