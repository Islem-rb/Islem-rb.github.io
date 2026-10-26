# Islem Rebhi

Cloud & DevOps engineering student at ESPRIT (Ariana, Tunisia).
Focus: platform engineering: infrastructure as code, GitOps, Kubernetes, observability.
Looking for: PFE internship in Cloud / DevOps / Platform Engineering (Tunisia and Europe).

## Links
- GitHub: https://github.com/Islem-rb
- LinkedIn: https://www.linkedin.com/in/rebhi-islem/
- Email: islem.rebhi@esprit.tn
- CV (PDF): /cv-en.pdf (English, to be added; falls back to /cv-fr.pdf)

## Projects

### GitOps EKS Platform (flagship)
- Year: 2026 (finished)
- Stack: AWS (VPC, EKS, IAM, ECR), Terraform, GitHub Actions, Argo CD, Argo Rollouts, Trivy, Cosign, Prometheus, Grafana, Loki, Alertmanager
- AWS infrastructure provisioned with Terraform modules.
- CI/CD with GitHub Actions, AWS authentication via OIDC, Trivy vulnerability scans, SBOM generation, Cosign signing.
- GitOps deployments with Argo CD and progressive delivery with Argo Rollouts.
- Observability with Prometheus, Grafana, Loki and Alertmanager.
- Delivery flow: git push, GitHub Actions (OIDC, Trivy, SBOM, Cosign), ECR, Argo CD, EKS (Argo Rollouts), observability.
- Repo: https://github.com/Islem-rb/gitops-eks-platform

### DevOps Observability Platform
- Year: 2026 (finished)
- Stack: Spring Boot, Kubernetes (kind), Helm, Prometheus, Grafana, Loki, Promtail, Jenkins, Argo CD, Terraform, Gitleaks, Trivy
- 3 microservices on a kind cluster, deployed with Helm, monitored with Prometheus and Grafana, logs centralised with Loki/Promtail.
- Jenkins CI/CD pipeline with DevSecOps scans (Gitleaks, Trivy) and automated GitOps deployment via Argo CD.
- AWS infrastructure provisioned with Terraform.
- Repo: https://github.com/Islem-rb/devops-platform

### CityVoice (civic engagement platform)
- Year: 2026 (finished)
- Stack: OpenStack (Nova, Neutron, Heat, Octavia, Zabbix), Kubernetes, Ansible, Jenkins, Spring Boot, Angular, Cloudflare Tunnel
- Full IaaS on OpenStack; Kubernetes cluster automated with Ansible (7 roles).
- Jenkins CI/CD with GitHub webhooks; public exposure through Cloudflare Tunnel on a custom domain.
- JWT + OAuth2 authentication, AI-based name filtering (Groq), photo moderation, real-time notifications (WebSocket).
- Repo: https://github.com/Islem-rb/cityvoice

### Carnova (automotive marketplace, internship project)
- Year: 2025 (finished)
- Stack: Spring Boot, Angular, PostgreSQL, Docker, Stripe, Ollama
- REST API, JWT + role-based access, Stripe Checkout, seller "Showroom" space.
- AI features: background removal (Rembg) and an LLM assistant (Gemma via Ollama).
- Repo: https://github.com/Islem-rb/carnova

## Skills
- Cloud & infrastructure: AWS (EC2, VPC, S3, IAM, EKS), OpenStack, KVM, Hyper-V
- IaC & delivery: Terraform, Ansible, GitHub Actions, Jenkins, Argo CD, Helm
- Containers: Docker, Kubernetes, Docker Swarm
- Observability & security: Prometheus, Grafana, Loki, Zabbix, Nagios, Trivy, Gitleaks
- Systems: Linux (Ubuntu, CentOS, RHEL), networking, server hardening
- Development: Java, Python, JavaScript, C, Spring Boot, Node.js, Angular, React

## Experience
- Full-Stack Developer Intern, Al Idhafa Group: Jul 2025 to Aug 2025. Built Carnova (see above).
- Mobile Developer Intern, Abajim: Feb 2024 to Jun 2024. React Native accessibility app for visually impaired users, OCR and text-to-speech APIs, Node.js + MongoDB backend.

## Education
- ESPRIT (Ariana, Tunisia): Engineering cycle, Cloud & DevOps, Sept 2023 to present
- ISITCOM (Hammam Sousse): Bachelor in Computer Science, Sept 2021 to June 2023
- Lycée El Manar, Kasserine: Baccalauréat (Mathematics), 2020 to 2021

## Languages
Arabic (native), French (fluent), English (fluent)
