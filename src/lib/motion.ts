/**
 * Motion tokens and the single GSAP registration point.
 *
 * Every animated component imports DUR/EASE from here rather than inventing its
 * own timing, so the whole site shares one motion grammar.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered exactly once, on the client. Module evaluation is cached, so the
// guard is only for the server pass where the plugin has nothing to attach to.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Mirrors --dur-* in globals.css, in seconds. */
export const DUR = {
  fast: 0.25,
  med: 0.6,
  slow: 1.1,
  cinematic: 1.6,
} as const;

/** Mirrors --ease: cubic-bezier(0.16, 1, 0.3, 1). */
export const EASE = "power4.out";
export const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Breakpoints shared by CSS and gsap.matchMedia. */
export const MQ = {
  desktop: "(min-width: 1025px)",
  tablet: "(min-width: 861px) and (max-width: 1024px)",
  mobile: "(max-width: 860px)",
  motionOK: "(prefers-reduced-motion: no-preference)",
  fine: "(hover: hover) and (pointer: fine)",
} as const;

/** True when the visitor has asked for reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True on devices with a real pointer — gates the cursor and parallax. */
export function hasFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MQ.fine).matches;
}

/**
 * Debounced global ScrollTrigger refresh, for layout that settles after mount —
 * web fonts changing line counts, lazy media arriving.
 *
 * Note this does NOT fix pins that measured each other in the wrong order:
 * refresh re-measures in refreshPriority order, so a trigger created before the
 * pin above it existed stays wrong no matter how often you refresh. That is
 * what `refreshPriority` on each pinned section is for — highest first, in
 * document order.
 */
let refreshFrame = 0;
export function requestScrollRefresh() {
  if (typeof window === "undefined") return;
  // Cancel and reschedule rather than gating on a boolean: in a background tab
  // rAF never fires, and a boolean latch would stay set forever and silently
  // block every later refresh.
  cancelAnimationFrame(refreshFrame);
  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      ScrollTrigger.refresh();
    });
  });
}

if (typeof document !== "undefined") {
  // Pins created while the tab was hidden have unreliable measurements, since
  // layout and rAF are both throttled. Re-measure when it comes back.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) requestScrollRefresh();
  });
}

export { gsap, ScrollTrigger };
