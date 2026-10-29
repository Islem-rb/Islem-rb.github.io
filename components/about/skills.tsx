import type { ReactNode } from "react";

import { getCapabilities, getSkillGroups } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";

export function Skills({ lang }: { lang: Lang }): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
        {getDictionary(lang).about.whatIDo}
      </h2>
      <div className="rounded-4xl border border-foreground/5 bg-foreground/2 p-2 sm:p-4 dark:bg-foreground/5">
        <div className="flex flex-wrap gap-3">
          {getCapabilities(lang).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-foreground/8 bg-background px-4 py-2 text-[14px] tracking-tight text-foreground/85 sm:text-[15px]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Toolbox({ lang }: { lang: Lang }): ReactNode {
  const t = getDictionary(lang).about;
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
        {t.toolbox}
      </h2>
      <div className="rounded-4xl border border-foreground/5 bg-foreground/2 p-2 sm:p-4 dark:bg-foreground/5">
        <dl className="flex flex-col divide-y divide-foreground/6 rounded-3xl border border-foreground/5 bg-background px-4 sm:px-5">
          {getSkillGroups(lang).map((group) => (
            <div
              key={group.label}
              className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[8.5rem_1fr] sm:gap-4"
            >
              <dt className="font-mono text-[12px] leading-[1.7] tracking-tight text-foreground/50">
                {group.label}
              </dt>
              <dd className="text-[15px] leading-[1.55] tracking-tight text-foreground/80">
                {group.items}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
