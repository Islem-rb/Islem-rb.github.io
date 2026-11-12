import type { ReactNode } from "react";

import { PipelineTrace } from "@/components/hero/pipeline-trace";
import { ThemedPortrait } from "@/components/hero/themed-portrait";
import { FadeIn } from "@/components/ui/motion-primitives";
import { profile } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";

import { Ask } from "./ask";

/** Home hero built around a question box instead of a static pitch. */
export function AskHero({ lang }: { lang: Lang }): ReactNode {
  const t = getDictionary(lang).hero;
  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 pt-36 sm:px-10 sm:pt-44">
        <FadeIn className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-3">
            <span className="relative block h-12 w-12 overflow-hidden rounded-full border border-foreground/10 bg-background shadow-sm">
              <ThemedPortrait alt={t.portraitAlt} />
            </span>
            <p className="text-[20px] font-medium leading-tight tracking-tight text-foreground">
              {t.greeting} {profile.firstName}
            </p>
          </div>

          <h1 className="text-[2.4rem] font-medium leading-[1.05] tracking-tight text-foreground sm:text-[3rem] lg:text-[3.65rem]">
            {t.line1} {t.line2}{" "}
            <span className="font-serif italic">{t.emphasis}</span>
          </h1>

          <p className="max-w-[46ch] text-[18px] leading-[1.45] tracking-tight text-foreground/65 sm:text-[20px]">
            {t.intro}
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="mx-auto mt-9 w-full max-w-3xl">
          <Ask />
        </FadeIn>

        <FadeIn delay={0.25}>
          <p className="mt-6 flex items-center justify-center gap-2 font-mono text-[12px] tracking-tight text-foreground/55">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]"
            />
            {t.availability}
          </p>
        </FadeIn>

        <FadeIn delay={0.35} className="mt-16 sm:mt-24">
          <PipelineTrace />
        </FadeIn>
      </div>
    </section>
  );
}
