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
