"use client";

import { useRef, useState, useId } from "react";
import Image from "next/image";
import { agents } from "@/data/agents";
import { cx } from "@/lib/cx";

/**
 * An editorial accordion, not a toggle.
 *
 * Closed rows are a hairline, an index and a name. Opening animates the panel's
 * height via a grid-template-rows transition (which, unlike max-height, needs no
 * magic number and never clips), and the contents fade up behind it.
 *
 * Accessibility: a real button per row with aria-expanded/aria-controls, and the
 * panel hidden from the tree while collapsed.
 */
export function EditorialAccordion() {
  const [open, setOpen] = useState<string | null>(agents[0].key);
  const uid = useId();

  return (
    <ul>
      {agents.map((a) => {
        const isOpen = open === a.key;
        const panelId = `${uid}-${a.key}-panel`;
        const btnId = `${uid}-${a.key}-button`;

        return (
          <li key={a.key} className="border-t" style={{ borderColor: "var(--line)" }}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : a.key)}
                className="group flex w-full items-center gap-[clamp(16px,2.4vw,48px)] py-[clamp(18px,2vw,32px)] text-left"
              >
                <span
                  className="micro w-[3ch] shrink-0 transition-colors duration-[--dur-fast]"
                  style={{ color: isOpen ? "var(--accent)" : undefined }}
                >
                  {a.index}
                </span>

                <span
                  className={cx(
                    "h-sub !text-[clamp(1.5rem,3.4vw,3rem)] transition-transform duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "group-hover:translate-x-[clamp(4px,0.6vw,12px)]"
                  )}
                >
                  {a.name}
                </span>

                <span className="micro ml-auto hidden shrink-0 md:block">{a.role}</span>

                <span
                  aria-hidden
                  className="relative ml-4 block h-3 w-3 shrink-0"
                  style={{ color: isOpen ? "var(--accent)" : "var(--fg-dim)" }}
                >
                  <span className="absolute left-0 top-1/2 block h-px w-3 -translate-y-1/2 bg-current" />
                  <span
                    className="absolute left-1/2 top-0 block h-3 w-px -translate-x-1/2 bg-current transition-transform duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: `translateX(-50%) scaleY(${isOpen ? 0 : 1})` }}
                  />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className="grid transition-[grid-template-rows] duration-[--dur-slow] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div
                  className="grid12 gap-y-[var(--space-md)] pb-[var(--space-lg)] transition-all duration-[--dur-slow] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "translateY(0)" : "translateY(18px)",
                  }}
                >
                  <div className="col-span-12 md:col-span-3">
                    <Image
                      src={`/media/agent/${a.key}.webp`}
                      alt=""
                      aria-hidden
                      width={256}
                      height={256}
                      sizes="120px"
                      className="h-[clamp(72px,7vw,120px)] w-[clamp(72px,7vw,120px)] object-contain"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-5">
                    <p className="lead max-w-[46ch]">{a.summary}</p>
                    <p className="body mt-[var(--space-sm)] max-w-[52ch] !text-[var(--t-small)]">{a.detail}</p>
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <p className="micro mb-[var(--space-sm)]">Produces</p>
                    <ul className="flex flex-col gap-2">
                      {a.outputs.map((o) => (
                        <li
                          key={o}
                          className="body flex items-baseline gap-3 border-t pt-2 !text-[var(--t-small)]"
                          style={{ borderColor: "var(--line-soft)" }}
                        >
                          <span aria-hidden className="micro" style={{ color: "var(--accent)" }}>
                            ·
                          </span>
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
