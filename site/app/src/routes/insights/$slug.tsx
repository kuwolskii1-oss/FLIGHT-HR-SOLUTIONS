import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageMotion } from "@/components/site/PageMotion";

import { StructuredData } from "@/components/StructuredData";
import { ClosingBand } from "@/components/site/ClosingBand";
import { PageIntro } from "@/components/site/PageIntro";
import { Prose } from "@/components/site/Prose";
import { Section } from "@/components/site/Section";
import { SmartLink } from "@/components/site/SmartLink";
import { SITE_URL } from "@/site/config";
import { findArticle, site, sortedArticles } from "@/site/content";
import { pageHead } from "@/site/seo";
import { formatDate } from "@/site/format";

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const article = findArticle(params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead({
          title: loaderData.title,
          description: loaderData.excerpt,
          path: `/insights/${loaderData.slug}`,
          type: "article",
          publishedTime: loaderData.date,
        })
      : {},
  component: ArticlePage,
});

function ArticlePage() {
  const a = Route.useLoaderData();
  const others = sortedArticles()
    .filter((x) => x.slug !== a.slug)
    .slice(0, 3);
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: "en",
    url: `${SITE_URL}/insights/${a.slug}`,
    image: a.image ? `${SITE_URL}/assets/img/${a.image.src}-1800.webp` : `${SITE_URL}/og/home.jpg`,
    author: { "@type": "Organization", name: site.company.legalName, url: SITE_URL },
    publisher: { "@type": "Organization", name: site.company.legalName, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` } },
  });
  return (
    <main id="main" tabIndex={-1}>
      <StructuredData json={schema} />
      <PageIntro
        eyebrow={`${formatDate(a.date)}${a.readingMinutes ? ` · ${a.readingMinutes} min read` : ""}`}
        title={a.title}
        lead={a.excerpt}
        meta={a.tags}
        theme="light"
        image={a.image?.src}
        imageAlt={a.image?.alt}
      />
      <Section theme="light" id="article" as="article" tight>
        <div className="o-grid">
          <div style={{ gridColumn: "1 / -1" }}>
            <Prose sections={a.sections} />
            {a.sources?.length ? (
              <div style={{ marginTop: "var(--space-large)", maxWidth: "var(--measure)" }}>
                <h2 className="c-h4">Sources</h2>
                <ol className="c-prose" style={{ marginTop: "var(--space-tiny)", paddingLeft: "1.2rem", listStyle: "decimal" }}>
                  {a.sources.map((s, i) => (
                    <li key={i} className="c-caption">
                      {/^https?:/.test(s) ? (
                        <a href={s} target="_blank" rel="noopener noreferrer">
                          {s}
                        </a>
                      ) : (
                        s
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        </div>
      </Section>
      {others.length ? (
        <Section theme="light" id="more" raised tight>
          <h2 className="c-h3" style={{ marginBottom: "var(--space-medium)" }}>
            More insights
          </h2>
          <div className="c-index">
            {others.map((o) => (
              <article className="c-index__item" key={o.slug}>
                <p className="c-index__date">
                  <time dateTime={o.date}>{formatDate(o.date)}</time>
                </p>
                <h3 className="c-index__title">
                  <SmartLink href={`/insights/${o.slug}`}>{o.title}</SmartLink>
                </h3>
              </article>
            ))}
          </div>
        </Section>
      ) : null}
      <ClosingBand headline="Talk to us about your next shop visit" />
      <PageMotion />
    </main>
  );
}
