import { CtaClosing, CtaLink } from "./Cta";
import { site } from "@/site/data/site";

/** The standard closing statement on inner pages: one headline, the two fixed calls to action. */
export function ClosingBand({ headline, sub }: { headline: string; sub?: string }) {
  return (
    <section data-theme="dark" className="c-band" aria-labelledby="closing-title">
      <div className="o-container">
        <h2 id="closing-title" className="c-band__title" data-split>
          {headline}
        </h2>
        {sub ? <p className="c-band__text">{sub}</p> : null}
        <div className="c-band__actions c-cta-row">
          <CtaClosing href={site.cta.primary.href} label={site.cta.primary.label} />
          <CtaLink href={site.cta.secondary.href} label={site.cta.secondary.label} light />
        </div>
      </div>
    </section>
  );
}
