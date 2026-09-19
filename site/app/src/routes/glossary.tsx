import { createFileRoute } from "@tanstack/react-router";
import { PageMotion } from "@/components/site/PageMotion";

import { ClosingBand } from "@/components/site/ClosingBand";
import { PageIntro } from "@/components/site/PageIntro";
import { Section } from "@/components/site/Section";
import { glossary } from "@/site/content";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/glossary")({
  head: () => pageHead({ title: glossary.seoTitle.replace(/\s*\|\s*Flight Hour Solution$/i, ""), description: glossary.metaDescription, path: "/glossary" }),
  component: GlossaryPage,
});

const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function GlossaryPage() {
  const terms = [...glossary.terms].sort((a, b) => a.term.localeCompare(b.term));
  const letters = Array.from(new Set(terms.map((t) => t.term[0].toUpperCase())));
  return (
    <main id="main" tabIndex={-1}>
      <PageIntro eyebrow="Glossary" title={glossary.title} lead={glossary.intro} />
      <Section theme="light" id="terms">
        <nav aria-label="Jump to letter" className="c-tags" style={{ marginBottom: "var(--space-large)" }}>
          {letters.map((l) => (
            <a key={l} href={`#letter-${l}`}>
              {l}
            </a>
          ))}
        </nav>
        <dl className="c-list c-list--2col">
          {terms.map((t, i) => {
            const letter = t.term[0].toUpperCase();
            const firstOfLetter = i === 0 || terms[i - 1].term[0].toUpperCase() !== letter;
            return (
              <div className="c-list__item" key={t.term} id={slug(t.term)}>
                {firstOfLetter ? <span id={`letter-${letter}`} className="c-eyebrow" style={{ marginBottom: "0.5rem" }}>{letter}</span> : null}
                <dt className="c-list__title">{t.term}</dt>
                <dd className="c-list__text">
                  {t.definition}
                  {t.related?.length ? (
                    <span className="c-mono c-mono--caps" style={{ display: "block", marginTop: "0.5rem" }}>
                      See also:{" "}
                      {t.related.map((r, j) => (
                        <span key={r}>
                          <a href={`#${slug(r)}`}>{r}</a>
                          {j < t.related!.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </dd>
              </div>
            );
          })}
        </dl>
      </Section>
      <ClosingBand headline="A term you did not find? Ask us." />
      <PageMotion />
    </main>
  );
}
