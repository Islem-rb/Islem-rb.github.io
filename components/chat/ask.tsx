"use client";

import { ArrowUp, CornerDownRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import {
  answerForIntent,
  COMMAND_HINT,
  DEFAULT_SUGGESTIONS,
} from "@/lib/chat/intents";
import { answer, suggest } from "@/lib/chat/match";
import type { Answer, IntentId, Suggestion } from "@/lib/chat/types";
import type { Dictionary, Lang } from "@/lib/i18n";
import { useReducedMotion } from "@/lib/motion";
import { useLang } from "@/lib/use-lang";

import { AnswerBlocks } from "./answer-blocks";
import { TypedText } from "./typed-text";

type Entry = {
  id: number;
  /** Missing on the welcome message, which nobody asked for. */
  question?: string;
  answer: Answer;
  /** Skip the typing animation. */
  settled?: boolean;
};

/** Fired by the nav's ask button when it is clicked on the home page. */
export const ASK_FOCUS_EVENT = "ask:focus";

const EASE = [0.22, 1, 0.36, 1] as const;
const PLACEHOLDER_MS = 3200;
const WELCOME_MS = 600;
const MAX_QUESTION = 200;
/** Older answers drop off so the hero never grows without bound. */
const MAX_ENTRIES = 5;

export function Ask(): ReactNode {
  const { lang, t } = useLang();
  const reduced = useReducedMotion();
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [placeholder, setPlaceholder] = useState(0);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const suggestions = useMemo(
    () => (open ? suggest(value, lang) : []),
    [open, value, lang],
  );

  const welcome = (settled: boolean): Entry => {
    nextId.current += 1;
    return {
      id: nextId.current,
      answer: {
        text: t.ask.answers.greeting,
        blocks: [],
        followUps: DEFAULT_SUGGESTIONS,
      },
      settled,
    };
  };

  const ask = (raw: string, intent?: IntentId): void => {
    const question = raw.trim().slice(0, MAX_QUESTION);
    if (!question) return;
    setValue("");
    setOpen(false);
    setActive(-1);
    if (question.toLowerCase() === "clear") {
      reset();
      return;
    }
    const result = intent ? answerForIntent(intent, lang) : answer(question, lang);
    nextId.current += 1;
    const entry: Entry = { id: nextId.current, question, answer: result };
    setEntries((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
    // Keep the address shareable: opening it replays this question.
    window.history.replaceState(null, "", `?q=${encodeURIComponent(question)}`);
  };

  const reset = (): void => {
    setEntries([welcome(true)]);
    window.history.replaceState(null, "", window.location.pathname);
    inputRef.current?.focus();
  };

  // First paint: replay a shared `?q=` link, or let the page introduce itself.
  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("q")?.trim();
    const id = window.setTimeout(
      () => {
        if (shared) ask(shared);
        else setEntries([welcome(false)]);
        if (window.location.hash === "#ask") inputRef.current?.focus();
      },
      shared ? 0 : WELCOME_MS,
    );
    return () => window.clearTimeout(id);
    // Runs once per page load; the language only changes with a navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setPlaceholder((i) => (i + 1) % t.ask.placeholders.length),
      PLACEHOLDER_MS,
    );
    return () => window.clearInterval(id);
  }, [reduced, t.ask.placeholders.length]);

  // "/" from anywhere on the page, or the nav's ask button, jumps to the input.
  useEffect(() => {
    const focus = (): void => inputRef.current?.focus();
    const onKey = (event: globalThis.KeyboardEvent): void => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      event.preventDefault();
      focus();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(ASK_FOCUS_EVENT, focus);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(ASK_FOCUS_EVENT, focus);
    };
  }, []);

  const pickSuggestion = (suggestion: Suggestion): void =>
    ask(suggestion.label, suggestion.intent);

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    const picked = suggestions[active];
    if (picked) pickSuggestion(picked);
    else ask(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
      return;
    }
    const count = suggestions.length;
    if (count === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % count);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i <= 0 ? count - 1 : i - 1));
    }
  };

  const latest = entries[0];
  const asked = entries.some((entry) => entry.question);
  const expanded = suggestions.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative z-20">
        <form
          id="ask"
          onSubmit={handleSubmit}
          role="search"
          className="scroll-mt-32 rounded-4xl border border-foreground/8 bg-background/70 p-1.5 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 rounded-[1.6rem] border border-foreground/8 bg-background py-1.5 pr-1.5 pl-5 transition-colors focus-within:border-foreground/30">
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={expanded}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                expanded && active >= 0 ? `${listId}-${active}` : undefined
              }
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setOpen(true);
                setActive(-1);
              }}
              onKeyDown={handleKeyDown}
              onBlur={() => setOpen(false)}
              placeholder={t.ask.placeholders[placeholder]}
              aria-label={t.ask.label}
              autoComplete="off"
              enterKeyHint="send"
              maxLength={MAX_QUESTION}
              className="h-12 min-w-0 flex-1 bg-transparent text-[16px] tracking-tight text-foreground outline-none placeholder:text-foreground/40 sm:text-[17px]"
            />
            <kbd
              aria-hidden="true"
              className="hidden h-6 min-w-6 items-center justify-center rounded-md border border-foreground/10 px-1.5 font-mono text-[11px] text-foreground/40 sm:inline-flex"
            >
              /
            </kbd>
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

        <ul
          id={listId}
          role="listbox"
          aria-label={t.ask.suggestions}
          hidden={!expanded}
          className="absolute top-full right-0 left-0 mt-2 overflow-hidden rounded-3xl border border-foreground/10 bg-background p-1.5 text-left shadow-xl"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.kind}-${suggestion.label}`}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              // Keep focus in the input so the click is not swallowed by blur.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pickSuggestion(suggestion)}
              onMouseEnter={() => setActive(index)}
              className={`flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-2xl px-4 text-[15px] tracking-tight text-foreground transition-colors ${
                index === active ? "bg-foreground/6" : ""
              }`}
            >
              <span className="truncate">{suggestion.label}</span>
              <span className="shrink-0 font-mono text-[11px] text-foreground/45">
                {t.ask.kinds[suggestion.kind]}
              </span>
            </li>
          ))}
        </ul>
      </div>

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
                  instant={reduced || index > 0 || Boolean(entry.settled)}
                  lang={lang}
                  t={t}
                  onPick={(id) => ask(t.ask.chips[id], id)}
                  onCommand={entry.question ? undefined : () => ask(COMMAND_HINT)}
                />
              </motion.article>
            ))}
          </AnimatePresence>

          {asked ? (
            <div className="flex items-center justify-between gap-4 px-2">
              <p className="font-mono text-[11px] tracking-tight text-foreground/45">
                {t.ask.hint}
              </p>
              <button
                type="button"
                onClick={reset}
                className="focus-ring inline-flex min-h-8 shrink-0 cursor-pointer items-center rounded-lg px-2 font-mono text-[12px] tracking-tight text-foreground/55 transition-colors hover:text-foreground"
              >
                {t.ask.clear}
              </button>
            </div>
          ) : null}
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
  onCommand,
}: {
  entry: Entry;
  instant: boolean;
  lang: Lang;
  t: Dictionary;
  onPick: (id: IntentId) => void;
  onCommand: (() => void) | undefined;
}): ReactNode {
  const [typed, setTyped] = useState(false);
  const done = instant || typed;

  return (
    <div className="flex flex-col gap-4 rounded-[1.6rem] border border-foreground/5 bg-foreground/2 px-5 py-5 sm:px-7 sm:py-6 dark:bg-foreground/4">
      {entry.question ? (
        <p className="flex items-start gap-2 font-mono text-[12px] tracking-tight text-foreground/55">
          <CornerDownRight
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/35"
            aria-hidden="true"
          />
          <span className="break-words">{entry.question}</span>
        </p>
      ) : null}

      <TypedText
        text={entry.answer.text}
        instant={instant}
        onDone={() => setTyped(true)}
      />

      {done ? (
        <>
          <AnswerBlocks blocks={entry.answer.blocks} lang={lang} t={t} />
          <motion.ul
            aria-label={entry.question ? t.ask.followUps : t.ask.suggestions}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-wrap gap-2"
          >
            {entry.answer.followUps.map((id) => (
              <li key={id}>
                <button type="button" onClick={() => onPick(id)} className={CHIP}>
                  {t.ask.chips[id]}
                </button>
              </li>
            ))}
            {onCommand ? (
              <li>
                <button
                  type="button"
                  onClick={onCommand}
                  className={`${CHIP} font-mono text-[12px]`}
                >
                  <span className="mr-1.5 text-foreground/35">$</span>
                  {COMMAND_HINT}
                </button>
              </li>
            ) : null}
          </motion.ul>
        </>
      ) : null}
    </div>
  );
}

const CHIP =
  "focus-ring inline-flex min-h-9 cursor-pointer items-center rounded-full border border-foreground/10 bg-background px-3.5 text-[13px] tracking-tight text-foreground/75 transition-colors hover:border-foreground/25 hover:text-foreground";
