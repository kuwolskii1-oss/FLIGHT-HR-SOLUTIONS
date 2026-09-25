import type { LinkItem } from "@/site/types";

/** On-page navigation for a door: the section anchors and the form, one line on desktop. */
export function LocalNav({ items, label = "On this page" }: { items: LinkItem[]; label?: string }) {
  return (
    <nav className="c-localnav" aria-label={label}>
      <ul>
        {items.map((i) => (
          <li key={i.href}>
            <a href={i.href}>{i.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
