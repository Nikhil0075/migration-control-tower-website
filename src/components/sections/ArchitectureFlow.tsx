"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, DUR, EASE, prefersReducedMotion } from "@/lib/motion";

/**
 * Purpose-designed architecture visualisation.
 *
 * Nodes are fine-bordered rectangles with small mono labels; connections are SVG
 * paths drawn with stroke-dashoffset. The draw order follows the real flow —
 * orchestrator dispatches, capabilities report, validation gates, a human
 * approves, cutover executes — so the animation communicates causality rather
 * than decorating the diagram. Hovering a node illuminates its own path.
 */

type Node = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  w: number;
  /** Draw tier — nodes in the same tier light together. */
  tier: number;
};

const W = 1200;
const H = 700;
const NH = 54;

const NODES: Node[] = [
  { id: "orchestrator", label: "Orchestrator", sub: "Legal state machine", x: 470, y: 30, w: 260, tier: 0 },

  { id: "discovery", label: "Discovery", sub: "Schemas · SQL · DAGs", x: 40, y: 180, w: 190, tier: 1 },
  { id: "lineage", label: "Lineage", sub: "Dependencies", x: 254, y: 180, w: 190, tier: 1 },
  { id: "risk", label: "Risk", sub: "PII · dialect · policy", x: 468, y: 180, w: 190, tier: 1 },
  { id: "planner", label: "Planner", sub: "Order · mappings", x: 682, y: 180, w: 190, tier: 1 },
  { id: "finance", label: "Finance Impact", sub: "Downstream cost", x: 896, y: 180, w: 190, tier: 1 },

  { id: "dataplane", label: "Cloud Run Jobs", sub: "Bounded row movement", x: 180, y: 330, w: 300, tier: 2 },
  { id: "policy", label: "Policy engine", sub: "Structured input only", x: 700, y: 330, w: 300, tier: 2 },

  { id: "validation", label: "Validation", sub: "Schema · count · hash · nulls", x: 400, y: 460, w: 400, tier: 3 },

  { id: "approval", label: "Human approval", sub: "Bound to plan hash", x: 400, y: 570, w: 400, tier: 4 },

  { id: "cutover", label: "Cutover", sub: "Consume · monitor · complete", x: 880, y: 570, w: 260, tier: 5 },
  { id: "estate", label: "Legacy estate", sub: "SQL Server · PostgreSQL", x: 60, y: 570, w: 260, tier: 5 },
];

type Edge = { from: string; to: string; tier: number; d?: string };

const EDGES: Edge[] = [
  { from: "orchestrator", to: "discovery", tier: 1 },
  { from: "orchestrator", to: "lineage", tier: 1 },
  { from: "orchestrator", to: "risk", tier: 1 },
  { from: "orchestrator", to: "planner", tier: 1 },
  { from: "orchestrator", to: "finance", tier: 1 },

  { from: "discovery", to: "dataplane", tier: 2 },
  { from: "lineage", to: "dataplane", tier: 2 },
  { from: "risk", to: "policy", tier: 2 },
  { from: "planner", to: "policy", tier: 2 },
  { from: "finance", to: "policy", tier: 2 },

  { from: "dataplane", to: "validation", tier: 3 },
  { from: "policy", to: "validation", tier: 3 },

  { from: "validation", to: "approval", tier: 4 },

  { from: "approval", to: "cutover", tier: 5 },
  { from: "estate", to: "dataplane", tier: 5 },
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;

/** Orthogonal-ish routing: out the bottom, along a mid line, into the top. */
function path(e: Edge): string {
  const a = byId(e.from);
  const b = byId(e.to);

  // Estate feeds the data plane from the left, bottom-up.
  if (e.from === "estate") {
    const ax = a.x + a.w / 2;
    const bx = b.x + b.w / 2;
    return `M ${ax} ${a.y} L ${ax} ${a.y - 60} L ${bx - 60} ${a.y - 60} L ${bx - 60} ${b.y + NH + 20} L ${bx} ${b.y + NH + 20}`;
  }

  // Approval to cutover runs horizontally.
  if (e.from === "approval" && e.to === "cutover") {
    return `M ${a.x + a.w} ${a.y + NH / 2} L ${b.x} ${b.y + NH / 2}`;
  }

  const ax = a.x + a.w / 2;
  const ay = a.y + NH;
  const bx = b.x + b.w / 2;
  const by = b.y;
  const mid = ay + (by - ay) / 2;
  return `M ${ax} ${ay} L ${ax} ${mid} L ${bx} ${mid} L ${bx} ${by}`;
}

export function ArchitectureFlow({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement>("[data-edge]");
      const nodes = gsap.utils.toArray<SVGGElement>("[data-node]");

      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(nodes, { opacity: 0.001 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      });

      // Draw tier by tier, in flow order: a node lights, then its outgoing
      // lines draw, then the nodes they feed light.
      const maxTier = Math.max(...NODES.map((n) => n.tier));
      for (let tier = 0; tier <= maxTier; tier++) {
        const tierNodes = nodes.filter((n) => Number(n.dataset.tier) === tier);
        const tierEdges = paths.filter((p) => Number(p.dataset.tier) === tier);

        tl.to(tierNodes, { opacity: 1, duration: DUR.med, ease: EASE, stagger: 0.05 }, tier === 0 ? 0 : "-=0.25");
        if (tierEdges.length) {
          tl.to(tierEdges, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut", stagger: 0.04 }, "-=0.35");
        }
      }
    }, el);

    return () => ctx.revert();
  }, []);

  /** An edge is lit when either of its endpoints is hovered. */
  const edgeLit = (e: Edge) => hover !== null && (e.from === hover || e.to === hover);

  return (
    <div ref={root} className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="System architecture: the orchestrator dispatches to Discovery, Lineage, Risk, Planner and Finance Impact agents; Discovery and Lineage feed the Cloud Run Jobs data plane while Risk, Planner and Finance feed the deterministic policy engine; both converge on Validation, which gates human approval, which authorises Cutover."
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M1.5 1 L6 4 L1.5 7" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
          </marker>
        </defs>

        {/* Edges beneath nodes */}
        <g fill="none" strokeWidth="1.1">
          {EDGES.map((e, i) => {
            const lit = edgeLit(e);
            return (
              <path
                key={i}
                data-edge
                data-tier={e.tier}
                d={e.d ?? path(e)}
                stroke={lit ? "var(--accent)" : "rgba(242,242,238,0.34)"}
                markerEnd="url(#arrow)"
                style={{
                  color: lit ? "var(--accent)" : "rgba(242,242,238,0.34)",
                  opacity: hover && !lit ? 0.28 : 1,
                  transition: "stroke var(--dur-med) var(--ease), opacity var(--dur-med) var(--ease)",
                }}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {NODES.map((n) => {
            const lit = hover === n.id;
            const dim = hover !== null && !lit;
            return (
              <g
                key={n.id}
                data-node
                data-tier={n.tier}
                onPointerEnter={() => setHover(n.id)}
                onPointerLeave={() => setHover(null)}
                style={{
                  opacity: dim ? 0.42 : 1,
                  transition: "opacity var(--dur-med) var(--ease)",
                  cursor: "default",
                }}
              >
                <rect
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height={NH}
                  fill={lit ? "rgba(77,204,190,0.08)" : "var(--color-surface)"}
                  stroke={lit ? "var(--accent)" : "rgba(242,242,238,0.34)"}
                  strokeWidth="1"
                  style={{ transition: "fill var(--dur-med) var(--ease), stroke var(--dur-med) var(--ease)" }}
                />
                <text
                  x={n.x + 14}
                  y={n.y + 22}
                  fill="var(--fg)"
                  fontSize="14"
                  fontWeight="500"
                  letterSpacing="-0.01em"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {n.label}
                </text>
                <text
                  x={n.x + 14}
                  y={n.y + 40}
                  fill={lit ? "var(--accent)" : "var(--fg-dim)"}
                  fontSize="9.5"
                  letterSpacing="0.08em"
                  style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", transition: "fill var(--dur-med)" }}
                >
                  {n.sub}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
