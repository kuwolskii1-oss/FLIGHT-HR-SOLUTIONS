import type { ReactNode } from "react";

const REGISTRATION = /(\d{4}\/\d{6}\/\d{2})/;

/** Sets a South African company registration number (e.g. 2026/294346/07) in the data face. */
export function withRegistration(text: string): ReactNode {
  const parts = text.split(REGISTRATION);
  if (parts.length === 1) return text;
  return parts.map((p, i) =>
    REGISTRATION.test(p) ? (
      <span key={i} className="c-regno">
        {p}
      </span>
    ) : (
      p
    ),
  );
}
