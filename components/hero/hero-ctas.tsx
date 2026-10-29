"use client";

import { ArrowRight, FileDown } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ContactButton } from "@/components/contact/contact-button";
import { cvFor } from "@/lib/content";
import { localePath } from "@/lib/i18n";
import { useLang } from "@/lib/use-lang";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroCtas(): ReactNode {
  const { lang, t } = useLang();
  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={{ layout: { duration: 0.55, ease: EASE } }}
        className="mt-2 flex flex-wrap items-center gap-3"
      >
        <ContactButton />

        <motion.div
          layout
          transition={{ layout: { duration: 0.55, ease: EASE } }}
        >
          <Link
            href={localePath(lang, "/projects")}
            className="border border-foreground/5 focus-ring group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-background px-5 py-2.5 text-sm font-medium text-foreground shadow-2xl transition-colors hover:bg-foreground/4"
          >
            {t.hero.viewWork}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </motion.div>

        <motion.a
          layout
          transition={{ layout: { duration: 0.55, ease: EASE } }}
          href={cvFor(lang)}
          download
          className="focus-ring inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-3 text-sm font-medium text-foreground/65 transition-colors hover:text-foreground"
        >
          <FileDown className="h-4 w-4" aria-hidden="true" />
          {t.hero.resume}
        </motion.a>
      </motion.div>
    </LayoutGroup>
  );
}
