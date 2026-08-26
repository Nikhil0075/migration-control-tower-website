import { cx } from "@/lib/cx";

/**
 * A section is a line, metadata, a large title and its content — deliberately
 * not a card. `surface` flips the whole token set for light editorial passages.
 */
export function Section({
  children,
  surface = "dark",
  className,
  id,
  label,
  bleed = false,
}: {
  children: React.ReactNode;
  surface?: "dark" | "paper";
  className?: string;
  id?: string;
  label?: string;
  /** Skip the horizontal gutter — for full-bleed media. */
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      data-surface={surface}
      className={cx("relative py-[var(--space-xl)]", !bleed && "shell", className)}
    >
      {children}
    </section>
  );
}
