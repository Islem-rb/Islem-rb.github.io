import type { ReactNode } from "react";

import { getEducation } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";

type Entry = {
  school: string;
  degree: string;
  period: string;
};


const ROW_HEIGHT = 64;

export function Education({ lang }: { lang: Lang }): ReactNode {
  const entries: Entry[] = getEducation(lang);
  return (
    <div className="flex flex-col gap-3">
      <h2 className="eyebrow">{getDictionary(lang).about.education}</h2>
      <div className="sheet">
        <ul className="flex flex-col divide-y divide-border">
          {entries.map((entry) => (
            <li
              key={`${entry.school}-${entry.period}`}
              className="flex items-center gap-4 p-4"
              style={{ minHeight: ROW_HEIGHT }}
            >
              <GraduationYear entry={entry} />
              <div className="flex min-w-0 flex-col">
                <span className="text-foreground font-serif text-[17px] font-semibold tracking-[-0.025em]">
                  {entry.school}
                </span>
                <span className="text-muted-foreground mt-0.5 text-[14px] sm:text-[15px]">
                  {entry.degree}
                  <span className="text-foreground/30 mx-2">•</span>
                  <span className="text-muted-foreground whitespace-nowrap tabular-nums">{entry.period}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** The graduation year (or the expected one), where a logo would usually sit. */
function GraduationYear({ entry }: { entry: Entry }): ReactNode {
  return (
    <span
      aria-hidden="true"
      className="w-12 shrink-0 font-serif text-[17px] font-semibold tracking-[-0.02em] text-accent tabular-nums"
    >
      {entry.period.match(/\d{4}/g)?.at(-1)}
    </span>
  );
}
