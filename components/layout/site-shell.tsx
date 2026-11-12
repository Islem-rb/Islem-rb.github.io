import { Analytics } from "@/components/layout/analytics";
import { Nav } from "@/components/layout/nav";
import { Providers } from "@/components/layout/providers";
import { SkipToContent } from "@/components/layout/skip-to-content";
import type { Lang } from "@/lib/i18n";
import type { Viewport } from "next";
import { Bricolage_Grotesque, Geist_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "@/app/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

/** Font CSS variables, shared with app/global-not-found.tsx. */
export const fontVariables = `${inter.variable} ${geistMono.variable} ${bricolage.variable}`;

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0f12" },
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
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
