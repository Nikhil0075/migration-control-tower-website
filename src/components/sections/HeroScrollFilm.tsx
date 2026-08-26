"use client";

import { useEffect, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger, MQ, prefersReducedMotion } from "@/lib/motion";
import { useFrameSequence } from "@/hooks/useFrameSequence";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Film } from "@/components/ui/Media";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { heroArc, heroFilmAlt } from "@/data/hero";

const SEQ_DIR = "/media/sequence/problem-solution";
const SEQ = media.sequences["problem-solution"];

/**
 * The hero: one unbroken shot, scrubbed by scroll.
 *
 * The film is a single push down a legacy data-centre aisle — five seconds of
 * tangled, unlit racks, then the overhead fluorescents switch on in sequence and
 * reveal that the aisle was ordered and observable the whole time. It is a
 * one-way arc, which is exactly why it must not loop: scroll drives the
 * timeline instead, so the visitor performs the reveal rather than watching it
 * repeat.
 *
 * Every other element is bound to the same 0→1 progress value: the headline
 * swaps at the moment the lights come up, the state label steps through
 * UNMAPPED → DISCOVERING → GOVERNED, the progress rail fills, and the call to
 * action only appears once the estate is visible. One timeline, one argument.
 */
export function HeroScrollFilm() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  const isDesktop = useMediaQuery("(min-width: 1025px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const scrubbable = isDesktop && !reduced;

  const { frameAt, ready } = useFrameSequence(SEQ_DIR, SEQ.frames, {
    enabled: scrubbable,
  });

  /* --- canvas painting --------------------------------------------------- */
  const paint = useRef<(p: number) => void>(() => {});
  useEffect(() => {
    const c = canvas.current;
    if (!c || !scrubbable) return;

    const ctx = c.getContext("2d", { alpha: false });
    if (!ctx) return;

    const resize = () => {
      // Cap DPR at 2: past that the cost is real and the gain is not.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      paint.current(progressRef.current);
    };

    const progressRef = { current: 0 };

    paint.current = (p: number) => {
      progressRef.current = p;
      const img = frameAt(p * (SEQ.frames - 1));
      if (!img) return;

      // object-fit: cover, done by hand.
      const cw = c.width;
      const ch = c.height;
      const scale = Math.max(cw / img.width, ch / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [scrubbable, frameAt]);

  // Repaint when new frames land, so the picture sharpens as loading fills in.
  useEffect(() => {
    if (scrubbable && ready) paint.current(progress);
  }, [ready, scrubbable, progress]);

  /* --- the scroll timeline ------------------------------------------------ */
  // Layout effect, not useEffect: this creates a pin, and its cleanup must run
  // before React removes the DOM. See useIsomorphicLayoutEffect.
  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    // Deliberately NOT gated on `scrubbable`. That value comes from a media
    // query hook which is false on the first render, so gating here would delay
    // this trigger until after the ones below it on the page were created —
    // and they would then have measured a document with no hero spacer in it.
    // gsap.matchMedia already handles the breakpoint.
    if (!el || prefersReducedMotion()) return;

    const mm = gsap.matchMedia();

    mm.add(MQ.desktop, () => {
      const stage = el.querySelector<HTMLElement>("[data-stage]");
      if (!stage) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        // Long enough that the reveal feels earned, short enough not to trap.
        end: () => `+=${window.innerHeight * 3.2}`,
        pin: stage,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: true,
        invalidateOnRefresh: true,
        // Highest priority: this pin is first in the document and adds several
        // viewports of spacer, so it must be measured before anything below it.
        refreshPriority: 3,
        onUpdate: (self) => {
          paint.current(self.progress);
          setProgress(self.progress);
        },
      });

      return () => st.kill();
    });

    return () => mm.revert();
  }, []);

  /* --- derived state ------------------------------------------------------ */
  // The lights come up around 55% of the shot.
  const lit = progress > 0.52;
  const phase = heroArc.find((p) => progress <= p.until) ?? heroArc[heroArc.length - 1];

  return (
    <section ref={root} data-surface="dark" aria-label="Introduction" className="relative">
      {/* The document's only h1. Both branches below present these same words
          visually, so it lives here once rather than being duplicated into each
          — the page keeps exactly one heading level 1 whichever branch renders. */}
      <h1 className="sr-only">Autonomous migration. Deterministic control.</h1>

      {/* Small screens and reduced motion: the film plays through once, in the
          reading flow. This branch also carries the copy that ships in the
          server HTML. */}
      <div
        className="hero-static relative flex flex-col justify-end overflow-hidden pb-[var(--space-lg)] pt-[calc(var(--header-h)+var(--space-md))]"
      >
        <div className="shell grid12 w-full gap-y-[var(--space-md)]">
          <div className="col-span-12">
            <p className="micro mb-[var(--space-md)]">{site.category}</p>
            <p aria-hidden className="display !text-[clamp(2.75rem,7.4vw,8.5rem)]">
              Autonomous migration.
              <br />
              Deterministic control.
            </p>
          </div>

          {/* Plays through once — no scrub, no loop. */}
          <div className="col-span-12">
            <div className="media-frame grain aspect-video w-full">
              {!scrubbable && <Film name="problem-solution" alt={heroFilmAlt} loop={false} />}
            </div>
            <p className="micro mt-[var(--space-sm)]">
              A legacy estate, before and after it can be seen
            </p>
          </div>

          <div className="col-span-12 md:col-span-7">
            <p className="lead max-w-[52ch]">{site.description}</p>
          </div>

          <div className="col-span-12 flex flex-col gap-1 md:col-span-5 md:items-end">
            <AnimatedLink href="/platform" index="01" size="lg">
              Explore the platform
            </AnimatedLink>
            <AnimatedLink href="/architecture" index="02" size="lg">
              View the architecture
            </AnimatedLink>
          </div>
        </div>
      </div>

      {/* Desktop: the scrubbed stage. */}
      <div className="hero-scrub">
      <div data-stage className="relative h-[100svh] w-full overflow-hidden">
        {/* Opening frame behind the canvas, so the first paint is the picture
            rather than an empty rectangle while frames decode. */}
        <img
          src={`${SEQ_DIR}/f001.webp`}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <canvas
          ref={canvas}
          className="absolute inset-0 h-full w-full"
          aria-label={heroFilmAlt}
          role="img"
        />

        {/* Vertical grade, weighted to the foot where the type sits. */}
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-[1200ms]"
          style={{
            opacity: lit ? 0.9 : 1,
            background:
              "linear-gradient(180deg, rgba(9,9,9,.72) 0%, rgba(9,9,9,.2) 26%, rgba(9,9,9,.26) 48%, rgba(9,9,9,.7) 74%, rgba(9,9,9,.93) 90%, rgba(9,9,9,.98) 100%)",
          }}
        />
        {/* Reading-edge scrim, which relaxes as the aisle lights up. */}
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-[1200ms]"
          style={{
            opacity: lit ? 0.55 : 1,
            background:
              "linear-gradient(90deg, rgba(9,9,9,.86) 0%, rgba(9,9,9,.5) 34%, rgba(9,9,9,0) 66%)",
          }}
        />
        <div aria-hidden className="grain absolute inset-0" />

        {/* Copy */}
        <div className="shell relative flex h-full flex-col justify-end pb-[var(--space-lg)] pt-[var(--header-h)]">
          <div className="grid12 w-full items-end gap-y-[var(--space-md)]">
            <div className="col-span-12">
              <p className="micro mb-[var(--space-md)] flex items-center gap-3">
                <span
                  aria-hidden
                  className="block h-[7px] w-[7px] rotate-45 transition-colors duration-[900ms]"
                  style={{ background: lit ? "var(--accent)" : "rgba(242,242,238,.3)" }}
                />
                {site.category}
                <span aria-hidden className="opacity-30">/</span>
                <span
                  className="transition-colors duration-[900ms]"
                  style={{ color: lit ? "var(--accent)" : undefined }}
                >
                  {phase.state}
                </span>
              </p>

              {/* Both headlines occupy one grid cell; only opacity changes, so
                  the swap costs no layout and both stay in the document. */}
              <div className="grid [&>p]:[grid-area:1/1]">
                <p
                  className="display !text-[clamp(2.5rem,6.6vw,7.5rem)] max-w-[15ch] transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ opacity: lit ? 0 : 1 }}
                  aria-hidden={lit}
                >
                  {heroArc[0].headline}
                </p>
                <p
                  aria-hidden
                  className="display !text-[clamp(2.75rem,7.4vw,8.5rem)] transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ opacity: lit ? 1 : 0 }}
                >
                  Autonomous migration.
                  <br />
                  Deterministic control.
                </p>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-7">
              <div className="grid [&>p]:[grid-area:1/1]">
                <p
                  className="lead max-w-[52ch] transition-opacity duration-[900ms]"
                  style={{ opacity: lit ? 0 : 1 }}
                  aria-hidden={lit}
                >
                  {heroArc[0].support}
                </p>
                <p
                  className="lead max-w-[52ch] transition-opacity duration-[900ms]"
                  style={{ opacity: lit ? 1 : 0 }}
                >
                  {site.description}
                </p>
              </div>
            </div>

            {/* The way in only appears once the estate is visible. */}
            <div
              className="col-span-12 flex flex-wrap items-center gap-x-[clamp(24px,4vw,72px)] gap-y-2 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:col-span-5 lg:justify-end"
              style={{
                opacity: lit ? 1 : 0,
                transform: lit ? "none" : "translateY(14px)",
                pointerEvents: lit ? "auto" : "none",
              }}
              aria-hidden={!lit}
            >
              <AnimatedLink href="/platform" index="01" size="lg">
                Explore the platform
              </AnimatedLink>
              <AnimatedLink href="/architecture" index="02" size="lg">
                View the architecture
              </AnimatedLink>
            </div>
          </div>

          {/* Timeline rail — the scroll position is the film position. */}
          <div className="mt-[var(--space-lg)] flex items-center gap-[clamp(12px,1.6vw,28px)]">
            <span className="micro whitespace-nowrap">
              {progress < 0.02 ? "Scroll to reveal" : `${String(Math.round(progress * 100)).padStart(3, "0")}%`}
            </span>
            <span className="relative h-px flex-1" style={{ background: "var(--line)" }}>
              <span
                className="absolute inset-y-0 left-0 block"
                style={{ background: "var(--accent)", width: `${progress * 100}%` }}
              />
              {heroArc.slice(0, -1).map((p) => (
                <span
                  key={p.state}
                  aria-hidden
                  className="absolute top-1/2 block h-[5px] w-[5px] -translate-y-1/2 rotate-45"
                  style={{
                    left: `${p.until * 100}%`,
                    background: progress > p.until ? "var(--accent)" : "var(--line)",
                  }}
                />
              ))}
            </span>
            <span className="micro whitespace-nowrap">
              {site.build} · {site.inventoryDate}
            </span>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
