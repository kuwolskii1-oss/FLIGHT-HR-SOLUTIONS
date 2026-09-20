import { useRouterState } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/site/content";
import { CtaTalk } from "./Cta";
import { SmartLink } from "./SmartLink";

/**
 * Fixed header. Reads the theme of the section underneath (data-theme on sections), hides on
 * scroll down and returns on scroll up, opens a full-height menu panel below 1000 px.
 */
export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Close the menu whenever the route changes.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      setOpen(false);
    }
  }, [pathname]);

  // Scroll state and section theme, written straight to the DOM (no re-renders per frame).
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let lastY = window.scrollY;
    let ticking = false;
    const probeY = () => Math.min(header.offsetHeight * 0.6, 40);
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 16);
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      if (!header.classList.contains("is-menu-open")) {
        if (goingDown && y > 360) header.classList.add("is-hidden");
        else if (goingUp || y < 120) header.classList.remove("is-hidden");
      }
      lastY = y;
      const beneath = document
        .elementsFromPoint(Math.min(24, window.innerWidth - 1), probeY())
        .find((el) => !header.contains(el) && !el.closest(".c-menu"));
      const themed = beneath?.closest<HTMLElement>("[data-theme]");
      const theme = themed?.dataset.theme ?? "light";
      if (header.dataset.theme !== theme) header.dataset.theme = theme;
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

  // Menu: body scroll lock, focus management, Escape and Tab trapping.
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
        menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      );
    const first = focusable()[0];
    first?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
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

  const { nav, cta, company } = site;

  return (
    <>
      <a className="c-skip" href="#main">
        Skip to content
      </a>
      <header ref={headerRef} className="c-header" data-theme="dark">
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
            {nav.primary.map((item) => (
              <SmartLink key={item.href} href={item.href} className="c-navlink" activeClassName="is-active">
                {item.label}
              </SmartLink>
            ))}
          </nav>
          <div className="c-header__actions">
            <CtaTalk href={cta.primary.href} label={cta.primary.label} small />
            <button
              type="button"
              className="c-header__burger"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span className="c-header__burger-lines" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div
        ref={menuRef}
        id={menuId}
        className={`c-menu${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal={open || undefined}
        aria-label="Menu"
        hidden={!open}
      >
        <div className="o-container c-menu__inner">
          <nav className="c-menu__primary" aria-label="Menu, primary">
            {nav.primary.map((item) => (
              <SmartLink key={item.href} href={item.href}>
                {item.label}
              </SmartLink>
            ))}
          </nav>
          <nav className="c-menu__secondary" aria-label="Menu, secondary">
            {nav.secondary.map((item) => (
              <SmartLink key={item.href} href={item.href}>
                {item.label}
              </SmartLink>
            ))}
          </nav>
          <div className="c-menu__contact">
            <p>
              <a href={`tel:${company.phone}`}>{company.phoneDisplay}</a>
              {" · "}
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
            <p>
              {company.street}, {company.postalCode} {company.city}, {company.country}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
