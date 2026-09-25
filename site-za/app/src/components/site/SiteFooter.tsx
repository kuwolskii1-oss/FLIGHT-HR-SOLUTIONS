import { site } from "@/site/data/site";
import { SmartLink } from "./SmartLink";

const YEAR = new Date().getFullYear();

export function SiteFooter() {
  const { company, footer, group, hours } = site;
  const held = footer.badges.filter((b) => b.status === "held");
  return (
    <footer className="c-footer" data-theme="deep">
      <div className="o-container">
        <div className="c-footer__grid">
          <div className="c-footer__brand">
            <img src="/brand/logo-light.svg" alt={company.legalName} width={272} height={64} loading="lazy" decoding="async" />
            <p className="c-footer__tagline">{company.tagline}</p>
            <address className="c-footer__address">
              {company.legalName}
              {company.address.map((line) => (
                <span key={line}>
                  <br />
                  {line}
                </span>
              ))}
              <br />
              {company.country}
            </address>
            <p className="c-footer__group">
              {group.line}.{" "}
              <a href={group.swiss.href} target="_blank" rel="noopener noreferrer">
                {group.swiss.label} site
              </a>
            </p>
          </div>
          {footer.groups.map((g) => (
            <div className="c-footer__col" key={g.title}>
              <h2>{g.title}</h2>
              <ul>
                {g.links.map((l) => (
                  <li key={l.href}>
                    <SmartLink href={l.href}>{l.label}</SmartLink>
                    {l.note ? <span className="c-badge c-badge--quiet">{l.note}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="c-footer__col">
            <h2>Contact</h2>
            <ul>
              <li>
                <a href={`mailto:${company.emails.general}`}>{company.emails.general}</a>
              </li>
              {company.phone ? (
                <li>
                  <a href={`tel:${company.phone}`}>{company.phoneDisplay}</a>
                </li>
              ) : null}
              {company.whatsapp ? (
                <li>
                  <a href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp {company.whatsappDisplay}
                  </a>
                </li>
              ) : null}
              {hours.aog ? <li>{hours.aog}</li> : null}
            </ul>
          </div>
        </div>
        {held.length ? (
          <ul className="c-footer__badges" aria-label="Accreditations">
            {held.map((b) => (
              <li key={b.name}>
                {b.name}
                {b.text ? `: ${b.text}` : ""}
              </li>
            ))}
          </ul>
        ) : null}
        <p className="c-footer__disclosure">{footer.disclaimer}</p>
        <div className="c-footer__legal">
          <span>
            © {YEAR} {footer.legalLine}
          </span>
          <SmartLink href="/privacy">Privacy notice</SmartLink>
          <SmartLink href="/legal">Legal</SmartLink>
        </div>
      </div>
    </footer>
  );
}
