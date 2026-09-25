import { createFileRoute } from "@tanstack/react-router";
import { ClosingBand } from "@/components/site/ClosingBand";
import { DoorForm } from "@/components/site/DoorForm";
import { engine360 } from "@/site/data/engine360";
import { site } from "@/site/data/site";
import { pageHead } from "@/site/seo";
import { ScrollCraftMount } from "@/components/site/ScrollCraftMount";

export const Route = createFileRoute("/engines/engine-360")({
  loader: () => ({ title: engine360.seoTitle, description: engine360.metaDescription }),
  head: ({ loaderData }) => pageHead({ title: loaderData?.title ?? "Engine 360", description: loaderData?.description ?? "", path: "/engines/engine-360" }),
  component: Page,
});

function Page() {
  return (
    <main id="main" tabIndex={-1}>
      <header data-theme="deep" className="c-page-intro" data-sc-act="flow">
        <div className="o-container" data-sc-in data-sc-stagger="70">
          <span className="c-badge">{engine360.badge}</span>
          <h1 className="c-h1 c-h1--inner c-page-intro__title" style={{ marginTop: "var(--space-tiny)" }}>
            {engine360.headline}
          </h1>
          <p className="c-lead c-page-intro__lead">{engine360.sub}</p>
        </div>
      </header>
      <section data-theme="light" className="o-section" data-sc-act="flow" aria-labelledby="what-title">
        <div className="o-container">
          <h2 id="what-title" className="c-h2" style={{ marginBottom: "var(--space-medium)" }}>
            What it is meant to do
          </h2>
          <ul className="c-verify" data-sc-in data-sc-stagger="70">
            {engine360.what.map((it) => (
              <li className="c-verify__item" key={it.title}>
                <h3 className="c-verify__title">{it.title}</h3>
                <p className="c-verify__text">{it.text}</p>
              </li>
            ))}
          </ul>
          <p className="c-callout" style={{ marginTop: "var(--space-large)" }}>
            {engine360.status}
          </p>
        </div>
      </section>
      <section id="form" data-theme="light" className="o-section o-section--raised c-formsec" data-sc-act="flow" aria-labelledby="form-title">
        <div className="o-container c-formsec__grid">
          <div className="c-formsec__aside">
            <h2 id="form-title" className="c-h2">
              {engine360.form.title}
            </h2>
            {engine360.form.intro ? <p className="c-muted" style={{ marginTop: "var(--space-small)" }}>{engine360.form.intro}</p> : null}
          </div>
          <DoorForm form={{ ...engine360.form, intro: undefined }} route="engines" />
        </div>
      </section>
      <ClosingBand headline="Something else on engines?" primary={site.cta.primary} urgent={site.cta.urgent} />
      <ScrollCraftMount />
    </main>
  );
}
