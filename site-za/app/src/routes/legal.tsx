import { createFileRoute } from "@tanstack/react-router";
import { Prose } from "@/components/site/Prose";
import { legal } from "@/site/data/legal";
import { pageHead } from "@/site/seo";
import { ScrollCraftMount } from "@/components/site/ScrollCraftMount";

const IDS: Record<string, string> = { company: "company", disclaimer: "disclaimer", paia: "paia" };

export const Route = createFileRoute("/legal")({
  loader: () => ({ title: "Legal", description: "Company details, the charter operator disclaimer, PAIA and website terms for Flight Hour Solution (Pty) Ltd." }),
  head: ({ loaderData }) => pageHead({ title: loaderData?.title ?? "Legal", description: loaderData?.description ?? "", path: "/legal", noindex: true }),
  component: Page,
});

function idFor(title: string) {
  const t = title.toLowerCase();
  if (/company/.test(t)) return IDS.company;
  if (/disclaimer|operator/.test(t)) return IDS.disclaimer;
  if (/paia/.test(t)) return IDS.paia;
  return t.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function Page() {
  const doc = legal.legal;
  return (
    <main id="main" tabIndex={-1}>
      <header data-theme="light" className="c-page-intro">
        <div className="o-container">
          <h1 className="c-h1 c-h1--inner c-page-intro__title">{doc.title}</h1>
          {doc.intro ? <p className="c-lead c-page-intro__lead">{doc.intro}</p> : null}
        </div>
      </header>
      <section data-theme="light" className="o-section">
        <div className="o-container">
          <Prose>
            {doc.sections.map((s) => (
              <section key={s.title} id={idFor(s.title)}>
                <h2>{s.title}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.lines?.length ? (
                  <ul>
                    {s.lines.map((l) => (
                      <li key={l}>{l}</li>
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
