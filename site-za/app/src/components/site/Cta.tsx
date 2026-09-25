import { LearnChevron, WhatsApp } from "./Icons";
import { Pictogram } from "./Pictogram";
import { SmartLink } from "./SmartLink";

/* Each call to action is its own component with its own interaction identity. The filled actions
 * share two small devices: the label rolls up to a second copy on hover (the copy is hidden from
 * assistive technology), and the arrow chip swaps one wayfinding arrow for the next. */

function Roll({ label }: { label: string }) {
  return (
    <span className="c-roll">
      <span className="c-roll__line">{label}</span>
      <span className="c-roll__line" aria-hidden="true">
        {label}
      </span>
    </span>
  );
}

/* Guidance draws "left-arrow" pointing right (its names follow the direction you walk away from),
 * so it is the forward arrow here. Do not swap it for "right-arrow". */
function Chip() {
  return (
    <span className="c-chip" aria-hidden="true">
      <Pictogram name="left-arrow" className="c-chip__a" />
      <Pictogram name="left-arrow" className="c-chip__b" />
    </span>
  );
}

export function CtaTalk({ href, label, small }: { href: string; label: string; small?: boolean }) {
  return (
    <SmartLink href={href} className={`c-cta-talk${small ? " c-cta-talk--small" : ""}`}>
      <Roll label={label} />
      <Chip />
    </SmartLink>
  );
}

/** The urgent action: WhatsApp for AOG. Links to the contact page's urgent block until the number exists. */
export function CtaUrgent({
  href,
  label,
  small,
}: {
  href: string;
  label: string;
  small?: boolean;
}) {
  return (
    <SmartLink href={href} className={`c-cta-urgent${small ? " c-cta-urgent--small" : ""}`}>
      <WhatsApp className="c-cta-urgent__icon" width={18} height={18} />
      <span>{label}</span>
    </SmartLink>
  );
}

export function CtaLink({ href, label, light }: { href: string; label: string; light?: boolean }) {
  const external = /^https?:/i.test(href);
  return (
    <SmartLink href={href} className={`c-cta-link t-learn${light ? " c-cta-link--light" : ""}`}>
      <span>{label}</span>
      {external ? (
        <Pictogram name="up-right-arrow" size={16} className="c-cta-link__arrow" />
      ) : (
        <span className="t-learn-chevron c-cta-link__arrow">
          <LearnChevron />
        </span>
      )}
    </SmartLink>
  );
}

export function CtaClosing({ href, label }: { href: string; label: string }) {
  return (
    <SmartLink href={href} className="c-cta-closing">
      <Roll label={label} />
      <Chip />
    </SmartLink>
  );
}

export function CtaSubmit({ label, busy }: { label: string; busy?: boolean }) {
  return (
    <button type="submit" className="c-cta-submit" disabled={busy} aria-busy={busy || undefined}>
      <Roll label={busy ? "Sending" : label} />
      <Chip />
    </button>
  );
}
