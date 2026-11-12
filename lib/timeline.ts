import type { Lang } from "./i18n";

/**
 * Everything on the timeline, by month ("YYYY-MM", both ends included).
 * Dates come from Islem; an entry marked `approx` only has a year.
 */
export type TimelineKind = "study" | "work" | "project";

export type TimelineEntry = {
  id: string;
  kind: TimelineKind;
  start: string;
  end: string;
  /** Only the year is known: drawn dashed over that year. */
  approx?: boolean;
  label: Record<Lang, string>;
  /** For projects: the project slug. For work: the project built there. */
  slug?: string;
  /** For projects: the internship it came from. */
  parent?: string;
  milestones?: { month: string; label: Record<Lang, string> }[];
};

/** The month the content was last brought up to date: the "today" line. */
export const AS_OF = "2026-11";

/** The visible range of the month axis. */
export const AXIS_START = "2024-01";
export const AXIS_END = "2027-06";

export const TIMELINE: TimelineEntry[] = [
  {
    id: "isitcom",
    kind: "study",
    start: "2021-09",
    end: "2024-07",
    label: { en: "ISITCOM · Bachelor in CS · 2021–2024", fr: "ISITCOM · Licence en informatique · 2021–2024" },
    milestones: [{ month: "2024-07", label: { en: "Diploma", fr: "Diplôme" } }],
  },
  {
    id: "esprit",
    kind: "study",
    start: "2024-09",
    end: "2027-06",
    label: {
      en: "ESPRIT · Engineering, Cloud & DevOps · 2024–2027",
      fr: "ESPRIT · Ingénieur Cloud & DevOps · 2024–2027",
    },
  },
  {
    id: "abajim",
    kind: "work",
    start: "2024-02",
    end: "2024-06",
    label: { en: "Abajim", fr: "Abajim" },
    slug: "readdly",
  },
  {
    id: "al-idhafa",
    kind: "work",
    start: "2025-07",
    end: "2025-08",
    label: { en: "Al Idhafa Group", fr: "Al Idhafa Group" },
    slug: "carnova",
  },
  {
    id: "verdustry",
    kind: "work",
    start: "2026-07",
    end: "2026-08",
    label: { en: "Verdustry", fr: "Verdustry" },
    slug: "verdustry-social",
  },
  { id: "readdly", kind: "project", start: "2024-02", end: "2024-06", slug: "readdly", parent: "abajim", label: { en: "Readdly", fr: "Readdly" } },
  { id: "sabeel", kind: "project", start: "2025-01", end: "2025-04", slug: "sabeel", label: { en: "Sabeel", fr: "Sabeel" } },
  { id: "carnova", kind: "project", start: "2025-07", end: "2025-08", slug: "carnova", parent: "al-idhafa", label: { en: "Carnova", fr: "Carnova" } },
  { id: "automotive-ml", kind: "project", start: "2025-10", end: "2025-12", slug: "automotive-ml", label: { en: "Automotive ML", fr: "Automotive ML" } },
  { id: "cityvoice", kind: "project", start: "2025-10", end: "2026-04", slug: "cityvoice", label: { en: "CityVoice", fr: "CityVoice" } },
  { id: "dawrek", kind: "project", start: "2026-01", end: "2026-12", approx: true, slug: "dawrek", label: { en: "Dawrek", fr: "Dawrek" } },
  { id: "devops-observability-platform", kind: "project", start: "2026-06", end: "2026-08", slug: "devops-observability-platform", label: { en: "Observability", fr: "Observability" } },
  { id: "verdustry-social", kind: "project", start: "2026-07", end: "2026-08", slug: "verdustry-social", parent: "verdustry", label: { en: "Verdustry Social", fr: "Verdustry Social" } },
  { id: "gitops-eks-platform", kind: "project", start: "2026-09", end: "2026-10", slug: "gitops-eks-platform", label: { en: "GitOps EKS", fr: "GitOps EKS" } },
];

/** Months since January of year 0, so months can be subtracted. */
export function monthIndex(month: string): number {
  const [y = "0", m = "1"] = month.split("-");
  return Number(y) * 12 + Number(m) - 1;
}

const MONTHS: Record<Lang, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
};

function monthName(month: string, lang: Lang): string {
  return MONTHS[lang][monthIndex(month) % 12] ?? "";
}

/** "Jul – Aug 2025", "Oct 2025 – Apr 2026", or just "2026" when only the year is known. */
export function periodOf(entry: TimelineEntry, lang: Lang): string {
  const [sy] = entry.start.split("-");
  const [ey] = entry.end.split("-");
  if (entry.approx) return sy ?? "";
  if (entry.start === entry.end) return `${monthName(entry.start, lang)} ${sy}`;
  return sy === ey
    ? `${monthName(entry.start, lang)} – ${monthName(entry.end, lang)} ${ey}`
    : `${monthName(entry.start, lang)} ${sy} – ${monthName(entry.end, lang)} ${ey}`;
}

/** The months of `entry` that fall in `year`, as "Jul – Aug" or "from Oct". */
function monthsIn(entry: TimelineEntry, year: number, lang: Lang): string {
  if (entry.approx) return "";
  const from = Math.max(monthIndex(entry.start), year * 12);
  const to = Math.min(monthIndex(entry.end), year * 12 + 11);
  const name = (i: number): string => MONTHS[lang][i % 12] ?? "";
  const startsBefore = monthIndex(entry.start) < year * 12;
  const endsAfter = monthIndex(entry.end) > year * 12 + 11;
  if (startsBefore && endsAfter) return lang === "fr" ? "toute l’année" : "all year";
  if (startsBefore) return lang === "fr" ? `jusqu’en ${name(to)}` : `until ${name(to)}`;
  if (endsAfter) return lang === "fr" ? `dès ${name(from)}` : `from ${name(from)}`;
  return from === to ? name(from) : `${name(from)} – ${name(to)}`;
}

export function inYear(entry: TimelineEntry, year: number): boolean {
  return monthIndex(entry.start) <= year * 12 + 11 && monthIndex(entry.end) >= year * 12;
}

/** Project slugs in time order, for Earlier / Later in the case study. */
export function chronological(): string[] {
  return TIMELINE.filter((e) => e.kind === "project" && e.slug)
    .sort((a, b) => monthIndex(a.start) - monthIndex(b.start) || monthIndex(a.end) - monthIndex(b.end))
    .map((e) => e.slug as string);
}

export function entryForProject(slug: string): TimelineEntry | undefined {
  return TIMELINE.find((e) => e.kind === "project" && e.slug === slug);
}

const FIRST_YEAR = 2021;

/** The chat's answer to "what did you do in 2025?", or undefined for a year with nothing in it. */
export function yearSummary(
  year: number,
  lang: Lang,
  names: Record<string, string>,
): { text: string; slugs: string[] } | undefined {
  if (year < FIRST_YEAR || year > monthIndex(AXIS_END) / 12) return undefined;
  const fr = lang === "fr";
  const hits = TIMELINE.filter((e) => inYear(e, year));
  const describe = (e: TimelineEntry): string => {
    const months = monthsIn(e, year, lang);
    const name = e.slug && e.kind === "project" ? (names[e.slug] ?? e.label[lang]) : e.label[lang];
    return months ? `${name} (${months})` : name;
  };
  const work = hits.filter((e) => e.kind === "work");
  const projects = hits.filter((e) => e.kind === "project");
  const studies = hits.filter((e) => e.kind === "study");
  const parts: string[] = [];
  if (year === 2021) parts.push(fr ? "Baccalauréat en sciences mathématiques au Lycée El Manar." : "Baccalauréat in mathematics at Lycée El Manar.");
  if (studies.length > 0) {
    const list = studies.map((e) => e.label[lang].split(" · ").slice(0, 2).join(", ")).join(fr ? ", puis " : ", then ");
    parts.push(fr ? `Études : ${list}.` : `Studies: ${list}.`);
  }
  if (work.length > 0) {
    parts.push(
      fr
        ? `Stage : ${work.map(describe).join(", ")}.`
        : `${work.length > 1 ? "Internships" : "Internship"}: ${work.map(describe).join(", ")}.`,
    );
  }
  if (projects.length > 0) {
    parts.push(fr ? `Projets : ${projects.map(describe).join(", ")}.` : `Projects: ${projects.map(describe).join(", ")}.`);
  } else {
    parts.push(fr ? "Pas encore de projet sur la carte cette année-là." : "No project on the map from that year.");
  }
  if (year === Math.floor(monthIndex(AXIS_END) / 12) && year > Math.floor(monthIndex(AS_OF) / 12)) {
    parts.push(fr ? "Diplôme d’ingénieur prévu, après le stage PFE." : "Engineering degree expected, after the PFE internship.");
  }
  return {
    text: `${year} · ${parts.join(" ")}`,
    slugs: projects.map((e) => e.slug as string),
  };
}
