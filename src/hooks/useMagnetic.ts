"use client";

import { useEffect, useRef } from "react";
import { gsap, DUR, EASE, MQ, prefersReducedMotion } from "@/lib/motion";

/**
 * Restrained magnetic pull towards the pointer. Capped at `strength` pixels so
 * it reads as weight rather than as a gimmick. Fine pointers only.
 */
export function useMagnetic<T extends HTMLElement = HTMLAnchorElement>(strength = 12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia(MQ.fine).matches) return;

    const quickX = gsap.quickTo(el, "x", { duration: DUR.med, ease: EASE });
    const quickY = gsap.quickTo(el, "y", { duration: DUR.med, ease: EASE });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      quickX(Math.max(-1, Math.min(1, dx)) * strength);
      quickY(Math.max(-1, Math.min(1, dy)) * strength);
    };
    const onLeave = () => {
      quickX(0);
      quickY(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength]);

  return ref;
}
