import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Fragment } from "react";

import type { Architecture } from "@/lib/case-studies";

/**
 * A left-to-right system diagram: each lane is one stage of the platform,
 * arrows show the direction of delivery or data. Stacks vertically on small
 * screens.
 */
export function ArchitectureDiagram({
  architecture,
  label,
  feedbackLabel,
}: {
  architecture: Architecture;
  label: string;
  feedbackLabel: string;
}): ReactNode {
  const { lanes, feedback, note } = architecture;
  const columns = lanes.map(() => "minmax(0,1fr)").join(" 2rem ");

  return (
    <figure className="rounded-4xl border border-foreground/8 bg-background p-1.5 shadow-sm">
      <div className="relative overflow-hidden rounded-[1.6rem] border border-foreground/5 bg-foreground/2 p-4 sm:p-6 dark:bg-foreground/4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-foreground/8"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <div
          role="list"
          aria-label={label}
          className="relative flex flex-col gap-2 lg:grid lg:[grid-template-columns:var(--arch-cols)] lg:gap-0"
          style={{ "--arch-cols": columns } as CSSProperties}
        >
          {lanes.map((lane, i) => (
            <Fragment key={lane.title}>
              <div
                role="listitem"
                className="flex flex-col gap-2.5 rounded-2xl border border-foreground/8 bg-background p-3 shadow-[0_1px_2px_rgb(0_0_0/0.04)]"
              >
                <span className="flex items-center gap-2 font-mono text-[10.5px] tracking-tight text-foreground/50 uppercase">
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-foreground/6 px-1 text-[9.5px] text-foreground/60">
                    {i + 1}
                  </span>
                  {lane.title}
                </span>
                <ul className="flex flex-row flex-wrap gap-1.5 lg:flex-col">
                  {lane.nodes.map((node) => (
                    <li
                      key={node}
                      className="rounded-lg border border-foreground/8 bg-foreground/2 px-2.5 py-1.5 font-mono text-[12px] leading-tight tracking-tight text-foreground/80 dark:bg-foreground/4"
                    >
                      {node}
                    </li>
                  ))}
                </ul>
              </div>
              {i < lanes.length - 1 ? (
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center py-0.5 text-foreground/35 lg:py-0"
                >
                  <ArrowDown className="h-4 w-4 lg:hidden" />
                  <ArrowRight className="hidden h-4 w-4 lg:block" />
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>

        {feedback ? (
          <p className="relative mt-5 flex items-start gap-2.5 font-mono text-[12px] leading-[1.5] tracking-tight text-foreground/60">
            <RotateCcw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--signal)]" aria-hidden="true" />
            <span>
              <span className="text-foreground/40">{feedbackLabel}: </span>
              {feedback}
            </span>
          </p>
        ) : null}
        {note ? (
          <p className="relative mt-2 font-mono text-[11.5px] leading-[1.5] tracking-tight text-foreground/45">
            {note}
          </p>
        ) : null}
      </div>
    </figure>
  );
}
