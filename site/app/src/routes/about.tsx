import { createFileRoute } from "@tanstack/react-router";
import { PageMotion } from "@/components/site/PageMotion";

import { ClosingBand } from "@/components/site/ClosingBand";
import { LocalNav } from "@/components/site/LocalNav";
import { MediaFrame } from "@/components/site/MediaFrame";
import { PageIntro } from "@/components/site/PageIntro";
import { Section, SectionHead } from "@/components/site/Section";
import { about } from "@/site/data/about";
import { site } from "@/site/data/site";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/about")({
  loader: () => ({ title: about.seoTitle.replace(/\s*\|\s*Flight Hour Solution$/i, ""), description: about.metaDescription }),
  head: ({ loaderData }) => pageHead({ title: loaderData?.title ?? "About", description: loaderData?.description ?? "", path: "/about" }),
  component: AboutPage,
});

const NAV = [
  { id: "story", label: "Story" },
  { id: "independence", label: "Independence" },
  { id: "team", label: "Team" },
  { id: "credentials", label: "Credentials" },
  { id: "zug", label: "Zug" },
  { id: "legal", label: "Legal entity" },
];

function AboutPage() {
  const [lead, ...rest] = about.story.paragraphs;
  return (
    <main id="main" tabIndex={-1}>
      <PageIntro eyebrow="About" title={about.story.title} lead={lead} image="records-desk" />
      <LocalNav items={NAV} />
      <Section theme="light" id="story">
        <div className="c-prose">
          {rest.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Section>
      <Section theme="dark" id="independence">
        <SectionHead title={about.independence.title} intro={about.independence.statement} />
        <ol className="c-list" data-reveal-group>
          {about.independence.policy.map((p, i) => (
            <li className="c-list__item" key={i}>
              <p className="c-list__title">Policy {i + 1}</p>
              <p className="c-list__text">{p}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section theme="light" id="team">
        <SectionHead title={about.team.title} intro={about.team.intro} />
        {about.team.people.map((p) => (
          <div className="c-person" key={p.name} data-reveal>
            <div>
              <p className="c-person__name">{p.name}</p>
              <p className="c-person__role">{p.role}</p>
              <p className="c-person__text" style={{ marginTop: "var(--space-small)" }}>
                {p.text}
              </p>
            </div>
            <div className="c-person__channels">
              {p.languages?.length ? <span className="c-muted">Languages: {p.languages.join(", ")}</span> : null}
              <a href={`mailto:${site.company.email}`}>{site.company.email}</a>
              <a href={`tel:${site.company.phone}`}>{site.company.phoneDisplay}</a>
              {p.linkedin ? (
                <a href={p.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn profile
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </Section>
      <Section theme="light" id="credentials" raised>
        <SectionHead title={about.credentials.title} />
        <div className="c-table-wrap">
          <table className="c-table">
            <thead>
              <tr>
                <th scope="col">Credential</th>
                <th scope="col">Status</th>
                <th scope="col">Detail</th>
              </tr>
            </thead>
            <tbody>
              {about.credentials.items.map((c) => (
                <tr key={c.name}>
                  <td>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                        {c.name}
                      </a>
                    ) : (
                      c.name
                    )}
                  </td>
                  <td className="c-mono">{c.status}</td>
                  <td>{c.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section theme="light" id="zug">
        <div className="c-split c-split--even">
          <div className="c-split__aside">
            <h2 className="c-h2" data-reveal>
              {about.zug.title}
            </h2>
            <p className="c-lead c-muted" style={{ marginTop: "var(--space-small)" }} data-reveal>
              {about.zug.text}
            </p>
          </div>
          <div className="c-split__main">
            <MediaFrame image={about.zug.image?.src ?? "zug-lake"} alt={about.zug.image?.alt} ratio="3x2" />
          </div>
        </div>
      </Section>
      <Section theme="light" id="legal" raised tight>
        <SectionHead title={about.legal.title} />
        <address className="c-mono" style={{ fontStyle: "normal", lineHeight: 1.7 }}>
          {about.legal.lines.map((l, i) => (
            <span key={i} style={{ display: "block" }}>
              {l}
            </span>
          ))}
        </address>
      </Section>
      <ClosingBand headline="Talk to the person who does the work" />
      <PageMotion />
    </main>
  );
}
