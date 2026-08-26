"use client";

import { useState } from "react";
import { stack } from "@/data/tech";

/**
 * The stack as editorial rows rather than a wall of logos.
 *
 * A category is always readable at rest; hovering (or focusing) one brings its
 * members forward and dims the rest, so the interaction reveals emphasis instead
 * of hiding information. Nothing is behind a click.
 */
export function TechStack() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ul onPointerLeave={() => setActive(null)}>
      {stack.map((cat) => {
        const on = active === cat.index;
        const dim = active !== null && !on;

        return (
          <li
            key={cat.index}
            className="border-t transition-opacity duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ borderColor: "var(--line)", opacity: dim ? 0.38 : 1 }}
            onPointerEnter={() => setActive(cat.index)}
            onFocusCapture={() => setActive(cat.index)}
          >
            <div className="grid12 items-baseline gap-y-[var(--space-sm)] py-[var(--space-md)]">
              <div className="col-span-12 flex items-baseline gap-4 md:col-span-4">
                <span
                  className="micro transition-colors duration-[--dur-fast]"
                  style={{ color: on ? "var(--accent)" : undefined }}
                >
                  {cat.index}
                </span>
                <h3
                  className="h-sub !text-[clamp(1.5rem,2.8vw,2.6rem)] transition-transform duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: on ? "translateX(clamp(4px,0.6vw,12px))" : "none" }}
                >
                  {cat.name}
                </h3>
              </div>

              <ul className="col-span-12 flex flex-wrap gap-x-[clamp(14px,1.8vw,32px)] gap-y-1 md:col-span-5">
                {cat.items.map((item) => (
                  <li
                    key={item}
                    className="body !text-[var(--t-small)] transition-colors duration-[--dur-med]"
                    style={{ color: on ? "var(--fg)" : undefined }}
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <p className="micro col-span-12 !normal-case !tracking-normal md:col-span-3 md:text-right">
                {cat.line}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
