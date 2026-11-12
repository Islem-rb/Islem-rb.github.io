import type { ReactNode } from "react";

import { getCapabilities, getSkillGroups } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";

export function Skills({ lang }: { lang: Lang }): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="eyebrow">{getDictionary(lang).about.whatIDo}</h2>
      <div className="sheet p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {getCapabilities(lang).map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-border bg-background px-3.5 py-2 text-[14px] text-foreground/85 sm:text-[15px]"
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
      <h2 className="eyebrow">{t.toolbox}</h2>
      <div className="sheet">
        <dl className="flex flex-col divide-y divide-border px-4 sm:px-5">
          {getSkillGroups(lang).map((group) => (
            <div
              key={group.label}
              className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[8.5rem_1fr] sm:gap-4"
            >
              <dt className="text-[13px] leading-[1.7] font-semibold text-foreground">
                {group.label}
              </dt>
              <dd className="text-[15px] leading-[1.55] text-muted-foreground">
                {group.items}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
