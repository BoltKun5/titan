# Scrapping FFHB & modèle fédéral multi-sport — Design

**Statut :** Validé par l'utilisateur (brainstorming)
**Date :** 2026-05-17
**Auteur :** BoltKun + Claude
**Cible d'implémentation :** plan séparé via le skill `writing-plans`

---

## 1. Contexte et objectifs

### 1.1 Problème

Titan doit récupérer (scrapper) depuis le site officiel de la FFHB les données fédérales : clubs, équipes, joueurs, compétitions, poules, matchs, événements de match, classements. Aujourd'hui, la BDD est conçue pour « le club du user » et ne peut pas modéliser l'écosystème fédéral :

- `titan_player.clubId` est obligatoire — un joueur ne peut pas exister sans appartenir à un club Titan.
- `titan_match.opponent` est un simple `string` — pas d'adversaire structuré.
- `titan_match.teamId` est obligatoire — un match doit forcément avoir une équipe interne.
- Aucune table `Competition`, `Pool`, `Phase`, `Matchday`, `Standing`.

Pour un produit SaaS multi-tenant offert à n'importe quel club de la fédération, la BDD doit représenter l'**écosystème fédéral entier** comme source de vérité, sur lequel viennent se greffer les données propres à chaque club inscrit.

### 1.2 Objectifs

1. Modéliser un **référentiel fédéral** (clubs, équipes, joueurs, compétitions, matchs, etc.) alimenté par scraping.
2. Garder l'architecture **extensible à d'autres sports** (foot, basket, rugby...) sans refactor majeur.
3. Permettre aux clubs inscrits sur Titan de **rattacher** leur identité fédérale et d'y greffer leurs données app (cotisations, entraînements, présences, etc.).
4. Concevoir un **pipeline de scraping pluggable par fédération** (un connecteur par fédé, contrat commun).
5. Produire la **documentation** nécessaire pour le futur travail front et les développements ultérieurs.

### 1.3 Hors-périmètre de ce spec

- Implémentation du connecteur FFHB (HTML parsing concret) — couverte par le futur plan d'implémentation.
- UI front pour exploitation des données fédérales — sera spécifiée séparément.
- Connecteurs autres fédérations (FFF, FFBB…) — l'architecture les permet, mais ne sont pas développés ici.
- Authentification / RBAC complets — couvert par d'autres specs.

### 1.4 Contraintes connues

- L'app **n'est pas en production** : pas de migration de données existantes. On drop & recreate la DB pour adopter le nouveau schéma.
- Stack imposée : Sequelize-TypeScript + PostgreSQL.
- Le package `titan_core` (`packages/titan_core`) doit héberger les enums et interfaces partagés api/front.

---

## 2. Architecture en 3 couches

```
┌─────────────────────────────────────────────────────────────┐
│  COUCHE 3 — APP (titan_*)                                    │
│                                                              │
│  Données SaaS spécifiques aux clubs inscrits sur Titan :    │
│   • titan_club_account     (inscription d'un club)          │
│   • titan_team_settings    (coach app, notes internes)      │
│   • titan_player_profile   (photo perso, contacts, notes)   │
│   • titan_friendly_match   (matchs amicaux hors fédé)       │
│   • titan_training, titan_training_attendance               │
│   • titan_fee_plan, titan_payment, titan_budget_entry       │
│   • titan_medical_certificate, titan_license                │
│   • titan_club_member, titan_club_invitation                │
│   • titan_user (comptes/auth)                               │
└─────────────────────────────────────────────────────────────┘
                            ▲ référence (FK)
┌─────────────────────────────────────────────────────────────┐
│  COUCHE 2 — EXTENSIONS SPORT (federation_*_<sport>)          │
│                                                              │
│  Champs spécifiques à un sport, en 1–1 avec le core :       │
│   • federation_player_handball                              │
│   • federation_match_handball                               │
│   • federation_player_match_stats_handball                  │
│   • federation_player_season_stats_handball                 │
└─────────────────────────────────────────────────────────────┘
                            ▲ 1–1 (FK PK)
┌─────────────────────────────────────────────────────────────┐
│  COUCHE 1 — RÉFÉRENTIEL FÉDÉRAL CORE (federation_*)          │
│                                                              │
│  Alimenté UNIQUEMENT par le scrapper. Read-only depuis app. │
│   • federation                                              │
│   • federation_season, federation_venue, federation_staff   │
│   • federation_club, federation_team, federation_player     │
│   • federation_team_member (pivot, historisé)               │
│   • federation_competition, federation_phase                │
│   • federation_pool, federation_pool_team                   │
│   • federation_matchday, federation_match                   │
│   • federation_match_lineup, federation_match_event         │
│   • federation_player_match_stats                           │
│   • federation_player_season_stats                          │
│   • federation_pool_standing                                │
│   • federation_scrape_run (audit)                           │
└─────────────────────────────────────────────────────────────┘
```

**Règle d'or invariante :**
> Les couches 1 et 2 ne sont **jamais modifiées** par les actions utilisateur. Seul le scrapper y écrit. L'app **lit** depuis ces couches et **écrit uniquement** sur la couche 3.

### 2.1 Pourquoi ce découpage

- **Découplage net** entre source de vérité externe (fédé) et données métier internes (app).
- **Idempotence** du re-scraping : on écrase la couche 1 sans risque pour la couche 3.
- **SaaS multi-tenant cohérent** : un club non encore inscrit existe dans la BDD dès que la fédé le référence. Quand il s'inscrit, ses données sont déjà là.
- **Multi-sport encapsulé** dans la couche 2 : ajouter un sport ne touche pas le core ni les autres sports.
- **Couche 3 agnostique au sport** : elle référence des entités core par UUID, point.

### 2.2 Rattachement Titan ↔ Fédéral

Un compte club Titan (`titan_club_account`) pointe vers `federation_club.id` (relation 1–1 unique).

**Workflow d'onboarding :**
1. Le scrapper a déjà découvert le club → `federation_club` existe.
2. L'utilisateur s'inscrit, recherche son club par nom/code fédéral.
3. Il « réclame » le `federation_club` correspondant → création d'un `titan_club_account`.
4. Vérification d'identité (TBD — hors périmètre de ce spec).
5. Les administrateurs supplémentaires sont invités via `titan_club_invitation`.

**Cas marginal :** si un club n'existe pas dans le référentiel (nouveau club non encore référencé FFHB, club étranger pour un amical), on autorise la création manuelle d'un `federation_club` avec `isManual: true`. Reste exceptionnel.

---

## 3. Couche 1 — Référentiel fédéral core

### 3.1 Champs de provenance

Deux familles de tables côté `federation_*` :

**(a) Entités directement scrapées** (identifiables par la fédération) :
`federation_season`, `federation_venue`, `federation_club`, `federation_team`, `federation_player`, `federation_staff`, `federation_competition`, `federation_phase`, `federation_pool`, `federation_matchday`, `federation_match`.

Champs de provenance complets :

| Champ | Type | Rôle |
|---|---|---|
| `externalId` | VARCHAR | ID chez la fédération (numéro licence, code club FFHB…) |
| `federationId` | UUID FK | Vers `federation` (FFHB, FFF, …) |
| `lastScrapedAt` | TIMESTAMP | Dernière mise à jour par le scrapper |
| `lastScrapeRunId` | UUID FK | Vers `federation_scrape_run` (audit) |
| `sourceUrl` | VARCHAR NULLABLE | URL d'origine du scrap |
| `isManual` | BOOLEAN | TRUE si créé hors scrap (exceptionnel) |

**Contrainte d'unicité :** `UNIQUE(federationId, externalId)`. C'est la clé naturelle qui rend le scraping idempotent (upsert).

**(b) Tables pivot/dépendantes** (pas d'identifiant propre côté fédération) :
`federation_team_member`, `federation_pool_team`, `federation_match_lineup`, `federation_match_event`, `federation_player_match_stats`, `federation_player_season_stats`, `federation_pool_standing`.

Champs de provenance réduits : `lastScrapedAt`, `lastScrapeRunId` uniquement. L'unicité est portée par la **composition des FK** vers leurs parents (cf. définitions de chaque table en 3.3).

### 3.2 Hiérarchie globale

```
federation
  ├── federation_season       (saison : 2024-2025, dates, sport)
  ├── federation_venue        (gymnases : nom, adresse, capacité, gps)
  ├── federation_club ────┬── federation_staff       (dirigeants, entraîneurs scrapés)
  │                       └── federation_team ─── federation_team_member (pivot historisé)
  ├── federation_player
  └── federation_competition
         └── federation_phase
                └── federation_pool ────┬── federation_pool_team (pivot)
                                        ├── federation_pool_standing (classement snapshot)
                                        └── federation_matchday
                                                 └── federation_match ─┬── federation_match_lineup
                                                                       ├── federation_match_event
                                                                       └── federation_player_match_stats
```

### 3.3 Détail des tables core

#### `federation`
```
id              UUID PK
code            VARCHAR UNIQUE  -- 'FFHB','FFF','FFBB'
name            VARCHAR
sport           ENUM SportType
country         VARCHAR
baseUrl         VARCHAR
```

#### `federation_season`
```
id              UUID PK
externalId      VARCHAR
federationId    UUID FK
sport           ENUM SportType
label           VARCHAR         -- '2024-2025'
startDate       DATE
endDate         DATE
isCurrent       BOOLEAN
+ provenance fields
UNIQUE(federationId, externalId)
```

#### `federation_venue`
```
id              UUID PK
externalId      VARCHAR NULLABLE  -- la fédé n'a pas toujours d'ID stable pour les salles
federationId    UUID FK
name            VARCHAR
address         VARCHAR
city            VARCHAR
postalCode      VARCHAR
capacity        INTEGER NULLABLE
latitude        DECIMAL NULLABLE
longitude       DECIMAL NULLABLE
+ provenance fields
```

#### `federation_club`
```
id              UUID PK
externalId      VARCHAR
federationId    UUID FK
name            VARCHAR
shortName       VARCHAR NULLABLE
city            VARCHAR NULLABLE
logoUrl         VARCHAR NULLABLE
colors          JSONB NULLABLE  -- ['#003366','#ffffff']
website         VARCHAR NULLABLE
phone           VARCHAR NULLABLE
email           VARCHAR NULLABLE
foundingYear    INTEGER NULLABLE
+ provenance fields
UNIQUE(federationId, externalId)
```

#### `federation_staff`
```
id              UUID PK
externalId      VARCHAR
federationId    UUID FK
clubId          UUID FK -> federation_club
firstName       VARCHAR
lastName        VARCHAR
role            VARCHAR         -- 'president','coach','assistant_coach','manager'...
sectionScope    VARCHAR NULLABLE -- 'masculin','feminin','jeunes'
+ provenance fields
```

#### `federation_team`
```
id              UUID PK
externalId      VARCHAR
federationId    UUID FK
clubId          UUID FK -> federation_club
seasonId        UUID FK -> federation_season
name            VARCHAR         -- 'Seniors Masculins 1', '-18 F'
category        VARCHAR         -- '-15M','-18M','Seniors','+35'…
genderSection   ENUM            -- masculin/feminin/mixte
level           VARCHAR NULLABLE -- 'N1','R1','Départementale 2'…
+ provenance fields
UNIQUE(federationId, externalId)
```

#### `federation_player`
```
id              UUID PK
externalId      VARCHAR         -- numéro de licence en général
federationId    UUID FK
licenseNumber   VARCHAR NULLABLE
firstName       VARCHAR
lastName        VARCHAR
birthDate       DATE NULLABLE
gender          ENUM            -- M/F/X
nationality     VARCHAR NULLABLE
photoUrl        VARCHAR NULLABLE
height          INTEGER NULLABLE -- cm
weight          INTEGER NULLABLE -- kg
+ provenance fields
UNIQUE(federationId, externalId)
```

#### `federation_team_member` (pivot historisé)
```
id              UUID PK
teamId          UUID FK -> federation_team
playerId        UUID FK -> federation_player
jerseyNumber    INTEGER NULLABLE
position        VARCHAR NULLABLE  -- string libre ; validation par SportModule
dateFrom        DATE
dateTo          DATE NULLABLE
isCaptain       BOOLEAN
+ provenance fields réduits (lastScrapedAt, lastScrapeRunId)
INDEX(teamId), INDEX(playerId)
UNIQUE(teamId, playerId, dateFrom)
```

Permet l'historique des mutations en cours de saison.

#### `federation_competition`
```
id              UUID PK
externalId      VARCHAR
federationId    UUID FK
seasonId        UUID FK
sport           ENUM SportType
name            VARCHAR         -- 'Championnat de France N2 Masculin'
level           VARCHAR         -- 'N2','Coupe de France','Régional'
type            ENUM            -- 'championship','cup','tournament','play_off'
gender          ENUM            -- masculin/feminin/mixte
category        VARCHAR         -- 'Seniors','-18'…
+ provenance fields
UNIQUE(federationId, externalId)
```

#### `federation_phase`
```
id              UUID PK
externalId      VARCHAR NULLABLE
competitionId   UUID FK
name            VARCHAR         -- 'Phase aller','Phase finale','Play-offs'
order           INTEGER         -- 1, 2, 3…
startDate       DATE NULLABLE
endDate         DATE NULLABLE
+ provenance fields
```

#### `federation_pool`
```
id              UUID PK
externalId      VARCHAR
phaseId         UUID FK
name            VARCHAR         -- 'Poule A'
category        VARCHAR NULLABLE
+ provenance fields
UNIQUE(federationId, externalId)
```

#### `federation_pool_team` (pivot)
```
id              UUID PK
poolId          UUID FK
teamId          UUID FK -> federation_team
withdrawn       BOOLEAN DEFAULT false  -- équipe forfait général
+ provenance fields
UNIQUE(poolId, teamId)
```

#### `federation_pool_standing` (snapshot de classement)
```
id              UUID PK
poolId          UUID FK
teamId          UUID FK
rank            INTEGER
played          INTEGER
won             INTEGER
drawn           INTEGER
lost            INTEGER
goalsFor        INTEGER
goalsAgainst    INTEGER
goalDifference  INTEGER
points          INTEGER
penaltyPoints   INTEGER DEFAULT 0  -- pénalités de la fédé
scrapedAt       TIMESTAMP
+ provenance fields (sans lastScrapedAt redondant)
INDEX(poolId, scrapedAt)
```

Snapshoté : si la fédé applique des pénalités hors-classement, on stocke ce qu'elle affiche.

#### `federation_matchday`
```
id              UUID PK
externalId      VARCHAR NULLABLE
poolId          UUID FK
number          INTEGER          -- J1, J2…
label           VARCHAR NULLABLE -- '8e de finale','J5'
plannedDate     DATE NULLABLE
+ provenance fields
INDEX(poolId, number)
```

#### `federation_match`
```
id                UUID PK
externalId        VARCHAR
federationId      UUID FK
matchdayId        UUID FK NULLABLE  -- NULL si amical/inconnu
poolId            UUID FK NULLABLE  -- denormalisé pour requêtes
homeTeamId        UUID FK -> federation_team
awayTeamId        UUID FK -> federation_team
dateUtc           TIMESTAMP
status            ENUM             -- 'scheduled','live','finished','postponed','cancelled','forfeit'
scoreHome         INTEGER NULLABLE
scoreAway         INTEGER NULLABLE
venueId           UUID FK NULLABLE
forfeitSide       ENUM NULLABLE    -- 'home','away','double'
+ provenance fields
UNIQUE(federationId, externalId)
INDEX(matchdayId), INDEX(homeTeamId), INDEX(awayTeamId), INDEX(dateUtc)
```

#### `federation_match_lineup`
```
id              UUID PK
matchId         UUID FK
playerId        UUID FK -> federation_player
side            ENUM            -- 'home','away'
starter         BOOLEAN
jerseyNumber    INTEGER NULLABLE
position        VARCHAR NULLABLE
isCaptain       BOOLEAN DEFAULT false
+ provenance fields
UNIQUE(matchId, playerId)
INDEX(matchId, side)
```

#### `federation_match_event`
```
id              UUID PK
matchId         UUID FK
minute          INTEGER
second          INTEGER NULLABLE
side            ENUM            -- 'home','away'
type            ENUM            -- 'goal','sanction','timeout','substitution','save'…  (générique)
subtype         VARCHAR NULLABLE -- validé par SportModule ('6m','7m','9m','wing','fastbreak','2min','yellow','red'…)
playerId        UUID FK NULLABLE
relatedPlayerId UUID FK NULLABLE -- substitué/sortant, assist…
details         JSONB NULLABLE   -- détails libres (zone, durée…)
+ provenance fields
INDEX(matchId, minute)
```

**Décision :** garder une table générique avec `subtype` + `details JSONB` plutôt qu'une table d'extension par sport. Évite N tables d'events × M sports. Validation des `subtype` autorisés faite côté code par `SportModule`.

#### `federation_player_match_stats`
```
id              UUID PK
matchId         UUID FK
playerId        UUID FK
side            ENUM
minutesPlayed   INTEGER NULLABLE
goals           INTEGER DEFAULT 0     -- agrégat générique
assists         INTEGER DEFAULT 0
saves           INTEGER NULLABLE      -- si gardien
+ provenance fields
UNIQUE(matchId, playerId)
INDEX(playerId)
```

Stats agrégées sport-agnostiques. Détails par type de tir → extension sport.

#### `federation_player_season_stats`
```
id              UUID PK
seasonId        UUID FK
playerId        UUID FK
competitionId   UUID FK NULLABLE   -- agrégat par compétition (NULL = toutes confondues)
matchesPlayed   INTEGER
goals           INTEGER
assists         INTEGER
saves           INTEGER NULLABLE
+ provenance fields
UNIQUE(seasonId, playerId, competitionId)
```

#### `federation_scrape_run` (audit)
```
id                  UUID PK
federationId        UUID FK
startedAt           TIMESTAMP
finishedAt          TIMESTAMP NULLABLE
status              ENUM        -- 'running','success','partial','failed'
trigger             ENUM        -- 'cron','manual','webhook'
targetType          VARCHAR     -- 'competition','pool','match','club','player','full_sync'
targetExternalId    VARCHAR NULLABLE
rowsInserted        INTEGER
rowsUpdated         INTEGER
rowsSkipped         INTEGER
errors              JSONB
initiatedByUserId   UUID FK NULLABLE
durationMs          INTEGER NULLABLE
```

---

## 4. Couche 2 — Extensions par sport

### 4.1 Principe

Une table d'extension n'existe **que si** le sport a des champs réellement spécifiques nécessitant un typage SQL. Sinon, on reste sur le core (string `position`, string `level`, `subtype` d'event, etc.). Liaison **1–1** par FK (la PK de l'extension est aussi la FK vers le core, `ON DELETE CASCADE`).

**Convention de nommage :** `federation_<entité>_<sport>`.

### 4.2 Extensions handball

#### `federation_player_handball`
```
playerId               UUID PK FK -> federation_player.id  (1–1)
positions              TEXT[]    -- ['pivot','arriere_g','aile_d',…]
                                 -- enum PlayerPositionHandball côté titan_core
shootingHand           ENUM('left','right','ambidextrous')
preferredJerseyNumber  INTEGER NULLABLE
```

#### `federation_match_handball`
```
matchId               UUID PK FK -> federation_match.id  (1–1)
scoreHalfHome         INTEGER NULLABLE
scoreHalfAway         INTEGER NULLABLE
hasExtraTime          BOOLEAN DEFAULT false
scoreExtraHome        INTEGER NULLABLE
scoreExtraAway        INTEGER NULLABLE
hasShootout           BOOLEAN DEFAULT false
scoreShootoutHome     INTEGER NULLABLE
scoreShootoutAway     INTEGER NULLABLE
matchDurationMinutes  INTEGER     -- 60 seniors, 50 -18M, 40 -16M
```

#### `federation_player_match_stats_handball`
```
matchStatsId          UUID PK FK -> federation_player_match_stats.id

-- Tirs par type (tentés / marqués)
shotsAttempted6m         INTEGER  shotsMade6m         INTEGER
shotsAttempted7m         INTEGER  shotsMade7m         INTEGER
shotsAttempted9m         INTEGER  shotsMade9m         INTEGER
shotsAttemptedWing       INTEGER  shotsMadeWing       INTEGER
shotsAttemptedFastbreak  INTEGER  shotsMadeFastbreak  INTEGER

-- Gardien (NULL si non gardien)
savesTotal       INTEGER NULLABLE
savesByZone      JSONB   NULLABLE   -- { '6m':3, '7m':1, '9m':5, 'wing':2, 'fastbreak':1 }

-- Sanctions
twoMinutesCount  INTEGER DEFAULT 0
yellowCard       BOOLEAN DEFAULT false
redCard          BOOLEAN DEFAULT false
blueCard         BOOLEAN DEFAULT false
disqualified     BOOLEAN DEFAULT false

-- Autres
assists          INTEGER DEFAULT 0
technicalFaults  INTEGER DEFAULT 0
steals           INTEGER DEFAULT 0
```

#### `federation_player_season_stats_handball`
```
seasonStatsId    UUID PK FK -> federation_player_season_stats.id
-- Mêmes champs que match_stats_handball mais cumulés sur la saison.
```

### 4.3 Extensions volontairement absentes

| Cas | Décision | Raison |
|-----|----------|--------|
| `federation_team_handball` | ❌ | Aucun champ spécifique. `category`, `level`, `genderSection` sur core suffisent. |
| `federation_competition_handball` | ❌ | `level` (string) sur core suffit. À créer plus tard si on a besoin de règles de tie-breaking ou format spécifiques. |
| `federation_match_event_handball` (table dédiée) | ❌ | Core avec `subtype` + `details JSONB`. Validation par `SportModule` côté code. |

### 4.4 Contrat `SportModule` (code, `titan_core`)

```ts
// packages/titan_core/src/sports/sport-module.interface.ts
export interface SportModule {
  sport: SportType;

  // Liste des subtypes d'événements de match autorisés
  matchEventSubtypes: readonly string[];

  // Liste des positions de jeu valides
  playerPositions: readonly string[];

  // Quels modèles d'extension existent côté BDD
  extensions: {
    player: boolean;
    match: boolean;
    playerMatchStats: boolean;
    playerSeasonStats: boolean;
    competition: boolean;
    team: boolean;
  };

  // Périodes de jeu (mi-temps, quart-temps…)
  periods: {
    count: number;            // 2 pour hand
    durationMinutes: number;  // 30 pour hand seniors
  };
}

export const HandballModule: SportModule = {
  sport: SportType.HANDBALL,
  matchEventSubtypes: [
    '6m','7m','9m','wing','fastbreak','penalty',
    '2min','yellow','red','blue','disqualification',
    'timeout','substitution'
  ],
  playerPositions: [
    'gardien','pivot','arriere_g','arriere_c','arriere_d','aile_g','aile_d'
  ],
  extensions: {
    player: true, match: true,
    playerMatchStats: true, playerSeasonStats: true,
    competition: false, team: false,
  },
  periods: { count: 2, durationMinutes: 30 },
};
```

### 4.5 Ajouter un sport plus tard

1. Ajouter le sport dans `SportType` (enum `titan_core`).
2. Créer le `SportModule` correspondant (`FootballModule`, etc.) avec ses subtypes/positions/périodes.
3. Créer les migrations `federation_*_<sport>` **si nécessaire** — sinon, le core suffit.
4. Implémenter un `FederationScraper` pour la fédération concernée (interface commune — voir section 6).
5. **Aucune modification** des tables core ou des autres extensions sport.

---

## 5. Couche 3 — Refactor `titan_*`

### 5.1 Mapping table par table

| Table actuelle | Devient | Rôle après refactor |
|---|---|---|
| `titan_club` | ⇒ `federation_club` (identité) + **nouveau** `titan_club_account` | `titan_club_account` = inscription d'un club sur la plateforme. `federationClubId` (1–1 unique), settings, branding, plan SaaS, statut abonnement, dateInscription. |
| `titan_team` | ⇒ `federation_team` (identité) + **nouveau** `titan_team_settings` | `titan_team_settings` : `federationTeamId`, `coachUserId`, `assistantCoachUserId`, notes internes, couleur d'affichage. |
| `titan_player` | ⇒ `federation_player` (identité) + **nouveau** `titan_player_profile` | `titan_player_profile` : `federationPlayerId`, `userId` (lien compte), photo perso, contacts urgence, droit à l'image, notes internes. |
| `titan_team_player` | ⇒ `federation_team_member` | Historisé (dateFrom/dateTo). |
| `titan_match` | ⇒ `federation_match` (fédéraux) + **nouveau** `titan_friendly_match` (amicaux) | Les amicaux référencent 2 `federation_team`. |
| `titan_match_lineup` | ⇒ `federation_match_lineup` + `titan_friendly_match_lineup` | Idem séparation. |
| `titan_match_event` | ⇒ `federation_match_event` + `titan_friendly_match_event` | Idem. |
| `titan_player_match_stats` | ⇒ `federation_player_match_stats` + extension sport | |
| `titan_player_season_stats` | ⇒ `federation_player_season_stats` + extension sport | |
| `titan_team_season_stats` | ⇒ **supprimée** | Remplacée par `federation_pool_standing`. |
| `titan_season` | ⇒ `federation_season` | |
| `titan_venue` | ⇒ `federation_venue` (principal) **+** `titan_venue` (résiduel) | `titan_venue` reste pour les salles privées d'entraînement non référencées fédé. |
| `titan_sport_config` | ⇒ **supprimée** | Remplacée par `SportModule` (code dans `titan_core`). |
| `titan_license` | reste | Lié au `federation_player`. |
| `titan_medical_certificate` | reste | Idem. |
| `titan_club_member` | reste | Mapping `userId ↔ titan_club_account` + rôle dans l'app. Renommer FK pour pointer vers `titan_club_account` au lieu de `titan_club`. |
| `titan_staff_role` | reste | Rôles app (président, trésorier…), distinct du `federation_staff` scrapé. |
| `titan_training`, `titan_training_attendance` | restent | Lien via `federationTeamId`. |
| `titan_fee_plan`, `titan_payment`, `titan_budget_entry` | restent | Lien via `titan_club_account`. |
| `titan_club_invitation` | reste | Lien via `titan_club_account`. |

### 5.2 Stratégie de migration

L'application n'étant **pas en production** et aucun client n'utilisant la BDD, on adopte une approche **drop & recreate** :

1. Construction du schéma cible via migrations Sequelize (un fichier de migration par bloc cohérent : core / extensions hand / refactor app).
2. **Pas de scripts de backfill ou de transformation de données.**
3. La DB de dev est régénérée à zéro lors du déploiement du refactor.

Quand le premier client sera en prod, cette approche devra évoluer (sera reconsidérée à ce moment).

---

## 6. Pipeline de scraping

### 6.1 Architecture des modules

```
apps/api-titan/src/modules/scraping/
  ├── core/
  │   ├── federation-scraper.interface.ts   Contrat commun
  │   ├── scrape-run.service.ts             Création/clôture des scrape_run
  │   ├── entity-mapper.ts                  Upsert idempotent par (federationId, externalId)
  │   └── conflict-resolver.ts              Logging des diffs lors d'un re-scrap
  │
  ├── ffhb/
  │   ├── ffhb-scraper.service.ts           Implémentation du contrat
  │   ├── ffhb-parser.ts                    HTML → DTOs
  │   ├── ffhb-client.ts                    HTTP (axios + retry + rate-limit)
  │   ├── ffhb-urls.ts                      Endpoints connus
  │   └── ffhb-mappers/                     DTO → core + extension
  │       ├── club.mapper.ts
  │       ├── player.mapper.ts
  │       ├── competition.mapper.ts
  │       └── match.mapper.ts
  │
  ├── jobs/
  │   ├── nightly-sync.job.ts               Cron : compétitions actives
  │   ├── live-match.job.ts                 Cron : matchs J-2 à J+1
  │   └── on-demand.job.ts                  Trigger admin/webhook
  │
  └── api/
      └── scrape.controller.ts              Endpoints admin
```

### 6.2 Contrat `FederationScraper`

`Federation` ici est le **modèle Sequelize** (`federation_*` row) chargé en mémoire pour la fédération que le scrapper représente — pas un type spécifique au scrapping.

```ts
// modules/scraping/core/federation-scraper.interface.ts
export interface FederationScraper {
  federation: Federation;

  scrapeClub(externalId: string): Promise<ScrapeResult<FederationClubDTO>>;
  scrapePlayer(externalId: string): Promise<ScrapeResult<FederationPlayerDTO>>;
  scrapeCompetition(
    externalId: string,
    options?: { deep?: boolean }      // si true, récurse poules + matchs
  ): Promise<ScrapeResult<FederationCompetitionTreeDTO>>;
  scrapeMatch(externalId: string): Promise<ScrapeResult<FederationMatchDTO>>;
  scrapePoolStandings(poolExternalId: string): Promise<ScrapeResult<PoolStandingDTO[]>>;
  discoverSeason(year: number): Promise<ScrapeResult<SeasonDTO>>;
}

export interface ScrapeResult<T> {
  data: T | null;
  scrapeRunId: string;
  rowsInserted: number;
  rowsUpdated: number;
  rowsSkipped: number;
  warnings: string[];
}
```

### 6.3 Idempotence et conflits

- Chaque scrap = 1 `federation_scrape_run` ouvert puis clôturé.
- Tous les mappers utilisent **upsert** sur `(federationId, externalId)`.
- À chaque update, on **diffe** l'ancien vs le nouveau ; les diffs sur des champs critiques (score d'un match terminé qui change, par exemple) sont **loggés** dans `scrape_run.errors[]` mais l'écrasement reste autorisé : la fédé reste source de vérité.
- Le champ `lastScrapeRunId` de chaque ligne permet de retracer l'origine de chaque donnée.

### 6.4 Stratégie de fraîcheur (gérée par les jobs, pas par le schéma)

- **Compétitions actives** de la saison en cours : refresh nocturne complet (deep scrap).
- **Matchs J-2 à J+1** : refresh fréquent les jours de matchs (quart-horaire, surveillance des scores live).
- **Saisons archivées** : pas de refresh sauf trigger manuel admin.
- **Nouvelles entités** (clubs/joueurs jamais vus) : créées **lazily** lors du scraping de leurs matchs (mapper crée à la volée).
- **Cron** : `node-cron` ou scheduler équivalent, configurable côté env.

---

## 7. Documentation à produire

Engagement : tout ce qui suit est livré **avec** le code, dans le même set de commits/PR. Pas de "doc plus tard".

| Document | Emplacement | Contenu |
|---|---|---|
| Modèle de données | `docs/architecture/data-model.md` | Diagramme ER global Mermaid des 3 couches + glossaire des entités. |
| Architecture sport | `docs/architecture/sport-module.md` | Checklist concrète pour ajouter un sport (enums, module, extensions, migrations). |
| Pipeline scraping | `docs/architecture/scraping-pipeline.md` | Schéma du pipeline, contrat `FederationScraper`, comment ajouter une fédération. |
| Refactor titan_* | `docs/architecture/titan-refactor.md` | Mapping ancien → nouveau, motivations, pour postérité. |
| JSDoc | Code (`apps/api-titan/src/database/models/`) | Description + invariants sur **tous** les modèles fédéraux et app. |
| READMEs modules | `apps/api-titan/src/modules/scraping/README.md`, `apps/api-titan/src/modules/sport/README.md` | Vue d'ensemble, points d'entrée, exemples d'usage. |
| OpenAPI | Générée à partir du code | Spec des endpoints `/federation/*` et `/admin/scrape/*` consommable par les fronts. |
| Workflow onboarding | `docs/architecture/onboarding-club.md` | Diagramme de séquence : scrap découvre club → user s'inscrit → réclamation → `titan_club_account` créé. |

---

## 8. Critères de succès

1. Un connecteur `FFHBScraper` peut scrapper une compétition complète (poules, matchs, événements, classements) de manière idempotente.
2. Un re-scrap de la même compétition ne crée **aucun doublon** ; les mises à jour écrasent proprement.
3. Une compétition d'un sport hypothétique différent (test fictif "BasketModule") pourrait être ajoutée en moins d'une journée de dev sans toucher au code handball.
4. Un club inscrit sur Titan voit ses données fédérales scrapées dès son onboarding (lien `federation_club` ↔ `titan_club_account` opérationnel).
5. Toutes les requêtes courantes (« calendrier d'une équipe », « classement d'une poule », « stats d'un joueur sur la saison ») sont couvertes par le schéma.
6. La documentation listée en section 7 existe au moment du merge.

---

## 9. Risques connus et mitigations

| Risque | Impact | Mitigation |
|---|---|---|
| Structure HTML FFHB change | Scraping cassé | Tests d'intégration ciblés sur les pages clés + alerting sur les `scrape_run` en erreur. |
| Volumétrie scraping FFHB → ban IP | Scraping bloqué | Rate-limit dans `ffhb-client` (tokenbucket), retry exponentiel, User-Agent identifiant. |
| Player avec même nom dans 2 clubs (homonymes) | Mauvais mapping | Clé naturelle = numéro de licence (`externalId`), jamais le nom. |
| Match data partielle (composition manquante mais score présent) | Stats faussées | Champs nullables + statut `partial` sur `scrape_run`. Pas d'agrégation auto sans complétude. |
| Sport-module mal validé côté code (subtype event invalide) | Données corrompues | Validation Joi côté écriture, basée sur `SportModule.matchEventSubtypes`. |
| Refactor `titan_*` casse les controllers existants | Régression | Refactor par domaine, branches isolées, tests d'API par domaine avant merge. |

---

## 10. Étapes suivantes

1. Ce spec est validé → écriture d'un **plan d'implémentation détaillé** via le skill `writing-plans` (découpé en phases : core models → extensions hand → refactor titan → pipeline scrap → connecteur FFHB → doc).
2. Création des branches de feature.
3. Exécution du plan.
