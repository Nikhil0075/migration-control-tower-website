"use client";

import { useMarquee } from "@/hooks/useMarquee";
import { cx } from "@/lib/cx";

/**
 * A slow infinite ticker. The caller's terms are rendered twice so the loop
 * closes seamlessly; the duplicate is hidden from assistive technology.
 */
export function Marquee({
  terms,
  seconds = 46,
  className,
}: {
  terms: string[];
  seconds?: number;
  className?: string;
}) {
  const ref = useMarquee<HTMLDivElement>(seconds);

  const sequence = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {terms.map((t, i) => (
        <li key={`${t}-${i}`} className="flex items-center">
          <span className="h-sub !text-[clamp(1.5rem,3.2vw,3.25rem)] whitespace-nowrap px-[clamp(14px,1.6vw,32px)]">
            {t}
          </span>
          <span aria-hidden className="block h-[6px] w-[6px] rotate-45" style={{ background: "var(--accent)" }} />
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cx("relative overflow-hidden border-y py-[clamp(14px,1.6vw,28px)]", className)} style={{ borderColor: "var(--line)" }}>
      <div ref={ref} className="flex w-max">
        {sequence(false)}
        {sequence(true)}
      </div>
    </div>
  );
}
