import { createFileRoute } from "@tanstack/react-router";

import { ClosingBand } from "@/components/site/ClosingBand";
import { PageIntro } from "@/components/site/PageIntro";
import { Section } from "@/components/site/Section";
import { SmartLink } from "@/components/site/SmartLink";
import { insights, sortedArticles } from "@/site/content";
import { pageHead } from "@/site/seo";
import { formatDate } from "../index";

export const Route = createFileRoute("/insights/")({
  head: () => pageHead({ title: insights.seoTitle.replace(/\s*\|\s*Flight Hour Solution$/i, ""), description: insights.metaDescription, path: "/insights" }),
  component: InsightsPage,
});

function InsightsPage() {
  const articles = sortedArticles();
  return (
    <main id="main">
      <PageIntro eyebrow="Insights" title={insights.title} lead={insights.intro} />
      <Section theme="light" id="articles">
        <div className="c-index" data-reveal-group>
          {articles.map((a) => (
            <article className="c-index__item" key={a.slug}>
              <p className="c-index__date">
                <time dateTime={a.date}>{formatDate(a.date)}</time>
                {a.readingMinutes ? ` · ${a.readingMinutes} min` : ""}
              </p>
              <h2 className="c-index__title">
                <SmartLink href={`/insights/${a.slug}`}>{a.title}</SmartLink>
              </h2>
              <p className="c-index__excerpt">{a.excerpt}</p>
              {a.tags?.length ? (
                <ul className="c-tags" style={{ marginTop: "var(--space-tiny)" }}>
                  {a.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </Section>
      <ClosingBand headline="A question these notes do not answer?" />
    </main>
  );
}
