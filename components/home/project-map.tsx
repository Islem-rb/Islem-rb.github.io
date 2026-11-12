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
import { useReducedMotion } from "@/lib/motion";
import {
  AS_OF,
  AXIS_END,
  AXIS_START,
  inYear,
  monthIndex,
  periodOf,
  TIMELINE,
  type TimelineEntry,
} from "@/lib/timeline";

export type MapMode = "map" | "time";
/** What is lit: some projects, and the ring tools their lines should reach. */
export type MapFocus = { slugs: string[]; tools: string[]; year?: number | undefined };

const CENTER = 300;
const R_PROJECT = 132;
const R_TOOL = 276;
const R_FACE = 46;

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
  /** Timeline: where the bar starts, its width, and where its label sits. */
  time: [number, number];
  bar: number;
  approx: boolean;
  period: string;
  /** Projects from an internship sit right under it, with the label after the bar. */
  under: boolean;
};

/* Timeline geometry, in the same coordinates as the map. */
const X0 = -70;
const X1 = 690;
const SPAN = monthIndex(AXIS_END) - monthIndex(AXIS_START) + 1;
const PX = (X1 - X0) / SPAN;
const Y_TOP = 56;
const Y_BOTTOM = 560;
const Y_BAND = { study: 96, work: 238, project: 374 } as const;
const Y_STUDY = [132, 180];
const Y_WORK = 276;
const Y_UNDER = 314;
const Y_LANES = [412, 456, 500, 544];
/** Rough width of a project name at the timeline's label size. */
const labelWidth = (name: string): number => name.length * 10.4 + 4;

function monthX(month: string): number {
  const x = X0 + (monthIndex(month) - monthIndex(AXIS_START)) * PX;
  return round(Math.min(Math.max(x, X0), X1));
}

/** Where a bar from `start` to `end` (both months included) begins and ends. */
function span(entry: TimelineEntry): [number, number] {
  const to = Math.min(X0 + (monthIndex(entry.end) - monthIndex(AXIS_START) + 1) * PX, X1);
  return [monthX(entry.start), round(to)];
}

function layout(projects: Project[], lang: Lang) {
  // Projects without an internship share a few lanes, each new bar in the first
  // lane where neither it nor its label would touch the one before.
  const lanes: number[] = [];
  const time = new Map<string, { xy: [number, number]; bar: number; entry: TimelineEntry }>();
  const entries = TIMELINE.filter((e) => e.kind === "project").sort(
    (a, b) => monthIndex(a.start) - monthIndex(b.start),
  );
  for (const entry of entries) {
    const [from, to] = span(entry);
    let y = Y_UNDER;
    if (!entry.parent) {
      const reach = Math.max(to, from + labelWidth(entry.label[lang]));
      let lane = lanes.findIndex((busy) => busy + 14 <= from);
      if (lane === -1) lane = lanes.length;
      lanes[lane] = reach;
      y = Y_LANES[Math.min(lane, Y_LANES.length - 1)] ?? Y_UNDER;
    }
    time.set(entry.slug ?? entry.id, { xy: [from, y], bar: round(to - from), entry });
  }

  const placed: Placed[] = projects.map((project, i) => {
    const deg = (i * 360) / projects.length - 90;
    const slot = time.get(project.slug);
    return {
      project,
      category: categoryOf(project.slug),
      tools: toolsOf(project),
      deg,
      ring: polar(R_PROJECT, deg),
      time: slot?.xy ?? [X0, Y_LANES[0] ?? 0],
      bar: slot?.bar ?? 0,
      approx: Boolean(slot?.entry.approx),
      period: slot ? periodOf(slot.entry, lang) : project.year,
      under: Boolean(slot?.entry.parent),
    };
  });

  const step = 360 / MAP_TOOLS.length;
  const tools = MAP_TOOLS.map((name, i) => {
    const deg = i * step - 90 - step / 2;
    return { name, deg, xy: polar(R_TOOL, deg) };
  });

  const first = Math.floor(monthIndex(AXIS_START) / 12);
  const last = Math.floor(monthIndex(AXIS_END) / 12);
  const years = Array.from({ length: last - first + 1 }, (_, i) => first + i).map((year) => ({
    year,
    x: monthX(`${year}-01`),
    end: monthX(`${year + 1}-01`),
  }));
  const studies = TIMELINE.filter((e) => e.kind === "study").map((entry, i) => ({
    entry,
    span: span(entry),
    y: Y_STUDY[i] ?? Y_STUDY[0] ?? 0,
  }));
  const work = TIMELINE.filter((e) => e.kind === "work").map((entry) => ({
    entry,
    span: span(entry),
    period: periodOf(entry, lang),
  }));
  const today = round(span({ id: "", kind: "study", start: AS_OF, end: AS_OF, label: { en: "", fr: "" } })[1]);

  return { placed, tools, years, studies, work, today };
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

/** The zoom when a case study opens: same scale, point and easing as the first version. */
const ZOOM = 1.16;
const ZOOM_MS = 900;

/** cubic-bezier(0.22, 1, 0.36, 1), the site's easing, for animations driven from JS. */
function easeOut(x: number): number {
  const [x1, y1, x2, y2] = [0.22, 1, 0.36, 1];
  const bez = (t: number, a: number, b: number): number =>
    3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (bez(mid, x1, x2) < x) lo = mid;
    else hi = mid;
  }
  return bez((lo + hi) / 2, y1, y2);
}

/**
 * 0 → 1 while zooming in, back to 0 when zooming out. Driven from JS so the map,
 * the tools that slide inward and their lines all move on the same frame.
 */
function useZoomProgress(active: boolean, reduced: boolean): number {
  const [progress, setProgress] = useState(0);
  const current = useRef(0);
  useEffect(() => {
    const goal = active ? 1 : 0;
    const from = current.current;
    if (from === goal) return;
    // With reduced motion the first frame lands straight on the goal.
    const duration = reduced ? 0 : ZOOM_MS;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number): void => {
      const k = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      current.current = from + (goal - from) * easeOut(k);
      setProgress(current.current);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced]);
  return progress;
}

/**
 * Where a tool must sit (before the zoom) so that, once zoomed, its point and its
 * label are still inside the frame. Tools already inside keep their place.
 */
function keepInFrame(
  xy: [number, number],
  deg: number,
  name: string,
  origin: [number, number],
  viewBox: string,
  fontSize: number,
): [number, number] {
  const [vx = 0, vy = 0, vw = 1, vh = 1] = viewBox.split(" ").map(Number);
  const cos = Math.cos((deg * Math.PI) / 180);
  const sin = Math.sin((deg * Math.PI) / 180);
  const label = (name.length * fontSize * 0.66 + 18) * ZOOM;
  const side = Math.abs(cos) < 0.3 ? "middle" : cos > 0 ? "start" : "end";
  const left = side === "end" ? label : side === "middle" ? label / 2 : 10;
  const right = side === "start" ? label : side === "middle" ? label / 2 : 10;
  const top = (sin < -0.3 ? fontSize + 16 : 10) * ZOOM;
  const bottom = (sin > 0.3 ? fontSize + 20 : 10) * ZOOM;
  const zoomed = (i: 0 | 1): number => origin[i] + ZOOM * (xy[i] - origin[i]);
  const zx = Math.min(Math.max(zoomed(0), vx + left), vx + vw - right);
  const zy = Math.min(Math.max(zoomed(1), vy + top), vy + vh - bottom);
  return [origin[0] + (zx - origin[0]) / ZOOM, origin[1] + (zy - origin[1]) / ZOOM];
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
  /** A project whose case study is open: the map zooms toward it. */
  zoomTo?: string | null | undefined;
}): ReactNode {
  const t = getDictionary(lang).map;
  const narrow = useNarrow();
  const reduced = useReducedMotion();
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

  const { placed, tools, years, studies, work, today } = useMemo(
    () => layout(getProjects(lang), lang),
    [lang],
  );
  const timeline = mode === "time";
  // On a phone the timeline scrolls sideways, opening on today.
  const sideways = narrow && timeline && !isFull;
  useEffect(() => {
    const box = scrollRef.current;
    if (box && narrow && timeline) box.scrollLeft = box.scrollWidth;
  }, [narrow, timeline, isFull]);
  const nameOf = (slug: string | undefined): string =>
    placed.find((p) => p.project.slug === slug)?.project.name ?? "";

  const viewBox = narrow && !isFull && !timeline ? "-45 5 690 590" : "-110 -10 820 620";
  const litProjects = new Set(focus?.slugs);
  const litTools = new Set(focus?.tools);

  // Zoom toward the open project, around the point halfway between it and the centre.
  // Its tools that the zoom would push out of the frame slide inward instead.
  const target = mode === "map" && !isFull ? placed.find((p) => p.project.slug === zoomTo) : undefined;
  // Remember the last project so zooming back out starts from the same point.
  const [lastZoom, setLastZoom] = useState(target?.project.slug);
  if (target && target.project.slug !== lastZoom) setLastZoom(target.project.slug);
  const zoomOn = target ?? placed.find((p) => p.project.slug === lastZoom);
  const progress = useZoomProgress(Boolean(target), reduced);
  const scale = 1 + (ZOOM - 1) * progress;
  const origin: [number, number] = zoomOn
    ? [(zoomOn.ring[0] + CENTER) / 2, (zoomOn.ring[1] + CENTER) / 2]
    : [CENTER, CENTER];
  const zoomTransform =
    progress > 0
      ? `translate(${origin[0]} ${origin[1]}) scale(${scale}) translate(${-origin[0]} ${-origin[1]})`
      : undefined;
  const toolXY = new Map<string, [number, number]>(
    tools.map(({ name, deg, xy }): [string, [number, number]] => {
      if (!zoomOn || progress === 0 || !zoomOn.tools.includes(name)) return [name, xy];
      const safe = keepInFrame(xy, deg, name, origin, viewBox, narrow ? 17 : 12);
      return [name, [xy[0] + (safe[0] - xy[0]) * progress, xy[1] + (safe[1] - xy[1]) * progress]];
    }),
  );
  const year = focus?.year;
  const litEntry = (entry: TimelineEntry): boolean =>
    year !== undefined ? inYear(entry, year) : litProjects.has(entry.slug ?? "");
  const focused = litProjects.size > 0 || litTools.size > 0 || year !== undefined;

  return (
    <figure
      className={`pmap ${mode === "time" ? "time" : ""} ${focused ? "focus" : ""} ${
        isFull ? "pmap-full fixed inset-0 z-[70] flex flex-col bg-background" : ""
      } ${progress > 0 ? "zoomed" : ""}`}
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
        className={
          isFull
            ? "flex flex-1 items-center overflow-auto overscroll-contain"
            : sideways
              ? "overflow-x-auto overscroll-x-contain"
              : ""
        }
      >
      <svg
        viewBox={viewBox}
        role="group"
        aria-label={t.label}
        style={isFull ? { minWidth: 860, flexShrink: 0 } : sideways ? { minWidth: 760 } : undefined}
      >
        <defs>
          <clipPath id="pmap-face">
            <circle cx={CENTER} cy={CENTER} r={R_FACE} />
          </clipPath>
        </defs>

        <g className="pmap-tl">
          {year !== undefined ? (
            <rect
              className="tl-year"
              x={years.find((y) => y.year === year)?.x ?? X0}
              y={Y_TOP}
              width={Math.max(
                0,
                Math.min(years.find((y) => y.year === year)?.end ?? X0, X1) -
                  (years.find((y) => y.year === year)?.x ?? X0),
              )}
              height={Y_BOTTOM - Y_TOP}
            />
          ) : null}
          <g aria-hidden="true">
            {years.map(({ year: y, x }) => (
              <g key={y}>
                <line className="tl-tick" x1={x} y1={Y_TOP} x2={x} y2={Y_BOTTOM} />
                <text className="tl-yr" x={x + 6} y={44}>{y}</text>
              </g>
            ))}
            {(["study", "work", "project"] as const).map((band) => (
              <text key={band} className="tl-band" x={X0} y={Y_BAND[band]}>
                {t.bands[band]}
              </text>
            ))}
            <line className="tl-today" x1={today} y1={Y_TOP} x2={today} y2={Y_BOTTOM} />
            <text className="tl-today-label" x={today - 5} y={70} textAnchor="end">
              {t.today}
            </text>
          </g>

          {studies.map(({ entry, span: [from, to], y }) => (
            <g
              key={entry.id}
              className={`tl-item study ${litEntry(entry) ? "on" : ""}`}
              aria-hidden="true"
            >
              <text className="tl-label" x={from} y={y - 13}>{entry.label[lang]}</text>
              <rect x={from} y={y - 4} width={Math.max(0, Math.min(to, today) - from)} height={8} rx={4} />
              {to > today ? (
                <rect className="planned" x={today} y={y - 4} width={to - today} height={8} rx={4} />
              ) : null}
              {entry.milestones?.map((m) => {
                const mx = round(monthX(m.month) + PX / 2);
                return (
                  <g key={m.month}>
                    <path className="tl-flag" d={`M${mx} ${y - 6} l6 6 l-6 6 l-6 -6 z`} />
                    <text className="tl-note" x={mx + 12} y={y + 9}>
                      {m.label[lang]} · {periodOf({ ...entry, start: m.month, end: m.month }, lang)}
                    </text>
                  </g>
                );
              })}
            </g>
          ))}

          {work.map(({ entry, span: [from, to], period }) => {
            const project = placed.find((p) => p.project.slug === entry.slug);
            return (
              <g
                key={entry.id}
                role="button"
                tabIndex={timeline ? 0 : -1}
                aria-label={t.builtAt(entry.label[lang], period, nameOf(entry.slug))}
                className={`tl-item work ${litEntry(entry) ? "on" : ""}`}
                onClick={() => entry.slug && goProject(entry.slug)}
                onKeyDown={activate(() => entry.slug && goProject(entry.slug))}
              >
                <text className="tl-label" x={from} y={Y_WORK - 13}>{entry.label[lang]}</text>
                <rect x={from} y={Y_WORK - 5} width={to - from} height={10} rx={5} />
                {project ? (
                  <line
                    className="tl-link"
                    x1={from + 1.5}
                    y1={Y_WORK + 5}
                    x2={from + 1.5}
                    y2={Y_UNDER - 5}
                    style={{ "--c": `var(--${project.category})` } as CSSProperties}
                  />
                ) : null}
              </g>
            );
          })}
        </g>

        <g className="pmap-zoom" transform={zoomTransform}>
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
                      x2={(toolXY.get(name) ?? tool.xy)[0]}
                      y2={(toolXY.get(name) ?? tool.xy)[1]}
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
            tabIndex={timeline ? -1 : 0}
            aria-label={t.tool(name)}
            className={`pmap-node tool ${litTools.has(name) ? "on" : ""}`}
            style={{
              transform: `translate(${(toolXY.get(name) ?? xy)[0]}px, ${(toolXY.get(name) ?? xy)[1]}px)`,
            }}
            onClick={() => goTool(name)}
            onKeyDown={activate(() => goTool(name))}
          >
            <circle className="dot" r={4.5} />
            <text className="lm" {...labelAt(deg, 14)}>{name}</text>
          </g>
        ))}

        {placed.map(({ project, category: cat, deg, ring, time, bar, approx, period, under }) => {
          const [x, y] = timeline ? time : ring;
          const style = {
            "--c": `var(--${cat})`,
            transform: `translate(${x}px, ${y}px)`,
          } as CSSProperties;
          return (
            <g
              key={project.slug}
              role="button"
              tabIndex={0}
              aria-label={`${project.name}, ${project.kind}, ${timeline ? period : project.year}${
                timeline && approx ? ` (${t.yearOnly})` : ""
              }`}
              aria-pressed={zoomTo === project.slug}
              className={`pmap-node ${litProjects.has(project.slug) ? "on" : ""}`}
              style={style}
              onClick={() => goProject(project.slug)}
              onKeyDown={activate(() => goProject(project.slug))}
            >
              <rect className={`bar ${approx ? "approx" : ""}`} x={0} y={-5} width={bar} height={10} rx={5} />
              <circle className="dot" r={12} />
              <text className="lm" {...labelAt(deg, 22)}>{mapLabel(project)}</text>
              <text className="lt" x={under ? bar + 8 : 0} y={under ? 6 : -12}>
                {mapLabel(project)}
              </text>
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
