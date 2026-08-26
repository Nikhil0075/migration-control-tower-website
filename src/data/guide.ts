/**
 * Application Guide — a walkthrough of the operator console.
 *
 * Structure, captions and alt text come from
 * screenshot/APPLICATION_SCREENSHOT_GUIDE.md, which documents every capture and
 * recommends this narrative order. Captions stay attached to the screen they
 * were written for: the guide is explicit that a fact must not drift away from
 * the screenshot that evidences it.
 */

export type GuideShot = {
  /** Maps to public/media/shot/<key>.webp */
  key: string;
  title: string;
  caption: string;
  alt: string;
};

export type GuideChapter = {
  index: string;
  title: string;
  intro: string;
  lead: GuideShot;
  support: GuideShot[];
};

export const guideChapters: GuideChapter[] = [
  {
    index: "01",
    title: "Enter and orient",
    intro:
      "Every view sits behind a verified identity, and the first screen already reports what the system believes about itself.",
    lead:
  { key: "1", title: "Authentication and secure entry", caption: "Secure Firebase authentication with administrator-assigned viewer, operator, and approver roles.", alt: "Migration Control Tower login page with Google sign-in, optional domain email access, and descriptions of operator and approver responsibilities." },
    support: [
      { key: "2", title: "Production overview", caption: "A single production view of migration progress, estate health, policy activity, recovery performance, and measured cost/volume evidence.", alt: "Production overview showing a completed WWI SQL Server migration, 48 estate objects, 99 percent row transfer during the evidence window, policy denials, recovery rate, and lifecycle stages." },
      { key: "17", title: "System and cloud-service health", caption: "Production health is derived from live Cloud Run revisions, BigQuery execution evidence, model readiness, connection freshness, queues, and telemetry.", alt: "System Health page showing production build 485f418, observed services, connection binding, Gemini assistant readiness, BigQuery evidence, and healthy Cloud Run agent revisions." },
    ],
  },
  {
    index: "02",
    title: "Connect and understand",
    intro:
      "An estate is the durable boundary that binds sources, adapters, packs, targets, ownership and authorization — registered without the console ever holding a credential.",
    lead:
  { key: "3-0", title: "Estate inventory and connection safety", caption: "Register sources and targets without exposing credentials; discover real object counts and bind execution through approved Migration Packs.", alt: "Estates page showing a healthy WWI SQL Server source with 48 objects, a BigQuery target, and Secret Manager-based credential handling." },
    support: [
      { key: "3-1", title: "Onboarding step 1: Identity", caption: "Begin with a stable estate identity and an enforced lifecycle boundary that separates production operation from controlled acceptance rehearsal.", alt: "Estate onboarding identity step with the WWI flagship estate ID, display name, Acceptance and rehearsal lifecycle, and a six-step progress indicator." },
      { key: "3-2", title: "Onboarding step 2: Source", caption: "Bind the estate to a capability-declaring source adapter and a stable concurrency identity.", alt: "Estate onboarding source step showing source ID wwi-sqlserver, the SQL Server adapter with discover, health, reconcile and transfer capabilities, and the WideWorldImporters database." },
      { key: "3-3", title: "Onboarding step 3: Secret-safe connection", caption: "The console accepts private connection coordinates and a Secret Manager reference—never a database password.", alt: "Estate onboarding connection step with a masked private host, port 1433, migration_readonly user, and a Secret Manager password-reference field." },
      { key: "3-4", title: "Onboarding step 4: Live validation", caption: "A live private-network probe verifies SQL Server 2022, 48 measured base tables, Secret Manager resolution, and connection latency before anything is saved.", alt: "Estate validation step reporting a healthy SQL Server 2022 connection, 48 base tables, Secret Manager credential reference, and 420 millisecond latency." },
      { key: "3-5", title: "Onboarding step 5: Migration Pack", caption: "Choose a versioned, source-compatible Migration Pack that explicitly distinguishes assessment from execution.", alt: "Estate onboarding Pack step with a dropdown listing assessment-only and executable Oracle, PostgreSQL and SQL Server packs, including wwi_sqlserver_flagship_v1." },
      { key: "3-6", title: "Onboarding step 6: Review and audit justification", caption: "Review the complete configuration and provide an audit-recorded justification before the governed estate write is enabled.", alt: "Estate onboarding review step summarizing the WWI flagship acceptance estate, SQL Server source, Secret Manager reference, executable pack, and required justification." },
      { key: "4", title: "Pack-driven assessment", caption: "Select a versioned Migration Pack to produce a governed assessment and proposed plan before any data movement begins.", alt: "Assessments page with the WWI flagship pack selected and a completed assessment in planned state." },
      { key: "8-0", title: "Run-scoped lineage graph", caption: "A PII-aware dependency graph built from run-scoped SQL Server relationship evidence.", alt: "Dense lineage graph for the WWI SQL Server estate showing 29 related assets, 98 directional relationships, schema groups, and PII-labelled nodes." },
      { key: "8-1", title: "Focused lineage impact path", caption: "Focus a single dependency path to understand downstream impact and where sensitive data enters the migration scope.", alt: "Focused lineage path highlighting OrderLines, Orders, Customers, directional dependencies, and a PII classification." },
      { key: "8-2", title: "Relationship provenance register", caption: "Every lineage edge resolves to inspectable source/target columns, a database constraint, confidence, and evidence provenance.", alt: "Relationship register listing SQL Server foreign-key edges with source and target columns, constraint names, confidence one, and evidence source." },
    ],
  },
  {
    index: "03",
    title: "Plan and execute",
    intro:
      "Admission control decides what may run. The data plane moves rows in independent Cloud Run Jobs and reports its own measured evidence.",
    lead:
  { key: "7-3", title: "Cloud Run data-plane proof", caption: "Real Cloud Run job IDs, measured row/byte counts, a visible 1% fault, and the subsequent clean-reload evidence.", alt: "Data-plane job table showing completed Cloud Run operations, measured source and target rows, bytes, duration, one 99 percent controlled fault, and later full row parity." },
    support: [
      { key: "5", title: "Wave admission and operational control", caption: "Transactional admission control protects source systems while giving authorized operators an audited emergency hold.", alt: "Wave Manager showing a concurrency cap of one, no active transfers, and no queued or blocked work." },
      { key: "6", title: "Run register", caption: "Track assessments and executions as durable state machines, including prior evidence, retries, and approval status.", alt: "Runs page listing planned, ready-for-approval, and completed WWI migration runs with timestamps and progress." },
      { key: "7-0", title: "Complete run and lifecycle evidence", caption: "One immutable timeline preserves failure, investigation, deterministic remediation, revalidation, independent approval, and completion.", alt: "Completed flagship migration run showing a 100 percent lifecycle and a timeline containing controlled failure, investigation, remediation, approval, cutover, and completion." },
      { key: "7-1", title: "Per-stage execution evidence", caption: "Every stage is attributable to a specific capability, version, attempt, latency, model configuration, and trace context.", alt: "Stage execution table listing migration states, durations, agent names and versions, model fields, and trace availability." },
      { key: "7-2", title: "Migration plan register", caption: "Inspect target-level plan metadata without inventing missing status, source, or telemetry fields.", alt: "Migration plan table showing catalogue targets, status and source metadata, filters, pagination, and explicit unavailable values." },
    ],
  },
  {
    index: "04",
    title: "Detect and recover",
    intro:
      "Failure is a designed path. A failed deterministic check becomes an incident, lineage locates the responsible pipeline, and only a cataloged remediation is applied.",
    lead:
  { key: "7-4", title: "Autonomous recovery and policy evidence", caption: "AI explains the incident; deterministic controls authorize, execute, and validate the only permitted recovery.", alt: "Resolved Sales Orders row-loss incident with Gemini rationale, deterministic clean-reload remediation, and evidence-hashed policy decisions." },
    support: [
      { key: "13", title: "Incidents and recovery proof", caption: "The system detected a controlled row-loss fault, explained it, executed the only permitted repair, revalidated it, and preserved every denial and decision.", alt: "Incidents page showing one resolved Sales Orders row-loss incident, its Gemini explanation, deterministic Cloud Run reload, and three denied PII-read events." },
      { key: "15", title: "Evidence-backed remediation memory", caption: "Reuse proven remediations by exact failure signature while requiring fresh policy checks and deterministic revalidation every time.", alt: "Memory Bank listing learned row-loss remediation signatures, clean-reload recommendations, source evidence, reuse counts, and confirmations." },
      { key: "14", title: "Dead-letter operations", caption: "Inspect, replay, or archive poison messages without consuming them on page load or hiding queue-lease uncertainty.", alt: "Empty Dead letters page with guidance explaining non-consuming inspection and replay or archive controls." },
    ],
  },
  {
    index: "05",
    title: "Govern and approve",
    intro:
      "The policy engine is the one decision point, and the human gate is separate from it. Approval is bound to the exact plan hash.",
    lead:
  { key: "10", title: "Policy enforcement and approval history", caption: "Deterministic least-privilege policies and an independent, justified human approval gate protect cutover.", alt: "Policies and Approvals page showing denied raw-PII access, allowed governed agent capabilities, pending requests, and a separately approved flagship run." },
    support: [
      { key: "16", title: "Plan-bound human approval gate", caption: "Independent approval is bound to the exact run and plan hash, expires, and is never overwritten.", alt: "Approvals page showing one pending plan-bound request, one independently approved flagship run, zero stale bindings, and append-only history." },
    ],
  },
  {
    index: "06",
    title: "Prove it",
    intro:
      "Agent decisions, lineage provenance, reconciliation and scale are each evidenced separately, because they answer different questions.",
    lead:
  { key: "11-1", title: "Decision and generation trail", caption: "Inspect what each agent proposed or decided, the evidence it used, its model/version, latency, validation result, and whether a fallback occurred.", alt: "Agent audit table interleaving Gemini discovery and lineage proposals with deterministic risk, migration, validation, and cutover decisions." },
    support: [
      { key: "11-0", title: "Agent fleet overview", caption: "Seven versioned Cloud Run agents with measurable execution, model, latency, fallback, and readiness evidence.", alt: "Agents page with fleet KPIs and approved Cloud Run cards for discovery, lineage, planning, risk, validation, finance, and cutover agents." },
      { key: "11-2", title: "Versioned agent registry", caption: "Versioned capability dispatch, per-service identities, and pinned runs make the agent fleet upgradeable and auditable.", alt: "Agent registry listing approved Cloud Run and deprecated local versions, service accounts, models, thinking levels, capabilities, and pinned runs." },
      { key: "9", title: "Cross-run reconciliation", caption: "Source-to-target row counts, hashes, null profiles, aggregates, deltas, and tolerances remain independently inspectable across runs.", alt: "Reconciliation table showing pass statuses for row-count, hash, null-profile, and aggregate checks with source and target values." },
      { key: "12-0", title: "Control-plane evaluation scale", caption: "Reproducible control-plane scale tests process up to 20,000 definitions without invoking a model for deterministic work.", alt: "Evaluations page showing control-plane scale results for one thousand, five thousand, and twenty thousand definitions with zero model calls." },
      { key: "12-1", title: "Real data-plane and operational-load evidence", caption: "Measured Cloud Run data movement and concurrent control-plane load, with queue and fleet health captured alongside throughput and latency.", alt: "Evaluation evidence showing 73,595 rows moved by a Cloud Run job and a ten-concurrent-check load test with a healthy nine-of-nine fleet and zero Pub/Sub backlog." },
    ],
  },
  {
    index: "07",
    title: "Ask the tower",
    intro:
      "A read-only assistant grounded in the run's own recorded evidence — it can cite state, and it cannot change it.",
    lead:
  { key: "18", title: "Ask Control Tower assistant", caption: "Ask run-specific questions in natural language and receive read-only, cited answers grounded in authorized Control Tower evidence.", alt: "Gemini 3.5 Flash Ask Control Tower drawer showing its read-only restriction, active-context option, multiline prompt, and Enter-to-send behavior." },
    support: [],
  },
];

export const guideIntro =
  "The console is an operator surface, not a dashboard. Every screen below is a real capture of the production build running the WideWorldImporters SQL Server flagship migration. Each caption stays tied to the screen it describes, and an estimate is never presented as a billed amount.";

export const guideStatement =
  "Gemini agents enrich discovery, infer lineage, explain risk and propose recovery. Deterministic services remain authoritative for source facts, policies, state transitions, reconciliation, remediation and approval.";

