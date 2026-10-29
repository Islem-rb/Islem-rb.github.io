import Script from "next/script";
import type { ReactNode } from "react";

/**
 * Cloudflare Web Analytics: free, cookieless, no consent banner needed.
 * Only loads when NEXT_PUBLIC_CF_ANALYTICS_TOKEN is set at build time.
 */
export function Analytics(): ReactNode {
  const token = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  if (!token) return null;
  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
      strategy="afterInteractive"
      defer
    />
  );
}
