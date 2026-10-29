import type { Lang } from "./i18n";

/**
 * Architecture diagrams and lessons for each case study, both languages side
 * by side. Diagram nodes only name components documented in the repos or CV.
 * The lessons are drafts written for Islem to review.
 */

type L = Record<Lang, string>;

type ArchitectureSource = {
  lanes: { title: L; nodes: string[] }[];
  feedback?: L;
  note?: L;
};

type LessonsSource = { learned: L[]; next: L[] };

const ARCHITECTURE: Record<string, ArchitectureSource> = {
  "gitops-eks-platform": {
    lanes: [
      { title: { en: "Source", fr: "Source" }, nodes: ["git push", "GitHub repo"] },
      {
        title: { en: "CI · GitHub Actions", fr: "CI · GitHub Actions" },
        nodes: ["Lint & tests", "Build 3 images", "Trivy scan", "CycloneDX SBOM", "Cosign (keyless)"],
      },
      {
        title: { en: "Registry & GitOps", fr: "Registre & GitOps" },
        nodes: ["Amazon ECR", "GitOps tag bump", "Argo CD · 11 apps"],
      },
      {
        title: { en: "AWS · Terraform", fr: "AWS · Terraform" },
        nodes: ["VPC", "EKS", "IAM · OIDC", "Argo Rollouts canary", "Kyverno · NetworkPolicies"],
      },
      {
        title: { en: "Observability", fr: "Observabilité" },
        nodes: ["Prometheus", "Grafana", "Loki", "Alertmanager"],
      },
    ],
    feedback: {
      en: "Prometheus error-rate analysis promotes or aborts each canary step",
      fr: "L’analyse du taux d’erreur Prometheus valide ou annule chaque étape du canary",
    },
  },
  "devops-observability-platform": {
    lanes: [
      { title: { en: "Source", fr: "Source" }, nodes: ["GitHub repo"] },
      {
        title: { en: "Jenkins · 8 stages", fr: "Jenkins · 8 étapes" },
        nodes: ["Maven build & tests", "Gitleaks", "Docker build", "Trivy", "Push image", "Load into kind"],
      },
      {
        title: { en: "GitOps", fr: "GitOps" },
        nodes: ["devops-platform-gitops", "Argo CD · self-heal"],
      },
      {
        title: { en: "kind cluster · Helm", fr: "Cluster kind · Helm" },
        nodes: ["users", "products", "orders"],
      },
      {
        title: { en: "Observability", fr: "Observabilité" },
        nodes: ["Prometheus", "Grafana", "Loki + Promtail"],
      },
    ],
    feedback: {
      en: "Prometheus scrapes each service’s Actuator / Micrometer metrics",
      fr: "Prometheus collecte les métriques Actuator / Micrometer de chaque service",
    },
    note: {
      en: "Supporting AWS infrastructure provisioned with Terraform",
      fr: "Infrastructure AWS associée provisionnée avec Terraform",
    },
  },
  cityvoice: {
    lanes: [
      { title: { en: "Citizens", fr: "Citoyens" }, nodes: ["Angular 18", "Jami voice bot"] },
      { title: { en: "Edge", fr: "Bordure" }, nodes: ["Cloudflare Tunnel", "Custom domain"] },
      {
        title: { en: "Kubernetes", fr: "Kubernetes" },
        nodes: ["Spring Cloud Gateway", "Eureka", "7 domain services", "WebSocket · STOMP"],
      },
      {
        title: { en: "AI services", fr: "Services IA" },
        nodes: ["Flask · random forest", "Whisper STT", "Groq · LLaMA 3", "Cloud Vision"],
      },
      {
        title: { en: "OpenStack IaaS", fr: "IaaS OpenStack" },
        nodes: ["Nova · Neutron", "Heat · Octavia", "Ansible · 7 roles", "Jenkins", "Zabbix"],
      },
    ],
    note: {
      en: "Jenkins deploys on GitHub webhooks; the whole stack runs on the team’s OpenStack cloud",
      fr: "Jenkins déploie sur webhook GitHub ; toute la stack tourne sur le cloud OpenStack de l’équipe",
    },
  },
  carnova: {
    lanes: [
      { title: { en: "Client", fr: "Client" }, nodes: ["Angular 16", "three.js 3D models"] },
      {
        title: { en: "API · Spring Boot 3.3", fr: "API · Spring Boot 3.3" },
        nodes: ["10 controllers · 24 endpoints", "JWT · 3 roles", "Dealer Showroom"],
      },
      {
        title: { en: "Data & payments", fr: "Données & paiements" },
        nodes: ["PostgreSQL · JPA", "Stripe PaymentIntents"],
      },
      { title: { en: "AI", fr: "IA" }, nodes: ["Ollama · gemma3:1b", "Rembg"] },
    ],
    note: {
      en: "Every service containerized with Docker",
      fr: "Chaque service conteneurisé avec Docker",
    },
  },
  dawrek: {
    lanes: [
      { title: { en: "Clients", fr: "Clients" }, nodes: ["React · Vercel", "Patients’ phones"] },
      {
        title: { en: "Realtime API", fr: "API temps réel" },
        nodes: ["Node.js · Render", "Socket.io", "Twilio SMS · AR/FR"],
      },
      { title: { en: "Data", fr: "Données" }, nodes: ["PostgreSQL · Supabase", "Redis · Upstash"] },
    ],
    note: { en: "TLS end to end", fr: "TLS de bout en bout" },
  },
  "automotive-ml": {
    lanes: [
      { title: { en: "Data", fr: "Données" }, nodes: ["Car dataset", "pandas cleaning"] },
      { title: { en: "Analysis", fr: "Analyse" }, nodes: ["EDA", "Clustering"] },
      {
        title: { en: "Models · scikit-learn", fr: "Modèles · scikit-learn" },
        nodes: ["Price prediction", "Fuel-type classifier", "Horsepower estimator", "Budget recommender"],
      },
      { title: { en: "Serving", fr: "Mise en service" }, nodes: ["Flask app", "Live predictions"] },
    ],
  },
  sabeel: {
    lanes: [
      { title: { en: "Users", fr: "Utilisateurs" }, nodes: ["Supervisors", "Field teams"] },
      {
        title: { en: "Apps", fr: "Applications" },
        nodes: ["Symfony web app", "JavaFX desktop · offline"],
      },
      {
        title: { en: "Modules", fr: "Modules" },
        nodes: ["Crops & equipment", "Recruitment", "Advisory"],
      },
      { title: { en: "Data", fr: "Données" }, nodes: ["MySQL"] },
    ],
  },
};

const LESSONS: Record<string, LessonsSource> = {
  "gitops-eks-platform": {
    learned: [
      {
        en: "A canary is only as good as the metric gating it. Most of the work was making the Prometheus error-rate query trustworthy.",
        fr: "Un canary ne vaut que la métrique qui le valide. L’essentiel du travail a été de rendre fiable la requête Prometheus sur le taux d’erreur.",
      },
      {
        en: "OIDC from CI to AWS and keyless Cosign removed long-lived secrets from the pipeline entirely.",
        fr: "OIDC entre la CI et AWS, et Cosign en keyless, ont supprimé tout secret longue durée du pipeline.",
      },
    ],
    next: [
      {
        en: "Add Karpenter for node autoscaling and cost visibility per namespace.",
        fr: "Ajouter Karpenter pour l’autoscaling des nœuds et une visibilité des coûts par namespace.",
      },
    ],
  },
  "devops-observability-platform": {
    learned: [
      {
        en: "Failing the build on a leaked secret is cheap. Cleaning one out of Git history later is not.",
        fr: "Faire échouer le build sur un secret exposé coûte peu. Le retirer plus tard de l’historique Git coûte cher.",
      },
      {
        en: "A separate GitOps repository means CI never needs cluster credentials.",
        fr: "Un dépôt GitOps séparé permet à la CI de ne jamais avoir besoin d’identifiants du cluster.",
      },
    ],
    next: [
      {
        en: "Move from kind to a managed cluster and alert on SLOs instead of raw thresholds.",
        fr: "Passer de kind à un cluster managé et alerter sur des SLO plutôt que sur des seuils bruts.",
      },
    ],
  },
  cityvoice: {
    learned: [
      {
        en: "Running our own IaaS showed how much a managed cloud hides: networking, load balancing and storage all had to be built by hand.",
        fr: "Gérer notre propre IaaS a montré tout ce qu’un cloud managé cache : réseau, load balancing et stockage ont dû être construits à la main.",
      },
      {
        en: "Splitting the cluster setup into Ansible roles made each step testable on its own.",
        fr: "Découper l’installation du cluster en rôles Ansible a rendu chaque étape testable séparément.",
      },
    ],
    next: [
      {
        en: "Add distributed tracing across the gateway and services with OpenTelemetry.",
        fr: "Ajouter du tracing distribué entre la gateway et les services avec OpenTelemetry.",
      },
    ],
  },
  carnova: {
    learned: [
      {
        en: "Running the LLM locally with Ollama keeps data in-house; a provider switch keeps OpenAI available when quality matters more.",
        fr: "Faire tourner le LLM en local avec Ollama garde les données en interne ; un sélecteur de fournisseur garde OpenAI disponible quand la qualité prime.",
      },
      {
        en: "Role-based access is easy to design in early and painful to retrofit.",
        fr: "Le contrôle d’accès par rôles est simple à prévoir dès le départ et pénible à ajouter après coup.",
      },
    ],
    next: [
      {
        en: "Add a CI pipeline with tests and image scanning, reusing what I built in my DevOps projects.",
        fr: "Ajouter un pipeline CI avec tests et scan d’images, en réutilisant ce que j’ai construit dans mes projets DevOps.",
      },
    ],
  },
  dawrek: {
    learned: [
      {
        en: "Real-time UX depends as much on reconnects and missed events as on the socket itself.",
        fr: "L’expérience temps réel dépend autant des reconnexions et des événements manqués que du socket lui-même.",
      },
      {
        en: "Normalizing local phone formats was essential for SMS to reach patients reliably.",
        fr: "Normaliser les formats de numéros locaux était indispensable pour que les SMS arrivent aux patients.",
      },
    ],
    next: [
      {
        en: "Containerize the API and add uptime monitoring with alerting.",
        fr: "Conteneuriser l’API et ajouter une surveillance de disponibilité avec alertes.",
      },
    ],
  },
  "automotive-ml": {
    learned: [
      {
        en: "Most of the effort went into data preparation. Clean features mattered more than the choice of model.",
        fr: "L’essentiel de l’effort est passé dans la préparation des données. Des features propres comptaient plus que le choix du modèle.",
      },
    ],
    next: [
      {
        en: "Version the models and serve them from a container behind an API.",
        fr: "Versionner les modèles et les servir depuis un conteneur derrière une API.",
      },
    ],
  },
  sabeel: {
    learned: [
      {
        en: "Designing for offline use shaped the data model: the desktop app has to work without the server.",
        fr: "Concevoir pour le hors-ligne a façonné le modèle de données : l’application desktop doit fonctionner sans le serveur.",
      },
    ],
    next: [
      {
        en: "Sync offline changes back to the web platform automatically.",
        fr: "Synchroniser automatiquement les changements hors ligne avec la plateforme web.",
      },
    ],
  },
};

export type Architecture = {
  lanes: { title: string; nodes: string[] }[];
  feedback?: string | undefined;
  note?: string | undefined;
};

export type Lessons = { learned: string[]; next: string[] };

export function getArchitecture(lang: Lang, slug: string): Architecture | undefined {
  const a = ARCHITECTURE[slug];
  if (!a) return undefined;
  return {
    lanes: a.lanes.map((lane) => ({ title: lane.title[lang], nodes: lane.nodes })),
    feedback: a.feedback?.[lang],
    note: a.note?.[lang],
  };
}

export function getLessons(lang: Lang, slug: string): Lessons | undefined {
  const l = LESSONS[slug];
  if (!l) return undefined;
  return { learned: l.learned.map((x) => x[lang]), next: l.next.map((x) => x[lang]) };
}
