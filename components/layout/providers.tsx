"use client";

import { ReducedMotionProvider } from "@/lib/motion";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { LazyMotion } from "motion/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

// The animation engine arrives after first paint, so it never delays the page.
const loadMotion = () => import("@/lib/motion-features").then((mod) => mod.default);

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReducedMotionProvider>
        <LazyMotion features={loadMotion} strict>
          <SmoothScroll>{children}</SmoothScroll>
        </LazyMotion>
      </ReducedMotionProvider>
    </ThemeProvider>
  );
}
