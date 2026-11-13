"use client";

import { Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, type ReactNode } from "react";

import { localePath, stripLocale, type Dictionary } from "@/lib/i18n";
import { useLang } from "@/lib/use-lang";

type NavItem = {
  key: keyof Pick<Dictionary["nav"], "home" | "projects" | "about">;
  href: string;
};

const NAV_ITEMS: readonly NavItem[] = [
  { key: "home", href: "/" },
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
];

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function NavThemeToggle({ t }: { t: Dictionary["nav"] }): ReactNode {
  const mounted = useIsMounted();
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const next = isDark ? "light" : "dark";

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const supportsViewTransitions =
      typeof document !== "undefined" &&
      typeof document.startViewTransition === "function";

    if (!supportsViewTransitions || prefersReducedMotion) {
      setTheme(next);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    const root = document.documentElement;
    root.style.setProperty("--theme-cx", `${cx}px`);
    root.style.setProperty("--theme-cy", `${cy}px`);
    root.style.setProperty("--theme-r", `${radius}px`);
    root.dataset.themeAnim = "1";

    const transition = document.startViewTransition(() => {
      setTheme(next);
    });

    transition.finished.finally(() => {
      delete root.dataset.themeAnim;
    });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? isDark
            ? t.toLight
            : t.toDark
          : t.toggleTheme
      }
      aria-pressed={mounted ? isDark : undefined}
      className="focus-ring relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground/70 transition-colors hover:text-foreground"
    >
      <span aria-hidden="true" className="relative h-4 w-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 text-foreground transition-all duration-300 ${
            mounted && isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 text-foreground transition-all duration-300 ${
            mounted && !isDark
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}

const ASK_BUTTON =
  "focus-ring inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground/70 transition-colors hover:text-foreground";

/** My LEGO minifigure's head: the brand mark next to my name. */
function Avatar(): ReactNode {
  return (
    // Plain <img>: the site is a static export, and this file is already sized for 4x screens.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/islem-lego-head.webp"
      alt=""
      width={36}
      height={36}
      decoding="async"
      fetchPriority="high"
      className="h-9 w-9 shrink-0 object-contain"
    />
  );
}

export function Nav(): ReactNode {
  const pathname = usePathname();
  const { lang, t: dict } = useLang();
  const t = dict.nav;
  const basePath = stripLocale(pathname);
  const otherLang = lang === "en" ? "fr" : "en";

  const activeIndex = NAV_ITEMS.findIndex((item) =>
    item.href === "/"
      ? basePath === "/"
      : basePath === item.href || basePath.startsWith(`${item.href}/`)
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <nav
        aria-label={t.label}
        className="mx-auto flex h-16 w-full max-w-310 items-center gap-2 px-5 sm:px-8"
      >
        <Link
          href={localePath(lang, "/")}
          aria-label={`Islem Rebhi, ${t.role}`}
          className="focus-ring mr-auto inline-flex items-center gap-2.5 rounded-md text-foreground"
        >
          <Avatar />
          <span className="hidden font-serif text-[15px] font-semibold tracking-[-0.01em] sm:inline">
            Islem Rebhi
          </span>
          <span className="hidden text-[13px] text-muted-foreground md:inline">
            / {t.role}
          </span>
        </Link>

        <ul className="flex h-full items-stretch">
          {NAV_ITEMS.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={item.href} className="relative flex">
                <Link
                  href={localePath(lang, item.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={`focus-ring relative inline-flex items-center px-2.5 text-[14px] font-medium whitespace-nowrap transition-colors sm:px-3.5 ${
                    isActive ? "text-foreground" : "text-foreground/75 hover:text-foreground"
                  }`}
                >
                  {t[item.key]}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-2.5 -bottom-px h-0.5 bg-accent transition-transform duration-300 sm:inset-x-3.5 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <span aria-hidden="true" className="mx-1 h-5 w-px bg-border sm:mx-2" />

        {basePath === "/" ? (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("ask:focus"))}
            aria-label={dict.ask.navLabel}
            title={dict.ask.navLabel}
            className={ASK_BUTTON}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <Link
            href={`${localePath(lang, "/")}#ask`}
            aria-label={dict.ask.navLabel}
            title={dict.ask.navLabel}
            className={ASK_BUTTON}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
        <a
          href={localePath(otherLang, basePath)}
          hrefLang={otherLang}
          lang={otherLang}
          aria-label={t.switchLang}
          title={t.switchLang}
          className="focus-ring inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md px-1.5 text-[12px] font-semibold tracking-[0.08em] text-foreground/70 transition-colors hover:text-foreground"
        >
          {t.switchLangShort}
        </a>
        <NavThemeToggle t={t} />
      </nav>
    </header>
  );
}
