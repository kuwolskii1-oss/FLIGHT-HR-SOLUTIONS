import type { ReactNode } from "react";

type Theme = "light" | "dark" | "deep";

export function Section({
  theme = "light",
  id,
  className = "",
  tight,
  flush,
  raised,
  children,
  as: Tag = "section",
  ariaLabelledby,
}: {
  theme?: Theme;
  id?: string;
  className?: string;
  tight?: boolean;
  flush?: boolean;
  raised?: boolean;
  children: ReactNode;
  as?: "section" | "div" | "article" | "aside";
  ariaLabelledby?: string;
}) {
  const cls = [
    "o-section",
    tight ? "o-section--tight" : "",
    flush ? "o-section--flush" : "",
    raised ? "o-section--raised" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag id={id} data-theme={theme} className={cls} aria-labelledby={ariaLabelledby}>
      <div className="o-container">{children}</div>
    </Tag>
  );
}

export function SectionHead({
  eyebrow,
  title,
  intro,
  id,
  level = 2,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  id?: string;
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div className="c-section-head">
      <div className="c-section-head__title" data-reveal>
        {eyebrow ? <span className="c-eyebrow">{eyebrow}</span> : null}
        <Heading id={id} className={level === 1 ? "c-h1" : "c-h2"}>
          {title}
        </Heading>
      </div>
      {intro ? (
        <p className="c-section-head__intro c-lead c-muted" data-reveal>
          {intro}
        </p>
      ) : null}
    </div>
  );
}
