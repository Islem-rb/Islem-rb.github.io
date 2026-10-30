import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Building2,
  Car,
  Cloud,
  Github,
  Megaphone,
  Sprout,
  Stethoscope,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import Link from "next/link";

import { FadeIn } from "@/components/ui/motion-primitives";
import { getProjects, type Project } from "@/lib/content";
import { getDictionary, localePath, type Dictionary, type Lang } from "@/lib/i18n";

export const PROJECT_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  "gitops-eks-platform": Cloud,
  "devops-observability-platform": Activity,
  cityvoice: Building2,
  "verdustry-social": Megaphone,
  carnova: Car,
  dawrek: Stethoscope,
  "automotive-ml": BrainCircuit,
  sabeel: Sprout,
};

export type ProjectsProps = {
  lang: Lang;
  withHeadline?: boolean;
  viewMoreVisible?: boolean;
};

export function Projects({
  lang,
  withHeadline = false,
  viewMoreVisible = false,
}: ProjectsProps): ReactNode {
  const t = getDictionary(lang);
  const all = getProjects(lang);
  const items = viewMoreVisible ? all.filter((p) => p.featured) : all;

  return (
    <section className="relative w-full" aria-labelledby={withHeadline ? "projects-heading" : undefined}>
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {withHeadline ? (
          <FadeIn className="flex flex-col items-center gap-5 pt-4 pb-10 text-center sm:pt-6 sm:pb-14">
            <h2
              id="projects-heading"
              className="font-serif text-[2.5rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[3rem] lg:text-[3.5rem]"
            >
              {t.projects.heading}
            </h2>
            <p className="max-w-[36ch] text-[18px] leading-[1.45] tracking-tight text-foreground/65 sm:text-[20px]">
              {t.projects.intro}
            </p>
          </FadeIn>
        ) : null}

        <div className="columns-1 gap-6 md:columns-2 md:gap-7">
          {items.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} lang={lang} t={t} />
          ))}
        </div>

        {viewMoreVisible ? (
          <div className="mt-12 flex justify-center sm:mt-16">
            <Link
              href={localePath(lang, "/projects")}
              className="focus-ring group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-foreground/8 bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
            >
              {t.projects.all(all.length)}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  lang,
  t,
}: {
  project: Project;
  index: number;
  lang: Lang;
  t: Dictionary;
}): ReactNode {
  const Icon = PROJECT_ICONS[project.slug] ?? Cloud;
  return (
    <FadeIn
      delay={Math.min(index * 0.06, 0.3)}
      className="mb-6 break-inside-avoid md:mb-7"
    >
      <article className="project-card group/card relative flex flex-col gap-4 rounded-3xl border border-foreground/8 bg-background p-3 sm:p-3.5">
        <header className="flex items-center gap-2.5 px-1 pt-2">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-foreground/10 bg-background">
            <Icon className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium tracking-tight text-foreground">
            {project.name}
          </span>
          <span className="ml-auto shrink-0 font-mono text-[11px] tracking-tight text-foreground/45">
            <span className="hidden sm:inline">{project.kind} · </span>
            {project.year}
          </span>
        </header>

        <FlowPanel project={project} />

        <div className="flex flex-col gap-2.5 px-1 pb-1">
          <h3 className="text-[20px] font-medium leading-[1.2] tracking-tight text-foreground sm:text-[22px]">
            <Link
              href={localePath(lang, `/projects/${project.slug}`)}
              className="focus-ring rounded-md after:absolute after:inset-0 after:rounded-3xl after:content-['']"
            >
              {project.headline}
            </Link>
          </h3>
          <p className="text-[14px] leading-normal tracking-tight text-foreground/65 sm:text-[15px]">
            {project.summary}
          </p>
        </div>

        <ul className="flex flex-wrap gap-1.5 px-1" aria-label={t.projects.highlights}>
          {project.highlights.map((h) => (
            <li
              key={h}
              className="rounded-md border border-foreground/8 bg-foreground/2 px-2 py-1 font-mono text-[11px] tracking-tight text-foreground/70"
            >
              {h}
            </li>
          ))}
        </ul>

        <footer className="flex items-center gap-3 px-1 pb-1.5">
          <span className="text-[12px] tracking-tight text-foreground/50">
            {project.meta}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-[13px] font-medium tracking-tight text-foreground/70 transition-colors group-hover/card:text-foreground">
            {t.projects.caseStudy}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" aria-hidden="true" />
          </span>
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.projects.source(project.name)}
              className="focus-ring relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-foreground/8 text-foreground/60 transition-colors hover:border-foreground/15 hover:text-foreground"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
        </footer>
      </article>
    </FadeIn>
  );
}

/**
 * The project's delivery path, drawn like a CI run. On card hover each
 * stage completes in turn.
 */
export function FlowPanel({ project }: { project: Project }): ReactNode {
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-foreground/[0.035] ring-1 ring-foreground/5 dark:bg-foreground/5"
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute inset-0 text-foreground/10"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      <div className="relative flex items-center justify-between border-b border-foreground/6 px-4 py-2.5 font-mono text-[11px] tracking-tight text-foreground/45">
        <span>{project.slug}</span>
        <span className="flow-status">main</span>
      </div>
      <ol className="relative flex flex-col px-4 py-3.5">
        {project.flow.map((step, i) => (
          <li
            key={step}
            className="flow-step flex items-center gap-3 py-[5px]"
            style={{ "--i": i } as React.CSSProperties}
          >
            <span className="flow-dot relative z-10 inline-flex h-[11px] w-[11px] shrink-0 rounded-full border border-foreground/25 bg-background" />
            <span className="font-mono text-[12.5px] tracking-tight text-foreground/75">
              {step}
            </span>
            <span className="flow-rule h-px flex-1 bg-foreground/8" />
            <span className="flow-check font-mono text-[11px] text-foreground/35">
              {String(i + 1).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
