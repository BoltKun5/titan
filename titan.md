# Titan — Fonctionnalités de gestion de club sportif

> **Philosophie multi-sport** : Titan est conçu comme un gestionnaire de club **générique**, indépendant du sport. Le handball est le premier sport cible (MVP), mais l'architecture doit être cloisonnée pour permettre l'ajout d'autres sports (football, basketball, rugby, volley, etc.) sans refactoring majeur.
>
> Tout ce qui est **spécifique au handball** est clairement identifié ci-dessous avec le tag 🏐. Le reste constitue le **noyau commun** réutilisable pour n'importe quel sport.

---

## 1. Gestion du club

### Structure du club

- [x] Fiche d'identité du club (nom, logo, couleurs, adresse, contact, numéro d'affiliation fédéral)
- [x] Configuration du sport du club (handball, football, basket, etc.) — détermine le module sport chargé
- [x] Gestion multi-sections (masculin, féminin, loisir, école de hand / école du sport)
- [x] Organigramme du bureau / staff (président, trésorier, secrétaire, etc.)
- [x] Gestion des salles / gymnases (nom, adresse, capacité, créneaux)
- [x] Gestion des saisons sportives (création, archivage, bascule de saison)

### Membres

- [ ] Inscription / réinscription des membres (formulaire en ligne)
- [x] Fiche membre complète (état civil, coordonnées, photo, numéro de licence fédéral)
- [x] Gestion des statuts (joueur, entraîneur, dirigeant, arbitre, bénévole, supporter)
- [x] Suivi des licences (numéro, type, date d'expiration, statut de renouvellement)
- [ ] Import / export de la liste des membres (CSV, Excel)
- [x] Gestion des parents / contacts d'urgence (catégories jeunes)
- [ ] Historique d'un membre au sein du club (saisons, équipes, postes)
- [x] Certificats médicaux : suivi de validité et alertes d'expiration
- [ ] Consentements RGPD et droit à l'image

---

## 2. Gestion des équipes

### Composition

- [x] Création et gestion des équipes par saison
- [x] Attribution des joueurs aux équipes
- [x] Affectation des entraîneurs et adjoints
- [x] Gestion des postes de jeu — configurable par sport :
  - 🏐 Handball : pivot, ailier gauche/droit, arrière gauche/droit, demi-centre, gardien
  - _(Autres sports : à définir dans le module sport correspondant)_
- [x] Fiche d'équipe (catégorie, division, poule, numéro d'engagement fédéral)

### Effectifs

- [ ] Vue synoptique de l'effectif (nombre, postes couverts, manques)
- [ ] Gestion des surclassements / sous-classements
- [ ] Historique des compositions d'équipe par saison
- [ ] Suivi des mutations (arrivées / départs)

---

## 3. Gestion des matchs

### Calendrier

- [x] Calendrier des matchs par équipe et global
- [ ] 🏐 Import automatique du calendrier depuis la FFHB (scrapping — _intégration ultérieure, voir section 5_)
- [x] Création manuelle de matchs (amicaux, tournois)
- [x] Gestion des reports et modifications de date
- [ ] Vue agenda (jour, semaine, mois) avec filtres par équipe

### Feuille de match

- [x] Composition d'avant-match (titulaires, remplaçants)
- [x] Saisie du score en temps réel ou a posteriori
- [x] Saisie des événements de match — configurable par sport :
  - 🏐 Handball : buts, arrêts, 2 minutes, cartons, temps morts
  - _(Autres sports : types d'événements définis dans le module sport)_
- [x] Attribution des points/buts aux joueurs — types configurables :
  - 🏐 Handball : 6m, 9m, aile, contre-attaque, 7m
- [x] Saisie des arrêts du gardien (si applicable au sport — 🏐 avec zone de tir)
- [x] Gestion des sanctions — configurables par sport :
  - 🏐 Handball : avertissement, exclusion 2 min, disqualification, rapport
- [x] Temps de jeu par joueur
- [x] Notes / commentaires d'après-match

### Résultats

- [ ] 🏐 Import automatique des résultats depuis la FFHB (scrapping — _intégration ultérieure, voir section 5_)
- [ ] Classement de la poule (récupération automatique ou calcul local)
- [x] Historique des résultats par équipe et par saison
- [ ] Bilan victoires / nuls / défaites

---

## 4. Statistiques

### Statistiques individuelles (joueur)

- [ ] Points / buts marqués (total, par match, par type)
  - 🏐 Handball : par type de tir (6m, 9m, aile, contre-attaque, 7m)
- [ ] Pourcentage de réussite au tir (global, par zone, par type)
- [ ] Arrêts (gardiens, si applicable au sport) : total, pourcentage, par zone
- [ ] Passes décisives
- [ ] Sanctions reçues — selon le sport :
  - 🏐 Handball : 2 min, cartons
- [ ] Temps de jeu total et moyen
- [ ] Évolution des performances sur la saison (graphiques)
- [ ] Comparaison entre joueurs
- [ ] Fiche stats complète par joueur (résumé de saison)

### Statistiques d'équipe

- [ ] Buts marqués / encaissés par match et cumulés
- [ ] Différence de buts
- [ ] Pourcentage de victoires / nuls / défaites
- [ ] Tendance domicile / extérieur
- [ ] Statistiques par période (mi-temps, quart-temps, etc. — configurable par sport)
  - 🏐 Handball : 1ère MT vs 2ème MT
- [ ] Meilleurs buteurs / passeurs / gardiens (classement interne)
- [ ] Répartition des buts/points par poste
- [ ] Séries en cours (victoires / défaites consécutives)

### Statistiques de club

- [ ] Vue globale multi-équipes
- [ ] Palmarès du club par saison
- [ ] Records du club (meilleur buteur historique, plus large victoire, etc.)

---

## 5. 🏐 Scrapping fédéral (FFHB) — _Intégration ultérieure_

> **Note** : Cette section sera implémentée dans une phase ultérieure du projet. L'architecture de scrapping sera conçue comme un **module enfichable par fédération**, afin de pouvoir ajouter des connecteurs pour d'autres fédérations sportives (FFF, FFBB, FFR, etc.) par la suite.

### Sources de données

- [ ] Connexion au site de la FFHB (media-ffhandball.fr / résultats FFHB)
- [ ] Scrapping des calendriers de compétition par poule
- [ ] Scrapping des résultats de matchs (score, buteurs si disponible)
- [ ] Scrapping des classements de poule
- [ ] Scrapping des fiches de joueurs licenciés (si accessible)
- [ ] Scrapping des feuilles de match officielles (composition, événements)

### Mécanisme (architecture commune à tous les connecteurs fédéraux)

- [ ] Interface `FederationScrapper` générique (à implémenter par fédération)
- [ ] Configuration par équipe : lien vers la poule / compétition fédérale
- [ ] Synchronisation manuelle (bouton "importer depuis la fédération")
- [ ] Synchronisation automatique programmée (cron : quotidien ou hebdomadaire)
- [ ] Détection des nouveaux résultats et mise à jour incrémentale
- [ ] Log et historique des synchronisations (succès, erreurs, données importées)
- [ ] Gestion des erreurs de scrapping (page indisponible, changement de structure HTML)
- [ ] Mapping automatique des joueurs fédéraux vers les membres du club (par numéro de licence)
- [ ] Interface de résolution manuelle en cas de mapping ambigu

### 🏐 Données récupérées (connecteur FFHB)

- [ ] Score final et mi-temps
- [ ] Buteurs et nombre de buts par joueur
- [ ] Arrêts des gardiens
- [ ] Sanctions (2 min, disqualifications)
- [ ] Classement de la poule (points, matchs joués, différence de buts)
- [ ] Historique complet de la compétition

---

## 6. Entraînements

### Planification

- [x] Calendrier des entraînements par équipe
- [x] Récurrence (ex : mardi et jeudi 19h-21h)
- [x] Gestion des créneaux par gymnase / salle
- [x] Gestion des annulations et changements de créneau

### Suivi de présence

- [x] Pointage de présence (par l'entraîneur ou auto-pointage joueur)
- [ ] Taux de présence individuel et par équipe
- [ ] Historique des présences sur la saison
- [ ] Alertes en cas de nombreuses absences consécutives

### Contenu d'entraînement

- [ ] Bibliothèque d'exercices (titre, description, schéma, objectif, durée)
- [ ] Création de séances (liste ordonnée d'exercices)
- [ ] Tags et filtres (thème : défense, attaque, physique, gardien, etc.)
- [ ] Partage de séances entre entraîneurs

---

## 7. Finances et cotisations

### Cotisations

- [x] Définition des tarifs par catégorie et par saison
- [x] Suivi des paiements par membre (payé, en cours, impayé)
- [x] Gestion des modalités de paiement (1x, 2x, 3x, chèques vacances)
- [ ] Relances automatiques par email pour les impayés
- [ ] Export des états de paiement

### Budget du club

- [x] Saisie des recettes et dépenses
- [x] Catégorisation (cotisations, subventions, sponsors, buvette, déplacements, équipements)
- [x] Suivi du budget prévisionnel vs réel
- [ ] Bilan financier par saison

---

## 8. Communication

### Notifications et alertes

- [ ] Rappels de matchs (J-2, J-1, jour J)
- [ ] Rappels d'entraînements
- [ ] Notification de résultats de matchs
- [ ] Alerte de documents manquants (certificat médical, licence)
- [ ] Annonces du club (événements, assemblée générale, etc.)

### Intégration Mimas (messagerie)

- [ ] Conversations auto-créées par équipe
- [ ] Partage de fiches joueur dans les conversations
- [ ] Partage de résultats / stats de match dans les conversations
- [ ] Notifications club envoyées via Mimas

---

## 9. Tableau de bord

### Dashboard dirigeant

- [ ] Vue d'ensemble : nombre de membres, licences à jour, cotisations recouvrées
- [ ] Prochains matchs toutes équipes
- [ ] Résultats récents
- [ ] Alertes (documents manquants, impayés, absences répétées)
- [ ] Indicateurs clés (taux de réinscription, nombre de licenciés vs année précédente)

### Dashboard entraîneur

- [ ] Mon équipe : effectif, prochains matchs et entraînements
- [ ] Stats rapides de l'équipe (derniers résultats, meilleur buteur)
- [ ] Taux de présence à l'entraînement
- [ ] Joueurs blessés / indisponibles

### Dashboard joueur

- [ ] Mes prochains matchs et entraînements
- [ ] Mes statistiques personnelles
- [ ] Mon historique au club
- [ ] Documents à fournir (certificat médical, cotisation)

---

## 10. Administration et paramètres

### Gestion des accès

- [ ] Rôles et permissions (admin, dirigeant, entraîneur, joueur, parent)
- [ ] Invitation de nouveaux membres par email ou lien
- [ ] Gestion des comptes utilisateurs (activation, désactivation)

### Configuration

- [ ] Paramètres généraux du club
- [x] Sélection du sport du club (charge le module sport correspondant)
- [ ] Personnalisation des catégories d'âge
- [x] Personnalisation des postes de jeu (pré-remplis par le module sport, modifiables)
- [x] Configuration des types d'événements de match (pré-remplis par le module sport)
- [x] Configuration des types de sanctions (pré-remplis par le module sport)
- [ ] Paramétrage des saisons et compétitions

### Modules sport

- [x] Architecture de plugin sport : interface commune `SportModule`
- [x] Chaque module définit : postes, événements de match, sanctions, périodes de jeu, règles de classement
- [x] 🏐 Module Handball (MVP) : postes, types de tir, sanctions (2min, carton), mi-temps, connecteur FFHB
- [ ] _(Futurs modules : Football, Basketball, Rugby, Volley, etc.)_

### Données

- [ ] Export global des données (backup)
- [ ] Import de données (migration depuis un autre outil)
- [ ] Purge et archivage des anciennes saisons
