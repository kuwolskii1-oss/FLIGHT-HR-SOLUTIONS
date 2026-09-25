import { ArrowRight, ArrowUpRight, LearnChevron, WhatsApp } from "./Icons";
import { SmartLink } from "./SmartLink";

/* Each call to action is its own component with its own interaction identity. */

export function CtaTalk({ href, label, small }: { href: string; label: string; small?: boolean }) {
  return (
    <SmartLink href={href} className={`c-cta-talk${small ? " c-cta-talk--small" : ""}`}>
      <span>{label}</span>
      <ArrowRight className="c-cta-talk__arrow" width={18} height={18} />
    </SmartLink>
  );
}

/** The urgent action: WhatsApp for AOG. Links to the contact page's urgent block until the number exists. */
export function CtaUrgent({ href, label, small }: { href: string; label: string; small?: boolean }) {
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
      {external ? <ArrowUpRight className="c-cta-link__arrow" width={16} height={16} /> : <span className="t-learn-chevron c-cta-link__arrow"><LearnChevron /></span>}
    </SmartLink>
  );
}

export function CtaClosing({ href, label }: { href: string; label: string }) {
  return (
    <SmartLink href={href} className="c-cta-closing">
      {label}
    </SmartLink>
  );
}

export function CtaSubmit({ label, busy }: { label: string; busy?: boolean }) {
  return (
    <button type="submit" className="c-cta-submit" disabled={busy} aria-busy={busy || undefined}>
      <span>{busy ? "Sending" : label}</span>
      <ArrowRight width={20} height={20} />
    </button>
  );
}
