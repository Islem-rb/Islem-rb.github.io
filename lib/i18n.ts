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
  ask: {
    label: "Ask anything about me",
    placeholders: [
      "Ask about my projects…",
      "What’s your stack?",
      "Are you available for an internship?",
      "Try “kubernetes” or “terraform”…",
    ],
    submit: "Ask",
    clear: "Clear",
    hint: "Answers come straight from this site, no AI involved.",
    suggestions: "Suggestions",
    followUps: "Keep going",
    allProjects: (n: number) => `All ${n} projects`,
    chips: {
      greeting: "Say hi",
      about: "Who are you?",
      projects: "Show me your projects",
      skills: "What’s your stack?",
      experience: "Where have you worked?",
      education: "What did you study?",
      contact: "How do I reach you?",
      cv: "Get the résumé",
      availability: "Are you available?",
      location: "Where are you based?",
      languages: "Which languages do you speak?",
    },
    answers: {
      greeting:
        "Hey! I’m Islem. Ask me about my projects, my stack, or whether I’m free for an internship.",
      about:
        "I’m Islem Rebhi, a Cloud & DevOps engineering student at ESPRIT. I like building platforms that ship themselves: infrastructure as code, GitOps delivery, and systems you can actually observe.",
      projects: (n: number) =>
        `I’ve shipped ${n} projects so far, from cloud platforms to full-stack products. These are the ones I’m proudest of.`,
      tech: (tech: string, n: number) =>
        n === 1
          ? `Yes, I’ve used ${tech}. Here’s the project where it does real work.`
          : `Yes, ${tech} shows up in ${n} of my projects. Here they are.`,
      techSkill: (tech: string) =>
        `${tech} is in my toolbox, even if no project on this site is built around it. Here’s the full stack.`,
      skills:
        "Mostly cloud and delivery tooling: AWS, Terraform, Kubernetes, Argo CD and a full observability stack, with backend code when the platform needs it.",
      experience:
        "Three internships so far, moving from mobile to full-stack to AI-powered SaaS.",
      education:
        "I’m in the engineering cycle at ESPRIT, specialising in Cloud & DevOps, after a bachelor in computer science.",
      contact:
        "Email is the fastest way to reach me. I’m also on LinkedIn and GitHub.",
      cv: "Here’s my résumé, in English and in French.",
      availability:
        "Yes. I’m looking for a PFE internship in Cloud, DevOps or Platform Engineering, in Tunisia or Europe.",
      location:
        "I’m based in Ariana, Tunisia, and open to internships in Tunisia or Europe.",
      languages: "I speak Arabic, French and English.",
      fallback:
        "I don’t have an answer for that one. Try a project name, a tool like “kubernetes”, or one of these.",
    },
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
  ask: {
    label: "Posez-moi une question",
    placeholders: [
      "Demandez-moi mes projets…",
      "Quelle est ta stack ?",
      "Es-tu disponible pour un stage ?",
      "Essayez « kubernetes » ou « terraform »…",
    ],
    submit: "Demander",
    clear: "Effacer",
    hint: "Les réponses viennent directement de ce site, sans IA.",
    suggestions: "Suggestions",
    followUps: "Pour continuer",
    allProjects: (n: number) => `Les ${n} projets`,
    chips: {
      greeting: "Dire bonjour",
      about: "Qui es-tu ?",
      projects: "Montre-moi tes projets",
      skills: "Quelle est ta stack ?",
      experience: "Où as-tu travaillé ?",
      education: "Qu’as-tu étudié ?",
      contact: "Comment te contacter ?",
      cv: "Télécharger le CV",
      availability: "Es-tu disponible ?",
      location: "Où es-tu basé ?",
      languages: "Quelles langues parles-tu ?",
    },
    answers: {
      greeting:
        "Salut ! Moi c’est Islem. Demandez-moi mes projets, ma stack, ou si je suis disponible pour un stage.",
      about:
        "Je suis Islem Rebhi, élève ingénieur Cloud & DevOps à ESPRIT. J’aime construire des plateformes qui se déploient toutes seules : infrastructure as code, livraison GitOps et systèmes réellement observables.",
      projects: (n: number) =>
        `J’ai livré ${n} projets jusqu’ici, des plateformes cloud aux produits full-stack. Voici ceux dont je suis le plus fier.`,
      tech: (tech: string, n: number) =>
        n === 1
          ? `Oui, j’ai utilisé ${tech}. Voici le projet où il sert vraiment.`
          : `Oui, ${tech} apparaît dans ${n} de mes projets. Les voici.`,
      techSkill: (tech: string) =>
        `${tech} fait partie de ma boîte à outils, même si aucun projet de ce site n’est construit autour. Voici la stack complète.`,
      skills:
        "Surtout de l’outillage cloud et de livraison : AWS, Terraform, Kubernetes, Argo CD et une stack d’observabilité complète, avec du code backend quand la plateforme en a besoin.",
      experience:
        "Trois stages jusqu’ici, du mobile au full-stack puis à un SaaS dopé à l’IA.",
      education:
        "Je suis en cycle ingénieur à ESPRIT, spécialité Cloud & DevOps, après une licence en informatique.",
      contact:
        "L’e-mail est le moyen le plus rapide de me joindre. Je suis aussi sur LinkedIn et GitHub.",
      cv: "Voici mon CV, en français et en anglais.",
      availability:
        "Oui. Je cherche un stage PFE en Cloud, DevOps ou Platform Engineering, en Tunisie ou en Europe.",
      location:
        "Je suis basé à Ariana, en Tunisie, et ouvert aux stages en Tunisie ou en Europe.",
      languages: "Je parle arabe, français et anglais.",
      fallback:
        "Je n’ai pas de réponse à ça. Essayez un nom de projet, un outil comme « kubernetes », ou l’une de ces questions.",
    },
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
