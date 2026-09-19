export function Prose({ sections }: { sections: { heading?: string; paragraphs: string[] }[] }) {
  return (
    <div className="c-prose">
      {sections.map((s, i) => (
        <div key={(s.heading ?? "") + i}>
          {s.heading ? <h2>{s.heading}</h2> : null}
          {s.paragraphs.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

export function TitledList({
  items,
  twoColumns,
}: {
  items: { title: string; text: string; href?: string }[];
  twoColumns?: boolean;
}) {
  return (
    <ul className={`c-list${twoColumns ? " c-list--2col" : ""}`} data-reveal-group>
      {items.map((it) => (
        <li className="c-list__item" key={it.title}>
          <h3 className="c-list__title">{it.title}</h3>
          <p className="c-list__text">{it.text}</p>
        </li>
      ))}
    </ul>
  );
}
