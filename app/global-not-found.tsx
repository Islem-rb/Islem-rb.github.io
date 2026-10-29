import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { Providers } from "@/components/layout/providers";
import { fontVariables } from "@/components/layout/site-shell";
import { NotFoundContent } from "@/components/pages/not-found-content";

export const metadata: Metadata = {
  title: "404 · Islem Rebhi",
  robots: { index: false, follow: false },
};

// The site has two root layouts (English and French), so the 404 page
// renders its own <html> document.
export default function GlobalNotFound(): ReactNode {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontVariables} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <Providers>
          <NotFoundContent />
        </Providers>
      </body>
    </html>
  );
}
