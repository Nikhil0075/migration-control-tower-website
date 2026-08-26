/**
 * Measured results.
 *
 * The content pack is emphatic that evidence levels stay visible: "The strongest
 * story is not that every enterprise-scale feature is complete; it is that the
 * project proves a governed, autonomous migration loop and reports its current
 * boundaries honestly." Every metric therefore carries its claim level, and the
 * UI renders that label rather than dropping it.
 */

export type ClaimLevel = "live" | "measured" | "control-plane" | "tested" | "planned";

export const claimLabel: Record<ClaimLevel, string> = {
  live: "Live / captured",
  measured: "Live / measured",
  "control-plane": "Measured control plane",
  tested: "Implemented / tested",
  planned: "Planned next",
};

export type Metric = {
  /** Numeric portion, animated by the counter. */
  value: number;
  /** Rendered before/after the counter — never animated. */
  prefix?: string;
  suffix?: string;
  /** Decimal places for the counter. */
  decimals?: number;
  label: string;
  note: string;
  claim: ClaimLevel;
};

/** Content pack section 3 — proof strip. Used on the home page. */
export const headline: Metric[] = [
  {
    value: 73595,
    label: "Rows moved",
    note: "Measured source-to-target transfer by the Cloud Run Job executor.",
    claim: "measured",
  },
  {
    value: 9,
    suffix: " / 9",
    label: "Services observed",
    note: "The planned Cloud Run service topology exists in the live inventory.",
    claim: "live",
  },
  {
    value: 15,
    label: "Pre-cutover checks",
    note: "Deterministic validation passed before the run could reach approval.",
    claim: "measured",
  },
  {
    value: 20000,
    label: "Migration definitions",
    note: "Planning and wave-scheduling benchmark. Zero rows moved in this measurement.",
    claim: "control-plane",
  },
];

/** Full evaluation table — content pack Part B section 8. */
export const evaluation: Metric[] = [
  {
    value: 73595,
    label: "Rows transferred",
    note: "31,432,246 bytes in 439,935 ms — 167.3 rows per second.",
    claim: "measured",
  },
  {
    value: 31432246,
    suffix: " B",
    label: "Bytes transferred",
    note: "Reported by CloudRunJobExecutor independently of the agent control plane.",
    claim: "measured",
  },
  {
    value: 20000,
    label: "Definitions planned",
    note: "126.9 validations/sec and 132,613.5 scheduling items/sec across the control plane.",
    claim: "control-plane",
  },
  {
    value: 10,
    label: "Concurrent decisions",
    note: "Bounded concurrency measurement with zero captured backlog.",
    claim: "measured",
  },
  {
    value: 17,
    label: "Legal transitions",
    note: "Persisted by the final flagship run, which resumed after failure.",
    claim: "measured",
  },
  {
    value: 48,
    label: "Estate objects",
    note: "Discovered in the WideWorldImporters SQL Server source.",
    claim: "live",
  },
];

export const scaleCaveat =
  "The 20,000-definition result is a planning and wave-scheduling benchmark. It must not be described as 20,000 completed bulk migrations.";

export const acceptanceNote =
  "The live acceptance run completed three table loads containing 5 customer rows, 5 order rows and 3 tag rows, then passed 15 pre-cutover checks. The separate 73,595-row measurement is the data-plane scale run and is reported independently.";

/** Content pack section 14 — honest boundary copy, rendered as a first-class section. */
export const boundaries: string[] = [
  "Most pre-migration stages still execute inside the orchestrator despite independent service shells being deployed.",
  "End-to-end cross-service trace propagation remains incomplete.",
  "Tool-level authorization coverage is strongest in Discovery, Risk and Cutover; Lineage, Planner and Validation need equivalent internal coverage.",
  "The 20,000-definition benchmark proves control-plane planning scale, not 20,000 bulk migrations.",
  "Cloud Billing Budgets alert but do not stop spend.",
  "Long-horizon behavior has fixtures and kill/resume evidence, not a continuously running multi-week production migration.",
];

/** Content pack section 12 — what is different. */
export const differentiators = [
  {
    index: "01",
    title: "Interpretation is separated from authority",
    body: "Models explain and propose; deterministic services own permissions, state transitions, validation truth and approval integrity.",
  },
  {
    index: "02",
    title: "Agents are discovered by capability",
    body: "Versioned AgentCards reduce orchestration coupling and support cross-department providers.",
  },
  {
    index: "03",
    title: "Failure is a first-class path",
    body: "Investigation, memory recall, cataloged remediation and revalidation are designed into the workflow.",
  },
  {
    index: "04",
    title: "Portability is mechanically enforced",
    body: "A clean-estate gate fails if a second database engine leaks source-specific logic into the core agent directory.",
  },
  {
    index: "05",
    title: "Evidence claims are labeled",
    body: "Deployed, live-executed, implemented, tested and planned are intentionally different states.",
  },
  {
    index: "06",
    title: "Scale dimensions are not conflated",
    body: "Metadata planning scale, actual rows moved and concurrent operational load are measured separately.",
  },
];

/** Content pack section 13 — scaling roadmap. */
export const roadmap = [
  {
    horizon: "Near term",
    capability: "Typed HTTP dispatch for every remaining agent",
    evidence: "Each stage runs under its own IAM identity and appears in one propagated trace.",
  },
  {
    horizon: "Scale term",
    capability: "Partitioned, checkpointed data plane with backpressure",
    evidence: "Larger measured row and byte tiers complete with restart evidence and bounded cost.",
  },
  {
    horizon: "Platform term",
    capability: "Signed Migration Packs and adapter certification",
    evidence: "A third source family onboards without core-agent changes.",
  },
  {
    horizon: "Enterprise term",
    capability: "Tenant isolation, residency, retention and compliance exports",
    evidence: "Independent policy and audit evidence exists for every tenant and connector.",
  },
];
