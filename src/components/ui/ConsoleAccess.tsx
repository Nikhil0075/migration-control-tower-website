"use client";

import { useState } from "react";
import { links, consoleDemo } from "@/data/site";
import { ActionLink } from "@/components/ui/AnimatedLink";

/**
 * Shared demo access to the running console.
 *
 * Published deliberately so a reviewer can open the live system without being
 * provisioned an account. Rendered as plain selectable text with copy buttons
 * rather than hidden behind a request form — the point is that it takes one
 * click to get in.
 */
export function ConsoleAccess({ className }: { className?: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied((c) => (c === label ? null : c)), 1600);
    } catch {
      /* clipboard blocked — the value is selectable on screen regardless */
    }
  };

  const rows: { label: string; value: string; copyable: boolean }[] = [
    { label: "Email", value: consoleDemo.email, copyable: true },
    { label: "Password", value: consoleDemo.password, copyable: true },
    { label: "Access", value: consoleDemo.roles, copyable: false },
  ];

  return (
    <div className={className}>
      <p className="micro mb-[var(--space-sm)]" style={{ color: "var(--accent)" }}>
        Open the live console
      </p>

      <p className="body max-w-[54ch] !text-[var(--t-small)]">
        The deployed system is running and open to anyone reviewing this project.
        Sign in with the shared demo account below — no request, no provisioning.
      </p>

      <dl className="mt-[var(--space-md)]">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t py-[var(--space-sm)]"
            style={{ borderColor: "var(--line)" }}
          >
            <dt className="micro w-[9ch] shrink-0">{r.label}</dt>
            <dd className="min-w-0 flex-1">
              <span className="body select-all break-words !text-[var(--t-small)] !text-[color:var(--fg)]">
                {r.value}
              </span>
            </dd>
            {r.copyable && (
              <button
                type="button"
                data-tap
                onClick={() => copy(r.label, r.value)}
                className="micro shrink-0 transition-opacity duration-[--dur-fast] hover:opacity-60"
                aria-label={`Copy ${r.label.toLowerCase()}`}
              >
                {copied === r.label ? (
                  <span style={{ color: "var(--accent)" }}>Copied</span>
                ) : (
                  "Copy"
                )}
              </button>
            )}
          </div>
        ))}
      </dl>

      <div className="mt-[var(--space-md)]">
        <ActionLink href={links.console}>Launch the console</ActionLink>
      </div>

      <p className="micro mt-[var(--space-md)] max-w-[62ch] !normal-case !tracking-normal">
        Shared demo account, scoped to the demonstration estate. Please do not
        put anything confidential into it.
      </p>
    </div>
  );
}
