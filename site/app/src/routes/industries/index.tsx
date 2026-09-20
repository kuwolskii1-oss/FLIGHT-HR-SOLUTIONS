import { createFileRoute } from "@tanstack/react-router";
import { PageMotion } from "@/components/site/PageMotion";

import { ClosingBand } from "@/components/site/ClosingBand";
import { PageIntro } from "@/components/site/PageIntro";
import { RuledList } from "@/components/site/RuledList";
import { Section } from "@/components/site/Section";
import { industries } from "@/site/data/industries";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/industries/")({
  loader: () => ({ description: industries.hub.intro }),
  head: ({ loaderData }) => pageHead({ title: "Who we work for: airlines, lessors, MROs, government", description: loaderData?.description ?? "", path: "/industries" }),
  component: IndustriesPage,
});

function IndustriesPage() {
  const rows = industries.industries.map((i) => ({ title: i.name, text: i.audience, href: `/industries/${i.slug}` }));
  return (
    <main id="main" tabIndex={-1}>
      <PageIntro eyebrow="Industries" title={industries.hub.title} lead={industries.hub.intro} />
      <Section theme="light" id="all">
        <RuledList rows={rows} ariaLabel="Industries" headingLevel="h2" />
      </Section>
      <ClosingBand headline="Tell us which side of the engine you are on" />
      <PageMotion />
    </main>
  );
}
