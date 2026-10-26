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
---

## Plateforme

3 microservices sur un cluster kind, déployés avec Helm, supervisés avec Prometheus et Grafana, logs centralisés avec Loki/Promtail.

## Pipeline

Pipeline CI/CD Jenkins avec scans DevSecOps (Gitleaks, Trivy) et déploiement GitOps automatisé via Argo CD.

## Infrastructure

Infrastructure AWS provisionnée avec Terraform.
