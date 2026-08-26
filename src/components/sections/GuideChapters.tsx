"use client";

import { useState } from "react";
import Image from "next/image";
import { guideChapters, type GuideShot } from "@/data/guide";
import { media } from "@/data/media";
import { SectionIndex, SplitHeading, Reveal } from "@/components/ui/Type";
import { useRevealImage } from "@/hooks/useRevealImage";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";

type ShotSize = { w: number; h: number };
const sizeOf = (key: string): ShotSize =>
  (media.shots as Record<string, ShotSize>)[key] ?? { w: 1600, h: 900 };

/** A framed console capture that opens the lightbox. */
function Capture({
  shot,
  onOpen,
  priority = false,
  sizes,
}: {
  shot: GuideShot;
  onOpen: (s: GuideShot) => void;
  priority?: boolean;
  sizes: string;
}) {
  const ref = useRevealImage<HTMLDivElement>();
  const { w, h } = sizeOf(shot.key);

  return (
    <figure ref={ref} data-reveal-image className="w-full">
      <button
        type="button"
        onClick={() => onOpen(shot)}
        data-cursor="View"
        className="group block w-full text-left"
        aria-label={`Enlarge: ${shot.title}`}
      >
        <div
          className="media-frame border"
          style={{ borderColor: "var(--line)", aspectRatio: `${w} / ${h}` }}
        >
          <Image
            src={`/media/shot/${shot.key}.webp`}
            alt={shot.alt}
            width={w}
            height={h}
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[#0b0b0b] opacity-0 transition-opacity duration-[--dur-med] group-hover:opacity-[0.06]"
          />
        </div>
      </button>
      <figcaption className="mt-[var(--space-sm)] border-t pt-[var(--space-xs)]" style={{ borderColor: "var(--line-soft)" }}>
        <p className="micro">{shot.title}</p>
        <p className="body mt-1 max-w-[62ch] !text-[var(--t-small)]">{shot.caption}</p>
      </figcaption>
    </figure>
  );
}

export function GuideChapters() {
  const [open, setOpen] = useState<number | null>(null);

  /** Flat ordered list, so the viewer can step across chapter boundaries. */
  const all: GuideShot[] = guideChapters.flatMap((c) => [c.lead, ...c.support]);

  const items: LightboxItem[] = all.map((s) => {
    const { w, h } = sizeOf(s.key);
    return { src: `/media/shot/${s.key}.webp`, w, h, alt: s.alt, title: s.title, caption: s.caption };
  });

  const openShot = (shot: GuideShot) => setOpen(all.findIndex((s) => s.key === shot.key));

  return (
    <>
      {guideChapters.map((c, ci) => (
        <section
          key={c.index}
          data-surface="paper"
          aria-label={c.title}
          className="shell py-[var(--space-xl)]"
        >
          <div className="grid12 gap-y-[var(--space-md)]">
            <div className="col-span-12 md:col-span-3">
              <SectionIndex id={`C.${c.index}`} label="Chapter" />
            </div>
            <div className="col-span-12 md:col-span-9">
              <SplitHeading className="h-section !text-[clamp(2.25rem,5.2vw,5rem)] max-w-[16ch]">
                {c.title}
              </SplitHeading>
              <Reveal>
                <p data-reveal className="lead mt-[var(--space-md)] max-w-[62ch]">{c.intro}</p>
              </Reveal>
            </div>
          </div>

          {/* Lead capture, dominant */}
          <div className="mt-[var(--space-lg)]">
            <Capture
              shot={c.lead}
              onOpen={openShot}
              priority={ci === 0}
              sizes="(max-width: 860px) 100vw, 92vw"
            />
          </div>

          {/* Supporting captures */}
          {c.support.length > 0 && (
            <ul className="mt-[var(--space-lg)] grid gap-x-[clamp(16px,2.4vw,44px)] gap-y-[var(--space-lg)] sm:grid-cols-2 lg:grid-cols-3">
              {c.support.map((s) => (
                <li key={s.key}>
                  <Capture shot={s} onOpen={openShot} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 31vw" />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* Not zoomable: these captures are stored at 1600px, so magnifying past
          full width would only upscale. The architecture diagrams are the ones
          that carry real detail, and those do zoom. */}
      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
