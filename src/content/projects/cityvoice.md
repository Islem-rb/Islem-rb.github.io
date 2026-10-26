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
repo: https://github.com/Islem-rb/cityvoice
order: 3
year: '2026'
inProgress: false
featured: false
# Verified against the project repository; every item has its proof in refs/FACTS.md.
glance:
  - '9 Spring Boot modules in one Maven build: a Spring Cloud Gateway, Eureka service discovery and 7 domain services.'
  - 'JWT authentication in the gateway and services, plus OAuth2 sign-in with Google and Facebook.'
  - 'Real-time updates over WebSocket (STOMP) in 4 services, and OpenFeign calls between services.'
  - 'Angular 18 front end, a Flask service with a scikit-learn random forest, a Whisper speech-to-text server and a Node.js Jami bot for voice reports.'
highlights:
  - '9 Spring Boot modules behind a gateway'
  - 'JWT and OAuth2, WebSocket, OpenFeign'
  - 'Angular 18 front end'
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
