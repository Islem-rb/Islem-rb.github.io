import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ContactCard } from "@/components/contact/contact-card";
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram";
import { FlowPanel, PROJECT_ICONS } from "@/components/projects/projects";
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
  const t = getDictionary(lang).projects;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  if (!project) notFound();

  const next = projects[(index + 1) % projects.length]!;
  const Icon = PROJECT_ICONS[project.slug];
  const architecture = getArchitecture(lang, project.slug);
  const lessons = getLessons(lang, project.slug);

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-275 px-6 pt-36 sm:px-10 sm:pt-44">
        <FadeIn className="flex flex-col gap-6">
          <Link
            href={localePath(lang, "/projects")}
            className="focus-ring group inline-flex w-fit items-center gap-1.5 rounded-md text-[14px] font-medium tracking-tight text-foreground/55 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
            {t.back}
          </Link>

          <div className="flex items-center gap-2.5 font-mono text-[12px] tracking-tight text-foreground/50">
            {Icon ? (
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-foreground/10 bg-background">
                <Icon className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
              </span>
            ) : null}
            {project.kind} · {project.year}
          </div>

          <h1 className="font-serif text-[2.75rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[3.25rem] lg:text-[4rem]">
            {project.name}
          </h1>
          <p className="max-w-[40ch] text-[20px] leading-[1.4] tracking-tight text-foreground/65 sm:text-[24px]">
            {project.headline}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background"
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
                className="focus-ring group inline-flex h-11 items-center gap-2 rounded-xl border border-foreground/8 bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/4"
              >
                {t.liveDemo}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </a>
            ) : null}
            <span className="text-[13px] tracking-tight text-foreground/50">
              {project.meta}
            </span>
          </div>
        </FadeIn>
      </section>

      {architecture ? (
        <section
          aria-labelledby="architecture-heading"
          className="mx-auto w-full max-w-275 px-6 pt-14 sm:px-10 sm:pt-20"
        >
          <FadeIn delay={0.1} className="flex flex-col gap-5">
            <h2
              id="architecture-heading"
              className="font-mono text-[12px] tracking-tight text-foreground/50 uppercase"
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

      <section className="mx-auto w-full max-w-275 px-6 pt-14 pb-10 sm:px-10 sm:pt-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_22rem] md:gap-14">
          <FadeIn delay={0.15} className="flex min-w-0 flex-col gap-12">
            <p className="max-w-[60ch] text-[18px] leading-[1.65] tracking-tight text-foreground/80 sm:text-[19px]">
              {project.summary}
            </p>

            {project.result ? (
              <div className="rounded-3xl border border-foreground/8 bg-foreground/2 p-6 dark:bg-foreground/4">
                <p className="mb-2 font-mono text-[11px] tracking-tight text-foreground/50 uppercase">
                  {t.result}
                </p>
                <p className="text-[18px] leading-[1.5] font-medium tracking-tight text-foreground sm:text-[20px]">
                  {project.result}
                </p>
              </div>
            ) : null}

            {project.sections.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h2 className="text-[22px] font-medium tracking-tight text-foreground">
                  {section.title}
                </h2>
                <ul className="flex max-w-[62ch] flex-col gap-3">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="relative pl-5 text-[16px] leading-[1.6] tracking-tight text-foreground/70 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-foreground/30 sm:text-[17px]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </FadeIn>

          <FadeIn delay={0.25}>
            <aside className="project-card flex flex-col gap-6 rounded-3xl border border-foreground/8 bg-background p-3.5 md:sticky md:top-28">
              <FlowPanel project={project} />
              <div className="flex flex-col gap-3 px-1.5">
                <h2 className="text-[13px] font-semibold tracking-tight text-foreground">
                  {t.stack}
                </h2>
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-md border border-foreground/8 bg-foreground/2 px-2 py-1 font-mono text-[11px] tracking-tight text-foreground/70"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3 px-1.5 pb-2">
                <h2 className="text-[13px] font-semibold tracking-tight text-foreground">
                  {t.glance}
                </h2>
                <ul className="flex flex-col gap-1.5">
                  {project.highlights.map((h) => (
                    <li key={h} className="font-mono text-[12px] tracking-tight text-foreground/65">
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
        <section className="mx-auto w-full max-w-275 px-6 pb-10 sm:px-10">
          <FadeIn className="grid grid-cols-1 gap-3 rounded-4xl border border-foreground/8 bg-background p-1.5 shadow-sm md:grid-cols-2">
            {[
              { title: t.learned, items: lessons.learned },
              { title: t.nextSteps, items: lessons.next },
            ].map((block) => (
              <div
                key={block.title}
                className="flex flex-col gap-4 rounded-[1.6rem] border border-foreground/5 bg-foreground/2 p-6 sm:p-7 dark:bg-foreground/4"
              >
                <h2 className="text-[20px] font-medium tracking-tight text-foreground">
                  {block.title}
                </h2>
                <ul className="flex flex-col gap-3">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="relative pl-5 text-[16px] leading-[1.6] tracking-tight text-foreground/70 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-foreground/30"
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

      <section className="mx-auto w-full max-w-275 px-6 pt-6 sm:px-10">
        <Link
          href={localePath(lang, `/projects/${next.slug}`)}
          className="focus-ring group flex items-center justify-between gap-6 rounded-3xl border border-foreground/8 bg-background px-6 py-6 transition-colors hover:bg-foreground/2 sm:px-8"
        >
          <span className="flex flex-col gap-1">
            <span className="font-mono text-[11px] tracking-tight text-foreground/45 uppercase">
              {t.next}
            </span>
            <span className="font-serif text-[1.75rem] font-medium tracking-tight text-foreground sm:text-[2rem]">
              {next.name}
            </span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-foreground/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground" aria-hidden="true" />
        </Link>
      </section>

      <ContactCard lang={lang} />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
