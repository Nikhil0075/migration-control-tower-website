/** The problem — content pack section 4. */

export const problemHeadline =
  "Enterprise migration is a decision problem before it is a data-copy problem.";

export const problemBody =
  "Legacy estates are rarely described in one reliable place. Catalogs show schemas, but SQL and stored procedures hide transformations. Schedulers encode timing and dependencies. Comments may be stale or adversarial. Sensitive data carries access and residency constraints. Validation logic differs by team, while cutover often depends on manual evidence assembled too late.";

export const problems: { index: string; text: string }[] = [
  { index: "01", text: "Hidden dependencies make local changes break downstream reports and services." },
  { index: "02", text: "Dialect and type incompatibilities surface late, often during execution." },
  { index: "03", text: "Model reasoning is unsafe when it is allowed to directly authorize sensitive actions." },
  { index: "04", text: "Validation frequently stops at row counts instead of checking schemas, hashes, aggregates and null profiles." },
  { index: "05", text: "Repeated failures are rediscovered because remediation knowledge is not durable." },
  { index: "06", text: "Cutover authority is fragile when the approval is not bound to the exact migration plan." },
];

/** The solution — content pack section 5. */
export const solutionHeadline = "A control tower for the decisions around migration.";

export const solutionBody =
  "Migration Control Tower turns the migration lifecycle into a durable, governed state machine. Specialized agents interpret legacy evidence and propose actions. Deterministic services enforce authorization, idempotency, budgets, validation results, approval integrity and legal state transitions. Cloud Run Jobs move rows independently of the reasoning layer. A human operator retains authority over production cutover.";

/** Governance — content pack section 9. */
export const governanceHeadline = "Models may interpret. They may not authorize.";

export const governanceBody =
  "The policy engine receives structured identity, action, resource class and run context. It never receives free-text legacy content. A hostile table comment therefore has no channel into an authorization decision. Unsafe raw-PII access is denied deterministically, secrets remain references until runtime, handlers are idempotent, and approval cannot be reused after the plan changes.";

export const recoveryBody =
  "When validation fails, the recovery path builds an incident from deterministic evidence and uses lineage to locate the responsible pipeline. Gemini can explain a bounded root-cause hypothesis; ordinary code selects and applies only an approved remediation. Confirmed fixes are written to cross-run memory, but every future reuse still requires fresh validation.";

/** Marquee vocabulary — the lifecycle stages as a slow ticker. */
export const marqueeTerms = [
  "Discovery", "Lineage", "Risk", "Planner", "Migration",
  "Reconciliation", "Recovery", "Approval", "Cutover", "Evidence",
];
