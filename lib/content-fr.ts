import type { Project } from "./content";

type ProjectText = Pick<
  Project,
  "kind" | "headline" | "summary" | "meta" | "highlights" | "sections"
> & {
  result?: string;
  figure?: NonNullable<Project["figure"]>;
  crew?: NonNullable<Project["crew"]>;
};

export const PROJECTS_FR: Record<string, ProjectText> = {
  "gitops-eks-platform": {
    kind: "Plateforme cloud",
    figure: { value: "245–328 s", label: "pour annuler une mauvaise release, automatiquement" },
    headline:
      "Une plateforme du commit à la production sur AWS, où une mauvaise release s’arrête d’elle-même avant de toucher tout le monde.",
    summary:
      "EKS provisionné avec Terraform, une chaîne d’approvisionnement signée et scannée dans GitHub Actions, Argo CD qui livre des canaries validés par Prometheus, et un agent d’incident qui propose le correctif à faire approuver par une personne.",
    meta: "Projet personnel, 2026",
    highlights: [
      "5 modules Terraform · 39 blocs de ressources",
      "Canary 20% → 60% → 100%",
      "Agent d’incident qui propose des reverts",
    ],
    result:
      "Une release avec 50 % d’erreurs injectées a été annulée automatiquement en 245 à 328 s, pendant que les pods stables continuaient de servir.",
    sections: [
      {
        title: "Infrastructure",
        items: [
          "5 modules Terraform écrits de zéro (VPC, EKS, IAM, ECR, workload identity), 39 blocs de ressources AWS.",
          "dev et shared ont été déployés, dev étant créé à la demande et détruit après chaque session. staging et prod sont seulement planifiés.",
        ],
      },
      {
        title: "Chaîne d’approvisionnement",
        items: [
          "Accès AWS depuis la CI via OIDC, sans clés AWS longue durée.",
          "Le pipeline applicatif lint, teste, construit 3 images, les scanne avec Trivy, génère un SBOM CycloneDX et signe avec Cosign (keyless).",
          "3 autres workflows exécutent TFLint, Checkov, les plans et terraform test, et chaque manifeste Kubernetes est validé avant la fusion.",
        ],
      },
      {
        title: "Livraison",
        items: [
          "13 définitions d’Applications Argo CD, entre les environnements local et EKS, réconcilient le cluster depuis Git.",
          "L’API est livrée en canary Argo Rollouts (20 %, 60 %, 100 %), validé par une analyse du taux d’erreur Prometheus.",
        ],
      },
      {
        title: "Exploitation",
        items: [
          "6 règles d’alerte Prometheus, dont 2 sur le burn rate des SLO.",
          "3 politiques d’admission Kyverno, testées sur un cluster local : 2 appliquées, la vérification de signature restant en mode Audit. 8 NetworkPolicies.",
          "Velero restaure l’application et sa base de données depuis S3 en environ 3 minutes sur EKS, avec un problème DNS après restauration encore ouvert.",
          "3 runbooks et 6 architecture decision records.",
        ],
      },
      {
        title: "Agent d’incident",
        items: [
          "Un agent Python transforme les alertes en rapports fondés sur des preuves, envoyés sur Discord. Des règles déterminent la cause, et son accès au cluster est en lecture seule.",
          "Testé sur de vraies pannes sur un cluster local : 9 scénarios sur 9 à la demande et 5 pannes sur 5 déclenchées par alerte, une exécution chacune. J’ai écrit à la fois les règles et les pannes.",
          "Après une release annulée, il ouvre une pull request de revert qu’une personne doit approuver. Exécuté de bout en bout deux fois, en local pour l’instant.",
          "Un LLM local ne faisait pas mieux que les règles : il reste donc optionnel et désactivé par défaut.",
        ],
      },
    ],
  },
  "devops-observability-platform": {
    kind: "Automatisation & observabilité",
    figure: { value: "8", label: "étapes Jenkins, du commit à la sync GitOps" },
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
          "La base de la GitOps EKS Platform, qui a repris les mêmes idées sur AWS juste après.",
        ],
      },
    ],
  },
  cityvoice: {
    kind: "Ingénierie de bout en bout",
    figure: { value: "9", label: "modules Spring Boot sur un cloud OpenStack privé" },
    crew: { size: 7, role: "le cloud, le DevOps et une partie du backend" },
    headline:
      "Une plateforme citoyenne construite du cloud privé jusqu’à l’écran du citoyen.",
    summary:
      "Un cloud privé OpenStack, un cluster Kubernetes automatisé avec Ansible, et neuf modules Spring Boot derrière une gateway, exposés via Cloudflare Tunnel. Un projet ESPRIT en équipe de 7 : ma part, c’était le cloud, le DevOps et une partie du backend.",
    meta: "Projet ESPRIT en équipe de 7, 2025–2026",
    highlights: [
      "Cluster Ansible en 7 rôles",
      "9 modules Spring Boot",
      "JWT + OAuth2, WebSocket en direct",
    ],
    sections: [
      {
        title: "Infrastructure",
        items: [
          "IaaS complet sur OpenStack, sur des VM imbriquées : Nova, Neutron, Heat, Octavia, supervisé avec Zabbix.",
          "Cluster Kubernetes automatisé avec Ansible en 7 rôles.",
          "CI/CD Jenkins déclenché par webhooks GitHub. La démo publique passait par Cloudflare Tunnel sur un domaine personnalisé.",
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
    figure: { value: "96", label: "endpoints API répartis sur 18 routeurs" },
    headline:
      "Une plateforme de gestion des réseaux sociaux où l’IA planifie la stratégie et Celery publie à l’heure.",
    summary:
      "Un prototype fonctionnel réalisé seul pendant mon stage ingénieur chez Verdustry : un backend FastAPI avec des workers Celery, un tableau de bord Next.js, la génération de contenu et de stratégies par IA, et la publication sur Facebook, Instagram et TikTok.",
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
    figure: { value: "233 → 100 s", label: "démarrage à froid sur 0,1 CPU" },
    headline:
      "Une marketplace automobile avec showrooms pour concessionnaires, un studio 3D three.js et des comptes sécurisés, en ligne sur un hébergement gratuit.",
    summary:
      "Réalisée seul en 2025 pendant mon stage chez Al Idhafa Group, pour un client, sur Angular et Spring Boot : annonces, showrooms, un studio 3D avec un mode conduite, et des comptes avec vérification d’e-mail et réinitialisation du mot de passe. Testée en CI à chaque push et déployée gratuitement sur Render et Neon.",
    meta: "Stagiaire full-stack chez Al Idhafa Group, 2025",
    highlights: [
      "10 contrôleurs · 42 endpoints",
      "Tests unitaires + navigateur en CI",
      "Démarrage à froid 233 s → 100 s",
    ],
    sections: [
      {
        title: "Backend",
        items: [
          "API REST Spring Boot 3.5 sur Java 17 : 10 contrôleurs, 42 endpoints, PostgreSQL 17 avec migrations Flyway.",
          "Sessions JWT révoquées au changement de mot de passe, vérification d’e-mail et réinitialisation par jetons hachés à usage unique, limitation de débit et CSP stricte.",
          "Paiement Stripe en mode test, avec un mode simulé pour la démo publique.",
        ],
      },
      {
        title: "Produit",
        items: [
          "Annonces avec recherche, assistant de publication en quatre étapes, showrooms de concessionnaires et tableau de bord administrateur.",
          "Front Angular 22 avec signals et un studio three.js : rotation, couleurs de peinture et mode conduite, avec un mode allégé pour les machines sans GPU.",
          "Un assistant qui fonctionne hors ligne par défaut, avec un modèle Ollama local en option.",
        ],
      },
      {
        title: "Livraison",
        items: [
          "GitHub Actions exécute 69 tests backend, les tests unitaires du front, des tests navigateur et d’accessibilité Playwright, et démarre l’image de production.",
          "Une seule image Docker sert l’API et l’application Angular sur l’offre gratuite de Render, avec la base de données sur Neon.",
          "Spring AOT et une archive de partage de classes ramènent le démarrage à froid sur 0,1 CPU de 233 s à environ 100 s.",
        ],
      },
    ],
  },
  dawrek: {
    kind: "IA · SaaS temps réel",
    figure: { value: "5", label: "langues, darija en écriture arabe et latine" },
    headline:
      "Des files d’attente de cliniques suivies depuis le téléphone, avec un assistant qui parle tunisien.",
    summary:
      "Les patients prennent un ticket par QR code, suivent leur tour en direct et posent leurs questions à l’écrit ou à la voix en darija, arabe, français ou anglais. Les vues accueil, salle d’attente et direction tournent sur le même backend FastAPI.",
    meta: "Projet personnel, 2025",
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
    figure: { value: "3", label: "tâches de prédiction : prix, carburant, puissance" },
    headline:
      "Prédiction de prix et recommandation de voitures selon le budget, servies en application web.",
    summary:
      "Un pipeline scikit-learn complet, du nettoyage et du clustering aux modèles supervisés, déployé derrière Flask avec des prédictions en direct.",
    meta: "Projet de cours ESPRIT, 2025",
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
    figure: { value: "2", label: "applications : Symfony sur le web, JavaFX hors ligne sur desktop" },
    headline:
      "La supervision agricole à distance, sur le web et hors ligne sur desktop.",
    summary:
      "Une plateforme Symfony pour gérer cultures, équipements et ressources, avec une application JavaFX pensée pour les sites peu connectés.",
    meta: "Projet ESPRIT en équipe de 5, 2025",
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
  readdly: {
    kind: "Mobile · Stage",
    figure: { value: "2", label: "types de reconnaissance : texte et objets" },
    headline:
      "Une application qui lit le monde à voix haute pour les personnes malvoyantes.",
    summary:
      "Réalisée pendant mon stage chez Abajim : une application React Native qui reconnaît le texte et les objets par la caméra et les lit à voix haute, avec une interface à fort contraste et grand texte. Une application fonctionnelle, non publiée sur les stores.",
    meta: "Stagiaire développeur mobile chez Abajim, 2024",
    highlights: [
      "Reconnaissance de texte et d’objets",
      "Lit les PDF et les images à voix haute",
      "Fort contraste, grand texte",
    ],
    sections: [
      {
        title: "Application",
        items: [
          "Reconnaissance de texte et d’objets par la caméra, avec OCR pour les PDF et les images.",
          "La synthèse vocale transforme ce qui a été reconnu en audio.",
          "Une interface basse vision : fort contraste et grand texte partout.",
        ],
      },
      {
        title: "Backend",
        items: ["Le backend Node.js et MongoDB derrière l’application."],
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
      "Développement de Readdly, une application React Native d’accessibilité pour les personnes malvoyantes, avec reconnaissance de texte et d’objets et une interface à fort contraste et grand texte.",
      "Intégration de l’OCR pour extraire le texte des PDF et des images, et du TTS pour le convertir en audio.",
      "Développement du backend Node.js et MongoDB.",
    ],
  },
};

export const EDUCATION_FR: Record<string, { degree: string; period: string }> = {
  ESPRIT: {
    degree: "Diplôme d’ingénieur, Cloud & DevOps",
    period: "2024 – 2027 (prévu)",
  },
  ISITCOM: { degree: "Licence en informatique", period: "2021 – 2024" },
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
