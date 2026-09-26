import type { CSSProperties } from "react";
import type { Step } from "@/site/types";
import { CtaLink } from "./Cta";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * Steps in two devices.
 *
 * Up to six steps: a pinned act drawn as a staircase (stairs.css). The step names stand on the
 * stairs, which run down from the heading to the call to action, and one line walks down them as
 * the act plays: it lights each name as it reaches it and shows that step's words, and an orange
 * dot marks where it is, as the navigation's orange dots mark the page you are on. All the steps
 * are on screen from the start, so the section reads at a glance, and the line ends at the next
 * thing to do. Everything reads the act's progress (--sc-p) in CSS, so it scrubs with the scroll,
 * needs no script of its own and runs the same in the preview. Under reduced motion, or without
 * the engine, the stairs show drawn to the end with every step's words.
 *
 * More than six: a flowing list whose progress rule is drawn from the act's own progress.
 */
export function Steps({
  steps,
  title,
  intro,
  id,
  theme = "light",
  // The stairs need two steps at least, and more than six will not fit one screen.
  pinned = steps.length >= 2 && steps.length <= 6,
  cta,
}: {
  steps: Step[];
  title: string;
  intro?: string;
  id?: string;
  theme?: "light" | "dark" | "deep";
  pinned?: boolean;
  /** A link at the foot of the stairs, where the line ends. */
  cta?: { label: string; href: string };
}) {
  if (pinned) {
    const n = steps.length;
    // One viewport of pinned travel for five steps: enough to watch the line reach each one.
    const span = (1.4 + 0.16 * n).toFixed(2);
    return (
      <section
        id={id}
        data-theme={theme}
        className="c-stairs"
        data-sc-act="pin"
        data-sc-span={span}
        aria-labelledby={id ? `${id}-title` : undefined}
      >
        <div data-sc-stage className="c-stairs__stage">
          <div className="o-container c-stairs__inner" style={{ "--n": n } as Vars}>
            <div className="c-stairs__head">
              <h2 id={id ? `${id}-title` : undefined} className="c-h2 c-h2--xl">
                {title}
              </h2>
              {intro ? <p className="c-lead c-muted c-stairs__intro">{intro}</p> : null}
            </div>
            <ol className="c-stairs__list" aria-label={`${title}, ${n} steps`}>
              {steps.map((s, i) => (
                <li
                  className="c-stair"
                  key={s.n}
                  style={{ "--i": i, "--last": i === n - 1 ? 1 : 0 } as Vars}
                >
                  <span className="c-stair__title">{s.title}</span>
                  <span className="c-stair__text">{s.text}</span>
                  <span className="c-stair__tip" aria-hidden="true" />
                </li>
              ))}
            </ol>
            {cta ? (
              <div className="c-stairs__cta">
                <CtaLink href={cta.href} label={cta.label} />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section
      id={id}
      data-theme={theme}
      className="o-section"
      data-sc-act="flow"
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <div className="o-container">
        <div className="c-section-head">
          <div className="c-section-head__title">
            <h2 id={id ? `${id}-title` : undefined} className="c-h2">
              {title}
            </h2>
          </div>
          {intro ? <p className="c-section-head__intro c-lead c-muted">{intro}</p> : null}
        </div>
        <ol
          className="c-steps c-steps--flow"
          style={{ ["--progress" as string]: "var(--sc-p, 0)" }}
        >
          <span className="c-steps__rule" aria-hidden="true" />
          {steps.map((s) => (
            <li className="c-step is-active" key={s.n} data-sc-in>
              <span className="c-step__n">Step {s.n}</span>
              <span className="c-step__title">{s.title}</span>
              <span className="c-step__text">{s.text}</span>
            </li>
          ))}
        </ol>
        {cta ? (
          <div style={{ marginTop: "var(--space-large)" }}>
            <CtaLink href={cta.href} label={cta.label} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
