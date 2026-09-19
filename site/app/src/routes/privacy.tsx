import { createFileRoute } from "@tanstack/react-router";

import { PageIntro } from "@/components/site/PageIntro";
import { Section } from "@/components/site/Section";
import { legal } from "@/site/content";
import { pageHead } from "@/site/seo";

const doc = legal.privacy;

export const Route = createFileRoute("/privacy")({
  head: () => pageHead({ title: doc.title, description: "Privacy of Flight Hour Solution GmbH, Zug, Switzerland.", path: "/privacy", noindex: true }),
  component: Page,
});

function Page() {
  const sections = doc.sections as { title: string; lines?: string[]; paragraphs?: string[] }[];
  return (
    <main id="main">
      <PageIntro eyebrow="Legal" title={doc.title} theme="light" lead={"updated" in doc ? `Last updated ${(doc as { updated: string }).updated}` : undefined} />
      <Section theme="light" id="content">
        <div className="c-prose">
          {sections.map((s) => (
            <div key={s.title}>
              <h2>{s.title}</h2>
              {(s.paragraphs ?? s.lines ?? []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
