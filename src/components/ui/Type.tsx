"use client";

import { cx, escapeHtml } from "@/lib/cx";
import { useSplitLines } from "@/hooks/useSplitLines";
import { useReveal } from "@/hooks/useReveal";

/* ------------------------------------------------------- section metadata -- */

/**
 * The small identifier that sits above every section headline. The dramatic
 * scale gap between this and the headline is the point — see the brief's
 * "section identifier" rule.
 */
export function SectionIndex({
  id,
  label,
  className,
}: {
  id: string;
  label: string;
  className?: string;
}) {
  return (
    <p className={cx("micro flex items-baseline gap-3", className)}>
      <span style={{ color: "var(--accent)" }}>{id}</span>
      <span aria-hidden className="inline-block h-px w-8 translate-y-[-3px]" style={{ background: "var(--line)" }} />
      <span>{label}</span>
    </p>
  );
}

/* -------------------------------------------------------------- headings -- */

type SplitHeadingProps = {
  children: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  immediate?: boolean;
  delay?: number;
  id?: string;
};

/**
 * A heading whose lines rise out of overflow masks.
 *
 * The text is injected rather than rendered as React children on purpose:
 * SplitType replaces the heading's text node with per-line elements and later
 * restores it via innerHTML. If React owned that text node it would still hold a
 * reference to the original after the restore, and unmounting the heading would
 * throw "removeChild: the node to be removed is not a child of this node".
 * Handing React an opaque subtree removes the conflict entirely.
 */
export function SplitHeading({
  children,
  as: Tag = "h2",
  className,
  immediate = false,
  delay = 0,
  id,
}: SplitHeadingProps) {
  const ref = useSplitLines<HTMLHeadingElement>({ immediate, delay });
  return (
    <Tag
      id={id}
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: escapeHtml(children) }}
    />
  );
}

/* ------------------------------------------------------------ containers -- */

type RevealTag = "div" | "section" | "ul" | "ol" | "dl";

/** Wraps a block so every [data-reveal] child animates in together. */
export function Reveal({
  children,
  className,
  stagger,
  as: Tag = "div",
  start,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  start?: string;
  as?: RevealTag;
}) {
  const ref = useReveal<HTMLElement>({ stagger, start });
  // One hook drives several container elements; the ref is structurally the same
  // HTMLElement in every case, so the tag union is narrowed here rather than
  // making the whole component generic.
  const Component = Tag as "div";
  return (
    <Component ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </Component>
  );
}

/** A hairline divider. Rows separated by 1px lines, never boxed in cards. */
export function Rule({ className }: { className?: string }) {
  return <hr className={cx("rule", className)} />;
}
