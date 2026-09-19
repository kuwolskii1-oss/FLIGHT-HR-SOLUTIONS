import { useEffect, useRef } from "react";

/** Sticky in-page navigation for long pages; the active link follows the section in view. */
export function LocalNav({ items, theme = "light" }: { items: { id: string; label: string }[]; theme?: "light" | "dark" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a[data-target]"));
    const targets = links.map((l) => document.getElementById(l.dataset.target ?? "")).filter(Boolean) as HTMLElement[];
    if (!targets.length) return;
    const setActive = (id: string) => {
      for (const l of links) l.classList.toggle("is-active", l.dataset.target === id);
    };
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav ref={ref} className="c-local-nav" data-theme={theme} aria-label="On this page">
      <div className="o-container">
        <ul className="c-local-nav__list">
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} data-target={it.id}>
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
