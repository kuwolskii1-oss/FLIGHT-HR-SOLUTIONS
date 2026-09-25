import { CtaClosing, CtaLink } from "./Cta";

/** The closing band: one headline, one button (the primary action) and the urgent action as a plain link beside it. On pages whose main action is a form, linkOnly keeps the submit button the only button on the page. */
export function ClosingBand({ headline, sub, primary, urgent, linkOnly }: { headline: string; sub?: string; primary: { label: string; href: string }; urgent?: { label: string; href: string }; linkOnly?: boolean }) {
  return (
    <section className="c-band" data-theme="dark" data-sc-act="flow" aria-labelledby="closing-title">
      <div className="o-container" data-sc-in data-sc-stagger="60">
        <h2 id="closing-title" className="c-band__title">
          {headline}
        </h2>
        {sub ? <p className="c-band__text">{sub}</p> : null}
        <div className="c-band__actions c-cta-row">
          {linkOnly ? <CtaLink href={primary.href} label={primary.label} light /> : <CtaClosing href={primary.href} label={primary.label} />}
          {urgent ? <CtaLink href={urgent.href} label={urgent.label} light /> : null}
        </div>
      </div>
    </section>
  );
}
