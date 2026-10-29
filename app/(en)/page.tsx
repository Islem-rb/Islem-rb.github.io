import type { Metadata } from "next";

import { HomePage } from "@/components/pages/home-page";
import { getDictionary } from "@/lib/i18n";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  lang: "en",
  description: getDictionary("en").meta.description,
  path: "/",
});

export default function Page() {
  return <HomePage lang="en" />;
}
