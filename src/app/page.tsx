import dynamic from "next/dynamic";
import { HeroScrollFilm } from "@/components/sections/HeroScrollFilm";
import { Section } from "@/components/ui/Section";
import { SectionIndex, SplitHeading, Reveal } from "@/components/ui/Type";
import { AnimatedLink, ActionLink } from "@/components/ui/AnimatedLink";
import { Marquee } from "@/components/ui/Marquee";
import { NextPage } from "@/components/ui/NextPage";
import { MetricRow } from "@/components/ui/Metric";
import { site } from "@/data/site";
import {
  problemHeadline, problemBody, problems,
  solutionHeadline, solutionBody,
  governanceHeadline, governanceBody, recoveryBody,
  marqueeTerms,
} from "@/data/problem";
import { planes, architectureLine } from "@/data/lifecycle";
import { headline as headlineMetrics, scaleCaveat } from "@/data/metrics";

// The two heaviest experiences are split out of the initial bundle.
const FilmSequence = dynamic(() =>
  import("@/components/sections/FilmSequence").then((m) => m.FilmSequence)
);
const HorizontalShowcase = dynamic(() =>
  import("@/components/sections/HorizontalShowcase").then((m) => m.HorizontalShowcase)
);
const ArchitectureFlow = dynamic(() =>
  import("@/components/sections/ArchitectureFlow").then((m) => m.ArchitectureFlow)
);

export default function Home() {
  return (
    <>
      <HeroScrollFilm />

      {/* S.01 — the problem ------------------------------------------------ */}
      <Section id="problem" label="The problem">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="S.01" label="The problem" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[18ch]">{problemHeadline}</SplitHeading>
          </div>

          <div className="col-span-12 md:col-start-4 md:col-span-6">
            <Reveal>
              <p data-reveal className="lead max-w-[58ch]">{problemBody}</p>
            </Reveal>
          </div>

          <div className="col-span-12 md:col-start-4 md:col-span-9 mt-[var(--space-md)]">
            <Reveal as="ul" stagger={0.06} className="grid gap-x-[clamp(20px,3vw,56px)] gap-y-0 sm:grid-cols-2">
              {problems.map((p) => (
                <li
                  key={p.index}
                  data-reveal
                  className="flex gap-[clamp(12px,1.6vw,28px)] border-t py-[var(--space-sm)]"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span className="micro shrink-0" style={{ color: "var(--accent)" }}>{p.index}</span>
                  <p className="body !text-[var(--t-small)]">{p.text}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </Section>

      <div data-surface="dark">
        <Marquee terms={marqueeTerms} />
      </div>

      {/* S.02 — the sequence ----------------------------------------------- */}
      <Section label="The sequence" className="!pb-[var(--space-lg)]">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="S.02" label="The sequence" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[16ch]">{solutionHeadline}</SplitHeading>
            <Reveal>
              <p data-reveal className="lead mt-[var(--space-md)] max-w-[62ch]">{solutionBody}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      <FilmSequence />

      {/* S.03 — the three planes ------------------------------------------- */}
      <Section id="planes" label="The three planes">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="S.03" label="Three planes" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[15ch]">
              Interpretation, execution and authority are separate systems.
            </SplitHeading>
            <p className="micro mt-[var(--space-md)]">{architectureLine}</p>
          </div>
        </div>

        <Reveal as="ul" className="mt-[var(--space-lg)] grid gap-x-[clamp(20px,3vw,56px)] md:grid-cols-3" stagger={0.09}>
          {planes.map((p) => (
            <li key={p.name} data-reveal className="border-t pt-[var(--space-sm)]" style={{ borderColor: "var(--line)" }}>
              <div className="flex items-baseline gap-3">
                <span className="micro" style={{ color: "var(--accent)" }}>{p.index}</span>
                <h3 className="h-sub !text-[clamp(1.4rem,2.2vw,2.1rem)]">{p.name}</h3>
              </div>
              <p className="lead mt-[var(--space-sm)] !text-[clamp(1.05rem,1.3vw,1.3rem)]">{p.line}</p>
              <p className="body mt-[var(--space-sm)] !text-[var(--t-small)]">{p.body}</p>
              <ul className="mt-[var(--space-sm)] flex flex-wrap gap-x-4 gap-y-1">
                {p.members.map((m) => (
                  <li key={m} className="micro !normal-case !tracking-normal">
                    <span aria-hidden style={{ color: "var(--accent)" }}>·</span> {m}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </Reveal>
      </Section>

      {/* S.04 — the fleet --------------------------------------------------- */}
      <HorizontalShowcase />

      {/* S.05 — architecture ------------------------------------------------ */}
      <Section id="architecture" label="Architecture">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="S.05" label="Architecture" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[16ch]">
              Every stage is a boundary someone has to cross.
            </SplitHeading>
          </div>
        </div>

        <ArchitectureFlow className="mt-[var(--space-lg)]" />

        <Reveal className="mt-[var(--space-md)] flex flex-wrap items-center justify-between gap-6">
          <p data-reveal className="micro">Hover a node to trace its path</p>
          <span data-reveal>
            <AnimatedLink href="/architecture" size="lg">Open the full architecture</AnimatedLink>
          </span>
        </Reveal>
      </Section>

      {/* S.06 — proof (light editorial) ------------------------------------- */}
      <Section id="proof" surface="paper" label="Measured results">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="S.06" label="Proof" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[12ch]">Real data. Measured proof.</SplitHeading>
          </div>
        </div>

        <MetricRow
          metrics={headlineMetrics}
          size="lg"
          className="mt-[var(--space-lg)] sm:grid-cols-2 lg:grid-cols-4 gap-y-[var(--space-lg)]"
        />

        <Reveal className="mt-[var(--space-lg)] grid12">
          <p data-reveal className="micro col-span-12 max-w-[70ch] !normal-case !tracking-normal md:col-start-4 md:col-span-9">
            {scaleCaveat}
          </p>
          <div data-reveal className="col-span-12 mt-[var(--space-md)] md:col-start-4">
            <ActionLink href="/guide">See it in the console</ActionLink>
          </div>
        </Reveal>
      </Section>

      {/* S.07 — governance -------------------------------------------------- */}
      <Section id="governance" label="Governance">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="S.07" label="Governance" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="display !text-[clamp(2.5rem,6.5vw,6.5rem)] max-w-[14ch]">
              {governanceHeadline}
            </SplitHeading>
          </div>

          <div className="col-span-12 mt-[var(--space-md)] md:col-start-4 md:col-span-5">
            <Reveal>
              <p data-reveal className="body">{governanceBody}</p>
            </Reveal>
          </div>
          <div className="col-span-12 md:col-span-4">
            <Reveal>
              <p data-reveal className="body">{recoveryBody}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      <NextPage from="/" />
    </>
  );
}
