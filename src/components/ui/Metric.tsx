"use client";

import { cx } from "@/lib/cx";
import { useCounter } from "@/hooks/useCounter";
import { claimLabel, type Metric as MetricData } from "@/data/metrics";
import { formatNumber } from "@/lib/format";

/**
 * A single editorial metric. The numeral is set large enough to occupy real
 * viewport width; the claim level sits beside it in mono, because the content
 * pack requires that evidence levels stay visible rather than being flattened
 * into an unqualified marketing number.
 */
export function Metric({
  metric,
  size = "lg",
  className,
}: {
  metric: MetricData;
  size?: "lg" | "md";
  className?: string;
}) {
  const ref = useCounter(metric.value, metric.decimals ?? 0);

  const scale =
    size === "lg"
      ? "text-[clamp(3.5rem,7.5vw,8rem)]"
      : "text-[clamp(2.5rem,4.5vw,4.5rem)]";

  return (
    <div className={cx("flex flex-col gap-[var(--space-xs)]", className)}>
      <p className={cx("numeral", scale)}>
        {metric.prefix}
        <span ref={ref}>{formatNumber(0, metric.decimals ?? 0)}</span>
        {metric.suffix}
      </p>
      <p className="h-sub !text-[clamp(1rem,1.35vw,1.4rem)] !leading-[1.15]">{metric.label}</p>
      <p className="micro mt-1">{claimLabel[metric.claim]}</p>
      <p className="body !text-[var(--t-small)] max-w-[42ch]">{metric.note}</p>
    </div>
  );
}

/** A row of metrics separated by hairlines rather than boxed into cards. */
export function MetricRow({
  metrics,
  className,
  size = "md",
}: {
  metrics: MetricData[];
  className?: string;
  size?: "lg" | "md";
}) {
  return (
    <ul className={cx("grid gap-x-[clamp(20px,2.4vw,44px)]", className)}>
      {metrics.map((m, i) => (
        <li
          key={m.label}
          data-reveal
          className="border-t pt-[var(--space-sm)]"
          style={{ borderColor: "var(--line)", transitionDelay: `${i * 40}ms` }}
        >
          <Metric metric={m} size={size} />
        </li>
      ))}
    </ul>
  );
}
