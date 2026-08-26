"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion, requestScrollRefresh } from "@/lib/motion";

type LenisCtx = {
  lenis: Lenis | null;
  stop: () => void;
  start: () => void;
  scrollTo: (target: number | string | HTMLElement, opts?: { immediate?: boolean }) => void;
};

const Ctx = createContext<LenisCtx>({
  lenis: null,
  stop: () => {},
  start: () => {},
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(Ctx);

/**
 * Lenis driven by the GSAP ticker, with ScrollTrigger kept in sync.
 *
 * Running one clock rather than two is the whole point: Lenis and ScrollTrigger
 * competing for rAF is what makes pinned sections jitter. Smoothing is skipped
 * entirely under reduced motion and on touch devices, where native scrolling is
 * both faster and what the user expects.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Touch devices keep native momentum scrolling.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      // Never hijack touch.
      syncTouch: false,
    });
    lenisRef.current = lenis;
    setReady(true);

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    // Fonts change line counts, which changes section heights, which moves
    // every pin below them. Refresh again once they have actually loaded.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready.then(() => requestScrollRefresh());

    // Late-loading media (the hero frame sequence, lazy images) shifts layout
    // too. One settling refresh after load covers it.
    const onLoad = () => requestScrollRefresh();
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
      setReady(false);
    };
  }, []);

  const stop = useCallback(() => lenisRef.current?.stop(), []);
  const start = useCallback(() => lenisRef.current?.start(), []);
  const scrollTo = useCallback<LenisCtx["scrollTo"]>((target, opts) => {
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(target, { immediate: opts?.immediate });
    else if (typeof target === "number") window.scrollTo({ top: target, behavior: "auto" });
    else if (typeof target === "string") document.querySelector(target)?.scrollIntoView();
    else target.scrollIntoView();
  }, []);

  // Memoised deliberately. Consumers put `stop`/`start` in effect dependency
  // arrays; if this object were rebuilt every render, those effects would re-run
  // on any unrelated re-render of the shell — which is how an open/close
  // animation could be restarted mid-flight and leave the menu hidden.
  const value = useMemo<LenisCtx>(
    () => ({ lenis: ready ? lenisRef.current : null, stop, start, scrollTo }),
    [ready, stop, start, scrollTo]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
