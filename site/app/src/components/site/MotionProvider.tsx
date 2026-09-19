import { useEffect } from "react";

/**
 * The single smooth-scroll engine (Lenis) bridged to GSAP's ticker and ScrollTrigger, mounted once
 * in the root. Page-level motion (reveals, steps, split headings) lives in PageMotion so that it
 * runs only after the route's own markup has hydrated. Nothing runs under prefers-reduced-motion.
 */
export function MotionProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({
        autoRaf: false,
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        anchors: { offset: -72 },
      });
      const onTick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      cleanup = () => {
        window.removeEventListener("load", onLoad);
        gsap.ticker.remove(onTick);
        lenis.destroy();
      };
    })();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);
  return null;
}
