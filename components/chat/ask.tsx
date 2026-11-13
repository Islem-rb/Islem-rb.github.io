"use client";

import { ArrowRight, CornerDownRight } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import {
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";

import { answerForIntent, DEFAULT_SUGGESTIONS } from "@/lib/chat/intents";
import { allSuggestions, answer, suggest } from "@/lib/chat/match";
import type { Answer, ChatContext, IntentId, Suggestion } from "@/lib/chat/types";
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

/** Lets the map put questions and ready-made answers into the thread. */
export type AskHandle = {
  ask: (question: string) => void;
  push: (question: string, result: Answer) => void;
  /** A project opened from the map becomes what "is it live?" refers to. */
  setContext: (context: ChatContext | undefined) => void;
};

/** Fired by the nav's ask button when it is clicked on the home page. */
export const ASK_FOCUS_EVENT = "ask:focus";

const EASE = [0.22, 1, 0.36, 1] as const;
const PLACEHOLDER_MS = 3200;
const MAX_QUESTION = 200;
/** Only the latest answer is shown; earlier questions stay one click away. */
const MAX_ENTRIES = 6;
const CHIP =
  "focus-ring inline-flex min-h-9 cursor-pointer items-center rounded-md border border-border bg-surface px-3.5 text-[13.5px] text-foreground/65 transition-colors hover:border-foreground/25 hover:text-foreground";

export function Ask({
  ref,
  onAnswer,
  onOpenProject,
  about,
}: {
  ref?: Ref<AskHandle>;
  /** The project whose case study is open: the thread hides, the input stays. */
  about?: string | undefined;
  /** Called with each new answer, and with null when the thread is cleared. */
  onAnswer: (result: Answer | null) => void;
  onOpenProject: (slug: string) => void;
}): ReactNode {
  const { lang, t } = useLang();
  const reduced = useReducedMotion();
  const [value, setValue] = useState("");
  // The welcome is in the page's HTML from the start, so it never waits for JavaScript.
  const [entries, setEntries] = useState<Entry[]>(() => [
    {
      id: 0,
      answer: { text: t.ask.answers.greeting, blocks: [], followUps: DEFAULT_SUGGESTIONS },
      settled: true,
    },
  ]);
  const [placeholder, setPlaceholder] = useState(0);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const nextId = useRef(0);
  // What follow-up questions refer to: the project the conversation is on.
  const context = useRef<ChatContext | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  // Typing "/" opens the menu of every question and project.
  const slash = value.startsWith("/");
  const suggestions = useMemo(
    () => (open ? (slash ? allSuggestions(value.slice(1), lang) : suggest(value, lang)) : []),
    [open, slash, value, lang],
  );

  const openMenu = (): void => {
    setValue("/");
    setOpen(true);
    setActive(-1);
    inputRef.current?.focus();
  };

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

  const push = (question: string, result: Answer): void => {
    nextId.current += 1;
    const entry: Entry = { id: nextId.current, question, answer: result };
    setEntries((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
    context.current = result.context;
    onAnswer(result);
    // Keep the address shareable: opening it replays this question.
    window.history.replaceState(null, "", `?q=${encodeURIComponent(question)}`);
  };

  const ask = (raw: string, intent?: IntentId): void => {
    const question = raw.trim().slice(0, MAX_QUESTION);
    if (!question) return;
    setValue("");
    setOpen(false);
    setActive(-1);
    push(
      question,
      intent ? answerForIntent(intent, lang) : answer(question, lang, context.current),
    );
  };

  /** Bring an earlier answer back, without typing it again. */
  const restore = (entry: Entry): void => {
    setEntries((prev) => [{ ...entry, settled: true }, ...prev.filter((e) => e.id !== entry.id)]);
    context.current = entry.answer.context;
    onAnswer(entry.answer);
    if (entry.question) {
      window.history.replaceState(null, "", `?q=${encodeURIComponent(entry.question)}`);
    }
  };

  const reset = (): void => {
    context.current = undefined;
    setEntries([welcome(true)]);
    onAnswer(null);
    window.history.replaceState(null, "", window.location.pathname);
    inputRef.current?.focus();
  };

  useImperativeHandle(ref, () => ({
    ask: (question) => ask(question),
    push,
    setContext: (next) => {
      context.current = next;
    },
  }));

  // First paint: replay a shared `?q=` link.
  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("q")?.trim();
    const id = window.setTimeout(() => {
      if (shared) ask(shared);
      if (window.location.hash === "#ask") inputRef.current?.focus();
    }, 0);
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

  // "/" from anywhere on the page opens the menu; the nav's ask button jumps to the input.
  useEffect(() => {
    const focus = (): void => inputRef.current?.focus();
    const onKey = (event: globalThis.KeyboardEvent): void => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      event.preventDefault();
      openMenu();
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
    const picked = suggestions[active] ?? (slash ? suggestions[0] : undefined);
    if (picked) pickSuggestion(picked);
    else if (!slash) ask(value);
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
  const earlier = entries.slice(1).filter((entry) => entry.question);
  const expanded = suggestions.length > 0;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="relative z-20">
        <form
          id="ask"
          onSubmit={handleSubmit}
          role="search"
          className="flex scroll-mt-32 items-center gap-2 rounded-lg border border-foreground/35 bg-surface py-1.5 pr-1.5 pl-5 shadow-[0_14px_30px_-22px_rgb(0_0_0/0.35)] transition-colors focus-within:border-foreground"
        >
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
            onFocus={() => {
              if (slash) setOpen(true);
            }}
            placeholder={about ? t.ask.askAbout(about) : t.ask.placeholders[placeholder]}
            aria-label={t.ask.label}
            autoComplete="off"
            enterKeyHint="send"
            maxLength={MAX_QUESTION}
            className="h-12 min-w-0 flex-1 bg-transparent text-[17px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            // Keep focus in the input so the menu opens under it.
            onMouseDown={(e) => e.preventDefault()}
            onClick={openMenu}
            aria-label={t.ask.showAll}
            title={t.ask.slashHint}
            className="focus-ring inline-flex h-7 min-w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border px-1.5 text-[13px] font-semibold text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            /
          </button>
          <button
            type="submit"
            disabled={!value.trim()}
            aria-label={t.ask.submit}
            className="focus-ring inline-flex h-11.5 w-11.5 shrink-0 cursor-pointer items-center justify-center rounded-md bg-accent text-white transition-colors dark:text-background disabled:cursor-default disabled:bg-foreground/10 disabled:text-muted-foreground"
          >
            <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </form>

        <div
          hidden={!expanded}
          data-lenis-prevent=""
          className="absolute top-full right-0 left-0 mt-2 max-h-[min(60vh,26rem)] overflow-y-auto overscroll-contain rounded-lg border border-border bg-surface p-1.5 text-left shadow-xl"
        >
          {slash ? (
            <p className="eyebrow px-4 pt-2.5 pb-1.5">{t.ask.slashTitle}</p>
          ) : null}
        <ul
          id={listId}
          role="listbox"
          aria-label={slash ? t.ask.slashTitle : t.ask.suggestions}
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
              className={`flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-md px-4 text-[15px] text-foreground transition-colors ${
                index === active ? "bg-foreground/6" : ""
              }`}
            >
              <span className="truncate">{suggestion.label}</span>
              <span className="shrink-0 text-[12px] text-muted-foreground">
                {t.ask.kinds[suggestion.kind]}
              </span>
            </li>
          ))}
        </ul>
        </div>
      </div>

      {/* One persistent live region: screen readers hear each new answer once. */}
      <p className="sr-only" aria-live="polite">
        {latest?.answer.text}
      </p>

      {latest && !about ? (
        <div className="flex flex-col gap-3 text-left">
          {/* One answer at a time: a new question replaces the card instead of stacking. */}
          <AnimatePresence initial={false} mode="wait">
            <m.article
              key={latest.id}
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="sheet px-5 py-5 sm:px-6"
            >
              <EntryView
                entry={latest}
                instant={reduced || Boolean(latest.settled)}
                lang={lang}
                t={t}
                onPick={(id) => ask(t.ask.chips[id], id)}
                onAsk={pickSuggestion}
                onOpenProject={onOpenProject}
              />
            </m.article>
          </AnimatePresence>

          {earlier.length > 0 ? (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 px-1">
              <span className="text-[12.5px] text-muted-foreground">{t.ask.earlier}</span>
              {earlier.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => restore(entry)}
                  className="focus-ring max-w-[16rem] cursor-pointer truncate rounded-sm text-[13px] text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {entry.question}
                </button>
              ))}
            </div>
          ) : null}

          {asked ? (
            <div className="flex items-center justify-between gap-4 px-1">
              <p className="text-[12.5px] text-muted-foreground">{t.ask.hint}</p>
              <button
                type="button"
                onClick={reset}
                className="focus-ring inline-flex min-h-8 shrink-0 cursor-pointer items-center rounded-md px-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
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
  onAsk,
  onOpenProject,
}: {
  entry: Entry;
  instant: boolean;
  lang: Lang;
  t: Dictionary;
  onPick: (id: IntentId) => void;
  onAsk: (suggestion: Suggestion) => void;
  onOpenProject: (slug: string) => void;
}): ReactNode {
  const [typed, setTyped] = useState(false);
  const done = instant || typed;

  return (
    <div className="flex flex-col gap-4">
      {entry.question ? (
        <p className="flex items-start gap-2 text-[13px] text-muted-foreground">
          <CornerDownRight
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
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
          <AnswerBlocks
            blocks={entry.answer.blocks}
            lang={lang}
            t={t}
            onOpenProject={onOpenProject}
            onAsk={onAsk}
          />
          <m.ul
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
          </m.ul>
        </>
      ) : null}
    </div>
  );
}
