"use client";

import { useEffect, useRef } from "react";
import { gsap, DUR, EASE, prefersReducedMotion } from "@/lib/motion";
import { Film } from "@/components/ui/Media";
import { media } from "@/data/media";

/**
 * Interior-page hero. Shorter than the home hero (it is a chapter opener, not a
 * front door) but built from the same motion grammar: media settles, then the
 * headline rises line by line, then the supporting copy.
 */
export function PageHero({
  eyebrow,
  lines,
  supporting,
  film,
  filmAlt,
}: {
  eyebrow: string;
  lines: string[];
  supporting: string;
  film: keyof typeof media.films;
  filmAlt: string;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // See Hero: hiding is conditional on JS being able to animate, and a
    // background tab (where rAF is paused) counts as "cannot".
    if (prefersReducedMotion() || document.hidden) return;
    el.setAttribute("data-motion-ready", "");

    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.1 })
        .fromTo(
          "[data-ph-media]",
          { scale: 1.05, clipPath: "inset(16% 8% 16% 8%)" },
          { scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.7, ease: EASE }
        )
        .fromTo("[data-ph-eyebrow]", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DUR.slow, ease: EASE }, "-=1.35")
        .fromTo("[data-ph-line]", { yPercent: 110 }, { yPercent: 0, duration: DUR.cinematic, ease: EASE, stagger: 0.09 }, "-=1.15")
        .fromTo("[data-ph-support]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: DUR.slow, ease: EASE }, "-=0.8");
    }, el);

    return () => {
      ctx.revert();
      el.removeAttribute("data-motion-ready");
    };
  }, []);

  return (
    <section
      ref={root}
      data-surface="dark"
      className="relative flex min-h-[clamp(520px,78svh,860px)] flex-col justify-end overflow-hidden pb-[var(--space-lg)] pt-[calc(var(--header-h)+var(--space-lg))]"
      aria-label={eyebrow}
    >
      <div className="absolute inset-0 z-0">
        <div data-ph-media className="h-full w-full">
          <Film name={film} alt={filmAlt} priority />
        </div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(9,9,9,.66) 0%, rgba(9,9,9,.16) 26%, rgba(9,9,9,.30) 50%, rgba(9,9,9,.68) 72%, rgba(9,9,9,.92) 90%, rgba(9,9,9,.97) 100%)",
          }}
        />
        {/* Scrim on the reading edge, matching the home hero. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(9,9,9,.8) 0%, rgba(9,9,9,.45) 34%, rgba(9,9,9,0) 64%)",
          }}
        />
        <div aria-hidden className="grain absolute inset-0" />
      </div>

      <div className="shell grid12 relative z-10 w-full items-end gap-y-[var(--space-md)]">
        <div className="col-span-12">
          <p data-fade data-ph-eyebrow className="micro mb-[var(--space-md)]">
            {eyebrow}
          </p>
          <h1 className="display !text-[clamp(2.5rem,7vw,7.5rem)]">
            {lines.map((line, i) => (
              <span key={i} className="line-mask">
                <span data-ph-line className="block">
                  {line}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <div className="col-span-12 md:col-span-7">
          <p data-fade data-ph-support className="lead max-w-[58ch]">
            {supporting}
          </p>
        </div>
      </div>
    </section>
  );
}
