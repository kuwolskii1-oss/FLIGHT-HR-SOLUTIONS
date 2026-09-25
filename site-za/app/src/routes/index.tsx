import { createFileRoute } from "@tanstack/react-router";
import { StructuredData } from "@/components/StructuredData";
import { ClosingBand } from "@/components/site/ClosingBand";
import { CtaLink, CtaTalk } from "@/components/site/Cta";
import { Ident } from "@/components/site/Ident";
import { SmartLink } from "@/components/site/SmartLink";
import { Steps } from "@/components/site/Steps";
import { ArrowRight } from "@/components/site/Icons";
import { SITE_URL, SWISS_SITE_URL } from "@/site/config";
import { home } from "@/site/data/home";
import { site } from "@/site/data/site";
import { pageHead } from "@/site/seo";
import { ScrollCraftMount } from "@/components/site/ScrollCraftMount";

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
      description: home.hero.sub,
      identifier: { "@type": "PropertyValue", propertyID: "Registration number", value: site.company.registrationNumber },
      address: { "@type": "PostalAddress", addressCountry: "ZA" },
      email: site.company.emails.general,
      areaServed: "ZA",
      parentOrganization: { "@type": "Organization", name: "Flight Hour Solution group", url: SWISS_SITE_URL },
    },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: site.company.shortName, url: SITE_URL, inLanguage: "en-ZA", publisher: { "@id": `${SITE_URL}/#org` } },
  ],
});

export const Route = createFileRoute("/")({
  loader: () => ({ title: `${site.company.shortName} | ${site.company.positioning}`, description: home.hero.sub }),
  head: ({ loaderData }) => pageHead({ title: loaderData?.title ?? "Flight Hour Solution", description: loaderData?.description ?? "", path: "/" }),
  component: Index,
});

function Index() {
  const { hero, ask, how, trust, engine360, group, closing } = home;
  return (
    <main id="main" tabIndex={-1}>
      <StructuredData json={ORG_SCHEMA} />

      {/* 1. Recognition: the ident flies its route as the visitor scrolls and locks up into the logo. */}
      <section className="c-hero" data-theme="light" data-sc-act="pin" data-sc-span="2.6" aria-labelledby="hero-title">
        <div data-sc-stage className="c-hero__stage">
          <div className="o-container c-hero__inner">
            <div className="c-hero__copy" data-sc-cue="0 0.94 0 0.05">
              <h1 id="hero-title" className="c-h1">
                {hero.headline}
              </h1>
              <p className="c-lead c-hero__sub">{hero.sub}</p>
              <div className="c-hero__cta">
                <CtaTalk href={hero.cta.href} label={hero.cta.label} />
              </div>
            </div>
            <Ident className="c-hero__ident" title="Flight Hour Solution ident: the plane flies its route and the swoosh forms behind it" />
          </div>
        </div>
      </section>

      {/* 2. Orientation: five doors. */}
      <section id="ask" data-theme="light" className="o-section o-section--raised c-chapter" data-sc-act="flow" aria-labelledby="ask-title">
        <div className="o-container">
          <h2 id="ask-title" className="c-h2" style={{ marginBottom: "var(--space-medium)" }}>
            {ask.title}
          </h2>
          <ul className="c-doors" data-sc-in data-sc-stagger="70">
            {ask.doors.map((d) => (
              <li className="c-door" key={d.slug}>
                <h3 className="c-door__title">
                  <SmartLink href={d.href}>{d.title}</SmartLink>
                </h3>
                <p className="c-door__text">{d.text}</p>
                <span className="c-door__meta">{d.urgency}</span>
                <ArrowRight className="c-door__arrow" width={22} height={22} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. How it works: one step per screen. */}
      <Steps id="how" steps={how.steps} title={how.title} intro={how.intro} theme="dark" />
      <section data-theme="dark" className="o-section o-section--tight" aria-label="How we work, continued">
        <div className="o-container">
          <CtaLink href={how.cta.href} label={how.cta.label} light />
        </div>
      </section>

      {/* 4. Proof: what can be checked. */}
      <section id="trust" data-theme="light" className="o-section c-chapter" data-sc-act="flow" aria-labelledby="trust-title">
        <div className="o-container">
          <div className="c-section-head">
            <div className="c-section-head__title">
              <h2 id="trust-title" className="c-h2">
                {trust.title}
              </h2>
            </div>
            <p className="c-section-head__intro c-lead c-muted">{trust.text}</p>
          </div>
          <ul className="c-trust" data-sc-in data-sc-stagger="70">
            {trust.items.map((it) => (
              <li className="c-trust__item" key={it.title}>
                <h3 className="c-trust__title">{it.title}</h3>
                <p className="c-trust__text">{it.text}</p>
              </li>
            ))}
          </ul>
          {trust.cta ? (
            <div style={{ marginTop: "var(--space-large)" }}>
              <CtaLink href={trust.cta.href} label={trust.cta.label} />
            </div>
          ) : null}
        </div>
      </section>

      {/* 5. Engine 360, early access. */}
      <section id="engine-360" data-theme="deep" className="o-section c-chapter" data-sc-act="flow" aria-labelledby="e360-title">
        <div className="o-container c-e360" data-sc-in data-sc-stagger="70">
          <div>
            <span className="c-badge">{engine360.badge}</span>
            <h2 id="e360-title" className="c-h2 c-e360__title">
              {engine360.title}
            </h2>
            <p className="c-lead c-muted" style={{ marginTop: "var(--space-small)", maxWidth: "48ch" }}>
              {engine360.text}
            </p>
          </div>
          <div>
            <CtaLink href={engine360.cta.href} label={engine360.cta.label} light />
          </div>
        </div>
      </section>

      {/* 6. Reassurance: the group. */}
      <section id="group" data-theme="light" className="o-section c-chapter" data-sc-act="flow" aria-labelledby="group-title">
        <div className="o-container" data-sc-in data-sc-stagger="70">
          <span className="c-eyebrow">{site.group.line}</span>
          <h2 id="group-title" className="c-h2">
            {group.title}
          </h2>
          <p className="c-lead c-muted" style={{ marginTop: "var(--space-small)", maxWidth: "var(--measure)" }}>
            {group.text}
          </p>
          <div style={{ marginTop: "var(--space-medium)" }}>
            <CtaLink href={group.cta.href} label={group.cta.label} />
          </div>
        </div>
      </section>

      <ClosingBand headline={closing.headline} sub={closing.sub} primary={closing.cta} urgent={closing.urgent} />
      <ScrollCraftMount />
    </main>
  );
}
