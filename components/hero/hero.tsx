import type { ReactNode } from "react";

import { HeroCtas } from "./hero-ctas";
import { PipelineTrace } from "./pipeline-trace";
import { FadeIn, ScaleUnblur } from "@/components/ui/motion-primitives";
import { ThemedPortrait } from "./themed-portrait";
import { profile } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";

export function Hero({ lang }: { lang: Lang }): ReactNode {
  const t = getDictionary(lang).hero;
  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 pt-44 pb-0 sm:px-10 sm:pt-56 sm:pb-0">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.15fr_1fr] md:gap-8">
          <FadeIn className="flex flex-col gap-4">
            <p className="text-[20px] font-medium leading-tight tracking-tight text-foreground">
              {t.greeting} {profile.firstName}
            </p>

            <h1 className="text-[2.6rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[2.5rem] lg:text-[3.65rem]">
              <span className="block">{t.line1}</span>
              <span className="block">
                {t.line2}{" "}
                <span className="font-serif italic">{t.emphasis}</span>
              </span>
            </h1>

            <p className="max-w-[36ch] text-[20px] leading-[1.4] tracking-tight text-foreground/65 sm:text-[22px]">
              {t.intro}
            </p>

            <HeroCtas />

            <p className="mt-3 inline-flex items-center gap-2 font-mono text-[12px] tracking-tight text-foreground/55">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]"
              />
              {t.availability}
            </p>
          </FadeIn>

          <ScaleUnblur className="flex justify-stretch md:justify-end">
            <figure className="relative w-full md:max-w-105">
              <div className="relative aspect-square w-full overflow-hidden rounded-4xl border border-foreground/8 bg-background p-1.5 shadow-sm">
                <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
                  <ThemedPortrait alt={t.portraitAlt} />
                </div>
              </div>
              <figcaption className="mt-3 flex items-center justify-between px-2 font-mono text-[11px] tracking-tight text-foreground/45">
                <span>{profile.location}</span>
                <span className="hidden sm:inline">{t.hoverHint}</span>
              </figcaption>
            </figure>
          </ScaleUnblur>
        </div>

        <FadeIn delay={0.35} className="mt-16 sm:mt-24">
          <PipelineTrace />
        </FadeIn>
      </div>
    </section>
  );
}
