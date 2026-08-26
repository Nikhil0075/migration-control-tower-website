"use client";

import { useEffect, useRef } from "react";
import { gsap, DUR, EASE, prefersReducedMotion } from "@/lib/motion";

/**
 * The site's one primary reveal: opacity 0 → 1, y 50 → 0.
 *
 * Attach the returned ref to a container; every descendant carrying
 * [data-reveal] animates in on scroll, staggered in DOM order. Using a single
 * hook everywhere is deliberate — the brief calls for one motion grammar rather
 * than per-element invention.
 *
 * The container is marked [data-motion-ready] only once we know we will animate,
 * because globals.css keys the initial `opacity: 0` off that attribute. If JS
 * never runs, or reduced motion is on, content is simply visible.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  /** Seconds between each element. */
  stagger?: number;
  /** Where the trigger fires, in ScrollTrigger `start` syntax. */
  start?: string;
  y?: number;
}) {
  const ref = useRef<T>(null);
  const { stagger = 0.08, start = "top 82%", y = 50 } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!targets.length) return;

    el.setAttribute("data-motion-ready", "");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: DUR.slow,
          ease: EASE,
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
          // Drop the compositor hint once the work is done.
          onComplete: () => targets.forEach((t) => (t.style.willChange = "auto")),
        }
      );
    }, el);

    return () => {
      ctx.revert();
      el.removeAttribute("data-motion-ready");
    };
  }, [stagger, start, y]);

  return ref;
}
