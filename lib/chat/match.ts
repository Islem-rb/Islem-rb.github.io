import { getProjects, getSkillGroups, type Project } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";

import {
  answerForIntent,
  DEFAULT_SUGGESTIONS,
  INTENTS,
  PROJECT_ALIASES,
} from "./intents";
import type { Answer, Suggestion } from "./types";

const STOPWORDS = new Set([
  "the", "and", "you", "your", "with", "for", "are", "what", "how", "use",
  "used", "using", "any", "can", "have", "has", "know", "tell", "show", "me",
  "do", "does", "did", "about", "is", "to", "my", "in", "on", "of", "it",
  "des", "les", "avec", "que", "est", "une", "pour", "tes", "ton", "tu", "as",
  "de", "la", "le", "un", "et", "sur", "moi", "quoi", "connais", "utilise",
]);

/** Lowercase, strip accents and punctuation, keep `+ # .` for names like c++, next.js. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .replace(/\.(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when the two words are equal or one edit apart (insert, delete, swap a letter). */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (long.length - short.length > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < short.length && j < long.length) {
    if (short[i] === long[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (short.length === long.length) i += 1;
    j += 1;
  }
  return true;
}

/** 1 for an exact word match, 0.8 for a one-letter typo on longer words, else 0. */
function wordScore(token: string, word: string): number {
  if (token === word) return 1;
  if (token.length >= 5 && word.length >= 5 && withinOneEdit(token, word)) {
    return 0.8;
  }
  return 0;
}

const INTENT_WORDS = new Set(
  INTENTS.flatMap((i) => i.keywords).filter((k) => !k.includes(" ")),
);

function findProject(norm: string, projects: Project[]): Project | undefined {
  const padded = ` ${norm} `;
  const tokens = norm.split(" ");
  return projects.find((p) => {
    const names = [
      normalize(p.name),
      p.slug.replace(/-/g, " "),
      ...(PROJECT_ALIASES[p.slug] ?? []),
    ];
    return names.some((name) =>
      name.includes(" ")
        ? padded.includes(` ${name} `)
        : tokens.some((t) => wordScore(t, name) > 0),
    );
  });
}

type Tech = { label: string; words: string[]; slugs: string[] };

/** Every tool named in a project stack or in the skills list, with the projects using it. */
function techVocabulary(lang: Lang, projects: Project[]): Tech[] {
  const byLabel = new Map<string, Tech>();
  const add = (raw: string, slug?: string): void => {
    for (const part of raw.split(/[,·()]/)) {
      const label = part.trim();
      const key = normalize(label);
      if (!key) continue;
      const tech = byLabel.get(key) ?? {
        label,
        words: key.split(" "),
        slugs: [],
      };
      if (slug && !tech.slugs.includes(slug)) tech.slugs.push(slug);
      byLabel.set(key, tech);
    }
  };
  for (const p of projects) for (const entry of p.stack) add(entry, p.slug);
  for (const group of getSkillGroups(lang)) add(group.items);
  return [...byLabel.values()];
}

function findTech(
  norm: string,
  vocabulary: Tech[],
): { label: string; slugs: string[] } | undefined {
  const tokens = norm
    .split(" ")
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t) && !INTENT_WORDS.has(t));
  // EKS is Kubernetes, so a Kubernetes question should surface the EKS work too.
  if (tokens.some((t) => t === "k8s" || wordScore(t, "kubernetes") > 0)) {
    tokens.push("kubernetes", "eks");
  }
  let best: { label: string; score: number } | undefined;
  const slugs: string[] = [];
  for (const token of tokens) {
    for (const tech of vocabulary) {
      for (const word of tech.words) {
        // Version numbers and tiny fragments ("18", "cd") only match exactly.
        const score = word.length >= 3 ? wordScore(token, word) : 0;
        if (score === 0) continue;
        const label =
          tech.label.split(" ").find((w) => normalize(w) === word) ?? tech.label;
        if (!best || score > best.score) best = { label, score };
        for (const slug of tech.slugs) if (!slugs.includes(slug)) slugs.push(slug);
      }
    }
  }
  return best ? { label: best.label, slugs } : undefined;
}

/** Turn a free-form question into an answer built from the site's own content. */
export function answer(query: string, lang: Lang): Answer {
  const t = getDictionary(lang).ask.answers;
  const norm = normalize(query);
  const projects = getProjects(lang);

  const project = findProject(norm, projects);
  if (project) {
    return {
      text: `${project.name} (${project.kind}, ${project.year}). ${project.summary}`,
      blocks: [{ type: "projects", slugs: [project.slug] }],
      followUps: ["projects", "skills", "contact"],
      focus: { slugs: [project.slug] },
      open: project.slug,
      mode: "map",
    };
  }

  const tech = findTech(norm, techVocabulary(lang, projects));
  if (tech) {
    // Keep the site's own project order, flagship first.
    tech.slugs = projects.map((p) => p.slug).filter((s) => tech.slugs.includes(s));
    return tech.slugs.length > 0
      ? {
          text: t.tech(tech.label, tech.slugs.length),
          blocks: [{ type: "projects", slugs: tech.slugs }],
          followUps: ["skills", "projects", "experience"],
          focus: { slugs: tech.slugs, tool: tech.label },
          mode: "map",
        }
      : {
          text: t.techSkill(tech.label),
          blocks: [{ type: "skills" }],
          followUps: ["projects", "experience", "cv"],
        };
  }

  const padded = ` ${norm} `;
  const tokens = norm.split(" ");
  let best: { id: (typeof INTENTS)[number]["id"]; score: number } | undefined;
  for (const intent of INTENTS) {
    let score = 0;
    for (const keyword of intent.keywords) {
      if (keyword.includes(" ")) {
        if (padded.includes(` ${keyword} `)) score += 2;
      } else {
        score += Math.max(0, ...tokens.map((tok) => wordScore(tok, keyword)));
      }
    }
    if (score > 0 && (!best || score > best.score)) best = { id: intent.id, score };
  }
  if (best) return answerForIntent(best.id, lang);

  return { text: t.fallback, blocks: [], followUps: DEFAULT_SUGGESTIONS };
}

const MAX_SUGGESTIONS = 5;

/** Live suggestions for a partly typed question: projects, tools, then questions. */
export function suggest(query: string, lang: Lang): Suggestion[] {
  const norm = normalize(query);
  if (norm.length < 2) return [];
  const starts = (text: string): boolean =>
    text.split(" ").some((word) => word.startsWith(norm)) || text.startsWith(norm);

  const chips = getDictionary(lang).ask.chips;
  const projects = getProjects(lang);
  const found: Suggestion[] = [];

  for (const p of projects) {
    if (starts(normalize(p.name))) found.push({ label: p.name, kind: "project" });
  }
  for (const tech of techVocabulary(lang, projects)) {
    if (tech.words.some((w) => w.length >= 3) && starts(tech.words.join(" "))) {
      found.push({ label: tech.label, kind: "tool" });
    }
  }
  for (const intent of INTENTS) {
    const label = chips[intent.id];
    if (
      normalize(label).includes(norm) ||
      intent.keywords.some((k) => k.length >= 3 && k.startsWith(norm))
    ) {
      found.push({ label, kind: "question", intent: intent.id });
    }
  }

  const seen = new Set<string>();
  return found
    .filter((s) => {
      const key = s.label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_SUGGESTIONS);
}
