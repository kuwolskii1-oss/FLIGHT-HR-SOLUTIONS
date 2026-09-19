import { ArrowRight, ArrowUpRight } from "./Icons";
import { SmartLink } from "./SmartLink";

/* Each call to action is its own component with its own interaction identity (design brief). */

export function CtaTalk({ href, label, small }: { href: string; label: string; small?: boolean }) {
  return (
    <SmartLink href={href} className={`c-cta-talk${small ? " c-cta-talk--small" : ""}`}>
      <span>{label}</span>
      <ArrowRight className="c-cta-talk__arrow" width={18} height={18} />
    </SmartLink>
  );
}

export function CtaLink({ href, label, light }: { href: string; label: string; light?: boolean }) {
  const external = /^https?:/i.test(href);
  return (
    <SmartLink href={href} className={`c-cta-link${light ? " c-cta-link--light" : ""}`}>
      <span>{label}</span>
      {external ? (
        <ArrowUpRight className="c-cta-link__arrow" width={18} height={18} />
      ) : (
        <ArrowRight className="c-cta-link__arrow" width={18} height={18} />
      )}
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
