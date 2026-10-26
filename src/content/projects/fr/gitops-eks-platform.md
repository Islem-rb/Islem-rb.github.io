---
# needs review by Islem (French translation of ../gitops-eks-platform.md)
title: GitOps EKS Platform
summary: 'Infrastructure AWS provisionnée avec des modules Terraform, CI sécurisée avec GitHub Actions, déploiements GitOps avec Argo CD et progressive delivery avec Argo Rollouts sur EKS.'
kind: 'Projet phare'
stack:
  - AWS (VPC, EKS, IAM, ECR)
  - Terraform
  - GitHub Actions
  - Argo CD
  - Argo Rollouts
  - Trivy
  - Cosign
  - Prometheus
  - Grafana
  - Loki
  - Alertmanager
repo: https://github.com/Islem-rb/gitops-eks-platform
order: 1
year: '2026'
inProgress: false
featured: true
---

## Infrastructure

Infrastructure AWS (VPC, EKS, IAM, ECR) provisionnée avec des modules Terraform.

## CI/CD

CI/CD avec GitHub Actions :

- Authentification AWS via OIDC
- Scans de vulnérabilités avec Trivy
- Génération de SBOM
- Signature avec Cosign

## Delivery

Déploiements GitOps avec Argo CD et progressive delivery avec Argo Rollouts.

## Observabilité

Observabilité avec Prometheus, Grafana, Loki et Alertmanager.
