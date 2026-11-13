import type { Project } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { entryForProject, inYear } from "@/lib/timeline";

import { categoryOf, type Category } from "./map";
import type { Answer } from "./types";

/** Words for each map category, normalised. */
const CATEGORY_WORDS: Record<Category, string[]> = {
  cloud: ["cloud", "platform", "platforms", "plateforme", "plateformes", "devops", "infra", "infrastructure"],
  product: ["product", "products", "produit", "produits", "web", "mobile", "fullstack"],
  ai: ["ai", "ia", "ml", "data", "donnees", "intelligence"],
};

/** A category only counts next to a word for projects: "cloud projects", not "cloud". */
const PROJECT_WORDS = ["projects", "project", "projets", "projet", "work", "apps", "applications"];

/** The category a question asks for, and the words it used for it. */
export function categoryIn(norm: string): { category: Category; words: string[] } | undefined {
  const tokens = norm.split(" ");
  if (!tokens.some((t) => PROJECT_WORDS.includes(t))) return undefined;
  for (const [category, words] of Object.entries(CATEGORY_WORDS) as [Category, string[]][]) {
    const used = tokens.filter((t) => words.includes(t));
    if (used.length > 0) return { category, words: [...used, ...PROJECT_WORDS] };
  }
  return undefined;
}

const TEXT = {
  en: {
    cats: { cloud: "cloud & platform", product: "product", ai: "AI & data" },
    apart: (tools: string, names: string) =>
      `None of my projects uses ${tools} together. Here are the ones that use either: ${names}.`,
    found: (n: number, what: string, names: string) => `${n} ${what}: ${names}.`,
    none: (what: string) => `No ${what.replace(/s\b/, "")} yet.`,
    what: (n: number, cat: string, tools: string, year: string) =>
      `${cat ? `${cat} ` : ""}project${n === 1 ? "" : "s"}${tools ? ` using ${tools}` : ""}${year ? ` in ${year}` : ""}`,
    and: " and ",
  },
  fr: {
    cats: { cloud: "cloud & plateforme", product: "produit", ai: "IA & données" },
    apart: (tools: string, names: string) =>
      `Aucun de mes projets n’utilise ${tools} ensemble. Voici ceux qui utilisent l’un ou l’autre : ${names}.`,
    found: (n: number, what: string, names: string) => `${n} ${what} : ${names}.`,
    none: (what: string) => `Pas encore de ${what.replace(/^projets?/, "projet")}.`,
    what: (n: number, cat: string, tools: string, year: string) =>
      `projet${n === 1 ? "" : "s"}${cat ? ` ${cat}` : ""}${tools ? ` avec ${tools}` : ""}${year ? ` en ${year}` : ""}`,
    and: " et ",
  },
} satisfies Record<Lang, unknown>;

function joined(items: string[], and: string): string {
  return items.length < 2 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")}${and}${items.at(-1)}`;
}

/**
 * "Cloud projects in 2026", "kubernetes projects in 2025": every project that
 * fits all the filters given, in the site's own order.
 */
export function filteredAnswer(
  projects: Project[],
  lang: Lang,
  filters: { category?: Category | undefined; year?: number | undefined; tools?: { labels: string[]; slugs: string[]; together?: boolean } | undefined },
): Answer {
  const t = TEXT[lang];
  const { category, year, tools } = filters;
  const fits = projects.filter((p) => {
    if (category && categoryOf(p.slug) !== category) return false;
    if (tools && !tools.slugs.includes(p.slug)) return false;
    const entry = entryForProject(p.slug);
    if (year && !(entry && inYear(entry, year))) return false;
    return true;
  });
  const cat = category ? t.cats[category] : "";
  const toolText = tools ? joined(tools.labels, t.and) : "";
  const what = t.what(fits.length, cat, toolText, year ? String(year) : "");
  const slugs = fits.map((p) => p.slug);
  const text =
    tools?.together === false && !category && !year
      ? t.apart(toolText, joined(fits.map((p) => p.name), t.and))
      : fits.length > 0
      ? t.found(fits.length, what, joined(fits.map((p) => p.name), t.and))
      : t.none(t.what(1, cat, toolText, year ? String(year) : ""));
  return {
    text,
    blocks: fits.length > 0 ? [{ type: "projects", slugs }] : [],
    followUps: ["projects", "timeline", "skills"],
    focus: { slugs, ...(year ? { year } : {}), ...(tools ? { tools: tools.labels } : {}) },
    mode: year ? "time" : "map",
    matched: `filter:${[category, ...(tools?.labels ?? []), year].filter(Boolean).join(":")}`,
  };
}
