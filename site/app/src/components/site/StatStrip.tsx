import type { Stat } from "@/site/types";

export function StatStrip({ stats, showSource }: { stats: Stat[]; showSource?: boolean }) {
  return (
    <dl className="c-stat-strip" data-reveal-group>
      {stats.map((s) => (
        <div className="c-stat" key={s.label}>
          <dd className="c-stat__value u-tnum">
            {s.value}
            {s.unit ? <span className="c-stat__unit">{s.unit}</span> : null}
          </dd>
          <dt className="c-stat__label">{s.label}</dt>
          {showSource && s.source ? <p className="c-stat__source">{s.source}</p> : null}
        </div>
      ))}
    </dl>
  );
}
