import type { Lang } from "@/lib/i18n";

/**
 * Questions recruiters ask, with the answer each one should get.
 * The chat is scored against this list on every check (see chat.test.ts).
 *
 * - match: what the answer must be matched to: "intent:skills", "project:carnova",
 *   "tech" (any tool), "tech:Docker", "year:2025" or "fallback". A prefix is enough.
 * - slugs: the exact projects the map must light up.
 * - text: something the answer text must contain.
 * - after: a previous question in the same conversation (for follow-ups).
 */
export type Case = {
  q: string;
  lang?: Lang;
  group: string;
  after?: string;
  match?: string;
  slugs?: string[];
  text?: RegExp;
};

const CLOUD = ["gitops-eks-platform", "devops-observability-platform", "cityvoice"];

export const CASES: Case[] = [
  // The basics, in English.
  { group: "basics", q: "hi", match: "intent:greeting" },
  { group: "basics", q: "who are you?", match: "intent:about" },
  { group: "basics", q: "tell me about yourself", match: "intent:about" },
  { group: "basics", q: "show me your projects", match: "intent:projects" },
  { group: "basics", q: "what's your tech stack", match: "intent:skills" },
  { group: "basics", q: "where have you worked?", match: "intent:experience" },
  { group: "basics", q: "what did you study?", match: "intent:education" },
  { group: "basics", q: "how can I contact you", match: "intent:contact" },
  { group: "basics", q: "can I get your resume", match: "intent:cv" },
  { group: "basics", q: "are you available for an internship?", match: "intent:availability" },
  { group: "basics", q: "where are you based?", match: "intent:location" },
  { group: "basics", q: "what languages do you speak?", match: "intent:languages" },
  { group: "basics", q: "how do you deploy?", match: "intent:deploy" },
  { group: "basics", q: "show me the timeline", match: "intent:timeline" },
  { group: "basics", q: "why should we hire you?", match: "intent:why" },
  { group: "basics", q: "what are you learning right now?", match: "intent:learning" },

  // The basics, in French.
  { group: "basics", lang: "fr", q: "bonjour", match: "intent:greeting" },
  { group: "basics", lang: "fr", q: "qui es-tu ?", match: "intent:about" },
  { group: "basics", lang: "fr", q: "montre-moi tes projets", match: "intent:projects" },
  { group: "basics", lang: "fr", q: "quelle est ta stack ?", match: "intent:skills" },
  { group: "basics", lang: "fr", q: "où as-tu travaillé ?", match: "intent:experience" },
  { group: "basics", lang: "fr", q: "qu'as-tu étudié ?", match: "intent:education" },
  { group: "basics", lang: "fr", q: "comment te contacter ?", match: "intent:contact" },
  { group: "basics", lang: "fr", q: "télécharger ton CV", match: "intent:cv" },
  { group: "basics", lang: "fr", q: "es-tu disponible pour un stage PFE ?", match: "intent:availability" },
  { group: "basics", lang: "fr", q: "pourquoi te recruter ?", match: "intent:why" },

  // A project by name.
  { group: "projects", q: "tell me about CityVoice", match: "project:cityvoice" },
  { group: "projects", q: "gitops", match: "project:gitops-eks-platform" },
  { group: "projects", q: "what is Readdly?", match: "project:readdly" },
  { group: "projects", q: "what did you do at Abajim?", match: "project:readdly" },
  { group: "projects", q: "carnova", match: "project:carnova" },
  { group: "projects", lang: "fr", q: "parle-moi de Dawrek", match: "project:dawrek" },
  { group: "projects", q: "the observability project", match: "project:devops-observability-platform" },
  { group: "projects", q: "verdustry", match: "project:verdustry-social" },
  { group: "projects", q: "sabeel", match: "project:sabeel" },
  { group: "projects", q: "your machine learning project", match: "project:automotive-ml" },

  // Tools.
  { group: "tools", q: "do you know kubernetes?", match: "tech", slugs: ["gitops-eks-platform", "devops-observability-platform", "cityvoice"] },
  { group: "tools", q: "terraform", match: "tech:Terraform" },
  { group: "tools", q: "docker experience?", match: "tech:Docker" },
  { group: "tools", q: "have you used AWS?", match: "tech:AWS" },
  { group: "tools", q: "k8s", match: "tech" },
  { group: "tools", q: "argo cd", match: "tech" },
  { group: "tools", lang: "fr", q: "est-ce que tu connais Jenkins ?", match: "tech:Jenkins" },
  { group: "tools", q: "python", match: "tech:Python" },
  { group: "tools", q: "react native", match: "tech", slugs: ["readdly"] },
  { group: "tools", q: "kubernetes and terraform", match: "tech", slugs: ["gitops-eks-platform", "devops-observability-platform"] },

  // Years and filters.
  { group: "time", q: "what did you do in 2025?", match: "year:2025" },
  { group: "time", lang: "fr", q: "qu'as-tu fait en 2024 ?", match: "year:2024" },
  { group: "time", q: "2026", match: "year:2026" },
  { group: "time", q: "cloud projects in 2026", slugs: CLOUD },
  { group: "time", q: "show me cloud projects", slugs: CLOUD },

  // Details about one project, answered from the data.
  { group: "details", q: "did you work alone on Carnova?", text: /alone/i },
  { group: "details", q: "how big was the CityVoice team?", text: /\b7\b/ },
  { group: "details", q: "what was your role in CityVoice?", text: /cloud/i },
  { group: "details", q: "how long was the Abajim internship?", text: /Feb.*Jun 2024/ },
  { group: "details", q: "is Carnova live?", text: /onrender\.com/ },
  { group: "details", q: "which projects have a live demo?", slugs: ["cityvoice", "carnova", "dawrek"] },
  { group: "details", q: "what was the result of the GitOps platform?", text: /245/ },
  { group: "details", q: "which projects did you do in a team?", slugs: ["cityvoice", "sabeel"] },
  { group: "details", q: "when did you build Dawrek?", text: /May.*Sep 2025/ },

  // Follow-ups that depend on the previous question.
  { group: "follow-ups", after: "tell me about CityVoice", q: "what was your role?", text: /cloud/i },
  { group: "follow-ups", after: "carnova", q: "is it live?", text: /onrender\.com/ },
  { group: "follow-ups", after: "gitops", q: "which tools?", text: /Terraform/ },
  { group: "follow-ups", after: "readdly", q: "tell me more", match: "project:readdly" },
  { group: "follow-ups", after: "Dawrek", q: "when?", text: /2025/ },
  { group: "follow-ups", after: "what did you do in 2025", q: "and 2026?", match: "year:2026" },
  { group: "follow-ups", lang: "fr", after: "parle-moi de Sabeel", q: "c'était en équipe ?", text: /\b5\b/ },
  { group: "follow-ups", after: "sabeel", q: "source code?", text: /github\.com\/Islem-rb\/sabeel/ },
  { group: "follow-ups", after: "kubernetes", q: "and terraform?", match: "tech:Terraform" },

  // Questions recruiters ask that the chat does not cover yet.
  { group: "new questions", q: "what's the hardest problem you solved?", match: "intent:hardest" },
  { group: "new questions", q: "have you worked in a team?", match: "intent:team" },
  { group: "new questions", q: "can you work remotely?", match: "intent:location" },
  { group: "new questions", q: "would you relocate?", match: "intent:location" },
  { group: "new questions", q: "why devops?", match: "intent:whyDevops" },
  { group: "new questions", q: "do you have any certifications?", match: "intent:certifications" },
  { group: "new questions", q: "when can you start?", match: "intent:availability" },
  { group: "new questions", q: "what are your salary expectations?", match: "intent:salary" },
  { group: "new questions", q: "what's your biggest weakness?", match: "intent:learning" },
  { group: "new questions", lang: "fr", q: "tu as déjà travaillé en équipe ?", match: "intent:team" },
  { group: "new questions", lang: "fr", q: "quel est le problème le plus difficile que tu as résolu ?", match: "intent:hardest" },
  { group: "new questions", lang: "fr", q: "tes prétentions salariales ?", match: "intent:salary" },
  { group: "new questions", q: "AWS certifications?", match: "intent:certifications" },

  // Things the chat should admit it does not know.
  { group: "unknown", q: "what's your favourite food?", match: "fallback" },
  { group: "unknown", q: "asdfgh", match: "fallback" },
  { group: "unknown", q: "do you play football?", match: "fallback" },
  { group: "unknown", q: "weather today", match: "fallback" },

  // Typos and short forms.
  { group: "robustness", q: "kubernets", match: "tech" },
  { group: "robustness", q: "projets", match: "intent:projects" },
  { group: "robustness", q: "whats ur stack", match: "intent:skills" },
  { group: "robustness", q: "carnva", match: "project:carnova" },
  { group: "robustness", q: "experiance", match: "intent:experience" },
  { group: "robustness", q: "CV please", match: "intent:cv" },
  { group: "robustness", q: "email", match: "intent:contact" },
  { group: "robustness", q: "linkedin", match: "intent:contact" },
  { group: "robustness", q: "github", match: "intent:contact" },
  { group: "robustness", q: "are you free in february?", match: "intent:availability" },
  { group: "robustness", q: "where do you live?", match: "intent:location" },
  { group: "robustness", q: "what is ESPRIT?", match: "intent:education" },
  { group: "robustness", q: "internship", match: "intent:availability" },
];
