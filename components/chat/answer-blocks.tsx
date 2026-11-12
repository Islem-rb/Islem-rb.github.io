"use client";

import { ArrowRight, ArrowUpRight, FileDown } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { ContactButton } from "@/components/contact/contact-button";
import { categoryOf, mapLabel } from "@/lib/chat/map";
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

const PANEL = "rounded-2xl border border-foreground/10 bg-background/60 p-4 sm:p-5";
const LABEL = "text-[12.5px] text-foreground/50";
const GHOST_LINK =
  "focus-ring group inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-foreground/20 px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground";

type BlockProps = {
  lang: Lang;
  t: Dictionary;
  onOpenProject: (slug: string) => void;
};

/** The cards under a typed answer. They fade up one after another. */
export function AnswerBlocks({
  blocks,
  ...props
}: BlockProps & { blocks: Block[] }): ReactNode {
  if (blocks.length === 0) return null;
  return (
    <StaggerContainer className="flex flex-col gap-3">
      {blocks.map((block) => (
        <BlockView key={block.type} block={block} {...props} />
      ))}
    </StaggerContainer>
  );
}

function BlockView({
  block,
  lang,
  t,
  onOpenProject,
}: BlockProps & { block: Block }): ReactNode {
  switch (block.type) {
    case "projects": {
      const all = getProjects(lang);
      const items = block.slugs.flatMap((slug) => all.find((p) => p.slug === slug) ?? []);
      return (
        <>
          <div className="border-b border-foreground/10">
            {items.map((project) => (
              <StaggerItem key={project.slug} className="border-t border-foreground/10">
                <div style={{ "--c": `var(--${categoryOf(project.slug)})` } as CSSProperties}>
                  <button
                    type="button"
                    onClick={() => onOpenProject(project.slug)}
                    aria-label={t.ask.openProject(project.name)}
                    className="focus-ring group flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-md py-2.5 text-left"
                  >
                    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--c)]" />
                    <span className="font-serif text-[17px] font-semibold tracking-[-0.01em] text-foreground group-hover:underline group-hover:underline-offset-4">
                      {mapLabel(project)}
                    </span>
                    <span className="ml-auto text-right text-[13px] text-foreground/45">
                      {project.kind} · {project.year}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-foreground/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-foreground"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </StaggerItem>
            ))}
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
                <dd className="text-[14.5px] leading-normal text-foreground/85">
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
                <h3 className="font-serif text-[17px] font-semibold tracking-[-0.01em] text-foreground">
                  {job.role} · {job.company}
                </h3>
                <span className={LABEL}>
                  {job.period} · {job.location}
                </span>
              </div>
              <p className="mt-2 text-[14.5px] leading-normal text-foreground/65">
                {job.points[0]}
              </p>
              {"project" in job && job.project ? (
                <button
                  type="button"
                  onClick={() => onOpenProject(job.project)}
                  className="focus-ring group mt-3 inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-md text-sm font-medium text-foreground"
                >
                  {t.about.seeProject}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>
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
                <span className="text-[15px] text-foreground">
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
              className="inline-flex items-center gap-2 rounded-full border border-foreground/10 px-3.5 py-2 text-sm text-foreground"
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
                <dd className="text-[15px] leading-snug text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </StaggerItem>
      );
  }
}

function ExternalLink({ href, label }: { href: string; label: string }): ReactNode {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={GHOST_LINK}>
      {label}
      <ArrowUpRight className="h-4 w-4 text-foreground/55" aria-hidden="true" />
    </a>
  );
}
