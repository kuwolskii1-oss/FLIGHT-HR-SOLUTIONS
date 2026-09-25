import { createFileRoute } from "@tanstack/react-router";
import { Prose } from "@/components/site/Prose";
import { legal } from "@/site/data/legal";
import { pageHead } from "@/site/seo";
import { ScrollCraftMount } from "@/components/site/ScrollCraftMount";

export const Route = createFileRoute("/privacy")({
  loader: () => ({ title: "Privacy notice", description: "How Flight Hour Solution (Pty) Ltd processes personal information under POPIA." }),
  head: ({ loaderData }) => pageHead({ title: loaderData?.title ?? "Privacy notice", description: loaderData?.description ?? "", path: "/privacy", noindex: true }),
  component: Page,
});

function Page() {
  const doc = legal.privacy;
  return (
    <main id="main" tabIndex={-1}>
      <header data-theme="dark" className="c-page-intro">
        <div className="o-container">
          <span className="c-eyebrow">Updated {doc.updated}</span>
          <h1 className="c-h1 c-h1--inner c-page-intro__title">{doc.title}</h1>
          <p className="c-lead c-page-intro__lead">{doc.intro}</p>
        </div>
      </header>
      <section data-theme="light" className="o-section">
        <div className="o-container">
          <Prose>
            {doc.sections.map((s) => (
              <section key={s.title}>
                <h2>{s.title}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.bullets?.length ? (
                  <ul>
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </Prose>
        </div>
      </section>
      <ScrollCraftMount />
    </main>
  );
}
