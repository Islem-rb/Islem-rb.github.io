"use client";

import { ArrowUp, CornerDownRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { answerForIntent, DEFAULT_SUGGESTIONS } from "@/lib/chat/intents";
import { answer } from "@/lib/chat/match";
import type { Answer, IntentId } from "@/lib/chat/types";
import type { Dictionary, Lang } from "@/lib/i18n";
import { useReducedMotion } from "@/lib/motion";
import { useLang } from "@/lib/use-lang";

import { AnswerBlocks } from "./answer-blocks";
import { TypedText } from "./typed-text";

type Entry = { id: number; question: string; answer: Answer };

const EASE = [0.22, 1, 0.36, 1] as const;
const PLACEHOLDER_MS = 3200;
/** Older answers drop off so the hero never grows without bound. */
const MAX_ENTRIES = 5;

export function Ask(): ReactNode {
  const { lang, t } = useLang();
  const reduced = useReducedMotion();
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [placeholder, setPlaceholder] = useState(0);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setPlaceholder((i) => (i + 1) % t.ask.placeholders.length),
      PLACEHOLDER_MS,
    );
    return () => window.clearInterval(id);
  }, [reduced, t.ask.placeholders.length]);

  const push = (question: string, result: Answer): void => {
    nextId.current += 1;
    const entry = { id: nextId.current, question, answer: result };
    setEntries((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    const question = value.trim();
    if (!question) return;
    push(question, answer(question, lang));
    setValue("");
  };

  const pick = (id: IntentId): void => {
    push(t.ask.chips[id], answerForIntent(id, lang));
  };

  const latest = entries[0];

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="rounded-4xl border border-foreground/8 bg-background/70 p-1.5 shadow-sm backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 rounded-[1.6rem] border border-foreground/8 bg-background py-1.5 pr-1.5 pl-5 transition-colors focus-within:border-foreground/30">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t.ask.placeholders[placeholder]}
            aria-label={t.ask.label}
            autoComplete="off"
            enterKeyHint="send"
            maxLength={200}
            className="h-12 min-w-0 flex-1 bg-transparent text-[16px] tracking-tight text-foreground outline-none placeholder:text-foreground/40 sm:text-[17px]"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            aria-label={t.ask.submit}
            className="focus-ring inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-foreground text-background transition-opacity disabled:cursor-default disabled:opacity-25"
          >
            <ArrowUp className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </div>
      </form>

      {latest ? null : (
        <Chips
          label={t.ask.suggestions}
          ids={DEFAULT_SUGGESTIONS}
          t={t}
          onPick={pick}
          centered
        />
      )}

      {/* One persistent live region: screen readers hear each new answer once. */}
      <p className="sr-only" aria-live="polite">
        {latest?.answer.text}
      </p>

      {latest ? (
        <div className="flex flex-col gap-3 text-left">
          <AnimatePresence initial={false} mode="popLayout">
            {entries.map((entry, index) => (
              <motion.article
                key={entry.id}
                layout={reduced ? false : "position"}
                initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                animate={{ opacity: index === 0 ? 1 : 0.6, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="rounded-4xl border border-foreground/8 bg-background/70 p-1.5 shadow-sm backdrop-blur-sm transition-opacity hover:!opacity-100 focus-within:!opacity-100"
              >
                <EntryView
                  entry={entry}
                  instant={reduced || index > 0}
                  lang={lang}
                  t={t}
                  onPick={pick}
                />
              </motion.article>
            ))}
          </AnimatePresence>

          <div className="flex items-center justify-between gap-4 px-2">
            <p className="font-mono text-[11px] tracking-tight text-foreground/45">
              {t.ask.hint}
            </p>
            <button
              type="button"
              onClick={() => {
                setEntries([]);
                inputRef.current?.focus();
              }}
              className="focus-ring inline-flex min-h-8 shrink-0 cursor-pointer items-center rounded-lg px-2 font-mono text-[12px] tracking-tight text-foreground/55 transition-colors hover:text-foreground"
            >
              {t.ask.clear}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EntryView({
  entry,
  instant,
  lang,
  t,
  onPick,
}: {
  entry: Entry;
  instant: boolean;
  lang: Lang;
  t: Dictionary;
  onPick: (id: IntentId) => void;
}): ReactNode {
  const [typed, setTyped] = useState(false);
  const done = instant || typed;

  return (
    <div className="flex flex-col gap-4 rounded-[1.6rem] border border-foreground/5 bg-foreground/2 px-5 py-5 sm:px-7 sm:py-6 dark:bg-foreground/4">
      <p className="flex items-start gap-2 font-mono text-[12px] tracking-tight text-foreground/55">
        <CornerDownRight
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/35"
          aria-hidden="true"
        />
        <span className="break-words">{entry.question}</span>
      </p>

      <TypedText
        text={entry.answer.text}
        instant={instant}
        onDone={() => setTyped(true)}
      />

      {done ? (
        <>
          <AnswerBlocks blocks={entry.answer.blocks} lang={lang} t={t} />
          <Chips
            label={t.ask.followUps}
            ids={entry.answer.followUps}
            t={t}
            onPick={onPick}
          />
        </>
      ) : null}
    </div>
  );
}

function Chips({
  label,
  ids,
  t,
  onPick,
  centered = false,
}: {
  label: string;
  ids: IntentId[];
  t: Dictionary;
  onPick: (id: IntentId) => void;
  centered?: boolean;
}): ReactNode {
  return (
    <ul
      aria-label={label}
      className={`flex flex-wrap gap-2 ${centered ? "justify-center" : ""}`}
    >
      {ids.map((id) => (
        <li key={id}>
          <button
            type="button"
            onClick={() => onPick(id)}
            className="focus-ring inline-flex min-h-9 cursor-pointer items-center rounded-full border border-foreground/10 bg-background px-3.5 text-[13px] tracking-tight text-foreground/75 transition-colors hover:border-foreground/25 hover:text-foreground"
          >
            {t.ask.chips[id]}
          </button>
        </li>
      ))}
    </ul>
  );
}
