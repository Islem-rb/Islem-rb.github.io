import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SiteShell, siteViewport } from "@/components/layout/site-shell";
import { baseMetadata } from "@/lib/metadata";

export const metadata: Metadata = baseMetadata("en");
export const viewport: Viewport = siteViewport;

export default function EnglishLayout({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  return <SiteShell lang="en">{children}</SiteShell>;
}
