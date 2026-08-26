"use client";

import Link from "next/link";
import { site, links, nav } from "@/data/site";
import { SplitHeading, Reveal } from "@/components/ui/Type";
import { AnimatedLink } from "@/components/ui/AnimatedLink";

/**
 * The footer is treated as another major section, not an afterthought: a full
 * editorial CTA, then a navigation grid, then the fine print.
 */
export function Footer() {
  return (
    <footer data-surface="dark" className="relative border-t" style={{ borderColor: "var(--line)" }}>
      <div className="shell pt-[var(--space-xl)] pb-[var(--space-lg)]">
        <div className="grid12">
          <p className="micro col-span-12 mb-[var(--space-md)] md:col-span-3">Get in touch</p>

          <div className="col-span-12 md:col-span-9">
            <SplitHeading as="h2" className="h-section max-w-[16ch]">
              Make migration autonomous without making it unaccountable.
            </SplitHeading>

            <Reveal className="mt-[var(--space-lg)] flex flex-wrap items-center gap-x-[clamp(24px,4vw,72px)] gap-y-4">
              <span data-reveal>
                <AnimatedLink href="/contact" size="lg">
                  Start a conversation
                </AnimatedLink>
              </span>
              <span data-reveal>
                <AnimatedLink href={`mailto:${links.email}`} size="lg">
                  {links.email}
                </AnimatedLink>
              </span>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="shell border-t py-[var(--space-lg)]" style={{ borderColor: "var(--line-soft)" }}>
        <Reveal className="grid12 gap-y-[var(--space-md)]" stagger={0.05}>
          <div data-reveal className="col-span-6 md:col-span-3">
            <p className="micro mb-[var(--space-sm)]">Explore</p>
            <ul className="flex flex-col gap-1">
              {nav.slice(0, 4).map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="body !text-[var(--t-small)] transition-opacity duration-[--dur-fast] hover:opacity-60">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="col-span-6 md:col-span-3">
            <p className="micro mb-[var(--space-sm)]">Project</p>
            <ul className="flex flex-col gap-1">
              {nav.slice(4).map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="body !text-[var(--t-small)] transition-opacity duration-[--dur-fast] hover:opacity-60">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="col-span-6 md:col-span-3">
            <p className="micro mb-[var(--space-sm)]">Connect</p>
            <ul className="flex flex-col gap-1">
              <li>
                <a href={links.github} target="_blank" rel="noreferrer noopener" className="body !text-[var(--t-small)] transition-opacity duration-[--dur-fast] hover:opacity-60">
                  GitHub
                </a>
              </li>
              <li>
                <a href={`mailto:${links.email}`} className="body !text-[var(--t-small)] transition-opacity duration-[--dur-fast] hover:opacity-60">
                  Email
                </a>
              </li>
              <li>
                {links.devpost ? (
                  <a href={links.devpost} target="_blank" rel="noreferrer noopener" className="body !text-[var(--t-small)] transition-opacity duration-[--dur-fast] hover:opacity-60">
                    Devpost
                  </a>
                ) : (
                  <span className="body !text-[var(--t-small)] opacity-40">Devpost — coming soon</span>
                )}
              </li>
              <li>
                {links.console ? (
                  <a href={links.console} target="_blank" rel="noreferrer noopener" className="body !text-[var(--t-small)] transition-opacity duration-[--dur-fast] hover:opacity-60">
                    Live console
                  </a>
                ) : (
                  <span className="body !text-[var(--t-small)] opacity-40">Live console — coming soon</span>
                )}
              </li>
            </ul>
          </div>

          <div data-reveal className="col-span-6 md:col-span-3">
            <p className="micro mb-[var(--space-sm)]">Build</p>
            <ul className="flex flex-col gap-1">
              <li className="body !text-[var(--t-small)]">Deployed {site.build}</li>
              <li className="body !text-[var(--t-small)]">Repo {site.repoHead}</li>
              <li className="body !text-[var(--t-small)]">Inventory {site.inventoryDate}</li>
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="shell flex flex-wrap items-center justify-between gap-4 border-t py-[var(--space-md)]" style={{ borderColor: "var(--line-soft)" }}>
        <p className="micro">
          © {site.year} {site.name}
        </p>
        <p className="micro max-w-[52ch] normal-case tracking-normal">{site.pitch}</p>
      </div>
    </footer>
  );
}
