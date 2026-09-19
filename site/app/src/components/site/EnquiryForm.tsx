import { useState, type FormEvent } from "react";
import { site } from "@/site/content";
import type { ContactContent } from "@/site/types";
import { submitEnquiry } from "@/site/enquiry.functions";
import { CtaSubmit } from "./Cta";

type Status =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "sent" }
  | { kind: "mailto"; href: string }
  | { kind: "error"; message: string };

const FIELD_KEYS = ["name", "company", "role", "email", "phone", "engineFamily", "need", "message"] as const;

export function EnquiryForm({ form, id = "enquiry" }: { form: ContactContent["form"]; id?: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    for (const k of FIELD_KEYS) values[k] = String(fd.get(k) ?? "");
    const consent = fd.get("consent") === "on";
    const nextErrors: Record<string, string> = {};
    if (values.name.trim().length < 2) nextErrors.name = "Please enter your name.";
    if (!values.company.trim()) nextErrors.company = "Please enter your company.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) nextErrors.email = "Please enter a valid email address.";
    if (values.message.trim().length < 10) nextErrors.message = "Please tell us a little more (at least 10 characters).";
    if (!consent) nextErrors.consent = "Please confirm that we may use your details to reply.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus({ kind: "busy" });
    const mailto = buildMailto(values);
    try {
      const result = await submitEnquiry({
        data: { ...values, consent: true, website: String(fd.get("website") ?? "") },
      });
      if (result.ok) {
        setStatus({ kind: "sent" });
        e.currentTarget.reset();
      } else {
        setStatus({ kind: "mailto", href: mailto });
        window.location.href = mailto;
      }
    } catch {
      setStatus({ kind: "mailto", href: mailto });
    }
  };

  const fieldByName = (name: string) => form.fields.find((f) => f.name === name);
  const textField = (name: (typeof FIELD_KEYS)[number], type = "text", autoComplete?: string) => {
    const f = fieldByName(name);
    if (!f) return null;
    const err = errors[name];
    return (
      <div className="c-field">
        <label className="c-field__label" htmlFor={`${id}-${name}`}>
          {f.label} {f.required ? null : <small>(optional)</small>}
        </label>
        <input
          className="c-field__input"
          id={`${id}-${name}`}
          name={name}
          type={type}
          required={f.required}
          aria-required={f.required || undefined}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${id}-${name}-error` : undefined}
          autoComplete={autoComplete}
        />
        {err ? (
          <p className="c-field__error" id={`${id}-${name}-error`}>
            {err}
          </p>
        ) : null}
      </div>
    );
  };
  const selectField = (name: (typeof FIELD_KEYS)[number], fallbackOptions: string[]) => {
    const f = fieldByName(name);
    if (!f) return null;
    const options = f.options?.length ? f.options : fallbackOptions;
    return (
      <div className="c-field">
        <label className="c-field__label" htmlFor={`${id}-${name}`}>
          {f.label} {f.required ? null : <small>(optional)</small>}
        </label>
        <select className="c-field__select" id={`${id}-${name}`} name={name} defaultValue="">
          <option value="">Please choose</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );
  };

  if (status.kind === "sent") {
    return (
      <div className="c-form__status" role="status">
        <h3 className="c-h4">{form.successTitle}</h3>
        <p style={{ marginTop: "0.5rem" }}>{form.successText}</p>
      </div>
    );
  }

  const messageField = fieldByName("message");
  return (
    <form className="c-form" onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`}>
      <div className="c-form__row">
        {textField("name", "text", "name")}
        {textField("company", "organization", "organization")}
      </div>
      <div className="c-form__row">
        {textField("email", "email", "email")}
        {textField("phone", "tel", "tel")}
      </div>
      <div className="c-form__row">
        {textField("role", "text", "organization-title")}
        {selectField(
          "engineFamily",
          site.engineFamilies.map((f) => f.name),
        )}
      </div>
      {selectField("need", [])}
      {messageField ? (
        <div className="c-field">
          <label className="c-field__label" htmlFor={`${id}-message`}>
            {messageField.label}
          </label>
          <textarea
            className="c-field__textarea"
            id={`${id}-message`}
            name="message"
            required
            aria-required="true"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${id}-message-error` : `${id}-message-hint`}
          />
          {errors.message ? (
            <p className="c-field__error" id={`${id}-message-error`}>
              {errors.message}
            </p>
          ) : messageField.hint ? (
            <p className="c-field__hint" id={`${id}-message-hint`}>
              {messageField.hint}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="u-visually-hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="c-field c-field--check">
        <input
          id={`${id}-consent`}
          name="consent"
          type="checkbox"
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
        />
        <label className="c-field__label" htmlFor={`${id}-consent`}>
          {form.consentText}
          {errors.consent ? (
            <span className="c-field__error" id={`${id}-consent-error`} style={{ display: "block" }}>
              {errors.consent}
            </span>
          ) : null}
        </label>
      </div>
      <p className="c-caption">{form.responsePromise}</p>
      <CtaSubmit label={form.submitLabel} busy={status.kind === "busy"} />
      {status.kind === "mailto" ? (
        <div className="c-form__status" role="status">
          <p>
            Your email program should now open with the enquiry prepared. If it did not,{" "}
            <a href={status.href} style={{ textDecoration: "underline" }}>
              open the prepared email
            </a>{" "}
            or write to <a href={`mailto:${site.company.email}`}>{site.company.email}</a>.
          </p>
        </div>
      ) : null}
      {status.kind === "error" ? (
        <div className="c-form__status c-form__status--error" role="alert">
          <p>{status.message}</p>
        </div>
      ) : null}
    </form>
  );
}

function buildMailto(v: Record<string, string>) {
  const subject = `Website enquiry from ${v.name} (${v.company})`;
  const body = [
    `Name: ${v.name}`,
    `Company: ${v.company}`,
    v.role ? `Role: ${v.role}` : "",
    `Email: ${v.email}`,
    v.phone ? `Phone: ${v.phone}` : "",
    v.engineFamily ? `Engine family: ${v.engineFamily}` : "",
    v.need ? `Need: ${v.need}` : "",
    "",
    v.message,
  ]
    .filter(Boolean)
    .join("\n");
  return `mailto:${site.company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
