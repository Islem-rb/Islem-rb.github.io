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
