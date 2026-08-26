/** About page copy — content pack sections 4, 9, 15 and Part C sections 3, 6, 8. */

export const inspiration =
  "Data migration projects often fail before the first byte moves. Teams cannot reliably answer what depends on a table, where sensitive data flows, which transformations will break, whether a fix was already learned, or whether a cutover approval applies to the current plan. We wanted to explore a different kind of automation: not a chatbot that recommends migration steps, but a governed fleet that can perform real work while making every autonomous action durable, bounded and auditable.";

export const challenge =
  "The hardest challenge was separating useful model reasoning from production authority. Legacy text is necessary for lineage and risk analysis but cannot be trusted as policy input. The project therefore passes only structured identity and resource context into deterministic authorization.";

export const learned =
  "Agentic systems become more credible when their limits are architectural, not merely prompted. Models are strongest at interpreting fragmented evidence, generating structured hypotheses and explaining decisions. They should not own the truth of a checksum, the legality of a state transition, or the authority to approve production cutover.";

export const closing =
  "Make migration autonomous without making it unaccountable.";

export const closingBody =
  "Migration Control Tower demonstrates how agentic reasoning can accelerate discovery, planning and recovery while deterministic controls preserve enterprise trust. Every action is scoped, every state transition is durable, every validation result is reproducible, and production cutover remains under human authority.";

export const mvpStatement =
  "This is an enterprise-pattern proof, not a claim that a complete commercial migration platform is finished. It demonstrates the full governance and execution loop on bounded, reproducible data and measures planning scale, data movement and operational load independently.";

export const accomplishments: string[] = [
  "Deployed the expected nine-service Cloud Run topology.",
  "Completed a real REQUESTED-to-COMPLETE migration using Cloud SQL, Cloud Run Jobs, BigQuery, deterministic validation, human approval, cutover and monitoring.",
  "Captured a separate 73,595-row, 31.4 MB data-plane measurement.",
  "Benchmarked 20,000 control-plane migration definitions without misrepresenting them as completed data migrations.",
  "Blocked unsafe raw-PII access through a policy engine isolated from free-text legacy content.",
  "Implemented memory-assisted recovery while keeping remediation selection and revalidation deterministic.",
];
