"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, DUR, EASE } from "@/lib/motion";
import { site, nav } from "@/data/site";
import { FullscreenMenu } from "./FullscreenMenu";
import { cx } from "@/lib/cx";

/**
 * Minimal header: wordmark, a short desktop nav, and MENU.
 *
 * It starts transparent and, once past the first viewport, compresses and gains
 * a hairline rule — contextual rather than a frosted-glass bar.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const el = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal the header after the hero has begun — it arrives late, by design.
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(node, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: DUR.slow, ease: EASE, delay: 0.5 });
    }, node);
    return () => ctx.revert();
  }, []);

  // Close on route change.
  useEffect(() => setOpen(false), [pathname]);

  const primary = nav.slice(0, 3);

  return (
    <>
      <header
        ref={el}
        className="fixed inset-x-0 top-0 z-[100] transition-[height,background-color,border-color] duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          height: scrolled ? "58px" : "var(--header-h)",
          backgroundColor: scrolled ? "rgba(9,9,9,0.86)" : "transparent",
          borderBottom: `1px solid ${scrolled ? "var(--line-soft)" : "transparent"}`,
          backdropFilter: scrolled ? "saturate(120%) blur(6px)" : undefined,
        }}
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
            <TowerMark />
            <span className="micro !text-[clamp(10px,0.8vw,12px)] !text-[var(--color-fg)] transition-opacity duration-[--dur-fast] group-hover:opacity-60">
              Migration<span className="opacity-40"> / </span>Control Tower
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-[clamp(18px,2.2vw,40px)] lg:flex">
            {primary.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "micro group relative py-2",
                    "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left",
                    "after:bg-current after:transition-transform after:duration-[--dur-med] after:ease-[cubic-bezier(0.16,1,0.3,1)]",
                    active ? "after:scale-x-100 !text-[var(--color-fg)]" : "after:scale-x-0 hover:after:scale-x-100"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="micro group relative flex items-center gap-3 py-3 !text-[var(--color-fg)]"
          >
            <span className="relative overflow-hidden">
              <span className="block transition-transform duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                Menu
              </span>
              <span
                aria-hidden
                className="absolute left-0 top-0 block translate-y-full transition-transform duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                style={{ color: "var(--accent)" }}
              >
                Menu
              </span>
            </span>
            <span aria-hidden className="flex flex-col gap-[3px]">
              <span className="block h-px w-4 bg-current transition-transform duration-[--dur-med] group-hover:translate-x-[-3px]" />
              <span className="block h-px w-4 bg-current transition-transform duration-[--dur-med] group-hover:translate-x-[3px]" />
            </span>
          </button>
        </div>
      </header>

      <FullscreenMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** Reductive mark derived from the project logo: a tower inside an orbit. */
function TowerMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
      <ellipse cx="12" cy="12" rx="10.5" ry="6.5" stroke="var(--accent)" strokeWidth="1" opacity=".55" />
      <path d="M12 2.5v19" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8.5 21.5V9.5L12 6l3.5 3.5v12" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
