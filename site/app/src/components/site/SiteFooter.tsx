import { site } from "@/site/data/site";
import { SmartLink } from "./SmartLink";

const YEAR = new Date().getFullYear();

export function SiteFooter() {
  const { company, nav, memberships, footer } = site;
  const verified = memberships.filter((m) => m.status === "verified");
  return (
    <footer className="c-footer" data-theme="deep">
      <div className="o-container">
        <div className="c-footer__grid">
          <div className="c-footer__brand">
            <img src="/brand/logo-light.svg" alt={company.legalName} width={272} height={64} loading="lazy" decoding="async" />
            <address className="c-footer__address" style={{ marginTop: "var(--space-medium)" }}>
              {company.legalName}
              <br />
              {company.street}
              <br />
              {company.postalCode} {company.city}, {company.country}
            </address>
            <p className="c-footer__disclosure">{footer.disclosure}</p>
          </div>
          <div className="c-footer__col">
            <h2>Company</h2>
            <ul>
              {nav.primary.map((i) => (
                <li key={i.href}>
                  <SmartLink href={i.href}>{i.label}</SmartLink>
                </li>
              ))}
              {nav.secondary
                .filter((i) => !/impressum|privacy|cookies/.test(i.href))
                .map((i) => (
                  <li key={i.href}>
                    <SmartLink href={i.href}>{i.label}</SmartLink>
                  </li>
                ))}
            </ul>
          </div>
          <div className="c-footer__col">
            <h2>Contact</h2>
            <ul>
              <li>
                <a href={`tel:${company.phone}`}>{company.phoneDisplay}</a>
              </li>
              <li>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
              {company.whatsapp ? (
                <li>
                  <a href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {company.linkedin ? (
                <li>
                  <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          <div className="c-footer__col">
            <h2>Memberships</h2>
            <ul>
              {verified.map((m) => (
                <li key={m.name}>
                  {m.url ? (
                    <a href={m.url} target="_blank" rel="noopener noreferrer">
                      {m.name}
                    </a>
                  ) : (
                    m.name
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="c-footer__legal">
          <span>
            © {YEAR} {footer.legalLine}
          </span>
          {nav.secondary
            .filter((i) => /impressum|privacy|cookies/.test(i.href))
            .map((i) => (
              <SmartLink key={i.href} href={i.href}>
                {i.label}
              </SmartLink>
            ))}
          <span>EN · DE in preparation</span>
        </div>
      </div>
    </footer>
  );
}
