"use client";

import { useEffect, useRef } from "react";
import { gsap, EASE, prefersReducedMotion } from "@/lib/motion";
import { states, recoveryStates } from "@/data/lifecycle";
import { cx } from "@/lib/cx";

/**
 * The legal state path, drawn as a single continuous rule with the recovery
 * branch dropping away beneath it.
 *
 * The rule draws left-to-right on scroll and the state labels light in order, so
 * the animation carries the same argument the copy makes: states advance, and a
 * failure leaves the main line rather than skipping ahead on it.
 */
export function StatePath({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const rail = el.querySelector<HTMLElement>("[data-rail]");
      const items = gsap.utils.toArray<HTMLElement>("[data-state]");
      const branch = gsap.utils.toArray<HTMLElement>("[data-branch]");

      gsap.set(items, { opacity: 0.18 });
      gsap.set(branch, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 78%", once: true },
      });

      if (rail) tl.fromTo(rail, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power2.inOut" });
      tl.to(items, { opacity: 1, duration: 0.4, ease: EASE, stagger: 0.06 }, "-=1.2");
      tl.to(branch, { opacity: 1, duration: 0.5, ease: EASE, stagger: 0.05 }, "-=0.3");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={className}>
      {/* Main legal path */}
      <div className="relative">
        <span
          aria-hidden
          className="absolute left-0 top-[5px] block h-px w-full"
          style={{ background: "var(--line)" }}
        />
        <span
          data-rail
          aria-hidden
          className="absolute left-0 top-[5px] block h-px w-full origin-left"
          style={{ background: "var(--accent)" }}
        />

        <ol className="flex flex-wrap gap-x-[clamp(14px,1.8vw,32px)] gap-y-[var(--space-sm)]">
          {states.map((s, i) => (
            <li key={s} data-state className="relative pt-[var(--space-sm)]">
              <span
                aria-hidden
                className="absolute left-0 top-[2px] block h-[7px] w-[7px] rotate-45"
                style={{
                  background: i === states.length - 1 ? "var(--accent)" : "var(--bg)",
                  border: `1px solid ${i === states.length - 1 ? "var(--accent)" : "var(--line)"}`,
                }}
              />
              <span className="micro block whitespace-nowrap">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Recovery branch */}
      <div className="mt-[var(--space-md)] flex flex-wrap items-center gap-x-[clamp(10px,1.4vw,22px)] gap-y-3 pl-[clamp(0px,6vw,120px)]">
        <span data-branch className="micro" style={{ color: "var(--accent)" }}>
          On failure
        </span>
        <span data-branch aria-hidden className="micro">
          ↳
        </span>
        {recoveryStates.map((s, i) => (
          <span key={`${s}-${i}`} data-branch className="flex items-center gap-[clamp(10px,1.4vw,22px)]">
            <span
              className={cx("micro whitespace-nowrap")}
              style={{ color: s === "FAILED" ? "var(--accent)" : undefined }}
            >
              {s}
            </span>
            {i < recoveryStates.length - 1 && (
              <span aria-hidden className="block h-px w-[clamp(12px,2vw,36px)]" style={{ background: "var(--line)" }} />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
