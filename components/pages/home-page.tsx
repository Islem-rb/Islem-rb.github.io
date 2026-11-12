import type { ReactNode } from "react";

import { ContactCard } from "@/components/contact/contact-card";
import { AtAGlance } from "@/components/home/at-a-glance";
import { MapHero } from "@/components/home/map-hero";
import type { Lang } from "@/lib/i18n";

export function HomePage({ lang }: { lang: Lang }): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col gap-20 sm:gap-28">
      <MapHero lang={lang}>
        <AtAGlance lang={lang} />
      </MapHero>
      <ContactCard lang={lang} />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
