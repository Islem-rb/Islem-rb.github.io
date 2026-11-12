import {
  getExperience,
  getProjects,
  getSkillGroups,
  profile,
} from "@/lib/content";
import { getDictionary, type Lang } from "@/lib/i18n";

import type { Answer, IntentId } from "./types";

const COMMANDS = ["help", "whoami", "ls", "kubectl", "terraform", "git", "sudo"];

const HELP = [
  "help                  show this list",
  "whoami                who you are talking to",
  "ls                    list the projects",
  "kubectl get projects  projects as workloads",
  "kubectl get skills    the toolbox",
  "terraform plan        see what hiring me changes",
  "git log               my experience, as commits",
  "sudo hire islem       skip the interview",
  "clear                 wipe the screen",
];

function table(rows: string[][]): string[] {
  const widths = rows[0]!.map((_, col) =>
    Math.max(...rows.map((row) => (row[col] ?? "").length)),
  );
  return rows.map((row) =>
    row
      .map((cell, col) => cell.padEnd(widths[col]! + 3))
      .join("")
      .trimEnd(),
  );
}

/**
 * Terminal-style easter eggs. Returns nothing when the input is not a
 * command, so normal question matching can take over.
 */
export function runCommand(query: string, lang: Lang): Answer | undefined {
  const input = query.trim().toLowerCase().replace(/\s+/g, " ");
  const [name = "", ...args] = input.split(" ");
  if (!COMMANDS.includes(name)) return undefined;
  // "help me find…" is a question, and a bare "terraform" is a tool lookup.
  if (["help", "whoami", "ls"].includes(name) ? args.length > 0 : args.length === 0) {
    return undefined;
  }

  const t = getDictionary(lang).ask.commands;
  const projects = getProjects(lang);
  const reply = (
    text: string,
    lines: string[],
    followUps: IntentId[],
    withContact = false,
  ): Answer => ({
    text,
    blocks: [
      { type: "terminal", lines },
      ...(withContact ? [{ type: "contact" } as const] : []),
    ],
    followUps,
  });
  const unknown = (): Answer =>
    reply(t.unknown, [`${name}: '${args.join(" ")}' is not a ${name} command.`], [
      "projects",
      "skills",
      "contact",
    ]);

  switch (name) {
    case "help":
      return reply(t.help, HELP, ["projects", "skills", "deploy"]);
    case "whoami":
      return reply(
        t.whoami,
        [profile.name, profile.role, `${profile.school} · ${profile.location}`],
        ["about", "experience", "contact"],
      );
    case "ls":
      return reply(
        t.ls,
        projects.map((p) => `${p.slug}/`),
        ["projects", "skills", "deploy"],
      );
    case "kubectl": {
      if (args[0] !== "get") return unknown();
      if (args[1] === "projects" || args[1] === "project") {
        return reply(
          t.projects,
          table([
            ["NAME", "YEAR", "STATUS"],
            ...projects.map((p) => [p.slug, p.year, "Running"]),
          ]),
          ["projects", "deploy", "skills"],
        );
      }
      if (args[1] === "skills" || args[1] === "skill") {
        return reply(
          t.skills,
          table([
            ["LAYER", "TOOLS"],
            ...getSkillGroups(lang).map((g) => [g.label, g.items]),
          ]),
          ["projects", "experience", "cv"],
        );
      }
      return reply(
        t.unknown,
        [`error: the server doesn't have a resource type "${args[1] ?? ""}"`],
        ["projects", "skills", "contact"],
      );
    }
    case "terraform":
      // Terraform and Git are also real tools I get asked about.
      if (args[0] !== "plan" && args[0] !== "apply") return undefined;
      return reply(
        t.plan,
        [
          "  + resource \"team_member\" \"islem\" {",
          `      + role     = "${profile.role}"`,
          "      + contract = \"PFE internship\"",
          "      + uptime   = \"high\"",
          "    }",
          "",
          "Plan: 1 intern to add, 0 to change, 0 to destroy.",
        ],
        ["availability", "cv", "projects"],
        true,
      );
    case "git":
      if (args[0] !== "log") return undefined;
      return reply(
        t.log,
        getExperience(lang).map(
          (job) => `* ${job.period}  ${job.role} @ ${job.company}`,
        ),
        ["experience", "projects", "cv"],
      );
    case "sudo":
      if (args[0] !== "hire") return unknown();
      return reply(
        t.hire,
        ["[sudo] password for recruiter: ********", "Permission granted."],
        ["availability", "cv", "projects"],
        true,
      );
    default:
      return undefined;
  }
}
