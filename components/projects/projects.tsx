import { ArrowRight, Github, Play } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { categoryOf } from "@/lib/chat/map";
import { getProjects, type Project } from "@/lib/content";
import { getDictionary, localePath, type Dictionary, type Lang } from "@/lib/i18n";

/** The project's picture, if it has one: the video poster or the first screenshot. */
export function coverOf(project: Project): string | undefined {
  return project.demo?.video?.poster ?? project.demo?.shots?.[0]?.src;
}

/** Every project as a numbered sheet, two to a row. */
export function Projects({ lang }: { lang: Lang }): ReactNode {
  const t = getDictionary(lang);
  const all = getProjects(lang);

  return (
    <section className="mx-auto w-full max-w-310 px-5 sm:px-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {all.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} lang={lang} t={t} />
        ))}
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
  const cat = categoryOf(project.slug);
  const cover = coverOf(project);
  return (
    <FadeIn delay={(index % 2) * 0.06} className="h-full">
      <article
        className="sheet group relative flex h-full flex-col p-5 transition-colors hover:border-foreground/40 sm:p-6"
        style={{ "--c": `var(--${cat})` } as CSSProperties}
      >
        <header className="flex items-center gap-3 text-[13px]">
          <span className="font-serif font-semibold text-accent tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden="true" className="h-px w-5 bg-border" />
          <span className="inline-flex items-center gap-2 font-medium text-[var(--c)]">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--c)]" />
            {t.map.cats[cat]}
          </span>
          <span className="ml-auto text-muted-foreground tabular-nums">{project.year}</span>
        </header>

        {cover ? (
          <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-md border border-border bg-muted">
            <img
              src={cover}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
            {project.demo?.video ? (
              <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-sm bg-background/90 px-2 py-1 text-[12px] font-medium text-foreground">
                <Play className="h-3 w-3" aria-hidden="true" />
                {t.projects.demo}
              </span>
            ) : null}
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="relative mt-5 flex aspect-[16/9] items-end overflow-hidden rounded-md border border-border p-4"
            style={{
              backgroundColor: "color-mix(in srgb, var(--c) 8%, var(--background))",
              backgroundImage:
                "linear-gradient(color-mix(in srgb, var(--c) 14%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--c) 14%, transparent) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          >
            <span className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[var(--c)]" />
            <span className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--c)]" />
            <span className="relative flex flex-wrap gap-1.5">
              {project.stack.slice(0, 3).map((tool) => (
                <span
                  key={tool}
                  className="rounded-sm border border-border bg-surface px-2 py-1 text-[12px] text-foreground/80"
                >
                  {tool}
                </span>
              ))}
            </span>
          </div>
        )}

        <h3 className="mt-5 font-serif text-[1.45rem] leading-[1.1] font-semibold tracking-[-0.035em] text-foreground">
          <Link
            href={localePath(lang, `/projects/${project.slug}`)}
            className="focus-ring rounded-sm after:absolute after:inset-0 after:content-['']"
          >
            {project.name}
          </Link>
        </h3>
        <p className="mt-2 text-[16px] leading-snug text-pretty text-foreground/85">
          {project.headline}
        </p>
        <p className="mt-3 text-[14.5px] leading-relaxed text-pretty text-muted-foreground">
          {project.summary}
        </p>
        <p className="mt-4 text-[13px] text-muted-foreground">
          {project.stack.slice(0, 5).join(" · ")}
        </p>

        <div className="min-h-5 flex-1" />
        <footer className="flex items-center gap-3 border-t border-border pt-4">
          <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground">
            {t.projects.caseStudy}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.projects.source(project.name)}
              className="focus-ring relative z-10 ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground/60 transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
        </footer>
      </article>
    </FadeIn>
  );
}
