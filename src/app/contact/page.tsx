import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionIndex, SplitHeading, Reveal } from "@/components/ui/Type";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { Film } from "@/components/ui/Media";
import { links, site } from "@/data/site";
import { ConsoleAccess } from "@/components/ui/ConsoleAccess";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about Migration Control Tower — a governed agentic control plane for enterprise data migration.",
};

export default function ContactPage() {
  return (
    <>
      <section
        data-surface="dark"
        aria-label="Contact"
        className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-[var(--space-lg)] pt-[calc(var(--header-h)+var(--space-lg))]"
      >
        <div className="absolute inset-0 z-0">
          <Film name="completion" alt="A gate opening onto an unbroken flow into a cloud warehouse." priority />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(9,9,9,.66) 0%, rgba(9,9,9,.22) 28%, rgba(9,9,9,.5) 58%, rgba(9,9,9,.92) 90%, rgba(9,9,9,.97) 100%)",
            }}
          />
          <div aria-hidden className="grain absolute inset-0" />
        </div>

        <div className="shell grid12 relative z-10 w-full gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="06" label="Contact" />
          </div>

          <div className="col-span-12">
            <SplitHeading as="h1" immediate className="display !text-[clamp(2.75rem,7.4vw,8.5rem)] max-w-[13ch]">
              Ready to see the whole loop?
            </SplitHeading>
          </div>

          <div className="col-span-12 md:col-span-6">
            <Reveal>
              <p data-reveal className="lead max-w-[52ch]">{site.pitch}</p>
            </Reveal>
          </div>

          <div className="col-span-12 md:col-start-8 md:col-span-5">
            <Reveal stagger={0.07}>
              <ul className="flex flex-col">
                <li data-reveal className="border-t" style={{ borderColor: "var(--line)" }}>
                  <AnimatedLink href={`mailto:${links.email}`} index="01" size="lg" className="w-full">
                    {links.email}
                  </AnimatedLink>
                </li>
                <li data-reveal className="border-t" style={{ borderColor: "var(--line)" }}>
                  <AnimatedLink href={links.github} index="02" size="lg" className="w-full">
                    GitHub repository
                  </AnimatedLink>
                </li>
                <li data-reveal className="border-t" style={{ borderColor: "var(--line)" }}>
                  <AnimatedLink href={links.devpost} index="03" size="lg" className="w-full">
                    Devpost submission
                  </AnimatedLink>
                </li>
                <li data-reveal className="border-y" style={{ borderColor: "var(--line)" }}>
                  <AnimatedLink href={links.console} index="04" size="lg" className="w-full">
                    Live operator console
                  </AnimatedLink>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <Section label="Console access">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="C.01" label="Live console" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[16ch]">See it running, not just described.</SplitHeading>
            <ConsoleAccess className="mt-[var(--space-lg)] max-w-[62ch]" />
          </div>
        </div>
      </Section>

      <Section label="Where to start">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="C.02" label="Start here" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[16ch]">Three ways in, depending on what you need.</SplitHeading>
          </div>
        </div>

        <Reveal as="ul" className="mt-[var(--space-lg)] grid gap-x-[clamp(20px,3vw,56px)] md:grid-cols-3" stagger={0.08}>
          {[
            { i: "01", t: "See it run", b: "The console walkthrough, screen by screen, with every capture tied to the run that produced it.", href: "/guide", cta: "Open the guide" },
            { i: "02", t: "Read the design", b: "Trust boundaries, the legal state machine, the three planes and the thirteen-diagram topology pack.", href: "/architecture", cta: "Open the architecture" },
            { i: "03", t: "Check the stack", b: "Every technology choice with the reason it is there, plus the research and fault-injection methodology.", href: "/technology", cta: "Open the technology" },
          ].map((c) => (
            <li key={c.i} data-reveal className="border-t pt-[var(--space-sm)]" style={{ borderColor: "var(--line)" }}>
              <div className="flex items-baseline gap-4">
                <span className="micro" style={{ color: "var(--accent)" }}>{c.i}</span>
                <h3 className="h-sub !text-[clamp(1.3rem,2vw,1.9rem)]">{c.t}</h3>
              </div>
              <p className="body mt-[var(--space-sm)] max-w-[42ch] !text-[var(--t-small)]">{c.b}</p>
              <div className="mt-[var(--space-sm)]">
                <AnimatedLink href={c.href}>{c.cta}</AnimatedLink>
              </div>
            </li>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
