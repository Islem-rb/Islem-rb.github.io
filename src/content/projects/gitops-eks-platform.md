---
title: GitOps EKS Platform
summary: AWS infrastructure provisioned with Terraform modules, secure CI with GitHub Actions, GitOps deployments with Argo CD and progressive delivery with Argo Rollouts on EKS.
kind: Flagship project
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

AWS infrastructure (VPC, EKS, IAM, ECR) provisioned with Terraform modules.

## CI/CD

CI/CD with GitHub Actions:

- AWS authentication via OIDC
- Trivy vulnerability scans
- SBOM generation
- Cosign signing

## Delivery

GitOps deployments with Argo CD and progressive delivery with Argo Rollouts.

## Observability

Observability with Prometheus, Grafana, Loki and Alertmanager.
