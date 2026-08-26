/**
 * Site-level constants and navigation.
 * Copy is taken from Migration_Control_Tower_Website_Content_Pack.docx.
 */

export const site = {
  name: "Migration Control Tower",
  shortName: "Control Tower",
  title: "Autonomous Data Migration Control Tower",
  category: "Fortified Enterprise Fleet",
  tagline: "Autonomous migration. Deterministic control.",
  pitch: "Models interpret. Deterministic services decide. Humans authorize production cutover.",
  description:
    "A governed fleet of specialized agents that discovers legacy data estates, reconstructs lineage, plans migration, validates outcomes, recovers from failure, and keeps production cutover under human authority.",
  year: 2026,
  build: "485f418",
  repoHead: "a43d280",
  inventoryDate: "25 August 2026",
} as const;

/**
 * External destinations.
 *
 * TODO(user): paste the Devpost submission URL below. An empty string renders
 * as non-interactive "COMING SOON" metadata rather than a dead link — see
 * <AnimatedLink> and <Footer>.
 */
export const links = {
  github: "https://github.com/Nikhil0075/MIGRATION-CONTROL-TOWER",
  email: "nikhilranjanmurmu75@gmail.com",
  devpost: "",
  console: "https://control-tower-ui-872516377824.us-central1.run.app/",
} as const;

/**
 * Shared demo access to the live console.
 *
 * These are published deliberately so judges and reviewers can open the running
 * system without being provisioned an account. Treat them as public: the
 * account is scoped to the demo estate and nothing else.
 */
export const consoleDemo = {
  email: "migration.control@tower.com",
  password: "migration.control",
  roles: "Selected-estate roles: operator, viewer",
} as const;

export type NavItem = {
  index: string;
  label: string;
  href: string;
  /** Shown under the link in the fullscreen menu. */
  note: string;
};

export const nav: NavItem[] = [
  { index: "01", label: "Platform", href: "/platform", note: "The agent fleet and the migration lifecycle" },
  { index: "02", label: "Architecture", href: "/architecture", note: "Control plane, data plane, human plane" },
  { index: "03", label: "Technology", href: "/technology", note: "The stack and why each part is there" },
  { index: "04", label: "Application Guide", href: "/guide", note: "A walkthrough of the operator console" },
  { index: "05", label: "About", href: "/about", note: "The project and the people behind it" },
  { index: "06", label: "Contact", href: "/contact", note: "Start a conversation" },
];

/** Ordered route chain powering the <NextPage> block at the foot of each page. */
export const routeChain = [
  "/",
  "/platform",
  "/architecture",
  "/technology",
  "/guide",
  "/about",
  "/contact",
] as const;

export const pageMeta: Record<string, { label: string; eyebrow: string }> = {
  "/": { label: "Overview", eyebrow: "Index" },
  "/platform": { label: "Platform", eyebrow: "The fleet" },
  "/architecture": { label: "Architecture", eyebrow: "The system" },
  "/technology": { label: "Technology", eyebrow: "The stack" },
  "/guide": { label: "Application Guide", eyebrow: "The console" },
  "/about": { label: "About", eyebrow: "The project" },
  "/contact": { label: "Contact", eyebrow: "Get in touch" },
};

export function nextRoute(current: string): string | null {
  const i = (routeChain as readonly string[]).indexOf(current);
  if (i === -1 || i === routeChain.length - 1) return null;
  return routeChain[i + 1];
}
