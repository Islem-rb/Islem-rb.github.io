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
      className="flex min-h-screen items-center justify-center px-5 py-24"
    >
      <div className="flex w-full max-w-xl flex-col gap-7">
        <p className="eyebrow">
          404 · <span className="break-all normal-case tracking-normal">{shown}</span>
        </p>
        <h1 className="font-serif text-[2.3rem] leading-[1.04] font-semibold tracking-[-0.04em] text-foreground sm:text-[3rem]">
          {t.title}
          <span className="text-accent">.</span>
        </h1>
        <p className="max-w-[44ch] text-[18px] leading-relaxed text-muted-foreground">
          {t.body}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={localePath(lang, "/")}
            className="focus-ring group inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            {t.home}
          </a>
          <a
            href={localePath(lang, "/projects")}
            className="focus-ring group inline-flex h-11 items-center gap-2 rounded-md border border-foreground/25 px-5 text-sm font-medium text-foreground transition-colors hover:border-foreground"
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
