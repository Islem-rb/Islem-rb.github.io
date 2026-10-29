import type { Metadata } from "next";

import { ProjectsPage } from "@/components/pages/projects-page";
import { getDictionary } from "@/lib/i18n";
import { createMetadata } from "@/lib/metadata";

const t = getDictionary("en").meta;

export const metadata: Metadata = createMetadata({
  lang: "en",
  title: t.projectsTitle,
  description: t.projectsDescription,
  path: "/projects",
});

export default function Page() {
  return <ProjectsPage lang="en" />;
}
