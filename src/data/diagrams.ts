/**
 * The architecture diagram pack.
 *
 * Titles and questions come from Architecture_diagrams/README.md. Each diagram
 * is a hand-built vector rendering of the implemented topology, matched against
 * the live Google Cloud inventory.
 */

export type Diagram = {
  no: string;
  /** Maps to public/media/diagram/<key>.webp */
  key: string;
  title: string;
  question: string;
  alt: string;
};

export const diagrams: Diagram[] = [
  { no: "01", key: "01-whole-application-gcp-deployment", title: "Whole application and Google Cloud deployment", question: "What is deployed, and where are the trust boundaries?", alt: "Architecture diagram 01: whole application and google cloud deployment — what is deployed, and where are the trust boundaries?" },
  { no: "02", key: "02-agent-fleet-capability-dispatch", title: "Agent fleet and capability dispatch", question: "How does work reach an agent, and who is allowed to decide?", alt: "Architecture diagram 02: agent fleet and capability dispatch — how does work reach an agent, and who is allowed to decide?" },
  { no: "03", key: "03-orchestrator-state-machine", title: "Orchestrator state machine", question: "What are the legal run states, and how does failure recover?", alt: "Architecture diagram 03: orchestrator state machine — what are the legal run states, and how does failure recover?" },
  { no: "03b", key: "03b-orchestrator-event-routes", title: "Orchestrator event routes", question: "Which event lands on which handler?", alt: "Architecture diagram 03b: orchestrator event routes — which event lands on which handler?" },
  { no: "04", key: "04-discovery-agent", title: "Discovery agent", question: "Where do source facts come from, and what may the model touch?", alt: "Architecture diagram 04: discovery agent — where do source facts come from, and what may the model touch?" },
  { no: "05", key: "05-lineage-agent", title: "Lineage agent", question: "Which dependencies are proven, and which are only proposed?", alt: "Architecture diagram 05: lineage agent — which dependencies are proven, and which are only proposed?" },
  { no: "06", key: "06-risk-compliance-agent", title: "Risk and compliance agent", question: "How is a policy outcome decided?", alt: "Architecture diagram 06: risk and compliance agent — how is a policy outcome decided?" },
  { no: "07", key: "07-migration-planner-agent", title: "Migration planner agent", question: "What defines executable scope and wave order?", alt: "Architecture diagram 07: migration planner agent — what defines executable scope and wave order?" },
  { no: "08", key: "08-validation-reconciliation-agent", title: "Validation and reconciliation agent", question: "What makes a run PASS, and what blocks it?", alt: "Architecture diagram 08: validation and reconciliation agent — what makes a run PASS, and what blocks it?" },
  { no: "09", key: "09-cutover-agent", title: "Cutover agent", question: "Who can authorise a cutover, and against what?", alt: "Architecture diagram 09: cutover agent — who can authorise a cutover, and against what?" },
  { no: "10", key: "10-finance-impact-agent", title: "Finance impact agent", question: "How is cost measured, and what happens when it cannot be?", alt: "Architecture diagram 10: finance impact agent — how is cost measured, and what happens when it cannot be?" },
  { no: "11", key: "11-reliability-idempotency-dlq", title: "Reliability, idempotency and dead letters", question: "How does at-least-once delivery stay safe?", alt: "Architecture diagram 11: reliability, idempotency and dead letters — how does at-least-once delivery stay safe?" },
  { no: "12", key: "12-wwi-flagship-migration-sequence", title: "WWI flagship migration sequence", question: "What actually happened in the retained acceptance run?", alt: "Architecture diagram 12: wwi flagship migration sequence — what actually happened in the retained acceptance run?" },
];
