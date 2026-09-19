import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageMotion } from "@/components/site/PageMotion";

import { ClosingBand } from "@/components/site/ClosingBand";
import { CtaLink } from "@/components/site/Cta";
import { MediaFrame } from "@/components/site/MediaFrame";
import { PageIntro } from "@/components/site/PageIntro";
import { RuledList } from "@/components/site/RuledList";
import { Section, SectionHead } from "@/components/site/Section";
import { findIndustry, services } from "@/site/content";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/industries/$slug")({
  loader: ({ params }) => {
    const industry = findIndustry(params.slug);
    if (!industry) throw notFound();
    return industry;
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead({
          title: loaderData.seoTitle.replace(/\s*\|\s*Flight Hour Solution$/i, ""),
          description: loaderData.metaDescription,
          path: `/industries/${loaderData.slug}`,
        })
      : {},
  component: IndustryPage,
});

function IndustryPage() {
  const i = Route.useLoaderData();
  const rows = i.whatWeDo.map((w) => {
    const svc = w.serviceSlug ? services.services.find((s) => s.slug === w.serviceSlug) : undefined;
    return { title: w.title, text: w.text, href: svc ? `/services/${svc.slug}` : "/services", meta: svc ? [svc.shortName ?? svc.name] : undefined };
  });
  return (
    <main id="main" tabIndex={-1}>
      <PageIntro eyebrow="Industries" title={i.name} lead={i.audience} />
      <Section theme="light" id="situation">
        <div className="c-split c-split--even">
          <div className="c-split__aside">
            <h2 className="c-h2" data-reveal>
              The situation
            </h2>
            <p className="c-lead c-muted" style={{ marginTop: "var(--space-small)" }} data-reveal>
              {i.situation}
            </p>
            {i.entryCta ? (
              <div style={{ marginTop: "var(--space-large)" }}>
                <CtaLink href={i.entryCta.href} label={i.entryCta.label} />
              </div>
            ) : null}
          </div>
          <div className="c-split__main">{i.image ? <MediaFrame image={i.image.src} alt={i.image.alt} ratio="3x2" /> : null}</div>
        </div>
      </Section>
      <Section theme="light" id="what-we-do" raised>
        <SectionHead title="What we do for you" />
        <RuledList rows={rows} />
      </Section>
      <ClosingBand headline="Tell us about the engine and the date" />
      <PageMotion />
    </main>
  );
}
