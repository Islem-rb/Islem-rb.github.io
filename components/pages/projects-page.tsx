import type { ReactNode } from "react";

import { Projects } from "@/components/projects/projects";
import { FadeIn } from "@/components/ui/motion-primitives";
import { getProjects } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";

export function ProjectsPage({ lang }: { lang: Lang }): ReactNode {
  const t = getDictionary(lang);
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-310 px-5 pt-32 pb-12 sm:px-8 sm:pt-40 sm:pb-16">
        <FadeIn className="flex flex-col gap-5">
          <p className="eyebrow">
            {t.nav.projects} · {getProjects(lang).length}
          </p>
          <h1 className="max-w-[18ch] font-serif text-[2.4rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance text-foreground sm:text-[3.4rem]">
            {t.projects.pageTitle}
            <span className="text-accent">.</span>
          </h1>
          <p className="max-w-[52ch] text-[18px] leading-relaxed text-pretty text-muted-foreground">
            {t.projects.pageIntro}
          </p>
        </FadeIn>
      </section>
      <Projects lang={lang} />
    </main>
  );
}
