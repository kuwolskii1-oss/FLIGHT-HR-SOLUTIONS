import { createFileRoute } from "@tanstack/react-router";
import { PageMotion } from "@/components/site/PageMotion";

import { PageIntro } from "@/components/site/PageIntro";
import { Section, SectionHead } from "@/components/site/Section";
import { careers } from "@/site/content";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/careers")({
  head: () => pageHead({ title: careers.seoTitle.replace(/\s*\|\s*Flight Hour Solution$/i, ""), description: careers.metaDescription, path: "/careers" }),
  component: CareersPage,
});

function CareersPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageIntro eyebrow="Careers" title={careers.title} lead={careers.intro} image="test-cell" />
      <Section theme="light" id="profile">
        <SectionHead title="What we look for" />
        <ul className="c-list c-list--2col" data-reveal-group>
          {careers.whatWeLookFor.map((w, i) => (
            <li className="c-list__item" key={i}>
              <p className="c-list__text" style={{ color: "var(--fg)" }}>
                {w}
              </p>
            </li>
          ))}
        </ul>
      </Section>
      <Section theme="light" id="roles" raised>
        <SectionHead title="Open roles" />
        {careers.openRoles?.length ? (
          <ul className="c-list">
            {careers.openRoles.map((r) => (
              <li className="c-list__item" key={r.title}>
                <p className="c-list__title">{r.title}</p>
                <p className="c-mono c-muted">{r.location}</p>
                <p className="c-list__text">{r.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="c-lead c-muted">There are no advertised roles at the moment. Speculative applications are welcome.</p>
        )}
      </Section>
      <Section theme="dark" id="apply">
        <SectionHead title={careers.howToApply.title} intro={careers.howToApply.text} />
        <p className="c-h3">
          <a href={`mailto:${careers.howToApply.email}`} style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>
            {careers.howToApply.email}
          </a>
        </p>
      </Section>
      <PageMotion />
    </main>
  );
}
