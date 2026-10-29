import type { Metadata } from "next";

import { AboutPage } from "@/components/pages/about-page";
import { getDictionary } from "@/lib/i18n";
import { createMetadata } from "@/lib/metadata";

const t = getDictionary("fr").meta;

export const metadata: Metadata = createMetadata({
  lang: "fr",
  title: t.aboutTitle,
  description: t.aboutDescription,
  path: "/about",
});

export default function Page() {
  return <AboutPage lang="fr" />;
}
