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
# Vérifié dans le dépôt du projet ; preuves dans refs/FACTS.md.
glance:
  - '9 modules Spring Boot dans un seul build Maven : une Spring Cloud Gateway, la découverte de services Eureka et 7 services métier.'
  - 'Authentification JWT dans la gateway et les services, plus la connexion OAuth2 avec Google et Facebook.'
  - 'Mises à jour en temps réel via WebSocket (STOMP) dans 4 services, et appels OpenFeign entre services.'
  - 'Front-end Angular 18, un service Flask avec une forêt aléatoire scikit-learn, un serveur de transcription Whisper et un bot Jami en Node.js pour les signalements vocaux.'
highlights:
  - '9 modules Spring Boot derrière une gateway'
  - 'JWT et OAuth2, WebSocket, OpenFeign'
  - 'Front-end Angular 18'
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
