import Link from "next/link";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { nav } from "@/data/site";

export default function NotFound() {
  return (
    <section
      data-surface="dark"
      className="shell flex min-h-[100svh] flex-col justify-center py-[var(--space-xl)]"
    >
      <p className="micro" style={{ color: "var(--accent)" }}>404</p>
      <h1 className="display mt-[var(--space-sm)] !text-[clamp(2.5rem,7vw,7.5rem)] max-w-[14ch]">
        No route by that name.
      </h1>
      <p className="lead mt-[var(--space-md)] max-w-[52ch]">
        The page you asked for is not part of this site. Every legal path is listed below.
      </p>
      <ul className="mt-[var(--space-lg)] max-w-[46rem]">
        {nav.map((n) => (
          <li key={n.href} className="border-t" style={{ borderColor: "var(--line)" }}>
            <AnimatedLink href={n.href} index={n.index} size="lg" className="w-full">
              {n.label}
            </AnimatedLink>
          </li>
        ))}
        <li className="border-y" style={{ borderColor: "var(--line)" }}>
          <Link href="/" className="micro block py-4 hover:opacity-60">
            ← Back to the overview
          </Link>
        </li>
      </ul>
    </section>
  );
}
