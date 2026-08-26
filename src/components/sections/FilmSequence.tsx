"use client";

import { useEffect, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger, MQ, prefersReducedMotion } from "@/lib/motion";
import { chapters } from "@/data/story";
import { Film } from "@/components/ui/Media";
import { SectionIndex } from "@/components/ui/Type";
import { media } from "@/data/media";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * The film sequence — the spine of the home page.
 *
 * On desktop the stage pins and scroll advances six chapters, each bound to one
 * of the project's own cinematic renders. Films crossfade; the copy swaps
 * beneath a mask; a progress rail tracks position. Only the active film plays,
 * so six videos never decode at once.
 *
 * Below 1024px it degrades to six ordinary stacked blocks — no pinning, no
 * hijacked scroll. Under reduced motion the films are replaced by their poster
 * frames and the whole thing reads as a normal article.
 */
export function FilmSequence() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  // Which layout is *shown* is decided in CSS (.seq-stage / .seq-stacked), so
  // the pinned stage exists in the DOM from first paint and its ScrollTrigger is
  // created in the same pass as every other pin on the page. This flag only
  // gates video mounting, so the hidden branch never costs a download.
  const isDesktop = useMediaQuery("(min-width: 1025px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const cinematic = isDesktop && !reduced;

  // Layout effect: creates a pin, so cleanup must beat React's DOM removal.
  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const mm = gsap.matchMedia();

    mm.add(MQ.desktop, () => {
      setPinned(true);
      const stage = el.querySelector<HTMLElement>("[data-stage]");
      if (!stage) return;

      const st = ScrollTrigger.create({
        trigger: el,
        // A small lead-in: the stage settles into place just before it locks,
        // rather than snapping the instant the section reaches the top.
        start: "top top",
        end: () => `+=${window.innerHeight * chapters.length}`,
        pin: stage,
        pinSpacing: true,
        anticipatePin: 1,
        // `end` is derived from viewport height, so it must be recomputed
        // whenever anything above this section changes the layout.
        invalidateOnRefresh: true,
        // Second in the document, so it is measured after the hero has laid out
        // its spacer but before the fleet measures against this one.
        refreshPriority: 2,
        onUpdate: (self) => {
          const i = Math.min(
            chapters.length - 1,
            Math.floor(self.progress * chapters.length * 0.999)
          );
          setActive(i);
        },
      });

      // The progress rail is a single scrubbed tween rather than per-frame state.
      const rail = el.querySelector<HTMLElement>("[data-rail]");
      const railTween = rail
        ? gsap.fromTo(
            rail,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top top",
                end: () => `+=${window.innerHeight * chapters.length}`,
                scrub: true,
                invalidateOnRefresh: true,
                refreshPriority: 2,
              },
            }
          )
        : null;

      return () => {
        st.kill();
        railTween?.scrollTrigger?.kill();
        railTween?.kill();
        setPinned(false);
      };
    });

    return () => mm.revert();
  }, []);

  /* --- stacked layout: tablet, mobile, reduced motion -------------------- */
  const stacked = (
    <div className="seq-stacked shell flex flex-col gap-[var(--space-xl)] py-[var(--space-lg)]">
      {chapters.map((c) => (
        <article key={c.index} className="flex flex-col gap-[var(--space-sm)]">
          <SectionIndex id={c.index} label={c.state} />
          <div className="media-frame grain aspect-video w-full">
            {/* Only mounted when this branch is the visible one, so the desktop
                page never carries six extra video elements. */}
            {!cinematic && <Film name={c.film as keyof typeof media.films} alt={c.alt} />}
          </div>
          <h3 className="h-sub mt-2">{c.title}</h3>
          <p className="body max-w-[62ch]">{c.body}</p>
        </article>
      ))}
    </div>
  );

  return (
    <section
      ref={root}
      data-surface="dark"
      aria-label="How a migration runs"
      className="relative"
    >
      {stacked}

      <div className="seq-stage">
      <div
        data-stage
        className="relative h-[100svh] w-full overflow-hidden"
      >
        {/* Films: all mounted, only the active one visible and playing. */}
        <div className="absolute inset-0">
          {chapters.map((c, i) => (
            <div
              key={c.film}
              className="absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ opacity: i === active ? 1 : 0 }}
              aria-hidden={i !== active}
            >
              {/* The stage div must exist from first paint so its pin is
                  registered in document order, but its films need not: gating
                  them keeps small screens from carrying six inert elements. */}
              {cinematic && (
                <Film
                  name={c.film as keyof typeof media.films}
                  alt={c.alt}
                  active={pinned ? i === active : false}
                  priority={i === 0}
                />
              )}
            </div>
          ))}
          {/* Scrim weighted to the left half, where the chapter copy sits. The
              right third stays clear so the film is still the subject. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(9,9,9,.97) 0%, rgba(9,9,9,.93) 30%, rgba(9,9,9,.72) 48%, rgba(9,9,9,.22) 70%, rgba(9,9,9,.1) 84%, rgba(9,9,9,.45) 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(9,9,9,.7) 0%, rgba(9,9,9,0) 22%, rgba(9,9,9,0) 74%, rgba(9,9,9,.72) 100%)",
            }}
          />
          <div aria-hidden className="grain absolute inset-0" />
        </div>

        {/* Editorial overlay */}
        <div className="shell relative flex h-full items-center">
          <div className="grid12 w-full items-center">
            {/* Chapter rail */}
            <div className="col-span-2 flex items-stretch gap-[clamp(12px,1.4vw,24px)]">
              <div className="relative w-px" style={{ background: "var(--line)" }}>
                <span
                  data-rail
                  className="absolute inset-x-0 top-0 block h-full origin-top"
                  style={{ background: "var(--accent)", transform: "scaleY(0)" }}
                />
              </div>
              <ol className="flex flex-col justify-between py-2">
                {chapters.map((c, i) => (
                  <li
                    key={c.index}
                    className="micro transition-opacity duration-[--dur-med]"
                    style={{
                      opacity: i === active ? 1 : 0.34,
                      color: i === active ? "var(--accent)" : undefined,
                    }}
                  >
                    {c.index}
                  </li>
                ))}
              </ol>
            </div>

            {/* Chapter copy.

                All six chapters share one grid cell rather than being toggled
                with display, because `display` is not transitionable — swapping
                none/block makes the text hard-cut while the film behind it
                crossfades, and that mismatch is what reads as abrupt. Stacked in
                one cell, opacity and transform actually animate, and the layout
                is sized by the tallest chapter so nothing shifts. */}
            <div className="col-span-7 grid xl:col-span-6 [&>div]:[grid-area:1/1]">
              {chapters.map((c, i) => (
                <div
                  key={c.index}
                  aria-hidden={i !== active}
                  className="transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: i === active ? "none" : "translateY(18px)",
                    pointerEvents: i === active ? "auto" : "none",
                  }}
                >
                  <p className="micro mb-[var(--space-sm)]" style={{ color: "var(--accent)" }}>
                    {c.state}
                  </p>
                  <h2 className="h-section !text-[clamp(2.5rem,4.6vw,5rem)]">{c.title}</h2>
                  <p className="body mt-[var(--space-md)] max-w-[52ch] !text-[clamp(1rem,1.05vw,1.2rem)]">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Counter */}
        <div className="shell absolute inset-x-0 bottom-[var(--space-md)] flex items-end justify-between">
          <p className="micro">The sequence</p>
          <p className="numeral text-[clamp(2rem,3.4vw,3.25rem)]">
            <span style={{ color: "var(--accent)" }}>{chapters[active].index}</span>
            <span className="opacity-30"> / {String(chapters.length).padStart(2, "0")}</span>
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}
