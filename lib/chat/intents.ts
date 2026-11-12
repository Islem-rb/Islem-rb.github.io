import { getProjects } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";

import type { Answer, Block, IntentId } from "./types";

type Intent = {
  id: IntentId;
  /**
   * Normalised (lowercase, no accents) English and French triggers.
   * Multi-word entries are matched as phrases and score higher.
   */
  keywords: string[];
  blocks: (lang: Lang) => Block[];
  followUps: IntentId[];
};

/** Order matters: on a tie, the earlier intent wins. */
export const INTENTS: Intent[] = [
  {
    id: "projects",
    keywords: [
      "projects", "project", "work", "built", "build", "portfolio", "shipped",
      "projets", "projet", "realisations", "travaux",
    ],
    blocks: (lang) => [
      {
        type: "projects",
        slugs: getProjects(lang)
          .filter((p) => p.featured)
          .slice(0, 4)
          .map((p) => p.slug),
        showAll: true,
      },
    ],
    followUps: ["skills", "experience", "contact"],
  },
  {
    id: "skills",
    keywords: [
      "stack", "skills", "skill", "tools", "toolbox", "technologies", "tech",
      "tech stack", "programming languages", "competences", "outils",
      "langages",
    ],
    blocks: () => [{ type: "skills" }],
    followUps: ["projects", "experience", "cv"],
  },
  {
    id: "experience",
    keywords: [
      "experience", "experiences", "worked", "working", "job", "jobs",
      "career", "companies", "company", "internships", "interned", "stages",
      "travaille", "entreprises", "parcours",
    ],
    blocks: () => [{ type: "experience" }],
    followUps: ["projects", "education", "cv"],
  },
  {
    id: "education",
    keywords: [
      "education", "study", "studies", "studying", "studied", "school",
      "degree", "university", "esprit", "diploma", "etudes", "etudie",
      "formation", "ecole", "diplome", "universite",
    ],
    blocks: () => [{ type: "education" }],
    followUps: ["experience", "skills", "availability"],
  },
  {
    id: "availability",
    keywords: [
      "available", "availability", "hire", "hiring", "pfe", "internship",
      "opportunity", "looking", "free", "recruit", "disponible",
      "disponibilite", "stage", "recruter", "embaucher", "cherches",
    ],
    blocks: () => [{ type: "facts" }, { type: "contact" }],
    followUps: ["cv", "projects", "skills"],
  },
  {
    id: "cv",
    keywords: ["cv", "resume", "curriculum", "download", "pdf", "telecharger"],
    blocks: () => [{ type: "cv" }],
    followUps: ["contact", "experience", "projects"],
  },
  {
    id: "contact",
    keywords: [
      "contact", "email", "mail", "reach", "linkedin", "github", "message",
      "phone", "call", "contacter", "joindre", "ecrire",
    ],
    blocks: () => [{ type: "contact" }],
    followUps: ["availability", "cv", "projects"],
  },
  {
    id: "languages",
    keywords: [
      "languages", "language", "speak", "english", "french", "arabic",
      "langues", "langue", "parles", "anglais", "francais", "arabe",
    ],
    blocks: () => [{ type: "languages" }],
    followUps: ["location", "education", "contact"],
  },
  {
    id: "about",
    keywords: [
      "who", "yourself", "introduce", "bio", "about you", "islem", "qui",
      "presente", "toi", "de toi",
    ],
    blocks: () => [{ type: "facts" }],
    followUps: ["projects", "skills", "availability"],
  },
  {
    id: "location",
    keywords: [
      "where", "based", "location", "located", "live", "city", "country",
      "tunisia", "remote", "habites", "ville", "pays", "tunisie", "base",
    ],
    blocks: () => [{ type: "facts" }],
    followUps: ["availability", "languages", "contact"],
  },
  {
    id: "greeting",
    keywords: [
      "hi", "hello", "hey", "yo", "salut", "bonjour", "coucou", "salam",
      "bonsoir",
    ],
    blocks: () => [],
    followUps: ["about", "projects", "skills"],
  },
];

/** Shown before any question, and again when nothing matched. */
export const DEFAULT_SUGGESTIONS: IntentId[] = [
  "projects",
  "skills",
  "availability",
  "contact",
  "about",
];

/** Extra names people use for a project, beyond its full name. */
export const PROJECT_ALIASES: Record<string, string[]> = {
  "gitops-eks-platform": ["gitops", "eks"],
  "devops-observability-platform": ["observability platform"],
  cityvoice: ["city voice"],
  "verdustry-social": ["verdustry"],
  "automotive-ml": ["automotive", "machine learning"],
};

export function answerForIntent(id: IntentId, lang: Lang): Answer {
  const intent = INTENTS.find((i) => i.id === id)!;
  const a = getDictionary(lang).ask.answers;
  const text = id === "projects" ? a.projects(getProjects(lang).length) : a[id];
  return { text, blocks: intent.blocks(lang), followUps: intent.followUps };
}
