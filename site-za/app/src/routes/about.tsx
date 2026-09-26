import { createFileRoute } from "@tanstack/react-router";
import { ClosingBand } from "@/components/site/ClosingBand";
import { CtaLink } from "@/components/site/Cta";
import { IntroDither } from "@/components/site/IntroDither";
import { Steps } from "@/components/site/Steps";
import { about } from "@/site/data/about";
import { site } from "@/site/data/site";
import { pageHead } from "@/site/seo";
import { ScrollCraftMount } from "@/components/site/ScrollCraftMount";
import { GroupRoute } from "@/components/site/GroupRoute";
import { PictoTile } from "@/components/site/Pictogram";
import { InfoBoard } from "@/components/site/InfoBoard";
import { DOOR_PICTO, ITEM_PICTO } from "@/site/wayfinding";
import { withRegistration } from "@/site/registration";
import { ABOUT_IMAGE } from "@/site/images";

export const Route = createFileRoute("/about")({
  loader: () => ({ title: about.seoTitle, description: about.metaDescription }),
  head: ({ loaderData }) =>
    pageHead({
      title: loaderData?.title ?? "About",
      description: loaderData?.description ?? "",
      path: "/about",
    }),
  component: Page,
});

function Page() {
  const { intro, how, serve, commitments, team, company, group } = about;
  return (
    <main id="main" tabIndex={-1}>
      <header data-theme="light" className="c-page-intro c-page-intro--dither" data-sc-act="flow">
        <IntroDither image={ABOUT_IMAGE} />
        <div className="o-container" data-sc-in data-sc-stagger="70">
          <span className="c-eyebrow">
            <PictoTile name={DOOR_PICTO.about} size="sm" />
            {site.nav.about.label}
          </span>
          <h1 className="c-h1 c-h1--inner c-page-intro__title">{intro.headline}</h1>
          <p className="c-lead c-page-intro__lead">{intro.sub}</p>
        </div>
      </header>

      <Steps id="how" steps={how.steps} title={how.title} intro={how.intro} theme="light" />

      <section
        id="serve"
        data-theme="light"
        className="o-section o-section--raised"
        data-sc-act="flow"
        aria-labelledby="serve-title"
      >
        <div className="o-container">
          <div className="c-stackhead">
            <h2 id="serve-title" className="c-h2 c-h2--xl">
              {serve.title}
            </h2>
            {serve.intro ? <p className="c-lead c-muted">{serve.intro}</p> : null}
          </div>
          <InfoBoard
            columns
            rows={serve.groups.map((g) => ({
              key: g.title,
              title: g.title,
              picto: ITEM_PICTO[g.title],
              list: g.items,
            }))}
          />
        </div>
      </section>

      <section
        id="commitments"
        data-theme="light"
        className="o-section"
        data-sc-act="flow"
        aria-labelledby="commitments-title"
      >
        <div className="o-container">
          <div className="c-stackhead">
            <h2 id="commitments-title" className="c-h2 c-h2--xl">
              {commitments.title}
            </h2>
          </div>
          <InfoBoard
            rows={commitments.items.map((it) => ({
              key: it.title,
              title: it.title,
              picto: ITEM_PICTO[it.title],
              text: it.text,
            }))}
          />
        </div>
      </section>

      <section
        id="team"
        data-theme="light"
        className="o-section o-section--raised"
        data-sc-act="flow"
        aria-labelledby="team-title"
      >
        <div className="o-container" data-sc-in data-sc-stagger="70">
          <h2 id="team-title" className="c-h2">
            {team.title}
          </h2>
          <p
            className="c-lead c-muted"
            style={{ marginTop: "var(--space-small)", maxWidth: "var(--measure)" }}
          >
            {team.intro}
          </p>
          {team.people.length ? (
            <ul className="c-verify" style={{ marginTop: "var(--space-large)" }}>
              {team.people.map((p) => (
                <li className="c-verify__item" key={p.name}>
                  <h3 className="c-verify__title">{p.name}</h3>
                  <p className="c-muted" style={{ fontSize: "var(--step--1)" }}>
                    {p.role}
                    {p.group ? ", group" : ""}
                    {p.basedIn ? `, ${p.basedIn}` : ""}
                  </p>
                  <p className="c-verify__text">{p.text}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section
        id="company"
        data-theme="light"
        className="o-section"
        data-sc-act="flow"
        aria-labelledby="company-title"
      >
        <div className="o-container" data-sc-in data-sc-stagger="70">
          <h2 id="company-title" className="c-h2">
            {company.title}
          </h2>
          <ul className="c-lines c-docard" data-theme="light">
            {company.lines.map((l) => (
              <li key={l}>{withRegistration(l)}</li>
            ))}
          </ul>
          <div style={{ marginTop: "var(--space-medium)" }}>
            <CtaLink href="/legal" label="Company details and legal" />
          </div>
        </div>
      </section>

      <section
        id="group"
        data-theme="light"
        className="o-section"
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
        headline="Tell us what you need"
        primary={site.cta.primary}
        urgent={site.cta.urgent}
      />
      <ScrollCraftMount />
    </main>
  );
}
