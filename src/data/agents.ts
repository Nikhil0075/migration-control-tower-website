/**
 * The agent fleet. Copy from the content pack, section 7.
 * Glyph keys map to public/media/agent/<key>.webp.
 */

export type Agent = {
  index: string;
  key: string;
  name: string;
  role: string;
  summary: string;
  detail: string;
  outputs: string[];
};

export const agents: Agent[] = [
  {
    index: "01",
    key: "discovery",
    name: "Discovery",
    role: "Sees the estate",
    summary: "Catalogs schemas, SQL, DAGs, connection posture and ownership evidence.",
    detail:
      "Source facts come from a capability-declaring adapter, not from a model. The adapter owns connection validation and the extraction of database facts, so table names, schema facts, connection health and measured row counts cannot be invented or replaced by generated text.",
    outputs: ["Schema inventory", "SQL and stored procedures", "Scheduling artifacts", "Connection posture", "Ownership evidence"],
  },
  {
    index: "02",
    key: "lineage",
    name: "Lineage",
    role: "Finds what depends on what",
    summary: "Reconstructs dependencies across databases, transformations and schedules.",
    detail:
      "Hidden dependencies are what make a local change break a downstream report. Lineage separates dependencies that are proven from those that are only proposed, and that distinction survives into the interface rather than being flattened into a single graph.",
    outputs: ["Asset relationships", "Upstream and downstream impact", "Proven vs. proposed edges", "PII-aware impact map"],
  },
  {
    index: "03",
    key: "risk",
    name: "Risk",
    role: "Classifies exposure",
    summary: "Classifies PII, dialect risk, criticality and policy exposure.",
    detail:
      "The policy engine receives structured identity, action, resource class and run context. It never receives free-text legacy content, so a hostile table comment has no channel into an authorization decision.",
    outputs: ["PII classification", "Dialect incompatibility", "Criticality scoring", "Policy exposure"],
  },
  {
    index: "04",
    key: "planner",
    name: "Planner",
    role: "Orders the work",
    summary: "Builds ordered targets, mappings, validation checks and remediation notes.",
    detail:
      "The plan defines executable scope and wave order. Its hash is what a human approval is later bound to — change the plan and the prior approval is no longer valid for it.",
    outputs: ["Ordered targets", "Column mappings", "Validation checks", "Budgets", "Recovery options"],
  },
  {
    index: "05",
    key: "validation",
    name: "Validation",
    role: "Decides what passed",
    summary: "Runs schema, count, hash, aggregate, duplicate and null-profile checks.",
    detail:
      "Validation frequently stops at row counts. Here it does not: deterministic validators compare source and target across six check families, and a run cannot advance toward approval until every required check passes.",
    outputs: ["Schema equivalence", "Row counts", "Content hashes", "Aggregates", "Duplicates", "Null profiles"],
  },
  {
    index: "06",
    key: "cutover",
    name: "Cutover",
    role: "Executes under authority",
    summary: "Consumes human approval, performs the governed cutover, and monitors health.",
    detail:
      "The Cutover agent can consume a valid token but cannot issue one. Publisher and approver identities must differ, and the token is cryptographically bound to the exact plan hash it was issued against.",
    outputs: ["Approval consumption", "Governed cutover", "Row-count health", "Hash health", "Monitoring"],
  },
  {
    index: "07",
    key: "finance-impact",
    name: "Finance Impact",
    role: "Follows the cost",
    summary: "Finds affected reports and downstream consumers through wildcard capability discovery.",
    detail:
      "Cost is measured where it can be measured and declared unavailable where it cannot. Estimates based on measured usage are never presented as actual billed amounts.",
    outputs: ["Affected reports", "Downstream consumers", "Usage-based estimates", "Explicit unavailability"],
  },
];

export const fleetPrinciple =
  "Agents are discovered by capability through approved, versioned AgentCards instead of being hard-coded into the workflow. Publisher and approver identities must differ, preventing an agent package from approving itself into the fleet.";
