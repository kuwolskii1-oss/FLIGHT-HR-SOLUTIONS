import { createFileRoute } from "@tanstack/react-router";
import { PageMotion } from "@/components/site/PageMotion";

import { ClosingBand } from "@/components/site/ClosingBand";
import { PageIntro } from "@/components/site/PageIntro";
import { RuledList } from "@/components/site/RuledList";
import { Section, SectionHead } from "@/components/site/Section";
import { SmartLink } from "@/components/site/SmartLink";
import { services } from "@/site/data/services";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/services/")({
  loader: () => ({ description: services.hub.intro }),
  head: ({ loaderData }) => pageHead({ title: "Services: engine shop-visit management and advisory", description: loaderData?.description ?? "", path: "/services" }),
  component: ServicesPage,
});

function ServicesPage() {
  const rows = services.services.map((s) => ({
    title: s.name,
    text: s.oneLiner,
    href: `/services/${s.slug}`,
    meta: s.engineFamilies?.slice(0, 5),
  }));
  return (
    <main id="main" tabIndex={-1}>
      <PageIntro eyebrow="Services" title={services.hub.title} lead={services.hub.intro} image="shop-floor" />
      {services.hub.situations?.length ? (
        <Section theme="light" id="situations" tight>
          <SectionHead title="Start from your situation" />
          <div className="c-situations" data-reveal-group>
            {services.hub.situations.map((s) => (
              <article className="c-situation" key={s.title}>
                <h3 className="c-situation__title">{s.title}</h3>
                <p className="c-situation__text">{s.text}</p>
                <ul className="c-tags" style={{ marginTop: "var(--space-small)" }}>
                  {s.serviceSlugs.map((slug) => {
                    const svc = services.services.find((x) => x.slug === slug);
                    return svc ? (
                      <li key={slug}>
                        <SmartLink href={`/services/${slug}`}>{svc.shortName ?? svc.name}</SmartLink>
                      </li>
                    ) : null;
                  })}
                </ul>
              </article>
            ))}
          </div>
        </Section>
      ) : null}
      <Section theme="light" id="all" raised>
        <SectionHead eyebrow="Eight services" title="What we do, in detail" />
        <RuledList rows={rows} ariaLabel="All services" />
      </Section>
      <ClosingBand headline="Send us the workscope before you sign it" />
      <PageMotion />
    </main>
  );
}
