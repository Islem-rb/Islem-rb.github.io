"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { categoryOf } from "@/lib/chat/map";
import type { Project } from "@/lib/content";
import { getDictionary, localePath, type Lang } from "@/lib/i18n";

const HEADING =
  "mt-7 text-[12.5px] font-semibold tracking-[0.04em] text-foreground/45 uppercase";
const BUTTON =
  "focus-ring inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border px-4.5 text-[14.5px] font-medium transition-colors";

/** A project's case study, opened from the map and shown beside it. */
export function CaseStudy({
  project,
  next,
  lang,
  onBack,
  onNext,
}: {
  project: Project;
  next: Project;
  lang: Lang;
  onBack: () => void;
  onNext: () => void;
}): ReactNode {
  const t = getDictionary(lang);
  const thumbnail = project.demo?.video?.poster ?? project.demo?.shots?.[0]?.src;
  const style = { "--c": `var(--${categoryOf(project.slug)})` } as CSSProperties;

  return (
    // Keyed by project so moving to the next one replays the entrance.
    <article key={project.slug} className="view-in" style={style}>
      <button
        type="button"
        onClick={onBack}
        className="focus-ring inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t.map.back}
      </button>

      <p className="mt-6 flex items-center gap-2 text-[13.5px] font-medium text-[var(--c)]">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[var(--c)]" />
        {project.kind} · {project.year}
      </p>
      <h2 className="mt-2 font-serif text-[1.95rem] font-semibold leading-[1.04] tracking-[-0.04em] text-foreground sm:text-[2.4rem]">
        {project.name}
      </h2>
      <p className="mt-3.5 text-[19px] leading-[1.4] text-pretty text-foreground">
        {project.headline}
      </p>

      {thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized
        <img
          src={thumbnail}
          alt=""
          className="mt-6 aspect-video w-full rounded-2xl border border-foreground/10 object-cover object-top"
        />
      ) : null}

      <p className="mt-5 text-pretty text-foreground/65">{project.summary}</p>

      {project.result ? (
        <p className="mt-5 rounded-r-md border-l-[3px] border-[var(--c)] bg-[color-mix(in_srgb,var(--c)_9%,var(--surface))] px-4.5 py-4">
          <span className="mb-1 block text-[12px] font-semibold tracking-[0.04em] text-[var(--c)] uppercase">
            {t.projects.result}
          </span>
          {project.result}
        </p>
      ) : null}

      <h3 className={HEADING}>{t.projects.highlights}</h3>
      <ul>
        {project.highlights.slice(0, 4).map((point) => (
          <li
            key={point}
            className="relative border-b border-foreground/10 py-2.5 pl-5 text-[15.5px] before:absolute before:top-[1.15rem] before:left-0.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--c)]"
          >
            {point}
          </li>
        ))}
      </ul>

      <h3 className={HEADING}>{t.projects.stack}</h3>
      <ul className="mt-2.5 flex flex-wrap gap-1.5">
        {project.stack.map((tool) => (
          <li
            key={tool}
            className="rounded-md border border-border bg-surface px-2.5 py-1 text-[13px] text-muted-foreground"
          >
            {tool}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap items-center gap-2.5">
        <Link
          href={localePath(lang, `/projects/${project.slug}`)}
          className={`${BUTTON} border-foreground bg-foreground text-background`}
        >
          {t.map.fullStudy}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        {project.repo ? (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BUTTON} border-foreground/20 hover:border-foreground`}
          >
            {t.projects.readSource}
            <ArrowUpRight className="h-4 w-4 text-foreground/55" aria-hidden="true" />
          </a>
        ) : null}
        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BUTTON} border-foreground/20 hover:border-foreground`}
          >
            {t.projects.liveDemo}
            <ArrowUpRight className="h-4 w-4 text-foreground/55" aria-hidden="true" />
          </a>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="focus-ring group mt-8 flex w-full cursor-pointer items-center justify-between border-t border-foreground py-4.5 text-left"
      >
        <span>
          <span className="block text-[12.5px] text-foreground/45">{t.projects.next}</span>
          <span className="font-serif text-[21px] font-semibold tracking-[-0.02em]">
            {next.name}
          </span>
        </span>
        <ArrowRight
          className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </button>
    </article>
  );
}
