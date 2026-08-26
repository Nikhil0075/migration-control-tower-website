/**
 * The six-chapter film sequence — the spine of the home page.
 *
 * Each chapter binds one of the project's own cinematic renders (story/*.mp4)
 * to one stage of the migration argument. Film descriptions come from
 * story/story.md; the copy comes from the website content pack.
 */

export type Chapter = {
  index: string;
  film: string;
  title: string;
  state: string;
  body: string;
  /** Alt/description for assistive technology and the reduced-motion poster. */
  alt: string;
};

export const chapters: Chapter[] = [
  {
    index: "01",
    film: "dormant-estate",
    title: "The estate is dark",
    state: "REQUESTED",
    body: "Legacy estates are rarely described in one reliable place. Catalogs show schemas, but SQL and stored procedures hide transformations. Schedulers encode timing and dependencies. Comments may be stale or adversarial. Nothing here can yet be trusted as a single account of what exists.",
    alt: "Dormant, unlit database units with pipelines ending in unconnected flanges.",
  },
  {
    index: "02",
    film: "discovery-sweep",
    title: "Discovery sweeps the floor",
    state: "DISCOVERED",
    body: "The Discovery agent catalogs schemas, SQL, DAGs, connection posture and ownership evidence. The adapter — not the model — owns connection validation and the extraction of database facts. A model cannot invent a table name or a measured row count.",
    alt: "A teal radar arc sweeping across database units, lighting each one and settling a catalogue tile beside it.",
  },
  {
    index: "03",
    film: "fleet-activation",
    title: "The fleet comes up",
    state: "ANALYZED · RISK_ASSESSED · PLANNED",
    body: "Lineage reconstructs dependencies across databases, transformations and schedules. Risk classifies PII, dialect risk and policy exposure. Planner builds ordered targets, mappings, validation checks and remediation notes. Agents are resolved by capability through approved, versioned AgentCards — never hard-coded into the workflow.",
    alt: "Six agent nodes illuminating in sequence around a control tower, their connecting lines brightening inward.",
  },
  {
    index: "04",
    film: "flow-and-fracture",
    title: "Flow, and fracture",
    state: "MIGRATING · VALIDATING · FAILED",
    body: "Cloud Run Jobs move rows independently of the reasoning layer. When validation fails, the break is loud. Failure is a designed path, not an exception: the recovery loop builds an incident from deterministic evidence and uses lineage to locate the responsible pipeline.",
    alt: "Luminous flow rising through intact pipelines while one broken line drops its particles through the gap and pulses amber-red.",
  },
  {
    index: "05",
    film: "governed-release",
    title: "Nothing passes unproven",
    state: "PASSED · READY_FOR_APPROVAL",
    body: "Schema, count, hash, aggregate, duplicate and null-profile checks run deterministically. A run cannot reach approval until every required check passes. The approval service verifies the human identity, enforces separation of duties, and binds the token to the migration plan hash.",
    alt: "A single record travelling from an open vault to a checkpoint, where five check marks illuminate one after another.",
  },
  {
    index: "06",
    film: "completion",
    title: "Cutover, under authority",
    state: "APPROVED · CUTOVER · COMPLETE",
    body: "The Cutover agent can consume a valid approval token but cannot issue one. Completion is derived from recorded state transitions rather than from the interface. Every action is scoped, every transition is durable, every validation result is reproducible.",
    alt: "A gate opening onto an unbroken flow into a cloud warehouse, with audit lines settling into alignment beneath.",
  },
];
