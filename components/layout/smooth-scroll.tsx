"use client";

import { useEffect, type ReactNode } from "react";
import type Lenis from "lenis";
import { features } from "@/lib/config";

const LENIS_OPTIONS = {
  duration: 1.6,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
};

export function SmoothScroll({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  useEffect(() => {
    if (!features.smoothScroll) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // Loaded after first paint, so smooth scrolling never delays the page.
    let lenis: Lenis | undefined;
    let rafId = 0;
    let cancelled = false;

    function raf(time: number): void {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    function handleAnchorClick(e: MouseEvent): void {
      if (!lenis) return;
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const element = document.querySelector(href);
      if (!element) return;

      e.preventDefault();
      lenis.scrollTo(element as HTMLElement, { offset: -100 });
    }

    void import("lenis").then(({ default: LenisClass }) => {
      if (cancelled) return;
      lenis = new LenisClass(LENIS_OPTIONS);
      rafId = requestAnimationFrame(raf);
      document.addEventListener("click", handleAnchorClick);
    });

    return () => {
      cancelled = true;
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
