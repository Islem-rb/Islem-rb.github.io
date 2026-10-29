import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/content";
import { LANGS, localePath } from "@/lib/i18n";
import { siteConfig } from "@/lib/metadata";

export const dynamic = "force-static";

// Matches `trailingSlash: true`, so sitemap URLs equal the canonical ones.
const url = (path: string): string =>
  `${siteConfig.url}${path === "/" ? "/" : `${path}/`}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { path: "/", priority: 1 },
    { path: "/projects", priority: 0.8 },
    { path: "/about", priority: 0.8 },
    ...PROJECTS.map((p) => ({ path: `/projects/${p.slug}`, priority: 0.6 })),
  ];
  return paths.flatMap(({ path, priority }) =>
    LANGS.map((lang) => ({
      url: url(localePath(lang, path)),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LANGS.map((l) => [l, url(localePath(l, path))]),
        ),
      },
    })),
  );
}
