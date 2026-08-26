"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Loads a numbered frame sequence and exposes a draw function.
 *
 * Frames are fetched in two passes: a coarse pass that lands every Nth frame so
 * the whole arc is scrubbable almost immediately, then a fill pass for the rest.
 * That way a visitor who scrolls straight away sees the reveal at reduced
 * temporal resolution rather than an empty canvas.
 */
export function useFrameSequence(
  dir: string,
  frameCount: number,
  { enabled = true }: { enabled?: boolean } = {}
) {
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    frames.current = new Array(frameCount).fill(null);
    let cancelled = false;
    let loaded = 0;

    const src = (i: number) => `${dir}/f${String(i + 1).padStart(3, "0")}.webp`;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (!cancelled) {
            frames.current[i] = img;
            loaded += 1;
            setProgress(loaded / frameCount);
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = src(i);
      });

    (async () => {
      // Coarse pass: every 8th frame, so the full range is usable early.
      const coarse: number[] = [];
      for (let i = 0; i < frameCount; i += 8) coarse.push(i);
      await Promise.all(coarse.map(load));
      if (cancelled) return;
      setReady(true);

      // Fill pass, in small batches so the main thread stays responsive.
      const rest = Array.from({ length: frameCount }, (_, i) => i).filter(
        (i) => i % 8 !== 0
      );
      for (let i = 0; i < rest.length; i += 8) {
        if (cancelled) return;
        await Promise.all(rest.slice(i, i + 8).map(load));
      }
    })();

    return () => {
      cancelled = true;
      frames.current = [];
    };
  }, [dir, frameCount, enabled]);

  /** Nearest loaded frame at or before `index`, so gaps never blank the canvas. */
  const frameAt = (index: number): HTMLImageElement | null => {
    const i = Math.max(0, Math.min(frameCount - 1, Math.round(index)));
    for (let k = i; k >= 0; k--) if (frames.current[k]) return frames.current[k];
    for (let k = i; k < frameCount; k++) if (frames.current[k]) return frames.current[k];
    return null;
  };

  return { frameAt, ready, progress };
}
