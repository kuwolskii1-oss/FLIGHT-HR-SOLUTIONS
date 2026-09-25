import { createFileRoute } from "@tanstack/react-router";
import { ClosingBand } from "@/components/site/ClosingBand";
import { CtaLink } from "@/components/site/Cta";
import { LocalNav } from "@/components/site/LocalNav";
import { MediaFrame } from "@/components/site/MediaFrame";
import { Steps } from "@/components/site/Steps";
import { about } from "@/site/data/about";
import { site } from "@/site/data/site";
import { pageHead } from "@/site/seo";
import { ScrollCraftMount } from "@/components/site/ScrollCraftMount";
import { GroupRoute } from "@/components/site/GroupRoute";
import { PictoTile } from "@/components/site/Pictogram";
import { DOOR_PICTO, ITEM_PICTO } from "@/site/wayfinding";
import { withRegistration } from "@/site/registration";

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
      <header data-theme="dark" className="c-page-intro" data-sc-act="flow">
        <div className="o-container" data-sc-in data-sc-stagger="70">
          <span className="c-eyebrow">
            <PictoTile name={DOOR_PICTO.about} size="sm" />
            {site.nav.about.label}
          </span>
          <h1 className="c-h1 c-h1--inner c-page-intro__title">{intro.headline}</h1>
          <p className="c-lead c-page-intro__lead">{intro.sub}</p>
          <LocalNav
            items={site.nav.about.items.map((i) => ({
              label: i.label,
              href: i.href.replace("/about", ""),
            }))}
          />
        </div>
      </header>

      <section data-theme="light" className="c-doorimg" data-sc-act="flow" aria-hidden="true">
        <div className="o-container">
          <MediaFrame image="apron-dawn" alt="" ratio="16x9" reveal="up" sizes="100vw" />
        </div>
      </section>

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
          <ul className="c-creds c-creds--serve" data-sc-in data-sc-stagger="70">
            {serve.groups.map((g) => (
              <li className="c-cred" key={g.title}>
                {ITEM_PICTO[g.title] ? (
                  <PictoTile name={ITEM_PICTO[g.title]} className="c-cred__tile" />
                ) : null}
                <h3 className="c-cred__title">{g.title}</h3>
                <ul className="c-checks c-checks--tight">
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="commitments"
        data-theme="deep"
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
          <ul className="c-creds c-creds--commit" data-sc-in data-sc-stagger="70">
            {commitments.items.map((it) => (
              <li className="c-cred" key={it.title}>
                {ITEM_PICTO[it.title] ? (
                  <PictoTile name={ITEM_PICTO[it.title]} className="c-cred__tile" />
                ) : null}
                <h3 className="c-cred__title">{it.title}</h3>
                <p className="c-cred__text">{it.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="team"
        data-theme="light"
        className="o-section"
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
        className="o-section o-section--raised"
        data-sc-act="flow"
        aria-labelledby="company-title"
      >
        <div className="o-container" data-sc-in data-sc-stagger="70">
          <h2 id="company-title" className="c-h2">
            {company.title}
          </h2>
          <ul className="c-lines c-docard">
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
        data-theme="dark"
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
              <CtaLink href={group.cta.href} label={group.cta.label} light />
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
