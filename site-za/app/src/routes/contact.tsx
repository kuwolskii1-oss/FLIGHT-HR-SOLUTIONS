import { createFileRoute } from "@tanstack/react-router";
import { CtaUrgent } from "@/components/site/Cta";
import { DoorForm } from "@/components/site/DoorForm";
import { SmartLink } from "@/components/site/SmartLink";
import { ArrowRight } from "@/components/site/Icons";
import { contact } from "@/site/data/contact";
import { site } from "@/site/data/site";
import { pageHead } from "@/site/seo";
import { ScrollCraftMount } from "@/components/site/ScrollCraftMount";

export const Route = createFileRoute("/contact")({
  loader: () => ({ title: contact.seoTitle, description: contact.metaDescription }),
  head: ({ loaderData }) => pageHead({ title: loaderData?.title ?? "Contact", description: loaderData?.description ?? "", path: "/contact" }),
  component: Page,
});

function Page() {
  const { company, whatsappTemplates } = site;
  const wa = company.whatsapp ? `https://wa.me/${company.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsappTemplates.aog)}` : null;
  return (
    <main id="main" tabIndex={-1}>
      <header data-theme="dark" className="c-page-intro" data-sc-act="flow">
        <div className="o-container" data-sc-in data-sc-stagger="70">
          <span className="c-eyebrow">{site.nav.contact.label}</span>
          <h1 className="c-h1 c-h1--inner c-page-intro__title">{contact.title}</h1>
          <p className="c-lead c-page-intro__lead">{contact.intro}</p>
        </div>
      </header>

      <section data-theme="light" className="o-section" data-sc-act="flow" aria-labelledby="doors-title">
        <div className="o-container">
          <h2 id="doors-title" className="c-h2" style={{ marginBottom: "var(--space-medium)" }}>
            Pick your door
          </h2>
          <ul className="c-doors" data-sc-in data-sc-stagger="70">
            {contact.doors.map((d) => (
              <li className="c-door" key={d.href}>
                <h3 className="c-door__title">
                  <SmartLink href={d.href}>{d.label}</SmartLink>
                </h3>
                <p className="c-door__text">{d.text}</p>
                <ArrowRight className="c-door__arrow" width={22} height={22} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="urgent" data-theme="deep" className="o-section" data-sc-act="flow" aria-labelledby="urgent-title">
        <div className="o-container c-e360" data-sc-in data-sc-stagger="70">
          <div>
            <h2 id="urgent-title" className="c-h2">
              {contact.urgent.title}
            </h2>
            <p className="c-lead c-muted" style={{ marginTop: "var(--space-small)", maxWidth: "48ch" }}>
              {contact.urgent.text}
            </p>
            {contact.urgent.hours ? <p className="c-mono c-mono--caps c-muted" style={{ marginTop: "var(--space-small)" }}>{contact.urgent.hours}</p> : null}
          </div>
          <div>
            {wa ? (
              <CtaUrgent href={wa} label={contact.urgent.cta.label} />
            ) : (
              <p className="c-muted">
                The WhatsApp number is being set up. Meanwhile write to <a href={`mailto:${company.emails.aog}`}>{company.emails.aog}</a> with the part number, quantity, condition and delivery airport.
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="form" data-theme="light" className="o-section o-section--raised c-formsec" data-sc-act="flow" aria-labelledby="form-title">
        <div className="o-container c-formsec__grid">
          <div className="c-formsec__aside">
            <h2 id="form-title" className="c-h2">
              {contact.general.title}
            </h2>
            <ul className="c-lines">
              {contact.channels.map((c) => (
                <li key={c.href}>
                  <a href={c.href}>{c.value}</a>
                  {c.note ? <span className="c-muted"> {c.note}</span> : null}
                </li>
              ))}
              {contact.office.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
          <DoorForm form={contact.general} route="general" />
        </div>
      </section>
      <ScrollCraftMount />
    </main>
  );
}
