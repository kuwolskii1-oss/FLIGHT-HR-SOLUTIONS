import type { ReactNode } from "react";
import { PictoTile, type PictogramName } from "./Pictogram";

/**
 * The departure board's look for content that is read, not clicked: the same navy panel, hairline
 * rows and big condensed titles as the doors on the home page (DoorBoard), without the hover fill,
 * the arrow or the ambient shapes, because these rows go nowhere. Used for what a visitor can
 * check, what we verify, who we serve, our commitments, each door's capabilities and the urgent
 * line, so every list on the site reads like the one the client picked out.
 */
export type InfoRow = {
  key: string;
  title: string;
  picto?: PictogramName;
  /** Anchor on the row itself (a door's section ids stay the targets of the header's links). */
  id?: string;
  /** Id for the title, when something outside the board is labelled by it. */
  titleId?: string;
  text?: ReactNode;
  list?: string[];
  /** Anything that belongs under the text, such as the one link a section may carry. */
  after?: ReactNode;
  /** A short fact or action in the right-hand column. */
  aside?: ReactNode;
  tone?: "urgent";
};

export function InfoBoard({
  rows,
  headingLevel = 3,
  size = "md",
  columns,
  label,
}: {
  rows: InfoRow[];
  headingLevel?: 2 | 3;
  /** md: a title and a sentence per row; lg: a title, a paragraph and a checklist per row. */
  size?: "md" | "lg";
  /** Lay each row's checklist out in two columns on wide screens. */
  columns?: boolean;
  label?: string;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const hasAside = rows.some((r) => r.aside);
  return (
    <ul
      className={`c-board c-board--info c-board--${size}${hasAside ? " c-board--aside" : ""}`}
      data-theme="light"
      data-sc-in
      data-sc-stagger="70"
      aria-label={label}
    >
      {rows.map((r) => {
        const titleId = r.titleId ?? (r.id ? `${r.id}-title` : undefined);
        return (
          <li
            key={r.key}
            id={r.id}
            className={`c-board__item${r.tone ? ` c-board__item--${r.tone}` : ""}`}
          >
            {r.picto ? <PictoTile name={r.picto} className="c-board__tile" /> : null}
            <Heading id={titleId} className="c-board__title">
              {r.title}
            </Heading>
            <div className="c-board__body">
              {r.text ? <p className="c-board__text">{r.text}</p> : null}
              {r.list?.length ? (
                <ul className={`c-checks c-checks--tight${columns ? " c-checks--cols" : ""}`}>
                  {r.list.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              ) : null}
              {r.after}
            </div>
            {r.aside ? <div className="c-board__aside">{r.aside}</div> : null}
          </li>
        );
      })}
    </ul>
  );
}
