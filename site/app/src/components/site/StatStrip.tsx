import type { Stat } from "@/site/types";

/* A definition list: the label is the term, the figure and its source are the descriptions.
 * CSS reorders the stack visually (figure, label, source) without changing the reading order. */
export function StatStrip({ stats, showSource }: { stats: Stat[]; showSource?: boolean }) {
  return (
    <dl className="c-stat-strip" data-reveal-group>
      {stats.map((s) => (
        <div className="c-stat" key={s.label}>
          <dt className="c-stat__label">{s.label}</dt>
          <dd className="c-stat__value u-tnum">
            {s.value}
            {s.unit ? <span className="c-stat__unit">{s.unit}</span> : null}
          </dd>
          {showSource && s.source ? <dd className="c-stat__source">{s.source}</dd> : null}
        </div>
      ))}
    </dl>
  );
}
