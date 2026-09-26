import { useEffect, useRef } from "react";
import type { Door } from "@/site/types";
import { site } from "@/site/data/site";
import { POSTER_TALL_MEDIA, posterFiles, STOPS } from "@/site/parts/viewer-config";
import { Pictogram } from "./Pictogram";

/**
 * Parts by engine family: an illustrative turbofan on a transport stand that turns to each engine
 * family, with a callout that opens the part request. This component renders the server markup
 * only (poster, tablist, callout, caption); the behaviour lives in plain DOM modules that its
 * effect loads (src/site/parts/viewer.ts, and three.js through scene.ts only when WebGL is usable),
 * so the no-login preview can mount the same modules without React.
 *
 * Configuration for the viewer and the request dialog travels in one data-pv-config attribute.
 */
export function PartsViewer({ door }: { door: Door }) {
  const ref = useRef<HTMLElement>(null);
  const viewer = door.viewer;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let cancelled = false;
    const cleanups: (() => void)[] = [];
    // The SSR guard is a build-time constant: it keeps the viewer (and three.js behind it) out of
    // the Worker bundle, where effects never run anyway.
    if (!import.meta.env.SSR) {
      void import("@/site/parts/viewer").then((m) => {
        if (cancelled) return;
        cleanups.push(m.mountPartsViewer(root));
      });
      // Builder B: the request dialog mounts here on the same root, as
      // import("@/site/parts/request").then((m) => { if (!cancelled) cleanups.push(m.mountPartsRequest(root)); })
    }
    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  if (!viewer) return null;
  const id = viewer.id;
  const titleId = `${id}-title`;
  const panelId = `${id}-panel`;
  const tabId = (key: string) => `${id}-tab-${key}`;
  const first = viewer.families[0];
  const files = posterFiles(first.key, STOPS[0]);

  const field = (name: string) => {
    const f = door.form.fields.find((x) => x.name === name);
    return f ? { label: f.label, options: f.options, hint: f.hint } : undefined;
  };
  const config = {
    families: viewer.families,
    strings: viewer,
    fields: {
      partNumber: field("partNumber"),
      quantity: field("quantity"),
      condition: field("condition"),
      aog: field("aog"),
    },
    whatsapp: site.company.whatsapp,
    template: site.whatsappTemplates.aog,
  };

  return (
    <section
      ref={ref}
      id={id}
      className="o-section c-pv"
      data-theme="light"
      data-sc-act="flow"
      aria-labelledby={titleId}
      data-pv=""
      data-pv-config={JSON.stringify(config)}
      data-stop={STOPS[0]}
      data-family="0"
    >
      <div className="o-container">
        <div className="c-stackhead" data-sc-in>
          <h2 id={titleId} className="c-h2 c-h2--xl">
            {viewer.title}
          </h2>
          <p className="c-lead c-muted">{viewer.intro}</p>
        </div>

        <div className="c-pv__stage" data-pv-stage>
          {/* Picture layers: the poster (server rendered), the live canvas (added by viewer.ts) and
              the leader line. All decorative: the tab panel below carries the text equivalent. */}
          <div className="c-pv__media" aria-hidden="true">
            <picture>
              <source media={POSTER_TALL_MEDIA} srcSet={files.tall800} width={800} height={1000} data-pv-poster-tall="" />
              <img
                className="c-pv__poster"
                data-pv-poster=""
                src={files.wide1600}
                srcSet={`${files.wide800} 800w, ${files.wide1600} 1600w`}
                sizes="(min-width: 1440px) 1360px, 100vw"
                width={1600}
                height={680}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div className="c-pv__gl" data-pv-gl="" />
            <svg className="c-pv__lines" data-pv-lines="" focusable="false">
              <path className="c-pv__leader c-pv__leader--halo" data-pv-leader="" d="" />
              <path className="c-pv__leader" data-pv-leader="" d="" />
              <g className="c-pv__dot" data-pv-dot="">
                <circle className="c-pv__dot-halo" r="11" />
                <circle className="c-pv__dot-core" r="4.5" />
              </g>
            </svg>
          </div>

          <div className="c-pv__bar" data-pv-bar="">
            <button type="button" className="c-pv__turn c-pv__turn--prev" data-pv-prev="" aria-label={viewer.previousFamily}>
              <Pictogram name="left-arrow" size={20} />
            </button>
            <div className="c-pv__tabs t-tabs" role="tablist" aria-labelledby={titleId} data-pv-tabs="">
              <span className="t-tabs-pill c-pv__pill" aria-hidden="true" />
              {viewer.families.map((f, i) => (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  id={tabId(f.key)}
                  className="c-pv__tab t-tab"
                  aria-selected={i === 0}
                  aria-controls={panelId}
                  tabIndex={i === 0 ? 0 : -1}
                  data-pv-tab={f.key}
                >
                  {f.name}
                </button>
              ))}
            </div>
            <button type="button" className="c-pv__turn c-pv__turn--next" data-pv-next="" aria-label={viewer.nextFamily}>
              <Pictogram name="left-arrow" size={20} />
            </button>
          </div>

          <div className="c-pv__panel" role="tabpanel" id={panelId} aria-labelledby={tabId(first.key)} data-pv-panel="">
            <p className="c-pv__caption" data-pv-caption="">
              <span className="u-visually-hidden" data-pv-name="sentence">
                {`${first.name}. `}
              </span>
              {viewer.illustration}
            </p>
            <button type="button" className="c-pv__callout" data-pv-callout="">
              <span className="c-pv__callout-text">
                <span className="c-pv__callout-family" data-pv-name="">
                  {first.name}
                </span>{" "}
                <span className="c-pv__callout-prompt" data-pv-prompt="">
                  {viewer.prompt}
                </span>
              </span>
              <span className="c-chip" aria-hidden="true">
                <Pictogram name="left-arrow" className="c-chip__a" />
                <Pictogram name="left-arrow" className="c-chip__b" />
              </span>
            </button>
          </div>

          <p className="u-visually-hidden" aria-live="polite" data-pv-live="" />
        </div>

        <p className="c-pv__hint">{viewer.hint}</p>

        {/* Builder B's request dialog renders here, inside this section so request.ts finds it
            from the root: <PartsRequestDialog door={door} /> (src/components/site/PartsRequestDialog.tsx). */}
      </div>
    </section>
  );
}
