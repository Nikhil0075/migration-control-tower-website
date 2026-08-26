"use client";

import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap, DUR, EASE, prefersReducedMotion } from "@/lib/motion";

/**
 * Headline reveal: split into lines, each masked by an overflow-hidden wrapper,
 * translating up from 110%.
 *
 * SplitType rewrites the DOM, so this restores the original markup on cleanup —
 * important for screen readers, text selection and copy/paste. The heading also
 * keeps its accessible text via aria-label while the split nodes are hidden from
 * assistive technology.
 */
export function useSplitLines<T extends HTMLElement = HTMLHeadingElement>(options?: {
  delay?: number;
  stagger?: number;
  /** Play immediately (hero) instead of on scroll. */
  immediate?: boolean;
  /** Re-run when this changes — e.g. a route key. */
  deps?: unknown[];
}) {
  const ref = useRef<T>(null);
  const { delay = 0, stagger = 0.09, immediate = false } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) return;

    let split: SplitType | null = null;
    let ctx: gsap.Context | null = null;
    let masks: HTMLElement[] = [];

    /**
     * Undo our own wrappers before SplitType reverts, so the DOM it restores
     * from is exactly the one it created. Reverting out of order leaves stray
     * mask elements behind.
     */
    const unwrap = () => {
      masks.forEach((mask) => {
        const line = mask.firstElementChild;
        if (line && mask.parentNode) mask.parentNode.insertBefore(line, mask);
        mask.remove();
      });
      masks = [];
    };

    // Wait for fonts: splitting before they load produces wrong line breaks.
    let cancelled = false;
    const build = () => {
      if (cancelled || !ref.current) return;

      const text = el.textContent ?? "";
      el.setAttribute("aria-label", text);

      split = new SplitType(el, { types: "lines", lineClass: "split-line" });
      const lines = split.lines ?? [];
      if (!lines.length) return;

      // Wrap each line in its own mask.
      lines.forEach((line) => {
        line.setAttribute("aria-hidden", "true");
        const mask = document.createElement("span");
        mask.className = "line-mask";
        line.parentNode?.insertBefore(mask, line);
        mask.appendChild(line);
        masks.push(mask);
      });

      ctx = gsap.context(() => {
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: DUR.cinematic,
            ease: EASE,
            stagger,
            delay,
            ...(immediate
              ? {}
              : { scrollTrigger: { trigger: el, start: "top 88%", once: true } }),
          }
        );
      }, el);
    };

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) fonts.ready.then(build);
    else build();

    // Re-split on resize so line breaks stay correct.
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        ctx?.revert();
        unwrap();
        split?.revert();
        ctx = null;
        split = null;
        build();
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ctx?.revert();
      unwrap();
      split?.revert();
      el.removeAttribute("aria-label");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, stagger, immediate, ...(options?.deps ?? [])]);

  return ref;
}
