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
          "kube-prometheus-stack et Loki avec Promtail installés via Helm, configurés par 4 fichiers values.",
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
    kind: "SaaS temps réel",
    headline:
      "Des files d’attente de cliniques que les patients suivent depuis leur téléphone, pas depuis la salle d’attente.",
    summary:
      "Suivi de file en direct via Socket.io pour les cliniques tunisiennes, avec alertes SMS Twilio en arabe et en français.",
    meta: "Projet personnel",
    highlights: [
      "Sessions de file en temps réel",
      "SMS en arabe et en français",
      "4 plateformes managées, TLS de bout en bout",
    ],
    sections: [
      {
        title: "Produit",
        items: [
          "Suivi en temps réel de la file des patients via Socket.io, avec gestion des sessions en direct.",
          "Notifications SMS Twilio avec normalisation des numéros tunisiens et messages en arabe et en français.",
        ],
      },
      {
        title: "Déploiement",
        items: [
          "Front sur Vercel, API sur Render, PostgreSQL sur Supabase et Redis sur Upstash, le tout en TLS.",
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
