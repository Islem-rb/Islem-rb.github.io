import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cvFor, getExperience, getProjects, profile } from "@/lib/content";
import { getDictionary, localePath, type Lang } from "@/lib/i18n";

const ROW =
  "focus-ring group grid grid-cols-[1fr_auto] items-baseline gap-x-5 gap-y-1 border-b border-foreground/10 px-1 py-5 transition-[padding,background-color] duration-300 hover:bg-foreground/4 hover:pl-3.5 md:grid-cols-[220px_1fr_auto]";

/** The whole site in five rows, for visitors who would rather scan than ask. */
export function AtAGlance({ lang }: { lang: Lang }): ReactNode {
  const t = getDictionary(lang);
  const g = t.glance;
  const rows = [
    { ...g.projects, href: localePath(lang, "/projects"), count: getProjects(lang).length },
    { ...g.experience, href: localePath(lang, "/about"), count: getExperience(lang).length },
    { ...g.education, href: localePath(lang, "/about") },
    { ...g.resume, href: cvFor(lang), download: true },
    {
      ...g.contact,
      href: `mailto:${profile.email}?subject=${encodeURIComponent(t.contact.subject)}`,
      external: true,
    },
  ];

  return (
    <section
      aria-labelledby="glance-heading"
      className="mx-auto mt-20 w-full max-w-310 px-5 sm:mt-24 sm:px-8"
    >
      <h2
        id="glance-heading"
        className="font-serif text-[1.9rem] font-semibold tracking-[-0.025em] text-foreground"
      >
        {g.title}
      </h2>
      <div className="mt-4 border-t border-foreground">
        {rows.map((row) => {
          const content = (
            <>
              <span className="font-serif text-[23px] font-semibold tracking-[-0.02em] text-foreground">
                {row.name}
                {"count" in row ? (
                  <sup className="ml-1.5 font-sans text-[12px] font-medium text-foreground/45">
                    {row.count}
                  </sup>
                ) : null}
              </span>
              <span className="col-span-full row-start-2 text-foreground/65 md:col-span-1 md:row-start-auto">
                {row.what}
              </span>
              <span className="col-start-2 row-start-1 inline-flex items-center gap-1.5 text-[14.5px] font-medium text-foreground md:col-start-auto md:row-start-auto">
                {row.go}
                {"download" in row ? (
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                )}
              </span>
            </>
          );
          return "download" in row || "external" in row ? (
            <a key={row.name} href={row.href} download={"download" in row} className={ROW}>
              {content}
            </a>
          ) : (
            <Link key={row.name} href={row.href} className={ROW}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
