import { expect, test } from "vitest";

import type { Lang } from "@/lib/i18n";

import { answer } from "./match";
import { CASES, type Case } from "./questions";
import type { Answer } from "./types";

/** The share of CASES that must pass. Raise it as the chat improves, never lower it. */
const MINIMUM = 0.88;

function ask(item: Case): Answer {
  const lang: Lang = item.lang ?? "en";
  const before = item.after ? answer(item.after, lang) : undefined;
  return answer(item.q, lang, before?.context);
}

/** Why a case fails, or null when it passes. */
function check(item: Case, got: Answer): string | null {
  if (item.match && !(got.matched ?? "").startsWith(item.match)) {
    return `matched ${got.matched ?? "nothing"}, expected ${item.match}`;
  }
  if (item.slugs) {
    const lit = [...(got.focus?.slugs ?? [])].sort().join(",");
    if (lit !== [...item.slugs].sort().join(",")) return `lit [${lit}], expected [${item.slugs.join(",")}]`;
  }
  if (item.text && !item.text.test(got.text)) return `text lacks ${item.text}`;
  return null;
}

test("the chat answers recruiters' questions", () => {
  const results = CASES.map((item) => ({ item, why: check(item, ask(item)) }));
  const passed = results.filter((r) => r.why === null).length;
  const score = passed / CASES.length;

  const groups = new Map<string, { pass: number; total: number }>();
  for (const { item, why } of results) {
    const g = groups.get(item.group) ?? { pass: 0, total: 0 };
    g.total += 1;
    if (why === null) g.pass += 1;
    groups.set(item.group, g);
  }
  const lines = [...groups].map(([name, g]) => `  ${name.padEnd(14)} ${g.pass}/${g.total}`);
  const misses = results
    .filter((r) => r.why !== null)
    .map(({ item, why }) => `  ✗ ${item.after ? `[after "${item.after}"] ` : ""}"${item.q}": ${why}`);
  console.log(
    `\nChat score: ${passed}/${CASES.length} (${Math.round(score * 100)}%)\n${lines.join("\n")}\n\nMisses:\n${misses.join("\n")}\n`,
  );

  expect(score).toBeGreaterThanOrEqual(MINIMUM);
});
