/** Technology stack and rationale — content pack section 10 and Part B section 6. */

export type TechCategory = {
  index: string;
  name: string;
  line: string;
  items: string[];
};

export const stack: TechCategory[] = [
  {
    index: "01",
    name: "Intelligence",
    line: "Bounded structured reasoning, explanation, and read-only assistant behavior.",
    items: ["Gemini 3.7 Flash", "Gemini 3.5 Flash", "Google ADK 2.7.1", "google-genai", "Vertex AI"],
  },
  {
    index: "02",
    name: "Application",
    line: "The orchestrator, agents, policy services, adapters and validation logic.",
    items: ["Python", "FastAPI", "Oracle JET 20.1.3", "Preact", "TypeScript"],
  },
  {
    index: "03",
    name: "Cloud runtime",
    line: "Independent service identities, autoscaling, and execution isolation for finite work.",
    items: ["Cloud Run services", "Cloud Run Jobs", "Artifact Registry", "Cloud Build"],
  },
  {
    index: "04",
    name: "State and messaging",
    line: "Durable workflow state and at-least-once delivery that stays safe under retry.",
    items: ["Firestore", "Pub/Sub", "Dead-letter topics", "Transactional idempotency"],
  },
  {
    index: "05",
    name: "Data",
    line: "The measured source, the analytics target, and the staging between them.",
    items: ["SQL Server", "Cloud SQL for PostgreSQL", "BigQuery", "Cloud Storage staging"],
  },
  {
    index: "06",
    name: "Security",
    line: "Secrets stay references; identity and policy are evaluated outside the model.",
    items: ["IAM", "OIDC", "Secret Manager", "Firebase Authentication", "Policy-as-code"],
  },
  {
    index: "07",
    name: "Observability",
    line: "Traces, logs and metrics that make a claim checkable after the fact.",
    items: ["OpenTelemetry", "Cloud Trace", "Cloud Logging", "Cloud Monitoring"],
  },
  {
    index: "08",
    name: "Delivery and QA",
    line: "Repeatable infrastructure and the gates that keep the estate portable.",
    items: ["Terraform", "Docker", "Make", "pytest", "Vitest", "Playwright", "axe"],
  },
];

export type Rationale = { choice: string; why: string };

export const rationale: Rationale[] = [
  { choice: "Gemini 3.7 / 3.5 Flash", why: "Bounded structured reasoning, explanation, and read-only assistant behavior." },
  { choice: "Google ADK", why: "Agent construction, tool orchestration, and framework compliance." },
  { choice: "Cloud Run services", why: "Independent service identities, autoscaling, and containerized control-plane deployment." },
  { choice: "Cloud Run Jobs", why: "Execution isolation for finite data-movement tasks and independent job evidence." },
  { choice: "Firestore", why: "Durable workflow state, transactions, registry records, evidence pointers and idempotency claims." },
  { choice: "Pub/Sub", why: "At-least-once stage delivery, push authentication, retries and dead-letter routing." },
  { choice: "BigQuery", why: "Target analytics store, validation queries, cost estimates and bounded query execution." },
  { choice: "Cloud SQL", why: "Managed PostgreSQL source for the measured live migration path." },
  { choice: "Terraform", why: "Repeatable infrastructure for services, identities, topics, subscriptions, storage and data resources." },
];

/** Content pack Part B section 5 — governance and security controls. */
export const controls: string[] = [
  "Policy decisions operate on structured identity and resource inputs, never free-text estate content.",
  "Estate documents contain secret references, not credential values; runtime resolution is redacted in logs.",
  "Cloud Run and Pub/Sub use service identities and OIDC; operator roles are scoped by estate.",
  "Agent publication and approval use separate identities.",
  "Production cutover requires a human token bound to the exact plan hash.",
  "BigQuery queries are dry-run first, reserve estimated bytes against a run budget, and enforce maximum bytes billed.",
];

/** Content pack section 11 — research and evidence sources. */
export const research = [
  { source: "WideWorldImporters", role: "SQL Server legacy estate for discovery, lineage, risk and validation", provenance: "Official Microsoft sample, MIT" },
  { source: "PostgreSQL retail", role: "Second engine and live Cloud SQL execution path", provenance: "Project-authored fixture" },
  { source: "Oracle SQL corpus", role: "Dialect incompatibility and stored-procedure cases", provenance: "Project-authored, informed by public examples" },
  { source: "Airflow-style DAGs", role: "Schedules and upstream/downstream dependencies", provenance: "Project-authored fixture" },
  { source: "Fault injection", role: "Row loss, drift, duplicates, broken lineage, PII attempts, malicious instructions", provenance: "Project-authored ground truth" },
];

export const researchNote =
  "No confidential or production client data is used. Because the harness knows which dependency should exist, which risk was planted, which action should be blocked and which check should fail, evaluation is repeatable rather than anecdotal.";
