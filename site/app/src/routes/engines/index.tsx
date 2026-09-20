import { createFileRoute } from "@tanstack/react-router";
import { PageMotion } from "@/components/site/PageMotion";

import { ClosingBand } from "@/components/site/ClosingBand";
import { MediaFrame } from "@/components/site/MediaFrame";
import { PageIntro } from "@/components/site/PageIntro";
import { RuledList } from "@/components/site/RuledList";
import { Section } from "@/components/site/Section";
import { engines } from "@/site/data/engines";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/engines/")({
  loader: () => ({ description: engines.hub.intro }),
  head: ({ loaderData }) => pageHead({ title: "Engine families we manage", description: loaderData?.description ?? "", path: "/engines" }),
  component: EnginesPage,
});

function EnginesPage() {
  const rows = engines.families.map((f) => ({
    title: f.name,
    text: f.context.text.split(". ")[0] + ".",
    href: `/engines/${f.slug}`,
    meta: f.models,
  }));
  return (
    <main id="main" tabIndex={-1}>
      <PageIntro eyebrow="Engines" title={engines.hub.title} lead={engines.hub.intro} />
      <Section theme="light" id="families">
        <div className="c-split">
          <div className="c-split__aside c-split__aside--sticky">
            <MediaFrame image="cross-section" ratio="16x9" sizes="(min-width: 1000px) 33vw, 100vw" />
            <p className="c-caption" style={{ marginTop: "var(--space-small)" }}>
              Five families, seventeen engine and APU models. Each page lists the fleet context, the typical
              visit types, the cost drivers and what we do for that family.
            </p>
          </div>
          <div className="c-split__main">
            <RuledList rows={rows} ariaLabel="Engine families" headingLevel="h2" />
          </div>
        </div>
      </Section>
      <ClosingBand headline="Tell us the engine, the shop and the date" />
      <PageMotion />
    </main>
  );
}
