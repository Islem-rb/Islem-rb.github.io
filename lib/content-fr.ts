import type { Project } from "./content";

type ProjectText = Pick<
  Project,
  "kind" | "headline" | "summary" | "meta" | "highlights" | "sections"
> & { result?: string };

export const PROJECTS_FR: Record<string, ProjectText> = {
  "gitops-eks-platform": {
    kind: "Plateforme cloud",
    headline:
      "Une plateforme du commit à la production sur AWS, où une mauvaise release se retire toute seule.",
    summary:
      "EKS provisionné avec Terraform, une chaîne d’approvisionnement signée et scannée dans GitHub Actions, et Argo CD qui livre des canaries validés par Prometheus.",
    meta: "Projet personnel, 2026",
    highlights: [
      "5 modules Terraform · 39 ressources AWS",
      "11 applications Argo CD",
      "Canary 20% → 60% → 100%",
    ],
    result:
      "Une release avec 50 % d’erreurs injectées a été annulée automatiquement en 245 à 328 s, pendant que les pods stables continuaient de servir.",
    sections: [
      {
        title: "Infrastructure",
        items: [
          "5 modules Terraform écrits de zéro (VPC, EKS, IAM, ECR, workload identity), 39 blocs de ressources AWS.",
          "4 environnements : dev, staging, prod et shared.",
        ],
      },
      {
        title: "Chaîne d’approvisionnement",
        items: [
          "Accès AWS depuis la CI via OIDC, sans clés longue durée.",
          "Le pipeline applicatif lint, teste, construit 3 images, les scanne avec Trivy, génère un SBOM CycloneDX et signe avec Cosign (keyless).",
          "3 autres workflows exécutent TFLint, Checkov, les plans et terraform test.",
        ],
      },
      {
        title: "Livraison",
        items: [
          "11 Applications Argo CD réconcilient le cluster depuis Git.",
          "L’API est livrée en canary Argo Rollouts (20 %, 60 %, 100 %), validé par une analyse du taux d’erreur Prometheus.",
        ],
      },
      {
        title: "Exploitation",
        items: [
          "5 règles d’alerte Prometheus, dont 2 sur le burn rate des SLO.",
          "3 politiques d’admission Kyverno et 6 NetworkPolicies.",
          "3 runbooks et 4 architecture decision records.",
        ],
      },
    ],
  },
  "devops-observability-platform": {
    kind: "Automatisation & observabilité",
    headline:
      "Trois microservices, un pipeline, et les métriques qui les relient.",
    summary:
      "Des services Spring Boot sur un cluster kind, un pipeline Jenkins DevSecOps en huit étapes, et Argo CD synchronisé depuis un dépôt GitOps séparé.",
    meta: "Projet personnel, 2026",
    highlights: [
      "3 services Spring Boot",
      "Pipeline Jenkins en 8 étapes",
      "Sync GitOps auto-réparatrice",
    ],
    sections: [
      {
        title: "Services",
        items: [
          "3 microservices Spring Boot 3.5 sur Java 21 : users, products et orders.",
          "Chacun expose des métriques Prometheus via Actuator et Micrometer.",
        ],
      },
      {
        title: "Pipeline",
        items: [
          "8 étapes Jenkins : checkout, build et tests Maven, Gitleaks, build Docker, Trivy, push, chargement dans kind, mise à jour du tag GitOps.",
          "Gitleaks fait échouer le build à la moindre fuite de secret. Trivy remonte les vulnérabilités HIGH et CRITICAL.",
        ],
      },
      {
        title: "GitOps & monitoring",
        items: [
          "Un dépôt devops-platform-gitops séparé, synchronisé par Argo CD avec prune et self-heal automatiques.",
          "kube-prometheus-stack et Loki avec Promtail installés via Helm.",
          "Un dashboard Grafana versionné dans le dépôt : débit, latence p95, taux d’erreur, heap JVM, CPU et logs Loki des 3 services.",
          "Infrastructure AWS associée provisionnée avec Terraform.",
        ],
      },
    ],
  },
  cityvoice: {
    kind: "Ingénierie de bout en bout",
    headline:
      "Une plateforme citoyenne construite du cloud privé jusqu’à l’écran du citoyen.",
    summary:
      "Un cloud privé OpenStack, un cluster Kubernetes automatisé avec Ansible, et neuf modules Spring Boot derrière une gateway, exposés via Cloudflare Tunnel.",
    meta: "Projet académique en équipe, 2026",
    highlights: [
      "Cluster Ansible en 7 rôles",
      "9 modules Spring Boot",
      "JWT + OAuth2, WebSocket en direct",
    ],
    sections: [
      {
        title: "Infrastructure",
        items: [
          "IaaS complet sur OpenStack : Nova, Neutron, Heat, Octavia, supervisé avec Zabbix.",
          "Cluster Kubernetes automatisé avec Ansible en 7 rôles.",
          "CI/CD Jenkins déclenché par webhooks GitHub, exposé publiquement via Cloudflare Tunnel sur un domaine personnalisé.",
        ],
      },
      {
        title: "Application",
        items: [
          "9 modules Spring Boot dans un seul build Maven : Spring Cloud Gateway, découverte Eureka et 7 services métier.",
          "JWT dans la gateway et les services, plus connexion OAuth2 avec Google et Facebook.",
          "Mises à jour en temps réel via WebSocket (STOMP) dans 4 services, et OpenFeign entre les services.",
        ],
      },
      {
        title: "Intelligence",
        items: [
          "Filtrage des noms par IA avec Groq (LLaMA 3) et modération des photos avec Google Cloud Vision.",
          "Un service Flask avec une random forest scikit-learn, un serveur de transcription Whisper et un bot Jami pour les signalements vocaux.",
          "Analytique d’administration, score de risque et moteur de gamification avec points, badges et niveaux de confiance.",
        ],
      },
    ],
  },
  "verdustry-social": {
    kind: "SaaS IA · Stage",
    headline:
      "Une plateforme de gestion des réseaux sociaux où l’IA planifie la stratégie et Celery publie à l’heure.",
    summary:
      "Réalisée pendant mon stage ingénieur chez Verdustry : un backend FastAPI avec des workers Celery, un tableau de bord Next.js, la génération de contenu et de stratégies par IA, et la publication sur Facebook, Instagram et TikTok.",
    meta: "Stagiaire ingénieur chez Verdustry, 2026",
    highlights: [
      "96 endpoints API · 14 tables",
      "Facebook, Instagram, TikTok",
      "Publications dues vérifiées toutes les 60 s",
    ],
    sections: [
      {
        title: "Backend",
        items: [
          "API REST FastAPI : 96 endpoints répartis sur 18 routeurs, sur PostgreSQL avec 14 tables.",
          "Espaces multi-marques avec rôles administrateur et manager, invitations, notifications et journal d’audit administrateur.",
        ],
      },
      {
        title: "IA & publication",
        items: [
          "Génération de contenus, de publications et de stratégies marketing via Groq (gpt-oss-120b), transformées en calendrier éditorial.",
          "Publication sur Facebook, Instagram et TikTok, avec analytique et métriques de performance par publication.",
          "Workers Celery avec Redis : une planification beat vérifie les publications dues toutes les 60 secondes, à côté des tâches d’analytique et de stratégie.",
        ],
      },
      {
        title: "Sécurité",
        items: [
          "Jetons des comptes sociaux chiffrés au repos avec Fernet, et connexions OAuth sécurisées par PKCE.",
          "Limitation de débit et contrôle de sécurité des liens fournis par les utilisateurs.",
        ],
      },
      {
        title: "Tableau de bord",
        items: [
          "Application Next.js avec connexion NextAuth, espaces administrateur et manager séparés, et analytique Recharts.",
        ],
      },
    ],
  },
  carnova: {
    kind: "Full-stack · Stage",
    headline:
      "Une marketplace automobile avec showroom pour concessionnaires, paiements Stripe et assistant IA local.",
    summary:
      "Réalisée pendant mon stage chez Al Idhafa Group : une API REST Spring Boot, un front Angular avec des modèles 3D de voitures, et des fonctions IA sur Ollama.",
    meta: "Stagiaire full-stack chez Al Idhafa Group, 2025",
    highlights: [
      "10 contrôleurs · 24 endpoints",
      "JWT avec 3 rôles",
      "Assistant Gemma via Ollama",
    ],
    sections: [
      {
        title: "Backend",
        items: [
          "API REST Spring Boot 3.3 sur Java 17 : 10 contrôleurs, 24 endpoints, PostgreSQL via JPA.",
          "Authentification JWT avec 3 rôles : admin, professionnel et utilisateur.",
          "Paiements via Stripe PaymentIntents. Chaque service conteneurisé avec Docker.",
        ],
      },
      {
        title: "Produit",
        items: [
          "Un espace Showroom où les concessionnaires présentent leur stock.",
          "Front Angular 16 avec des modèles 3D de voitures rendus par three.js.",
        ],
      },
      {
        title: "Fonctions IA",
        items: [
          "Un assistant sur un modèle Ollama local (gemma3:1b), avec OpenAI comme fournisseur alternatif.",
          "Suppression automatique de l’arrière-plan des photos d’annonces avec Rembg.",
        ],
      },
    ],
  },
  dawrek: {
    kind: "IA · SaaS temps réel",
    headline:
      "Des files d’attente de cliniques suivies depuis le téléphone, avec un assistant qui parle tunisien.",
    summary:
      "Les patients prennent un ticket par QR code, suivent leur tour en direct et posent leurs questions à l’écrit ou à la voix en darija, arabe, français ou anglais. Les vues accueil, salle d’attente et direction tournent sur le même backend FastAPI.",
    meta: "Projet personnel, 2026",
    highlights: [
      "5 langues, darija en écriture arabe et latine",
      "Questions vocales via Whisper",
      "28 tests automatisés",
    ],
    sections: [
      {
        title: "Patients",
        items: [
          "Un ticket depuis le téléphone en scannant un QR code, sans application à installer ni compte.",
          "Position et attente estimée en direct, puis écran vert, sonnerie et vibration à l’appel, même téléphone verrouillé (Web Push).",
          "Installable en PWA, avec un mode grand texte pour les personnes âgées et malvoyantes.",
        ],
      },
      {
        title: "Assistant",
        items: [
          "Détecte la darija tunisienne (écriture arabe ou arabizi), l’arabe, le français et l’anglais, et répond dans le même style.",
          "Répond à partir du ticket en direct du patient et d’une base de connaissances rédigée en arabe standard, en darija et en français, via Groq gpt-oss-120b.",
          "Questions vocales transcrites par Groq Whisper et réponses lues à voix haute.",
          "Les symptômes urgents contournent l’IA et orientent vers les urgences / SAMU 190. Sans clé API, il répond en mode hors ligne.",
        ],
      },
      {
        title: "Côté clinique",
        items: [
          "Une console d’accueil pour appeler, terminer, rappeler ou marquer absent, et confirmer les rendez-vous, servis en priorité avec un patient sans rendez-vous tous les deux.",
          "Des estimations d’attente qui apprennent de la médiane des passages du jour, divisée par le nombre de guichets ouverts.",
          "Un écran de salle d’attente avec annonces vocales, et un tableau de bord direction sur les heures de pointe, les attentes, les absences, les langues et les sujets.",
        ],
      },
      {
        title: "Livraison",
        items: [
          "Image Docker déployée sur Render via un Blueprint, avec des limites par visiteur pour protéger le quota IA gratuit.",
          "28 tests pytest couvrant la file, l’assistant, la voix, les rendez-vous, les réglages et les alertes téléphone.",
        ],
      },
    ],
  },
  "automotive-ml": {
    kind: "Machine learning",
    headline:
      "Prédiction de prix et recommandation de voitures selon le budget, servies en application web.",
    summary:
      "Un pipeline scikit-learn complet, du nettoyage et du clustering aux modèles supervisés, déployé derrière Flask avec des prédictions en direct.",
    meta: "Projet académique",
    highlights: [
      "3 tâches de prédiction",
      "Recommandation selon le budget",
      "Prédictions en direct avec Flask",
    ],
    sections: [
      {
        title: "Pipeline",
        items: [
          "Nettoyage des données, analyse exploratoire et clustering.",
          "Modèles supervisés pour la prédiction du prix, la classification du carburant et l’estimation de la puissance.",
        ],
      },
      {
        title: "Produit",
        items: [
          "Un système qui recommande des véhicules à partir d’un budget.",
          "Déployé en application Flask interactive avec des prédictions en direct.",
        ],
      },
    ],
  },
  sabeel: {
    kind: "Web & desktop",
    headline:
      "La supervision agricole à distance, sur le web et hors ligne sur desktop.",
    summary:
      "Une plateforme Symfony pour gérer cultures, équipements et ressources, avec une application JavaFX pensée pour les sites peu connectés.",
    meta: "Projet académique en équipe",
    highlights: [
      "Web + desktop hors ligne",
      "Suivi des ressources en temps réel",
      "Modules recrutement & conseil",
    ],
    sections: [
      {
        title: "Plateforme",
        items: [
          "Gestion centralisée des cultures, des équipements et des ressources, avec suivi en temps réel.",
          "Une application web Symfony avec tableau de bord de supervision.",
          "Une application desktop JavaFX adaptée aux environnements hors ligne.",
          "Recrutement d’ouvriers et accès à des conseillers spécialisés.",
        ],
      },
    ],
  },
};

export const EXPERIENCE_FR: Record<
  string,
  { role: string; period: string; points: string[] }
> = {
  Verdustry: {
    role: "Stagiaire ingénieur · Full-stack & IA",
    period: "juil. 2026 – août 2026",
    points: [
      "Développement de Verdustry Social, un SaaS de gestion des réseaux sociaux propulsé par l’IA, sur FastAPI, PostgreSQL et Next.js.",
      "Génération de contenus et de stratégies marketing par LLM via Groq, transformées en calendrier éditorial.",
      "Publication sur Facebook, Instagram et TikTok via leurs API, planifiée par des workers Celery sur Redis.",
      "Chiffrement des jetons sociaux au repos, OAuth sécurisé par PKCE, limitation de débit et journal d’audit administrateur.",
    ],
  },
  "Al Idhafa Group": {
    role: "Stagiaire développeur full-stack",
    period: "juil. 2025 – août 2025",
    points: [
      "Conception d’API REST Spring Boot modulaires et de composants Angular avec contrôle d’accès JWT par rôles.",
      "Création d’un espace Showroom pour les concessionnaires et intégration de Stripe Checkout.",
      "Ajout de la suppression d’arrière-plan avec Rembg et d’un assistant LLM intégré sur Gemma via Ollama.",
      "Conteneurisation de tous les services avec Docker et modélisation du schéma PostgreSQL.",
    ],
  },
  Abajim: {
    role: "Stagiaire développeur mobile",
    period: "févr. 2024 – juin 2024",
    points: [
      "Développement d’une application React Native d’accessibilité pour les personnes malvoyantes, avec une interface basse vision.",
      "Intégration de l’OCR pour extraire le texte des PDF et des images, et du TTS pour le convertir en audio.",
      "Développement du backend Node.js et MongoDB.",
    ],
  },
};

export const EDUCATION_FR: Record<string, { degree: string; period: string }> = {
  ESPRIT: {
    degree: "Diplôme d’ingénieur, Cloud & DevOps",
    period: "2023 – aujourd’hui",
  },
  ISITCOM: { degree: "Licence en informatique", period: "2021 – 2023" },
  "Lycée El Manar": {
    degree: "Baccalauréat, Sciences mathématiques",
    period: "2021",
  },
};

export const CAPABILITIES_FR = [
  "Infrastructure as Code",
  "Kubernetes & GitOps",
  "Pipelines CI/CD",
  "Sécurité de la supply chain",
  "Observabilité & SLO",
  "AWS & OpenStack",
  "Administration Linux",
  "Développement backend",
];

export const SKILL_GROUPS_FR = [
  { label: "Cloud", items: "AWS (EC2, VPC, S3, IAM, EKS), OpenStack, KVM, Hyper-V" },
  { label: "IaC & livraison", items: "Terraform, Ansible, GitHub Actions, Jenkins, Argo CD, Helm" },
  { label: "Conteneurs", items: "Docker, Kubernetes, Docker Swarm" },
  { label: "Observabilité", items: "Prometheus, Grafana, Loki, Alertmanager, Zabbix" },
  { label: "Sécurité", items: "Trivy, Gitleaks, Cosign, Kyverno, Checkov" },
  { label: "Systèmes", items: "Linux (Ubuntu, CentOS, RHEL), réseau, durcissement" },
  { label: "Code", items: "Java, Python, JavaScript, C · Spring Boot, Node.js, Angular, React" },
];

export const LANGUAGES_FR = [
  { name: "Arabe", level: "Langue maternelle" },
  { name: "Français", level: "Courant" },
  { name: "Anglais", level: "Courant" },
];
