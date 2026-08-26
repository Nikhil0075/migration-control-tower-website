"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSmoothScroll } from "@/providers/SmoothScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type LightboxItem = {
  /** Image shown in the viewer. Use the largest variant available. */
  src: string;
  /** Intrinsic size, so the viewer can size and clamp zoom correctly. */
  w: number;
  h: number;
  alt: string;
  title: string;
  caption?: string;
  /** Small mono line above the title, e.g. a diagram number. */
  index?: string;
};

const MAX_ZOOM = 4;

/**
 * A full-screen viewer for images that are too detailed to read inline.
 *
 * Zoom exists because the architecture diagrams are 3840×2160 drawings whose
 * node labels are illegible at gallery size — "open bigger" is not enough, you
 * have to be able to magnify and pan around them.
 *
 * Zoom is capped at whatever keeps you inside the source pixels (never past
 * MAX_ZOOM), so it can never blow up into mush.
 */
export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
  zoomable = false,
}: {
  items: LightboxItem[];
  /** Index of the open item, or null when closed. */
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
  zoomable?: boolean;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { stop, start } = useSmoothScroll();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  // Every pointer currently down, so a second finger can start a pinch.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; zoom: number } | null>(null);

  // Touch devices have no wheel and no "click" — the hint has to match the
  // gesture the visitor actually has available.
  const coarse = useMediaQuery("(pointer: coarse)");

  const open = index !== null;
  const item = open ? items[index] : null;

  const reset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onIndex((index + dir + items.length) % items.length);
      reset();
    },
    [index, items.length, onIndex, reset]
  );

  /* --- lock the page, remember focus ------------------------------------- */
  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement | null;
    stop();
    closeRef.current?.focus();
    return () => {
      start();
      restoreTo.current?.focus?.();
    };
  }, [open, stop, start]);

  /* --- keyboard ---------------------------------------------------------- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoom > 1) reset();
        else onClose();
      } else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (zoomable && (e.key === "+" || e.key === "=")) setZoom((z) => Math.min(MAX_ZOOM, z + 0.5));
      else if (zoomable && e.key === "-") setZoom((z) => Math.max(1, z - 0.5));
      else if (e.key === "Tab") {
        // Only the controls are focusable; keep focus inside the dialog.
        const f = stageRef.current?.parentElement?.querySelectorAll<HTMLElement>("button");
        if (!f?.length) return;
        e.preventDefault();
        const list = Array.from(f);
        const at = list.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey ? (at - 1 + list.length) % list.length : (at + 1) % list.length;
        list[next].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, step, zoom, reset, zoomable]);

  /* --- clamp pan so the image can never be dragged off-screen ------------- */
  const clamp = useCallback((p: { x: number; y: number }, z: number) => {
    const el = stageRef.current;
    if (!el) return p;
    const r = el.getBoundingClientRect();
    const maxX = Math.max(0, (r.width * z - r.width) / 2);
    const maxY = Math.max(0, (r.height * z - r.height) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, p.x)),
      y: Math.max(-maxY, Math.min(maxY, p.y)),
    };
  }, []);

  useEffect(() => {
    setPan((p) => clamp(p, zoom));
  }, [zoom, clamp]);

  if (!open || !item) return null;

  const canZoom = zoomable;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[130] flex flex-col"
      style={{ background: "#070707" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Header */}
      <div className="shell flex items-center justify-between gap-4 py-[var(--space-sm)]">
        <p className="micro !text-[var(--color-fg-dim)]">
          {item.index && <span style={{ color: "var(--accent)" }}>{item.index} </span>}
          {item.title}
        </p>

        <div className="flex items-center gap-[clamp(10px,1.4vw,22px)]">
          {canZoom && (
            <>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
                disabled={zoom <= 1}
                aria-label="Zoom out"
                className="micro !text-[var(--color-fg)] disabled:opacity-30"
              >
                −
              </button>
              <span className="micro !text-[var(--color-fg-dim)] w-[4ch] text-center tabular-nums">
                {zoom.toFixed(1)}×
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.5))}
                disabled={zoom >= MAX_ZOOM}
                aria-label="Zoom in"
                className="micro !text-[var(--color-fg)] disabled:opacity-30"
              >
                +
              </button>
              <button
                type="button"
                onClick={reset}
                disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
                className="micro !text-[var(--color-fg)] disabled:opacity-30"
              >
                Reset
              </button>
            </>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="micro group flex items-center gap-3 py-3 !text-[var(--color-fg)]"
          >
            Close
            <svg aria-hidden viewBox="0 0 14 14" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.2">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        className="relative flex flex-1 items-center justify-center overflow-hidden px-[var(--gutter)] pb-[var(--space-sm)]"
        style={{
          cursor: canZoom ? (zoom > 1 ? (drag.current ? "grabbing" : "grab") : "zoom-in") : "default",
          touchAction: canZoom ? "none" : "auto",
        }}
        onWheel={(e) => {
          if (!canZoom) return;
          setZoom((z) => Math.max(1, Math.min(MAX_ZOOM, z - Math.sign(e.deltaY) * 0.35)));
        }}
        onDoubleClick={() => canZoom && setZoom((z) => (z > 1 ? 1 : 2))}
        onClick={(e) => {
          // A plain click on empty stage space closes; on the image it zooms in.
          if (!canZoom) return;
          if (e.target === e.currentTarget) onClose();
        }}
        onPointerDown={(e) => {
          if (!canZoom) return;
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

          if (pointers.current.size === 2) {
            // Second finger down: start a pinch and abandon any pan in progress.
            const [a, b] = [...pointers.current.values()];
            pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, zoom };
            drag.current = null;
          } else if (pointers.current.size === 1 && zoom > 1) {
            drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
          }
        }}
        onPointerMove={(e) => {
          if (!canZoom) return;
          if (pointers.current.has(e.pointerId)) {
            pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          }

          if (pinch.current && pointers.current.size >= 2) {
            const [a, b] = [...pointers.current.values()];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            const next = (pinch.current.zoom * dist) / pinch.current.dist;
            setZoom(Math.max(1, Math.min(MAX_ZOOM, next)));
            return;
          }

          const d = drag.current;
          if (!d) return;
          setPan(clamp({ x: d.px + (e.clientX - d.x), y: d.py + (e.clientY - d.y) }, zoom));
        }}
        onPointerUp={(e) => {
          pointers.current.delete(e.pointerId);
          if (pointers.current.size < 2) pinch.current = null;
          if (pointers.current.size === 0) drag.current = null;
        }}
        onPointerCancel={(e) => {
          pointers.current.delete(e.pointerId);
          pinch.current = null;
          drag.current = null;
        }}
      >
        {/* Plain img, not next/image: this is a already-sized full-resolution
            asset shown at arbitrary zoom, so the optimiser adds nothing. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.alt}
          width={item.w}
          height={item.h}
          draggable={false}
          onClick={() => canZoom && zoom === 1 && setZoom(2)}
          className="max-h-full max-w-full object-contain select-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: drag.current ? "none" : "transform 220ms cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>

      {/* Footer */}
      <div
        className="shell flex flex-wrap items-center justify-between gap-4 border-t py-[var(--space-sm)]"
        style={{ borderColor: "rgba(242,242,238,0.14)" }}
      >
        <p className="body max-w-[80ch] !text-[var(--t-small)] !text-[var(--color-fg-muted)]">
          {item.caption}
          {canZoom && (
            <span className="micro ml-3 !text-[var(--color-fg-dim)]">
              {coarse
                ? "Pinch or double-tap to zoom · drag to pan"
                : "Scroll or double-click to zoom · drag to pan"}
            </span>
          )}
        </p>
        <div className="flex items-center gap-4">
          <span className="micro !text-[var(--color-fg-dim)] tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <button type="button" onClick={() => step(-1)} className="micro !text-[var(--color-fg)] hover:opacity-60" aria-label="Previous">
            ← Prev
          </button>
          <button type="button" onClick={() => step(1)} className="micro !text-[var(--color-fg)] hover:opacity-60" aria-label="Next">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
