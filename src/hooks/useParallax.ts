"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, MQ, prefersReducedMotion } from "@/lib/motion";

/**
 * Internal media parallax, deliberately capped. The brief is explicit that
 * parallax should never be overdone: the default ±6% is a drift, not a slide.
 * Desktop only.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(range = 6) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const inner = el.querySelector<HTMLElement>("[data-parallax-inner]") ?? el.firstElementChild;
    if (!inner) return;

    const mm = gsap.matchMedia();
    mm.add(MQ.desktop, () => {
      const tween = gsap.fromTo(
        inner,
        { yPercent: -range / 2 },
        {
          yPercent: range / 2,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(inner, { clearProps: "transform" });
      };
    });

    return () => mm.revert();
  }, [range]);

  return ref;
}

/** Media that needs to overflow its frame for parallax to have headroom. */
export const PARALLAX_INNER_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: "-6% 0",
  height: "112%",
  width: "100%",
};

export { ScrollTrigger };
