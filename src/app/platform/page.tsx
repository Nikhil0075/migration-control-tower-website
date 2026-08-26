import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionIndex, SplitHeading, Reveal } from "@/components/ui/Type";
import { EditorialAccordion } from "@/components/sections/EditorialAccordion";
import { NextPage } from "@/components/ui/NextPage";
import { StatePath } from "@/components/sections/StatePath";
import { fleetPrinciple } from "@/data/agents";
import { steps, stateNote } from "@/data/lifecycle";
import { recoveryBody } from "@/data/problem";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "Seven specialized agents resolved by capability through approved, versioned AgentCards — discovery, lineage, risk, planning, validation, cutover and finance impact.",
};

export default function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="01 — Platform"
        lines={["A fleet, not", "a pipeline."]}
        supporting="Specialized agents interpret legacy evidence and propose actions. Deterministic services enforce authorization, idempotency, budgets, validation results, approval integrity and legal state transitions."
        film="agent-fleet"
        filmAlt="Seven precision-machined modules of differing form stand in a shallow arc; a single teal light travels along the floor from left to right, waking each module's recessed indicator in turn until all seven hold their light."
      />

      {/* The fleet ---------------------------------------------------------- */}
      <Section id="fleet" label="The agent fleet">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="P.01" label="The fleet" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[15ch]">
              Every agent has one job and no authority beyond it.
            </SplitHeading>
            <Reveal>
              <p data-reveal className="lead mt-[var(--space-md)] max-w-[62ch]">{fleetPrinciple}</p>
            </Reveal>
          </div>
        </div>

        <div className="mt-[var(--space-lg)]">
          <EditorialAccordion />
        </div>
      </Section>

      {/* Lifecycle ---------------------------------------------------------- */}
      <Section id="lifecycle" surface="paper" label="How a migration runs">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="P.02" label="Lifecycle" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[14ch]">Nine steps, none of them optional.</SplitHeading>
          </div>
        </div>

        <Reveal as="ol" className="mt-[var(--space-lg)] grid gap-x-[clamp(20px,3vw,56px)] md:grid-cols-3" stagger={0.05}>
          {steps.map((s) => (
            <li key={s.index} data-reveal className="border-t py-[var(--space-sm)]" style={{ borderColor: "var(--line)" }}>
              <div className="flex items-baseline gap-3">
                <span className="micro" style={{ color: "var(--accent)" }}>{s.index}</span>
                <h3 className="h-sub !text-[clamp(1.25rem,1.9vw,1.75rem)]">{s.title}</h3>
              </div>
              <p className="body mt-[var(--space-xs)] !text-[var(--t-small)]">{s.body}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      {/* State machine ------------------------------------------------------ */}
      <Section id="states" label="The state machine">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="P.03" label="Durable state" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[16ch]">
              A run is a legal path, or it is an error.
            </SplitHeading>
          </div>
        </div>

        <StatePath className="mt-[var(--space-lg)]" />

        <Reveal className="grid12 mt-[var(--space-lg)]">
          <p data-reveal className="body col-span-12 max-w-[60ch] md:col-start-4 md:col-span-5">{stateNote}</p>
          <p data-reveal className="body col-span-12 max-w-[60ch] md:col-span-4">{recoveryBody}</p>
        </Reveal>
      </Section>

      <NextPage from="/platform" />
    </>
  );
}
