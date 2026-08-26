"use client";

import Link from "next/link";
import { Film } from "@/components/ui/Media";
import { Arrow } from "@/components/ui/AnimatedLink";
import { pageMeta, nextRoute } from "@/data/site";
import { media } from "@/data/media";

const FILM_FOR: Record<string, keyof typeof media.films> = {
  "/platform": "fleet-activation",
  "/architecture": "discovery-sweep",
  "/technology": "flow-and-fracture",
  "/guide": "governed-release",
  "/about": "dormant-estate",
  "/contact": "completion",
};

/**
 * The end of a page is a doorway, not a full stop: a large cinematic block
 * pointing at the next route in the chain.
 */
export function NextPage({ from }: { from: string }) {
  const to = nextRoute(from);
  if (!to) return null;

  const meta = pageMeta[to];
  const film = FILM_FOR[to] ?? "completion";

  return (
    <section data-surface="dark" aria-label="Continue">
      <Link href={to} className="group relative block overflow-hidden" data-cursor="Open">
        <div className="relative h-[clamp(360px,58svh,620px)] w-full overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]">
            <Film name={film} alt="" />
          </div>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(9,9,9,.82) 0%, rgba(9,9,9,.4) 50%, rgba(9,9,9,.88) 100%)" }}
          />
          <div aria-hidden className="grain absolute inset-0" />

          <div className="shell relative flex h-full flex-col justify-between py-[var(--space-lg)]">
            <p className="micro">Next</p>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="micro mb-[var(--space-sm)]" style={{ color: "var(--accent)" }}>
                  {meta.eyebrow}
                </p>
                <p className="display !text-[clamp(2.75rem,8vw,8rem)] transition-transform duration-[--dur-slow] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[clamp(6px,1vw,20px)]">
                  {meta.label}
                </p>
              </div>
              <Arrow className="h-[clamp(28px,3.5vw,56px)] w-[clamp(28px,3.5vw,56px)] transition-transform duration-[--dur-slow] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:-translate-y-2" />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
