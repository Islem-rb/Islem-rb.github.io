---
# needs review by Islem (French translation of ../devops-observability-platform.md)
title: DevOps Observability Platform
summary: 'Trois microservices sur un cluster kind, déployés avec Helm, supervisés avec Prometheus et Grafana, avec un pipeline DevSecOps Jenkins et une livraison GitOps via Argo CD.'
stack:
  - Spring Boot
  - Kubernetes (kind)
  - Helm
  - Prometheus
  - Grafana
  - Loki
  - Promtail
  - Jenkins
  - Argo CD
  - Terraform
  - Gitleaks
  - Trivy
repo: https://github.com/Islem-rb/devops-platform
order: 2
year: '2026'
inProgress: false
featured: false
# Vérifié dans le dépôt du projet ; preuves dans refs/FACTS.md.
glance:
  - '3 microservices Spring Boot 3.5 sur Java 21 (utilisateurs, produits, commandes), qui exposent chacun des métriques Prometheus via Actuator et Micrometer.'
  - 'Pipeline Jenkins en 8 étapes : checkout, build et tests Maven, Gitleaks (bloque le build en cas de fuite), build Docker, rapport Trivy HIGH et CRITICAL, push, chargement dans kind, mise à jour du tag GitOps.'
  - 'GitOps depuis un dépôt séparé (devops-platform-gitops) : une Application Argo CD avec synchronisation automatique, prune et self-heal.'
  - 'Supervision et logs installés avec Helm (kube-prometheus-stack, Loki stack avec Promtail), configurés par 4 fichiers de values.'
highlights:
  - '3 services Spring Boot avec métriques Prometheus'
  - 'Pipeline Jenkins en 8 étapes avec Gitleaks et Trivy'
  - 'Synchronisation Argo CD depuis un dépôt GitOps'
---

## Plateforme

3 microservices sur un cluster kind, déployés avec Helm, supervisés avec Prometheus et Grafana, logs centralisés avec Loki/Promtail.

## Pipeline

Pipeline CI/CD Jenkins avec scans DevSecOps (Gitleaks, Trivy) et déploiement GitOps automatisé via Argo CD.

## Infrastructure

Infrastructure AWS provisionnée avec Terraform.
