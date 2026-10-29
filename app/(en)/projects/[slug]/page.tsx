import type { Metadata } from "next";

import {
  ProjectPage,
  projectMetadata,
  projectStaticParams,
} from "@/components/pages/project-page";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = projectStaticParams;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return projectMetadata("en", (await params).slug);
}

export default async function Page({ params }: Params) {
  return <ProjectPage lang="en" slug={(await params).slug} />;
}
