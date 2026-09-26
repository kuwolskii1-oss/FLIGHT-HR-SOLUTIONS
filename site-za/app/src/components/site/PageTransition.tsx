import { useEffect } from "react";

/**
 * Hides the wait between pages. Pages load as full documents (SmartLink), and the browser keeps
 * showing the old page, still and unchanged, until the next one is ready; on a slow response that
 * reads as a click that did nothing. So the moment an internal link is followed, the page goes
 * into a leaving state (za.css): the content fades and a thin line sweeps the top edge. The next
 * page then arrives through the cross-document view transition (za.css) or, in browsers without
 * one, through the same entrance started by the head script in __root.tsx. Hover prefetching (the
 * speculation rules in __root.tsx) makes most arrivals near instant anyway.
 */
export function PageTransition() {
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(a instanceof HTMLAnchorElement)) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
      // A link within this page only scrolls.
      if (url.pathname === location.pathname && url.search === location.search) return;
      root.classList.add("is-leaving");
      try {
        sessionStorage.setItem("fhs-nav", "1");
      } catch {
        /* storage blocked: the next page simply arrives without the fallback entrance */
      }
      window.clearTimeout(timer);
      // A navigation the visitor stops (Escape, the stop button) must not leave the page faded.
      timer = window.setTimeout(() => root.classList.remove("is-leaving"), 8000);
    };
    // Coming back through the back-forward cache restores the page as it was left: faded.
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      root.classList.remove("is-leaving");
      window.clearTimeout(timer);
    };
    document.addEventListener("click", onClick);
    window.addEventListener("pageshow", onShow);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("pageshow", onShow);
      window.clearTimeout(timer);
    };
  }, []);
  return (
    <div className="c-progress" aria-hidden="true">
      <span className="c-progress__bar" />
    </div>
  );
}
