"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, DUR, EASE, prefersReducedMotion } from "@/lib/motion";
import { site } from "@/data/site";

const SEEN_KEY = "mct:loaded";

/**
 * Initial loader. Dark panel, project name, a percentage that steps rather than
 * ticks, then the panel translates up to reveal the page.
 *
 * It is tied to real readiness (fonts + window load) and capped, so it is a
 * transition rather than an artificial delay. Repeat visits within a session
 * skip it entirely.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState<boolean | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem(SEEN_KEY);
    if (seen || prefersReducedMotion()) {
      setShow(false);
      onDone();
      return;
    }
    setShow(true);
  }, [onDone]);

  useEffect(() => {
    if (show !== true) return;

    document.documentElement.style.overflow = "hidden";
    const el = panel.current;
    const num = numRef.current;
    const bar = barRef.current;
    if (!el || !num || !bar) return;

    const counter = { n: 0 };
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      sessionStorage.setItem(SEEN_KEY, "1");

      gsap
        .timeline({
          onComplete: () => {
            document.documentElement.style.overflow = "";
            setShow(false);
            onDone();
          },
        })
        .to(counter, {
          n: 100,
          duration: 0.5,
          ease: EASE,
          onUpdate: () => {
            num.textContent = String(Math.round(counter.n)).padStart(3, "0");
          },
        })
        .to(bar, { scaleX: 1, duration: 0.5, ease: EASE }, "<")
        .to(".loader-fade", { opacity: 0, duration: DUR.fast }, "+=0.15")
        .to(el, { yPercent: -100, duration: DUR.cinematic, ease: EASE }, "-=0.05");
    };

    // Progress towards 90 while assets initialise; the last 10 is the handoff.
    const tween = gsap.to(counter, {
      n: 90,
      duration: 2.2,
      ease: "power1.out",
      onUpdate: () => {
        num.textContent = String(Math.round(counter.n)).padStart(3, "0");
        gsap.set(bar, { scaleX: counter.n / 100 });
      },
    });

    const ready = Promise.all([
      (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve(),
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((r) => window.addEventListener("load", r, { once: true })),
    ]);

    const min = new Promise((r) => setTimeout(r, 900));
    Promise.all([ready, min]).then(finish);
    // Hard cap: never hold the page hostage to a slow asset.
    const cap = setTimeout(finish, 3600);

    return () => {
      clearTimeout(cap);
      tween.kill();
      document.documentElement.style.overflow = "";
    };
  }, [show, onDone]);

  if (show !== true) return null;

  return (
    <div
      ref={panel}
      className="fixed inset-0 z-[150] flex flex-col justify-between"
      style={{ background: "#090909" }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="shell loader-fade flex h-[var(--header-h)] items-center">
        <span className="micro">{site.category}</span>
      </div>

      <div className="shell loader-fade">
        <p className="display !text-[clamp(2.75rem,7vw,7rem)]">
          Migration
          <br />
          Control Tower
        </p>
      </div>

      <div className="shell loader-fade pb-[var(--space-md)]">
        <div className="flex items-end justify-between gap-6">
          <span className="micro">Initialising</span>
          <span className="numeral text-[clamp(2.5rem,6vw,5rem)]">
            <span ref={numRef}>000</span>
            <span className="micro !text-[0.28em] align-super ml-1">%</span>
          </span>
        </div>
        <span className="mt-4 block h-px w-full" style={{ background: "var(--line-soft)" }}>
          <span
            ref={barRef}
            className="block h-px w-full origin-left"
            style={{ background: "var(--accent)", transform: "scaleX(0)" }}
          />
        </span>
      </div>
    </div>
  );
}
