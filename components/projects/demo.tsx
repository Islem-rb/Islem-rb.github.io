import { Play } from "lucide-react";
import type { ReactNode } from "react";
import { preload } from "react-dom";

import type { Demo } from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";

/**
 * Video and screenshots for a case study. Nothing heavy loads with the page:
 * the video only shows its poster until played (preload="none"), and the
 * screenshots load lazily as they scroll into view.
 */
export function DemoMedia({
  demo,
  name,
  lang,
}: {
  demo: Demo;
  name: string;
  lang: Lang;
}): ReactNode {
  const t = getDictionary(lang).projects;
  const { video, shots } = demo;
  // The poster is usually the largest element in view: fetch it early.
  if (video) preload(video.poster, { as: "image", fetchPriority: "high" });

  return (
    <div className="flex flex-col gap-5">
      {video ? (
        <figure className="flex flex-col gap-2.5">
          <div className="border-foreground/8 bg-foreground/4 overflow-hidden rounded-3xl border shadow-sm">
            <video
              controls
              playsInline
              preload="none"
              poster={video.poster}
              aria-label={t.demoVideo(name)}
              className="aspect-video h-auto w-full bg-black"
            >
              <source src={video.src} type="video/mp4" />
            </video>
          </div>
          <figcaption className="text-foreground/50 flex items-center gap-2 px-1 font-mono text-[11px] tracking-tight">
            <Play className="h-3 w-3" aria-hidden="true" />
            {video.duration}
            {video.lang !== lang ? (
              <span>· {t.videoIn(video.lang)}</span>
            ) : null}
          </figcaption>
        </figure>
      ) : null}

      {shots?.length ? (
        <ul
          aria-label={t.screenshots}
          className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 pb-2 sm:-mx-10 sm:scroll-px-10 sm:px-10"
        >
          {shots.map((shot) => (
            <li key={shot.src} className="shrink-0 snap-start">
              <a
                href={shot.src}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.openImage(shot.alt[lang])}
                className="focus-ring border-foreground/8 bg-foreground/4 block overflow-hidden rounded-2xl border transition-opacity hover:opacity-90"
              >
                {/* Explicit size so nothing shifts while it loads. */}
                <img
                  src={shot.src}
                  alt={shot.alt[lang]}
                  width={shot.width}
                  height={shot.height}
                  loading="lazy"
                  decoding="async"
                  className="h-72 w-auto sm:h-96"
                />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
