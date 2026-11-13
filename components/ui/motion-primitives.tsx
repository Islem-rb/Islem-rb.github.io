import type { ReactNode } from "react";

/** Fades its content up on page load, in CSS, so it never waits for JavaScript. */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  className,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}): ReactNode {
  return (
    <div
      className={`fade-in ${className ?? ""}`}
      style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
    >
      {children}
    </div>
  );
}
