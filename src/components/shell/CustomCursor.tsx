"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, DUR, EASE, prefersReducedMotion } from "@/lib/motion";

/**
 * A small cursor dot that grows over interactive elements and picks up a
 * contextual label over media ([data-cursor="View"]).
 *
 * Deliberately small — the brief rules out an oversized gimmick cursor. It is
 * decorative and marked aria-hidden; the native cursor is never hidden on touch
 * devices, and pointer events always pass through.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [state, setState] = useState<"default" | "hover" | "media">("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const el = dot.current;
    if (!el) return;

    document.documentElement.setAttribute("data-custom-cursor", "");
    setVisible(true);

    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: EASE });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: EASE });

    const onMove = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);

      const target = (e.target as Element | null)?.closest?.("[data-cursor], a, button, [role='button']");
      if (!target) {
        setState("default");
        setLabel("");
        return;
      }
      const ctx = target.getAttribute("data-cursor");
      if (ctx) {
        setState("media");
        setLabel(ctx);
      } else {
        setState("hover");
        setLabel("");
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.documentElement.removeAttribute("data-custom-cursor");
    };
  }, []);

  const size = state === "media" ? 76 : state === "hover" ? 34 : 9;

  return (
    <div
      ref={dot}
      aria-hidden
      className="custom-cursor pointer-events-none fixed left-0 top-0 z-[120] mix-blend-difference"
      style={{ opacity: visible ? 1 : 0, transition: `opacity ${DUR.fast}s` }}
    >
      <div
        className="flex items-center justify-center rounded-full border border-[#f2f2ee]"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          background: state === "default" ? "#f2f2ee" : "transparent",
          transition: `width var(--dur-med) var(--ease), height var(--dur-med) var(--ease), margin var(--dur-med) var(--ease), background var(--dur-med) var(--ease)`,
        }}
      >
        {label && (
          <span
            className="micro !text-[10px] !text-[#f2f2ee]"
            style={{ transition: `opacity var(--dur-fast)` }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
