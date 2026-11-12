import type { ReactNode } from "react";

import { getEducation } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";

type Entry = {
  school: string;
  degree: string;
  period: string;
  slug?: string;
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
              <SchoolLogo entry={entry} />
              <div className="flex min-w-0 flex-col">
                <span className="text-foreground font-serif text-[17px] font-semibold tracking-[-0.025em]">
                  {entry.school}
                </span>
                <span className="text-muted-foreground mt-0.5 text-[14px] sm:text-[15px]">
                  {entry.degree}
                  <span className="text-foreground/30 mx-2">•</span>
                  <span className="text-muted-foreground whitespace-nowrap">{entry.period}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SchoolLogo({ entry }: { entry: Entry }): ReactNode {
  const initials = entry.school.charAt(0);
  return (
    <span
      className="border-border bg-background inline-flex h-12 w-12 shrink-0 items-center justify-center border"
      aria-hidden="true"
      style={{ borderRadius: 6 }}
    >
      {entry.slug ? (
        <img
          src={`https://cdn.simpleicons.org/${entry.slug}`}
          alt=""
          width={24}
          height={24}
          className="h-6 w-6"
          draggable={false}
        />
      ) : (
        <span className="text-foreground/60 text-[18px] font-semibold tracking-tight">
          {initials}
        </span>
      )}
    </span>
  );
}
