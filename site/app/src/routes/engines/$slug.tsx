import { createFileRoute, notFound } from "@tanstack/react-router";

import { ClosingBand } from "@/components/site/ClosingBand";
import { Faq } from "@/components/site/Faq";
import { LocalNav } from "@/components/site/LocalNav";
import { PageIntro } from "@/components/site/PageIntro";
import { TitledList } from "@/components/site/Prose";
import { RuledList } from "@/components/site/RuledList";
import { Section, SectionHead } from "@/components/site/Section";
import { StatStrip } from "@/components/site/StatStrip";
import { findFamily, services } from "@/site/content";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/engines/$slug")({
  loader: ({ params }) => {
    const family = findFamily(params.slug);
    if (!family) throw notFound();
    return family;
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead({
          title: loaderData.seoTitle.replace(/\s*\|\s*Flight Hour Solution$/i, ""),
          description: loaderData.metaDescription,
          path: `/engines/${loaderData.slug}`,
        })
      : {},
  component: EnginePage,
});

function EnginePage() {
  const f = Route.useLoaderData();
  const rows = f.whatWeDo.map((w) => {
    const svc = w.serviceSlug ? services.services.find((s) => s.slug === w.serviceSlug) : undefined;
    return { title: w.title, text: w.text, href: svc ? `/services/${svc.slug}` : "/services", meta: svc ? [svc.shortName ?? svc.name] : undefined };
  });
  const nav = [
    { id: "context", label: "Fleet context" },
    ...(f.visitTypes?.length ? [{ id: "visits", label: "Visit types" }] : []),
    ...(f.costDrivers?.length ? [{ id: "costs", label: "Cost drivers" }] : []),
    { id: "what-we-do", label: "What we do" },
    ...(f.faq?.length ? [{ id: "faq", label: "Questions" }] : []),
  ];
  return (
    <main id="main">
      <PageIntro eyebrow="Engine family" title={f.name} lead={f.context.text} meta={f.models} image={f.image?.src} imageAlt={f.image?.alt} />
      <LocalNav items={nav} />
      <Section theme="light" id="context">
        <SectionHead title={f.context.title} />
        {f.context.stats?.length ? <StatStrip stats={f.context.stats} showSource /> : null}
      </Section>
      {f.visitTypes?.length ? (
        <Section theme="light" id="visits" raised>
          <SectionHead eyebrow="Shop visits" title="Typical visit types" />
          <TitledList items={f.visitTypes} twoColumns />
        </Section>
      ) : null}
      {f.costDrivers?.length ? (
        <Section theme="dark" id="costs">
          <SectionHead title="What drives the cost" />
          <TitledList items={f.costDrivers} twoColumns />
        </Section>
      ) : null}
      <Section theme="light" id="what-we-do">
        <SectionHead title={`What we do for ${f.name} operators and owners`} />
        <RuledList rows={rows} />
      </Section>
      {f.faq?.length ? (
        <Section theme="light" id="faq" raised tight>
          <div style={{ maxWidth: "52rem" }}>
            <Faq items={f.faq} />
          </div>
        </Section>
      ) : null}
      <ClosingBand headline={`Planning a ${f.name} shop visit or transition?`} />
    </main>
  );
}
