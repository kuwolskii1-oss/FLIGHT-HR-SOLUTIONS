import { memo, type SVGProps } from "react";
import type { Door } from "@/site/types";
import type { PvConfig } from "@/site/parts/request";
import { site } from "@/site/data/site";
import { whatsappLink } from "./DoorForm";
import { Close } from "./Icons";
import { Pictogram } from "./Pictogram";

/**
 * The part request dialog of the engine families viewer (Parts page), as SSR markup only. The
 * behaviour lives in src/site/parts/request.ts (`mountPartsRequest(root)`), a plain module that
 * also runs in the no-login preview, where React effects never run. So this component holds no
 * state and renders the whole skeleton: the family chip, the title, Close, the step list and
 * three step forms (part numbers, condition, aircraft on ground). The part rows are built by
 * request.ts from the in-memory draft. Every string comes from the content: the viewer strings in
 * parts.json and the Parts form's own field labels, options and hint, so the two cannot drift.
 *
 * Rendered by PartsViewer inside `<section class="c-pv" data-pv data-pv-config=…>`; request.ts
 * finds everything by class and data attributes, never by id (the preview renames ids).
 */

const STEPS = ["parts", "condition", "aog"] as const;

/**
 * The JSON the viewer section carries in `data-pv-config` (the contract between the viewer and
 * the request dialog). PartsViewer may use this helper so the shape cannot drift.
 */
export function partsViewerConfig(door: Door): PvConfig | null {
  const v = door.viewer;
  if (!v) return null;
  const pick = (name: string) => {
    const f = door.form.fields.find((x) => x.name === name);
    return f ? { label: f.label, options: f.options, hint: f.hint } : undefined;
  };
  const [partNumber, quantity, condition, aog] = ["partNumber", "quantity", "condition", "aog"].map(pick);
  if (!partNumber || !quantity || !condition || !aog) return null;
  return {
    families: v.families,
    strings: v,
    fields: { partNumber, quantity, condition, aog },
    whatsapp: site.company.whatsapp,
    template: site.whatsappTemplates.aog,
  };
}

const icon = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};
function Plus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...icon} {...props}>
      <path d="M10 4.5v11M4.5 10h11" />
    </svg>
  );
}
function Check(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...icon} strokeWidth={2} {...props}>
      <path d="M4.5 10.5l3.6 3.6L15.5 6.5" />
    </svg>
  );
}
function Back(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...icon} {...props}>
      <path d="M12 5l-5 5 5 5" />
    </svg>
  );
}

/** The site's navy pill with the rolling label and the arrow chip (CtaTalk small), as a submit button. */
function NextButton({ label }: { label: string }) {
  return (
    <button type="submit" className="c-cta-talk c-cta-talk--small c-preq__next">
      <span className="c-roll">
        <span className="c-roll__line">{label}</span>
        <span className="c-roll__line" aria-hidden="true">
          {label}
        </span>
      </span>
      <span className="c-chip" aria-hidden="true">
        <Pictogram name="left-arrow" className="c-chip__a" />
        <Pictogram name="left-arrow" className="c-chip__b" />
      </span>
    </button>
  );
}

function Foot({ back, next }: { back?: string; next: string }) {
  return (
    <div className="c-preq__foot">
      {back ? (
        <button type="button" className="c-preq__back" data-preq-back>
          <Back className="c-preq__back-icon" />
          {back}
        </button>
      ) : null}
      <NextButton label={next} />
    </div>
  );
}

/** The markup of Segmented.tsx (same classes, so it looks identical), without React state. */
function SegmentedMarkup({ name, options, labelledBy, describedBy }: { name: string; options: string[]; labelledBy: string; describedBy?: string }) {
  return (
    <div
      className={`c-segmented t-tabs c-preq__seg c-preq__seg--${options.length}`}
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-required="true"
      data-preq-seg={name}
    >
      <span className="t-tabs-pill" aria-hidden="true" />
      {options.map((o) => (
        <label className="c-segmented__option t-tab" key={o}>
          <input type="radio" name={name} value={o} />
          <span>{o}</span>
        </label>
      ))}
    </div>
  );
}

export const PartsRequestDialog = memo(function PartsRequestDialog({ door }: { door: Door }) {
  const v = door.viewer;
  if (!v) return null;
  const field = (name: string) => door.form.fields.find((f) => f.name === name);
  const condition = field("condition");
  const aog = field("aog");
  const base = `${v.id}-request`;
  const wa = whatsappLink(site.company.whatsapp, site.whatsappTemplates.aog);

  return (
    <dialog className="c-preq" data-preq data-theme="light" id={base} aria-labelledby={`${base}-title ${base}-family`}>
      <div className="c-preq__panel">
        <div className="c-preq__head">
          <p className="c-preq__family" id={`${base}-family`}>
            <span className="c-preq__dot" aria-hidden="true" />
            <span data-preq-family>{v.families[0]?.name}</span>
          </p>
          <h2 className="c-preq__title" id={`${base}-title`}>
            {v.requestTitle}
          </h2>
          <button type="button" className="c-preq__close" data-preq-close aria-label={v.close}>
            <Close width={20} height={20} />
          </button>
        </div>

        <ol className="c-preq__steps">
          {STEPS.map((s, i) => (
            <li className="c-preq__step" key={s} data-preq-indicator={s} aria-current={i === 0 ? "step" : undefined}>
              <span className="c-preq__step-bar" aria-hidden="true" />
              <span className="c-preq__step-name">
                <Check className="c-preq__step-check" width={14} height={14} />
                {v.steps[s]}
              </span>
              <span className="c-preq__step-sum" data-preq-summary />
            </li>
          ))}
        </ol>

        <form className="c-preq__form" data-preq-step="parts" noValidate>
          <h3 className="c-preq__h" id={`${base}-parts-h`} tabIndex={-1}>
            {v.steps.parts}
          </h3>
          <ol className="c-preq__rows" data-preq-rows />
          <button type="button" className="c-preq__add" data-preq-add>
            <span className="c-preq__add-icon" aria-hidden="true">
              <Plus width={16} height={16} />
            </span>
            {v.addRow}
          </button>
          <p className="c-preq__limit" data-preq-limit role="status" />
          <div className="c-preq__also" data-preq-also hidden>
            <span className="c-preq__also-label">{v.alsoIn}</span>
            <ul className="c-preq__also-list" data-preq-also-list />
          </div>
          <Foot next={v.next} />
        </form>

        <form className="c-preq__form" data-preq-step="condition" noValidate hidden>
          <h3 className="c-preq__h" id={`${base}-condition-h`} tabIndex={-1}>
            {v.steps.condition}
          </h3>
          <div className="c-field t-input-wrap c-preq__choice" data-field="condition">
            <SegmentedMarkup name="condition" options={condition?.options ?? []} labelledBy={`${base}-condition-h`} />
            <p className="c-field__error t-error-msg" id={`${base}-condition-error`} aria-live="polite" />
          </div>
          <Foot back={v.back} next={v.next} />
        </form>

        <form className="c-preq__form" data-preq-step="aog" noValidate hidden>
          <h3 className="c-preq__h" id={`${base}-aog-h`} tabIndex={-1}>
            {v.steps.aog}
          </h3>
          <div className="c-field t-input-wrap c-preq__choice" data-field="aog">
            <SegmentedMarkup
              name="aog"
              options={aog?.options ?? []}
              labelledBy={`${base}-aog-h`}
              describedBy={aog?.hint ? `${base}-aog-hint` : undefined}
            />
            {aog?.hint ? (
              <p className="c-field__hint" id={`${base}-aog-hint`}>
                {aog.hint}
              </p>
            ) : null}
            <p className="c-field__error t-error-msg" id={`${base}-aog-error`} aria-live="polite" />
          </div>
          {/* The form's WhatsApp line, shown when Yes is chosen and the number exists. request.ts
              fills the message with the part numbers typed so far. */}
          <div role="status" className="c-preq__wa-live">
            <p className="c-form__aog c-preq__wa" data-preq-wa hidden>
              {site.aogWhatsApp.before}{" "}
              <a href={wa ?? undefined} data-preq-wa-link target="_blank" rel="noopener noreferrer">
                {site.aogWhatsApp.link}
              </a>
              {site.aogWhatsApp.after}
            </p>
          </div>
          <Foot back={v.back} next={v.finish} />
        </form>
      </div>
    </dialog>
  );
});
