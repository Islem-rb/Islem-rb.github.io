export type IntentId =
  | "greeting"
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "contact"
  | "cv"
  | "availability"
  | "location"
  | "languages"
  | "deploy"
  | "timeline"
  | "why"
  | "learning";

/** A rich card rendered under the typed answer. Data is read by the renderer. */
export type Block =
  | { type: "projects"; slugs: string[]; showAll?: boolean }
  | { type: "skills" }
  | { type: "experience" }
  | { type: "education" }
  | { type: "languages" }
  | { type: "contact" }
  | { type: "cv" }
  | { type: "facts" }
  /** Offer to send a question the site could not answer by email. */
  | { type: "ask"; question: string };

export type Answer = {
  text: string;
  blocks: Block[];
  followUps: IntentId[];
  /** Projects, and optionally the one tool, to light up on the map. */
  focus?: { slugs: string[]; tool?: string; year?: number };
  /** A project whose case study should open beside the map. */
  open?: string;
  /** Switch the map between its two layouts. */
  mode?: "map" | "time";
  /** Replay the page's staged arrival. */
  replay?: boolean;
};

/** A live suggestion shown under the input while typing. */
export type Suggestion = {
  label: string;
  kind: "question" | "project" | "tool";
  /** Set for questions, so picking one never depends on re-matching its label. */
  intent?: IntentId;
};
