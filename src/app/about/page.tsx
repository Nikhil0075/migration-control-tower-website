import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionIndex, SplitHeading, Reveal } from "@/components/ui/Type";
import { NextPage } from "@/components/ui/NextPage";
import { Team } from "@/components/sections/Team";
import { inspiration, challenge, learned, mvpStatement, accomplishments, closing, closingBody } from "@/data/about";
import { differentiators, roadmap } from "@/data/metrics";
import { teamNote } from "@/data/team";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Migration Control Tower exists, what it proves, what it does not claim, and the people who built it.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="05 — About"
        lines={["Autonomy", "with an audit trail."]}
        supporting={mvpStatement}
        film="dormant-estate"
        filmAlt="A dormant estate of unlit database units, pipelines ending in unconnected flanges."
      />

      {/* Origin -------------------------------------------------------------- */}
      <Section id="origin" label="Inspiration">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="B.01" label="Inspiration" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[16ch]">
              Migrations fail before the first byte moves.
            </SplitHeading>
          </div>

          <div className="col-span-12 mt-[var(--space-md)] md:col-start-4 md:col-span-5">
            <Reveal>
              <p data-reveal className="body">{inspiration}</p>
            </Reveal>
          </div>
          <div className="col-span-12 md:col-span-4">
            <Reveal>
              <p data-reveal className="body">{challenge}</p>
              <p data-reveal className="body mt-[var(--space-md)]">{learned}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Differentiators ------------------------------------------------------ */}
      <Section id="different" surface="paper" label="What is different">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="B.02" label="Difference" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[15ch]">Six decisions that shaped everything else.</SplitHeading>
          </div>
        </div>

        <Reveal as="ul" className="mt-[var(--space-lg)] grid gap-x-[clamp(20px,3vw,56px)] md:grid-cols-2" stagger={0.06}>
          {differentiators.map((d) => (
            <li key={d.index} data-reveal className="border-t py-[var(--space-sm)]" style={{ borderColor: "var(--line)" }}>
              <div className="flex items-baseline gap-4">
                <span className="micro" style={{ color: "var(--accent)" }}>{d.index}</span>
                <h3 className="h-sub !text-[clamp(1.2rem,1.9vw,1.8rem)] max-w-[22ch]">{d.title}</h3>
              </div>
              <p className="body mt-[var(--space-sm)] max-w-[52ch] !text-[var(--t-small)]">{d.body}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      {/* Accomplishments ------------------------------------------------------ */}
      <Section id="proved" label="What was proved">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="B.03" label="Proved" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[14ch]">What the build actually demonstrated.</SplitHeading>
          </div>
        </div>

        <Reveal as="ol" className="mt-[var(--space-lg)]" stagger={0.05}>
          {accomplishments.map((a, i) => (
            <li key={a} data-reveal className="grid12 gap-y-2 border-t py-[var(--space-sm)]" style={{ borderColor: "var(--line)" }}>
              <span className="micro col-span-12 md:col-span-3" style={{ color: "var(--accent)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="body col-span-12 max-w-[72ch] md:col-start-4 md:col-span-9">{a}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      {/* Roadmap -------------------------------------------------------------- */}
      <Section id="roadmap" label="Scaling roadmap">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="B.04" label="Roadmap" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[16ch]">Four horizons, each with its own exit evidence.</SplitHeading>
          </div>
        </div>

        <Reveal as="ul" className="mt-[var(--space-lg)]" stagger={0.06}>
          {roadmap.map((r) => (
            <li key={r.horizon} data-reveal className="grid12 gap-y-2 border-t py-[var(--space-md)]" style={{ borderColor: "var(--line)" }}>
              <p className="micro col-span-12 md:col-span-3" style={{ color: "var(--accent)" }}>{r.horizon}</p>
              <p className="col-span-12 md:col-span-5">
                <span className="h-sub !text-[clamp(1.1rem,1.6vw,1.5rem)]">{r.capability}</span>
              </p>
              <p className="body col-span-12 !text-[var(--t-small)] md:col-span-4">{r.evidence}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      {/* Team ----------------------------------------------------------------- */}
      <Section id="team" surface="paper" label="Team">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="B.05" label="Team" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[14ch]">Built by two.</SplitHeading>
            <Reveal>
              <p data-reveal className="lead mt-[var(--space-md)] max-w-[56ch]">{teamNote}</p>
            </Reveal>
          </div>

          <div className="col-span-12 mt-[var(--space-lg)] md:col-start-4 md:col-span-9">
            <Team />
          </div>
        </div>
      </Section>

      {/* Closing --------------------------------------------------------------- */}
      <Section id="closing" label="Closing">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="B.06" label="Closing" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="display !text-[clamp(2.5rem,6.5vw,6.5rem)] max-w-[14ch]">{closing}</SplitHeading>
            <Reveal>
              <p data-reveal className="lead mt-[var(--space-lg)] max-w-[64ch]">{closingBody}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      <NextPage from="/about" />
    </>
  );
}
