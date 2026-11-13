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
    <figure className="sheet p-4 sm:p-6">
      <div
        role="list"
        aria-label={label}
        className="flex flex-col gap-2 lg:grid lg:[grid-template-columns:var(--arch-cols)] lg:gap-0"
        style={{ "--arch-cols": columns } as CSSProperties}
      >
        {lanes.map((lane, i) => (
          <Fragment key={lane.title}>
            <div
              role="listitem"
              className="flex flex-col gap-3 rounded-md border border-border bg-background p-3"
            >
              <span className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                <span className="font-serif text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {lane.title}
              </span>
              <ul className="flex flex-row flex-wrap gap-1.5 lg:flex-col">
                {lane.nodes.map((node) => (
                  <li
                    key={node}
                    className="rounded-sm border border-border bg-surface px-2.5 py-1.5 text-[13px] leading-tight text-foreground/85"
                  >
                    {node}
                  </li>
                ))}
              </ul>
            </div>
            {i < lanes.length - 1 ? (
              <div
                aria-hidden="true"
                className="flex items-center justify-center py-0.5 text-muted-foreground lg:py-0"
              >
                <ArrowDown className="h-4 w-4 lg:hidden" />
                <ArrowRight className="hidden h-4 w-4 lg:block" />
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>

      {feedback ? (
        <p className="mt-5 flex items-start gap-2.5 text-[14px] leading-normal text-foreground/75">
          <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-[var(--signal)]" aria-hidden="true" />
          <span>
            <span className="font-semibold text-foreground">{feedbackLabel}: </span>
            {feedback}
          </span>
        </p>
      ) : null}
      {note ? (
        <p className="mt-2 text-[13px] leading-normal text-muted-foreground">{note}</p>
      ) : null}
    </figure>
  );
}
