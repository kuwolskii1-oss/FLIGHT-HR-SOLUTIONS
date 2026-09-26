import type { CSSProperties } from "react";
import type { Step } from "@/site/types";
import { Pictogram } from "./Pictogram";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * Steps in two devices.
 *
 * Up to six steps: a pinned act drawn as one evening's flight (flightplan.css). The stage is a
 * rounded sky that goes from sunset to night as the act plays; the steps are waypoints on an arc
 * between two horizons; an aircraft flies the arc and reaches each waypoint as its step cues in,
 * and the step being read sits above the arc. Everything that moves reads the act's progress
 * (--sc-p) in CSS, so it scrubs with the scroll, needs no script of its own and runs the same in
 * the preview. Under reduced motion the act flows: the route is shown flown and every step is
 * listed.
 *
 * More than six: a flowing list whose progress rule is drawn from the act's own progress.
 */
export function Steps({
  steps,
  title,
  intro,
  id,
  theme = "light",
  // The flight plan needs two waypoints at least (the arc is shared out between them).
  pinned = steps.length >= 2 && steps.length <= 6,
}: {
  steps: Step[];
  title: string;
  intro?: string;
  id?: string;
  theme?: "light" | "dark" | "deep";
  pinned?: boolean;
}) {
  if (pinned) {
    const n = steps.length;
    const span = Math.max(1.6, 0.8 * n + 0.6).toFixed(1);
    // The waypoints spread over SWEEP degrees of the arc. The aircraft flies LEAD degrees ahead of
    // the waypoint it last passed, so it never sits on a number at rest, and it reaches the end of
    // its flight at `end`; after that the sky keeps darkening to the end of the act.
    const SWEEP = 120;
    const LEAD = 11;
    const end = ((n - 1) / n) * 0.86;
    // The progress at which the aircraft is over waypoint i (negative for the first: it has
    // already passed it when the act starts). The waypoint lights and its step cues in at that
    // moment, so the line, the lit number and the words always agree.
    const over = (i: number) => (i / (n - 1) - LEAD / SWEEP) * end;
    // A step fades out over the last RAMP of progress before the aircraft reaches the next
    // waypoint, and the next fades in over the RAMP after it, so two steps never overlap (the
    // engine's ramps are fractions of each cue's window). The first is lit from the act's first
    // frame, so the stage never shows the heading alone; the last holds to the end.
    const RAMP = 0.03;
    const cue = (i: number) => {
      const from = Math.max(0, over(i));
      const to = i === n - 1 ? 1.01 : over(i + 1);
      const ramp = Math.min(0.45, RAMP / (to - from)).toFixed(3);
      return `${from.toFixed(3)} ${to.toFixed(3)} ${i === 0 ? 0 : ramp} ${i === n - 1 ? 0 : ramp}`;
    };
    return (
      <section
        id={id}
        data-theme={theme}
        className="c-cuesteps"
        data-sc-act="pin"
        data-sc-span={span}
        aria-labelledby={id ? `${id}-title` : undefined}
      >
        <div data-sc-stage className="c-cuesteps__stage">
          <div
            className="c-dusk"
            data-theme="deep"
            style={
              {
                "--n": n,
                "--end": end.toFixed(3),
                "--sweep": `${SWEEP}deg`,
                "--lead": `${LEAD}deg`,
              } as Vars
            }
          >
            <div className="c-dusk__sky" aria-hidden="true">
              <span className="c-dusk__sunset" />
              <span className="c-dusk__stars" />
              <span className="c-dusk__sun" />
            </div>
            <div className="c-dusk__head">
              <h2 id={id ? `${id}-title` : undefined} className="c-dusk__title">
                {title}
              </h2>
              {intro ? <p className="c-dusk__intro">{intro}</p> : null}
            </div>
            <ol className="c-cuesteps__list" aria-label={`${title}, ${n} steps`}>
              {steps.map((s, i) => (
                <li className="c-cuestep" key={s.n} data-sc-cue={cue(i)} data-sc-rise="1.2">
                  {/* No number here: the lit waypoint on the arc carries it, and the list itself
                      is ordered for assistive technology. */}
                  <span className="c-cuestep__title">{s.title}</span>
                  <span className="c-cuestep__text">{s.text}</span>
                </li>
              ))}
            </ol>
            <div className="c-route" aria-hidden="true">
              <span className="c-route__track" />
              <span className="c-route__flown" />
              {steps.map((s, i) => (
                <span
                  key={s.n}
                  className="c-route__wpt"
                  style={{ "--i": i, "--over": over(i).toFixed(3) } as Vars}
                >
                  <span className="c-route__dot">{s.n}</span>
                  <span className="c-route__lbl">{s.title}</span>
                </span>
              ))}
              <span className="c-route__jet">
                <Pictogram name="airplane-mode" size="100%" />
              </span>
            </div>
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
      </div>
    </section>
  );
}
