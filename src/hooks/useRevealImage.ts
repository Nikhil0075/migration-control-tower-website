"use client";

import { useEffect, useRef } from "react";
import { gsap, DUR, EASE, prefersReducedMotion } from "@/lib/motion";

/**
 * Image reveal grammar: clip-path inset(100% 0 0 0) → inset(0 0 0 0).
 * The mask wipes upward, matching the direction of the text line reveal.
 */
export function useRevealImage<T extends HTMLElement = HTMLDivElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;

    el.setAttribute("data-motion-ready", "");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        target,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: DUR.cinematic,
          ease: EASE,
          delay,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onComplete: () => {
            target.style.willChange = "auto";
            target.style.clipPath = "none";
          },
        }
      );
    }, el);

    return () => {
      ctx.revert();
      el.removeAttribute("data-motion-ready");
    };
  }, [delay]);

  return ref;
}
