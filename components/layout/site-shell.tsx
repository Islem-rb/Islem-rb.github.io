import { Analytics } from "@/components/layout/analytics";
import { Nav } from "@/components/layout/nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Providers } from "@/components/layout/providers";
import { SkipToContent } from "@/components/layout/skip-to-content";
import type { Lang } from "@/lib/i18n";
import type { Viewport } from "next";
import { Archivo } from "next/font/google";
import type { ReactNode } from "react";
import "@/app/globals.css";

// One variable family: normal width for text, expanded for headings.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

/** Font CSS variables, shared with app/global-not-found.tsx. */
export const fontVariables = archivo.variable;

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eceee7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1420" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/** The <html> document shared by the English and French root layouts. */
export function SiteShell({
  lang,
  children,
}: Readonly<{
  lang: Lang;
  children: ReactNode;
}>): ReactNode {
  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${fontVariables} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <Providers>
          <SkipToContent lang={lang} />
          <Nav />
          {children}
          <SiteFooter lang={lang} />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
