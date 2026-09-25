import { useId, useState } from "react";
import { Chevron } from "./Icons";

/** One disclosure: header button and a panel that grows with grid rows (transitions.dev accordion). */
export function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="c-acc t-acc" data-open={open}>
      <h3 className="c-acc__head">
        <button type="button" className="c-acc__button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
          <span>{title}</span>
          <span className="t-acc-chevron c-acc__chevron">
            <Chevron width={18} height={18} />
          </span>
        </button>
      </h3>
      <div className="t-acc-panel" id={id}>
        <div className="t-acc-panel-inner">
          <div className="c-acc__body">{children}</div>
        </div>
      </div>
    </div>
  );
}
