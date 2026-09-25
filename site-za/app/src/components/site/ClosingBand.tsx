import { CtaClosing, CtaUrgent } from "./Cta";

/** The closing band: one headline, the primary action, and the urgent action beside it. */
export function ClosingBand({ headline, sub, primary, urgent }: { headline: string; sub?: string; primary: { label: string; href: string }; urgent?: { label: string; href: string } }) {
  return (
    <section className="c-band" data-theme="dark" data-sc-act="flow" aria-labelledby="closing-title">
      <div className="o-container" data-sc-in data-sc-stagger="60">
        <h2 id="closing-title" className="c-band__title">
          {headline}
        </h2>
        {sub ? <p className="c-band__text">{sub}</p> : null}
        <div className="c-band__actions c-cta-row">
          <CtaClosing href={primary.href} label={primary.label} />
          {urgent ? <CtaUrgent href={urgent.href} label={urgent.label} /> : null}
        </div>
      </div>
    </section>
  );
}
