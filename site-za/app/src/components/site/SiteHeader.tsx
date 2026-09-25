import { useRouterState } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/site/data/site";
import { CtaTalk, CtaUrgent } from "./Cta";
import { SmartLink } from "./SmartLink";
import { Chevron, Close, Menu } from "./Icons";
import { Pictogram, PictoTile } from "./Pictogram";
import { DOOR_PICTO } from "@/site/wayfinding";

/**
 * Fixed header in two rows, after the client's clear-sky reference: a grey utility strip (the
 * group line, the urgent line, the general inbox, the Swiss site) and a white row with the logo,
 * the five doors and About as links with dropdowns of their sections (transitions.dev menu
 * dropdown), and the one filled action. Below 1000 px the strip folds away, the urgent action
 * stays as an icon and a burger opens a panel with an accordion per door. The header is solid and
 * light on every page, and hides on scroll down.
 */
export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  // The panel stays mounted (not hidden) while its close choreography runs.
  const [shown, setShown] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const closing = useRef<number | null>(null);
  const menuId = useId();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { nav, cta, company, group } = site;
  const groups = [...nav.doors, nav.about];

  // Scroll state, written straight to the DOM (no re-renders per frame).
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 16);
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      if (
        !header.classList.contains("is-menu-open") &&
        !header.classList.contains("has-dropdown")
      ) {
        if (goingDown && y > 360) header.classList.add("is-hidden");
        else if (goingUp || y < 120) header.classList.remove("is-hidden");
      }
      lastY = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Dropdowns: open on hover (fine pointers) or on the chevron button; close on Escape, outside
  // click or focus leaving the group. The closing class lets the shorter close transition run.
  const openDropdown = (href: string) => {
    if (closing.current) window.clearTimeout(closing.current);
    setDropdown(href);
  };
  const closeDropdown = () => {
    const header = headerRef.current;
    const el = header?.querySelector<HTMLElement>(".t-dropdown.is-open");
    if (el) {
      el.classList.add("is-closing");
      window.setTimeout(() => el.classList.remove("is-closing"), 160);
    }
    setDropdown(null);
  };
  useEffect(() => {
    const header = headerRef.current;
    header?.classList.toggle("has-dropdown", !!dropdown);
    if (!dropdown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDropdown();
        header
          ?.querySelector<HTMLElement>(`[data-group="${dropdown}"] .c-navgroup__toggle`)
          ?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest(".c-navgroup")) closeDropdown();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [dropdown]);

  const shownTimer = useRef<number | null>(null);
  const setMenu = (next: boolean) => {
    if (shownTimer.current) window.clearTimeout(shownTimer.current);
    shownTimer.current = null;
    if (next) {
      setShown(true);
      setOpen(true);
    } else {
      setOpen(false);
      shownTimer.current = window.setTimeout(() => setShown(false), 420);
    }
  };

  // Mobile panel: body scroll lock, focus management, Escape and Tab trapping.
  useEffect(() => {
    const root = document.documentElement;
    const header = headerRef.current;
    const menu = menuRef.current;
    root.classList.toggle("is-menu-open", open);
    header?.classList.toggle("is-menu-open", open);
    if (!open || !menu) return;
    header?.classList.remove("is-hidden");
    const focusable = () =>
      Array.from(
        menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
    focusable()[0]?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        header?.querySelector<HTMLElement>(".c-header__burger")?.focus();
      }
      if (e.key === "Tab") {
        const items = focusable();
        const burger = header?.querySelector<HTMLElement>(".c-header__burger");
        const all = burger ? [burger, ...items] : items;
        const idx = all.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && idx <= 0) {
          e.preventDefault();
          all[all.length - 1]?.focus();
        } else if (!e.shiftKey && idx === all.length - 1) {
          e.preventDefault();
          all[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const fine = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <>
      <a className="c-skip" href="#main">
        Skip to content
      </a>
      <header ref={headerRef} className="c-header" data-theme="light">
        <div className="c-util">
          <div className="o-container c-util__inner">
            <p className="c-util__group">{group.line}</p>
            <ul className="c-util__links">
              <li>
                <SmartLink href={cta.urgent.href} className="c-util__link c-util__link--urgent">
                  <Pictogram name="alarm-bell" size={16} />
                  {cta.urgent.label}
                </SmartLink>
              </li>
              <li>
                <a href={`mailto:${company.emails.general}`} className="c-util__link">
                  <Pictogram name="send" size={16} />
                  {company.emails.general}
                </a>
              </li>
              <li>
                <a
                  href={group.swiss.href}
                  className="c-util__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Pictogram name="globe" size={16} />
                  {group.swiss.label} site
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="o-container c-header__inner">
          <SmartLink href="/" className="c-header__logo" aria-label={`${company.shortName}, home`}>
            <img
              className="c-header__logo-img c-header__logo-img--on-dark"
              src="/brand/logo-light.svg"
              alt=""
              width={272}
              height={64}
              decoding="async"
            />
            <img
              className="c-header__logo-img c-header__logo-img--on-light"
              src="/brand/logo.svg"
              alt=""
              width={272}
              height={64}
              decoding="async"
            />
          </SmartLink>
          <nav className="c-header__nav" aria-label="Primary">
            <ul className="c-header__list">
              {groups.map((g) => {
                const isOpen = dropdown === g.href;
                const panelId = `${menuId}-${g.href.replace(/\W/g, "")}`;
                return (
                  <li
                    className="c-navgroup"
                    key={g.href}
                    data-group={g.href}
                    onPointerEnter={() => fine() && openDropdown(g.href)}
                    onPointerLeave={() => {
                      if (!fine()) return;
                      closing.current = window.setTimeout(closeDropdown, 120);
                    }}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) closeDropdown();
                    }}
                  >
                    <SmartLink href={g.href} className="c-navlink" activeClassName="is-active">
                      {g.label}
                    </SmartLink>
                    <button
                      type="button"
                      className="c-navgroup__toggle"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      aria-label={`${g.label} sections`}
                      onClick={() => (isOpen ? closeDropdown() : openDropdown(g.href))}
                    >
                      <Chevron width={14} height={14} />
                    </button>
                    <div
                      id={panelId}
                      className={`c-dropdown t-dropdown${isOpen ? " is-open" : ""}`}
                      data-origin="top-left"
                    >
                      {DOOR_PICTO[g.href.replace(/^\//, "")] ? (
                        <PictoTile
                          name={DOOR_PICTO[g.href.replace(/^\//, "")]}
                          size="lg"
                          className="c-dropdown__tile"
                        />
                      ) : null}
                      <ul className="c-dropdown__list">
                        {g.items.map((item) => (
                          <li key={item.href}>
                            <SmartLink
                              href={item.href}
                              className="c-dropdown__link"
                              tabIndex={isOpen ? 0 : -1}
                            >
                              <span>{item.label}</span>
                              {item.note ? <span className="c-badge">{item.note}</span> : null}
                            </SmartLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="c-header__actions">
            <CtaUrgent href={cta.urgent.href} label={cta.urgent.label} small />
            <CtaTalk href={cta.primary.href} label={cta.primary.label} small />
            <button
              type="button"
              className="c-header__burger"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setMenu(!open)}
            >
              <span className="t-icon-swap" data-state={open ? "b" : "a"}>
                <span className="t-icon" data-icon="a">
                  <Menu width={22} height={22} />
                </span>
                <span className="t-icon" data-icon="b">
                  <Close width={22} height={22} />
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>
      <div
        ref={menuRef}
        id={menuId}
        className="c-menu"
        data-open={open}
        role="dialog"
        aria-modal={open || undefined}
        aria-label="Menu"
        hidden={!open && !shown}
      >
        <div className="c-menu__layers" aria-hidden="true">
          <span className="c-menu__layer" />
          <span className="c-menu__layer" />
          <span className="c-menu__layer" />
        </div>
        <div className="o-container c-menu__inner">
          <nav className="c-menu__primary" aria-label="Menu">
            <ul>
              {groups.map((g, i) => (
                <MenuGroup key={g.href} label={g.label} href={g.href} items={g.items} index={i} />
              ))}
              <li className="c-menu__item" style={{ ["--i" as string]: groups.length }}>
                <div className="c-menu__row">
                  <span className="c-menu__rise">
                    <SmartLink href={nav.contact.href} className="c-menu__link">
                      <PictoTile name="chat" size="sm" className="c-menu__tile" />
                      {nav.contact.label}
                    </SmartLink>
                  </span>
                </div>
              </li>
            </ul>
          </nav>
          <div className="c-menu__actions">
            <CtaUrgent href={cta.urgent.href} label={cta.urgent.label} />
            <CtaTalk href={cta.primary.href} label={cta.primary.label} />
          </div>
          <p className="c-menu__group">
            {group.line}.{" "}
            <a href={group.swiss.href} target="_blank" rel="noopener noreferrer">
              {group.swiss.label} site
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

function MenuGroup({
  label,
  href,
  items,
  index,
}: {
  label: string;
  href: string;
  items: { label: string; href: string; note?: string }[];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const picto = DOOR_PICTO[href.replace(/^\//, "")];
  return (
    <li className="c-menu__item t-acc" data-open={open} style={{ ["--i" as string]: index }}>
      <div className="c-menu__row">
        <span className="c-menu__rise">
          <SmartLink href={href} className="c-menu__link">
            {picto ? <PictoTile name={picto} size="sm" className="c-menu__tile" /> : null}
            {label}
          </SmartLink>
        </span>
        <button
          type="button"
          className="c-menu__toggle"
          aria-expanded={open}
          aria-controls={id}
          aria-label={`${label} sections`}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="t-acc-chevron">
            <Chevron width={18} height={18} />
          </span>
        </button>
      </div>
      <div className="t-acc-panel" id={id}>
        <ul className="t-acc-panel-inner c-menu__sub">
          {items.map((item) => (
            <li key={item.href}>
              <SmartLink href={item.href} tabIndex={open ? 0 : -1}>
                {item.label}
                {item.note ? <span className="c-badge">{item.note}</span> : null}
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
