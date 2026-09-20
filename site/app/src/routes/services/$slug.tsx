import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageMotion } from "@/components/site/PageMotion";

import { StructuredData } from "@/components/StructuredData";
import { ClosingBand } from "@/components/site/ClosingBand";
import { Faq } from "@/components/site/Faq";
import { LocalNav } from "@/components/site/LocalNav";
import { MediaFrame } from "@/components/site/MediaFrame";
import { PageIntro } from "@/components/site/PageIntro";
import { TitledList } from "@/components/site/Prose";
import { RuledList } from "@/components/site/RuledList";
import { Section, SectionHead } from "@/components/site/Section";
import { SmartLink } from "@/components/site/SmartLink";
import { StatStrip } from "@/components/site/StatStrip";
import { Steps } from "@/components/site/Steps";
import { SITE_URL } from "@/site/config";
import { engines } from "@/site/data/engines";
import { findService, services } from "@/site/data/services";
import { site } from "@/site/data/site";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = findService(params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead({
          title: loaderData.seoTitle.replace(/\s*\|\s*Flight Hour Solution$/i, ""),
          description: loaderData.metaDescription,
          path: `/services/${loaderData.slug}`,
        })
      : {},
  component: ServicePage,
});

function ServicePage() {
  const s = Route.useLoaderData();
  const related = (s.related ?? [])
    .map((slug) => services.services.find((x) => x.slug === slug))
    .filter(Boolean)
    .map((r) => ({ title: r!.name, text: r!.oneLiner, href: `/services/${r!.slug}` }));
  const families = (s.engineFamilies ?? []).map((name) => {
    const fam = engines.families.find((f) => f.name.toLowerCase() === name.toLowerCase() || f.slug === name.toLowerCase());
    return { name, href: fam ? `/engines/${fam.slug}` : "/engines" };
  });
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.oneLiner,
    url: `${SITE_URL}/services/${s.slug}`,
    serviceType: s.name,
    areaServed: "Worldwide",
    provider: { "@type": "Organization", name: site.company.legalName, url: SITE_URL },
  });
  const nav = [
    { id: "problem", label: "Why it matters" },
    { id: "deliverables", label: "What we do" },
    { id: "engagement", label: "How it runs" },
    ...(families.length ? [{ id: "families", label: "Engines" }] : []),
    ...(s.faq?.length ? [{ id: "faq", label: "Questions" }] : []),
  ];
  return (
    <main id="main" tabIndex={-1}>
      <StructuredData json={schema} />
      <PageIntro
        eyebrow="Service"
        title={s.name}
        lead={s.oneLiner}
        meta={s.audience}
        image={s.image?.src}
        imageAlt={s.image?.alt}
      />
      <LocalNav items={nav} />
      <Section theme="light" id="problem">
        <SectionHead title={s.problem.title} intro={s.problem.text} />
        {s.problem.stats?.length ? <StatStrip stats={s.problem.stats} showSource /> : null}
      </Section>
      <Section theme="light" id="deliverables" raised>
        <SectionHead eyebrow="Deliverables" title="What we do" />
        <TitledList items={s.deliverables} twoColumns />
      </Section>
      <Section theme="dark" id="engagement">
        <SectionHead eyebrow="Engagement" title="How an engagement runs" />
        <Steps steps={s.engagement} />
      </Section>
      {families.length ? (
        <Section theme="light" id="families" tight>
          <div className="c-split c-split--even">
            <div className="c-split__aside">
              <h2 className="c-h2">Engine families</h2>
              <ul className="c-tags" style={{ marginTop: "var(--space-small)" }}>
                {families.map((f) => (
                  <li key={f.name}>
                    <SmartLink href={f.href}>{f.name}</SmartLink>
                  </li>
                ))}
              </ul>
              {s.proof ? (
                <div style={{ marginTop: "var(--space-large)" }}>
                  <h3 className="c-h4">{s.proof.title}</h3>
                  <p className="c-body c-muted" style={{ marginTop: "var(--space-tiny)" }}>
                    {s.proof.text}
                  </p>
                </div>
              ) : null}
            </div>
            <div className="c-split__main">
              <MediaFrame image="fan-macro" ratio="3x2" />
            </div>
          </div>
        </Section>
      ) : null}
      {s.faq?.length ? (
        <Section theme="light" id="faq" raised tight>
          <div style={{ maxWidth: "52rem" }}>
            <Faq items={s.faq} />
          </div>
        </Section>
      ) : null}
      {related.length ? (
        <Section theme="light" id="related" tight>
          <SectionHead title="Related services" />
          <RuledList rows={related} compact />
        </Section>
      ) : null}
      <ClosingBand headline="Tell us the engine, the shop and the date" />
      <PageMotion />
    </main>
  );
}
