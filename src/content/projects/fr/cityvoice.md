---
# needs review by Islem (French translation of ../cityvoice.md)
title: CityVoice
summary: 'Plateforme de participation citoyenne hébergée sur un IaaS OpenStack complet, avec un cluster Kubernetes automatisé par Ansible et une CI/CD Jenkins, exposée via Cloudflare Tunnel.'
kind: 'Plateforme de participation citoyenne'
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
---

## Infrastructure

IaaS complet sur OpenStack ; cluster Kubernetes automatisé avec Ansible (7 rôles).

## Delivery

CI/CD Jenkins avec webhooks GitHub ; exposition publique via Cloudflare Tunnel sur un domaine personnalisé.

## Application

- Authentification JWT + OAuth2
- Filtrage des noms par IA (Groq)
- Modération des photos
- Notifications en temps réel (WebSocket)
