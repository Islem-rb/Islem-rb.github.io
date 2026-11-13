import { ArrowUpRight, Github } from "lucide-react";
import type { ReactNode } from "react";

import { ArchitectureDiagram } from "@/components/projects/architecture-diagram";
import { FadeIn } from "@/components/ui/motion-primitives";
import { getDictionary, type Lang } from "@/lib/i18n";

export const SITE_REPO = "https://github.com/Islem-rb/Islem-rb.github.io";

/** The colophon: the pipeline and checks every change to this site goes through. */
export function ShipsPage({ lang }: { lang: Lang }): ReactNode {
  const dict = getDictionary(lang);
  const t = dict.ships;
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-310 px-5 pt-32 pb-12 sm:px-8 sm:pt-40 sm:pb-16">
        <FadeIn className="flex flex-col gap-5">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="max-w-[20ch] font-serif text-[2.4rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance text-foreground sm:text-[3.4rem]">
            {t.title}
            <span className="text-accent">.</span>
          </h1>
          <p className="max-w-[56ch] text-[18px] leading-relaxed text-pretty text-muted-foreground">
            {t.intro}
          </p>
          <a
            href={SITE_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring group mt-2 inline-flex h-11 w-fit items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            {t.source}
            <ArrowUpRight className="h-4 w-4 opacity-60" aria-hidden="true" />
          </a>
        </FadeIn>
      </section>

      <section className="mx-auto w-full max-w-310 px-5 sm:px-8">
        <FadeIn delay={0.1}>
          <ArchitectureDiagram
            architecture={{ lanes: t.lanes, feedback: t.feedback, note: t.note }}
            label={t.title}
            feedbackLabel={dict.projects.feedback}
          />
        </FadeIn>
      </section>

      <section className="mx-auto w-full max-w-310 px-5 pt-16 sm:px-8 sm:pt-20">
        <FadeIn delay={0.15} className="flex flex-col gap-3">
          <h2 className="eyebrow">{t.factsTitle}</h2>
          <dl className="sheet divide-y divide-border px-5 sm:px-6">
            {t.facts.map(([label, value]) => (
              <div key={label} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="font-serif text-[15px] font-semibold tracking-[-0.02em] text-foreground">
                  {label}
                </dt>
                <dd className="text-[15.5px] leading-relaxed text-muted-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </section>
    </main>
  );
}
