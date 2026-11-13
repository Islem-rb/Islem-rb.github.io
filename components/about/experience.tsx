"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { getExperience } from "@/lib/content";
import { localePath } from "@/lib/i18n";
import { useLang } from "@/lib/use-lang";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Experience(): ReactNode {
  const { lang, t } = useLang();
  const entries = getExperience(lang);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="eyebrow">{t.about.experience}</h2>
      <div className="sheet">
        <ul className="flex flex-col divide-y divide-border">
          {entries.map((entry, i) => {
            const isOpen = open === i;
            const panelId = `exp-panel-${i}`;
            return (
              <li
                key={entry.company}
                className=""
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="focus-ring flex w-full cursor-pointer items-center gap-4 p-4 text-left transition-colors hover:bg-background/60"
                >
                  <span
                    aria-hidden="true"
                    className="w-12 shrink-0 font-serif text-[17px] font-semibold tracking-[-0.02em] text-accent tabular-nums"
                  >
                    {entry.period.match(/\d{4}/g)?.at(-1)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-foreground font-serif text-[17px] font-semibold tracking-[-0.025em]">
                      {entry.company}
                    </span>
                    <span className="text-muted-foreground mt-0.5 text-[14px] sm:text-[15px]">
                      {entry.role}
                      <span className="text-foreground/30 mx-2">•</span>
                      <span className="text-muted-foreground whitespace-nowrap tabular-nums">{entry.period}</span>
                    </span>
                  </span>
                  <m.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-muted-foreground mr-2 inline-flex"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </m.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      id={panelId}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-3 px-4 pt-0 pb-5 sm:pl-[5rem]">
                        <ul className="flex flex-col gap-2">
                          {entry.points.map((point) => (
                            <li
                              key={point}
                              className="text-foreground/80 relative pl-4 text-[15px] leading-[1.55] before:bg-accent before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                        {"project" in entry ? (
                          <Link
                            href={localePath(lang, `/projects/${entry.project}`)}
                            className="focus-ring text-foreground group inline-flex w-fit items-center gap-1 rounded-md text-[14px] font-medium tracking-tight"
                          >
                            {t.about.seeProject}
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                          </Link>
                        ) : null}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
