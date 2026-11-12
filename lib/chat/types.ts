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
  | "deploy";

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
  | { type: "pipeline" };

export type Answer = {
  text: string;
  blocks: Block[];
  followUps: IntentId[];
};

/** A live suggestion shown under the input while typing. */
export type Suggestion = {
  label: string;
  kind: "question" | "project" | "tool";
  /** Set for questions, so picking one never depends on re-matching its label. */
  intent?: IntentId;
};
