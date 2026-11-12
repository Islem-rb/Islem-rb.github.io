import type { ReactNode } from "react";

import { ContactCard } from "@/components/contact/contact-card";
import { AskHero } from "@/components/chat/ask-hero";
import { Projects } from "@/components/projects/projects";
import type { Lang } from "@/lib/i18n";

export function HomePage({ lang }: { lang: Lang }): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col gap-20 sm:gap-28">
      <AskHero lang={lang} />
      <Projects lang={lang} withHeadline viewMoreVisible />
      <ContactCard lang={lang} />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
