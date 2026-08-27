"use client";

import { useMarquee } from "@/hooks/useMarquee";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { services } from "@/data/services";

/**
 * The services the fleet runs on, running horizontally.
 *
 * Marks are held at one stroke weight and one colour so the strip reads as a
 * single band rather than a wall of vendor badges — the accent only appears on
 * the hovered item. The whole row slows rather than stopping on hover, so a
 * reader can settle on one without the motion snapping dead.
 *
 * The sequence is rendered twice and translated exactly -50%, which is what
 * makes the loop seamless; the duplicate is hidden from assistive technology so
 * a screen reader hears the list once.
 *
 * Under reduced motion the strip does not move — which would leave most of the
 * the list clipped off the right edge with no way to reach it. So that case
 * gets a wrapped static list instead: same content, no motion, nothing hidden.
 */
export function ServiceMarquee() {
  const track = useMarquee<HTMLDivElement>(64);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  const sequence = (duplicate: boolean) => (
    <ul className="flex shrink-0 items-stretch" aria-hidden={duplicate || undefined}>
      {services.map((s) => (
        <li
          key={`${s.name}-${duplicate ? "b" : "a"}`}
          className="group flex items-center gap-[10px] whitespace-nowrap px-[14px] sm:gap-[clamp(10px,1vw,16px)] sm:px-[clamp(18px,1.8vw,34px)]"
        >
          <span
            className="block h-[clamp(20px,1.7vw,26px)] w-[clamp(20px,1.7vw,26px)] shrink-0 text-[color:var(--fg-dim)] transition-colors duration-[--dur-med] group-hover:text-[color:var(--accent)]"
            style={{ lineHeight: 0 }}
          >
            {s.mark}
          </span>

          <span className="flex flex-col leading-none">
            <span className="h-sub !text-[0.95rem] transition-colors duration-[--dur-med] sm:!text-[clamp(1rem,1.4vw,1.4rem)]">
              {s.name}
            </span>
            {/* The role is a second line of detail. On a narrow screen it makes
                each item so wide that barely one fits, which stops the strip
                reading as a strip — so below 640px the name carries it alone.
                Desktop and the reduced-motion list both still show it. */}
            <span className="micro mt-[0.45em] hidden !text-[color:var(--fg-dim)] sm:block">
              {s.role}
            </span>
          </span>

          <span
            aria-hidden
            className="ml-[clamp(6px,0.8vw,14px)] block h-[5px] w-[5px] shrink-0 rotate-45 transition-colors duration-[--dur-med]"
            style={{ background: "var(--line)" }}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section data-surface="dark" aria-label="Services the fleet runs on" className="relative">
      <div className="shell">
        <p className="micro border-t pt-[var(--space-sm)]" style={{ borderColor: "var(--line)" }}>
          Runs on
        </p>
      </div>

      {reduced ? (
        <ul className="shell mt-[var(--space-sm)] flex flex-wrap gap-x-[clamp(18px,2vw,36px)] gap-y-[var(--space-sm)] py-[clamp(14px,1.6vw,26px)]">
          {services.map((s) => (
            <li key={s.name} className="flex items-center gap-[clamp(10px,1vw,16px)]">
              <span
                className="block h-[clamp(20px,1.7vw,26px)] w-[clamp(20px,1.7vw,26px)] shrink-0 text-[color:var(--fg-dim)]"
                style={{ lineHeight: 0 }}
              >
                {s.mark}
              </span>
              <span className="flex flex-col leading-none">
                <span className="h-sub !text-[clamp(1rem,1.4vw,1.4rem)]">{s.name}</span>
                <span className="micro mt-[0.45em] !text-[color:var(--fg-dim)]">{s.role}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
      <div className="relative mt-[var(--space-sm)] overflow-hidden py-[clamp(14px,1.6vw,26px)]">
        {/* Feathered edges, so items enter and leave rather than being chopped. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[28px] sm:w-[clamp(40px,8vw,140px)]"
          style={{ background: "linear-gradient(90deg, var(--bg), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[28px] sm:w-[clamp(40px,8vw,140px)]"
          style={{ background: "linear-gradient(270deg, var(--bg), transparent)" }}
        />

        <div ref={track} className="flex w-max">
          {sequence(false)}
          {sequence(true)}
        </div>
      </div>
      )}

      <div className="shell">
        <p
          className="micro border-b pb-[var(--space-sm)] !normal-case !tracking-normal"
          style={{ borderColor: "var(--line)" }}
        >
          Eighteen services and frameworks, one service identity per stage. Nothing here is
          aspirational — every one is in the deployed topology.
        </p>
      </div>
    </section>
  );
}
