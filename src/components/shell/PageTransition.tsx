"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, DUR, EASE, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { pageMeta } from "@/data/site";
import { useSmoothScroll } from "@/providers/SmoothScroll";

/**
 * Route transition overlay.
 *
 * Next's App Router navigates on click, so this runs as an *exit* reveal: the
 * new route mounts, the overlay is already covering, and it lifts away to
 * uncover the new page. That keeps the back/forward buttons and browser history
 * behaving normally — the overlay never blocks or delays the navigation itself,
 * it only dresses the moment after it.
 */
export function PageTransition() {
  const overlay = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const { scrollTo } = useSmoothScroll();

  /**
   * Compare against the last path we actually rendered rather than using a
   * "first run" flag: StrictMode mounts effects twice in development, which
   * would let a boolean flag fall through and play the overlay over the very
   * first paint. `null` means nothing has been shown yet — the loader owns
   * that moment.
   */
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    const from = prevPath.current;
    prevPath.current = pathname;

    // Initial mount, or a re-mount on the same route: no transition.
    if (from === null || from === pathname) return;

    const el = overlay.current;
    const label = labelRef.current;
    if (!el || !label) return;

    label.textContent = pageMeta[pathname]?.label ?? "";

    // Reset scroll for the new route before revealing it.
    scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(el, { autoAlpha: 0 });
        ScrollTrigger.refresh();
      },
    });

    tl.set(el, { autoAlpha: 1, clipPath: "inset(0 0 0% 0)" })
      .fromTo(label, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: DUR.med, ease: EASE })
      .to(label, { opacity: 0, duration: DUR.fast }, "+=0.12")
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: DUR.slow, ease: EASE }, "-=0.1");

    return () => {
      tl.kill();
    };
  }, [pathname, scrollTo]);

  return (
    <div
      ref={overlay}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[110] flex items-center justify-center opacity-0"
      style={{ background: "#090909" }}
    >
      <span ref={labelRef} className="h-section !text-[clamp(2rem,5vw,4.5rem)]" />
    </div>
  );
}
