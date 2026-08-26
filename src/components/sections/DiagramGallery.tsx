"use client";

import { useState } from "react";
import { RevealImage } from "@/components/ui/Media";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";
import { diagrams } from "@/data/diagrams";
import { media } from "@/data/media";

/**
 * The thirteen-diagram topology pack.
 *
 * Every frame opens a zoomable viewer. That is not decoration: these are
 * 3840×2160 drawings with thirty-odd labelled nodes, and at gallery width the
 * labels are unreadable — so the pack is only actually useful if you can
 * magnify it.
 */
export function DiagramGallery() {
  const [open, setOpen] = useState<number | null>(null);

  const items: LightboxItem[] = diagrams.map((d) => {
    const size = (media.diagrams as Record<string, { w: number; h: number }>)[d.key] ?? {
      w: 3840,
      h: 2160,
    };
    return {
      // The full-resolution copy, loaded only when the viewer opens.
      src: `/media/diagram/${d.key}-full.webp`,
      w: size.w,
      h: size.h,
      alt: d.alt,
      title: d.title,
      caption: d.question,
      index: d.no,
    };
  });

  return (
    <>
      <ul className="mt-[var(--space-lg)] flex flex-col gap-[var(--space-xl)]">
        {diagrams.map((d, i) => {
          const left = i % 2 === 0;
          return (
            <li key={d.key} className="grid12 items-start gap-y-[var(--space-sm)]">
              <div
                className={
                  left
                    ? "col-span-12 md:col-span-3"
                    : "col-span-12 md:col-start-10 md:col-span-3 md:row-start-1"
                }
              >
                <div className="flex items-baseline gap-4">
                  <span className="micro" style={{ color: "var(--accent)" }}>
                    {d.no}
                  </span>
                  <h3 className="h-sub !text-[clamp(1.15rem,1.7vw,1.6rem)]">{d.title}</h3>
                </div>
                <p className="body mt-[var(--space-sm)] !text-[var(--t-small)]">{d.question}</p>
                <p className="micro mt-[var(--space-sm)]">Click to enlarge</p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Enlarge diagram ${d.no}: ${d.title}`}
                className={
                  left
                    ? "col-span-12 block w-full text-left md:col-start-5 md:col-span-8"
                    : "col-span-12 block w-full text-left md:col-start-1 md:col-span-8 md:row-start-1"
                }
              >
                <RevealImage
                  bucket="diagram"
                  name={d.key}
                  alt={d.alt}
                  frameClassName="border"
                  sizes="(max-width: 860px) 100vw, 62vw"
                  cursor="Zoom"
                />
              </button>
            </li>
          );
        })}
      </ul>

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} zoomable />
    </>
  );
}
