/** The migration lifecycle, the legal state path, and the three planes. */

export type Step = { index: string; title: string; body: string };

/** Content pack section 8 — "How a migration runs". */
export const steps: Step[] = [
  { index: "01", title: "Register", body: "Register an estate using credential references rather than storing secret values." },
  { index: "02", title: "Discover", body: "Discover schemas, SQL, procedures, schedules, owners and connection posture." },
  { index: "03", title: "Reconstruct", body: "Reconstruct lineage and calculate migration risk." },
  { index: "04", title: "Plan", body: "Generate an ordered plan with mappings, validation checks, budgets and recovery options." },
  { index: "05", title: "Execute", body: "Execute bounded movement through Cloud Run Jobs." },
  { index: "06", title: "Validate", body: "Validate source and target using deterministic evidence." },
  { index: "07", title: "Recover", body: "Investigate known failures, recall proven remediation, apply a cataloged fix, and validate again." },
  { index: "08", title: "Approve", body: "Pause at READY_FOR_APPROVAL until an authenticated human approves the exact plan hash." },
  { index: "09", title: "Cut over", body: "Cut over, monitor row-count and hash health, and mark the run complete only from recorded state transitions." },
];

/** The legal state machine. `branch: true` marks the failure/recovery path. */
export const states = [
  "REQUESTED", "DISCOVERED", "ANALYZED", "RISK_ASSESSED", "PLANNED",
  "MIGRATING", "VALIDATING", "PASSED", "READY_FOR_APPROVAL",
  "APPROVED", "CUTOVER", "MONITORING", "COMPLETE",
] as const;

export const recoveryStates = ["FAILED", "INVESTIGATING", "REMEDIATING", "VALIDATING"] as const;

export const stateNote =
  "A failed validation branches to FAILED → INVESTIGATING → REMEDIATING → VALIDATING. Illegal transitions raise an error rather than silently skipping state. Handlers claim idempotency keys transactionally, acknowledge messages only after successful completion, and can redo stale claims after a crash.";

export type Plane = {
  index: string;
  name: string;
  line: string;
  body: string;
  members: string[];
};

/** Content pack section 5 and 6 — the core principle. */
export const planes: Plane[] = [
  {
    index: "I",
    name: "Control plane",
    line: "Agents reason about metadata, risk, plans and evidence.",
    body: "The orchestrator advances a run through legal states and resolves approved providers by capability. AgentCards are versioned, signed and pinned to each run. Firestore stores durable run state and idempotency claims. Pub/Sub delivers stage events with dead-letter handling.",
    members: ["Orchestrator", "Agent Registry", "Policy engine", "Durable state", "Idempotent messaging", "Cross-run memory"],
  },
  {
    index: "II",
    name: "Data plane",
    line: "Managed jobs move rows; deterministic validators compare source and target.",
    body: "Cloud Run Jobs execute bounded table movement. In the measured path, three jobs loaded customers, orders and tags from Cloud SQL for PostgreSQL into BigQuery. The executor reports row counts, byte counts, duration and completion evidence independently of the agent control plane.",
    members: ["Cloud Run Jobs", "Cloud SQL for PostgreSQL", "Cloud Storage staging", "BigQuery", "Deterministic validators"],
  },
  {
    index: "III",
    name: "Human plane",
    line: "An authorized operator approves a token cryptographically bound to the plan.",
    body: "A run cannot reach approval until every required deterministic validation passes. The approval service checks the human identity, verifies separation of duties, and binds the token to the migration plan hash. The Cutover agent can consume a valid token but cannot issue one.",
    members: ["Firebase Authentication", "Estate-scoped roles", "Separation of duties", "Plan-hash binding", "Append-only decisions"],
  },
];

export const architectureLine = "LEGACY ESTATE → GOVERNED AGENT FLEET → CLOUD DATA PLANE → BIGQUERY";

export const executionBoundary =
  "The nine-service Cloud Run topology is deployed. Cutover executes as an independent service and the migration data plane runs as independent Cloud Run Jobs. Most pre-migration AgentCards still dispatch locally inside the orchestrator; typed remote dispatch for every remaining stage is the next distribution milestone.";
