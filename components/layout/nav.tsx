"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

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
      className="focus-ring relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-background ring-1 ring-foreground/8 transition-colors"
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

export function Nav(): ReactNode {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [pillRect, setPillRect] = useState<{
    x: number;
    width: number;
  } | null>(null);
  const [hasMeasured, setHasMeasured] = useState(false);

  const { lang, t: dict } = useLang();
  const t = dict.nav;
  const basePath = stripLocale(pathname);
  const otherLang = lang === "en" ? "fr" : "en";

  const activeIndex = NAV_ITEMS.findIndex((item) =>
    item.href === "/"
      ? basePath === "/"
      : basePath === item.href || basePath.startsWith(`${item.href}/`)
  );

  // Measure the active item from a ResizeObserver callback: it fires once on
  // observe and again whenever fonts or the viewport change the item widths.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = (): void => {
      const activeEl =
        activeIndex >= 0 ? itemRefs.current[activeIndex] : null;
      if (!activeEl) {
        setPillRect(null);
        return;
      }
      const listRect = list.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      setPillRect({
        x: itemRect.left - listRect.left,
        width: itemRect.width,
      });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [activeIndex, lang]);

  useEffect(() => {
    if (!pillRect) return;
    const id = requestAnimationFrame(() => setHasMeasured(true));
    return () => cancelAnimationFrame(id);
  }, [pillRect]);

  return (
    <nav
      aria-label={t.label}
      className="fixed left-1/2 top-6 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-1 rounded-full bg-background p-1.5 shadow-sm border border-foreground/8">
        <ul ref={listRef} className="relative flex items-center gap-1">
          {pillRect && (
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ x: pillRect.x, width: pillRect.width }}
              transition={
                hasMeasured
                  ? { type: "spring", stiffness: 380, damping: 32 }
                  : { duration: 0 }
              }
              style={{ left: 0, top: 0, bottom: 0 }}
              className="absolute rounded-full bg-foreground/5 ring-1 ring-foreground/8"
            />
          )}
          {NAV_ITEMS.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={item.href}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="relative"
              >
                <Link
                  href={localePath(lang, item.href)}
                  aria-current={isActive ? "page" : undefined}
                  className="focus-ring relative inline-flex cursor-pointer items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-300 sm:px-4"
                >
                  <span
                    className={
                      isActive
                        ? "relative z-10 text-foreground"
                        : "relative z-10 text-foreground/60 hover:text-foreground"
                    }
                  >
                    {t[item.key]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <a
          href={localePath(otherLang, basePath)}
          hrefLang={otherLang}
          lang={otherLang}
          aria-label={t.switchLang}
          title={t.switchLang}
          className="focus-ring inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-full px-1.5 font-mono text-[11px] font-medium text-foreground/60 transition-colors hover:text-foreground"
        >
          {t.switchLangShort}
        </a>
        <NavThemeToggle t={t} />
      </div>
    </nav>
  );
}
