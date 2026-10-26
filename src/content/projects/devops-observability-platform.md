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
# TODO: exact repository URL (cv.md only gives https://github.com/Islem-rb)
repo: null
order: 2
featured: false
---

## Platform

3 microservices on a kind cluster, deployed with Helm, monitored with Prometheus and Grafana, logs centralised with Loki/Promtail.

## Pipeline

Jenkins CI/CD pipeline with DevSecOps scans (Gitleaks, Trivy) and automated GitOps deployment via Argo CD.

## Infrastructure

AWS infrastructure provisioned with Terraform.
