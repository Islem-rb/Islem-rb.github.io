"use client";

import { Maximize2, X } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import {
  CATEGORIES,
  categoryOf,
  mapLabel,
  MAP_TOOLS,
  toolsOf,
  type Category,
} from "@/lib/chat/map";
import { getProjects, profile, type Project } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";

export type MapMode = "map" | "time";
/** What is lit: some projects, and the ring tools their lines should reach. */
export type MapFocus = { slugs: string[]; tools: string[] };

const CENTER = 300;
const R_PROJECT = 132;
const R_TOOL = 276;
const R_FACE = 46;
const ROW = 82;

/** Rounded so the server and the browser always print the same coordinates. */
const round = (n: number): number => Math.round(n * 100) / 100;

function polar(radius: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [
    round(CENTER + radius * Math.cos(rad)),
    round(CENTER + radius * Math.sin(rad)),
  ];
}

/** Where a label sits relative to its point: pushed outwards along `deg`. */
function labelAt(deg: number, gap: number) {
  const cos = Math.cos((deg * Math.PI) / 180);
  const sin = Math.sin((deg * Math.PI) / 180);
  const anchor = Math.abs(cos) < 0.3 ? "middle" : cos > 0 ? "start" : "end";
  return { x: round(cos * gap), y: round(sin * gap + 5), textAnchor: anchor } as const;
}

type Placed = {
  project: Project;
  category: Category;
  tools: string[];
  deg: number;
  ring: [number, number];
  time: [number, number];
};

function layout(projects: Project[]) {
  const years = [
    ...new Set(projects.flatMap((p) => p.year.match(/\d{4}/g) ?? [])),
  ].sort();
  const yearX = (year: string): number =>
    30 + years.indexOf(year) * (years.length > 1 ? 406 / (years.length - 1) : 0);

  // Timeline: one column per year, projects stacked inside it. A project that
  // spans two years sits between the columns, and between two rows of the
  // later column so its label never runs into a point there.
  const groups = new Map<string, Project[]>();
  for (const p of projects) groups.set(p.year, [...(groups.get(p.year) ?? []), p]);
  const time = new Map<string, [number, number]>();
  for (const [year, group] of groups) {
    const [from = "", to] = year.match(/\d{4}/g) ?? [];
    const x = to ? (yearX(from) + yearX(to)) / 2 - 2 : yearX(from);
    group.forEach((p, i) => {
      const beside = to ? (groups.get(to)?.length ?? 0) : 0;
      const y = 330 + (i - (group.length - 1) / 2) * ROW + (beside % 2 === 1 ? ROW / 2 : 0);
      time.set(p.slug, [round(x), round(y)]);
    });
  }

  const placed: Placed[] = projects.map((project, i) => {
    const deg = (i * 360) / projects.length - 90;
    return {
      project,
      category: categoryOf(project.slug),
      tools: toolsOf(project),
      deg,
      ring: polar(R_PROJECT, deg),
      time: time.get(project.slug) ?? [0, 0],
    };
  });

  const step = 360 / MAP_TOOLS.length;
  const tools = MAP_TOOLS.map((name, i) => {
    const deg = i * step - 90 - step / 2;
    return { name, deg, xy: polar(R_TOOL, deg) };
  });

  return { placed, tools, years: years.map((y) => ({ year: y, x: round(yearX(y)) })) };
}

function subscribeNarrow(callback: () => void): () => void {
  const query = window.matchMedia("(max-width: 1023px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/** On a phone the tool names are hidden until lit, so the map can use the full width. */
function useNarrow(): boolean {
  return useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia("(max-width: 1023px)").matches,
    () => false,
  );
}

function activate(run: () => void) {
  return (event: KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      run();
    }
  };
}

const PILL =
  "focus-ring inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground";

export function ProjectMap({
  lang,
  mode,
  focus,
  category,
  onMode,
  onProject,
  onTool,
  onCategory,
  zoomTo,
}: {
  lang: Lang;
  mode: MapMode;
  focus: MapFocus | null;
  category: Category | null;
  onMode: (mode: MapMode) => void;
  onProject: (slug: string) => void;
  onTool: (tool: string) => void;
  onCategory: (category: Category) => void;
  /** A project whose case study is open: the map leans in toward it. */
  zoomTo?: string | null | undefined;
}): ReactNode {
  const t = getDictionary(lang).map;
  const narrow = useNarrow();
  // On a phone the map can open full screen, wider than the screen, to pan around.
  const [full, setFull] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isFull = full && narrow;

  useEffect(() => {
    if (!isFull) return;
    const box = scrollRef.current;
    if (box) box.scrollLeft = (box.scrollWidth - box.clientWidth) / 2;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (event: globalThis.KeyboardEvent): void => {
      if (event.key === "Escape") setFull(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isFull]);

  // Picking something closes full screen, so the answer is in view.
  const pick =
    <T,>(run: (value: T) => void) =>
    (value: T): void => {
      setFull(false);
      run(value);
    };
  const goProject = pick(onProject);
  const goTool = pick(onTool);
  const goCategory = pick(onCategory);

  const { placed, tools, years } = useMemo(() => layout(getProjects(lang)), [lang]);

  const viewBox = narrow && !isFull ? "-45 5 690 590" : "-110 -10 820 620";
  const viewMin = viewBox.split(" ").map(Number) as [number, number];
  // Scale around the point halfway between the project and the centre, so both stay in view.
  const target = mode === "map" && !isFull ? placed.find((p) => p.project.slug === zoomTo) : undefined;
  const zoomStyle: CSSProperties | undefined = target
    ? {
        // SVG transform origins are measured from the viewBox corner, not from 0,0.
        transformOrigin: `${(target.ring[0] + CENTER) / 2 - viewMin[0]}px ${
          (target.ring[1] + CENTER) / 2 - viewMin[1]
        }px`,
        transform: "scale(1.16)",
      }
    : undefined;

  const litProjects = new Set(focus?.slugs);
  const litTools = new Set(focus?.tools);
  const focused = litProjects.size > 0 || litTools.size > 0;

  return (
    <figure
      className={`pmap ${mode === "time" ? "time" : ""} ${focused ? "focus" : ""} ${
        isFull ? "pmap-full fixed inset-0 z-[70] flex flex-col bg-background" : ""
      } ${target ? "zoomed" : ""}`}
      role={isFull ? "dialog" : undefined}
      aria-modal={isFull ? true : undefined}
      aria-label={isFull ? t.label : undefined}
      data-lenis-prevent={isFull ? "" : undefined}
    >
      <div
        className={`mb-1 flex items-center justify-end gap-2 ${
          isFull ? "border-b border-border px-4 py-3" : ""
        }`}
      >
        {narrow ? (
          <button
            type="button"
            onClick={() => setFull(!isFull)}
            className="focus-ring mr-auto inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 text-[13.5px] font-medium text-foreground"
          >
            {isFull ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            )}
            {isFull ? t.close : t.expand}
          </button>
        ) : null}
        <div
          role="group"
          aria-label={t.layout}
          className="inline-flex gap-0.5 rounded-md border border-border bg-surface p-[3px]"
        >
          {(["map", "time"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => onMode(value)}
              className={`focus-ring cursor-pointer rounded-[4px] px-3.5 py-1.5 text-[13.5px] transition-colors ${
                mode === value
                  ? "bg-foreground text-background"
                  : "text-foreground/65 hover:text-foreground"
              }`}
            >
              {t.modes[value]}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className={isFull ? "flex flex-1 items-center overflow-auto overscroll-contain" : ""}
      >
      <svg
        viewBox={viewBox}
        role="group"
        aria-label={t.label}
        style={isFull ? { minWidth: 860, flexShrink: 0 } : undefined}
      >
        <defs>
          <clipPath id="pmap-face">
            <circle cx={CENTER} cy={CENTER} r={R_FACE} />
          </clipPath>
        </defs>

        <g className="pmap-axis" aria-hidden="true">
          {years.map(({ year, x }) => (
            <g key={year}>
              <text x={x} y={78}>{year}</text>
              <line x1={x} y1={100} x2={x} y2={560} />
            </g>
          ))}
        </g>

        <g className="pmap-zoom" style={zoomStyle}>
        {[R_TOOL, R_PROJECT, 60].map((r) => (
          <circle key={r} className="pmap-ring" cx={CENTER} cy={CENTER} r={r} />
        ))}

        <g aria-hidden="true">
          {placed.map(({ project, category: cat, tools: used, ring }) => {
            const style = { "--c": `var(--${cat})` } as CSSProperties;
            const lit = litProjects.has(project.slug);
            return (
              <g key={project.slug} style={style}>
                <line
                  className={`pmap-edge ${lit ? "on" : ""}`}
                  x1={CENTER}
                  y1={CENTER}
                  x2={ring[0]}
                  y2={ring[1]}
                />
                {used.map((name) => {
                  const tool = tools.find((entry) => entry.name === name);
                  if (!tool) return null;
                  return (
                    <line
                      key={name}
                      className={`pmap-edge ${lit && litTools.has(name) ? "on" : ""}`}
                      x1={ring[0]}
                      y1={ring[1]}
                      x2={tool.xy[0]}
                      y2={tool.xy[1]}
                    />
                  );
                })}
              </g>
            );
          })}
        </g>

        {tools.map(({ name, deg, xy }) => (
          <g
            key={name}
            role="button"
            tabIndex={mode === "time" ? -1 : 0}
            aria-label={t.tool(name)}
            className={`pmap-node tool ${litTools.has(name) ? "on" : ""}`}
            style={{ transform: `translate(${xy[0]}px, ${xy[1]}px)` }}
            onClick={() => goTool(name)}
            onKeyDown={activate(() => goTool(name))}
          >
            <circle className="dot" r={4.5} />
            <text className="lm" {...labelAt(deg, 14)}>{name}</text>
          </g>
        ))}

        {placed.map(({ project, category: cat, deg, ring, time }) => {
          const [x, y] = mode === "time" ? time : ring;
          const style = {
            "--c": `var(--${cat})`,
            transform: `translate(${x}px, ${y}px)`,
          } as CSSProperties;
          return (
            <g
              key={project.slug}
              role="button"
              tabIndex={0}
              aria-label={`${project.name}, ${project.kind}, ${project.year}`}
              className={`pmap-node ${litProjects.has(project.slug) ? "on" : ""}`}
              style={style}
              onClick={() => goProject(project.slug)}
              onKeyDown={activate(() => goProject(project.slug))}
            >
              <circle className="dot" r={12} />
              <text className="lm" {...labelAt(deg, 22)}>{mapLabel(project)}</text>
              <text className="lt" {...labelAt(0, 22)}>{mapLabel(project)}</text>
            </g>
          );
        })}

        <g className="pmap-core" aria-hidden="true">
          {(["light", "dark"] as const).map((theme) => (
            <image
              key={theme}
              href={profile.portrait[theme]}
              x={CENTER - R_FACE}
              y={CENTER - R_FACE - 2}
              width={R_FACE * 2}
              height={R_FACE * 2}
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#pmap-face)"
              className={theme === "light" ? "dark:hidden" : "hidden dark:block"}
            />
          ))}
          <circle cx={CENTER} cy={CENTER} r={R_FACE} />
        </g>
        </g>
      </svg>
      </div>

      <div className={`mt-1 flex flex-wrap justify-center gap-2 ${isFull ? "px-4 pb-4" : ""}`}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={category === cat}
            onClick={() => goCategory(cat)}
            className={`${PILL} ${category === cat ? "!border-[var(--c)] !text-foreground" : ""}`}
            style={{ "--c": `var(--${cat})` } as CSSProperties}
          >
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[var(--c)]" />
            {t.cats[cat]}
            <span className="text-[12px] text-muted-foreground">
              {placed.filter((entry) => entry.category === cat).length}
            </span>
          </button>
        ))}
      </div>
      <figcaption className={`mt-3 text-center text-[13px] text-muted-foreground ${isFull ? "hidden" : ""}`}>
        {t.captions[mode]}
      </figcaption>
    </figure>
  );
}
