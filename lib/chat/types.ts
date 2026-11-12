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
  | "languages";

/** A rich card rendered under the typed answer. Data is read by the renderer. */
export type Block =
  | { type: "projects"; slugs: string[]; showAll?: boolean }
  | { type: "skills" }
  | { type: "experience" }
  | { type: "education" }
  | { type: "languages" }
  | { type: "contact" }
  | { type: "cv" }
  | { type: "facts" };

export type Answer = {
  text: string;
  blocks: Block[];
  followUps: IntentId[];
};
