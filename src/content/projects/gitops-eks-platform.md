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
# Verified against the project repository; every item has its proof in refs/FACTS.md.
glance:
  - '5 Terraform modules written from scratch (VPC, EKS, IAM, ECR, workload identity): 39 AWS resource blocks, 4 environments (dev, staging, prod, shared).'
  - '4 GitHub Actions workflows: the app pipeline lints and tests, builds 3 images, scans them with Trivy, writes a CycloneDX SBOM, signs with Cosign (keyless) and bumps the GitOps tag; 3 more run TFLint, Checkov, plans and terraform test.'
  - '11 Argo CD Applications. The API ships as an Argo Rollouts canary (20%, 60%, 100%) gated by a Prometheus error-rate analysis.'
  - '5 Prometheus alert rules (2 of them SLO burn-rate), 3 Kyverno admission policies, 6 NetworkPolicies, 3 runbooks and 4 architecture decision records.'
  - 'Measured on EKS (docs/RESULTS.md): a bad release with 50% injected errors was aborted automatically in 245 to 328 s while the stable pods kept serving.'
highlights:
  - '5 Terraform modules, 39 AWS resource blocks'
  - '11 Argo CD apps, canary gated by Prometheus'
  - 'Trivy, SBOM and Cosign signing in CI'
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
