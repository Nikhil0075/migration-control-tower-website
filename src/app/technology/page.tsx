import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionIndex, SplitHeading, Reveal } from "@/components/ui/Type";
import { NextPage } from "@/components/ui/NextPage";
import { TechStack } from "@/components/sections/TechStack";
import { rationale, research, researchNote } from "@/data/tech";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Gemini and Google ADK for bounded reasoning; Cloud Run, Cloud Run Jobs, Pub/Sub, Firestore, BigQuery, Cloud SQL, IAM and Secret Manager for durable execution and governance.",
};

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        eyebrow="03 — Technology"
        lines={["Every choice", "has a reason."]}
        supporting="Gemini and Google ADK provide bounded interpretation and planning. Deterministic services own permissions, state, validation truth, idempotency, budgets and approval integrity."
        film="flow-and-fracture"
        filmAlt="Luminous flow rising through pipelines while one broken line scatters its particles."
      />

      {/* The stack ----------------------------------------------------------- */}
      <Section id="stack" label="The stack">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="T.01" label="The stack" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[14ch]">Eight layers, no decoration.</SplitHeading>
          </div>
        </div>

        <div className="mt-[var(--space-lg)]">
          <TechStack />
        </div>
      </Section>

      {/* Rationale ------------------------------------------------------------ */}
      <Section id="rationale" surface="paper" label="Technology rationale">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="T.02" label="Rationale" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[16ch]">Why each part of the system is there.</SplitHeading>
          </div>
        </div>

        <Reveal as="dl" className="mt-[var(--space-lg)]" stagger={0.04}>
          {rationale.map((r) => (
            <div
              key={r.choice}
              data-reveal
              className="grid12 gap-y-1 border-t py-[var(--space-sm)]"
              style={{ borderColor: "var(--line)" }}
            >
              <dt className="col-span-12 md:col-span-4">
                <span className="h-sub !text-[clamp(1.1rem,1.6vw,1.5rem)]">{r.choice}</span>
              </dt>
              <dd className="col-span-12 md:col-start-5 md:col-span-8">
                <p className="body !text-[var(--t-small)]">{r.why}</p>
              </dd>
            </div>
          ))}
        </Reveal>
      </Section>

      {/* Research ------------------------------------------------------------- */}
      <Section id="research" label="Research and evidence">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="T.03" label="Research" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[16ch]">
              Realistic enough to be credible. Controlled enough to be falsifiable.
            </SplitHeading>
          </div>
        </div>

        <Reveal as="ul" className="mt-[var(--space-lg)]" stagger={0.05}>
          {research.map((r) => (
            <li
              key={r.source}
              data-reveal
              className="grid12 gap-y-2 border-t py-[var(--space-sm)]"
              style={{ borderColor: "var(--line)" }}
            >
              <p className="col-span-12 md:col-span-3">
                <span className="h-sub !text-[clamp(1.1rem,1.6vw,1.5rem)]">{r.source}</span>
              </p>
              <p className="body col-span-12 !text-[var(--t-small)] md:col-span-6">{r.role}</p>
              <p className="micro col-span-12 md:col-span-3 md:text-right">{r.provenance}</p>
            </li>
          ))}
        </Reveal>

        <Reveal className="grid12 mt-[var(--space-lg)]">
          <p data-reveal className="lead col-span-12 max-w-[70ch] md:col-start-4 md:col-span-9">
            {researchNote}
          </p>
        </Reveal>
      </Section>

      <NextPage from="/technology" />
    </>
  );
}
