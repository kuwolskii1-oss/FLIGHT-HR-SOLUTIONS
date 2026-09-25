import { createFileRoute } from "@tanstack/react-router";
import { StructuredData } from "@/components/StructuredData";
import { ClosingBand } from "@/components/site/ClosingBand";
import { CtaLink, CtaTalk } from "@/components/site/Cta";
import { Steps } from "@/components/site/Steps";
import { DoorBoard, type ShapeKind } from "@/components/site/DoorBoard";
import { EngineDial } from "@/components/site/EngineDial";
import { GroupRoute } from "@/components/site/GroupRoute";
import { InfoBoard } from "@/components/site/InfoBoard";
import { PictoTile } from "@/components/site/Pictogram";
import { DOOR_PICTO, ITEM_PICTO } from "@/site/wayfinding";
import { withRegistration } from "@/site/registration";
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
      identifier: {
        "@type": "PropertyValue",
        propertyID: "Registration number",
        value: site.company.registrationNumber,
      },
      address: { "@type": "PostalAddress", addressCountry: "ZA" },
      email: site.company.emails.general,
      areaServed: "ZA",
      parentOrganization: {
        "@type": "Organization",
        name: "Flight Hour Solution group",
        url: SWISS_SITE_URL,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: site.company.shortName,
      url: SITE_URL,
      inLanguage: "en-ZA",
      publisher: { "@id": `${SITE_URL}/#org` },
    },
  ],
});

export const Route = createFileRoute("/")({
  loader: () => ({
    title: `${site.company.shortName} | ${site.company.positioning}`,
    description: home.hero.sub,
  }),
  head: ({ loaderData }) =>
    pageHead({
      title: loaderData?.title ?? "Flight Hour Solution",
      description: loaderData?.description ?? "",
      path: "/",
    }),
  component: Index,
});

const DOOR_SHAPE: Record<string, ShapeKind> = {
  engines: "fan",
  aircraft: "contrail",
  parts: "rack",
  charter: "route",
  advisory: "chart",
};

function Index() {
  const { hero, ask, how, trust, engine360, group, closing } = home;
  const board = ask.doors.map((d) => ({
    key: d.slug,
    href: d.href,
    title: d.title,
    text: d.text,
    meta: d.urgency,
    picto: DOOR_PICTO[d.slug] ?? "left-arrow",
    shape: DOOR_SHAPE[d.slug] ?? "route",
  }));
  return (
    <main id="main" tabIndex={-1}>
      <StructuredData json={ORG_SCHEMA} />

      {/* 1. Recognition: a runway at golden hour, the promise on glass, two facts to check. */}
      <section
        className="c-runway"
        data-theme="deep"
        data-sc-act="flow"
        aria-labelledby="hero-title"
      >
        <picture className="c-runway__photo" aria-hidden="true">
          <source
            media="(max-width: 699px)"
            srcSet="/assets/img/hero-runway-tall-750.webp 750w, /assets/img/hero-runway-tall-1200.webp 1200w"
            sizes="100vw"
            width={1200}
            height={2122}
          />
          <img
            src="/assets/img/hero-runway-1800.webp"
            srcSet="/assets/img/hero-runway-900.webp 900w, /assets/img/hero-runway-1800.webp 1800w, /assets/img/hero-runway-2600.webp 2600w"
            sizes="100vw"
            alt=""
            width={1800}
            height={1018}
            decoding="async"
          />
        </picture>
        <div className="o-container c-runway__frame">
          {hero.facts?.length ? (
            <ul className="c-runway__facts" aria-label="At a glance">
              {hero.facts.map((f) => (
                <li className="c-glass c-runway__fact" key={f.value}>
                  <span className="c-runway__value">{withRegistration(f.value)}</span>
                  <span className="c-runway__label">{f.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="c-glass c-runway__panel">
            <h1 id="hero-title" className="c-runway__title">
              {/* One sentence per line; the text itself is unchanged. (No lookbehind in the
                  pattern: Safari before 16.4 cannot parse one, and it would stop the bundle.) */}
              {(hero.headline.match(/[^.]+(?:\.|$)/g) ?? [hero.headline]).map((line, i) => (
                <span className="c-runway__line" key={line}>
                  {i ? " " : null}
                  {line.trim()}
                </span>
              ))}
            </h1>
            <div className="c-runway__foot">
              <p className="c-runway__sub">{hero.sub}</p>
              <CtaTalk href={hero.cta.href} label={hero.cta.label} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Orientation: five doors. */}
      <section
        id="ask"
        data-theme="light"
        className="o-section o-section--raised c-chapter"
        data-sc-act="flow"
        aria-labelledby="ask-title"
      >
        <div className="o-container">
          <h2 id="ask-title" className="c-h2 c-h2--xl c-ask__title">
            {ask.title}
          </h2>
          <DoorBoard items={board} />
        </div>
      </section>

      {/* 3. How it works: one step per screen. */}
      <Steps id="how" steps={how.steps} title={how.title} intro={how.intro} theme="dark" />
      <section
        data-theme="deep"
        className="o-section o-section--tight c-howlink"
        aria-label="How we work, continued"
      >
        <div className="o-container">
          <CtaLink href={how.cta.href} label={how.cta.label} light />
        </div>
      </section>

      {/* 4. Proof: what can be checked. */}
      <section
        id="trust"
        data-theme="light"
        className="o-section c-chapter"
        data-sc-act="flow"
        aria-labelledby="trust-title"
      >
        <div className="o-container">
          <div className="c-stackhead">
            <h2 id="trust-title" className="c-h2 c-h2--xl">
              {trust.title}
            </h2>
            <p className="c-lead c-muted">{trust.text}</p>
          </div>
          <InfoBoard
            rows={trust.items.map((it) => ({
              key: it.title,
              title: it.title,
              picto: ITEM_PICTO[it.title],
              text: withRegistration(it.text),
            }))}
          />
          {trust.cta ? (
            <div style={{ marginTop: "var(--space-large)" }}>
              <CtaLink href={trust.cta.href} label={trust.cta.label} />
            </div>
          ) : null}
        </div>
      </section>

      {/* 5. Engine 360, early access. */}
      <section
        id="engine-360"
        data-theme="deep"
        className="o-section c-chapter"
        data-sc-act="flow"
        aria-labelledby="e360-title"
      >
        <div className="o-container c-e360" data-sc-in data-sc-stagger="70">
          <div className="c-e360__copy">
            <span className="c-badge">{engine360.badge}</span>
            <h2 id="e360-title" className="c-h2 c-h2--xl c-e360__title">
              {engine360.title}
            </h2>
            <p
              className="c-lead c-muted"
              style={{ marginTop: "var(--space-small)", maxWidth: "40ch" }}
            >
              {engine360.text}
            </p>
            <div style={{ marginTop: "var(--space-medium)" }}>
              <CtaLink href={engine360.cta.href} label={engine360.cta.label} light />
            </div>
          </div>
          <EngineDial />
        </div>
      </section>

      {/* 6. Reassurance: the group. */}
      <section
        id="group"
        data-theme="light"
        className="o-section c-chapter"
        data-sc-act="flow"
        aria-labelledby="group-title"
      >
        <div className="o-container c-groupsec" data-sc-in data-sc-stagger="70">
          <div className="c-groupsec__copy">
            <span className="c-eyebrow">
              <PictoTile name="globe" size="sm" />
              {site.group.line}
            </span>
            <h2 id="group-title" className="c-h2 c-h2--xl">
              {group.title}
            </h2>
            <p
              className="c-lead c-muted"
              style={{ marginTop: "var(--space-small)", maxWidth: "var(--measure)" }}
            >
              {group.text}
            </p>
            <div style={{ marginTop: "var(--space-medium)" }}>
              <CtaLink href={group.cta.href} label={group.cta.label} />
            </div>
          </div>
          <GroupRoute />
        </div>
      </section>

      <ClosingBand
        headline={closing.headline}
        sub={closing.sub}
        primary={closing.cta}
        urgent={closing.urgent}
      />
      <ScrollCraftMount />
    </main>
  );
}
