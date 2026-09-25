/**
 * The group as a route: Zug to South Africa, the dashed track drawn solid by the act's scroll
 * progress (--sc-p), the destination ringed. Decorative; the section text states the facts.
 */
export function GroupRoute() {
  const d = "M70 54 C 250 96, 330 250, 262 382";
  return (
    <div className="c-groute" aria-hidden="true">
      <svg viewBox="0 0 360 440" focusable="false">
        <path className="c-groute__track" d={d} />
        <path className="c-groute__trail" d={d} pathLength="1000" />
        <circle className="c-groute__from" cx="70" cy="54" r="8" />
        <circle className="c-groute__halo" cx="262" cy="382" r="20" />
        <circle className="c-groute__to" cx="262" cy="382" r="8" />
      </svg>
      <span className="c-groute__label c-groute__label--from">Zug, Switzerland</span>
      <span className="c-groute__label c-groute__label--to">South Africa</span>
    </div>
  );
}
