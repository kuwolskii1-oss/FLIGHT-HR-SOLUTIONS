import { useState, type FormEvent } from "react";
import { site } from "@/site/data/site";
import type { ContactContent, FormField } from "@/site/types";
import { submitEnquiry } from "@/site/enquiry.functions";
import { CtaSubmit } from "./Cta";

type Status =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "sent" }
  | { kind: "mailto"; href: string }
  | { kind: "error"; message: string };

/* Every field the server accepts. A form renders the subset its content lists, in this order. */
const FIELD_KEYS = ["name", "company", "email", "phone", "role", "assetType", "assetModel", "engineFamily", "need", "message"] as const;
type FieldKey = (typeof FIELD_KEYS)[number];

const INPUT_TYPE: Partial<Record<FieldKey, string>> = { email: "email", phone: "tel" };
const AUTOCOMPLETE: Partial<Record<FieldKey, string>> = {
  name: "name",
  company: "organization",
  email: "email",
  phone: "tel",
  role: "organization-title",
};
const LINE_LABEL: Record<FieldKey, string> = {
  name: "Name",
  company: "Company",
  email: "Email",
  phone: "Phone",
  role: "Role",
  assetType: "Asset type",
  assetModel: "Engine or aircraft type",
  engineFamily: "Engine family",
  need: "Need",
  message: "Message",
};

export type EnquiryFormContent = Pick<
  ContactContent["form"],
  "fields" | "consentText" | "submitLabel" | "successTitle" | "successText" | "responsePromise"
>;

export function EnquiryForm({
  form,
  id = "enquiry",
  variant = "enquiry",
}: {
  form: EnquiryFormContent;
  id?: string;
  /** "asset" labels the email as an asset request (offered or wanted). */
  variant?: "enquiry" | "asset";
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fields = FIELD_KEYS.map((k) => form.fields.find((f) => f.name === k)).filter((f): f is FormField => !!f);
  const fieldByName = (name: FieldKey) => fields.find((f) => f.name === name);
  const subject = variant === "asset" ? "Asset request" : "Website enquiry";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const values: Record<string, string> = {};
    for (const k of FIELD_KEYS) values[k] = String(fd.get(k) ?? "").trim();
    const consent = fd.get("consent") === "on";
    const nextErrors: Record<string, string> = {};
    for (const f of fields) {
      const v = values[f.name] ?? "";
      if (f.required && !v) nextErrors[f.name] = `Please fill in ${f.label.toLowerCase()}.`;
    }
    if (fieldByName("name") && values.name.length > 0 && values.name.length < 2) nextErrors.name = "Please enter your name.";
    if (fieldByName("email") && values.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
      nextErrors.email = "Please enter a valid email address.";
    if (fieldByName("message") && values.message && values.message.length < 10)
      nextErrors.message = "Please tell us a little more (at least 10 characters).";
    if (!consent) nextErrors.consent = "Please confirm that we may use your details to reply.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus({ kind: "busy" });
    const mailto = buildMailto(subject, values);
    try {
      const result = await submitEnquiry({
        data: { ...values, subject, consent: true, website: String(fd.get("website") ?? "") },
      });
      if (result.ok) {
        setStatus({ kind: "sent" });
        formEl.reset();
      } else {
        setStatus({ kind: "mailto", href: mailto });
        window.location.assign(mailto);
      }
    } catch {
      setStatus({ kind: "mailto", href: mailto });
    }
  };

  const labelFor = (f: FormField) => (
    <label className="c-field__label" htmlFor={`${id}-${f.name}`}>
      {f.label} {f.required ? null : <small>(optional)</small>}
    </label>
  );
  const errorFor = (f: FormField) =>
    errors[f.name] ? (
      <p className="c-field__error" id={`${id}-${f.name}-error`}>
        {errors[f.name]}
      </p>
    ) : f.hint ? (
      <p className="c-field__hint" id={`${id}-${f.name}-hint`}>
        {f.hint}
      </p>
    ) : null;
  const describedBy = (f: FormField) =>
    errors[f.name] ? `${id}-${f.name}-error` : f.hint ? `${id}-${f.name}-hint` : undefined;

  const renderField = (f: FormField) => {
    const name = f.name as FieldKey;
    if (name === "message") {
      return (
        <div className="c-field" key={name}>
          {labelFor(f)}
          <textarea
            className="c-field__textarea"
            id={`${id}-${name}`}
            name={name}
            required={f.required}
            aria-required={f.required || undefined}
            aria-invalid={errors[name] ? true : undefined}
            aria-describedby={describedBy(f)}
          />
          {errorFor(f)}
        </div>
      );
    }
    if (f.type === "select") {
      const options = f.options?.length ? f.options : name === "engineFamily" ? site.engineFamilies.map((x) => x.name) : [];
      return (
        <div className="c-field" key={name}>
          {labelFor(f)}
          <select
            className="c-field__select"
            id={`${id}-${name}`}
            name={name}
            defaultValue=""
            required={f.required}
            aria-required={f.required || undefined}
            aria-invalid={errors[name] ? true : undefined}
            aria-describedby={describedBy(f)}
          >
            <option value="">Please choose</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {errorFor(f)}
        </div>
      );
    }
    return (
      <div className="c-field" key={name}>
        {labelFor(f)}
        <input
          className="c-field__input"
          id={`${id}-${name}`}
          name={name}
          type={INPUT_TYPE[name] ?? "text"}
          required={f.required}
          aria-required={f.required || undefined}
          aria-invalid={errors[name] ? true : undefined}
          aria-describedby={describedBy(f)}
          autoComplete={AUTOCOMPLETE[name]}
        />
        {errorFor(f)}
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

  /* Short fields pair up in rows; selects and the message run full width. */
  const rows: FormField[][] = [];
  for (const f of fields) {
    const wide = f.name === "message" || f.type === "select";
    const last = rows[rows.length - 1];
    if (!wide && last && last.length === 1 && last[0].type !== "select" && last[0].name !== "message") last.push(f);
    else rows.push([f]);
  }

  return (
    <form className="c-form" onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`}>
      {rows.map((row) =>
        row.length === 2 ? (
          <div className="c-form__row" key={row.map((f) => f.name).join("+")}>
            {row.map(renderField)}
          </div>
        ) : (
          renderField(row[0])
        ),
      )}
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

export function enquiryLines(v: Record<string, string | undefined>) {
  return FIELD_KEYS.filter((k) => k !== "message" && v[k]).map((k) => `${LINE_LABEL[k]}: ${v[k]}`);
}

function buildMailto(subjectPrefix: string, v: Record<string, string>) {
  const subject = `${subjectPrefix} from ${v.name} (${v.company})`;
  const body = [...enquiryLines(v), "", v.message].join("\n");
  return `mailto:${site.company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
