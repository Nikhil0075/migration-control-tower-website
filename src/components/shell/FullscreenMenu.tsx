"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap, DUR, EASE, prefersReducedMotion } from "@/lib/motion";
import { nav, links, site } from "@/data/site";
import { useSmoothScroll } from "@/providers/SmoothScroll";
import { Arrow } from "@/components/ui/AnimatedLink";
import { Film } from "@/components/ui/Media";
import { cx } from "@/lib/cx";

/** Background film swapped per hovered link — one per nav entry. */
const HOVER_FILM: Record<string, string> = {
  "/platform": "fleet-activation",
  "/architecture": "discovery-sweep",
  "/technology": "flow-and-fracture",
  "/guide": "governed-release",
  "/about": "dormant-estate",
  "/contact": "completion",
};

export function FullscreenMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { stop, start } = useSmoothScroll();
  const [hovered, setHovered] = useState<string | null>(null);

  /* --- open / close choreography ---------------------------------------- */
  useEffect(() => {
    const el = panel.current;
    if (!el) return;

    const reduced = prefersReducedMotion();
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-menu-item]") ?? [];

    // Kill anything still running on the panel before starting the opposite
    // direction. Without this a close tween that is still in flight fires its
    // onComplete after the open has begun, setting autoAlpha back to 0 and
    // leaving the menu open but invisible.
    gsap.killTweensOf(el);

    if (open) {
      stop();
      el.style.pointerEvents = "auto";
      if (reduced) {
        gsap.set(el, { clipPath: "inset(0% 0 0 0)", autoAlpha: 1 });
        gsap.set(items, { yPercent: 0, opacity: 1 });
      } else {
        gsap
          .timeline()
          .set(el, { autoAlpha: 1 })
          .fromTo(
            el,
            { clipPath: "inset(0 0 100% 0)" },
            { clipPath: "inset(0 0 0% 0)", duration: DUR.slow, ease: EASE }
          )
          .fromTo(
            items,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE, stagger: 0.06 },
            "-=0.75"
          );
      }
    } else {
      el.style.pointerEvents = "none";
      start();
      if (reduced) {
        gsap.set(el, { autoAlpha: 0 });
      } else {
        gsap.to(el, {
          clipPath: "inset(0 0 100% 0)",
          duration: DUR.med,
          ease: EASE,
          onComplete: () => gsap.set(el, { autoAlpha: 0 }),
        });
      }
    }
  }, [open, stop, start]);

  /* --- escape + focus trap ---------------------------------------------- */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panel.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    // Move focus into the panel once it is open.
    const t = window.setTimeout(() => {
      panel.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }, 260);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  /**
   * Animate the menu out, then navigate. Closing first is what makes route
   * changes feel deliberate rather than abrupt.
   */
  const go = (href: string) => {
    if (href === pathname) {
      onClose();
      return;
    }
    onClose();
    window.setTimeout(() => router.push(href), prefersReducedMotion() ? 0 : 380);
  };

  return (
    <div
      ref={panel}
      id="site-menu"
      className="fixed inset-0 z-[95] flex flex-col justify-between overflow-hidden opacity-0"
      style={{ background: "var(--color-bg)", clipPath: "inset(0 0 100% 0)" }}
      aria-hidden={!open}
      data-surface="dark"
    >
      {/* Hovered-link background film, kept very low so type stays dominant.
          Only the hovered film is mounted — keying the element on `hovered`
          means one <video> exists at a time instead of six. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {open && hovered && HOVER_FILM[hovered] && (
          <div
            key={hovered}
            className="absolute inset-0 animate-[menufade_900ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
            style={{ opacity: 0 }}
          >
            <Film name={HOVER_FILM[hovered] as never} alt="" />
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,#090909 12%,rgba(9,9,9,.55) 60%,rgba(9,9,9,.85))" }} />
      </div>

      <div className="shell relative flex h-[var(--header-h)] items-center justify-between">
        <span className="micro">{site.name}</span>
        <button
          type="button"
          onClick={onClose}
          className="micro group flex items-center gap-3 py-3"
        >
          <span className="transition-opacity duration-[--dur-fast] group-hover:opacity-60">Close</span>
          <svg aria-hidden viewBox="0 0 14 14" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.2">
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>
      </div>

      {/* overflow-y-auto keeps the list reachable on short viewports (landscape
          phones), where six oversized rows can exceed the available height. */}
      <nav className="shell relative flex flex-1 items-center overflow-y-auto overscroll-contain" aria-label="Main">
        <ul ref={listRef} className="w-full">
          {nav.map((item) => {
            const active = pathname === item.href;
            const dim = hovered !== null && hovered !== item.href;
            return (
              <li
                key={item.href}
                className="border-t"
                style={{ borderColor: "var(--line-soft)" }}
                onPointerEnter={() => setHovered(item.href)}
                onPointerLeave={() => setHovered(null)}
              >
                <div className="overflow-hidden">
                  <a
                    data-menu-item
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.href);
                    }}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "group flex items-baseline gap-[clamp(12px,2vw,40px)] py-[clamp(8px,1.1vw,18px)]",
                      "transition-opacity duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    )}
                    style={{ opacity: dim ? 0.32 : 1 }}
                  >
                    <span className="micro w-[3ch] shrink-0" style={{ color: active ? "var(--accent)" : undefined }}>
                      {item.index}
                    </span>
                    <span className="h-section !text-[clamp(2.25rem,6.2vw,5.5rem)] transition-transform duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[clamp(6px,1vw,18px)]">
                      {item.label}
                    </span>
                    <span className="ml-auto hidden items-baseline gap-6 md:flex">
                      <span className="micro max-w-[34ch] text-right normal-case tracking-normal opacity-0 transition-opacity duration-[--dur-med] group-hover:opacity-100">
                        {item.note}
                      </span>
                      <Arrow className="h-4 w-4 -translate-x-2 opacity-0 transition-all duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shell relative flex flex-wrap items-center justify-between gap-4 pb-[var(--space-md)]">
        <p className="micro max-w-[40ch] normal-case tracking-normal">{site.pitch}</p>
        <div className="flex gap-[clamp(16px,2vw,36px)]">
          <a className="micro hover:opacity-60" href={links.github} target="_blank" rel="noreferrer noopener">
            GitHub
          </a>
          <a className="micro hover:opacity-60" href={`mailto:${links.email}`}>
            Email
          </a>
        </div>
      </div>

      <style>{`@keyframes menufade { to { opacity: .22; } }`}</style>
    </div>
  );
}
