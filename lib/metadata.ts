import type { Metadata } from "next";

import { getDictionary, localePath, type Lang } from "./i18n";
import { ogAlt, ogContentType, ogSize } from "./og-image";

export const siteConfig = {
  name: "Islem Rebhi",
  // Change this to the final domain before deploying (used for canonical URLs, sitemap and OG).
  url: "https://islem-rb.github.io",
  creator: "Islem Rebhi",
  authors: [
    {
      name: "Islem Rebhi",
      url: "https://github.com/Islem-rb",
    },
  ],
  keywords: [
    "Islem Rebhi",
    "Cloud engineer",
    "DevOps",
    "Platform engineering",
    "Kubernetes",
    "Terraform",
    "GitOps",
    "Argo CD",
    "AWS EKS",
    "PFE internship",
    "stage PFE",
    "ESPRIT",
    "Tunisia",
  ],
} as const;

const OG_LOCALE: Record<Lang, string> = { en: "en_US", fr: "fr_FR" };

function ogImages(lang: Lang) {
  return [
    {
      url: `/og/${lang}.png`,
      width: ogSize.width,
      height: ogSize.height,
      alt: ogAlt(lang),
      type: ogContentType,
    },
  ];
}

function alternates(lang: Lang, path: string): Metadata["alternates"] {
  return {
    canonical: localePath(lang, path),
    languages: {
      en: localePath("en", path),
      fr: localePath("fr", path),
      "x-default": localePath("en", path),
    },
  };
}

export function baseMetadata(lang: Lang): Metadata {
  const t = getDictionary(lang).meta;
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t.homeTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description: t.description,
    keywords: [...siteConfig.keywords],
    authors: [...siteConfig.authors],
    creator: siteConfig.creator,
    publisher: siteConfig.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: alternates(lang, "/"),
    openGraph: {
      type: "website",
      locale: OG_LOCALE[lang],
      alternateLocale: lang === "en" ? OG_LOCALE.fr : OG_LOCALE.en,
      url: `${siteConfig.url}${localePath(lang, "/")}`,
      title: t.homeTitle,
      description: t.description,
      siteName: siteConfig.name,
      images: ogImages(lang),
    },
    twitter: {
      card: "summary_large_image",
      title: t.homeTitle,
      description: t.description,
      creator: siteConfig.creator,
      images: ogImages(lang),
    },
    manifest: "/site.webmanifest",
  };
}

export function createMetadata({
  lang,
  title,
  description,
  path = "/",
  noIndex = false,
}: {
  lang: Lang;
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const t = getDictionary(lang).meta;
  const url = `${siteConfig.url}${localePath(lang, path)}`;

  return {
    // Omit an undefined title so the layout's default title still applies.
    ...(title && { title }),
    description,
    alternates: alternates(lang, path),
    openGraph: {
      title: title ?? t.homeTitle,
      description: description ?? t.description,
      url,
      locale: OG_LOCALE[lang],
      images: ogImages(lang),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? t.homeTitle,
      description: description ?? t.description,
      images: ogImages(lang),
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
