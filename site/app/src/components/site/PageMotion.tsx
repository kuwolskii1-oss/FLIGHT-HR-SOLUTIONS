import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * Route-level motion: transform-only reveals, the steps progress rule and line-split headings.
 * Rendered inside each page so its effect runs after that page's markup has hydrated. Under
 * prefers-reduced-motion every element is shown in its final state and nothing animates.
 */
export function PageMotion() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const main = document.getElementById("main") ?? document.body;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const revealTargets = main.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-group]");
    if (reduce || !("IntersectionObserver" in window)) {
      revealTargets.forEach((el) => el.classList.add("is-inview"));
      main.querySelectorAll<HTMLElement>("[data-progress]").forEach((el) => el.style.setProperty("--progress", "1"));
      return;
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
    const stepIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.target as HTMLElement).classList.toggle("is-active", e.isIntersecting);
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );
    main.querySelectorAll<HTMLElement>("[data-step]").forEach((el) => stepIo.observe(el));

    void (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      const triggers: ScrollTrigger[] = [];
      const splits: SplitText[] = [];

      main.querySelectorAll<HTMLElement>("[data-progress]").forEach((el) => {
        const tween = gsap.fromTo(
          el,
          { "--progress": 0 },
          { "--progress": 1, ease: "none", scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 55%", scrub: 0.4 } },
        );
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });

      await document.fonts.ready;
      if (cancelled) return;
      main.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
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
        triggers.forEach((t) => t.kill());
        splits.forEach((s) => s.revert());
      };
    })();

    return () => {
      cancelled = true;
      io.disconnect();
      stepIo.disconnect();
      cleanup?.();
    };
  }, [pathname]);

  return null;
}
