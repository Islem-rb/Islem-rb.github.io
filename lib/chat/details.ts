import type { Project } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { entryForProject, periodOf, TIMELINE } from "@/lib/timeline";

import type { Answer } from "./types";

/** The things people ask about one project once they know which one. */
export type Detail = "live" | "source" | "when" | "team" | "role" | "result" | "tools" | "more";

/**
 * Normalised words and phrases for each detail, English then French. Checked in
 * this order, so "what did you do" (role) wins over "do" in anything later.
 */
const WORDS: [Detail, string[]][] = [
  ["team", ["alone", "solo", "by yourself", "on your own", "team", "teammates", "how many people", "how big", "equipe", "seul", "combien"]],
  ["role", ["role", "your part", "what did you do", "what was your", "responsible", "contribution", "ta part", "tu as fait quoi", "qu as tu fait", "ton role"]],
  ["live", ["live", "demo", "online", "try it", "deployed", "hosted", "url", "link", "en ligne", "tester", "lien"]],
  ["source", ["source", "code", "repo", "repository", "github", "depot"]],
  ["when", ["when", "how long", "dates", "duration", "what year", "which year", "quand", "combien de temps", "duree", "annee"]],
  ["result", ["result", "results", "outcome", "impact", "numbers", "metrics", "achieve", "achieved", "resultat", "resultats"]],
  ["tools", ["tools", "stack", "tech", "technologies", "built with", "made with", "languages", "outils", "technos"]],
  ["more", ["more", "details", "tell me more", "go on", "continue", "elaborate", "plus", "en savoir plus", "details", "la suite"]],
];

/** The detail a question asks for, if any. `norm` is already normalised. */
export function detailIn(norm: string): Detail | undefined {
  const padded = ` ${norm} `;
  return WORDS.find(([, words]) => words.some((w) => padded.includes(` ${w} `)))?.[0];
}

const TEXT = {
  en: {
    live: (name: string, url: string) => `Yes, ${name} has a live demo: ${url}`,
    noLive: (name: string) => `${name} has no public demo, but the case study shows how it works.`,
    source: (name: string, url: string) => `The source of ${name} is on GitHub: ${url}`,
    noSource: (name: string) => `The source of ${name} is not public.`,
    when: (name: string, period: string) => `${name}: ${period}.`,
    during: (company: string) => ` Built during my internship at ${company}.`,
    solo: (name: string) => `I built ${name} alone, end to end.`,
    team: (name: string, size: number) => `${name} was a team project, ${size} people.`,
    part: (role: string) => ` My part: ${role}.`,
    unknownTeam: (name: string, meta: string) => `${name}: ${meta}.`,
    result: (name: string, result: string) => `${name}: ${result}`,
    tools: (name: string, stack: string) => `${name} is built with ${stack}.`,
  },
  fr: {
    live: (name: string, url: string) => `Oui, ${name} a une démo en ligne : ${url}`,
    noLive: (name: string) => `${name} n’a pas de démo publique, mais l’étude de cas montre comment il fonctionne.`,
    source: (name: string, url: string) => `Le code de ${name} est sur GitHub : ${url}`,
    noSource: (name: string) => `Le code de ${name} n’est pas public.`,
    when: (name: string, period: string) => `${name} : ${period}.`,
    during: (company: string) => ` Réalisé pendant mon stage chez ${company}.`,
    solo: (name: string) => `J’ai réalisé ${name} seul, de bout en bout.`,
    team: (name: string, size: number) => `${name} était un projet d’équipe, à ${size}.`,
    part: (role: string) => ` Ma part : ${role}.`,
    unknownTeam: (name: string, meta: string) => `${name} : ${meta}.`,
    result: (name: string, result: string) => `${name} : ${result}`,
    tools: (name: string, stack: string) => `${name} est construit avec ${stack}.`,
  },
} satisfies Record<Lang, unknown>;

/** Answer one detail about one project, from the project's own data. */
export function detailAnswer(project: Project, detail: Exclude<Detail, "more">, lang: Lang): Answer {
  const t = TEXT[lang];
  const name = project.name;
  const entry = entryForProject(project.slug);
  const parent = TIMELINE.find((e) => e.id === entry?.parent);
  const crew = project.crew;

  let text: string;
  switch (detail) {
    case "live":
      text = project.live ? t.live(name, project.live) : t.noLive(name);
      break;
    case "source":
      text = project.repo ? t.source(name, project.repo) : t.noSource(name);
      break;
    case "when":
      text =
        t.when(name, entry && !entry.approx ? periodOf(entry, lang) : project.year) +
        (parent ? t.during(parent.label[lang]) : "");
      break;
    case "team":
    case "role":
      text =
        crew === "solo"
          ? t.solo(name)
          : crew
            ? t.team(name, crew.size) + (crew.role ? t.part(crew.role) : "")
            : t.unknownTeam(name, project.meta);
      break;
    case "result":
      text = t.result(
        name,
        project.result ?? (project.figure ? `${project.figure.value} ${project.figure.label}.` : project.headline),
      );
      break;
    case "tools":
      text = t.tools(name, project.stack.join(", "));
      break;
  }

  return {
    text,
    blocks: [{ type: "projects", slugs: [project.slug] }],
    followUps: ["projects", "skills", "contact"],
    focus: { slugs: [project.slug] },
    mode: "map",
    matched: `project:${project.slug}:${detail}`,
    context: { project: project.slug },
  };
}

/** Words that turn a detail into a question about every project: "which projects are live?". */
const LIST_WORDS = [
  "which", "projects", "apps", "any of", "quels", "quelles", "lesquels", "projets", "applications",
];
const SOLO_WORDS = ["alone", "solo", "by yourself", "on your own", "seul"];

const LIST_TEXT = {
  en: {
    live: (n: number, names: string) => `${n} projects have a live demo you can open: ${names}.`,
    source: (n: number, names: string) => `${n} projects have public source code: ${names}.`,
    team: (names: string) => `Team projects: ${names}.`,
    solo: (names: string) => `Built alone, end to end: ${names}.`,
    people: (name: string, size: number) => `${name} (${size} people)`,
    and: " and ",
  },
  fr: {
    live: (n: number, names: string) => `${n} projets ont une démo en ligne : ${names}.`,
    source: (n: number, names: string) => `${n} projets ont leur code public : ${names}.`,
    team: (names: string) => `Projets d’équipe : ${names}.`,
    solo: (names: string) => `Réalisés seul, de bout en bout : ${names}.`,
    people: (name: string, size: number) => `${name} (à ${size})`,
    and: " et ",
  },
} satisfies Record<Lang, unknown>;

function joined(items: string[], and: string): string {
  return items.length < 2 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")}${and}${items.at(-1)}`;
}

/**
 * "Which projects have a live demo?", "which did you do in a team?": every
 * project that fits, from the projects' own data. Undefined when the question
 * is not a list question or nothing fits.
 */
export function listAnswer(norm: string, detail: Detail | undefined, projects: Project[], lang: Lang): Answer | undefined {
  if (detail !== "live" && detail !== "source" && detail !== "team") return undefined;
  const padded = ` ${norm} `;
  if (!LIST_WORDS.some((w) => padded.includes(` ${w} `))) return undefined;
  const t = LIST_TEXT[lang];
  const solo = detail === "team" && SOLO_WORDS.some((w) => padded.includes(` ${w} `));

  const fits = projects.filter((p) =>
    detail === "live" ? p.live
    : detail === "source" ? p.repo
    : solo ? p.crew === "solo"
    : typeof p.crew === "object",
  );
  if (fits.length === 0) return undefined;
  const names = fits.map((p) => p.name);

  const text =
    detail === "live" ? t.live(fits.length, joined(names, t.and))
    : detail === "source" ? t.source(fits.length, joined(names, t.and))
    : solo ? t.solo(joined(names, t.and))
    : t.team(joined(fits.map((p) => (typeof p.crew === "object" ? t.people(p.name, p.crew.size) : p.name)), t.and));

  const slugs = fits.map((p) => p.slug);
  return {
    text,
    blocks: [{ type: "projects", slugs }],
    followUps: ["projects", "skills", "contact"],
    focus: { slugs },
    mode: "map",
    matched: `list:${solo ? "solo" : detail}`,
  };
}
