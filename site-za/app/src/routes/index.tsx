import { createFileRoute } from "@tanstack/react-router";
import { StructuredData } from "@/components/StructuredData";
import { ClosingBand } from "@/components/site/ClosingBand";
import { CtaLink, CtaTalk } from "@/components/site/Cta";
import { Steps } from "@/components/site/Steps";
import { DoorBoard, type ShapeKind } from "@/components/site/DoorBoard";
import { EngineDial } from "@/components/site/EngineDial";
import { GroupRoute } from "@/components/site/GroupRoute";
import { InfoBoard } from "@/components/site/InfoBoard";
import { Reel } from "@/components/site/Reel";
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

/** A company registration number, set in the data face wherever it appears. */
const REGNO = /^\d{4}\/\d{6}\/\d{2}$/;

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

      {/* 1. Recognition: the promise, centred, over an aircraft that flies out of its frame. */}
      <section className="c-sky" data-theme="light" data-sc-act="flow" aria-labelledby="hero-title">
        <div className="o-container c-sky__head">
          <h1 id="hero-title" className="c-sky__title">
            {/* One sentence per line; the text itself is unchanged. (No lookbehind in the
                pattern: Safari before 16.4 cannot parse one, and it would stop the bundle.) */}
            {(hero.headline.match(/[^.]+(?:\.|$)/g) ?? [hero.headline]).map((line, i) => (
              <span className="c-sky__line" key={line}>
                {i ? " " : null}
                {line.trim()}
              </span>
            ))}
          </h1>
          <p className="c-sky__sub">{hero.sub}</p>
        </div>
        {/* The sky is clipped to a capsule; the aircraft, cut out of the same photograph, is not,
            so its wings reach past the capsule's ends. */}
        <div className="c-sky__stage" aria-hidden="true">
          <img
            className="c-sky__photo"
            src="/assets/img/hero-sky-1800.webp"
            srcSet="/assets/img/hero-sky-900.webp 900w, /assets/img/hero-sky-1800.webp 1800w, /assets/img/hero-sky-2600.webp 2600w"
            sizes="(min-width: 1200px) 1100px, 100vw"
            alt=""
            width={1800}
            height={771}
            decoding="async"
          />
          <img
            className="c-sky__plane"
            src="/assets/img/hero-plane-1800.webp"
            srcSet="/assets/img/hero-plane-900.webp 900w, /assets/img/hero-plane-1800.webp 1800w, /assets/img/hero-plane-2600.webp 2600w"
            sizes="(min-width: 1200px) 1100px, 100vw"
            alt=""
            width={1800}
            height={771}
            decoding="async"
          />
        </div>
        <div className="o-container">
          <div className="c-sky__card">
            {hero.facts?.length ? (
              <ul className="c-sky__facts" aria-label="At a glance">
                {hero.facts.map((f) => (
                  <li className="c-sky__fact" key={f.value}>
                    <PictoTile
                      name={REGNO.test(f.value) ? "passports" : "stairs"}
                      size="sm"
                      className="c-sky__icon"
                    />
                    <span className="c-sky__value">
                      <Reel value={f.value} className={REGNO.test(f.value) ? "c-regno" : ""} />
                    </span>
                    <span className="c-sky__label">{f.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="c-sky__cta">
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
      <Steps id="how" steps={how.steps} title={how.title} intro={how.intro} theme="light" />
      <section
        data-theme="light"
        className="o-section o-section--tight c-howlink"
        aria-label="How we work, continued"
      >
        <div className="o-container">
          <CtaLink href={how.cta.href} label={how.cta.label} />
        </div>
      </section>

      {/* 4. Proof: what can be checked. */}
      <section
        id="trust"
        data-theme="light"
        className="o-section o-section--raised c-chapter"
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
        data-theme="light"
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
              <CtaLink href={engine360.cta.href} label={engine360.cta.label} />
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
