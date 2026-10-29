"use client";

import { usePathname } from "next/navigation";

import { getDictionary, langFromPath, type Dictionary, type Lang } from "./i18n";

/** Current language for client components, derived from the URL. */
export function useLang(): { lang: Lang; t: Dictionary } {
  const lang = langFromPath(usePathname() ?? "/");
  return { lang, t: getDictionary(lang) };
}
