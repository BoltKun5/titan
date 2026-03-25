# Titan — Fichier de contexte projet

## Stack technique

- **Monorepo** pnpm workspace
- **API** (`apps/api-titan`) : Express + Socket.IO + Sequelize-TypeScript + PostgreSQL
- **Front** (`apps/front`) : React 18 + Vite + MUI 5 + SCSS + Capacitor (mobile)
- **Package partagé** (`packages/titan_core`) : types, enums, interfaces

## Objectifs

### Titan — Gestion de club de sport

Outil **web** de gestion de club sportif, en priorité pour les **clubs de handball**.

- Gestion des membres, équipes, matchs, saisons
- **Scrapping des données joueurs** depuis le site officiel de la fédération
- Statistiques individuelles et collectives
- Tableau de bord pour les dirigeants et entraîneurs

### Mimas — Messagerie instantanée

Application de **messagerie instantanée** disponible en **web et mobile** (via Capacitor), inspirée de WhatsApp.

- Lien avec les données Titan : accès aux stats, matchs et infos club depuis les conversations
- Routes API sous le préfixe `/mimas/`
- Socket.IO pour le temps réel

---

## Mimas — Fonctionnalités WhatsApp (todo list)

### Conversations

- [x] Conversations privées (1-to-1)
- [x] Conversations de groupe
- [x] Nom et photo de groupe personnalisables
- [x] Description de groupe
- [x] Ajouter / retirer des participants d'un groupe
- [x] Rôles dans les groupes (admin, membre)
- [x] Quitter un groupe
- [x] Archiver une conversation
- [x] Épingler une conversation en haut de la liste
- [x] Supprimer une conversation
- [x] Muet (couper les notifications d'une conversation)

### Messages

- [x] Messages texte
- [ ] Envoi de photos / images
- [ ] Envoi de vidéos
- [ ] Envoi de fichiers / documents
- [ ] Messages vocaux (enregistrement audio)
- [x] Emojis et réactions aux messages
- [x] Répondre à un message spécifique (quote / reply)
- [x] Transférer un message
- [x] Supprimer un message (pour moi / pour tous)
- [x] Modifier un message envoyé
- [ ] Messages éphémères (disparition automatique)

### Statuts et indicateurs

- [x] Indicateur "en train d'écrire…"
- [x] Accusés de réception (envoyé ✓, reçu ✓✓, lu ✓✓ bleu)
- [x] "En ligne" / "Vu à …" (statut de présence)
- [x] Compteur de messages non lus par conversation
- [ ] Badge global de messages non lus

### Recherche

- [x] Recherche de conversations
- [x] Recherche de messages dans une conversation
- [x] Recherche globale dans toutes les conversations

### Notifications

- [ ] Notifications push (mobile via Capacitor)
- [ ] Notifications navigateur (web)
- [ ] Paramètres de notification par conversation
- [ ] Son de notification personnalisable

### Profil utilisateur

- [ ] Photo de profil
- [x] Nom affiché (shownName)
- [ ] Statut / bio personnalisé
- [ ] Paramètres de confidentialité (qui voit ma photo, mon statut, etc.)

### Médias et stockage

- [ ] Galerie des médias partagés dans une conversation
- [ ] Prévisualisation des liens (link preview / Open Graph)
- [ ] Téléchargement des fichiers reçus

### Appels (futur)

- [ ] Appels vocaux 1-to-1
- [ ] Appels vidéo 1-to-1
- [ ] Appels de groupe (audio / vidéo)

### Intégration Titan (spécifique Mimas)

- [ ] Partager une fiche joueur dans une conversation
- [ ] Partager des stats de match
- [ ] Notifications automatiques liées au club (rappels de match, résultats)
- [ ] Conversations auto-créées par équipe / club
