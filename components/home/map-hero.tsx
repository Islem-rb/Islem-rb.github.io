"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { Ask, type AskHandle } from "@/components/chat/ask";
import { categoryOf, ringTool, toolsOf, type Category } from "@/lib/chat/map";
import type { Answer } from "@/lib/chat/types";
import { getProjects } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";
import { useReducedMotion } from "@/lib/motion";

import { CaseStudy } from "./case-study";
import { ProjectMap, type MapFocus, type MapMode } from "./project-map";

const STEP_MS = 700;

/**
 * The home page: a question box on the left, the map of everything on the
 * right. Answers light the map, and picking a point opens its case study.
 */
export function MapHero({
  lang,
  children,
}: {
  lang: Lang;
  /** Shown under the map, as the last slice of the page to arrive. */
  children?: ReactNode;
}): ReactNode {
  const t = getDictionary(lang);
  const projects = getProjects(lang);
  const reduced = useReducedMotion();

  const [stage, setStage] = useState(0);
  const [run, setRun] = useState(0);
  const [mode, setMode] = useState<MapMode>("map");
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const askRef = useRef<AskHandle>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  // The page arrives the way I ship: a small slice, health checks, then everyone.
  useEffect(() => {
    const timers = [1, 2, 3].map((step) =>
      window.setTimeout(() => setStage(step), reduced ? 0 : step * STEP_MS),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [run, reduced]);

  const replay = (): void => {
    setStage(0);
    setRun((n) => n + 1);
  };

  const open = projects.find((p) => p.slug === openSlug);

  const openProject = (slug: string): void => {
    const project = projects.find((p) => p.slug === slug);
    if (!project) return;
    setOpenSlug(slug);
    setCategory(null);
    setFocus({ slugs: [slug], tools: toolsOf(project) });
    // On a phone the study replaces the chat above the map, so bring it into view.
    const top = leftRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) leftRef.current?.scrollIntoView({ block: "start" });
  };

  const closeProject = (): void => {
    setOpenSlug(null);
    setFocus(null);
  };

  const handleAnswer = (result: Answer | null): void => {
    setCategory(null);
    if (!result) {
      setFocus(null);
      return;
    }
    if (result.mode) setMode(result.mode);
    if (result.replay) replay();
    if (result.open) {
      openProject(result.open);
      return;
    }
    const tool = result.focus?.tool ? ringTool(result.focus.tool) : undefined;
    setFocus(result.focus ? { slugs: result.focus.slugs, tools: tool ? [tool] : [] } : null);
  };

  const pickTool = (tool: string): void => {
    setOpenSlug(null);
    askRef.current?.ask(tool);
  };

  const pickCategory = (cat: Category): void => {
    const slugs = projects.filter((p) => categoryOf(p.slug) === cat).map((p) => p.slug);
    setOpenSlug(null);
    askRef.current?.push(t.map.cats[cat], {
      text: t.map.inCategory(slugs.length, t.map.cats[cat]),
      blocks: [{ type: "projects", slugs }],
      followUps: ["projects", "timeline", "skills"],
      focus: { slugs },
    });
    setCategory(cat);
  };

  return (
    <section className="rollout relative w-full" data-stage={stage}>
      <noscript>
        <style>{".rollout [data-at]{opacity:1!important;transform:none!important}"}</style>
      </noscript>
      <div className="rollout-bar" aria-hidden="true" />

      <div className="mx-auto grid w-full max-w-310 grid-cols-1 items-start gap-x-12 gap-y-6 px-5 pt-26 sm:px-8 sm:pt-30 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div ref={leftRef} data-at="1" className="scroll-mt-24">
          {/* Kept mounted while a case study is open, so the thread is still there on return. */}
          <div hidden={Boolean(open)}>
            <p className="inline-flex items-center gap-2 rounded-md border border-border bg-surface py-1 pr-3 pl-2.5 text-[13px] text-muted-foreground">
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  stage === 3 ? "bg-[var(--signal)]" : "bg-foreground/30"
                }`}
              />
              <span aria-live="polite">{t.map.phases[stage]}</span>
              <button
                type="button"
                onClick={replay}
                className="focus-ring cursor-pointer rounded-sm font-medium text-foreground underline decoration-foreground/25 underline-offset-4"
              >
                {t.map.replay}
              </button>
            </p>

            <h1 className="mt-6 font-serif text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-balance text-foreground sm:text-[2.8rem] xl:text-[3.35rem]">
              {t.hero.line1} {t.hero.line2}{" "}
              <span className="text-accent">{t.hero.emphasis}</span>
            </h1>
            <p className="mt-5 max-w-[44ch] text-[17.5px] leading-relaxed text-pretty text-muted-foreground">
              {t.map.intro}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-[14.5px] font-medium text-foreground">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--signal)]" />
              {t.hero.availability}
            </p>

            <div className="mt-7">
              <Ask ref={askRef} onAnswer={handleAnswer} onOpenProject={openProject} />
            </div>
          </div>

          {open ? (
            <CaseStudy
              project={open}
              next={projects[(projects.indexOf(open) + 1) % projects.length] ?? open}
              lang={lang}
              onBack={closeProject}
              onNext={() =>
                openProject(
                  (projects[(projects.indexOf(open) + 1) % projects.length] ?? open).slug,
                )
              }
            />
          ) : null}
        </div>

        <div data-at="2" className="lg:sticky lg:top-24">
          <ProjectMap
            lang={lang}
            mode={mode}
            focus={focus}
            category={category}
            onMode={setMode}
            onProject={openProject}
            onTool={pickTool}
            onCategory={pickCategory}
            zoomTo={openSlug}
          />
        </div>
      </div>

      <div data-at="3">{children}</div>
    </section>
  );
}
