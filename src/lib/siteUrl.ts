/**
 * The canonical origin for this deployment, with no trailing slash.
 *
 * Resolved rather than hardcoded so the same code is correct everywhere:
 *
 *  1. NEXT_PUBLIC_SITE_URL — set this once a custom domain exists, and it wins.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel at build time and
 *     always the *production* domain, even when a preview build is running, so
 *     previews never advertise themselves as canonical.
 *  3. localhost, for local development.
 *
 * Used for metadataBase, the sitemap and robots.txt — anywhere an absolute URL
 * has to be emitted.
 */
const fromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3300");

export const siteUrl = fromEnv.replace(/\/+$/, "");
