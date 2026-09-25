import type { Step } from "@/site/types";

/**
 * Steps in two devices. Up to six steps: a pinned act where each step cues in as the visitor
 * scrolls, one idea per screen. More than six: a flowing list whose progress rule is drawn from
 * the act's own progress (--sc-p), so the line fills as the list passes.
 */
export function Steps({ steps, title, intro, id, theme = "light", pinned = steps.length <= 6 }: { steps: Step[]; title: string; intro?: string; id?: string; theme?: "light" | "dark" | "deep"; pinned?: boolean }) {
  if (pinned) {
    const n = steps.length;
    const span = Math.max(1.6, 0.8 * n + 0.6).toFixed(1);
    return (
      <section id={id} data-theme={theme} className="c-cuesteps" data-sc-act="pin" data-sc-span={span} aria-labelledby={id ? `${id}-title` : undefined}>
        <div data-sc-stage className="c-cuesteps__stage">
          <div className="o-container c-cuesteps__inner">
            <div className="c-cuesteps__head" data-sc-cue="0 1 0">
              <h2 id={id ? `${id}-title` : undefined} className="c-h2">
                {title}
              </h2>
              {intro ? <p className="c-lead c-muted c-cuesteps__intro">{intro}</p> : null}
            </div>
            <ol className="c-cuesteps__list">
              {steps.map((s, i) => {
                const from = (i / n) * 0.86;
                const to = i === n - 1 ? undefined : ((i + 1) / n) * 0.86 + 0.12;
                const cue = to === undefined ? `${from.toFixed(2)}` : `${from.toFixed(2)} ${Math.min(0.98, to).toFixed(2)}`;
                return (
                  <li className="c-cuestep" key={s.n} data-sc-cue={cue} data-sc-rise="18">
                    <span className="c-cuestep__n">{s.n}</span>
                    <span className="c-cuestep__title">{s.title}</span>
                    <span className="c-cuestep__text">{s.text}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id={id} data-theme={theme} className="o-section" data-sc-act="flow" aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="o-container">
        <div className="c-section-head">
          <div className="c-section-head__title">
            <h2 id={id ? `${id}-title` : undefined} className="c-h2">
              {title}
            </h2>
          </div>
          {intro ? <p className="c-section-head__intro c-lead c-muted">{intro}</p> : null}
        </div>
        <ol className="c-steps c-steps--flow" style={{ ["--progress" as string]: "var(--sc-p, 0)" }}>
          <span className="c-steps__rule" aria-hidden="true" />
          {steps.map((s) => (
            <li className="c-step is-active" key={s.n} data-sc-in>
              <span className="c-step__n">Step {s.n}</span>
              <span className="c-step__title">{s.title}</span>
              <span className="c-step__text">{s.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
