"use client";

import { useEffect, useRef } from "react";
import { gsap, EASE, prefersReducedMotion } from "@/lib/motion";
import { formatNumber } from "@/lib/format";

/**
 * Counts a numeral up once, the first time it enters the viewport.
 * Writes through textContent rather than React state so the tween never
 * triggers a re-render per frame.
 */
export function useCounter(value: number, decimals = 0) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.textContent = formatNumber(value, decimals);
      return;
    }

    const ctx = gsap.context(() => {
      const proxy = { n: 0 };
      gsap.to(proxy, {
        n: value,
        duration: 2,
        ease: EASE,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          el.textContent = formatNumber(proxy.n, decimals);
        },
        onComplete: () => {
          el.textContent = formatNumber(value, decimals);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, decimals]);

  return ref;
}
