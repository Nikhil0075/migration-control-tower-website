"use client";

import Link from "next/link";
import { cx } from "@/lib/cx";
import { useMagnetic } from "@/hooks/useMagnetic";

/** The diagonal arrow used by every editorial link. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={cx("h-[0.7em] w-[0.7em] shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
    >
      <path d="M2.5 9.5L9.5 2.5M4 2.5h5.5V8" />
    </svg>
  );
}

type Props = {
  href: string;
  children: React.ReactNode;
  /** Numeric prefix, e.g. "01". */
  index?: string;
  className?: string;
  /** Renders as a large editorial link rather than an inline one. */
  size?: "sm" | "md" | "lg";
  external?: boolean;
  ariaLabel?: string;
};

/**
 * The site's link. Label + diagonal arrow, with a rule that expands from the
 * left on hover and the arrow shifting up-right. Underline-only links are
 * explicitly ruled out by the brief.
 *
 * An empty `href` renders inert "COMING SOON" metadata instead of a dead link,
 * which is how the Devpost and console URLs behave until they are supplied.
 */
export function AnimatedLink({
  href,
  children,
  index,
  className,
  size = "md",
  external,
  ariaLabel,
}: Props) {
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);

  const sizes = {
    sm: "text-[var(--t-small)]",
    md: "text-[var(--t-body)]",
    lg: "text-[var(--t-lead)]",
  } as const;

  const inner = (
    <>
      {index && (
        <span className="micro shrink-0 transition-colors duration-[--dur-fast]" style={{ color: "var(--accent)" }}>
          {index}
        </span>
      )}
      <span className="relative inline-flex items-center gap-[0.5em] overflow-hidden">
        <span className="transition-transform duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]">
          {children}
        </span>
        <Arrow className="transition-transform duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
      </span>
    </>
  );

  const cls = cx(
    "group relative inline-flex items-center gap-[0.9em] py-2",
    "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0",
    "after:bg-[var(--fg)] after:transition-transform after:duration-[--dur-med] after:ease-[cubic-bezier(0.16,1,0.3,1)]",
    "hover:after:scale-x-100 focus-visible:after:scale-x-100",
    sizes[size],
    className
  );

  if (!href) {
    return (
      <span className={cx("inline-flex items-center gap-[0.9em] py-2 opacity-45", sizes[size], className)}>
        {index && <span className="micro shrink-0">{index}</span>}
        <span>{children}</span>
        <span className="micro">— coming soon</span>
      </span>
    );
  }

  if (isExternal) {
    return (
      <a
        href={href}
        className={cls}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
        aria-label={ariaLabel}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {inner}
    </Link>
  );
}

/**
 * The primary call to action. A rectangular field whose background wipes in
 * from the left and swaps the text colour — no pill, no fill by default.
 */
export function ActionLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useMagnetic<HTMLAnchorElement>(8);
  const isExternal = /^(https?:|mailto:)/.test(href);

  const cls = cx(
    "group relative inline-flex items-center gap-[1.2em] overflow-hidden",
    "border border-[color:var(--line)] px-[clamp(20px,2.4vw,36px)] py-[clamp(14px,1.4vw,20px)]",
    "micro !text-[clamp(11px,0.85vw,13px)] transition-colors duration-[--dur-med]",
    "hover:!text-[#06201d] focus-visible:!text-[#06201d]",
    className
  );

  const inner = (
    <>
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 transition-transform duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        style={{ background: "var(--accent)" }}
      />
      <span className="relative">{children}</span>
      <Arrow className="relative transition-transform duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
    </>
  );

  if (isExternal) {
    return (
      <a ref={ref} href={href} className={cls} target="_blank" rel="noreferrer noopener">
        {inner}
      </a>
    );
  }
  return (
    <Link ref={ref} href={href} className={cls}>
      {inner}
    </Link>
  );
}
