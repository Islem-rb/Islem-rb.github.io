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
    role: "Cloud & DevOps",
  },
  hero: {
    line1: "I build platforms",
    line2: "that",
    emphasis: "ship themselves.",
    availability: "Open to PFE internships · Tunisia or Europe",
  },
  contactButton: {
    label: "Contact",
    copied: "Email copied",
    copy: "Copy",
    show: "Show email",
  },
  projects: {
    heading: "Selected work",
    intro:
      "Platforms I designed, provisioned, and shipped, from the cloud account up to the user’s screen.",
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
  ships: {
    eyebrow: "Colophon",
    title: "How this site ships",
    intro:
      "The site is a small platform of its own: every change goes through the same gates I put on real services before anyone sees it.",
    lanes: [
      { title: "Change", nodes: ["Branch + pull request", "One commit per idea"] },
      { title: "Checks", nodes: ["TypeScript, strict", "ESLint", "Static build, 2 languages"] },
      { title: "Gates", nodes: ["No broken links", "Lighthouse budgets", "Accessibility ≥ 95"] },
      { title: "Release", nodes: ["Merge to main", "GitHub Pages deploy", "Static files, no server"] },
      { title: "Observe", nodes: ["Cookieless analytics", "Questions people email"] },
    ],
    feedback: "a failed gate blocks the merge, so main is always deployable",
    note: "Checks run in GitHub Actions on every pull request; only main is published.",
    factsTitle: "Under the hood",
    facts: [
      ["Framework", "Next.js static export, React, Tailwind CSS"],
      ["Hosting", "GitHub Pages: plain files, nothing to patch or scale"],
      ["The chat", "Runs in your browser. Answers come from this site’s own content, no AI and no data sent anywhere."],
      ["Languages", "English and French, every page"],
      ["Privacy", "No cookies, no tracking banner"],
    ] as [string, string][],
    source: "Read the source",
    link: "How this site ships",
  },
  contact: {
    heading: "Let’s build something",
    body: "I’m looking for a PFE internship in Cloud, DevOps or Platform Engineering. Email is the fastest way to reach me.",
    subject: "Hello Islem, about an opportunity",
    email: "Email",
    eyebrow: "Contact",
    cv: "Résumé",
    top: "Back to top",
    rights: "Designed and built from scratch.",
  },
  about: {
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
      "Type / to see every question…",
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
      deploy: "How do you deploy?",
      timeline: "Show the timeline",
      why: "Why should we hire you?",
      learning: "What are you learning now?",
    },
    emailQuestion: "Email me this question",
    showAll: "Show every question",
    slashHint: "Type / to see every question",
    slashTitle: "Everything you can ask",
    earlier: "Earlier:",
    questionSubject: "A question from your portfolio",
    openProject: (name: string) => `Open ${name}`,
    navLabel: "Ask a question",
    kinds: { question: "Question", project: "Project", tool: "Tool" },
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
      deploy:
        "The way this page just arrived: a small slice first, health checks, then everyone. My GitOps platform does that for every commit, and nobody touches the cluster by hand.",
      timeline:
        "Here is the same map by year. I started with a web and desktop app in 2024, moved through machine learning and full-stack products, and by 2026 most of what I build is cloud platforms.",
      why:
        "Because I’ve already done the work an intern usually learns on the job: a GitOps platform on EKS where a bad release stops itself, Terraform instead of console clicks, signed images, and alerts that fire before users notice. And I write down what broke and why.",
      learning:
        "Right now: Karpenter for node autoscaling with cost visibility per namespace on EKS, and finding the root cause of a DNS failure I hit after restoring a cluster with Velero.",
      fallback:
        "I don’t have an answer for that one yet. Send it to me and I’ll reply by email, or try a project name, a tool like “kubernetes”, or one of these.",
    },
  },
  map: {
    intro:
      "Cloud & DevOps engineering student at ESPRIT. Everything I’ve built is on this map. Ask a question, or pick a point.",
    label: "Map of my projects and the tools each one is built with",
    layout: "Layout",
    expand: "Full screen",
    close: "Close",
    modes: { map: "Map", time: "Timeline" },
    captions: {
      map: "Each project is linked to the tools it is built with. Pick any point.",
      time: "The same projects by year, from a web app in 2024 to cloud platforms in 2026.",
    },
    cats: { cloud: "Cloud & platform", product: "Products", ai: "AI & data" },
    inCategory: (n: number, cat: string) =>
      `${n} projects in ${cat}. Pick one to read more.`,
    tool: (name: string) => `Projects using ${name}`,
    phases: [
      "Deploying this page…",
      "Rolling out · 10%",
      "Health checks passed · 50%",
      "Live · rolled out in 3 steps",
    ],
    replay: "Replay",
    back: "Back to the map",
    fullStudy: "Full case study",
  },
  glance: {
    title: "At a glance",
    projects: { name: "Projects", what: "Cloud platforms, GitOps pipelines and full-stack products", go: "View all" },
    experience: { name: "Experience", what: "Internships at Verdustry, Al Idhafa Group and Abajim", go: "Read" },
    education: { name: "Education", what: "Engineering degree in Cloud & DevOps, ESPRIT", go: "Read" },
    resume: { name: "Résumé", what: "English and French, PDF", go: "Download" },
    contact: { name: "Contact", what: "Open to PFE internships in Tunisia or Europe", go: "Get in touch" },
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
    shipsTitle: "How this site ships",
    shipsDescription: "The checks and pipeline behind this portfolio: types, lint, links, Lighthouse budgets, then GitHub Pages.",
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
    role: "Cloud & DevOps",
  },
  hero: {
    line1: "Je construis des plateformes",
    line2: "qui",
    emphasis: "se déploient seules.",
    availability: "Disponible pour un stage PFE · Tunisie ou Europe",
  },
  contactButton: {
    label: "Contact",
    copied: "E-mail copié",
    copy: "Copier",
    show: "Afficher l’e-mail",
  },
  projects: {
    heading: "Projets choisis",
    intro:
      "Des plateformes que j’ai conçues, provisionnées et livrées, du compte cloud jusqu’à l’écran de l’utilisateur.",
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
  ships: {
    eyebrow: "Colophon",
    title: "Comment ce site est livré",
    intro:
      "Le site est une petite plateforme à part entière : chaque changement passe par les mêmes contrôles que je mets sur de vrais services avant que quiconque le voie.",
    lanes: [
      { title: "Changement", nodes: ["Branche + pull request", "Un commit par idée"] },
      { title: "Contrôles", nodes: ["TypeScript strict", "ESLint", "Build statique, 2 langues"] },
      { title: "Portes", nodes: ["Aucun lien cassé", "Budgets Lighthouse", "Accessibilité ≥ 95"] },
      { title: "Mise en ligne", nodes: ["Fusion dans main", "Déploiement GitHub Pages", "Fichiers statiques, sans serveur"] },
      { title: "Observer", nodes: ["Analytics sans cookies", "Questions reçues par e-mail"] },
    ],
    feedback: "une porte en échec bloque la fusion, donc main est toujours déployable",
    note: "Les contrôles tournent dans GitHub Actions à chaque pull request ; seule main est publiée.",
    factsTitle: "Sous le capot",
    facts: [
      ["Framework", "Next.js en export statique, React, Tailwind CSS"],
      ["Hébergement", "GitHub Pages : des fichiers simples, rien à patcher ni à dimensionner"],
      ["Le chat", "Il tourne dans votre navigateur. Les réponses viennent du contenu du site, sans IA et sans rien envoyer."],
      ["Langues", "Anglais et français, sur chaque page"],
      ["Vie privée", "Pas de cookies, pas de bandeau de suivi"],
    ] as [string, string][],
    source: "Lire le code source",
    link: "Comment ce site est livré",
  },
  contact: {
    heading: "Construisons quelque chose",
    body: "Je cherche un stage PFE en Cloud, DevOps ou Platform Engineering. Le plus rapide pour me joindre, c’est l’e-mail.",
    subject: "Bonjour Islem, à propos d’une opportunité",
    email: "E-mail",
    eyebrow: "Contact",
    cv: "CV",
    top: "Haut de page",
    rights: "Conçu et développé de A à Z.",
  },
  about: {
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
      "Tapez / pour voir toutes les questions…",
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
      deploy: "Comment déploies-tu ?",
      timeline: "Voir la chronologie",
      why: "Pourquoi te recruter ?",
      learning: "Qu’apprends-tu en ce moment ?",
    },
    emailQuestion: "M’envoyer cette question",
    showAll: "Voir toutes les questions",
    slashHint: "Tapez / pour voir toutes les questions",
    slashTitle: "Tout ce que vous pouvez demander",
    earlier: "Avant :",
    questionSubject: "Une question depuis ton portfolio",
    openProject: (name: string) => `Ouvrir ${name}`,
    navLabel: "Poser une question",
    kinds: { question: "Question", project: "Projet", tool: "Outil" },
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
      deploy:
        "Comme cette page vient d’arriver : une petite tranche d’abord, des contrôles de santé, puis tout le monde. Ma plateforme GitOps fait ça à chaque commit, et personne ne touche au cluster à la main.",
      timeline:
        "Voici la même carte par année. J’ai commencé par une application web et desktop en 2024, puis du machine learning et des produits full-stack, et en 2026 je construis surtout des plateformes cloud.",
      why:
        "Parce que j’ai déjà fait ce qu’un stagiaire apprend d’habitude sur le terrain : une plateforme GitOps sur EKS où une mauvaise version s’arrête toute seule, Terraform plutôt que des clics dans la console, des images signées, et des alertes qui sonnent avant les utilisateurs. Et je note ce qui a cassé, et pourquoi.",
      learning:
        "En ce moment : Karpenter pour l’autoscaling des nœuds avec le coût par namespace sur EKS, et la cause d’une panne DNS rencontrée après la restauration d’un cluster avec Velero.",
      fallback:
        "Je n’ai pas encore de réponse à ça. Envoyez-la-moi et je répondrai par e-mail, ou essayez un nom de projet, un outil comme « kubernetes », ou l’une de ces questions.",
    },
  },
  map: {
    intro:
      "Élève ingénieur Cloud & DevOps à ESPRIT. Tout ce que j’ai construit est sur cette carte. Posez une question, ou choisissez un point.",
    label: "Carte de mes projets et des outils utilisés par chacun",
    layout: "Disposition",
    expand: "Plein écran",
    close: "Fermer",
    modes: { map: "Carte", time: "Chronologie" },
    captions: {
      map: "Chaque projet est relié aux outils qui le composent. Choisissez un point.",
      time: "Les mêmes projets par année, d’une application web en 2024 aux plateformes cloud en 2026.",
    },
    cats: { cloud: "Cloud & plateforme", product: "Produits", ai: "IA & données" },
    inCategory: (n: number, cat: string) =>
      `${n} projets en ${cat}. Choisissez-en un pour en savoir plus.`,
    tool: (name: string) => `Projets utilisant ${name}`,
    phases: [
      "Déploiement de cette page…",
      "Déploiement progressif · 10 %",
      "Contrôles de santé validés · 50 %",
      "En ligne · déployée en 3 étapes",
    ],
    replay: "Rejouer",
    back: "Retour à la carte",
    fullStudy: "Étude de cas complète",
  },
  glance: {
    title: "En un coup d’œil",
    projects: { name: "Projets", what: "Plateformes cloud, pipelines GitOps et produits full-stack", go: "Tout voir" },
    experience: { name: "Expérience", what: "Stages chez Verdustry, Al Idhafa Group et Abajim", go: "Lire" },
    education: { name: "Formation", what: "Diplôme d’ingénieur Cloud & DevOps, ESPRIT", go: "Lire" },
    resume: { name: "CV", what: "Français et anglais, PDF", go: "Télécharger" },
    contact: { name: "Contact", what: "Ouvert aux stages PFE en Tunisie ou en Europe", go: "Me contacter" },
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
    shipsTitle: "Comment ce site est livré",
    shipsDescription: "Les contrôles et le pipeline derrière ce portfolio : types, lint, liens, budgets Lighthouse, puis GitHub Pages.",
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
