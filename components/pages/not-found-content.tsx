"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";

import { getDictionary, langFromPath, localePath } from "@/lib/i18n";

const noop = (): (() => void) => () => {};

/**
 * One static 404.html serves every missing URL, so the language comes from
 * the address in the browser rather than from the route.
 */
export function NotFoundContent(): ReactNode {
  const path = useSyncExternalStore(
    noop,
    () => window.location.pathname,
    () => "/"
  );
  const lang = langFromPath(path);
  const t = getDictionary(lang).notFound;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const shown = path.length > 42 ? `${path.slice(0, 41)}…` : path;

  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center px-6 py-24"
    >
      <div className="flex w-full max-w-xl flex-col gap-8">
        <div className="rounded-4xl border border-foreground/8 bg-background p-1.5 shadow-sm">
          <div className="rounded-[1.6rem] border border-foreground/5 bg-foreground/2 px-5 py-5 font-mono text-[12.5px] leading-[1.7] tracking-tight dark:bg-foreground/4">
            <p className="text-foreground/70">
              <span className="text-foreground/35">$</span> kubectl get page{" "}
              <span className="break-all text-foreground">{shown}</span>
            </p>
            <p className="text-foreground/55">
              Error from server (NotFound): pages{" "}
              <span className="break-all">&quot;{shown}&quot;</span> not found
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-mono text-[12px] tracking-tight text-foreground/45">
            404
          </p>
          <h1 className="font-serif text-[2.25rem] font-medium leading-[1.08] tracking-tight text-foreground sm:text-[2.75rem]">
            {t.title}
          </h1>
          <p className="max-w-[44ch] text-[18px] leading-[1.5] tracking-tight text-foreground/65">
            {t.body}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={localePath(lang, "/")}
            className="focus-ring group inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            {t.home}
          </a>
          <a
            href={localePath(lang, "/projects")}
            className="focus-ring group inline-flex h-11 items-center gap-2 rounded-xl border border-foreground/8 bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/4"
          >
            {t.projects}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </main>
  );
}
