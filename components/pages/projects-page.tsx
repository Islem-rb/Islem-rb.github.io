import type { ReactNode } from "react";

import { ContactCard } from "@/components/contact/contact-card";
import { Projects } from "@/components/projects/projects";
import { FadeIn } from "@/components/ui/motion-primitives";
import { getDictionary, type Lang } from "@/lib/i18n";

export function ProjectsPage({ lang }: { lang: Lang }): ReactNode {
  const t = getDictionary(lang).projects;
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-275 px-6 pt-44 pb-16 sm:px-10 sm:pt-56 sm:pb-20">
        <FadeIn className="flex flex-col items-center gap-5 text-center">
          <h1 className="font-serif text-[2.75rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[3.25rem] lg:text-[3.75rem]">
            {t.pageTitle}
          </h1>
          <p className="max-w-[33ch] text-[20px] leading-[1.4] tracking-tight text-foreground/65 sm:text-[22px]">
            {t.pageIntro}
          </p>
        </FadeIn>
      </section>
      <Projects lang={lang} />
      <ContactCard lang={lang} />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
