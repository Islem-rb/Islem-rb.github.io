"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore, type ReactNode } from "react";

import { profile } from "@/lib/content";
import { PortraitMorph } from "./portrait-morph";

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/**
 * The hero portrait, with a light and a dark version. Before hydration both
 * <img>s render and CSS picks one, so there is no flash of the wrong theme;
 * after mount the WebGL morph takes over with the current theme's pair.
 */
export function ThemedPortrait({ alt }: { alt: string }): ReactNode {
  const mounted = useIsMounted();
  const { resolvedTheme } = useTheme();

  if (!mounted || !resolvedTheme) {
    return (
      <div role="img" aria-label={alt} className="relative h-full w-full">
        <img
          src={profile.portrait.light}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover select-none dark:hidden"
        />
        <img
          src={profile.portrait.dark}
          alt=""
          draggable={false}
          className="absolute inset-0 hidden h-full w-full object-cover select-none dark:block"
        />
      </div>
    );
  }

  const theme = resolvedTheme === "dark" ? "dark" : "light";
  return (
    <PortraitMorph
      key={theme}
      srcA={profile.portrait[theme]}
      srcB={profile.portraitAlt[theme]}
      alt={alt}
    />
  );
}
