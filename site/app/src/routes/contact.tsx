import { createFileRoute } from "@tanstack/react-router";
import { PageMotion } from "@/components/site/PageMotion";

import { StructuredData } from "@/components/StructuredData";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageIntro } from "@/components/site/PageIntro";
import { Section } from "@/components/site/Section";
import { SITE_URL } from "@/site/config";
import { contact, site } from "@/site/content";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/contact")({
  head: () => pageHead({ title: contact.seoTitle.replace(/\s*\|\s*Flight Hour Solution$/i, ""), description: contact.metaDescription, path: "/contact" }),
  component: ContactPage,
});

const SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: `${SITE_URL}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: site.company.legalName,
    telephone: site.company.phone,
    email: site.company.email,
    contactPoint: [{ "@type": "ContactPoint", contactType: "sales", telephone: site.company.phone, email: site.company.email, availableLanguage: ["en"] }],
  },
});

function ContactPage() {
  return (
    <main id="main" tabIndex={-1}>
      <StructuredData json={SCHEMA} />
      <PageIntro eyebrow="Contact" title={contact.title} lead={contact.intro} />
      <Section theme="light" id="workscope">
        <div className="c-split">
          <div className="c-split__aside c-split__aside--sticky c-stack c-stack--loose">
            <div>
              <h2 id="enquiry-title" className="c-h2">
                {contact.form.title}
              </h2>
            </div>
            <ul className="c-person__channels" aria-label="Direct channels">
              {contact.channels.map((c) => (
                <li key={c.label}>
                  <span className="c-muted">{c.label}: </span>
                  <a href={c.href} {...(/^https?:/.test(c.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {c.value}
                  </a>
                  {c.note ? <span className="c-muted"> ({c.note})</span> : null}
                </li>
              ))}
            </ul>
            {contact.urgent ? (
              <div className="c-notice">
                <p className="c-list__title">{contact.urgent.title}</p>
                <p style={{ marginTop: "0.25rem" }}>{contact.urgent.text}</p>
              </div>
            ) : null}
            {contact.office ? (
              <address style={{ fontStyle: "normal" }} className="c-body c-muted">
                <span className="c-list__title" style={{ color: "var(--fg)" }}>
                  {contact.office.title}
                </span>
                {contact.office.lines.map((l, i) => (
                  <span key={i} style={{ display: "block" }}>
                    {l}
                  </span>
                ))}
              </address>
            ) : null}
          </div>
          <div className="c-split__main">
            <EnquiryForm form={contact.form} id="enquiry" />
          </div>
        </div>
      </Section>
      <PageMotion />
    </main>
  );
}
