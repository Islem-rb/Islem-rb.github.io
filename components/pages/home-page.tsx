import type { ReactNode } from "react";

import { AtAGlance } from "@/components/home/at-a-glance";
import { MapHero } from "@/components/home/map-hero";
import type { Lang } from "@/lib/i18n";

export function HomePage({ lang }: { lang: Lang }): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <MapHero lang={lang}>
        <AtAGlance lang={lang} />
      </MapHero>
    </main>
  );
}
