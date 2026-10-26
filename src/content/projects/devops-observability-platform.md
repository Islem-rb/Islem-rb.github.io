---
title: DevOps Observability Platform
summary: Three microservices on a kind cluster, deployed with Helm, monitored with Prometheus and Grafana, with a Jenkins DevSecOps pipeline and GitOps delivery via Argo CD.
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
# Verified against the project repository; every item has its proof in refs/FACTS.md.
glance:
  - '3 Spring Boot 3.5 microservices on Java 21 (users, products, orders), each exposing Prometheus metrics through Actuator and Micrometer.'
  - '8-stage Jenkins pipeline: checkout, Maven build and tests, Gitleaks (fails the build on a leak), Docker build, Trivy report on HIGH and CRITICAL, push, load into kind, GitOps tag update.'
  - 'GitOps from a separate repository (devops-platform-gitops): one Argo CD Application with automated sync, prune and self-heal.'
  - 'Monitoring and logs installed with Helm (kube-prometheus-stack, Loki stack with Promtail), configured by 4 values files.'
highlights:
  - '3 Spring Boot services with Prometheus metrics'
  - '8-stage Jenkins pipeline with Gitleaks and Trivy'
  - 'Argo CD auto-sync from a GitOps repository'
---

## Platform

3 microservices on a kind cluster, deployed with Helm, monitored with Prometheus and Grafana, logs centralised with Loki/Promtail.

## Pipeline

Jenkins CI/CD pipeline with DevSecOps scans (Gitleaks, Trivy) and automated GitOps deployment via Argo CD.

## Infrastructure

AWS infrastructure provisioned with Terraform.
