import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionIndex, SplitHeading, Reveal } from "@/components/ui/Type";
import { NextPage } from "@/components/ui/NextPage";
import { DiagramGallery } from "@/components/sections/DiagramGallery";
import { planes, architectureLine, executionBoundary } from "@/data/lifecycle";
import { controls } from "@/data/tech";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "An event-driven control plane with independently deployed capabilities, a separately executed data plane, durable state, bounded AI reasoning and human-controlled cutover.",
};

const ArchitectureFlow = dynamic(() =>
  import("@/components/sections/ArchitectureFlow").then((m) => m.ArchitectureFlow)
);

export default function ArchitecturePage() {
  return (
    <>
      <PageHero
        eyebrow="02 — Architecture"
        lines={["Boundaries", "before features."]}
        supporting="Not a chain of prompts and not a monolithic migration script. An event-driven control plane with independently deployed capabilities, a separately executed data plane, durable state, deterministic governance and explicit failure recovery."
        film="fleet-activation"
        filmAlt="Six agent nodes illuminating in sequence around a control tower, their connecting lines brightening inward."
      />

      {/* The flow ----------------------------------------------------------- */}
      <Section id="flow" label="System flow">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="A.01" label="System flow" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[15ch]">
              Interpretation flows down. Authority never flows up.
            </SplitHeading>
            <p className="micro mt-[var(--space-md)]">{architectureLine}</p>
          </div>
        </div>

        <ArchitectureFlow className="mt-[var(--space-lg)]" />

        <Reveal className="mt-[var(--space-md)]">
          <p data-reveal className="micro">Hover a node to trace its path</p>
        </Reveal>
      </Section>

      {/* The three planes ---------------------------------------------------- */}
      <Section id="planes" surface="paper" label="The three planes">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="A.02" label="Planes" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[16ch]">Three planes, three different kinds of truth.</SplitHeading>
          </div>
        </div>

        <Reveal as="ul" className="mt-[var(--space-lg)]" stagger={0.08}>
          {planes.map((p) => (
            <li key={p.name} data-reveal className="grid12 gap-y-[var(--space-sm)] border-t py-[var(--space-md)]" style={{ borderColor: "var(--line)" }}>
              <div className="col-span-12 flex items-baseline gap-4 md:col-span-3">
                <span className="micro" style={{ color: "var(--accent)" }}>{p.index}</span>
                <h3 className="h-sub !text-[clamp(1.4rem,2.4vw,2.25rem)]">{p.name}</h3>
              </div>
              <div className="col-span-12 md:col-span-5">
                <p className="lead !text-[clamp(1.05rem,1.35vw,1.35rem)]">{p.line}</p>
                <p className="body mt-[var(--space-sm)] !text-[var(--t-small)]">{p.body}</p>
              </div>
              <ul className="col-span-12 md:col-span-4">
                {p.members.map((m) => (
                  <li key={m} className="micro border-t py-2 !normal-case !tracking-normal" style={{ borderColor: "var(--line-soft)" }}>
                    {m}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </Reveal>

        <Reveal className="grid12 mt-[var(--space-lg)]">
          <p data-reveal className="micro col-span-12 !normal-case !tracking-normal md:col-start-4 md:col-span-9 max-w-[76ch]">
            <span className="!uppercase !tracking-[0.08em]" style={{ color: "var(--accent)" }}>Current execution boundary — </span>
            {executionBoundary}
          </p>
        </Reveal>
      </Section>

      {/* Controls ------------------------------------------------------------ */}
      <Section id="controls" label="Security controls">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="A.03" label="Controls" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[16ch]">Six controls the model cannot reach around.</SplitHeading>
          </div>
        </div>

        <Reveal as="ol" className="mt-[var(--space-lg)] grid gap-x-[clamp(20px,3vw,56px)] md:grid-cols-2" stagger={0.05}>
          {controls.map((c, i) => (
            <li key={c} data-reveal className="flex gap-[clamp(12px,1.6vw,28px)] border-t py-[var(--space-sm)]" style={{ borderColor: "var(--line)" }}>
              <span className="micro shrink-0" style={{ color: "var(--accent)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="body !text-[var(--t-small)]">{c}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      {/* Diagram pack --------------------------------------------------------- */}
      <Section id="diagrams" label="Diagram pack">
        <div className="grid12 gap-y-[var(--space-md)]">
          <div className="col-span-12 md:col-span-3">
            <SectionIndex id="A.04" label="Diagram pack" />
          </div>
          <div className="col-span-12 md:col-span-9">
            <SplitHeading className="h-section max-w-[15ch]">Thirteen views of the deployed topology.</SplitHeading>
            <Reveal>
              <p data-reveal className="lead mt-[var(--space-md)] max-w-[62ch]">
                Every diagram is a hand-built vector rendering of the implemented distributed production
                topology, checked against the live Google Cloud inventory.
              </p>
            </Reveal>
          </div>
        </div>

        <DiagramGallery />
      </Section>

      <NextPage from="/architecture" />
    </>
  );
}
