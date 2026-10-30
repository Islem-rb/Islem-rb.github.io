export type Lang = "en" | "fr";

export const LANGS: readonly Lang[] = ["en", "fr"];

/** "/about" -> "/fr/about" for French, unchanged for English. */
export function localePath(lang: Lang, path: string): string {
  if (lang === "en") return path;
  return path === "/" ? "/fr" : `/fr${path}`;
}

export function langFromPath(pathname: string): Lang {
  return pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
}

/** "/fr/about" -> "/about". */
export function stripLocale(pathname: string): string {
  if (pathname === "/fr") return "/";
  return pathname.startsWith("/fr/") ? pathname.slice(3) : pathname;
}

const en = {
  skip: "Skip to main content",
  nav: {
    label: "Primary",
    home: "Home",
    projects: "Projects",
    about: "About",
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
    toggleTheme: "Toggle theme",
    switchLang: "Version française",
    switchLangShort: "FR",
  },
  hero: {
    greeting: "Hey, I’m",
    line1: "I build platforms",
    line2: "that",
    emphasis: "ship themselves.",
    intro:
      "Cloud & DevOps engineering student at ESPRIT. Infrastructure as code, GitOps delivery, and systems you can actually observe.",
    availability: "Open to PFE internships · Tunisia or Europe",
    portraitAlt: "Portrait of Islem Rebhi",
    hoverHint: "hover to render",
    viewWork: "View my work",
    resume: "Résumé",
  },
  contactButton: {
    label: "Contact",
    copied: "Email copied",
    copy: "Copy",
    show: "Show email",
  },
  pipeline: {
    label: "Delivery pipeline from commit to production",
    stages: ["commit", "build", "scan", "sign", "sync", "canary", "observe"],
    replay: "Replay",
    waiting: "waiting for runner…",
    done: "rollout healthy, no one touched the cluster.",
  },
  projects: {
    heading: "Selected work",
    intro:
      "Platforms I designed, provisioned, and shipped, from the cloud account up to the user’s screen.",
    all: (n: number) => `All ${n} projects`,
    highlights: "Highlights",
    caseStudy: "Case study",
    source: (name: string) => `${name} source on GitHub`,
    pageTitle: "Things I’ve built",
    pageIntro:
      "Cloud platforms, delivery pipelines, and the products that run on them. Each one has a short case study.",
    back: "All projects",
    readSource: "Read the source",
    liveDemo: "Open live demo",
    result: "Measured result",
    stack: "Stack",
    glance: "At a glance",
    next: "Next project",
    architecture: "Architecture",
    architectureLabel: (name: string) => `${name} architecture, left to right`,
    demo: "Demo",
    demoVideo: (name: string) => `${name} demo video`,
    videoIn: (lang: Lang): string => (lang === "fr" ? "In French" : "In English"),
    screenshots: "Screenshots",
    openImage: (alt: string) => `Open full size: ${alt}`,
    feedback: "Feedback loop",
    learned: "What I learned",
    nextSteps: "What I’d do next",
  },
  contact: {
    heading: "Let’s build something",
    body: "I’m looking for a PFE internship in Cloud, DevOps or Platform Engineering. Email is the fastest way to reach me.",
    seeProjects: "See projects",
    subject: "Hello Islem, about an opportunity",
    email: "Email",
    credit: "Built with Next.js · Template by React Bits Pro",
  },
  about: {
    snapshotsLabel:
      "A few snapshots: portrait, daily commands, hometown to school, languages",
    experience: "Experience",
    seeProject: "See the project",
    education: "Education",
    whatIDo: "What I do",
    stack: "Stack",
    dragHint: "drag them around",
    resetStack: "Reset stack",
    toolbox: "Toolbox",
    languages: "Languages",
    cvPrimary: "Résumé (English)",
    cvSecondary: "CV (français)",
    factsTitle: "At a glance",
    basedIn: "Based in",
    studying: "Studying",
    studyingValue: "Engineering, Cloud & DevOps · ESPRIT",
    lookingFor: "Looking for",
    lookingForValue: "PFE internship · Tunisia or Europe",
    emailLabel: "Email",
  },
  notFound: {
    title: "This page was never deployed.",
    body: "The link may be outdated, or the address has a typo. Everything else is up and running.",
    home: "Back to home",
    projects: "See projects",
  },
  meta: {
    homeTitle: "Islem Rebhi · Cloud & DevOps Engineering Student",
    description:
      "Cloud & DevOps engineering student building GitOps platforms on Kubernetes: Terraform, Argo CD, GitHub Actions and observability with Prometheus and Grafana.",
    projectsTitle: "Projects",
    projectsDescription:
      "Cloud platforms, GitOps pipelines and full-stack products built by Islem Rebhi.",
    aboutTitle: "About",
    aboutDescription:
      "Islem Rebhi, Cloud & DevOps engineering student at ESPRIT: background, experience, education and toolbox.",
    ogTagline: "Cloud & DevOps engineering student · Kubernetes · Terraform · GitOps",
  },
};

export type Dictionary = typeof en;

const fr: Dictionary = {
  skip: "Aller au contenu principal",
  nav: {
    label: "Navigation principale",
    home: "Accueil",
    projects: "Projets",
    about: "À propos",
    toLight: "Passer au thème clair",
    toDark: "Passer au thème sombre",
    toggleTheme: "Changer de thème",
    switchLang: "English version",
    switchLangShort: "EN",
  },
  hero: {
    greeting: "Salut, moi c’est",
    line1: "Je construis des plateformes",
    line2: "qui",
    emphasis: "se déploient seules.",
    intro:
      "Étudiant ingénieur Cloud & DevOps à ESPRIT. Infrastructure as code, livraison GitOps et systèmes réellement observables.",
    availability: "Disponible pour un stage PFE · Tunisie ou Europe",
    portraitAlt: "Portrait d’Islem Rebhi",
    hoverHint: "survolez pour le rendu",
    viewWork: "Voir mes projets",
    resume: "CV",
  },
  contactButton: {
    label: "Contact",
    copied: "E-mail copié",
    copy: "Copier",
    show: "Afficher l’e-mail",
  },
  pipeline: {
    label: "Pipeline de livraison, du commit à la production",
    stages: ["commit", "build", "scan", "signature", "sync", "canary", "observe"],
    replay: "Rejouer",
    waiting: "en attente du runner…",
    done: "déploiement sain, personne n’a touché au cluster.",
  },
  projects: {
    heading: "Projets choisis",
    intro:
      "Des plateformes que j’ai conçues, provisionnées et livrées, du compte cloud jusqu’à l’écran de l’utilisateur.",
    all: (n: number) => `Les ${n} projets`,
    highlights: "Points clés",
    caseStudy: "Étude de cas",
    source: (name: string) => `Code source de ${name} sur GitHub`,
    pageTitle: "Ce que j’ai construit",
    pageIntro:
      "Des plateformes cloud, des pipelines de livraison et les produits qui tournent dessus. Chacun a sa courte étude de cas.",
    back: "Tous les projets",
    readSource: "Voir le code",
    liveDemo: "Voir la démo",
    result: "Résultat mesuré",
    stack: "Stack",
    glance: "En bref",
    next: "Projet suivant",
    architecture: "Architecture",
    architectureLabel: (name: string) => `Architecture de ${name}, de gauche à droite`,
    demo: "Démo",
    demoVideo: (name: string) => `Vidéo de démonstration de ${name}`,
    videoIn: (lang: Lang) => (lang === "fr" ? "En français" : "En anglais"),
    screenshots: "Captures d’écran",
    openImage: (alt: string) => `Agrandir : ${alt}`,
    feedback: "Boucle de retour",
    learned: "Ce que j’ai appris",
    nextSteps: "Ce que je ferais ensuite",
  },
  contact: {
    heading: "Construisons quelque chose",
    body: "Je cherche un stage PFE en Cloud, DevOps ou Platform Engineering. Le plus rapide pour me joindre, c’est l’e-mail.",
    seeProjects: "Voir les projets",
    subject: "Bonjour Islem, à propos d’une opportunité",
    email: "E-mail",
    credit: "Réalisé avec Next.js · Modèle React Bits Pro",
  },
  about: {
    snapshotsLabel:
      "Quelques instantanés : portrait, commandes du quotidien, parcours, langues",
    experience: "Expérience",
    seeProject: "Voir le projet",
    education: "Formation",
    whatIDo: "Ce que je fais",
    stack: "Stack",
    dragHint: "faites-les glisser",
    resetStack: "Réinitialiser",
    toolbox: "Boîte à outils",
    languages: "Langues",
    cvPrimary: "CV (français)",
    cvSecondary: "Résumé (English)",
    factsTitle: "En bref",
    basedIn: "Basé à",
    studying: "Études",
    studyingValue: "Ingénieur Cloud & DevOps · ESPRIT",
    lookingFor: "Recherche",
    lookingForValue: "Stage PFE · Tunisie ou Europe",
    emailLabel: "E-mail",
  },
  notFound: {
    title: "Cette page n’a jamais été déployée.",
    body: "Le lien est peut-être obsolète, ou l’adresse contient une faute. Tout le reste fonctionne.",
    home: "Retour à l’accueil",
    projects: "Voir les projets",
  },
  meta: {
    homeTitle: "Islem Rebhi · Étudiant ingénieur Cloud & DevOps",
    description:
      "Étudiant ingénieur Cloud & DevOps : plateformes GitOps sur Kubernetes avec Terraform, Argo CD, GitHub Actions, et observabilité avec Prometheus et Grafana.",
    projectsTitle: "Projets",
    projectsDescription:
      "Plateformes cloud, pipelines GitOps et produits full-stack réalisés par Islem Rebhi.",
    aboutTitle: "À propos",
    aboutDescription:
      "Islem Rebhi, étudiant ingénieur Cloud & DevOps à ESPRIT : parcours, expérience, formation et outils.",
    ogTagline: "Étudiant ingénieur Cloud & DevOps · Kubernetes · Terraform · GitOps",
  },
};

const DICTIONARIES: Record<Lang, Dictionary> = { en, fr };

export function getDictionary(lang: Lang): Dictionary {
  return DICTIONARIES[lang];
}
