"use client";

import { useEffect, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import Image from "next/image";
import { gsap, MQ, prefersReducedMotion } from "@/lib/motion";
import { agents } from "@/data/agents";
import { SectionIndex } from "@/components/ui/Type";

/**
 * The agent fleet as a horizontally-driven sequence.
 *
 * Desktop: vertical scroll translates the track sideways under a pin, with a
 * progress indicator. Below 1024px this becomes ordinary vertical stacking —
 * desktop horizontal mechanics are never forced onto touch.
 */
export function HorizontalShowcase() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);

  // Layout effect: creates a pin, so cleanup must beat React's DOM removal.
  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr || prefersReducedMotion()) return;

    const mm = gsap.matchMedia();

    mm.add(MQ.desktop, () => {
      const distance = () => Math.max(0, tr.scrollWidth - window.innerWidth);

      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          // Lowest of the three pins: everything above it must be measured
          // first, or this one caches a start that ignores their spacers.
          refreshPriority: 1,
          anticipatePin: 1,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(tr, { clearProps: "transform" });
        setProgress(0);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} data-surface="dark" aria-label="The agent fleet" className="relative overflow-hidden py-[var(--space-xl)] lg:py-0">
      <div className="lg:flex lg:h-[100svh] lg:flex-col lg:justify-center">
        <div className="shell mb-[var(--space-lg)] lg:mb-[var(--space-md)]">
          <SectionIndex id="S.04" label="The fleet" />
          <h2 className="h-section mt-[var(--space-sm)] max-w-[14ch]">Seven specialists, resolved by capability.</h2>
        </div>

        <ul
          ref={track}
          className="flex flex-col gap-[var(--space-lg)] px-[var(--gutter)] lg:w-max lg:flex-row lg:gap-[clamp(24px,2.6vw,56px)] lg:pr-[40vw]"
        >
          {agents.map((a) => (
            <li
              key={a.key}
              className="border-t pt-[var(--space-sm)] lg:w-[clamp(340px,26vw,460px)] lg:shrink-0"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="mb-[var(--space-sm)] flex items-center justify-between">
                <span className="micro" style={{ color: "var(--accent)" }}>{a.index}</span>
                <Image
                  src={`/media/agent/${a.key}.webp`}
                  alt=""
                  aria-hidden
                  width={256}
                  height={256}
                  sizes="52px"
                  className="h-[52px] w-[52px] object-contain opacity-90"
                />
              </div>

              <h3 className="h-sub !text-[clamp(1.6rem,2.3vw,2.4rem)]">{a.name}</h3>
              <p className="micro mt-2">{a.role}</p>
              <p className="body mt-[var(--space-sm)] max-w-[46ch] !text-[var(--t-small)]">{a.summary}</p>

              <ul className="mt-[var(--space-sm)] flex flex-wrap gap-x-4 gap-y-1">
                {a.outputs.map((o) => (
                  <li key={o} className="micro !normal-case !tracking-normal">
                    <span aria-hidden style={{ color: "var(--accent)" }}>·</span> {o}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {/* Progress indicator — desktop only */}
        <div className="shell mt-[var(--space-md)] hidden items-center gap-4 lg:flex">
          <span className="micro">
            {String(Math.min(agents.length, Math.floor(progress * agents.length) + 1)).padStart(2, "0")} / {String(agents.length).padStart(2, "0")}
          </span>
          <span className="relative h-px flex-1" style={{ background: "var(--line)" }}>
            <span
              className="absolute inset-y-0 left-0 block origin-left"
              style={{ background: "var(--accent)", width: `${Math.max(4, progress * 100)}%`, transition: "width 120ms linear" }}
            />
          </span>
          <span className="micro">Scroll to advance</span>
        </div>
      </div>
    </section>
  );
}
