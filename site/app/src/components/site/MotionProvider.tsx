import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * Client-side motion system: one smooth-scroll engine (Lenis) bridged to GSAP's ticker and
 * ScrollTrigger, transform-only reveals, the steps progress rule and line-split headings.
 * Everything is skipped under prefers-reduced-motion, where the page renders its final state.
 */
export function MotionProvider() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const setupReveals = () => {
      const revealTargets = document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-group]");
      if (reduce || !("IntersectionObserver" in window)) {
        revealTargets.forEach((el) => el.classList.add("is-inview"));
        return () => {};
      }
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              (e.target as HTMLElement).classList.add("is-inview");
              io.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );
      revealTargets.forEach((el) => io.observe(el));
      const steps = document.querySelectorAll<HTMLElement>("[data-step]");
      const stepIo = new IntersectionObserver(
        (entries) => {
          for (const e of entries) (e.target as HTMLElement).classList.toggle("is-active", e.isIntersecting);
        },
        { rootMargin: "-40% 0px -40% 0px" },
      );
      steps.forEach((el) => stepIo.observe(el));
      return () => {
        io.disconnect();
        stepIo.disconnect();
      };
    };

    const run = async () => {
      const teardownReveals = setupReveals();
      if (reduce) {
        cleanup = teardownReveals;
        return;
      }
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);

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

      const triggers: ScrollTrigger[] = [];
      const splits: SplitText[] = [];

      // Progress rule beside the numbered steps: scrubbed, transform only.
      document.querySelectorAll<HTMLElement>("[data-progress]").forEach((el) => {
        const tween = gsap.fromTo(
          el,
          { "--progress": 0 },
          {
            "--progress": 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 55%", scrub: 0.4 },
          },
        );
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });

      // Line-split headings: masked lines rise into place, accessible name kept on the parent.
      await document.fonts.ready;
      if (cancelled) return;
      document.querySelectorAll<HTMLElement>("[data-split]:not([data-split-done])").forEach((el) => {
        el.dataset.splitDone = "true";
        const split = new SplitText(el, { type: "lines", mask: "lines", linesClass: "split-line" });
        splits.push(split);
        const tween = gsap.from(split.lines, {
          yPercent: 110,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });
      ScrollTrigger.refresh();

      cleanup = () => {
        teardownReveals();
        triggers.forEach((t) => t.kill());
        splits.forEach((s) => s.revert());
        gsap.ticker.remove(onTick);
        lenis.destroy();
      };
    };

    void run();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);

  return null;
}
