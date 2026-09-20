import { createFileRoute } from "@tanstack/react-router";
import { PageMotion } from "@/components/site/PageMotion";
import { useMemo } from "react";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";
import { StructuredData } from "@/components/StructuredData";
import { CtaClosing, CtaLink, CtaTalk } from "@/components/site/Cta";
import { Faq } from "@/components/site/Faq";
import { MediaFrame } from "@/components/site/MediaFrame";
import { RuledList } from "@/components/site/RuledList";
import { Section, SectionHead } from "@/components/site/Section";
import { SmartLink } from "@/components/site/SmartLink";
import { StatStrip } from "@/components/site/StatStrip";
import { Steps } from "@/components/site/Steps";
import { SITE_URL } from "@/site/config";
import { about } from "@/site/data/about";
import { home } from "@/site/data/home";
import { site } from "@/site/data/site";
import { sortedArticles } from "@/site/data/insights";
import { pageHead } from "@/site/seo";
import { formatDate } from "@/site/format";

const ORG_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${SITE_URL}/#org`,
      name: site.company.legalName,
      alternateName: site.company.shortName,
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
      image: `${SITE_URL}/og/home.jpg`,
      description: home.hero.sub,
      foundingDate: "2024-09-26",
      identifier: { "@type": "PropertyValue", propertyID: "UID", value: site.company.uid },
      address: {
        "@type": "PostalAddress",
        streetAddress: site.company.street,
        postalCode: site.company.postalCode,
        addressLocality: site.company.city,
        addressCountry: "CH",
      },
      telephone: site.company.phone,
      email: site.company.email,
      areaServed: "Worldwide",
      serviceType: "Jet engine management consulting",
      founder: { "@id": `${SITE_URL}/#md` },
      employee: { "@id": `${SITE_URL}/#md` },
      memberOf: site.memberships
        .filter((m) => m.status === "verified")
        .map((m) => ({ "@type": "Organization", name: m.name, url: m.url })),
      sameAs: [site.company.linkedin, site.company.registerUrl].filter(Boolean),
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#md`,
      name: site.company.managingDirector,
      jobTitle: "Managing Director",
      worksFor: { "@id": `${SITE_URL}/#org` },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: site.company.shortName,
      url: SITE_URL,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#org` },
    },
  ],
});

export const Route = createFileRoute("/")({
  loader: () => ({ title: `${site.company.shortName} | Independent jet-engine management, Zug`, description: home.hero.sub }),
  head: ({ loaderData }) => pageHead({ title: loaderData?.title ?? "Flight Hour Solution", description: loaderData?.description ?? "", path: "/" }),
  component: Index,
});

function Index() {
  const primary = site.cta.primary;
  const secondary = site.cta.secondary;
  const scenes = useMemo(
    () =>
      scrollScrubScenes.map((scene, i) => {
        if (i === 0) {
          return {
            ...scene,
            actions: (
              <>
                <CtaTalk href={primary.href} label={primary.label} />
                <CtaLink href="#process" label="How a managed shop visit works" light />
              </>
            ),
          };
        }
        if (i === scrollScrubScenes.length - 1) {
          return { ...scene, actions: <CtaLink href={secondary.href} label={secondary.label} light /> };
        }
        return scene;
      }),
    [primary.href, primary.label, secondary.href, secondary.label],
  );
  const latest = sortedArticles().slice(0, 3);
  const person = about.team.people[0];

  return (
    <main id="main" tabIndex={-1}>
      <StructuredData json={ORG_SCHEMA} />

      <div className="c-journey" data-theme="deep">
        <ScrollScrub scenes={scenes} theme={scrollScrubTheme} />
      </div>

      <Section theme="dark" id="proof" tight ariaLabelledby="proof-title">
        <h2 id="proof-title" className="u-visually-hidden">
          Facts about the company
        </h2>
        <StatStrip stats={home.proof.stats} />
        {home.proof.memberships?.length ? (
          <p className="c-mono c-mono--caps c-muted" style={{ marginTop: "var(--space-large)" }}>
            Member of {home.proof.memberships.join(", ")}
          </p>
        ) : null}
      </Section>

      <Section theme="light" id="situations" ariaLabelledby="situations-title">
        <SectionHead id="situations-title" title={home.situations.title} />
        <div className="c-situations" data-reveal-group>
          {home.situations.items.map((item) => (
            <article className="c-situation" key={item.title}>
              <h3 className="c-situation__title">{item.title}</h3>
              <p className="c-situation__text">{item.text}</p>
              <div className="c-situation__link">
                <CtaLink href={item.href} label="How we help" />
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section theme="light" id="services" raised ariaLabelledby="services-title">
        <SectionHead id="services-title" eyebrow="Services" title={home.services.title} intro={home.services.intro} />
        <RuledList rows={home.services.rows} ariaLabel="Services" />
        <div style={{ marginTop: "var(--space-large)" }}>
          <CtaLink href="/services" label="All services in detail" />
        </div>
      </Section>

      <Section theme="light" id="engines" ariaLabelledby="engines-title">
        <div className="c-split">
          <div className="c-split__aside c-split__aside--sticky">
            <h2 id="engines-title" className="c-h2" data-reveal>
              {home.engines.title}
            </h2>
            {home.engines.intro ? (
              <p className="c-lead c-muted" style={{ marginTop: "var(--space-small)" }} data-reveal>
                {home.engines.intro}
              </p>
            ) : null}
            <MediaFrame image="cross-section" ratio="16x9" className="c-split__figure" sizes="(min-width: 1000px) 33vw, 100vw" />
          </div>
          <div className="c-split__main">
            <RuledList rows={home.engines.rows} compact ariaLabel="Engine families" />
            <div style={{ marginTop: "var(--space-large)" }}>
              <CtaLink href="/engines" label="Engine families and models" />
            </div>
          </div>
        </div>
      </Section>

      <Section theme="dark" id="process" ariaLabelledby="process-title">
        <SectionHead id="process-title" eyebrow="Method" title={home.process.title} intro={home.process.intro} />
        <Steps steps={home.process.steps} />
      </Section>

      <section data-theme="deep" className="c-band" id="independence" aria-labelledby="independence-title">
        <div className="o-container">
          <h2 id="independence-title" className="c-band__title" data-split>
            {home.independence.title}
          </h2>
          <p className="c-band__text">{home.independence.text}</p>
          <div className="c-band__actions">
            <CtaLink href={home.independence.href} label="Our independence policy" light />
          </div>
        </div>
      </section>

      <Section theme="light" id="people" ariaLabelledby="people-title">
        <SectionHead id="people-title" title={home.people.title} intro={home.people.intro} />
        {person ? (
          <div className="c-person" data-reveal>
            <div>
              <p className="c-person__name">{person.name}</p>
              <p className="c-person__role">{person.role}</p>
              <p className="c-person__text" style={{ marginTop: "var(--space-small)" }}>
                {person.text}
              </p>
            </div>
            <div className="c-person__channels">
              <a href={`tel:${site.company.phone}`}>{site.company.phoneDisplay}</a>
              <a href={`mailto:${site.company.email}`}>{site.company.email}</a>
              {person.linkedin ? (
                <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn profile
                </a>
              ) : null}
              <SmartLink href={home.people.href}>About the company</SmartLink>
            </div>
          </div>
        ) : null}
      </Section>

      <Section theme="light" id="insights" raised ariaLabelledby="insights-title">
        <SectionHead id="insights-title" eyebrow="Insights" title={home.insights.title} />
        <div className="c-index" data-reveal-group>
          {latest.map((a) => (
            <article className="c-index__item" key={a.slug}>
              <p className="c-index__date">
                <time dateTime={a.date}>{formatDate(a.date)}</time>
                {a.readingMinutes ? ` · ${a.readingMinutes} min` : ""}
              </p>
              <h3 className="c-index__title">
                <SmartLink href={`/insights/${a.slug}`}>{a.title}</SmartLink>
              </h3>
              <p className="c-index__excerpt">{a.excerpt}</p>
            </article>
          ))}
        </div>
        <div style={{ marginTop: "var(--space-large)" }}>
          <CtaLink href={home.insights.href} label="All insights" />
        </div>
      </Section>

      {home.faq?.length ? (
        <Section theme="light" id="faq" tight>
          <div className="o-grid">
            <div style={{ gridColumn: "1 / -1", maxWidth: "52rem" }}>
              <Faq items={home.faq} />
            </div>
          </div>
        </Section>
      ) : null}

      <section data-theme="dark" className="c-band" id="closing" aria-labelledby="closing-title">
        <div className="o-container">
          <h2 id="closing-title" className="c-band__title" data-split>
            {home.closing.headline}
          </h2>
          {home.closing.sub ? <p className="c-band__text">{home.closing.sub}</p> : null}
          <div className="c-band__actions c-cta-row">
            <CtaClosing href={primary.href} label={primary.label} />
            <CtaLink href={secondary.href} label={secondary.label} light />
          </div>
        </div>
      </section>
      <PageMotion />
    </main>
  );
}

