import { useEffect } from "react";

declare global {
  interface Window {
    ScrollCraft?: { mount: (root: Element | Document, opts?: Record<string, unknown>) => unknown; reduce: boolean };
  }
}

/**
 * Mounts the vendored scrollcraft engine once per document, after hydration. The engine reads
 * the data-sc-* attributes the pages render and drives every act from one scroll value on one
 * requestAnimationFrame loop. It has no teardown, so the site navigates between pages as full
 * documents (see SmartLink) and this component is never re-run for a route change.
 */
let mounted = false;

/**
 * Rendered at the end of every page's <main>, so its effect runs after that page's markup has
 * hydrated (the engine writes --sc-p onto the act elements; doing that before hydration makes
 * React report attribute mismatches). One mount per document.
 */
export function ScrollCraftMount() {
  useEffect(() => {
    if (mounted) return;
    mounted = true;
    let cancelled = false;
    // Reduced motion: no pinned stages at all. Every act flows, every cue is open (za.css), the
    // ident is finished. Done before the engine collects the acts, so it never pins anything.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("sc-reduce");
      document.querySelectorAll<HTMLElement>('[data-sc-act="pin"], [data-sc-act="scrub"], [data-sc-act="pan"]').forEach((el) => {
        el.setAttribute("data-sc-act", "flow");
        el.removeAttribute("data-sc-span");
        el.removeAttribute("data-sc-dwell");
      });
    }
    // A pinned stage taller than the screen would be cut off for as long as it is pinned (long
    // steps on a short laptop screen): that act flows instead. Measured before the engine sizes
    // anything, when each stage is exactly as tall as its content needs.
    document.querySelectorAll<HTMLElement>('[data-sc-act="pin"]').forEach((el) => {
      const stage = el.querySelector<HTMLElement>("[data-sc-stage]");
      if (stage && stage.offsetHeight > window.innerHeight + 1) {
        el.setAttribute("data-sc-act", "flow");
        el.removeAttribute("data-sc-span");
      }
    });
    const mount = () => {
      if (cancelled || !window.ScrollCraft) return;
      window.ScrollCraft.mount(document.body);
    };
    if (window.ScrollCraft) mount();
    else void import("@/vendor/scrollcraft/scrollcraft.js" as string).then(mount);
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
