import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionIndex, SplitHeading, Reveal } from "@/components/ui/Type";
import { NextPage } from "@/components/ui/NextPage";
import { GuideChapters } from "@/components/sections/GuideChapters";
import { ConsoleAccess } from "@/components/ui/ConsoleAccess";
import { MetricRow } from "@/components/ui/Metric";
import { guideIntro, guideStatement } from "@/data/guide";
import { evaluation, boundaries, acceptanceNote, scaleCaveat } from "@/data/metrics";

export const metadata: Metadata = {
  title: "Application Guide",
  description:
    "A walkthrough of the Migration Control Tower operator console: onboarding, assessment, lineage, governed execution, recovery, approval and evidence.",
};

export default function GuidePage() {
  return (
    <>
      <PageHero
        eyebrow="04 — Application Guide"
        lines={["The console,", "screen by screen."]}
        supporting={guideIntro}
        film="governed-release"
        filmAlt="A record travelling from an open vault to a checkpoint where five check marks illuminate."
      />

      {/* Statement ----------------------------------------------------------- */}
      <Section label="What the console is">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="G.00" label="Read this first" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <Reveal>
              <p data-reveal className="lead max-w-[68ch]">{guideStatement}</p>
            </Reveal>
          </div>

          {/* The walkthrough below is captures; this is the running thing. */}
          <div className="col-span-12 mt-[var(--space-lg)] md:col-start-4 md:col-span-9">
            <ConsoleAccess />
          </div>
        </div>
      </Section>

      {/* Seven chapters of real captures -------------------------------------- */}
      <GuideChapters />

      {/* Measured results ------------------------------------------------------ */}
      <Section id="results" label="Measured results">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="G.08" label="Evidence" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[15ch]">
              Three scales, measured as three different questions.
            </SplitHeading>
          </div>
        </div>

        <MetricRow
          metrics={evaluation}
          className="mt-[var(--space-lg)] sm:grid-cols-2 lg:grid-cols-3 gap-y-[var(--space-lg)]"
        />

        <Reveal className="grid12 mt-[var(--space-lg)] gap-y-[var(--space-sm)]">
          <p data-reveal className="micro col-span-12 max-w-[74ch] !normal-case !tracking-normal md:col-start-4 md:col-span-9">
            {acceptanceNote}
          </p>
          <p data-reveal className="micro col-span-12 max-w-[74ch] !normal-case !tracking-normal md:col-start-4 md:col-span-9">
            {scaleCaveat}
          </p>
        </Reveal>
      </Section>

      {/* Honest boundaries ----------------------------------------------------- */}
      <Section id="boundaries" surface="paper" label="Current boundaries">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="G.09" label="Boundaries" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[16ch]">What this does not yet do.</SplitHeading>
            <Reveal>
              <p data-reveal className="lead mt-[var(--space-md)] max-w-[64ch]">
                The strongest claim here is not that everything is finished. It is that the loop is
                governed end to end, and that its edges are stated rather than implied.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal as="ol" className="mt-[var(--space-lg)]" stagger={0.05}>
          {boundaries.map((b, i) => (
            <li
              key={b}
              data-reveal
              className="grid12 gap-y-2 border-t py-[var(--space-sm)]"
              style={{ borderColor: "var(--line)" }}
            >
              <span className="micro col-span-12 md:col-span-3" style={{ color: "var(--accent)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="body col-span-12 max-w-[72ch] md:col-start-4 md:col-span-9">{b}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      <NextPage from="/guide" />
    </>
  );
}
