import type { ReactNode } from "react";

import { getDictionary, type Lang } from "@/lib/i18n";

export function SkipToContent({ lang }: { lang: Lang }): ReactNode {
  return (
    <a href="#main-content" className="skip-to-content">
      {getDictionary(lang).skip}
    </a>
  );
}
