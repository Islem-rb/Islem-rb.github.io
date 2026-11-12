"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const TICK_MS = 18;
/** Long answers type in bigger steps so nothing takes much over 1.5s. */
const MAX_TICKS = 90;

/**
 * Prints `text` as if it were being typed. With `instant` the full text shows
 * at once. Screen readers always get the whole sentence, never the animation.
 */
export function TypedText({
  text,
  instant,
  onDone,
}: {
  text: string;
  instant: boolean;
  onDone: () => void;
}): ReactNode {
  const [count, setCount] = useState(0);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (instant) return;
    const step = Math.max(2, Math.ceil(text.length / MAX_TICKS));
    let shown = 0;
    const id = window.setInterval(() => {
      shown = Math.min(text.length, shown + step);
      setCount(shown);
      if (shown >= text.length) {
        window.clearInterval(id);
        onDoneRef.current();
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [text, instant]);

  const typing = !instant && count < text.length;

  return (
    <p className="text-[17px] leading-[1.5] tracking-tight text-foreground sm:text-[19px]">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {instant ? text : text.slice(0, count)}
        {typing ? (
          <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] animate-pulse bg-foreground" />
        ) : null}
      </span>
    </p>
  );
}
