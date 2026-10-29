"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useSyncExternalStore, type ReactNode } from "react";

import { DottedPattern } from "@/components/ui/dotted-pattern";
import { profile } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { useLang } from "@/lib/use-lang";

type Polaroid = {
  id: string;
  rotate: number;
  caption: Record<Lang, string>;
  image?: { light: string; dark: string };
  lines?: string[];
};

const PHOTOS: Polaroid[] = [
  { id: "me", rotate: -8, caption: { en: "me", fr: "moi" }, image: profile.portrait },
  { id: "pods", rotate: 6, caption: { en: "every morning", fr: "chaque matin" }, lines: ["$ kubectl", "get pods", "-A"] },
  { id: "road", rotate: -4, caption: { en: "the road so far", fr: "le parcours" }, lines: ["Kasserine", "↓", "Sousse", "↓", "Ariana"] },
  { id: "dither", rotate: 7, caption: { en: "rendered", fr: "en rendu" }, image: profile.portraitAlt },
  { id: "langs", rotate: -6, caption: { en: "I speak", fr: "je parle" }, lines: ["العربية", "Français", "English"] },
  { id: "apply", rotate: 5, caption: { en: "on repeat", fr: "en boucle" }, lines: ["$ terraform", "plan", "&& apply"] },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function PolaroidCard({
  photo,
  index,
  lang,
}: {
  photo: Polaroid;
  index: number;
  lang: Lang;
}): ReactNode {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 220, damping: 18, mass: 0.6 });
  const tx = useTransform(sx, (v) => `${v}px`);
  const ty = useTransform(sy, (v) => `${v}px`);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const max = 18;
    const k = 0.25;
    mx.set(Math.max(-max, Math.min(max, dx * k)));
    my.set(Math.max(-max, Math.min(max, dy * k)));
  };

  const handleLeave = (): void => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      initial={{ opacity: 0, y: -120, filter: "blur(18px)", rotate: photo.rotate }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", rotate: photo.rotate }}
      transition={{
        duration: 0.9,
        delay: 0.05 + index * 0.08,
        ease: EASE,
      }}
      style={{
        x: tx,
        y: ty,
        rotate: photo.rotate,
      }}
      className="relative flex aspect-[3/4] w-[clamp(6rem,11vw,9rem)] shrink-0 flex-col overflow-hidden rounded-2xl border-6 border-neutral-300/40 bg-white p-1.5 pb-0 dark:border-white/15 dark:bg-neutral-900"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl">
        {photo.image ? (
          <>
            <img
              src={photo.image.light}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover select-none dark:hidden"
            />
            <img
              src={photo.image.dark}
              alt=""
              draggable={false}
              className="absolute inset-0 hidden h-full w-full object-cover select-none dark:block"
            />
          </>
        ) : (
          <>
            <DottedPattern className="absolute inset-0" />
            <div className="relative flex h-full flex-col items-center justify-center gap-0.5 px-1 text-center font-mono text-[clamp(8px,0.85vw,11px)] leading-tight tracking-tight text-foreground/75">
              {photo.lines?.map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </div>
          </>
        )}
      </div>
      <span className="block py-[clamp(4px,0.6vw,8px)] text-center font-serif text-[clamp(9px,0.95vw,12px)] italic tracking-tight text-foreground/60">
        {photo.caption[lang]}
      </span>
    </motion.div>
  );
}

export function PolaroidStrip(): ReactNode {
  const { lang, t } = useLang();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return <div aria-hidden="true" className="h-[clamp(8rem,15vw,12rem)] w-full" />;
  }

  return (
    <div
      aria-label={t.about.snapshotsLabel}
      role="img"
      className="flex flex-wrap w-full items-start justify-center gap-1 px-4 sm:gap-1.5 sm:px-8"
    >
      {PHOTOS.map((photo, i) => (
        <PolaroidCard key={photo.id} photo={photo} index={i} lang={lang} />
      ))}
    </div>
  );
}
