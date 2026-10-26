<!-- needs review by Islem: French translation of content/cv.md. Facts must stay identical. -->
# Islem Rebhi

Élève ingénieur Cloud & DevOps à ESPRIT (Ariana, Tunisie).
Domaine : platform engineering : infrastructure as code, GitOps, Kubernetes, observabilité.
Recherche : stage PFE en Cloud / DevOps / Platform Engineering (Tunisie et Europe).

## Liens
- GitHub : https://github.com/Islem-rb
- LinkedIn : https://www.linkedin.com/in/rebhi-islem/
- E-mail : islem.rebhi@esprit.tn
- CV (PDF) : /cv-fr.pdf

## Projets

### GitOps EKS Platform (projet phare)
- Année : 2026 (terminé)
- Stack : AWS (VPC, EKS, IAM, ECR), Terraform, GitHub Actions, Argo CD, Argo Rollouts, Trivy, Cosign, Prometheus, Grafana, Loki, Alertmanager
- Infrastructure AWS provisionnée avec des modules Terraform.
- CI/CD avec GitHub Actions, authentification AWS via OIDC, scans de vulnérabilités Trivy, génération de SBOM, signature Cosign.
- Déploiements GitOps avec Argo CD et progressive delivery avec Argo Rollouts.
- Observabilité avec Prometheus, Grafana, Loki et Alertmanager.
- Delivery flow : git push, GitHub Actions (OIDC, Trivy, SBOM, Cosign), ECR, Argo CD, EKS (Argo Rollouts), observabilité.
- Dépôt : https://github.com/Islem-rb/gitops-eks-platform

### DevOps Observability Platform
- Année : 2026 (terminé)
- Stack : Spring Boot, Kubernetes (kind), Helm, Prometheus, Grafana, Loki, Promtail, Jenkins, Argo CD, Terraform, Gitleaks, Trivy
- 3 microservices sur un cluster kind, déployés avec Helm, supervisés avec Prometheus et Grafana, logs centralisés avec Loki/Promtail.
- Pipeline CI/CD Jenkins avec scans DevSecOps (Gitleaks, Trivy) et déploiement GitOps automatisé via Argo CD.
- Infrastructure AWS provisionnée avec Terraform.
- Dépôt : https://github.com/Islem-rb/devops-platform

### CityVoice (plateforme de participation citoyenne)
- Année : 2026 (terminé)
- Stack : OpenStack (Nova, Neutron, Heat, Octavia, Zabbix), Kubernetes, Ansible, Jenkins, Spring Boot, Angular, Cloudflare Tunnel
- IaaS complet sur OpenStack ; cluster Kubernetes automatisé avec Ansible (7 rôles).
- CI/CD Jenkins avec webhooks GitHub ; exposition publique via Cloudflare Tunnel sur un domaine personnalisé.
- Authentification JWT + OAuth2, filtrage des noms par IA (Groq), modération des photos, notifications en temps réel (WebSocket).
- Dépôt : https://github.com/Islem-rb/cityvoice

### Carnova (marketplace automobile, projet de stage)
- Année : 2025 (terminé)
- Stack : Spring Boot, Angular, PostgreSQL, Docker, Stripe, Ollama
- API REST, JWT + contrôle d'accès par rôles, Stripe Checkout, espace vendeur « Showroom ».
- Fonctionnalités IA : suppression d'arrière-plan (Rembg) et assistant LLM (Gemma via Ollama).
- Dépôt : https://github.com/Islem-rb/carnova

## Compétences
- Cloud & infrastructure : AWS (EC2, VPC, S3, IAM, EKS), OpenStack, KVM, Hyper-V
- IaC & delivery : Terraform, Ansible, GitHub Actions, Jenkins, Argo CD, Helm
- Conteneurs : Docker, Kubernetes, Docker Swarm
- Observabilité & sécurité : Prometheus, Grafana, Loki, Zabbix, Nagios, Trivy, Gitleaks
- Systèmes : Linux (Ubuntu, CentOS, RHEL), réseaux, durcissement de serveurs
- Développement : Java, Python, JavaScript, C, Spring Boot, Node.js, Angular, React

## Expérience
- Stagiaire développement Full-Stack, Al Idhafa Group : juillet 2025 à août 2025. Développement de Carnova (voir ci-dessus).
- Stagiaire développement mobile, Abajim : février 2024 à juin 2024. Application d'accessibilité en React Native pour les personnes malvoyantes, API d'OCR et de synthèse vocale, backend Node.js + MongoDB.

## Formation
- ESPRIT (Ariana, Tunisie) : cycle ingénieur, Cloud & DevOps, septembre 2023 à aujourd'hui
- ISITCOM (Hammam Sousse) : licence en informatique, septembre 2021 à juin 2023
- Lycée El Manar, Kasserine : baccalauréat (mathématiques), 2020 à 2021

## Langues
Arabe (langue maternelle), français (courant), anglais (courant)
