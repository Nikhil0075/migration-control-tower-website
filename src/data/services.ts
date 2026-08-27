/**
 * The services and frameworks the fleet actually runs on.
 *
 * Every entry is drawn from the project's own stack (see src/data/tech.ts) — no
 * badge here is aspirational. Mostly managed cloud services, plus the two
 * non-service pieces the deployed system genuinely stands on: Terraform, which
 * provisions it, and Oracle JET, which the operator console is built in.
 *
 * The marks are simplified glyphs drawn for this site, NOT the vendors' official
 * product logos. That is deliberate: official vendor iconography is
 * multi-coloured and varies in weight, which would fight the restrained
 * monochrome art direction and put third-party trademarks in a public repo.
 * These are one stroke weight, one colour, and inherit currentColor — so each
 * mark depicts the thing's role in this system rather than its brand.
 *
 * To swap in official iconography instead, replace `mark` with an <svg> import
 * per service — nothing else in ServiceMarquee needs to change.
 */

import type { ReactNode } from "react";
import { createElement as h } from "react";

/** Shared geometry so every mark reads as one family. */
const svg = (children: ReactNode) =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.4,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
      "aria-hidden": true,
      focusable: false,
    },
    children
  );

const p = (d: string, key?: string) => h("path", { d, key });
const c = (cx: number, cy: number, r: number, key?: string) =>
  h("circle", { cx, cy, r, key });
const rect = (x: number, y: number, w: number, hh: number, rx: number, key?: string) =>
  h("rect", { x, y, width: w, height: hh, rx, key });

export type Service = {
  name: string;
  /** What it does in this system — used as the accessible label. */
  role: string;
  mark: ReactNode;
};

export const services: Service[] = [
  {
    name: "Cloud Run",
    role: "Control-plane services",
    mark: svg([rect(3, 7, 18, 10, 2, "a"), p("M7 11.5h4M7 14h2", "b"), c(17, 12, 1.4, "c")]),
  },
  {
    name: "Cloud Run Jobs",
    role: "Bounded data movement",
    mark: svg([rect(3, 5, 18, 6, 1.5, "a"), rect(3, 13, 18, 6, 1.5, "b"), p("M6.5 8h3M6.5 16h3", "c")]),
  },
  {
    name: "Pub/Sub",
    role: "Stage events, at-least-once",
    mark: svg([c(12, 12, 2.2, "a"), p("M7.8 7.8a6 6 0 0 0 0 8.4M16.2 16.2a6 6 0 0 0 0-8.4", "b"), p("M5 5a10 10 0 0 0 0 14M19 19a10 10 0 0 0 0-14", "c")]),
  },
  {
    name: "Firestore",
    role: "Durable run state",
    mark: svg([p("M12 3 4 8v3l8 5 8-5V8l-8-5Z", "a"), p("M4 14v3l8 5 8-5v-3", "b")]),
  },
  {
    name: "BigQuery",
    role: "Analytics target",
    mark: svg([c(11, 11, 6.5, "a"), p("M16 16l4.5 4.5", "b"), p("M9 12v2M11.5 9.5v4.5M14 11.5v2.5", "c")]),
  },
  {
    name: "Cloud SQL",
    role: "Measured source estate",
    mark: svg([h("ellipse", { cx: 12, cy: 6, rx: 7, ry: 3, key: "a" }), p("M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6", "b"), p("M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3", "c")]),
  },
  {
    name: "Cloud Storage",
    role: "Staging",
    mark: svg([p("M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z", "a"), p("M4 8.5 12 13l8-4.5M12 13v7", "b")]),
  },
  {
    name: "Secret Manager",
    role: "Credential references",
    mark: svg([rect(5, 10.5, 14, 9.5, 2, "a"), p("M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3", "b"), c(12, 15, 1.3, "c")]),
  },
  {
    name: "IAM",
    role: "Per-service identity",
    mark: svg([p("M12 3.5 5 6.5v5c0 4.3 3 8.2 7 9.5 4-1.3 7-5.2 7-9.5v-5l-7-3Z", "a"), p("M9.3 12.2l1.9 1.9 3.6-3.7", "b")]),
  },
  {
    name: "Vertex AI · Gemini",
    role: "Bounded reasoning",
    mark: svg([p("M12 3.5c.9 4 3.6 6.7 7.6 7.6-4 .9-6.7 3.6-7.6 7.6-.9-4-3.6-6.7-7.6-7.6 4-.9 6.7-3.6 7.6-7.6Z", "a")]),
  },
  {
    name: "Artifact Registry",
    role: "Container images",
    mark: svg([rect(4, 4, 7, 7, 1.2, "a"), rect(13, 4, 7, 7, 1.2, "b"), rect(4, 13, 7, 7, 1.2, "c"), rect(13, 13, 7, 7, 1.2, "d")]),
  },
  {
    name: "Cloud Build",
    role: "Repeatable delivery",
    mark: svg([p("M14.5 4.5a4.5 4.5 0 0 0-6 6L4 15l3 3 4.5-4.5a4.5 4.5 0 0 0 6-6l-2.7 2.7-2.3-.7-.7-2.3 2.7-2.7Z", "a")]),
  },
  {
    name: "Cloud Trace",
    role: "Propagated spans",
    mark: svg([p("M4 6h9M4 12h13M4 18h7", "a"), c(15.5, 6, 1.6, "b"), c(19.5, 12, 1.6, "c"), c(9.5, 18, 1.6, "d")]),
  },
  {
    name: "Cloud Logging",
    role: "Append-only evidence",
    mark: svg([rect(4.5, 3.5, 15, 17, 1.8, "a"), p("M8 8h8M8 12h8M8 16h5", "b")]),
  },
  {
    name: "Cloud Monitoring",
    role: "Cutover health",
    mark: svg([p("M3.5 15.5 8 10l3.5 3.5L15 8l5.5 7.5", "a"), p("M3.5 20h17", "b")]),
  },
  {
    name: "Firebase Auth",
    role: "Operator identity",
    mark: svg([p("M6 17 12 3l3.4 6.2L18 17l-6 4-6-4Z", "a"), p("M6 17l6-7.5 3.4-.3", "b")]),
  },
  {
    name: "Oracle JET",
    role: "Operator console",
    mark: svg([rect(3, 4.5, 18, 15, 1.8, "a"), p("M3 9h18M5.6 6.75h2.6", "b"), p("M9.5 9v10.5", "c")]),
  },
  {
    name: "Terraform",
    role: "Infrastructure as code",
    mark: svg([p("M9.6 4.2 14 6.7v5L9.6 9.2v-5Z", "a"), p("M14.8 7.2 19.2 9.7v5l-4.4-2.5v-5Z", "b"), p("M9.6 10.3 14 12.8v5L9.6 15.3v-5Z", "c"), p("M4.8 6.5 9.2 9v5L4.8 11.5v-5Z", "d")]),
  },
];
