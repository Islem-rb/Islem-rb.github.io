/**
 * Single source of truth for everything personal on the site.
 * Every number here comes from the CV or a project's repository.
 */

import {
  CAPABILITIES_FR,
  EDUCATION_FR,
  EXPERIENCE_FR,
  LANGUAGES_FR,
  PROJECTS_FR,
  SKILL_GROUPS_FR,
} from "./content-fr";
import type { Lang } from "./i18n";

export const profile = {
  firstName: "Islem",
  name: "Islem Rebhi",
  role: "Cloud & DevOps Engineering Student",
  school: "ESPRIT",
  location: "Ariana, Tunisia",
  email: "rebhiislem800@gmail.com",
  github: "https://github.com/Islem-rb",
  linkedin: "https://www.linkedin.com/in/rebhi-islem/",
  cv: { en: "/cv-en.pdf", fr: "/cv-fr.pdf" },
  portrait: {
    light: "/portrait/islem-light.a712c17d.webp",
    dark: "/portrait/islem-dark.5f442658.webp",
  },
} as const;

export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: string;
  headline: string;
  summary: string;
  meta: string;
  featured: boolean;
  stack: string[];
  /** Left-to-right delivery path drawn on the card. */
  flow: string[];
  highlights: string[];
  sections: { title: string; items: string[] }[];
  repo?: string;
  live?: string;
  result?: string;
  demo?: Demo;
};

/** Self-hosted demo media under public/demos/<slug>/. */
export type Demo = {
  /** Picture for cards, when the video poster is not the best first look. */
  cover?: string;
  video?: { src: string; poster: string; duration: string; lang: Lang };
  shots?: { src: string; width: number; height: number; alt: Record<Lang, string> }[];
};

export const PROJECTS: Project[] = [
  {
    slug: "gitops-eks-platform",
    name: "GitOps EKS Platform",
    kind: "Cloud platform",
    year: "2026",
    headline:
      "A commit-to-production platform on AWS, where a bad release stops itself before it reaches everyone.",
    summary:
      "Terraform-provisioned EKS, a signed and scanned supply chain in GitHub Actions, Argo CD delivering canaries gated by Prometheus, and an incident agent that proposes the fix for a person to approve.",
    meta: "Personal project, 2026",
    featured: true,
    stack: [
      "AWS (VPC, EKS, IAM, ECR)",
      "Terraform",
      "GitHub Actions",
      "Argo CD",
      "Argo Rollouts",
      "Trivy",
      "Cosign",
      "Kyverno",
      "Prometheus",
      "Grafana",
      "Loki",
      "Alertmanager",
      "Velero",
      "Python (FastAPI)",
    ],
    flow: ["git push", "Actions", "ECR", "Argo CD", "EKS", "Prometheus"],
    highlights: [
      "5 Terraform modules · 39 resource blocks",
      "Canary 20% → 60% → 100%",
      "Incident agent that proposes reverts",
    ],
    result:
      "A release with 50% injected errors was aborted automatically in 245–328 s while stable pods kept serving.",
    sections: [
      {
        title: "Infrastructure",
        items: [
          "5 Terraform modules written from scratch (VPC, EKS, IAM, ECR, workload identity), 39 AWS resource blocks.",
          "dev and shared have been deployed, with dev created on demand and destroyed after each session. staging and prod are planned only.",
        ],
      },
      {
        title: "Supply chain",
        items: [
          "AWS access from CI through OIDC, with no long-lived AWS keys.",
          "The app pipeline lints, tests, builds 3 images, scans them with Trivy, writes a CycloneDX SBOM and signs with Cosign (keyless).",
          "3 more workflows run TFLint, Checkov, plans and terraform test, and every Kubernetes manifest is validated before merging.",
        ],
      },
      {
        title: "Delivery",
        items: [
          "13 Argo CD Application definitions across the local and EKS setups reconcile the cluster from Git.",
          "The API ships as an Argo Rollouts canary (20%, 60%, 100%) gated by a Prometheus error-rate analysis.",
        ],
      },
      {
        title: "Operations",
        items: [
          "6 Prometheus alert rules, 2 of them SLO burn-rate alerts.",
          "3 Kyverno admission policies, tested on a local cluster: 2 enforced, with the image signature check in Audit mode. 8 NetworkPolicies.",
          "Velero restores the app and its database from S3 in about 3 minutes on EKS, with one DNS issue after restores still open.",
          "3 runbooks and 6 architecture decision records.",
        ],
      },
      {
        title: "Incident agent",
        items: [
          "A Python agent turns alerts into evidence-based reports on Discord. Rules decide the cause, and its cluster access is read-only.",
          "Tested against real faults on a local cluster: 9 of 9 on-demand scenarios and 5 of 5 alert-triggered faults, one run each. I wrote both the rules and the faults.",
          "After an aborted release it opens a revert pull request that a person must approve. Run end to end twice, locally so far.",
          "A local LLM didn't improve on the rules, so it stays optional and off by default.",
        ],
      },
    ],
    repo: "https://github.com/Islem-rb/gitops-eks-platform",
    demo: {
      cover: "/demos/gitops-eks-platform/cover.webp",
      video: {
        src: "/demos/gitops-eks-platform/demo.mp4",
        poster: "/demos/gitops-eks-platform/poster.webp",
        duration: "2:07",
        lang: "en",
      },
    },
  },
  {
    slug: "devops-observability-platform",
    name: "DevOps Observability",
    kind: "Automation & observability",
    year: "2026",
    headline:
      "Three microservices, one pipeline, and the metrics that tie them together.",
    summary:
      "Spring Boot services on a kind cluster, an eight-stage Jenkins DevSecOps pipeline, and Argo CD syncing from a separate GitOps repository.",
    meta: "Personal project, 2026",
    featured: true,
    stack: [
      "Spring Boot",
      "Kubernetes (kind)",
      "Helm",
      "Jenkins",
      "Argo CD",
      "Prometheus",
      "Grafana",
      "Loki",
      "Promtail",
      "Gitleaks",
      "Trivy",
      "Terraform",
    ],
    flow: ["Jenkins", "Gitleaks", "Trivy", "Argo CD", "kind", "Grafana"],
    highlights: [
      "3 Spring Boot services",
      "8-stage Jenkins pipeline",
      "Self-healing GitOps sync",
    ],
    sections: [
      {
        title: "Services",
        items: [
          "3 Spring Boot 3.5 microservices on Java 21: users, products and orders.",
          "Each one exposes Prometheus metrics through Actuator and Micrometer.",
        ],
      },
      {
        title: "Pipeline",
        items: [
          "8 Jenkins stages: checkout, Maven build and tests, Gitleaks, Docker build, Trivy, push, load into kind, GitOps tag update.",
          "Gitleaks fails the build on any leaked secret. Trivy reports HIGH and CRITICAL findings.",
        ],
      },
      {
        title: "GitOps & monitoring",
        items: [
          "A separate devops-platform-gitops repository, synced by Argo CD with automated prune and self-heal.",
          "kube-prometheus-stack and Loki with Promtail installed through Helm.",
          "A Grafana dashboard kept as code: request rate, p95 latency, error rate, JVM heap, CPU and the Loki logs of all 3 services.",
          "Supporting AWS infrastructure provisioned with Terraform.",
          "The groundwork for the GitOps EKS Platform, which took the same ideas to AWS right after.",
        ],
      },
    ],
    repo: "https://github.com/Islem-rb/devops-platform",
    demo: {
      shots: [
        {
          src: "/demos/devops-observability-platform/grafana-dashboard.webp",
          width: 1600,
          height: 1180,
          alt: {
            en: "Grafana dashboard: request rate, p95 latency, error rate, JVM heap, CPU and Loki logs for the 3 services",
            fr: "Dashboard Grafana : débit, latence p95, taux d’erreur, heap JVM, CPU et logs Loki des 3 services",
          },
        },
        {
          src: "/demos/devops-observability-platform/argocd-sync.webp",
          width: 1600,
          height: 900,
          alt: {
            en: "Argo CD: the devops-platform app synced from the GitOps repo and healthy",
            fr: "Argo CD : l’application devops-platform synchronisée depuis le dépôt GitOps et saine",
          },
        },
      ],
    },
  },
  {
    slug: "cityvoice",
    name: "CityVoice",
    kind: "End-to-end engineering",
    year: "2025–2026",
    headline:
      "A civic platform built from the bare-metal cloud up to the citizen's screen.",
    summary:
      "A private OpenStack cloud, a Kubernetes cluster automated with Ansible, and nine Spring Boot modules behind a gateway, exposed through Cloudflare Tunnel. An ESPRIT project in a team of 7: my part was the cloud, the DevOps and some of the backend.",
    meta: "ESPRIT team project of 7, 2025–2026",
    featured: true,
    stack: [
      "OpenStack (Nova, Neutron, Heat, Octavia)",
      "Zabbix",
      "Ansible",
      "Kubernetes",
      "Jenkins",
      "Cloudflare Tunnel",
      "Spring Boot",
      "Spring Cloud Gateway",
      "Angular 18",
      "WebSocket",
      "Flask",
    ],
    flow: ["OpenStack", "Ansible", "Kubernetes", "Jenkins", "Gateway", "Angular"],
    highlights: [
      "Ansible cluster setup in 7 roles",
      "9 Spring Boot modules",
      "JWT + OAuth2, live WebSocket",
    ],
    sections: [
      {
        title: "Infrastructure",
        items: [
          "Full IaaS on OpenStack, running on nested VMs: Nova, Neutron, Heat, Octavia, monitored with Zabbix.",
          "Kubernetes cluster automated with Ansible in 7 roles.",
          "Jenkins CI/CD triggered by GitHub webhooks. The public demo ran through Cloudflare Tunnel on a custom domain.",
        ],
      },
      {
        title: "Application",
        items: [
          "9 Spring Boot modules in one Maven build: Spring Cloud Gateway, Eureka discovery and 7 domain services.",
          "JWT in the gateway and services, plus OAuth2 sign-in with Google and Facebook.",
          "Real-time updates over WebSocket (STOMP) in 4 services, and OpenFeign between services.",
        ],
      },
      {
        title: "Intelligence",
        items: [
          "AI name screening with Groq (LLaMA 3) and photo moderation with Google Cloud Vision.",
          "A Flask service with a scikit-learn random forest, a Whisper speech-to-text server and a Jami bot for voice reports.",
          "Admin analytics, risk scoring and a gamification engine with points, badges and trust levels.",
        ],
      },
    ],
    repo: "https://github.com/Islem-rb/cityvoice",
    live: "https://cityvoice-peach.vercel.app",
  },
  {
    slug: "verdustry-social",
    name: "Verdustry Social",
    kind: "AI SaaS · Internship",
    year: "2026",
    headline:
      "A social media management platform where AI plans the strategy and Celery publishes on time.",
    summary:
      "A working prototype built alone during my engineering internship at Verdustry: a FastAPI backend with Celery workers, a Next.js dashboard, AI content and strategy generation, and publishing to Facebook, Instagram and TikTok.",
    meta: "Engineering Intern at Verdustry, 2026",
    featured: true,
    stack: [
      "FastAPI",
      "PostgreSQL",
      "Celery",
      "Redis",
      "Next.js",
      "NextAuth",
      "Recharts",
      "Groq (gpt-oss-120b)",
      "Meta Graph API",
      "TikTok API",
      "Docker",
    ],
    flow: ["Next.js", "FastAPI", "Groq", "Celery", "Social APIs"],
    highlights: [
      "96 API endpoints · 14 tables",
      "Facebook, Instagram, TikTok",
      "Scheduler checks due posts every 60 s",
    ],
    sections: [
      {
        title: "Backend",
        items: [
          "FastAPI REST API: 96 endpoints across 18 routers, on PostgreSQL with 14 tables.",
          "Multi-brand workspaces with admin and manager roles, invitations, notifications and an admin audit log.",
        ],
      },
      {
        title: "AI & publishing",
        items: [
          "Content, post and marketing-strategy generation through Groq (gpt-oss-120b), turned into an editorial calendar.",
          "Publishing to Facebook, Instagram and TikTok, plus analytics and performance metrics per post.",
          "Celery workers with Redis: a beat schedule checks due posts every 60 seconds, alongside analytics and strategy tasks.",
        ],
      },
      {
        title: "Security",
        items: [
          "Social account tokens encrypted at rest with Fernet, and OAuth connections secured with PKCE.",
          "Rate limiting and URL safety checks on user-supplied links.",
        ],
      },
      {
        title: "Dashboard",
        items: [
          "Next.js app with NextAuth sign-in, separate admin and manager areas, and Recharts analytics.",
        ],
      },
    ],
    demo: {
      video: {
        src: "/demos/verdustry-social/demo.mp4",
        poster: "/demos/verdustry-social/poster.webp",
        duration: "2:52",
        lang: "fr",
      },
      shots: [
        {
          src: "/demos/verdustry-social/shot-1.webp",
          width: 1600,
          height: 900,
          alt: {
            en: "Dashboard: the brand's week, scheduled posts and recent activity",
            fr: "Tableau de bord : la semaine de la marque, les publications programmées et l’activité récente",
          },
        },
        {
          src: "/demos/verdustry-social/shot-2.webp",
          width: 1600,
          height: 900,
          alt: {
            en: "AI strategy: the weekly rhythm per network and the editorial calendar",
            fr: "Stratégie IA : le rythme hebdomadaire par réseau et le calendrier éditorial",
          },
        },
        {
          src: "/demos/verdustry-social/shot-3.webp",
          width: 1600,
          height: 900,
          alt: {
            en: "Post editor with the AI assistant proposing captions",
            fr: "Éditeur de publication avec l’assistant IA qui propose des textes",
          },
        },
        {
          src: "/demos/verdustry-social/shot-4.webp",
          width: 1600,
          height: 900,
          alt: {
            en: "Statistics: engagement, reach and performance per post",
            fr: "Statistiques : engagement, portée et performance par publication",
          },
        },
      ],
    },
  },
  {
    slug: "carnova",
    name: "Carnova",
    kind: "Full-stack · Internship",
    year: "2025",
    headline:
      "An automotive marketplace with dealer showrooms, a three.js 3D studio and secure accounts, live on free hosting.",
    summary:
      "Built alone in 2025 during my internship at Al Idhafa Group, for a client, on Angular and Spring Boot: listings, showrooms, a 3D studio with a driving sandbox, and accounts with email verification and password reset. Tested in CI on every push and deployed for free on Render and Neon.",
    meta: "Full-Stack Intern at Al Idhafa Group, 2025",
    featured: true,
    stack: [
      "Spring Boot",
      "Angular",
      "PostgreSQL",
      "three.js",
      "Docker",
      "Playwright",
      "GitHub Actions",
      "Render",
    ],
    flow: ["Angular", "REST API", "PostgreSQL", "Render"],
    highlights: [
      "10 controllers · 42 endpoints",
      "Unit + browser tests in CI",
      "Cold start 233 s → 100 s",
    ],
    sections: [
      {
        title: "Backend",
        items: [
          "Spring Boot 3.5 REST API on Java 17: 10 controllers, 42 endpoints, PostgreSQL 17 with Flyway migrations.",
          "JWT sessions revoked on password change, email verification and password reset with hashed single-use tokens, rate limiting and a strict CSP.",
          "Stripe checkout in test mode, with a mock mode for the public demo.",
        ],
      },
      {
        title: "Product",
        items: [
          "Searchable listings, a four-step publishing wizard, dealer showrooms and an admin dashboard.",
          "Angular 22 front end with signals and a three.js studio: orbit, paint colours and a driving sandbox, with a lighter mode for machines without a GPU.",
          "An assistant that works offline by default, with an optional local Ollama model.",
        ],
      },
      {
        title: "Delivery",
        items: [
          "GitHub Actions runs 69 backend tests, frontend unit tests, Playwright browser and accessibility tests, and boots the production image.",
          "One Docker image serves the API and the Angular app on Render's free plan, with the database on Neon.",
          "Spring AOT and a class-data-sharing archive cut the cold start on 0.1 CPU from 233 s to about 100 s.",
        ],
      },
    ],
    repo: "https://github.com/Islem-rb/carnova",
    live: "https://carnova-z7d2.onrender.com",
  },
  {
    slug: "dawrek",
    name: "Dawrek",
    kind: "AI · Real-time SaaS",
    year: "2026",
    headline:
      "Clinic queues that patients follow from their phone, with an assistant that speaks Tunisian.",
    summary:
      "Patients take a ticket by QR code, follow their turn live and ask questions by text or voice in Darija, Arabic, French or English. Staff, waiting-room and manager views run on the same FastAPI backend.",
    meta: "Personal project, 2026",
    featured: false,
    stack: [
      "Python",
      "FastAPI",
      "Groq (gpt-oss-120b)",
      "Whisper",
      "Web Push",
      "PWA",
      "Vanilla JS",
      "Docker",
      "Render",
      "pytest",
    ],
    flow: ["QR code", "Phone", "FastAPI", "Groq", "Web Push"],
    highlights: [
      "5 languages, Darija in Arabic and Latin script",
      "Voice questions through Whisper",
      "28 automated tests",
    ],
    sections: [
      {
        title: "Patients",
        items: [
          "A ticket from the phone by scanning a QR code, with no app to install and no account.",
          "Live position and estimated wait, then a green screen, ring and vibration when called, even with the phone locked (Web Push).",
          "Installable as a PWA, with a large-text mode for elderly and low-vision patients.",
        ],
      },
      {
        title: "Assistant",
        items: [
          "Detects Tunisian Darija (Arabic script or Arabizi), Arabic, French and English, and answers in the same style.",
          "Answers from the patient's live ticket and a knowledge base written in MSA, Darija and French, through Groq gpt-oss-120b.",
          "Voice questions transcribed by Groq Whisper and answers read aloud.",
          "Urgent symptoms skip the AI and point to emergency / SAMU 190. Without an API key it answers in offline mode.",
        ],
      },
      {
        title: "Clinic side",
        items: [
          "A staff console to call, finish, recall or mark absent, and to confirm appointments, which are served first with one walk-in after every two.",
          "Wait estimates that learn from the median of the day's visits, divided by the desks open.",
          "A waiting-room screen with voice announcements, and manager insights on peak hours, waits, no-shows, languages and topics.",
        ],
      },
      {
        title: "Delivery",
        items: [
          "Docker image deployed on Render from a Blueprint, with per-visitor rate limits to protect the free AI quota.",
          "28 pytest tests covering the queue, the assistant, voice, appointments, settings and phone alerts.",
        ],
      },
    ],
    repo: "https://github.com/Islem-rb/dawrek-ai",
    live: "https://dawrek.onrender.com",
    demo: {
      shots: [
        {
          src: "/demos/dawrek/home-tn.webp",
          width: 600,
          height: 1436,
          alt: { en: "Patient app in Tunisian Darija", fr: "Application patient en darija tunisienne" },
        },
        {
          src: "/demos/dawrek/chat.webp",
          width: 600,
          height: 1298,
          alt: { en: "Assistant answering in Darija", fr: "L’assistant qui répond en darija" },
        },
        {
          src: "/demos/dawrek/voice.webp",
          width: 600,
          height: 1298,
          alt: { en: "Asking a question by voice", fr: "Poser une question à la voix" },
        },
        {
          src: "/demos/dawrek/called.webp",
          width: 600,
          height: 1298,
          alt: { en: "The phone when it is the patient's turn", fr: "Le téléphone quand c’est le tour du patient" },
        },
        {
          src: "/demos/dawrek/staff.webp",
          width: 1366,
          height: 860,
          alt: { en: "Staff console", fr: "Console de l’accueil" },
        },
        {
          src: "/demos/dawrek/screen.webp",
          width: 1600,
          height: 900,
          alt: { en: "Waiting-room screen", fr: "Écran de la salle d’attente" },
        },
        {
          src: "/demos/dawrek/insights.webp",
          width: 1440,
          height: 1092,
          alt: { en: "Manager insights", fr: "Tableau de bord de la direction" },
        },
      ],
    },
  },
  {
    slug: "automotive-ml",
    name: "Automotive ML",
    kind: "Machine learning",
    year: "2025",
    headline:
      "Price prediction and a budget-based car recommender, served as a web app.",
    summary:
      "A full scikit-learn pipeline, from cleaning and clustering to supervised models, deployed behind Flask with live predictions.",
    meta: "ESPRIT course project, 2025",
    featured: false,
    stack: ["Python", "pandas", "NumPy", "scikit-learn", "Flask"],
    flow: ["pandas", "EDA", "Clustering", "Models", "Flask"],
    highlights: [
      "3 prediction tasks",
      "Budget-based recommender",
      "Live predictions in Flask",
    ],
    sections: [
      {
        title: "Pipeline",
        items: [
          "Data cleaning, exploratory analysis and clustering.",
          "Supervised models for price prediction, fuel-type classification and horsepower estimation.",
        ],
      },
      {
        title: "Product",
        items: [
          "A recommender that suggests vehicles from a budget.",
          "Deployed as an interactive Flask app with live predictions.",
        ],
      },
    ],
  },
  {
    slug: "sabeel",
    name: "Sabeel",
    kind: "Web & desktop",
    year: "2025",
    headline:
      "Remote supervision for farms, on the web and offline on the desktop.",
    summary:
      "A Symfony platform to manage crops, equipment and resources, with a JavaFX desktop app built for low-connectivity sites.",
    meta: "ESPRIT team project of 5, 2025",
    featured: false,
    stack: ["Symfony", "Twig", "JavaFX", "MySQL", "Git"],
    flow: ["Symfony", "MySQL", "JavaFX"],
    highlights: [
      "Web + offline desktop",
      "Real-time resource tracking",
      "Recruitment & advisory modules",
    ],
    sections: [
      {
        title: "Platform",
        items: [
          "Centralized management of crops, equipment and resources with real-time tracking.",
          "A Symfony web app with a supervision dashboard.",
          "A JavaFX desktop app adapted to offline environments.",
          "Worker recruitment and access to specialist advisors.",
        ],
      },
    ],
    repo: "https://github.com/Islem-rb/sabeel",
  },
  {
    slug: "readdly",
    name: "Readdly",
    kind: "Mobile · Internship",
    year: "2024",
    headline:
      "A phone app that reads the world out loud for people with low vision.",
    summary:
      "Built during my internship at Abajim: a React Native app that recognises text and objects through the camera and reads them aloud, with a high-contrast, large-text interface. A working app, not released to the stores.",
    meta: "Mobile Developer Intern at Abajim, 2024",
    featured: false,
    stack: ["React Native", "Node.js", "MongoDB", "OCR", "Text-to-speech"],
    flow: ["Camera", "OCR", "Text-to-speech", "Node.js", "MongoDB"],
    highlights: [
      "Text and object recognition",
      "Reads PDFs and images aloud",
      "High contrast, large text",
    ],
    sections: [
      {
        title: "App",
        items: [
          "Text and object recognition from the camera, with OCR for PDFs and images.",
          "Text-to-speech turns what was recognised into audio.",
          "A low-vision interface: high contrast and large text throughout.",
        ],
      },
      {
        title: "Backend",
        items: ["The Node.js and MongoDB backend behind it."],
      },
    ],
  },
];

export const EXPERIENCE = [
  {
    company: "Verdustry",
    role: "Engineering Intern · Full-Stack & AI",
    period: "Jul 2026 – Aug 2026",
    location: "Sfax",
    points: [
      "Built Verdustry Social, an AI-powered social media management SaaS, on FastAPI, PostgreSQL and Next.js.",
      "Generated content and marketing strategies with an LLM through Groq, and turned them into an editorial calendar.",
      "Published to Facebook, Instagram and TikTok through their APIs, scheduled by Celery workers on Redis.",
      "Encrypted social tokens at rest, secured OAuth with PKCE, and added rate limiting and an admin audit log.",
    ],
    project: "verdustry-social",
  },
  {
    company: "Al Idhafa Group",
    role: "Full-Stack Developer Intern",
    period: "Jul 2025 – Aug 2025",
    location: "Tunis",
    points: [
      "Designed modular Spring Boot REST APIs and Angular components with JWT role-based access.",
      "Built a Showroom space for car dealers and integrated Stripe Checkout.",
      "Added background removal with Rembg and an embedded LLM assistant on Gemma via Ollama.",
      "Containerized every service with Docker and modeled the PostgreSQL schema.",
    ],
    project: "carnova",
  },
  {
    company: "Abajim",
    logo: "/logos/abajim.svg",
    role: "Mobile Developer Intern",
    period: "Feb 2024 – Jun 2024",
    location: "Sousse",
    points: [
      "Built Readdly, a React Native accessibility app for visually impaired users, with text and object recognition and a high-contrast, large-text interface.",
      "Integrated OCR to extract text from PDFs and images, and TTS to turn it into audio.",
      "Developed the Node.js and MongoDB backend.",
    ],
    project: "readdly",
  },
] as const;

export const EDUCATION = [
  {
    school: "ESPRIT",
    degree: "Engineering degree, Cloud & DevOps",
    period: "2024 – 2027 (expected)",
  },
  {
    school: "ISITCOM",
    degree: "Bachelor in Computer Science",
    period: "2021 – 2024",
  },
  {
    school: "Lycée El Manar",
    degree: "Baccalauréat, Mathematics",
    period: "2021",
  },
] as const;

export const CAPABILITIES = [
  "Infrastructure as Code",
  "Kubernetes & GitOps",
  "CI/CD pipelines",
  "Supply-chain security",
  "Observability & SLOs",
  "AWS & OpenStack",
  "Linux administration",
  "Backend development",
] as const;

export const SKILL_GROUPS = [
  { label: "Cloud", items: "AWS (EC2, VPC, S3, IAM, EKS), OpenStack, KVM, Hyper-V" },
  { label: "IaC & delivery", items: "Terraform, Ansible, GitHub Actions, Jenkins, Argo CD, Helm" },
  { label: "Containers", items: "Docker, Kubernetes, Docker Swarm" },
  { label: "Observability", items: "Prometheus, Grafana, Loki, Alertmanager, Zabbix" },
  { label: "Security", items: "Trivy, Gitleaks, Cosign, Kyverno, Checkov" },
  { label: "Systems", items: "Linux (Ubuntu, CentOS, RHEL), networking, hardening" },
  { label: "Code", items: "Java, Python, JavaScript, C · Spring Boot, Node.js, Angular, React" },
] as const;

export const LANGUAGES = [
  { name: "Arabic", level: "Native" },
  { name: "French", level: "Fluent" },
  { name: "English", level: "Fluent" },
] as const;

/* ---- Localized accessors ---- */

export function getProjects(lang: Lang): Project[] {
  if (lang === "en") return PROJECTS;
  return PROJECTS.map((p) => ({ ...p, ...PROJECTS_FR[p.slug] }));
}

export function getExperience(lang: Lang) {
  return EXPERIENCE.map((e) =>
    lang === "en" ? { ...e, points: [...e.points] } : { ...e, ...EXPERIENCE_FR[e.company]! },
  );
}

export function getEducation(lang: Lang) {
  return EDUCATION.map((e) => (lang === "en" ? e : { ...e, ...EDUCATION_FR[e.school]! }));
}

export function getCapabilities(lang: Lang): readonly string[] {
  return lang === "en" ? CAPABILITIES : CAPABILITIES_FR;
}

export function getSkillGroups(lang: Lang): readonly { label: string; items: string }[] {
  return lang === "en" ? SKILL_GROUPS : SKILL_GROUPS_FR;
}

export function getLanguages(lang: Lang): readonly { name: string; level: string }[] {
  return lang === "en" ? LANGUAGES : LANGUAGES_FR;
}

/** The résumé to offer first in each language. */
export function cvFor(lang: Lang): string {
  return profile.cv[lang];
}
