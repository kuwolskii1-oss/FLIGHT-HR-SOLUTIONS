import { createFileRoute } from "@tanstack/react-router";
import { PageMotion } from "@/components/site/PageMotion";

import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageIntro } from "@/components/site/PageIntro";
import { Section, SectionHead } from "@/components/site/Section";
import { Steps } from "@/components/site/Steps";
import { assets } from "@/site/data/assets";
import { contact } from "@/site/data/contact";
import { pageHead } from "@/site/seo";
import { capitalise, formatDate } from "@/site/format";

export const Route = createFileRoute("/assets")({
  loader: () => ({ title: assets.seoTitle.replace(/\s*\|\s*Flight Hour Solution$/i, ""), description: assets.metaDescription }),
  head: ({ loaderData }) => pageHead({ title: loaderData?.title ?? "Assets", description: loaderData?.description ?? "", path: "/assets" }),
  component: AssetsPage,
});

function AssetsPage() {
  return (
    <main id="main" tabIndex={-1}>
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
                    <td className="c-mono">
                      <time dateTime={r.date}>{formatDate(r.date)}</time>
                    </td>
                    <td className="c-mono">{capitalise(r.type)}</td>
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
            <EnquiryForm
              form={assets.requestForm ? { ...contact.form, fields: assets.requestForm.fields } : contact.form}
              id="asset-request"
              variant="asset"
            />
          </div>
        </div>
      </Section>
      <PageMotion />
    </main>
  );
}
