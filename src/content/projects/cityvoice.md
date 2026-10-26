---
title: CityVoice
summary: Civic engagement platform running on a full OpenStack IaaS, with a Kubernetes cluster automated by Ansible and Jenkins CI/CD exposed through Cloudflare Tunnel.
kind: Civic engagement platform
stack:
  - OpenStack (Nova, Neutron, Heat, Octavia, Zabbix)
  - Kubernetes
  - Ansible
  - Jenkins
  - Spring Boot
  - Angular
  - Cloudflare Tunnel
# TODO: exact repository URL (cv.md only gives https://github.com/Islem-rb)
repo: null
order: 3
year: '2026'
inProgress: false
featured: false
---

## Infrastructure

Full IaaS on OpenStack; Kubernetes cluster automated with Ansible (7 roles).

## Delivery

Jenkins CI/CD with GitHub webhooks; public exposure through Cloudflare Tunnel on a custom domain.

## Application

- JWT + OAuth2 authentication
- AI-based name filtering (Groq)
- Photo moderation
- Real-time notifications (WebSocket)
