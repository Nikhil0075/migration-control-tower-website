/** Number formatting shared by the counter and the metric tables. */

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Two-digit index used throughout the editorial metadata. */
export function pad(n: number): string {
  return String(n).padStart(2, "0");
}
