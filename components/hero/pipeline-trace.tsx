"use client";

import { Check, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

import { useReducedMotion } from "@/lib/motion";
import { useLang } from "@/lib/use-lang";

type Stage = { tool: string };

/** The path every change takes in my GitOps EKS platform. */
const STAGES: Stage[] = [
  { tool: "git push" },
  { tool: "GitHub Actions" },
  { tool: "Trivy · SBOM" },
  { tool: "Cosign" },
  { tool: "Argo CD" },
  { tool: "Argo Rollouts" },
  { tool: "Prometheus" },
];

const STEP_MS = 520;
const EASE = [0.22, 1, 0.36, 1] as const;

export function PipelineTrace(): ReactNode {
  const reduced = useReducedMotion();
  const { t: dict } = useLang();
  const t = dict.pipeline;
  const [run, setRun] = useState(0);
  const [tick, setTick] = useState(-1);
  const step = reduced ? STAGES.length : tick;

  useEffect(() => {
    if (reduced) return;
    let i = -1;
    const id = window.setInterval(() => {
      i += 1;
      setTick(i);
      if (i >= STAGES.length) window.clearInterval(id);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [run, reduced]);

  const done = step >= STAGES.length;
  const progress = Math.max(0, Math.min(step, STAGES.length - 1)) / (STAGES.length - 1);

  return (
    <div className="rounded-4xl border border-foreground/8 bg-background/70 p-1.5 shadow-sm backdrop-blur-sm">
      <div className="rounded-[1.6rem] border border-foreground/5 bg-foreground/2 px-5 py-5 sm:px-7 sm:py-6 dark:bg-foreground/4">
        <div className="mb-5 flex items-center justify-between gap-4 font-mono text-[12px] tracking-tight">
          <span className="text-foreground/55">
            <span className="text-foreground/35">~/gitops-eks-platform $</span>{" "}
            git push origin main
          </span>
          <button
            type="button"
            onClick={() => {
              setTick(-1);
              setRun((r) => r + 1);
            }}
            disabled={!done}
            className="focus-ring inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-foreground/55 transition-colors hover:text-foreground disabled:cursor-default disabled:opacity-0"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {t.replay}
          </button>
        </div>

        <ol
          className="relative grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-7"
          aria-label={t.label}
        >
          <span
            aria-hidden="true"
            className="absolute top-[11px] right-[7%] left-[7%] hidden h-px bg-foreground/10 sm:block"
          >
            <motion.span
              className="absolute inset-y-0 left-0 block bg-foreground/60"
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: STEP_MS / 1000, ease: EASE }}
            />
          </span>

          {STAGES.map((stage, i) => {
            const state = i < step ? "done" : i === step ? "active" : "idle";
            return (
              <li key={stage.tool} className="relative flex flex-col items-center gap-2.5 text-center">
                <span
                  className={`relative z-10 inline-flex h-[23px] w-[23px] items-center justify-center rounded-full border transition-colors duration-300 ${
                    state === "idle"
                      ? "border-foreground/15 bg-background"
                      : state === "active"
                        ? "border-foreground bg-background"
                        : "border-foreground bg-foreground"
                  }`}
                >
                  {state === "done" ? (
                    <Check className="h-3 w-3 text-background" strokeWidth={3} aria-hidden="true" />
                  ) : (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${state === "active" ? "bg-foreground" : "bg-foreground/20"}`}
                    />
                  )}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span
                    className={`text-[14px] font-medium tracking-tight transition-colors duration-300 ${
                      state === "idle" ? "text-foreground/45" : "text-foreground"
                    }`}
                  >
                    {t.stages[i]}
                  </span>
                  <span className="font-mono text-[10.5px] leading-tight tracking-tight text-foreground/45">
                    {stage.tool}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        <p
          className="mt-5 font-mono text-[12px] tracking-tight text-foreground/55"
          aria-live="polite"
        >
          {done ? (
            <>
              <span className="text-[var(--signal)]">✓</span> {t.done}
            </>
          ) : (
            <span className="text-foreground/35">
              {step >= 0 ? `${t.stages[step]}…` : t.waiting}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
