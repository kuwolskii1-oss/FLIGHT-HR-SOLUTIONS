import type { Faq as FaqItem } from "@/site/types";
import { StructuredData } from "@/components/StructuredData";

export function Faq({ items, title = "Questions we are asked" }: { items: FaqItem[]; title?: string }) {
  if (!items?.length) return null;
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });
  return (
    <div>
      <StructuredData json={json} />
      <h2 className="c-h3" style={{ marginBottom: "var(--space-medium)" }}>
        {title}
      </h2>
      <div className="c-faq">
        {items.map((f) => (
          <details className="c-faq__item" key={f.q}>
            <summary className="c-faq__q">{f.q}</summary>
            <p className="c-faq__a">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
