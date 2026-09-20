import { createFileRoute } from "@tanstack/react-router";
import { PageMotion } from "@/components/site/PageMotion";

import { PageIntro } from "@/components/site/PageIntro";
import { Section } from "@/components/site/Section";
import { legal } from "@/site/data/legal";
import { pageHead } from "@/site/seo";


export const Route = createFileRoute("/cookies")({
  loader: () => ({ title: legal.cookies.title }),
  head: ({ loaderData }) => pageHead({ title: loaderData?.title ?? "Cookies", description: "Cookies of Flight Hour Solution GmbH, Zug, Switzerland.", path: "/cookies", noindex: true }),
  component: Page,
});

function Page() {
  const doc = legal.cookies;
  const sections = doc.sections as { title: string; lines?: string[]; paragraphs?: string[] }[];
  return (
    <main id="main" tabIndex={-1}>
      <PageIntro eyebrow="Legal" title={doc.title} theme="light" lead={"updated" in doc ? `Last updated ${(doc as { updated: string }).updated}` : undefined} />
      <Section theme="light" id="content" tight>
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
      <PageMotion />
    </main>
  );
}
