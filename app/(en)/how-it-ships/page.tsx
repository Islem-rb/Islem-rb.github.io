import type { Metadata } from "next";

import { ShipsPage } from "@/components/pages/ships-page";
import { getDictionary } from "@/lib/i18n";
import { createMetadata } from "@/lib/metadata";

const t = getDictionary("en").meta;

export const metadata: Metadata = createMetadata({
  lang: "en",
  title: t.shipsTitle,
  description: t.shipsDescription,
  path: "/how-it-ships",
});

export default function Page() {
  return <ShipsPage lang="en" />;
}
