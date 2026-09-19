import type { ReactNode } from "react";
import { MediaFrame } from "./MediaFrame";

export function PageIntro({
  eyebrow,
  title,
  lead,
  meta,
  image,
  imageAlt,
  children,
  theme = "dark",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  meta?: string[];
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  theme?: "dark" | "light" | "deep";
}) {
  return (
    <header data-theme={theme} className="c-page-intro">
      <div className="o-container">
        <div className="o-grid">
          <div style={{ gridColumn: "1 / -1" }}>
            {eyebrow ? <span className="c-eyebrow">{eyebrow}</span> : null}
            <h1 className="c-h1 c-h1--inner c-page-intro__title" data-split>
              {title}
            </h1>
            {lead ? <p className="c-lead c-page-intro__lead">{lead}</p> : null}
            {meta?.length ? (
              <ul className="c-page-intro__meta">
                {meta.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            ) : null}
            {children}
          </div>
        </div>
        {image ? (
          <div className="c-page-intro__media">
            <MediaFrame image={image} alt={imageAlt} ratio="16x9" priority sizes="100vw" />
          </div>
        ) : null}
      </div>
    </header>
  );
}
