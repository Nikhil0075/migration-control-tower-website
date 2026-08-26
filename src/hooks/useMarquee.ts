"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Seamless infinite marquee. The caller renders the sequence twice; this
 * translates by exactly -50% so the loop is invisible. Slow by design, and it
 * eases down rather than stopping dead on hover.
 */
export function useMarquee<T extends HTMLElement = HTMLDivElement>(seconds = 46) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tween = gsap.to(el, {
        xPercent: -50,
        duration: seconds,
        ease: "none",
        repeat: -1,
      });

      const slow = () => gsap.to(tween, { timeScale: 0.25, duration: 0.6, overwrite: true });
      const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.6, overwrite: true });

      const parent = el.parentElement;
      parent?.addEventListener("pointerenter", slow);
      parent?.addEventListener("pointerleave", resume);

      return () => {
        parent?.removeEventListener("pointerenter", slow);
        parent?.removeEventListener("pointerleave", resume);
      };
    }, el);

    return () => ctx.revert();
  }, [seconds]);

  return ref;
}
