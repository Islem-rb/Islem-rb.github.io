---
# needs review by Islem (French translation of ../carnova.md)
title: Carnova
summary: 'Marketplace automobile développée pendant un stage chez Al Idhafa Group, avec une API REST, Stripe Checkout et des fonctionnalités IA tournant sur Ollama.'
kind: 'Marketplace automobile, projet de stage'
stack:
  - Spring Boot
  - Angular
  - PostgreSQL
  - Docker
  - Stripe
  - Ollama
repo: https://github.com/Islem-rb/carnova
order: 4
# D'après cv.fr.md : stage Full-Stack, Al Idhafa Group, juillet 2025 à août 2025.
year: '2025'
inProgress: false
featured: false
# Vérifié dans le dépôt du projet ; preuves dans refs/FACTS.md.
glance:
  - 'API REST Spring Boot 3.3 sur Java 17 : 10 contrôleurs, 24 endpoints, PostgreSQL via JPA.'
  - 'Authentification JWT avec 3 rôles (admin, professionnel, utilisateur).'
  - 'Paiements avec les PaymentIntents Stripe.'
  - 'Assistant IA sur un modèle Ollama local (gemma3:1b configuré, OpenAI en fournisseur alternatif) et suppression d''arrière-plan avec Rembg.'
  - 'Front-end Angular 16 avec des modèles 3D de voitures rendus par three.js.'
highlights:
  - '10 contrôleurs, 24 endpoints REST'
  - 'JWT avec 3 rôles, paiements Stripe'
  - 'Assistant Ollama (gemma3:1b) et Rembg'
---

## Backend

API REST, JWT + contrôle d'accès par rôles, Stripe Checkout, espace vendeur « Showroom ».

## Fonctionnalités IA

- Suppression d'arrière-plan (Rembg)
- Assistant LLM (Gemma via Ollama)
