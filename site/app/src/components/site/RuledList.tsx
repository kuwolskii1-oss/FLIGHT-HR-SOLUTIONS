import type { Row } from "@/site/types";
import { ArrowRight } from "./Icons";
import { SmartLink } from "./SmartLink";

export function RuledList({
  rows,
  compact,
  startIndex = 1,
  ariaLabel,
}: {
  rows: Row[];
  compact?: boolean;
  startIndex?: number;
  ariaLabel?: string;
}) {
  return (
    <ul className="c-rows" aria-label={ariaLabel}>
      {rows.map((row, i) => (
        <li key={row.href + row.title} className={`c-row c-row--link${compact ? " c-row--compact" : ""}`}>
          <span className="c-row__index" aria-hidden="true">
            {String(startIndex + i).padStart(2, "0")}
          </span>
          <h3 className="c-row__title">
            <SmartLink href={row.href}>{row.title}</SmartLink>
          </h3>
          <p className="c-row__text">{row.text}</p>
          {row.meta?.length ? (
            <ul className="c-row__meta" aria-label="Details">
              {row.meta.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          ) : null}
          <ArrowRight className="c-row__arrow" width={22} height={22} />
        </li>
      ))}
    </ul>
  );
}
