import { getProjects, getSkillGroups, type Project } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";
import { yearSummary } from "@/lib/timeline";

import { detailAnswer, detailIn, listAnswer } from "./details";
import { categoryIn, filteredAnswer } from "./filters";

import {
  answerForIntent,
  DEFAULT_SUGGESTIONS,
  INTENTS,
  PROJECT_ALIASES,
} from "./intents";
import type { Answer, ChatContext, IntentId, Suggestion } from "./types";

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

/** One tool named in a question, with every project that uses it. */
type TechHit = { label: string; key: string; slugs: string[] };

/**
 * The tools a question names: "kubernetes and terraform" gives two hits.
 * `skip` holds words already used for something else ("cloud" in "cloud projects").
 */
function findTechs(norm: string, vocabulary: Tech[], skip: string[] = []): TechHit[] {
  const padded = ` ${norm} `;
  const hits: TechHit[] = [];
  const used = new Set(skip);
  // Two or more words of one tool first, so "react native" is React Native and
  // "spring cloud" is Spring Cloud (Gateway), not two separate tools.
  for (const tech of vocabulary) {
    const n = tech.words.length;
    let found: [number, number] | undefined;
    for (let i = 0; i < n - 1 && !found; i += 1) {
      for (let j = n; j >= i + 2; j -= 1) {
        if (padded.includes(` ${tech.words.slice(i, j).join(" ")} `)) {
          found = [i, j];
          break;
        }
      }
    }
    if (!found) continue;
    const key = tech.words.slice(...found).join(" ");
    const label = tech.label.split(" ").slice(...found).join(" ");
    const same = hits.find((h) => h.key === key);
    if (same) same.slugs = [...new Set([...same.slugs, ...tech.slugs])];
    else if (!hits.some((h) => h.key.includes(key))) hits.push({ label, key, slugs: [...tech.slugs] });
    for (const word of tech.words.slice(...found)) used.add(word);
  }
  const tokens = norm
    .split(" ")
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t) && !INTENT_WORDS.has(t) && !used.has(t));
  for (const token of tokens) {
    // EKS is Kubernetes, so a Kubernetes question should surface the EKS work too.
    const k8s = token === "k8s" || token === "eks" || wordScore(token, "kubernetes") > 0;
    let best: { label: string; key: string; score: number } | undefined;
    const slugs: string[] = [];
    for (const w of k8s ? ["kubernetes", "eks"] : [token]) {
      for (const tech of vocabulary) {
        for (const word of tech.words) {
          // Version numbers and tiny fragments ("18", "cd") never match.
          const score = word.length >= 3 ? wordScore(w, word) : 0;
          if (score === 0) continue;
          const label = tech.label.split(" ").find((x) => normalize(x) === word) ?? tech.label;
          if (!best || score > best.score) {
            best = k8s ? { label: "Kubernetes", key: "kubernetes", score } : { label, key: normalize(label), score };
          }
          for (const slug of tech.slugs) if (!slugs.includes(slug)) slugs.push(slug);
        }
      }
    }
    if (!best) continue;
    const same = hits.find((h) => h.key === best.key);
    if (same) same.slugs = [...new Set([...same.slugs, ...slugs])];
    else hits.push({ label: best.label, key: best.key, slugs });
  }
  return hits;
}

/**
 * Every tool named, with the projects that use all of them (`slugs`), or,
 * when no project uses them together, those that use any (`together: false`).
 */
function findTech(
  norm: string,
  vocabulary: Tech[],
  skip: string[] = [],
): { label: string; labels: string[]; slugs: string[]; together: boolean } | undefined {
  const hits = findTechs(norm, vocabulary, skip);
  const known = hits.filter((h) => h.slugs.length > 0);
  if (known.length < 2) {
    const one = known[0] ?? hits[0];
    return one ? { label: one.label, labels: [one.label], slugs: one.slugs, together: true } : undefined;
  }
  const labels = known.map((h) => h.label);
  const all = known[0]!.slugs.filter((slug) => known.every((h) => h.slugs.includes(slug)));
  const any = [...new Set(known.flatMap((h) => h.slugs))];
  return all.length > 0
    ? { label: labels.join(" + "), labels, slugs: all, together: true }
    : { label: labels.join(" + "), labels, slugs: any, together: false };
}

/**
 * A project's introduction, answered in the chat. The case study opens only
 * when the visitor clicks the project, so the conversation is never taken away.
 */
function projectAnswer(project: Project): Answer {
  return {
    text: `${project.name} (${project.kind}, ${project.year}). ${project.summary}`,
    blocks: [{ type: "projects", slugs: [project.slug] }],
    followUps: ["projects", "skills", "contact"],
    focus: { slugs: [project.slug] },
    mode: "map",
    matched: `project:${project.slug}`,
    context: { project: project.slug },
  };
}

/**
 * Words that make a question about me, not about the project being discussed:
 * "when can you start?" after Carnova is still about availability.
 */
const NOT_A_FOLLOW_UP = [
  "start", "available", "availability", "hire", "internship", "your stack", "salary",
  "contact", "resume", "cv", "commencer", "disponible", "stage", "ta stack", "salaire",
];

export function answer(query: string, lang: Lang, context?: ChatContext): Answer {
  const t = getDictionary(lang).ask.answers;
  const norm = normalize(query);
  const projects = getProjects(lang);
  const detail = detailIn(norm);

  const project = findProject(norm, projects);
  if (project) {
    return detail && detail !== "more" ? detailAnswer(project, detail, lang) : projectAnswer(project);
  }

  // "Which projects have a live demo?": every project that fits.
  const list = listAnswer(norm, detail, projects, lang);
  if (list) return list;

  // A follow-up such as "is it live?" about the project the conversation is on.
  const current = projects.find((p) => p.slug === context?.project);
  const padded = ` ${norm} `;
  if (current && detail && !NOT_A_FOLLOW_UP.some((w) => padded.includes(` ${w} `))) {
    return detail === "more" ? projectAnswer(current) : detailAnswer(current, detail, lang);
  }

  const early = bestIntent(norm, BEFORE_TOOLS);
  if (early) return answerForIntent(early, lang);

  const year = norm.match(/\b(20[12]\d)\b/)?.[1];
  const vocabulary = techVocabulary(lang, projects);

  // "Cloud projects in 2026", "kubernetes in 2025": every filter at once.
  const category = categoryIn(norm);
  const yearTools = year ? findTech(norm, vocabulary) : undefined;
  if (category || (year && yearTools && yearTools.slugs.length > 0)) {
    const tools = findTech(norm, vocabulary, category?.words);
    return filteredAnswer(projects, lang, {
      category: category?.category,
      year: year ? Number(year) : undefined,
      tools: tools && tools.slugs.length > 0 ? tools : undefined,
    });
  }

  // "What did you do in 2025?": the timeline, with that year lit.
  const summary = year
    ? yearSummary(Number(year), lang, Object.fromEntries(projects.map((p) => [p.slug, p.name])))
    : undefined;
  if (year && summary) {
    return {
      text: summary.text,
      blocks: summary.slugs.length > 0 ? [{ type: "projects", slugs: summary.slugs }] : [{ type: "education" }],
      followUps: ["timeline", "experience", "projects"],
      focus: { slugs: summary.slugs, year: Number(year) },
      mode: "time",
      matched: `year:${year}`,
    };
  }

  const tech = findTech(norm, vocabulary);
  if (tech) {
    // Keep the site's own project order, flagship first.
    tech.slugs = projects.map((p) => p.slug).filter((s) => tech.slugs.includes(s));
    if (tech.labels.length > 1) return filteredAnswer(projects, lang, { tools: tech });
    return tech.slugs.length > 0
      ? {
          text: t.tech(tech.label, tech.slugs.length),
          blocks: [{ type: "projects", slugs: tech.slugs }],
          followUps: ["skills", "projects", "experience"],
          focus: { slugs: tech.slugs, tools: tech.labels },
          mode: "map",
          matched: `tech:${tech.label}`,
        }
      : {
          text: t.techSkill(tech.label),
          blocks: [{ type: "skills" }],
          followUps: ["projects", "experience", "cv"],
          matched: `tech:${tech.label}`,
        };
  }

  const best = bestIntent(norm);
  if (best) return answerForIntent(best, lang);

  const guesses = closest(norm, lang, projects, vocabulary);
  return {
    text: guesses.length > 0 ? t.didYouMean : t.fallback,
    blocks: [
      ...(guesses.length > 0 ? [{ type: "didYouMean" as const, items: guesses }] : []),
      { type: "ask", question: query.trim() },
    ],
    // With guesses on screen, fewer ready-made questions keep the card short.
    followUps: guesses.length > 0 ? DEFAULT_SUGGESTIONS.slice(0, 3) : DEFAULT_SUGGESTIONS,
    matched: "fallback",
  };
}

/** Edit distance, counting a swap of two neighbouring letters as one edit. */
function distance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let best = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        best = Math.min(best, d[i - 2]![j - 2]! + 1);
      }
      d[i]![j] = best;
    }
  }
  return d[a.length]![b.length]!;
}

/**
 * How close a typed word is to a known one, looser than the matcher: the start
 * of a word ("kube"), or two typos in a long one ("terrafrom"). 0 when not close.
 */
function closeness(token: string, word: string, alone: boolean): number {
  if (token.length < 3 || word.length < 4) return 0;
  if (token === word) return 1;
  // A word typed on its own may be cut short; inside a sentence ("play") it is a word.
  if (alone && token.length >= 4 && word.startsWith(token)) return 0.9;
  const edits = distance(token, word);
  if (edits === 1 && token.length >= 4) return 0.8;
  if (edits === 2 && token.length >= 6 && word.length >= 6) return 0.6;
  return 0;
}

const MAX_GUESSES = 3;

/** Up to three things the visitor may have meant: projects, tools, then questions. */
function closest(norm: string, lang: Lang, projects: Project[], vocabulary: Tech[]): Suggestion[] {
  const tokens = norm.split(" ").filter((tok) => !STOPWORDS.has(tok));
  if (tokens.length === 0) return [];
  const chips = getDictionary(lang).ask.chips;
  const score = (words: string[]): number =>
    Math.max(0, ...tokens.flatMap((tok) => words.map((w) => closeness(tok, w, tokens.length === 1))));

  const found: (Suggestion & { score: number })[] = [];
  for (const p of projects) {
    const words = [...normalize(p.name).split(" "), ...(PROJECT_ALIASES[p.slug] ?? [])];
    found.push({ label: p.name, kind: "project", score: score(words) + 0.05 });
  }
  for (const tech of vocabulary) {
    if (tech.slugs.length === 0) continue;
    found.push({ label: tech.label, kind: "tool", score: score(tech.words) });
  }
  for (const intent of INTENTS) {
    if (intent.id === "greeting" || intent.id === "salary") continue;
    const words = intent.keywords.filter((k) => !k.includes(" "));
    found.push({ label: chips[intent.id], kind: "question", intent: intent.id, score: score(words) - 0.05 });
  }

  const seen = new Set<string>();
  return found
    .filter((f) => f.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .filter((f) => {
      const key = f.label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_GUESSES)
    .map(({ score: _score, ...rest }) => rest);
}

/**
 * The intent whose keywords fit best. `only` limits the search, for the
 * questions that must win over a tool name ("AWS certifications?").
 */
function bestIntent(norm: string, only?: IntentId[]): IntentId | undefined {
  const padded = ` ${norm} `;
  const tokens = norm.split(" ");
  let best: { id: IntentId; score: number } | undefined;
  for (const intent of INTENTS) {
    if (only && !only.includes(intent.id)) continue;
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
  return best?.id;
}

/** Questions about me that mention a tool or a year but are not about it. */
const BEFORE_TOOLS: IntentId[] = ["certifications", "salary", "hardest", "whyDevops"];

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

/** The "/" menu: every question the chat knows, then every project, filtered by what follows the slash. */
export function allSuggestions(filter: string, lang: Lang): Suggestion[] {
  const norm = normalize(filter);
  const chips = getDictionary(lang).ask.chips;
  const keep = (label: string): boolean => !norm || normalize(label).includes(norm);
  // Salary is answered when asked, not offered.
  const questions: Suggestion[] = INTENTS.filter((i) => i.id !== "greeting" && i.id !== "salary")
    .map((i) => ({ label: chips[i.id], kind: "question" as const, intent: i.id }))
    .filter((s) => keep(s.label));
  const projects: Suggestion[] = getProjects(lang)
    .map((p) => ({ label: p.name, kind: "project" as const }))
    .filter((s) => keep(s.label));
  return [...questions, ...projects];
}
