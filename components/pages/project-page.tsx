import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

import { ArchitectureDiagram } from "@/components/projects/architecture-diagram";
import { DemoMedia } from "@/components/projects/demo";
import { FlowCover } from "@/components/projects/flow-cover";
import { KeyFigure } from "@/components/projects/key-figure";
import { categoryOf } from "@/lib/chat/map";
import { getArchitecture, getLessons } from "@/lib/case-studies";
import { FadeIn } from "@/components/ui/motion-primitives";
import { getProjects, PROJECTS } from "@/lib/content";
import { getDictionary, localePath, type Lang } from "@/lib/i18n";
import { createMetadata } from "@/lib/metadata";

export function projectStaticParams(): { slug: string }[] {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function projectMetadata(lang: Lang, slug: string): Metadata {
  const project = getProjects(lang).find((p) => p.slug === slug);
  if (!project) return {};
  return createMetadata({
    lang,
    title: project.name,
    description: project.headline,
    path: `/projects/${project.slug}`,
  });
}

export function ProjectPage({ lang, slug }: { lang: Lang; slug: string }): ReactNode {
  const projects = getProjects(lang);
  const dict = getDictionary(lang);
  const t = dict.projects;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  if (!project) notFound();

  const next = projects[(index + 1) % projects.length]!;
  const cat = categoryOf(project.slug);
  const architecture = getArchitecture(lang, project.slug);
  const lessons = getLessons(lang, project.slug);

  return (
    <main
      id="main-content"
      className="flex flex-1 flex-col"
      style={{ "--c": `var(--${cat})` } as CSSProperties}
    >
      <section className="mx-auto grid w-full max-w-310 grid-cols-1 gap-10 px-5 pt-28 sm:px-8 sm:pt-36 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end lg:gap-14">
        <FadeIn className="flex min-w-0 flex-col gap-6">
          <Link
            href={localePath(lang, "/projects")}
            className="focus-ring group inline-flex w-fit items-center gap-1.5 rounded-sm text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
            {t.back}
          </Link>

          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px]">
            <span className="inline-flex items-center gap-2 font-medium text-[var(--c)]">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--c)]" />
              {dict.map.cats[cat]}
            </span>
            <span aria-hidden="true" className="h-px w-5 bg-border" />
            <span className="text-muted-foreground">
              {project.kind} · {project.year}
            </span>
          </p>

          <h1 className="font-serif text-[2.4rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance text-foreground sm:text-[3.2rem] lg:text-[3.8rem]">
            {project.name}
          </h1>
          <p className="max-w-[42ch] text-[19px] leading-snug text-pretty text-foreground/80 sm:text-[22px]">
            {project.headline}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                {t.readSource}
              </a>
            ) : null}
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring group inline-flex h-11 items-center gap-2 rounded-md border border-foreground/25 px-5 text-sm font-medium text-foreground transition-colors hover:border-foreground"
              >
                {t.liveDemo}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </a>
            ) : null}
            <span className="text-[13px] text-muted-foreground">
              {project.meta}
            </span>
          </div>
        </FadeIn>

        {project.figure || !project.demo ? (
          <FadeIn delay={0.1}>
            <div className="sheet flex flex-col gap-5 p-5">
              {project.demo ? null : (
                <div className="aspect-video overflow-hidden rounded-md border border-border">
                  <FlowCover project={project} />
                </div>
              )}
              {project.figure ? <KeyFigure figure={project.figure} size="lg" /> : null}
            </div>
          </FadeIn>
        ) : null}
      </section>

      {project.demo ? (
        <section
          aria-labelledby="demo-heading"
          className="mx-auto w-full max-w-310 px-5 pt-14 sm:px-8 sm:pt-20"
        >
          <FadeIn delay={0.1} className="flex flex-col gap-5">
            <h2
              id="demo-heading"
              className="eyebrow"
            >
              {t.demo}
            </h2>
            <DemoMedia demo={project.demo} name={project.name} lang={lang} />
          </FadeIn>
        </section>
      ) : null}

      {architecture ? (
        <section
          aria-labelledby="architecture-heading"
          className="mx-auto w-full max-w-310 px-5 pt-14 sm:px-8 sm:pt-20"
        >
          <FadeIn delay={0.1} className="flex flex-col gap-5">
            <h2
              id="architecture-heading"
              className="eyebrow"
            >
              {t.architecture}
            </h2>
            <ArchitectureDiagram
              architecture={architecture}
              label={t.architectureLabel(project.name)}
              feedbackLabel={t.feedback}
            />
          </FadeIn>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-310 px-5 pt-14 pb-10 sm:px-8 sm:pt-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_20rem] md:gap-16">
          <FadeIn delay={0.15} className="flex min-w-0 flex-col gap-12">
            <p className="max-w-[60ch] text-[18px] leading-[1.65] text-foreground/85 sm:text-[19px]">
              {project.summary}
            </p>

            {project.result ? (
              <div className="rounded-r-md border-l-[3px] border-[var(--c)] bg-[color-mix(in_srgb,var(--c)_9%,var(--surface))] px-6 py-5">
                <p className="mb-1.5 text-[12px] font-semibold tracking-[0.1em] text-[var(--c)] uppercase">
                  {t.result}
                </p>
                <p className="text-[18px] leading-normal font-medium text-foreground sm:text-[20px]">
                  {project.result}
                </p>
              </div>
            ) : null}

            {project.sections.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h2 className="font-serif text-[1.35rem] font-semibold tracking-[-0.03em] text-foreground">
                  {section.title}
                </h2>
                <ul className="flex max-w-[62ch] flex-col gap-3">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="relative border-b border-border pb-3 pl-5 text-[16px] leading-[1.6] text-foreground/80 before:absolute before:top-[0.6em] before:left-0.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--c)] sm:text-[17px]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </FadeIn>

          <FadeIn delay={0.25}>
            <aside className="sheet flex flex-col gap-6 p-5 md:sticky md:top-24">
              <div className="flex flex-col gap-3">
                <h2 className="eyebrow">
                  {t.stack}
                </h2>
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-sm border border-border bg-background px-2 py-1 text-[13px] text-foreground/80"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3 border-t border-border pt-5">
                <h2 className="eyebrow">
                  {t.glance}
                </h2>
                <ul className="flex flex-col gap-1.5">
                  {project.highlights.map((h) => (
                    <li key={h} className="text-[14.5px] leading-snug text-foreground/80">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </FadeIn>
        </div>
      </section>

      {lessons ? (
        <section className="mx-auto w-full max-w-310 px-5 pb-10 sm:px-8">
          <FadeIn className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {[
              { title: t.learned, items: lessons.learned },
              { title: t.nextSteps, items: lessons.next },
            ].map((block) => (
              <div
                key={block.title}
                className="sheet flex flex-col gap-4 p-6 sm:p-7"
              >
                <h2 className="font-serif text-[1.3rem] font-semibold tracking-[-0.03em] text-foreground">
                  {block.title}
                </h2>
                <ul className="flex flex-col gap-3">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="relative pl-5 text-[16px] leading-[1.6] text-foreground/80 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-accent"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </FadeIn>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-310 px-5 pt-6 sm:px-8">
        <Link
          href={localePath(lang, `/projects/${next.slug}`)}
          className="focus-ring group flex items-center justify-between gap-6 border-y border-foreground py-6 transition-colors hover:bg-surface sm:px-2"
        >
          <span className="flex flex-col gap-1.5">
            <span className="eyebrow">{t.next}</span>
            <span className="font-serif text-[1.6rem] font-semibold tracking-[-0.035em] text-foreground sm:text-[2rem]">
              {next.name}
            </span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-foreground/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground" aria-hidden="true" />
        </Link>
      </section>

    </main>
  );
}
