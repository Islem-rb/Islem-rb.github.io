"use client";

import { ArrowRight, ArrowUpRight, Cloud, FileDown, Play } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ContactButton } from "@/components/contact/contact-button";
import { PipelineTrace } from "@/components/hero/pipeline-trace";
import { PROJECT_ICONS } from "@/components/projects/projects";
import type { Block } from "@/lib/chat/types";
import {
  getEducation,
  getExperience,
  getLanguages,
  getProjects,
  getSkillGroups,
  profile,
} from "@/lib/content";
import { localePath, type Dictionary, type Lang } from "@/lib/i18n";
import { StaggerContainer, StaggerItem } from "@/lib/motion";

const PANEL =
  "rounded-3xl border border-foreground/8 bg-background p-4 sm:p-5";
const LABEL = "font-mono text-[11px] tracking-tight text-foreground/45";
const GHOST_LINK =
  "focus-ring group inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-foreground/8 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5";

type BlockProps = { lang: Lang; t: Dictionary };

/** The cards under a typed answer. They fade up one after another. */
export function AnswerBlocks({
  blocks,
  lang,
  t,
}: BlockProps & { blocks: Block[] }): ReactNode {
  if (blocks.length === 0) return null;
  return (
    <StaggerContainer className="flex flex-col gap-3">
      {blocks.map((block) => (
        <BlockView key={block.type} block={block} lang={lang} t={t} />
      ))}
    </StaggerContainer>
  );
}

function BlockView({ block, lang, t }: BlockProps & { block: Block }): ReactNode {
  switch (block.type) {
    case "projects":
      return <ProjectsBlock block={block} lang={lang} t={t} />;
    case "skills":
      return (
        <StaggerItem className={PANEL}>
          <dl className="flex flex-col gap-3">
            {getSkillGroups(lang).map((group) => (
              <div
                key={group.label}
                className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4"
              >
                <dt className={`${LABEL} sm:pt-0.5`}>{group.label}</dt>
                <dd className="text-[14px] leading-normal tracking-tight text-foreground/80 sm:text-[15px]">
                  {group.items}
                </dd>
              </div>
            ))}
          </dl>
        </StaggerItem>
      );
    case "experience":
      return (
        <>
          {getExperience(lang).map((job) => (
            <StaggerItem key={job.company} className={PANEL}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[16px] font-medium tracking-tight text-foreground">
                  {job.role} · {job.company}
                </h3>
                <span className={LABEL}>
                  {job.period} · {job.location}
                </span>
              </div>
              <p className="mt-2 text-[14px] leading-normal tracking-tight text-foreground/65 sm:text-[15px]">
                {job.points[0]}
              </p>
              {"project" in job && job.project ? (
                <Link
                  href={localePath(lang, `/projects/${job.project}`)}
                  className="focus-ring group mt-3 inline-flex min-h-8 items-center gap-1.5 rounded-md text-sm font-medium text-foreground"
                >
                  {t.about.seeProject}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ) : null}
            </StaggerItem>
          ))}
        </>
      );
    case "education":
      return (
        <StaggerItem className={PANEL}>
          <ul className="flex flex-col gap-3">
            {getEducation(lang).map((item) => (
              <li
                key={item.school}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5"
              >
                <span className="text-[15px] tracking-tight text-foreground">
                  <span className="font-medium">{item.school}</span>
                  <span className="text-foreground/65"> · {item.degree}</span>
                </span>
                <span className={LABEL}>{item.period}</span>
              </li>
            ))}
          </ul>
        </StaggerItem>
      );
    case "languages":
      return (
        <StaggerItem className="flex flex-wrap gap-2">
          {getLanguages(lang).map((language) => (
            <span
              key={language.name}
              className="inline-flex items-center gap-2 rounded-xl border border-foreground/8 bg-background px-3.5 py-2 text-sm tracking-tight text-foreground"
            >
              <span className="font-medium">{language.name}</span>
              <span className={LABEL}>{language.level}</span>
            </span>
          ))}
        </StaggerItem>
      );
    case "contact":
      return (
        <StaggerItem className="flex flex-wrap items-center gap-2.5">
          <ContactButton />
          <ExternalLink href={profile.linkedin} label="LinkedIn" />
          <ExternalLink href={profile.github} label="GitHub" />
        </StaggerItem>
      );
    case "cv": {
      const order: Lang[] = lang === "fr" ? ["fr", "en"] : ["en", "fr"];
      const labels = [t.about.cvPrimary, t.about.cvSecondary];
      return (
        <StaggerItem className="flex flex-wrap items-center gap-2.5">
          {order.map((cvLang, i) => (
            <a
              key={cvLang}
              href={profile.cv[cvLang]}
              download
              className={
                i === 0
                  ? "focus-ring inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background"
                  : GHOST_LINK
              }
            >
              <FileDown className="h-4 w-4" aria-hidden="true" />
              {labels[i]}
            </a>
          ))}
        </StaggerItem>
      );
    }
    case "pipeline":
      return (
        <StaggerItem>
          <PipelineTrace />
        </StaggerItem>
      );
    case "terminal":
      return (
        <StaggerItem className="overflow-x-auto rounded-2xl border border-foreground/8 bg-foreground/4 px-4 py-3.5 dark:bg-foreground/6">
          <pre className="font-mono text-[12px] leading-[1.7] tracking-tight text-foreground/80">
            {block.lines.join("\n")}
          </pre>
        </StaggerItem>
      );
    case "facts":
      return (
        <StaggerItem className={PANEL}>
          <dl className="grid gap-4 sm:grid-cols-3">
            {[
              [t.about.basedIn, profile.location],
              [t.about.studying, t.about.studyingValue],
              [t.about.lookingFor, t.about.lookingForValue],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <dt className={LABEL}>{label}</dt>
                <dd className="text-[15px] leading-snug tracking-tight text-foreground">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </StaggerItem>
      );
  }
}

function ProjectsBlock({
  block,
  lang,
  t,
}: BlockProps & { block: Extract<Block, { type: "projects" }> }): ReactNode {
  const all = getProjects(lang);
  const items = block.slugs.flatMap((slug) => all.find((p) => p.slug === slug) ?? []);
  return (
    <>
      <div className={`grid gap-3 ${items.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {items.map((project) => {
          const Icon = PROJECT_ICONS[project.slug] ?? Cloud;
          const thumbnail =
            project.demo?.video?.poster ?? project.demo?.shots?.[0]?.src;
          return (
            <StaggerItem key={project.slug}>
              <article className="group/card relative flex h-full flex-col gap-3 rounded-3xl border border-foreground/8 bg-background p-4 transition-colors hover:border-foreground/20 sm:p-5">
                <header className="flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-foreground/10 bg-background">
                    <Icon className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium tracking-tight text-foreground">
                    {project.name}
                  </span>
                  {project.demo ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-foreground/10 px-1.5 py-0.5 font-mono text-[10px] tracking-tight text-foreground/70">
                      {project.demo.video ? (
                        <Play className="h-2.5 w-2.5" aria-hidden="true" />
                      ) : null}
                      {t.projects.demo}
                    </span>
                  ) : null}
                  <span className={`ml-auto shrink-0 ${LABEL}`}>{project.year}</span>
                </header>
                {thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized
                  <img
                    src={thumbnail}
                    alt=""
                    loading="lazy"
                    className="aspect-video w-full rounded-2xl border border-foreground/8 object-cover object-top"
                  />
                ) : null}
                <h3 className="text-[17px] font-medium leading-[1.25] tracking-tight text-foreground">
                  <Link
                    href={localePath(lang, `/projects/${project.slug}`)}
                    className="focus-ring rounded-md after:absolute after:inset-0 after:rounded-3xl after:content-['']"
                  >
                    {project.headline}
                  </Link>
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 5).map((tool) => (
                    <li
                      key={tool}
                      className="rounded-md border border-foreground/10 px-1.5 py-0.5 font-mono text-[10.5px] tracking-tight text-foreground/65"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-foreground/65 transition-colors group-hover/card:text-foreground">
                  {t.projects.caseStudy}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover/card:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </article>
            </StaggerItem>
          );
        })}
      </div>
      {block.showAll ? (
        <StaggerItem>
          <Link href={localePath(lang, "/projects")} className={GHOST_LINK}>
            {t.ask.allProjects(all.length)}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </StaggerItem>
      ) : null}
    </>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }): ReactNode {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={GHOST_LINK}>
      {label}
      <ArrowUpRight className="h-4 w-4 text-foreground/55" aria-hidden="true" />
    </a>
  );
}
