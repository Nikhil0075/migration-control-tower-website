/**
 * About — team.
 *
 * Portraits: drop the source images into `assets-src/team/` named after each
 * member's `id` — `nikhil.jpg`, `mousmi.jpg` — then run `npm run assets`. The
 * pipeline crops them to 4:5, converts to WebP at two widths, and records them
 * in the generated media manifest.
 *
 * Nothing here needs editing afterwards: the component looks each member up in
 * that manifest, so a slot with no image renders a composed placeholder and
 * never requests a file that is not there.
 */

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  /** Full https:// URL. Empty string renders the name without a link. */
  linkedin: string;
};

export const team: TeamMember[] = [
  {
    id: "nikhil",
    name: "Nikhil Ranjan Murmu",
    role: "Cloud, network and infrastructure engineering",
    bio: "Built and hardened the Google Cloud footprint the control tower runs on — the nine-service Cloud Run topology, the private networking and service identities, the Pub/Sub event backbone, and the Terraform that makes all of it reproducible.",
    linkedin: "https://www.linkedin.com/in/nikhil-ranjan-murmu-30b9072a5",
  },
  {
    id: "mousmi",
    name: "Mousmi Pradhan",
    role: "Discovery and frontend development",
    bio: "Built the discovery path that turns a fragmented legacy estate into catalogued evidence, and the operator console that presents it — the workspace where runs, lineage, approvals and evidence are actually read.",
    linkedin: "https://www.linkedin.com/in/mousmi-pradhan-9462b1315",
  },
];

export const teamNote =
  "Built for the All Things Agentic Hackathon, Fortified Enterprise Fleet category.";
