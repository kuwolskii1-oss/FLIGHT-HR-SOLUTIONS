import { createFileRoute } from "@tanstack/react-router";

import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageIntro } from "@/components/site/PageIntro";
import { Section, SectionHead } from "@/components/site/Section";
import { Steps } from "@/components/site/Steps";
import { assets, contact } from "@/site/content";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/assets")({
  head: () => pageHead({ title: assets.seoTitle.replace(/\s*\|\s*Flight Hour Solution$/i, ""), description: assets.metaDescription, path: "/assets" }),
  component: AssetsPage,
});

function AssetsPage() {
  return (
    <main id="main">
      <PageIntro eyebrow="Assets" title={assets.title} lead={assets.intro} image="engine-cradle" />
      <Section theme="light" id="disclosure" tight>
        <div className="c-notice" style={{ maxWidth: "52rem" }}>
          <p>{assets.disclosure}</p>
        </div>
      </Section>
      <Section theme="dark" id="how">
        <SectionHead title="How it works" />
        <Steps steps={assets.howItWorks} />
      </Section>
      {assets.recentActivity?.length ? (
        <Section theme="light" id="activity" raised>
          <SectionHead eyebrow="Recent activity" title="Engines and aircraft recently offered or sought" />
          <div className="c-table-wrap">
            <table className="c-table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Offered or wanted</th>
                  <th scope="col">Asset</th>
                  <th scope="col">Detail</th>
                </tr>
              </thead>
              <tbody>
                {assets.recentActivity.map((r, i) => (
                  <tr key={i}>
                    <td className="c-mono">{r.date}</td>
                    <td className="c-mono">{r.type}</td>
                    <td>{r.item}</td>
                    <td>{r.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      ) : null}
      <Section theme="light" id="request">
        <div className="c-split">
          <div className="c-split__aside">
            <h2 id="asset-request-title" className="c-h2">
              {assets.requestForm?.title ?? "Request or offer an asset"}
            </h2>
            <p className="c-lead c-muted" style={{ marginTop: "var(--space-small)" }}>
              {assets.requestForm?.text ?? "Tell us what you are looking for or what you are selling."}
            </p>
          </div>
          <div className="c-split__main">
            <EnquiryForm form={contact.form} id="asset-request" />
          </div>
        </div>
      </Section>
    </main>
  );
}
