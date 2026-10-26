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
# Vérifié dans le dépôt du projet ; preuves dans refs/FACTS.md.
glance:
  - '5 modules Terraform écrits de zéro (VPC, EKS, IAM, ECR, workload identity) : 39 blocs de ressources AWS, 4 environnements (dev, staging, prod, shared).'
  - '4 workflows GitHub Actions : le pipeline applicatif lance lint et tests, construit 3 images, les scanne avec Trivy, génère un SBOM CycloneDX, les signe avec Cosign (keyless) et met à jour le tag GitOps ; 3 autres exécutent TFLint, Checkov, les plans et terraform test.'
  - '11 Applications Argo CD. L''API est livrée en canary Argo Rollouts (20 %, 60 %, 100 %), validé par une analyse Prometheus du taux d''erreur.'
  - '5 règles d''alerte Prometheus (dont 2 de burn rate SLO), 3 politiques d''admission Kyverno, 6 NetworkPolicies, 3 runbooks et 4 ADR.'
  - 'Mesuré sur EKS (docs/RESULTS.md) : une release défectueuse avec 50 % d''erreurs injectées a été annulée automatiquement en 245 à 328 s, pendant que les pods stables continuaient de servir.'
highlights:
  - '5 modules Terraform, 39 blocs de ressources AWS'
  - '11 applications Argo CD, canary validé par Prometheus'
  - 'Trivy, SBOM et signature Cosign en CI'
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
