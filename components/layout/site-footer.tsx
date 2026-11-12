import { ArrowUp, ArrowUpRight, FileDown } from "lucide-react";
import type { ReactNode } from "react";

import { ContactButton } from "@/components/contact/contact-button";
import { cvFor, profile } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";

const GHOST =
  "focus-ring group inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-foreground/25 px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground";

/** Every page ends here: how to reach me, then the sheet's legend. */
export function SiteFooter({ lang }: { lang: Lang }): ReactNode {
  const t = getDictionary(lang);
  const c = t.contact;
  const rows: { label: string; value: ReactNode }[] = [
    {
      label: c.email,
      value: (
        <a
          href={`mailto:${profile.email}?subject=${encodeURIComponent(c.subject)}`}
          className="focus-ring rounded-sm break-all underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-accent"
        >
          {profile.email}
        </a>
      ),
    },
    { label: t.about.basedIn, value: profile.location },
    {
      label: t.about.lookingFor,
      value: (
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--signal)]" />
          {c.available}
        </span>
      ),
    },
  ];

  return (
    <footer className="mt-20 border-t border-foreground sm:mt-24">
      <div className="mx-auto grid w-full max-w-310 grid-cols-1 gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="mt-4 font-serif text-[2.3rem] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-foreground sm:text-[3.2rem]">
            {c.heading}
            <span className="text-accent">.</span>
          </h2>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-pretty text-muted-foreground">
            {c.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <ContactButton />
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={GHOST}>
              LinkedIn
              <ArrowUpRight className="h-4 w-4 text-foreground/50" aria-hidden="true" />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className={GHOST}>
              GitHub
              <ArrowUpRight className="h-4 w-4 text-foreground/50" aria-hidden="true" />
            </a>
            <a href={cvFor(lang)} download className={GHOST}>
              <FileDown className="h-4 w-4 text-foreground/50" aria-hidden="true" />
              {c.cv}
            </a>
          </div>
        </div>

        <dl className="sheet self-start px-5 sm:px-6">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`flex flex-col gap-1 py-4 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <dt className="eyebrow">{row.label}</dt>
              <dd className="text-[15.5px] text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-310 flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-5 text-[13px] text-muted-foreground sm:px-8">
          <p>
            &copy; {new Date().getFullYear()} {profile.name} · {c.rights}
          </p>
          <a
            href="#main-content"
            className="focus-ring group inline-flex items-center gap-1.5 rounded-sm font-medium text-foreground"
          >
            {c.top}
            <ArrowUp
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
