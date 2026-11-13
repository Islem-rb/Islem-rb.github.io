import type { ReactNode } from "react";

import type { Project } from "@/lib/content";

const W = 640;
const H = 360;

/**
 * A cover for projects without a screenshot: the project's own delivery path
 * (its `flow`), drawn left to right in its category colour on chart paper.
 */
export function FlowCover({ project, className = "" }: { project: Project; className?: string }): ReactNode {
  const steps = project.flow;
  const n = steps.length;
  const left = 84;
  const right = W - 84;
  const points = steps.map((label, i) => {
    const x = n > 1 ? left + (i * (right - left)) / (n - 1) : W / 2;
    // A gentle zigzag so long names never touch their neighbours.
    const y = H / 2 + (n > 3 ? (i % 2 === 0 ? -40 : 40) : 0);
    return { label, x, y, above: n > 3 ? i % 2 === 0 : true };
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
      style={{ backgroundColor: "color-mix(in srgb, var(--c) 7%, var(--background))" }}
    >
      <defs>
        <pattern id={`grid-${project.slug}`} width="32" height="32" patternUnits="userSpaceOnUse">
          <path
            d="M32 0H0V32"
            fill="none"
            stroke="color-mix(in srgb, var(--c) 16%, transparent)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#grid-${project.slug})`} />
      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke="var(--c)"
        strokeWidth="2"
        strokeDasharray="5 6"
        strokeLinejoin="round"
      />
      {points.map((p, i) => {
        const width = p.label.length * 11.6 + 28;
        const boxY = p.above ? p.y - 64 : p.y + 20;
        const boxX = Math.min(Math.max(p.x - width / 2, 14), W - 14 - width);
        return (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r={i === n - 1 ? 10 : 8} fill="var(--c)" />
            {i === n - 1 ? (
              <circle cx={p.x} cy={p.y} r={18} fill="none" stroke="var(--c)" strokeWidth="2" />
            ) : null}
            <rect
              x={boxX}
              y={boxY}
              width={width}
              height={44}
              rx={4}
              fill="var(--surface)"
              stroke="var(--border)"
            />
            <text
              x={boxX + width / 2}
              y={boxY + 29}
              textAnchor="middle"
              fontSize="20"
              fill="var(--foreground)"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
