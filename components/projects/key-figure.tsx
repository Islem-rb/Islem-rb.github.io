import type { ReactNode } from "react";

import type { Project } from "@/lib/content";

const SIZES = {
  sm: "text-[2.1rem] sm:text-[2.4rem]",
  md: "text-[2.5rem] sm:text-[2.9rem]",
  lg: "text-[2.6rem] sm:text-[3rem]",
} as const;

/** Highlights that only repeat the figure ("96 API endpoints" under a big 96). */
export function withoutFigure(project: Project): string[] {
  const value = project.figure?.value;
  return value ? project.highlights.filter((h) => !h.startsWith(`${value} `)) : project.highlights;
}

/** A project's headline number, set large like a figure on a spec sheet. */
export function KeyFigure({
  figure,
  size = "sm",
  className = "",
}: {
  figure: NonNullable<Project["figure"]>;
  size?: keyof typeof SIZES;
  className?: string;
}): ReactNode {
  return (
    <p className={`flex flex-col gap-1 ${className}`}>
      <span
        className={`font-serif leading-none font-semibold tracking-[-0.045em] whitespace-nowrap text-[var(--c)] tabular-nums ${SIZES[size]}`}
      >
        {figure.value}
      </span>
      <span className="text-[14px] leading-snug text-pretty text-muted-foreground">
        {figure.label}
      </span>
    </p>
  );
}
