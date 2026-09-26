import { useEffect, useRef } from "react";

/**
 * A segmented control built from real radio inputs, so keyboard and screen readers get a
 * radio group, with the transitions.dev sliding pill behind the checked option. The inputs are
 * uncontrolled on purpose: a tap that lands before hydration still sticks.
 */
export function Segmented({
  name,
  idBase,
  options,
  value,
  onChange,
  invalid,
  describedBy,
  labelledBy,
}: {
  name: string;
  idBase: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  describedBy?: string;
  /** Id of the visible label that names the radio group. */
  labelledBy?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    const bar = ref.current;
    const pill = bar?.querySelector<HTMLElement>(".t-tabs-pill");
    if (!bar || !pill) return;
    const active = bar.querySelector<HTMLElement>(".t-tab:has(input:checked)");
    const move = (animate: boolean) => {
      if (!active) {
        pill.style.width = "0px";
        return;
      }
      const prev = pill.style.transition;
      if (!animate) pill.style.transition = "none";
      pill.style.transform = `translateX(${active.offsetLeft}px)`;
      pill.style.width = `${active.offsetWidth}px`;
      if (!animate) {
        void pill.offsetWidth;
        pill.style.transition = prev;
      }
    };
    move(!first.current);
    first.current = false;
    const onResize = () => move(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [value, options.length]);
  return (
    <div ref={ref} className={`c-segmented t-tabs${invalid ? " is-invalid" : ""}`} role="radiogroup" aria-labelledby={labelledBy} aria-describedby={describedBy} aria-invalid={invalid || undefined}>
      <span className="t-tabs-pill" aria-hidden="true" />
      {options.map((o, i) => (
        <label className="c-segmented__option t-tab" key={o}>
          <input type="radio" name={name} id={`${idBase}-${i}`} value={o} defaultChecked={value === o} onChange={() => onChange(o)} />
          <span>{o}</span>
        </label>
      ))}
    </div>
  );
}
