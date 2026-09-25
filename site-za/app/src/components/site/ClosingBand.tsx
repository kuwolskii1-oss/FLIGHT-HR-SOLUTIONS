import paths from "@/site/ident-paths.json";
import { CtaClosing, CtaLink } from "./Cta";

/**
 * The closing band: one headline, one button (the primary action) and the urgent action as a plain
 * link beside it. On pages whose main action is a form, linkOnly keeps the submit button the only
 * button on the page. Behind the words, the logo's swoosh drifts at a slower rate than the page
 * (the engine's parallax, flattened under reduced motion): the flight path the hero drew, one last
 * time before the footer.
 */
export function ClosingBand({
  headline,
  sub,
  primary,
  urgent,
  linkOnly,
}: {
  headline: string;
  sub?: string;
  primary: { label: string; href: string };
  urgent?: { label: string; href: string };
  linkOnly?: boolean;
}) {
  return (
    <section
      className="c-band"
      data-theme="light"
      data-sc-act="flow"
      aria-labelledby="closing-title"
    >
      <div className="c-band__mark" data-sc-parallax="-0.14" aria-hidden="true">
        <svg viewBox={paths.viewBox} focusable="false">
          <path d={paths.swoosh} />
        </svg>
      </div>
      <div className="o-container c-band__inner" data-sc-in data-sc-stagger="60">
        <h2 id="closing-title" className="c-band__title">
          {headline}
        </h2>
        {sub ? <p className="c-band__text">{sub}</p> : null}
        <div className="c-band__actions c-cta-row">
          {linkOnly ? (
            <CtaLink href={primary.href} label={primary.label} />
          ) : (
            <CtaClosing href={primary.href} label={primary.label} />
          )}
          {urgent ? <CtaLink href={urgent.href} label={urgent.label} /> : null}
        </div>
      </div>
    </section>
  );
}
