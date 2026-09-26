import { useEffect, useRef, useState, type FormEvent } from "react";
import { site } from "@/site/data/site";
import type { Form, FormField } from "@/site/types";
import { submitEnquiry, type RouteKey } from "@/site/enquiry.functions";
import { CtaSubmit } from "./Cta";
import { Segmented } from "./Segmented";

type Status = { kind: "idle" } | { kind: "busy" } | { kind: "sent" } | { kind: "mailto"; href: string };

const AUTOCOMPLETE: Record<string, string> = {
  name: "name",
  company: "organization",
  organisation: "organization",
  email: "email",
  phone: "tel",
  role: "organization-title",
};
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** The AOG WhatsApp line under the form (the Parts request dialog shows the same line). */
export const AOG_WHATSAPP = {
  before: "For an aircraft on ground, the quickest route is WhatsApp.",
  link: "Send this request on WhatsApp",
  after: ". You can still send the form as well.",
};

/** A WhatsApp deep link with a prepared message, or null until the number exists in site.json. */
export function whatsappLink(number: string | undefined, text: string | undefined): string | null {
  const digits = (number ?? "").replace(/[^0-9]/g, "");
  return digits && text ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : null;
}

/** Dispatched on the form by src/site/parts/fill-form.ts after it wrote fields. */
const PREFILL_EVENT = "fhs:prefill";

/**
 * Renders any form described in the content (one per door, the waitlist and the general form).
 * Validation happens on submit: the first invalid field shakes, shows its message and takes
 * focus. A sent form shows the success check; without an email provider the visitor's mail
 * program opens with the request prepared for the door's inbox.
 *
 * Prefill: the Parts page's request dialog writes its answers straight into this uncontrolled
 * form, then dispatches `fhs:prefill` on it. The listener clears stale errors for the names it
 * wrote and keeps the filled note shown at the top of the form (fill-form reveals the same note
 * with plain DOM first, so it also works in the preview, which runs no React).
 */
export function DoorForm({ form, route, id = form.id, whatsappTemplate }: { form: Form; route: RouteKey; id?: string; whatsappTemplate?: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(form.fields.filter((f) => f.type === "segmented" && f.options?.length).map((f) => [f.name, ""])),
  );
  const [filled, setFilled] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const inbox = site.company.emails[route];

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const onPrefill = (e: Event) => {
      const detail = (e as CustomEvent<{ names?: string[]; note?: string }>).detail ?? {};
      const names = Array.isArray(detail.names) ? detail.names : [];
      if (names.length)
        setErrors((prev) => {
          if (!names.some((n) => n in prev)) return prev;
          const next = { ...prev };
          for (const n of names) delete next[n];
          return next;
        });
      if (detail.note) setFilled(detail.note);
    };
    el.addEventListener(PREFILL_EVENT, onPrefill);
    return () => el.removeEventListener(PREFILL_EVENT, onPrefill);
  }, [status.kind]);
  const visible = form.fields.filter((f) => !f.showWhen || values[f.showWhen.field] === f.showWhen.equals);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const el = e.currentTarget;
    const fd = new FormData(el);
    const v: Record<string, string> = {};
    for (const f of visible) v[f.name] = String(fd.get(f.name) ?? "").trim();
    const consent = fd.get("consent") === "on";
    const next: Record<string, string> = {};
    for (const f of visible) {
      const val = v[f.name] ?? "";
      if (f.required && !val) next[f.name] = f.type === "select" || f.type === "segmented" ? `Please choose ${f.label.toLowerCase()}.` : `Please fill in ${f.label.toLowerCase()}.`;
      else if (f.type === "email" && val && !EMAIL.test(val)) next[f.name] = "Please enter a valid email address.";
    }
    if (!consent) next.consent = "Please tick the consent box so that we may reply.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      const wrap = el.querySelector<HTMLElement>(`[data-field="${first}"]`);
      shake(wrap);
      wrap?.querySelector<HTMLElement>("input, select, textarea")?.focus({ preventScroll: false });
      return;
    }
    setStatus({ kind: "busy" });
    const lines = visible.map((f) => [f.label, v[f.name] ?? ""] as [string, string]);
    const replyTo = visible.find((f) => f.type === "email") ? v[visible.find((f) => f.type === "email")!.name] : "";
    const mailto = buildMailto(inbox, form.title, lines);
    try {
      const result = await submitEnquiry({
        data: { formId: form.id, formTitle: form.title, route, lines, replyTo: replyTo || `${route}@flighthoursolution.com`, consent: true, website: String(fd.get("website") ?? "") },
      });
      if (result.ok) {
        setStatus({ kind: "sent" });
        el.reset();
      } else {
        setStatus({ kind: "mailto", href: mailto });
        window.location.assign(mailto);
      }
    } catch {
      setStatus({ kind: "mailto", href: mailto });
    }
  };

  if (status.kind === "sent") {
    return (
      <div className="c-form__status c-form__sent" role="status" id={`${id}-sent`}>
        <SuccessCheck />
        <div>
          <h3 className="c-h4">{form.successTitle}</h3>
          <p style={{ marginTop: "0.5rem" }}>{form.successText}</p>
        </div>
      </div>
    );
  }

  const fieldId = (f: FormField) => `${id}-${f.name}`;
  const describedBy = (f: FormField) => [errors[f.name] ? `${fieldId(f)}-error` : "", f.hint ? `${fieldId(f)}-hint` : ""].filter(Boolean).join(" ") || undefined;
  const control = (f: FormField) => {
    const common = {
      id: fieldId(f),
      name: f.name,
      required: f.required,
      "aria-required": f.required || undefined,
      "aria-invalid": errors[f.name] ? true : undefined,
      "aria-describedby": describedBy(f),
      autoComplete: AUTOCOMPLETE[f.name],
      placeholder: f.placeholder,
    };
    if (f.type === "textarea" || f.type === "file") return <textarea className="c-field__textarea t-input" rows={f.type === "file" ? 5 : 4} {...common} />;
    if (f.type === "select")
      return (
        <select className="c-field__select t-input" defaultValue="" {...common}>
          <option value="">Please choose</option>
          {(f.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    if (f.type === "segmented" || f.type === "radio")
      return (
        <Segmented
          name={f.name}
          idBase={fieldId(f)}
          labelledBy={`${fieldId(f)}-label`}
          options={f.options ?? []}
          value={values[f.name] ?? ""}
          onChange={(val) => setValues((s) => ({ ...s, [f.name]: val }))}
          invalid={!!errors[f.name]}
          describedBy={describedBy(f)}
        />
      );
    return <input className="c-field__input t-input" type={f.type === "checkbox" ? "text" : f.type} inputMode={f.type === "tel" ? "tel" : f.type === "number" ? "numeric" : undefined} {...common} />;
  };

  const wa = whatsappLink(site.company.whatsapp, whatsappTemplate);
  const aog = visible.find((f) => f.name === "aog");
  const aogYes = aog && /^yes/i.test(values.aog ?? "");

  return (
    <form ref={formRef} className="c-form" onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`} id={id}>
      {/* Hidden until a request from the engine families viewer fills the form (fill-form.ts). */}
      <p className="c-form__filled" data-form-filled tabIndex={-1} role="status" hidden={!filled}>
        <span className="c-form__filled-icon" aria-hidden="true">
          <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" focusable="false">
            <path d="M4.5 10.5l3.6 3.6L15.5 6.5" />
          </svg>
        </span>
        <span data-form-filled-text>{filled}</span>
      </p>
      {form.intro ? <p className="c-form__intro">{form.intro}</p> : null}
      <div className="c-form__grid">
        {visible.map((f) => (
          <div className={`c-field t-input-wrap${errors[f.name] ? " is-error" : ""}${f.width === "half" ? " c-field--half" : ""}`} key={f.name} data-field={f.name}>
            <label
              className="c-field__label"
              id={f.type === "segmented" || f.type === "radio" ? `${fieldId(f)}-label` : undefined}
              htmlFor={f.type === "segmented" || f.type === "radio" ? `${fieldId(f)}-0` : fieldId(f)}
            >
              {f.label} {f.required ? null : <small>(optional)</small>}
            </label>
            {control(f)}
            {f.hint ? (
              <p className="c-field__hint" id={`${fieldId(f)}-hint`}>
                {f.hint}
              </p>
            ) : null}
            <p className="c-field__error t-error-msg" id={`${fieldId(f)}-error`} aria-live="polite">
              {errors[f.name] ?? ""}
            </p>
          </div>
        ))}
      </div>
      {aogYes && wa ? (
        <p className="c-form__aog" role="status">
          {AOG_WHATSAPP.before}{" "}
          <a href={wa} target="_blank" rel="noopener noreferrer">
            {AOG_WHATSAPP.link}
          </a>
          {AOG_WHATSAPP.after}
        </p>
      ) : null}
      <div className="u-visually-hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className={`c-field c-field--check t-input-wrap${errors.consent ? " is-error" : ""}`} data-field="consent">
        <label className="c-check t-check" htmlFor={`${id}-consent`}>
          <input id={`${id}-consent`} name="consent" type="checkbox" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? `${id}-consent-error` : undefined} />
          <span className="c-check__box" aria-hidden="true">
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6.4l2.6 2.6L10 3.4" />
            </svg>
          </span>
          <span className="c-check__text">
            {consentWithLink(form.consentText)}
          </span>
        </label>
        <p className="c-field__error t-error-msg" id={`${id}-consent-error`} aria-live="polite">
          {errors.consent ?? ""}
        </p>
      </div>
      {form.currencyNote ? <p className="c-caption c-form__note">{form.currencyNote}</p> : null}
      <CtaSubmit label={form.submitLabel} busy={status.kind === "busy"} />
      {form.disclaimer ? <p className="c-caption c-form__disclaimer">{form.disclaimer}</p> : null}
      {form.responsePromise ? <p className="c-caption c-form__note">{form.responsePromise}</p> : null}
      {status.kind === "mailto" ? (
        <div className="c-form__status" role="status">
          <p>
            Your email program should now open with the request prepared. If it did not,{" "}
            <a href={status.href} style={{ textDecoration: "underline" }}>
              open the prepared email
            </a>{" "}
            or write to <a href={`mailto:${inbox}`}>{inbox}</a>.
          </p>
        </div>
      ) : null}
    </form>
  );
}

/** The consent sentence links the words "privacy notice" when they appear. */
function consentWithLink(text: string) {
  const m = text.match(/privacy notice/i);
  if (!m || m.index === undefined) return text;
  return (
    <>
      {text.slice(0, m.index)}
      <a href="/privacy">{m[0]}</a>
      {text.slice(m.index + m[0].length)}
    </>
  );
}

function shake(wrap: HTMLElement | null | undefined) {
  const input = wrap?.querySelector<HTMLElement>(".t-input, .c-segmented, .c-check");
  if (!input) return;
  input.classList.remove("is-shaking");
  void input.offsetWidth;
  input.classList.add("is-shaking");
  window.setTimeout(() => input.classList.remove("is-shaking"), 320);
}

function SuccessCheck() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const path = ref.current?.querySelector("path");
    if (path) {
      const len = Math.ceil(path.getTotalLength()) + 1;
      path.style.setProperty("--check-len", String(len));
    }
    const t = window.setTimeout(() => ref.current?.setAttribute("data-state", "in"), 20);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <span ref={ref} className="t-success-check c-form__check" data-state="out" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 25.5l9.5 9.5L38 14" />
      </svg>
    </span>
  );
}

function buildMailto(to: string, title: string, lines: [string, string][]) {
  const body = lines.map(([k, v]) => `${k}: ${v}`).join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(`${title} (website)`)}&body=${encodeURIComponent(body)}`;
}
