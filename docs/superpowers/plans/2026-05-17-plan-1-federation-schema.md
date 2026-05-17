# Plan 1 — Schéma fédéral (core + extensions handball) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Règle spécifique à ce projet :** Claude **ne fait aucune opération git** (add/commit/push/branch). L'utilisateur gère tous les commits manuellement. Aucune étape de ce plan ne contient `git commit` ou équivalent. À la fin de chaque tâche, lister les fichiers modifiés ; l'utilisateur les stage et commit lui-même.

**Goal:** Mettre en place le schéma BDD du référentiel fédéral (couche 1) et ses extensions handball (couche 2) du design spec [`2026-05-17-ffhb-scraping-and-federation-model-design.md`](../specs/2026-05-17-ffhb-scraping-and-federation-model-design.md), sans toucher au code existant `titan_*` ni aux controllers.

**Architecture:** Ajout purement additif : nouveaux fichiers d'enums/interfaces dans `packages/titan_core`, nouveaux modèles Sequelize-TypeScript dans `apps/api-titan/src/database/models/federation/` et `…/federation/handball/`. Validation par `pnpm run tsc` (type-check) après chaque tâche + redémarrage du serveur dev pour que `sync({ force: true })` crée les tables. Pas de migrations générées pendant cette phase.

**Tech Stack:** TypeScript, Sequelize-TypeScript, PostgreSQL, pnpm workspaces.

## ⚠ Gotcha critique — Build dépendance `titan_core` ⇒ `api-titan`

Le package `titan_core` expose `"main": "dist/index.js"` et `"types": "dist/index.d.ts"` (cf. `packages/titan_core/package.json`). L'`api-titan` consomme la version **compilée** depuis `dist/`, pas les sources.

→ **Chaque fois qu'on ajoute/modifie quelque chose dans `titan_core/src/`, il faut :**
1. Exécuter `pnpm run tsc` dans `packages/titan_core/` pour reconstruire `dist/`.
2. **Ensuite seulement**, `api-titan` peut voir les nouveaux types.

Les tâches de la **Phase A** se terminent toutes par un `pnpm run tsc` dans `titan_core/` — c'est ce qui actualise `dist/`. Ne pas sauter cette étape.

---

## Phase A — Enums et types partagés (`packages/titan_core`)

### Task 1 : Enums fédération core

**Files:**
- Create: `packages/titan_core/src/enums/federation/federation-code.enum.ts`
- Create: `packages/titan_core/src/enums/federation/federation-match-status.enum.ts`
- Create: `packages/titan_core/src/enums/federation/match-side.enum.ts`
- Create: `packages/titan_core/src/enums/federation/federation-match-event-type.enum.ts`
- Create: `packages/titan_core/src/enums/federation/federation-competition-type.enum.ts`
- Create: `packages/titan_core/src/enums/federation/federation-gender.enum.ts`
- Create: `packages/titan_core/src/enums/federation/federation-shooting-hand.enum.ts`
- Create: `packages/titan_core/src/enums/federation/scrape-run-status.enum.ts`
- Create: `packages/titan_core/src/enums/federation/scrape-run-trigger.enum.ts`
- Create: `packages/titan_core/src/enums/federation/forfeit-side.enum.ts`
- Create: `packages/titan_core/src/enums/federation/index.ts`
- Modify: `packages/titan_core/src/enums/index.ts`

- [ ] **Step 1: Create `federation-code.enum.ts`**

```ts
export enum FederationCode {
  FFHB = 'FFHB',
  FFF = 'FFF',
  FFBB = 'FFBB',
  FFR = 'FFR',
  FFVB = 'FFVB',
}
```

- [ ] **Step 2: Create `federation-match-status.enum.ts`**

```ts
export enum FederationMatchStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  FINISHED = 'finished',
  POSTPONED = 'postponed',
  CANCELLED = 'cancelled',
  FORFEIT = 'forfeit',
}
```

- [ ] **Step 3: Create `match-side.enum.ts`**

```ts
export enum MatchSide {
  HOME = 'home',
  AWAY = 'away',
}
```

- [ ] **Step 4: Create `federation-match-event-type.enum.ts`**

```ts
/**
 * Generic event categories. The per-sport `subtype` (string) is validated
 * by the corresponding SportModule.matchEventSubtypes.
 */
export enum FederationMatchEventType {
  GOAL = 'goal',
  SAVE = 'save',
  SANCTION = 'sanction',
  SUBSTITUTION = 'substitution',
  TIMEOUT = 'timeout',
  ASSIST = 'assist',
  TECHNICAL_FAULT = 'technical_fault',
  OTHER = 'other',
}
```

- [ ] **Step 5: Create `federation-competition-type.enum.ts`**

```ts
export enum FederationCompetitionType {
  CHAMPIONSHIP = 'championship',
  CUP = 'cup',
  TOURNAMENT = 'tournament',
  PLAY_OFF = 'play_off',
  FRIENDLY = 'friendly',
}
```

- [ ] **Step 6: Create `federation-gender.enum.ts`**

```ts
export enum FederationGender {
  MALE = 'male',
  FEMALE = 'female',
  MIXED = 'mixed',
}
```

- [ ] **Step 7: Create `federation-shooting-hand.enum.ts`**

```ts
export enum FederationShootingHand {
  LEFT = 'left',
  RIGHT = 'right',
  AMBIDEXTROUS = 'ambidextrous',
}
```

- [ ] **Step 8: Create `scrape-run-status.enum.ts`**

```ts
export enum ScrapeRunStatus {
  RUNNING = 'running',
  SUCCESS = 'success',
  PARTIAL = 'partial',
  FAILED = 'failed',
}
```

- [ ] **Step 9: Create `scrape-run-trigger.enum.ts`**

```ts
export enum ScrapeRunTrigger {
  CRON = 'cron',
  MANUAL = 'manual',
  WEBHOOK = 'webhook',
}
```

- [ ] **Step 10: Create `forfeit-side.enum.ts`**

```ts
export enum ForfeitSide {
  HOME = 'home',
  AWAY = 'away',
  DOUBLE = 'double',
}
```

- [ ] **Step 11: Create `packages/titan_core/src/enums/federation/index.ts`**

```ts
export * from './federation-code.enum';
export * from './federation-match-status.enum';
export * from './match-side.enum';
export * from './federation-match-event-type.enum';
export * from './federation-competition-type.enum';
export * from './federation-gender.enum';
export * from './federation-shooting-hand.enum';
export * from './scrape-run-status.enum';
export * from './scrape-run-trigger.enum';
export * from './forfeit-side.enum';
```

- [ ] **Step 12: Re-export federation enums from main enums index**

Modify `packages/titan_core/src/enums/index.ts` — add at the end :

```ts
// Federation referential (multi-sport)
export * from './federation';
```

- [ ] **Step 13: Type-check titan_core**

Run from `packages/titan_core/` :
```bash
pnpm run tsc
```
Expected : no errors.

---

### Task 2 : Enums extensions handball

**Files:**
- Create: `packages/titan_core/src/enums/federation/handball/handball-player-position.enum.ts`
- Create: `packages/titan_core/src/enums/federation/handball/handball-match-event-subtype.enum.ts`
- Create: `packages/titan_core/src/enums/federation/handball/index.ts`
- Modify: `packages/titan_core/src/enums/federation/index.ts`

- [ ] **Step 1: Create `handball-player-position.enum.ts`**

```ts
export enum HandballPlayerPosition {
  GOALKEEPER = 'gardien',
  PIVOT = 'pivot',
  LEFT_BACK = 'arriere_g',
  CENTER_BACK = 'arriere_c',
  RIGHT_BACK = 'arriere_d',
  LEFT_WING = 'aile_g',
  RIGHT_WING = 'aile_d',
}
```

- [ ] **Step 2: Create `handball-match-event-subtype.enum.ts`**

```ts
/**
 * Validates the `subtype` string field on federation_match_event for handball matches.
 * Used at write time by the scraper/services.
 */
export enum HandballMatchEventSubtype {
  // goal subtypes
  GOAL_6M = '6m',
  GOAL_7M = '7m',
  GOAL_9M = '9m',
  GOAL_WING = 'wing',
  GOAL_FASTBREAK = 'fastbreak',
  GOAL_PENALTY = 'penalty',
  // sanctions
  SANCTION_2MIN = '2min',
  SANCTION_YELLOW = 'yellow',
  SANCTION_RED = 'red',
  SANCTION_BLUE = 'blue',
  SANCTION_DISQUALIFICATION = 'disqualification',
  // other
  TIMEOUT = 'timeout',
  SUBSTITUTION = 'substitution',
}
```

- [ ] **Step 3: Create handball enums index**

`packages/titan_core/src/enums/federation/handball/index.ts` :

```ts
export * from './handball-player-position.enum';
export * from './handball-match-event-subtype.enum';
```

- [ ] **Step 4: Re-export from federation enums index**

Modify `packages/titan_core/src/enums/federation/index.ts` — append at the end :

```ts
// Sport-specific enums
export * from './handball';
```

- [ ] **Step 5: Type-check titan_core**

```bash
pnpm run tsc
```
Expected : no errors.

---

### Task 3 : Interfaces fédération core

**Files:**
- Create: `packages/titan_core/src/types/interface/models/federation/federation.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-season.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-venue.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-club.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-staff.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-team.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-team-member.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-player.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-competition.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-phase.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-pool.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-pool-team.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-pool-standing.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-matchday.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-match.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-match-lineup.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-match-event.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-player-match-stats.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-player-season-stats.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/federation-scrape-run.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/index.ts`
- Modify: `packages/titan_core/src/types/interface/models/index.ts`

> **Convention de provenance :** chaque interface "scrapable" embarque les champs `externalId`, `federationId`, `lastScrapedAt`, `lastScrapeRunId`, `sourceUrl`, `isManual`. Chaque interface "pivot" embarque uniquement `lastScrapedAt`, `lastScrapeRunId`.

- [ ] **Step 1: Create `federation.model.ts`**

```ts
import { SportType } from '../../../../enums';
import { FederationCode } from '../../../../enums';

export type IFederation = {
  id: string;
  code: FederationCode;
  name: string;
  sport: SportType;
  country: string;
  baseUrl: string;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 2: Create `federation-season.model.ts`**

```ts
import { SportType } from '../../../../enums';

export type IFederationSeason = {
  id: string;
  externalId: string;
  federationId: string;
  sport: SportType;
  label: string; // '2024-2025'
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  // provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 3: Create `federation-venue.model.ts`**

```ts
export type IFederationVenue = {
  id: string;
  externalId: string | null;
  federationId: string;
  name: string;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  capacity: number | null;
  latitude: string | null; // DECIMAL stocké en string par Sequelize
  longitude: string | null;
  // provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 4: Create `federation-club.model.ts`**

```ts
export type IFederationClub = {
  id: string;
  externalId: string;
  federationId: string;
  name: string;
  shortName: string | null;
  city: string | null;
  logoUrl: string | null;
  colors: string[] | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  foundingYear: number | null;
  // provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 5: Create `federation-staff.model.ts`**

```ts
export type IFederationStaff = {
  id: string;
  externalId: string;
  federationId: string;
  clubId: string;
  firstName: string;
  lastName: string;
  role: string;
  sectionScope: string | null;
  // provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 6: Create `federation-team.model.ts`**

```ts
import { FederationGender } from '../../../../enums';

export type IFederationTeam = {
  id: string;
  externalId: string;
  federationId: string;
  clubId: string;
  seasonId: string;
  name: string;
  category: string;
  genderSection: FederationGender;
  level: string | null;
  // provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 7: Create `federation-team-member.model.ts`**

```ts
export type IFederationTeamMember = {
  id: string;
  teamId: string;
  playerId: string;
  jerseyNumber: number | null;
  position: string | null;
  dateFrom: string;
  dateTo: string | null;
  isCaptain: boolean;
  // reduced provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 8: Create `federation-player.model.ts`**

```ts
import { FederationGender } from '../../../../enums';

export type IFederationPlayer = {
  id: string;
  externalId: string;
  federationId: string;
  licenseNumber: string | null;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  gender: FederationGender | null;
  nationality: string | null;
  photoUrl: string | null;
  height: number | null;
  weight: number | null;
  // provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 9: Create `federation-competition.model.ts`**

```ts
import { SportType, FederationCompetitionType, FederationGender } from '../../../../enums';

export type IFederationCompetition = {
  id: string;
  externalId: string;
  federationId: string;
  seasonId: string;
  sport: SportType;
  name: string;
  level: string;
  type: FederationCompetitionType;
  gender: FederationGender;
  category: string;
  // provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 10: Create `federation-phase.model.ts`**

```ts
export type IFederationPhase = {
  id: string;
  externalId: string | null;
  competitionId: string;
  name: string;
  order: number;
  startDate: string | null;
  endDate: string | null;
  // provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 11: Create `federation-pool.model.ts`**

```ts
export type IFederationPool = {
  id: string;
  externalId: string;
  federationId: string;
  phaseId: string;
  name: string;
  category: string | null;
  // provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 12: Create `federation-pool-team.model.ts`**

```ts
export type IFederationPoolTeam = {
  id: string;
  poolId: string;
  teamId: string;
  withdrawn: boolean;
  // reduced provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 13: Create `federation-pool-standing.model.ts`**

```ts
export type IFederationPoolStanding = {
  id: string;
  poolId: string;
  teamId: string;
  rank: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  penaltyPoints: number;
  scrapedAt: string;
  lastScrapeRunId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 14: Create `federation-matchday.model.ts`**

```ts
export type IFederationMatchday = {
  id: string;
  externalId: string | null;
  poolId: string;
  number: number;
  label: string | null;
  plannedDate: string | null;
  // provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 15: Create `federation-match.model.ts`**

```ts
import { FederationMatchStatus, ForfeitSide } from '../../../../enums';

export type IFederationMatch = {
  id: string;
  externalId: string;
  federationId: string;
  matchdayId: string | null;
  poolId: string | null;
  homeTeamId: string;
  awayTeamId: string;
  dateUtc: string;
  status: FederationMatchStatus;
  scoreHome: number | null;
  scoreAway: number | null;
  venueId: string | null;
  forfeitSide: ForfeitSide | null;
  // provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 16: Create `federation-match-lineup.model.ts`**

```ts
import { MatchSide } from '../../../../enums';

export type IFederationMatchLineup = {
  id: string;
  matchId: string;
  playerId: string;
  side: MatchSide;
  starter: boolean;
  jerseyNumber: number | null;
  position: string | null;
  isCaptain: boolean;
  // reduced provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 17: Create `federation-match-event.model.ts`**

```ts
import { MatchSide, FederationMatchEventType } from '../../../../enums';

export type IFederationMatchEvent = {
  id: string;
  matchId: string;
  minute: number;
  second: number | null;
  side: MatchSide;
  type: FederationMatchEventType;
  subtype: string | null;
  playerId: string | null;
  relatedPlayerId: string | null;
  details: Record<string, unknown> | null;
  // reduced provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 18: Create `federation-player-match-stats.model.ts`**

```ts
import { MatchSide } from '../../../../enums';

export type IFederationPlayerMatchStats = {
  id: string;
  matchId: string;
  playerId: string;
  side: MatchSide;
  minutesPlayed: number | null;
  goals: number;
  assists: number;
  saves: number | null;
  // reduced provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 19: Create `federation-player-season-stats.model.ts`**

```ts
export type IFederationPlayerSeasonStats = {
  id: string;
  seasonId: string;
  playerId: string;
  competitionId: string | null;
  matchesPlayed: number;
  goals: number;
  assists: number;
  saves: number | null;
  // reduced provenance
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 20: Create `federation-scrape-run.model.ts`**

```ts
import { ScrapeRunStatus, ScrapeRunTrigger } from '../../../../enums';

export type IFederationScrapeRun = {
  id: string;
  federationId: string;
  startedAt: string;
  finishedAt: string | null;
  status: ScrapeRunStatus;
  trigger: ScrapeRunTrigger;
  targetType: string;
  targetExternalId: string | null;
  rowsInserted: number;
  rowsUpdated: number;
  rowsSkipped: number;
  errors: Array<{ message: string; context?: Record<string, unknown> }>;
  initiatedByUserId: string | null;
  durationMs: number | null;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 21: Create federation interfaces index**

`packages/titan_core/src/types/interface/models/federation/index.ts` :

```ts
export * from './federation.model';
export * from './federation-season.model';
export * from './federation-venue.model';
export * from './federation-club.model';
export * from './federation-staff.model';
export * from './federation-team.model';
export * from './federation-team-member.model';
export * from './federation-player.model';
export * from './federation-competition.model';
export * from './federation-phase.model';
export * from './federation-pool.model';
export * from './federation-pool-team.model';
export * from './federation-pool-standing.model';
export * from './federation-matchday.model';
export * from './federation-match.model';
export * from './federation-match-lineup.model';
export * from './federation-match-event.model';
export * from './federation-player-match-stats.model';
export * from './federation-player-season-stats.model';
export * from './federation-scrape-run.model';
```

- [ ] **Step 22: Re-export from models index**

Modify `packages/titan_core/src/types/interface/models/index.ts` — append at the end :

```ts
// Federation referential
export * from './federation';
```

- [ ] **Step 23: Type-check titan_core**

```bash
pnpm run tsc
```
Expected : no errors. Si erreur, vérifier que les imports d'enums utilisent bien le chemin relatif `'../../../../enums'` (4 niveaux remontés depuis `types/interface/models/federation/`).

---

### Task 4 : Interfaces extensions handball

**Files:**
- Create: `packages/titan_core/src/types/interface/models/federation/handball/federation-player-handball.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/handball/federation-match-handball.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/handball/federation-player-match-stats-handball.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/handball/federation-player-season-stats-handball.model.ts`
- Create: `packages/titan_core/src/types/interface/models/federation/handball/index.ts`
- Modify: `packages/titan_core/src/types/interface/models/federation/index.ts`

- [ ] **Step 1: Create `federation-player-handball.model.ts`**

```ts
import { HandballPlayerPosition, FederationShootingHand } from '../../../../../enums';

export type IFederationPlayerHandball = {
  playerId: string; // PK + FK (1-1 with federation_player)
  positions: HandballPlayerPosition[];
  shootingHand: FederationShootingHand | null;
  preferredJerseyNumber: number | null;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 2: Create `federation-match-handball.model.ts`**

```ts
export type IFederationMatchHandball = {
  matchId: string; // PK + FK (1-1 with federation_match)
  scoreHalfHome: number | null;
  scoreHalfAway: number | null;
  hasExtraTime: boolean;
  scoreExtraHome: number | null;
  scoreExtraAway: number | null;
  hasShootout: boolean;
  scoreShootoutHome: number | null;
  scoreShootoutAway: number | null;
  matchDurationMinutes: number;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 3: Create `federation-player-match-stats-handball.model.ts`**

```ts
export type IFederationPlayerMatchStatsHandball = {
  matchStatsId: string; // PK + FK (1-1)
  // Shots by zone (attempted / made)
  shotsAttempted6m: number;
  shotsMade6m: number;
  shotsAttempted7m: number;
  shotsMade7m: number;
  shotsAttempted9m: number;
  shotsMade9m: number;
  shotsAttemptedWing: number;
  shotsMadeWing: number;
  shotsAttemptedFastbreak: number;
  shotsMadeFastbreak: number;
  // Goalkeeper (null if not GK)
  savesTotal: number | null;
  savesByZone: Record<string, number> | null;
  // Sanctions
  twoMinutesCount: number;
  yellowCard: boolean;
  redCard: boolean;
  blueCard: boolean;
  disqualified: boolean;
  // Other
  assists: number;
  technicalFaults: number;
  steals: number;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 4: Create `federation-player-season-stats-handball.model.ts`**

```ts
export type IFederationPlayerSeasonStatsHandball = {
  seasonStatsId: string; // PK + FK (1-1)
  shotsAttempted6m: number;
  shotsMade6m: number;
  shotsAttempted7m: number;
  shotsMade7m: number;
  shotsAttempted9m: number;
  shotsMade9m: number;
  shotsAttemptedWing: number;
  shotsMadeWing: number;
  shotsAttemptedFastbreak: number;
  shotsMadeFastbreak: number;
  savesTotal: number | null;
  twoMinutesCount: number;
  yellowCards: number;
  redCards: number;
  blueCards: number;
  disqualifications: number;
  assists: number;
  technicalFaults: number;
  steals: number;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 5: Create handball interfaces index**

`packages/titan_core/src/types/interface/models/federation/handball/index.ts` :

```ts
export * from './federation-player-handball.model';
export * from './federation-match-handball.model';
export * from './federation-player-match-stats-handball.model';
export * from './federation-player-season-stats-handball.model';
```

- [ ] **Step 6: Re-export from federation interfaces index**

Modify `packages/titan_core/src/types/interface/models/federation/index.ts` — append :

```ts
// Sport-specific extensions
export * from './handball';
```

- [ ] **Step 7: Type-check titan_core**

```bash
pnpm run tsc
```
Expected : no errors.

---

### Task 5 : Contrat `SportModule` et module handball

**Files:**
- Create: `packages/titan_core/src/sports/sport-module.interface.ts`
- Create: `packages/titan_core/src/sports/handball.module.ts`
- Create: `packages/titan_core/src/sports/sport-module.registry.ts`
- Create: `packages/titan_core/src/sports/index.ts`
- Modify: `packages/titan_core/src/index.ts`

- [ ] **Step 1: Create `sport-module.interface.ts`**

```ts
import { SportType } from '../enums';

export interface SportModuleExtensions {
  player: boolean;
  match: boolean;
  playerMatchStats: boolean;
  playerSeasonStats: boolean;
  competition: boolean;
  team: boolean;
}

export interface SportModulePeriods {
  count: number;
  durationMinutes: number;
}

export interface SportModule {
  sport: SportType;
  matchEventSubtypes: readonly string[];
  playerPositions: readonly string[];
  extensions: SportModuleExtensions;
  periods: SportModulePeriods;
}
```

- [ ] **Step 2: Create `handball.module.ts`**

```ts
import { SportModule } from './sport-module.interface';
import {
  SportType,
  HandballMatchEventSubtype,
  HandballPlayerPosition,
} from '../enums';

export const HandballModule: SportModule = {
  sport: SportType.HANDBALL,
  matchEventSubtypes: Object.values(HandballMatchEventSubtype),
  playerPositions: Object.values(HandballPlayerPosition),
  extensions: {
    player: true,
    match: true,
    playerMatchStats: true,
    playerSeasonStats: true,
    competition: false,
    team: false,
  },
  periods: { count: 2, durationMinutes: 30 },
};
```

- [ ] **Step 3: Create `sport-module.registry.ts`**

```ts
import { SportType } from '../enums';
import { SportModule } from './sport-module.interface';
import { HandballModule } from './handball.module';

const REGISTRY: Partial<Record<SportType, SportModule>> = {
  [SportType.HANDBALL]: HandballModule,
};

export const getSportModule = (sport: SportType): SportModule => {
  const module = REGISTRY[sport];
  if (!module) {
    throw new Error(`No SportModule registered for sport: ${sport}`);
  }
  return module;
};

export const isSportSupported = (sport: SportType): boolean =>
  REGISTRY[sport] !== undefined;
```

- [ ] **Step 4: Create sports index**

`packages/titan_core/src/sports/index.ts` :

```ts
export * from './sport-module.interface';
export * from './handball.module';
export * from './sport-module.registry';
```

- [ ] **Step 5: Re-export from titan_core main index**

Modify `packages/titan_core/src/index.ts` — append :

```ts
export * from './sports';
```

- [ ] **Step 6: Type-check titan_core**

```bash
pnpm run tsc
```
Expected : no errors.

---

## Phase B — Modèles Sequelize core (`apps/api-titan`)

> **Convention de nommage SQL :** tableName en snake_case avec préfixe `federation_<entity>`. PK UUID v4 par défaut. `paranoid: false`, `timestamps: true`.

### Task 6 : Créer le dossier `federation/` et enregistrer dans le loader

**Files:**
- Create: `apps/api-titan/src/database/models/federation/.gitkeep` (placeholder pour que git voie le dossier)
- Modify: `apps/api-titan/src/loaders/database.loader.ts`

- [ ] **Step 1: Créer le dossier vide**

```bash
mkdir -p apps/api-titan/src/database/models/federation
```

- [ ] **Step 2: Ajouter le chargement au databaseLoader**

Modify `apps/api-titan/src/loaders/database.loader.ts` autour de la ligne 22-25 :

```ts
models: [
  ...requireModules(path.join(__dirname, '../database/models')),
  ...requireModules(path.join(__dirname, '../database/models/titan')),
  ...requireModules(path.join(__dirname, '../database/models/federation')),
  ...requireModules(path.join(__dirname, '../database/models/federation/handball')),
],
```

- [ ] **Step 3: Type-check api-titan**

```bash
cd apps/api-titan && pnpm run tsc
```
Expected : no errors (le dossier `federation/handball` n'existe pas encore — `requireModules` retourne un tableau vide, pas une erreur. Le tsc passe).

---

### Task 7 : Modèle `Federation`

**Files:**
- Create: `apps/api-titan/src/database/models/federation/federation.model.ts`
- Create: `apps/api-titan/src/database/models/federation/index.ts`
- Modify: `apps/api-titan/src/database/index.ts`

- [ ] **Step 1: Créer le modèle**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, HasMany, Unique,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederation, FederationCode, SportType } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';

export type CreationModelFederation = WithRequired<
  Partial<IFederation>,
  'code' | 'name' | 'sport' | 'country' | 'baseUrl'
>;

@Table({ tableName: 'federation', paranoid: false, timestamps: true })
export class Federation extends CustomModel<IFederation, CreationModelFederation> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @Unique
  @Column({ type: DataType.ENUM(...Object.values(FederationCode)) })
  code: FederationCode;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(SportType)) })
  sport: SportType;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  country: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  baseUrl: string;
}
```

- [ ] **Step 2: Créer l'index federation**

`apps/api-titan/src/database/models/federation/index.ts` :

```ts
export * from './federation.model';
```

- [ ] **Step 3: Re-export depuis l'index database**

Modify `apps/api-titan/src/database/index.ts` — append :

```ts
// Federation referential
export * from './models/federation';
```

- [ ] **Step 4: Type-check + démarrer le serveur**

```bash
cd apps/api-titan && pnpm run tsc
```
Puis lancer le serveur dev :
```bash
cd apps/api-titan && pnpm run dev
```
Expected : log "DB loaded and connected!", aucune erreur. La table `federation` existe maintenant en BDD.

- [ ] **Step 5: Vérifier en BDD (optionnel mais recommandé)**

```sql
\d federation
```
Doit montrer : id (uuid PK), code (enum unique), name, sport (enum), country, baseUrl, createdAt, updatedAt.

---

### Task 8 : Modèles `FederationSeason` et `FederationVenue`

**Files:**
- Create: `apps/api-titan/src/database/models/federation/federation-season.model.ts`
- Create: `apps/api-titan/src/database/models/federation/federation-venue.model.ts`
- Modify: `apps/api-titan/src/database/models/federation/index.ts`

- [ ] **Step 1: Créer `federation-season.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationSeason, SportType } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';

export type CreationModelFederationSeason = WithRequired<
  Partial<IFederationSeason>,
  'externalId' | 'federationId' | 'sport' | 'label' | 'startDate' | 'endDate'
>;

@Table({ tableName: 'federation_season', paranoid: false, timestamps: true })
export class FederationSeason extends CustomModel<IFederationSeason, CreationModelFederationSeason> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_season_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_season_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(SportType)) })
  sport: SportType;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  label: string;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY })
  startDate: string;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY })
  endDate: string;

  @AllowNull(false) @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isCurrent: boolean;

  @AllowNull(true) @Default(null)
  @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null)
  @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null)
  @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => Federation)
  federation: Federation;
}
```

- [ ] **Step 2: Créer `federation-venue.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationVenue } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';

export type CreationModelFederationVenue = WithRequired<
  Partial<IFederationVenue>,
  'federationId' | 'name'
>;

@Table({ tableName: 'federation_venue', paranoid: false, timestamps: true })
export class FederationVenue extends CustomModel<IFederationVenue, CreationModelFederationVenue> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(true) @Default(null)
  @Column({ type: DataType.STRING })
  externalId: string | null;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  address: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  city: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  postalCode: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  capacity: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DECIMAL(9, 6) })
  latitude: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DECIMAL(9, 6) })
  longitude: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => Federation)
  federation: Federation;
}
```

- [ ] **Step 3: Ré-exporter depuis l'index**

Modify `apps/api-titan/src/database/models/federation/index.ts` :

```ts
export * from './federation.model';
export * from './federation-season.model';
export * from './federation-venue.model';
```

- [ ] **Step 4: Type-check + redémarrer le serveur**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```
Expected : démarrage propre. Les tables `federation_season` et `federation_venue` créées.

---

### Task 9 : Modèles `FederationClub` et `FederationStaff`

**Files:**
- Create: `apps/api-titan/src/database/models/federation/federation-club.model.ts`
- Create: `apps/api-titan/src/database/models/federation/federation-staff.model.ts`
- Modify: `apps/api-titan/src/database/models/federation/index.ts`

- [ ] **Step 1: Créer `federation-club.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, HasMany, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationClub } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';

export type CreationModelFederationClub = WithRequired<
  Partial<IFederationClub>,
  'externalId' | 'federationId' | 'name'
>;

@Table({ tableName: 'federation_club', paranoid: false, timestamps: true })
export class FederationClub extends CustomModel<IFederationClub, CreationModelFederationClub> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_club_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_club_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  shortName: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  city: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  logoUrl: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.JSON })
  colors: string[] | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  website: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  phone: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  email: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  foundingYear: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => Federation)
  federation: Federation;
}
```

- [ ] **Step 2: Créer `federation-staff.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationStaff } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';
import { FederationClub } from './federation-club.model';

export type CreationModelFederationStaff = WithRequired<
  Partial<IFederationStaff>,
  'externalId' | 'federationId' | 'clubId' | 'firstName' | 'lastName' | 'role'
>;

@Table({ tableName: 'federation_staff', paranoid: false, timestamps: true })
export class FederationStaff extends CustomModel<IFederationStaff, CreationModelFederationStaff> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_staff_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_staff_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false) @ForeignKey(() => FederationClub)
  @Column({ type: DataType.UUID })
  clubId: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  firstName: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  lastName: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  role: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sectionScope: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => Federation)
  federation: Federation;

  @BelongsTo(() => FederationClub)
  club: FederationClub;
}
```

- [ ] **Step 3: Ré-exporter**

Append to `apps/api-titan/src/database/models/federation/index.ts` :

```ts
export * from './federation-club.model';
export * from './federation-staff.model';
```

- [ ] **Step 4: Type-check + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```
Expected : tables `federation_club` et `federation_staff` créées.

---

### Task 10 : Modèles `FederationPlayer` et `FederationTeam`

**Files:**
- Create: `apps/api-titan/src/database/models/federation/federation-player.model.ts`
- Create: `apps/api-titan/src/database/models/federation/federation-team.model.ts`
- Modify: `apps/api-titan/src/database/models/federation/index.ts`

- [ ] **Step 1: Créer `federation-player.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationPlayer, FederationGender } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';

export type CreationModelFederationPlayer = WithRequired<
  Partial<IFederationPlayer>,
  'externalId' | 'federationId' | 'firstName' | 'lastName'
>;

@Table({ tableName: 'federation_player', paranoid: false, timestamps: true })
export class FederationPlayer extends CustomModel<IFederationPlayer, CreationModelFederationPlayer> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_player_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_player_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  licenseNumber: string | null;

  @AllowNull(false) @Column({ type: DataType.STRING })
  firstName: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  lastName: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATEONLY })
  birthDate: string | null;

  @AllowNull(true) @Default(null)
  @Column({ type: DataType.ENUM(...Object.values(FederationGender)) })
  gender: FederationGender | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  nationality: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  photoUrl: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  height: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  weight: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => Federation)
  federation: Federation;
}
```

- [ ] **Step 2: Créer `federation-team.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationTeam, FederationGender } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';
import { FederationClub } from './federation-club.model';
import { FederationSeason } from './federation-season.model';

export type CreationModelFederationTeam = WithRequired<
  Partial<IFederationTeam>,
  'externalId' | 'federationId' | 'clubId' | 'seasonId' | 'name' | 'category' | 'genderSection'
>;

@Table({ tableName: 'federation_team', paranoid: false, timestamps: true })
export class FederationTeam extends CustomModel<IFederationTeam, CreationModelFederationTeam> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_team_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_team_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false) @ForeignKey(() => FederationClub)
  @Column({ type: DataType.UUID })
  clubId: string;

  @AllowNull(false) @ForeignKey(() => FederationSeason)
  @Column({ type: DataType.UUID })
  seasonId: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  category: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(FederationGender)) })
  genderSection: FederationGender;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  level: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => Federation)
  federation: Federation;

  @BelongsTo(() => FederationClub)
  club: FederationClub;

  @BelongsTo(() => FederationSeason)
  season: FederationSeason;
}
```

- [ ] **Step 3: Ré-exporter**

```ts
export * from './federation-player.model';
export * from './federation-team.model';
```

- [ ] **Step 4: Type-check + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```
Expected : tables `federation_player` et `federation_team` créées, avec contraintes UNIQUE `(federationId, externalId)`.

---

### Task 11 : Pivot `FederationTeamMember`

**Files:**
- Create: `apps/api-titan/src/database/models/federation/federation-team-member.model.ts`
- Modify: `apps/api-titan/src/database/models/federation/index.ts`

- [ ] **Step 1: Créer le modèle**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationTeamMember } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationTeam } from './federation-team.model';
import { FederationPlayer } from './federation-player.model';

export type CreationModelFederationTeamMember = WithRequired<
  Partial<IFederationTeamMember>,
  'teamId' | 'playerId' | 'dateFrom'
>;

@Table({ tableName: 'federation_team_member', paranoid: false, timestamps: true })
export class FederationTeamMember extends CustomModel<IFederationTeamMember, CreationModelFederationTeamMember> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationTeam)
  @Index({ name: 'fed_team_member_unique', unique: true })
  @Column({ type: DataType.UUID })
  teamId: string;

  @AllowNull(false) @ForeignKey(() => FederationPlayer)
  @Index({ name: 'fed_team_member_unique', unique: true })
  @Column({ type: DataType.UUID })
  playerId: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  jerseyNumber: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  position: string | null;

  @AllowNull(false)
  @Index({ name: 'fed_team_member_unique', unique: true })
  @Column({ type: DataType.DATEONLY })
  dateFrom: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATEONLY })
  dateTo: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isCaptain: boolean;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @BelongsTo(() => FederationTeam)
  team: FederationTeam;

  @BelongsTo(() => FederationPlayer)
  player: FederationPlayer;
}
```

- [ ] **Step 2: Ré-exporter**

```ts
export * from './federation-team-member.model';
```

- [ ] **Step 3: Type-check + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```
Expected : table `federation_team_member` créée avec UNIQUE composé `(teamId, playerId, dateFrom)`.

---

### Task 12 : `FederationCompetition`, `FederationPhase`, `FederationPool`

**Files:**
- Create: `apps/api-titan/src/database/models/federation/federation-competition.model.ts`
- Create: `apps/api-titan/src/database/models/federation/federation-phase.model.ts`
- Create: `apps/api-titan/src/database/models/federation/federation-pool.model.ts`
- Modify: `apps/api-titan/src/database/models/federation/index.ts`

- [ ] **Step 1: Créer `federation-competition.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import {
  IFederationCompetition, SportType,
  FederationCompetitionType, FederationGender,
} from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';
import { FederationSeason } from './federation-season.model';

export type CreationModelFederationCompetition = WithRequired<
  Partial<IFederationCompetition>,
  'externalId' | 'federationId' | 'seasonId' | 'sport' | 'name' | 'level' | 'type' | 'gender' | 'category'
>;

@Table({ tableName: 'federation_competition', paranoid: false, timestamps: true })
export class FederationCompetition extends CustomModel<IFederationCompetition, CreationModelFederationCompetition> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_competition_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_competition_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false) @ForeignKey(() => FederationSeason)
  @Column({ type: DataType.UUID })
  seasonId: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(SportType)) })
  sport: SportType;

  @AllowNull(false) @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  level: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(FederationCompetitionType)) })
  type: FederationCompetitionType;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(FederationGender)) })
  gender: FederationGender;

  @AllowNull(false) @Column({ type: DataType.STRING })
  category: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => Federation)
  federation: Federation;

  @BelongsTo(() => FederationSeason)
  season: FederationSeason;
}
```

- [ ] **Step 2: Créer `federation-phase.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationPhase } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationCompetition } from './federation-competition.model';

export type CreationModelFederationPhase = WithRequired<
  Partial<IFederationPhase>,
  'competitionId' | 'name' | 'order'
>;

@Table({ tableName: 'federation_phase', paranoid: false, timestamps: true })
export class FederationPhase extends CustomModel<IFederationPhase, CreationModelFederationPhase> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  externalId: string | null;

  @AllowNull(false) @ForeignKey(() => FederationCompetition)
  @Column({ type: DataType.UUID })
  competitionId: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  order: number;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATEONLY })
  startDate: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATEONLY })
  endDate: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => FederationCompetition)
  competition: FederationCompetition;
}
```

- [ ] **Step 3: Créer `federation-pool.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationPool } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';
import { FederationPhase } from './federation-phase.model';

export type CreationModelFederationPool = WithRequired<
  Partial<IFederationPool>,
  'externalId' | 'federationId' | 'phaseId' | 'name'
>;

@Table({ tableName: 'federation_pool', paranoid: false, timestamps: true })
export class FederationPool extends CustomModel<IFederationPool, CreationModelFederationPool> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_pool_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_pool_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false) @ForeignKey(() => FederationPhase)
  @Column({ type: DataType.UUID })
  phaseId: string;

  @AllowNull(false) @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  category: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => Federation)
  federation: Federation;

  @BelongsTo(() => FederationPhase)
  phase: FederationPhase;
}
```

- [ ] **Step 4: Ré-exporter**

```ts
export * from './federation-competition.model';
export * from './federation-phase.model';
export * from './federation-pool.model';
```

- [ ] **Step 5: Type-check + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```
Expected : 3 nouvelles tables créées.

---

### Task 13 : `FederationPoolTeam`, `FederationPoolStanding`, `FederationMatchday`

**Files:**
- Create: `apps/api-titan/src/database/models/federation/federation-pool-team.model.ts`
- Create: `apps/api-titan/src/database/models/federation/federation-pool-standing.model.ts`
- Create: `apps/api-titan/src/database/models/federation/federation-matchday.model.ts`
- Modify: `apps/api-titan/src/database/models/federation/index.ts`

- [ ] **Step 1: Créer `federation-pool-team.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationPoolTeam } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationPool } from './federation-pool.model';
import { FederationTeam } from './federation-team.model';

export type CreationModelFederationPoolTeam = WithRequired<
  Partial<IFederationPoolTeam>,
  'poolId' | 'teamId'
>;

@Table({ tableName: 'federation_pool_team', paranoid: false, timestamps: true })
export class FederationPoolTeam extends CustomModel<IFederationPoolTeam, CreationModelFederationPoolTeam> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationPool)
  @Index({ name: 'fed_pool_team_unique', unique: true })
  @Column({ type: DataType.UUID })
  poolId: string;

  @AllowNull(false) @ForeignKey(() => FederationTeam)
  @Index({ name: 'fed_pool_team_unique', unique: true })
  @Column({ type: DataType.UUID })
  teamId: string;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  withdrawn: boolean;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @BelongsTo(() => FederationPool)
  pool: FederationPool;

  @BelongsTo(() => FederationTeam)
  team: FederationTeam;
}
```

- [ ] **Step 2: Créer `federation-pool-standing.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationPoolStanding } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationPool } from './federation-pool.model';
import { FederationTeam } from './federation-team.model';

export type CreationModelFederationPoolStanding = WithRequired<
  Partial<IFederationPoolStanding>,
  'poolId' | 'teamId' | 'rank' | 'played' | 'won' | 'drawn' | 'lost' | 'goalsFor' | 'goalsAgainst' | 'goalDifference' | 'points' | 'scrapedAt'
>;

@Table({ tableName: 'federation_pool_standing', paranoid: false, timestamps: true })
export class FederationPoolStanding extends CustomModel<IFederationPoolStanding, CreationModelFederationPoolStanding> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationPool)
  @Index({ name: 'fed_standing_pool_scraped' })
  @Column({ type: DataType.UUID })
  poolId: string;

  @AllowNull(false) @ForeignKey(() => FederationTeam)
  @Column({ type: DataType.UUID })
  teamId: string;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  rank: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  played: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  won: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  drawn: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  lost: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  goalsFor: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  goalsAgainst: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  goalDifference: number;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  points: number;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  penaltyPoints: number;

  @AllowNull(false)
  @Index({ name: 'fed_standing_pool_scraped' })
  @Column({ type: DataType.DATE })
  scrapedAt: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @BelongsTo(() => FederationPool)
  pool: FederationPool;

  @BelongsTo(() => FederationTeam)
  team: FederationTeam;
}
```

- [ ] **Step 3: Créer `federation-matchday.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationMatchday } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationPool } from './federation-pool.model';

export type CreationModelFederationMatchday = WithRequired<
  Partial<IFederationMatchday>,
  'poolId' | 'number'
>;

@Table({ tableName: 'federation_matchday', paranoid: false, timestamps: true })
export class FederationMatchday extends CustomModel<IFederationMatchday, CreationModelFederationMatchday> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  externalId: string | null;

  @AllowNull(false) @ForeignKey(() => FederationPool)
  @Index({ name: 'fed_matchday_pool_number' })
  @Column({ type: DataType.UUID })
  poolId: string;

  @AllowNull(false)
  @Index({ name: 'fed_matchday_pool_number' })
  @Column({ type: DataType.INTEGER })
  number: number;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  label: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATEONLY })
  plannedDate: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => FederationPool)
  pool: FederationPool;
}
```

- [ ] **Step 4: Ré-exporter**

```ts
export * from './federation-pool-team.model';
export * from './federation-pool-standing.model';
export * from './federation-matchday.model';
```

- [ ] **Step 5: Type-check + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```
Expected : 3 tables créées.

---

### Task 14 : `FederationMatch`, `FederationMatchLineup`, `FederationMatchEvent`

**Files:**
- Create: `apps/api-titan/src/database/models/federation/federation-match.model.ts`
- Create: `apps/api-titan/src/database/models/federation/federation-match-lineup.model.ts`
- Create: `apps/api-titan/src/database/models/federation/federation-match-event.model.ts`
- Modify: `apps/api-titan/src/database/models/federation/index.ts`

- [ ] **Step 1: Créer `federation-match.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationMatch, FederationMatchStatus, ForfeitSide } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';
import { FederationMatchday } from './federation-matchday.model';
import { FederationPool } from './federation-pool.model';
import { FederationTeam } from './federation-team.model';
import { FederationVenue } from './federation-venue.model';

export type CreationModelFederationMatch = WithRequired<
  Partial<IFederationMatch>,
  'externalId' | 'federationId' | 'homeTeamId' | 'awayTeamId' | 'dateUtc' | 'status'
>;

@Table({ tableName: 'federation_match', paranoid: false, timestamps: true })
export class FederationMatch extends CustomModel<IFederationMatch, CreationModelFederationMatch> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Index({ name: 'fed_match_unique', unique: true })
  @Column({ type: DataType.STRING })
  externalId: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Index({ name: 'fed_match_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(true) @Default(null) @ForeignKey(() => FederationMatchday)
  @Index('fed_match_matchday_idx')
  @Column({ type: DataType.UUID })
  matchdayId: string | null;

  @AllowNull(true) @Default(null) @ForeignKey(() => FederationPool)
  @Index('fed_match_pool_idx')
  @Column({ type: DataType.UUID })
  poolId: string | null;

  @AllowNull(false) @ForeignKey(() => FederationTeam)
  @Index('fed_match_home_idx')
  @Column({ type: DataType.UUID })
  homeTeamId: string;

  @AllowNull(false) @ForeignKey(() => FederationTeam)
  @Index('fed_match_away_idx')
  @Column({ type: DataType.UUID })
  awayTeamId: string;

  @AllowNull(false)
  @Index('fed_match_date_idx')
  @Column({ type: DataType.DATE })
  dateUtc: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(FederationMatchStatus)) })
  status: FederationMatchStatus;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreHome: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreAway: number | null;

  @AllowNull(true) @Default(null) @ForeignKey(() => FederationVenue)
  @Column({ type: DataType.UUID })
  venueId: string | null;

  @AllowNull(true) @Default(null)
  @Column({ type: DataType.ENUM(...Object.values(ForfeitSide)) })
  forfeitSide: ForfeitSide | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  sourceUrl: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isManual: boolean;

  @BelongsTo(() => Federation)
  federation: Federation;

  @BelongsTo(() => FederationMatchday)
  matchday: FederationMatchday;

  @BelongsTo(() => FederationPool)
  pool: FederationPool;

  @BelongsTo(() => FederationTeam, 'homeTeamId')
  homeTeam: FederationTeam;

  @BelongsTo(() => FederationTeam, 'awayTeamId')
  awayTeam: FederationTeam;

  @BelongsTo(() => FederationVenue)
  venue: FederationVenue;
}
```

- [ ] **Step 2: Créer `federation-match-lineup.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationMatchLineup, MatchSide } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationMatch } from './federation-match.model';
import { FederationPlayer } from './federation-player.model';

export type CreationModelFederationMatchLineup = WithRequired<
  Partial<IFederationMatchLineup>,
  'matchId' | 'playerId' | 'side' | 'starter'
>;

@Table({ tableName: 'federation_match_lineup', paranoid: false, timestamps: true })
export class FederationMatchLineup extends CustomModel<IFederationMatchLineup, CreationModelFederationMatchLineup> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationMatch)
  @Index({ name: 'fed_lineup_unique', unique: true })
  @Index('fed_lineup_match_side_idx')
  @Column({ type: DataType.UUID })
  matchId: string;

  @AllowNull(false) @ForeignKey(() => FederationPlayer)
  @Index({ name: 'fed_lineup_unique', unique: true })
  @Column({ type: DataType.UUID })
  playerId: string;

  @AllowNull(false)
  @Index('fed_lineup_match_side_idx')
  @Column({ type: DataType.ENUM(...Object.values(MatchSide)) })
  side: MatchSide;

  @AllowNull(false) @Column({ type: DataType.BOOLEAN })
  starter: boolean;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  jerseyNumber: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  position: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  isCaptain: boolean;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @BelongsTo(() => FederationMatch)
  match: FederationMatch;

  @BelongsTo(() => FederationPlayer)
  player: FederationPlayer;
}
```

- [ ] **Step 3: Créer `federation-match-event.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import {
  IFederationMatchEvent, MatchSide, FederationMatchEventType,
} from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationMatch } from './federation-match.model';
import { FederationPlayer } from './federation-player.model';

export type CreationModelFederationMatchEvent = WithRequired<
  Partial<IFederationMatchEvent>,
  'matchId' | 'minute' | 'side' | 'type'
>;

@Table({ tableName: 'federation_match_event', paranoid: false, timestamps: true })
export class FederationMatchEvent extends CustomModel<IFederationMatchEvent, CreationModelFederationMatchEvent> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationMatch)
  @Index('fed_match_event_match_minute_idx')
  @Column({ type: DataType.UUID })
  matchId: string;

  @AllowNull(false)
  @Index('fed_match_event_match_minute_idx')
  @Column({ type: DataType.INTEGER })
  minute: number;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  second: number | null;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(MatchSide)) })
  side: MatchSide;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(FederationMatchEventType)) })
  type: FederationMatchEventType;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  subtype: string | null;

  @AllowNull(true) @Default(null) @ForeignKey(() => FederationPlayer)
  @Column({ type: DataType.UUID })
  playerId: string | null;

  @AllowNull(true) @Default(null) @ForeignKey(() => FederationPlayer)
  @Column({ type: DataType.UUID })
  relatedPlayerId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.JSONB })
  details: Record<string, unknown> | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @BelongsTo(() => FederationMatch)
  match: FederationMatch;

  @BelongsTo(() => FederationPlayer, 'playerId')
  player: FederationPlayer;

  @BelongsTo(() => FederationPlayer, 'relatedPlayerId')
  relatedPlayer: FederationPlayer;
}
```

- [ ] **Step 4: Ré-exporter**

```ts
export * from './federation-match.model';
export * from './federation-match-lineup.model';
export * from './federation-match-event.model';
```

- [ ] **Step 5: Type-check + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```
Expected : 3 tables créées, attention aux doubles FK `homeTeamId`/`awayTeamId` et `playerId`/`relatedPlayerId` qui requièrent l'alias explicite dans le `@BelongsTo`.

---

### Task 15 : Stats `FederationPlayerMatchStats`, `FederationPlayerSeasonStats`

**Files:**
- Create: `apps/api-titan/src/database/models/federation/federation-player-match-stats.model.ts`
- Create: `apps/api-titan/src/database/models/federation/federation-player-season-stats.model.ts`
- Modify: `apps/api-titan/src/database/models/federation/index.ts`

- [ ] **Step 1: Créer `federation-player-match-stats.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationPlayerMatchStats, MatchSide } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationMatch } from './federation-match.model';
import { FederationPlayer } from './federation-player.model';

export type CreationModelFederationPlayerMatchStats = WithRequired<
  Partial<IFederationPlayerMatchStats>,
  'matchId' | 'playerId' | 'side'
>;

@Table({ tableName: 'federation_player_match_stats', paranoid: false, timestamps: true })
export class FederationPlayerMatchStats extends CustomModel<IFederationPlayerMatchStats, CreationModelFederationPlayerMatchStats> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationMatch)
  @Index({ name: 'fed_pms_unique', unique: true })
  @Column({ type: DataType.UUID })
  matchId: string;

  @AllowNull(false) @ForeignKey(() => FederationPlayer)
  @Index({ name: 'fed_pms_unique', unique: true })
  @Index('fed_pms_player_idx')
  @Column({ type: DataType.UUID })
  playerId: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(MatchSide)) })
  side: MatchSide;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  minutesPlayed: number | null;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  goals: number;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  assists: number;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  saves: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @BelongsTo(() => FederationMatch)
  match: FederationMatch;

  @BelongsTo(() => FederationPlayer)
  player: FederationPlayer;
}
```

- [ ] **Step 2: Créer `federation-player-season-stats.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IFederationPlayerSeasonStats } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationSeason } from './federation-season.model';
import { FederationPlayer } from './federation-player.model';
import { FederationCompetition } from './federation-competition.model';

export type CreationModelFederationPlayerSeasonStats = WithRequired<
  Partial<IFederationPlayerSeasonStats>,
  'seasonId' | 'playerId' | 'matchesPlayed' | 'goals' | 'assists'
>;

@Table({ tableName: 'federation_player_season_stats', paranoid: false, timestamps: true })
export class FederationPlayerSeasonStats extends CustomModel<IFederationPlayerSeasonStats, CreationModelFederationPlayerSeasonStats> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationSeason)
  @Index({ name: 'fed_pss_unique', unique: true })
  @Column({ type: DataType.UUID })
  seasonId: string;

  @AllowNull(false) @ForeignKey(() => FederationPlayer)
  @Index({ name: 'fed_pss_unique', unique: true })
  @Column({ type: DataType.UUID })
  playerId: string;

  @AllowNull(true) @Default(null) @ForeignKey(() => FederationCompetition)
  @Index({ name: 'fed_pss_unique', unique: true })
  @Column({ type: DataType.UUID })
  competitionId: string | null;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  matchesPlayed: number;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  goals: number;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  assists: number;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  saves: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  lastScrapedAt: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.UUID })
  lastScrapeRunId: string | null;

  @BelongsTo(() => FederationSeason)
  season: FederationSeason;

  @BelongsTo(() => FederationPlayer)
  player: FederationPlayer;

  @BelongsTo(() => FederationCompetition)
  competition: FederationCompetition;
}
```

- [ ] **Step 3: Ré-exporter**

```ts
export * from './federation-player-match-stats.model';
export * from './federation-player-season-stats.model';
```

- [ ] **Step 4: Type-check + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```

---

### Task 16 : `FederationScrapeRun`

**Files:**
- Create: `apps/api-titan/src/database/models/federation/federation-scrape-run.model.ts`
- Modify: `apps/api-titan/src/database/models/federation/index.ts`

- [ ] **Step 1: Créer le modèle**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import {
  IFederationScrapeRun, ScrapeRunStatus, ScrapeRunTrigger,
} from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { Federation } from './federation.model';
import { User } from '../user.model';

export type CreationModelFederationScrapeRun = WithRequired<
  Partial<IFederationScrapeRun>,
  'federationId' | 'startedAt' | 'status' | 'trigger' | 'targetType'
>;

@Table({ tableName: 'federation_scrape_run', paranoid: false, timestamps: true })
export class FederationScrapeRun extends CustomModel<IFederationScrapeRun, CreationModelFederationScrapeRun> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => Federation)
  @Column({ type: DataType.UUID })
  federationId: string;

  @AllowNull(false) @Column({ type: DataType.DATE })
  startedAt: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  finishedAt: string | null;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(ScrapeRunStatus)) })
  status: ScrapeRunStatus;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(ScrapeRunTrigger)) })
  trigger: ScrapeRunTrigger;

  @AllowNull(false) @Column({ type: DataType.STRING })
  targetType: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  targetExternalId: string | null;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  rowsInserted: number;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  rowsUpdated: number;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER })
  rowsSkipped: number;

  @AllowNull(false) @Default([]) @Column({ type: DataType.JSONB })
  errors: Array<{ message: string; context?: Record<string, unknown> }>;

  @AllowNull(true) @Default(null) @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  initiatedByUserId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  durationMs: number | null;

  @BelongsTo(() => Federation)
  federation: Federation;

  @BelongsTo(() => User)
  initiatedByUser: User;
}
```

- [ ] **Step 2: Ré-exporter**

```ts
export * from './federation-scrape-run.model';
```

- [ ] **Step 3: Type-check + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```
Expected : table `federation_scrape_run` créée. Tous les modèles core de la couche 1 sont en place.

---

## Phase C — Extensions handball (couche 2)

### Task 17 : Préparer le dossier `federation/handball/`

**Files:**
- Create: `apps/api-titan/src/database/models/federation/handball/index.ts` (vide pour l'instant)

- [ ] **Step 1: Créer le dossier**

```bash
mkdir -p apps/api-titan/src/database/models/federation/handball
```

- [ ] **Step 2: Créer un index vide**

`apps/api-titan/src/database/models/federation/handball/index.ts` :

```ts
// Handball-specific federation extension models
```

- [ ] **Step 3: Vérifier que database.loader charge déjà ce dossier**

Lire `apps/api-titan/src/loaders/database.loader.ts` — la ligne ajoutée à Task 6 doit déjà inclure `models/federation/handball`. Si ce n'est pas le cas, ajouter :

```ts
...requireModules(path.join(__dirname, '../database/models/federation/handball')),
```

---

### Task 18 : Modèle `FederationPlayerHandball`

**Files:**
- Create: `apps/api-titan/src/database/models/federation/handball/federation-player-handball.model.ts`
- Modify: `apps/api-titan/src/database/models/federation/handball/index.ts`
- Modify: `apps/api-titan/src/database/index.ts`

- [ ] **Step 1: Créer le modèle**

```ts
import {
  DataType, Column, Table,
  AllowNull, ForeignKey, BelongsTo, PrimaryKey,
} from 'sequelize-typescript';
import {
  IFederationPlayerHandball, HandballPlayerPosition,
  FederationShootingHand,
} from 'titan_core';
import { WithRequired } from '../../../../core';
import { CustomModel } from '../../../custom/custom-model.model';
import { FederationPlayer } from '../federation-player.model';

export type CreationModelFederationPlayerHandball = WithRequired<
  Partial<IFederationPlayerHandball>,
  'playerId'
>;

@Table({ tableName: 'federation_player_handball', paranoid: false, timestamps: true })
export class FederationPlayerHandball extends CustomModel<IFederationPlayerHandball, CreationModelFederationPlayerHandball> {
  @PrimaryKey
  @ForeignKey(() => FederationPlayer)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE' })
  playerId: string;

  @AllowNull(false)
  @Column({
    type: DataType.ARRAY(DataType.ENUM(...Object.values(HandballPlayerPosition))),
    defaultValue: [],
  })
  positions: HandballPlayerPosition[];

  @AllowNull(true) @Column({ type: DataType.ENUM(...Object.values(FederationShootingHand)) })
  shootingHand: FederationShootingHand | null;

  @AllowNull(true) @Column({ type: DataType.INTEGER })
  preferredJerseyNumber: number | null;

  @BelongsTo(() => FederationPlayer)
  player: FederationPlayer;
}
```

- [ ] **Step 2: Ré-exporter**

`apps/api-titan/src/database/models/federation/handball/index.ts` :

```ts
export * from './federation-player-handball.model';
```

- [ ] **Step 3: Re-export depuis l'index database principal**

Modify `apps/api-titan/src/database/index.ts` — append (en dessous du `export * from './models/federation';`) :

```ts
// Federation sport extensions
export * from './models/federation/handball';
```

- [ ] **Step 4: Type-check + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```
Expected : table `federation_player_handball` créée. Note : `ARRAY(ENUM)` est spécifique à PostgreSQL — vérifier dans les logs Sequelize que la table est bien créée avec ce type.

---

### Task 19 : Modèle `FederationMatchHandball`

**Files:**
- Create: `apps/api-titan/src/database/models/federation/handball/federation-match-handball.model.ts`
- Modify: `apps/api-titan/src/database/models/federation/handball/index.ts`

- [ ] **Step 1: Créer le modèle**

```ts
import {
  DataType, Column, Table, Default,
  AllowNull, ForeignKey, BelongsTo, PrimaryKey,
} from 'sequelize-typescript';
import { IFederationMatchHandball } from 'titan_core';
import { WithRequired } from '../../../../core';
import { CustomModel } from '../../../custom/custom-model.model';
import { FederationMatch } from '../federation-match.model';

export type CreationModelFederationMatchHandball = WithRequired<
  Partial<IFederationMatchHandball>,
  'matchId' | 'matchDurationMinutes'
>;

@Table({ tableName: 'federation_match_handball', paranoid: false, timestamps: true })
export class FederationMatchHandball extends CustomModel<IFederationMatchHandball, CreationModelFederationMatchHandball> {
  @PrimaryKey
  @ForeignKey(() => FederationMatch)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE' })
  matchId: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreHalfHome: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreHalfAway: number | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  hasExtraTime: boolean;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreExtraHome: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreExtraAway: number | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  hasShootout: boolean;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreShootoutHome: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreShootoutAway: number | null;

  @AllowNull(false) @Column({ type: DataType.INTEGER })
  matchDurationMinutes: number;

  @BelongsTo(() => FederationMatch)
  match: FederationMatch;
}
```

- [ ] **Step 2: Ré-exporter**

```ts
export * from './federation-match-handball.model';
```

- [ ] **Step 3: Type-check + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```

---

### Task 20 : Modèles `FederationPlayerMatchStatsHandball` et `FederationPlayerSeasonStatsHandball`

**Files:**
- Create: `apps/api-titan/src/database/models/federation/handball/federation-player-match-stats-handball.model.ts`
- Create: `apps/api-titan/src/database/models/federation/handball/federation-player-season-stats-handball.model.ts`
- Modify: `apps/api-titan/src/database/models/federation/handball/index.ts`

- [ ] **Step 1: Créer `federation-player-match-stats-handball.model.ts`**

```ts
import {
  DataType, Column, Table, Default,
  AllowNull, ForeignKey, BelongsTo, PrimaryKey,
} from 'sequelize-typescript';
import { IFederationPlayerMatchStatsHandball } from 'titan_core';
import { WithRequired } from '../../../../core';
import { CustomModel } from '../../../custom/custom-model.model';
import { FederationPlayerMatchStats } from '../federation-player-match-stats.model';

export type CreationModelFederationPlayerMatchStatsHandball = WithRequired<
  Partial<IFederationPlayerMatchStatsHandball>,
  'matchStatsId'
>;

@Table({ tableName: 'federation_player_match_stats_handball', paranoid: false, timestamps: true })
export class FederationPlayerMatchStatsHandball extends CustomModel<IFederationPlayerMatchStatsHandball, CreationModelFederationPlayerMatchStatsHandball> {
  @PrimaryKey
  @ForeignKey(() => FederationPlayerMatchStats)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE' })
  matchStatsId: string;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttempted6m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMade6m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttempted7m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMade7m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttempted9m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMade9m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttemptedWing: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMadeWing: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttemptedFastbreak: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMadeFastbreak: number;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER }) savesTotal: number | null;
  @AllowNull(true) @Default(null) @Column({ type: DataType.JSONB }) savesByZone: Record<string, number> | null;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) twoMinutesCount: number;
  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN }) yellowCard: boolean;
  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN }) redCard: boolean;
  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN }) blueCard: boolean;
  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN }) disqualified: boolean;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) assists: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) technicalFaults: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) steals: number;

  @BelongsTo(() => FederationPlayerMatchStats)
  matchStats: FederationPlayerMatchStats;
}
```

- [ ] **Step 2: Créer `federation-player-season-stats-handball.model.ts`**

```ts
import {
  DataType, Column, Table, Default,
  AllowNull, ForeignKey, BelongsTo, PrimaryKey,
} from 'sequelize-typescript';
import { IFederationPlayerSeasonStatsHandball } from 'titan_core';
import { WithRequired } from '../../../../core';
import { CustomModel } from '../../../custom/custom-model.model';
import { FederationPlayerSeasonStats } from '../federation-player-season-stats.model';

export type CreationModelFederationPlayerSeasonStatsHandball = WithRequired<
  Partial<IFederationPlayerSeasonStatsHandball>,
  'seasonStatsId'
>;

@Table({ tableName: 'federation_player_season_stats_handball', paranoid: false, timestamps: true })
export class FederationPlayerSeasonStatsHandball extends CustomModel<IFederationPlayerSeasonStatsHandball, CreationModelFederationPlayerSeasonStatsHandball> {
  @PrimaryKey
  @ForeignKey(() => FederationPlayerSeasonStats)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE' })
  seasonStatsId: string;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttempted6m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMade6m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttempted7m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMade7m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttempted9m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMade9m: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttemptedWing: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMadeWing: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsAttemptedFastbreak: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) shotsMadeFastbreak: number;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER }) savesTotal: number | null;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) twoMinutesCount: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) yellowCards: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) redCards: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) blueCards: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) disqualifications: number;

  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) assists: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) technicalFaults: number;
  @AllowNull(false) @Default(0) @Column({ type: DataType.INTEGER }) steals: number;

  @BelongsTo(() => FederationPlayerSeasonStats)
  seasonStats: FederationPlayerSeasonStats;
}
```

- [ ] **Step 3: Ré-exporter**

```ts
export * from './federation-player-match-stats-handball.model';
export * from './federation-player-season-stats-handball.model';
```

- [ ] **Step 4: Type-check + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```
Expected : 2 tables d'extension stats créées. Vérifier en BDD que les ON DELETE CASCADE sont bien posés sur les FK PK.

---

## Phase D — Seeding initial et vérification end-to-end

### Task 21 : Seed de la fédération FFHB au démarrage

**Files:**
- Modify: `apps/api-titan/src/loaders/index.ts`

- [ ] **Step 1: Ajouter la fonction `seedFederations` dans `apps/api-titan/src/loaders/index.ts`**

À la fin du fichier (après `seedSportConfigs`), ajouter :

```ts
import { Federation } from '../database';
import { FederationCode } from 'titan_core';

const FEDERATIONS = [
  {
    code: FederationCode.FFHB,
    name: 'Fédération Française de Handball',
    sport: SportType.HANDBALL,
    country: 'FR',
    baseUrl: 'https://www.ffhandball.fr',
  },
];

const seedFederations = async (): Promise<void> => {
  let created = 0;
  for (const fed of FEDERATIONS) {
    const existing = await Federation.findOne({ where: { code: fed.code } });
    if (existing) continue;
    await Federation.create(fed);
    created++;
  }
  if (created > 0) {
    AppConfig.logger.log(`${created} federation(s) seeded`, {
      scenario: LogScenario.SYSTEM_STARTUP,
    });
  }
};
```

- [ ] **Step 2: Appeler `seedFederations()` dans `appLoader`**

Dans la même fonction `appLoader`, après `seedSportConfigs()`, ajouter :

```ts
  await seedDevUsers();
  await seedSportConfigs();
  await seedFederations();
```

- [ ] **Step 3: Type-check + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```
Expected : log `1 federation(s) seeded` au premier démarrage, rien aux suivants. Une ligne dans `federation` avec `code='FFHB'`.

---

### Task 22 : Vérification end-to-end du schéma

**Files:**
- (aucun changement de code — vérification manuelle)

- [ ] **Step 1: Vérifier la liste complète des tables**

Connect à la BDD postgres et exécuter :
```sql
\dt federation*
```
Expected : **22 tables** au total :
```
federation
federation_club
federation_competition
federation_match
federation_match_event
federation_match_handball
federation_match_lineup
federation_matchday
federation_phase
federation_player
federation_player_handball
federation_player_match_stats
federation_player_match_stats_handball
federation_player_season_stats
federation_player_season_stats_handball
federation_pool
federation_pool_standing
federation_pool_team
federation_scrape_run
federation_season
federation_staff
federation_team
federation_team_member
federation_venue
```
(24 tables incluant les 4 extensions handball — recompter si écart.)

- [ ] **Step 2: Vérifier la contrainte UNIQUE sur federation_player**

```sql
\d federation_player
```
Doit montrer un index `fed_player_unique` UNIQUE sur `(externalId, federationId)`.

- [ ] **Step 3: Test fonctionnel manuel : insérer une donnée minimale**

```sql
-- Récupérer l'id FFHB
SELECT id FROM federation WHERE code = 'FFHB';
-- Copier l'UUID dans la variable :federation_id

-- Tenter une insertion player
INSERT INTO federation_player (id, "externalId", "federationId", "firstName", "lastName", "isManual", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'TEST-001', '<UUID FFHB>', 'Test', 'Player', false, NOW(), NOW());

-- Tenter doublon : doit échouer
INSERT INTO federation_player (id, "externalId", "federationId", "firstName", "lastName", "isManual", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'TEST-001', '<UUID FFHB>', 'Test2', 'Player2', false, NOW(), NOW());
-- Expected : ERROR: duplicate key value violates unique constraint "fed_player_unique"

-- Cleanup
DELETE FROM federation_player WHERE "externalId" = 'TEST-001';
```

- [ ] **Step 4: Test ON DELETE CASCADE sur extension handball**

```sql
-- Créer un player + son extension hand
INSERT INTO federation_player (id, "externalId", "federationId", "firstName", "lastName", "isManual", "createdAt", "updatedAt")
VALUES ('11111111-1111-1111-1111-111111111111', 'CASCADE-TEST', '<UUID FFHB>', 'Cascade', 'Test', false, NOW(), NOW());

INSERT INTO federation_player_handball ("playerId", positions, "createdAt", "updatedAt")
VALUES ('11111111-1111-1111-1111-111111111111', '{}', NOW(), NOW());

-- Delete player → handball row doit disparaître automatiquement
DELETE FROM federation_player WHERE id = '11111111-1111-1111-1111-111111111111';

-- Vérification
SELECT COUNT(*) FROM federation_player_handball WHERE "playerId" = '11111111-1111-1111-1111-111111111111';
-- Expected : 0
```

Si l'un des tests échoue, retourner sur la tâche du modèle concerné et corriger.

---

## Phase E — Documentation

### Task 23 : Diagramme ER global

**Files:**
- Create: `docs/architecture/data-model.md`

- [ ] **Step 1: Créer le document avec un diagramme Mermaid des 3 couches**

```markdown
# Modèle de données — Architecture en 3 couches

> Voir le spec de design [`../superpowers/specs/2026-05-17-ffhb-scraping-and-federation-model-design.md`](../superpowers/specs/2026-05-17-ffhb-scraping-and-federation-model-design.md) pour le raisonnement complet.

## Vue d'ensemble

Titan organise ses données en trois couches superposées :

1. **Couche 1 — Référentiel fédéral core (`federation_*`)** : alimenté uniquement par le scrapping. Source de vérité d'identité des entités fédérales (clubs, équipes, joueurs, matchs officiels).
2. **Couche 2 — Extensions sport (`federation_*_<sport>`)** : champs spécifiques à un sport, en 1-1 avec leur entité core (ex : `federation_player_handball` pour les postes et la main de tir).
3. **Couche 3 — App (`titan_*`)** : données SaaS spécifiques aux clubs inscrits sur Titan (cotisations, entraînements, contacts urgence…). Référence la couche 1.

**Règle invariante :** les couches 1 et 2 ne sont jamais modifiées par l'utilisateur final. Le scrapper en est la seule source d'écriture.

## Diagramme ER (couches 1 et 2)

\`\`\`mermaid
erDiagram
    federation ||--o{ federation_season : has
    federation ||--o{ federation_club : has
    federation ||--o{ federation_player : has
    federation ||--o{ federation_competition : has
    federation ||--o{ federation_venue : has
    federation ||--o{ federation_scrape_run : has

    federation_club ||--o{ federation_team : has
    federation_club ||--o{ federation_staff : has
    federation_season ||--o{ federation_team : provides
    federation_season ||--o{ federation_competition : scopes

    federation_team }o--o{ federation_player : "via team_member"
    federation_team_member }o--|| federation_team : ""
    federation_team_member }o--|| federation_player : ""

    federation_competition ||--o{ federation_phase : has
    federation_phase ||--o{ federation_pool : has
    federation_pool }o--o{ federation_team : "via pool_team"
    federation_pool_team }o--|| federation_pool : ""
    federation_pool_team }o--|| federation_team : ""

    federation_pool ||--o{ federation_matchday : has
    federation_pool ||--o{ federation_pool_standing : has
    federation_matchday ||--o{ federation_match : has
    federation_match }|--|| federation_team : "home/away"
    federation_match }o--|| federation_venue : ""
    federation_match ||--o{ federation_match_lineup : has
    federation_match ||--o{ federation_match_event : has
    federation_match ||--o{ federation_player_match_stats : has
    federation_match_lineup }o--|| federation_player : ""
    federation_player_match_stats }o--|| federation_player : ""

    federation_player_season_stats }o--|| federation_player : ""
    federation_player_season_stats }o--|| federation_season : ""

    federation_player ||--o| federation_player_handball : "1-1 extension"
    federation_match ||--o| federation_match_handball : "1-1 extension"
    federation_player_match_stats ||--o| federation_player_match_stats_handball : "1-1 extension"
    federation_player_season_stats ||--o| federation_player_season_stats_handball : "1-1 extension"
\`\`\`

## Glossaire des entités

| Entité | Couche | Description courte |
|---|---|---|
| `federation` | 1 | Une fédération sportive (FFHB, FFF…) |
| `federation_season` | 1 | Saison sportive (2024-2025) |
| `federation_venue` | 1 | Gymnase / salle référencée par la fédé |
| `federation_club` | 1 | Club affilié à une fédération |
| `federation_staff` | 1 | Dirigeant ou entraîneur d'un club (scrappé) |
| `federation_team` | 1 | Équipe d'un club pour une saison |
| `federation_team_member` | 1 (pivot) | Affiliation joueur ↔ équipe, historisée |
| `federation_player` | 1 | Licencié (identité fédérale) |
| `federation_competition` | 1 | Championnat, coupe ou tournoi |
| `federation_phase` | 1 | Phase d'une compétition (aller, retour, play-offs) |
| `federation_pool` | 1 | Poule d'une phase |
| `federation_pool_team` | 1 (pivot) | Inscription d'une équipe à une poule |
| `federation_pool_standing` | 1 | Snapshot de classement de poule |
| `federation_matchday` | 1 | Journée (J1, J2, 8e de finale…) |
| `federation_match` | 1 | Match officiel |
| `federation_match_lineup` | 1 | Présence d'un joueur sur la feuille de match |
| `federation_match_event` | 1 | Événement timé (but, sanction, timeout…) |
| `federation_player_match_stats` | 1 | Stats agrégées d'un joueur sur un match |
| `federation_player_season_stats` | 1 | Stats agrégées d'un joueur sur une saison |
| `federation_scrape_run` | 1 (audit) | Trace d'une exécution du scrapper |
| `federation_player_handball` | 2 | Postes + main de tir, spécifique handball |
| `federation_match_handball` | 2 | Mi-temps, prolongation, tirs au but |
| `federation_player_match_stats_handball` | 2 | Stats détaillées (par zone de tir, sanctions) |
| `federation_player_season_stats_handball` | 2 | Cumul saison des stats handball |

## Champs de provenance

Toutes les entités directement scrapées portent : `externalId`, `federationId`, `lastScrapedAt`, `lastScrapeRunId`, `sourceUrl`, `isManual`.
Les entités pivot portent uniquement : `lastScrapedAt`, `lastScrapeRunId`.

L'unicité d'une entité scrapée est `UNIQUE(federationId, externalId)` — clé naturelle qui rend le scrapping idempotent.
```

- [ ] **Step 2: Vérifier le rendu Mermaid**

Ouvrir le fichier dans un viewer Markdown qui supporte Mermaid (VSCode + extension, GitHub web, etc.) pour s'assurer que le diagramme se rend bien.

---

### Task 24 : Documentation du module sport (`sport-module.md`)

**Files:**
- Create: `docs/architecture/sport-module.md`

- [ ] **Step 1: Créer le document**

```markdown
# SportModule — Ajouter un nouveau sport à Titan

## Principe

Titan est conçu comme un gestionnaire de club **multi-sport**. Le handball est le premier sport supporté, mais l'architecture permet d'ajouter foot, basket, rugby ou volley sans refactor du code core.

Chaque sport est encapsulé dans un `SportModule` (TypeScript) qui définit :
- les postes de jeu valides ;
- les sous-types d'événement de match autorisés ;
- les périodes de jeu (mi-temps, quart-temps…) ;
- quelles tables d'extension SQL existent (`federation_<entity>_<sport>`).

Le `SportModule` est consommé côté **code uniquement** — il n'y a pas de table `sport_config` en BDD.

## Checklist : ajouter le sport « X »

1. **Enums** dans `packages/titan_core/src/enums/federation/X/` :
   - `X-player-position.enum.ts` : liste des postes valides.
   - `X-match-event-subtype.enum.ts` : sous-types d'événement (buts, sanctions, etc.).
   - `index.ts` : re-exports.
2. **Ajouter** `SportType.X` dans `packages/titan_core/src/enums/titan/sport-type.enum.ts`.
3. **Re-exporter** depuis `packages/titan_core/src/enums/federation/index.ts`.
4. **Module** dans `packages/titan_core/src/sports/X.module.ts` :
   ```ts
   export const XModule: SportModule = {
     sport: SportType.X,
     matchEventSubtypes: Object.values(XMatchEventSubtype),
     playerPositions: Object.values(XPlayerPosition),
     extensions: { player: ..., match: ..., ... },
     periods: { count: ..., durationMinutes: ... },
   };
   ```
5. **Enregistrer** dans `packages/titan_core/src/sports/sport-module.registry.ts` :
   ```ts
   const REGISTRY: Partial<Record<SportType, SportModule>> = {
     [SportType.HANDBALL]: HandballModule,
     [SportType.X]: XModule,  // ← ajout
   };
   ```
6. **Interfaces d'extension** (si nécessaire) dans `packages/titan_core/src/types/interface/models/federation/X/`.
7. **Modèles d'extension** Sequelize (si nécessaire) dans `apps/api-titan/src/database/models/federation/X/`.
   - Ré-exporter depuis `apps/api-titan/src/database/index.ts`.
   - Vérifier que le `databaseLoader` charge bien le dossier `models/federation/X`.
8. **Tester** : `pnpm run tsc` puis `pnpm run dev`, vérifier la création des tables.
9. **Connecteur fédération** : voir [`scraping-pipeline.md`](./scraping-pipeline.md) pour ajouter un scraper FFR, FFF, etc.

## Décider : faut-il une table d'extension ?

Une extension n'est nécessaire **que si** le sport a des champs réellement spécifiques nécessitant une colonne SQL typée. Sinon :
- Pour les positions → utiliser le champ `position` (string) dans `federation_team_member` et `federation_match_lineup` ; la validation est faite par le `SportModule.playerPositions`.
- Pour les types d'événement → utiliser `type` (enum générique) + `subtype` (string) + `details` (JSONB) sur `federation_match_event`.

Critères pour créer une extension :
- Champs **numériques agrégés** (stats par zone de tir, par quart-temps…).
- Format **structuré spécifique** (mi-temps vs quart-temps vs sets).
- Constructeur d'ENUM SQL qui n'a de sens que pour ce sport (main de tir, etc.).

## SportModule existants

| Sport | Module | Extensions |
|---|---|---|
| Handball | [`HandballModule`](../../packages/titan_core/src/sports/handball.module.ts) | player, match, playerMatchStats, playerSeasonStats |
```

---

### Task 25 : README du futur module scraping (placeholder)

**Files:**
- Create: `apps/api-titan/src/modules/scraping/README.md`

> Note : le code du module scraping est l'objet du plan 3. On crée ici uniquement le README pour réserver l'emplacement et orienter les contributeurs futurs.

- [ ] **Step 1: Créer le dossier et son README**

```bash
mkdir -p apps/api-titan/src/modules/scraping
```

- [ ] **Step 2: Créer le README**

`apps/api-titan/src/modules/scraping/README.md` :

```markdown
# Module de scraping fédéral

> **Statut :** Pas encore implémenté. Cf. Plan 3 ([`docs/superpowers/plans/`](../../../../docs/superpowers/plans/)).

Ce module héberge :
- `core/` : contrat `FederationScraper`, service `ScrapeRun`, mappers d'entités, résolveur de conflits.
- `ffhb/` : implémentation pour la Fédération Française de Handball.
- `jobs/` : jobs cron (nightly sync, live match, on-demand).
- `api/` : endpoints admin de trigger/inspection.

Voir le design : [`docs/superpowers/specs/2026-05-17-ffhb-scraping-and-federation-model-design.md`](../../../../docs/superpowers/specs/2026-05-17-ffhb-scraping-and-federation-model-design.md) section 6.
```

---

## Tâches finales — Récapitulatif

À la fin de l'exécution de ce plan, les éléments suivants sont en place :

- ✅ Tous les enums fédération (core + handball) dans `titan_core`.
- ✅ Toutes les interfaces TypeScript des entités fédération (core + handball) dans `titan_core`.
- ✅ Le contrat `SportModule` + `HandballModule` + registre dans `titan_core`.
- ✅ 20 modèles Sequelize-TypeScript core + 4 modèles d'extension handball dans `api-titan`.
- ✅ Le `databaseLoader` enregistre les nouveaux dossiers.
- ✅ La fédération FFHB est seedée au démarrage.
- ✅ Documentation : `data-model.md`, `sport-module.md`, `README.md` du module scraping.

**Le code existant `titan_*` (controllers, services, routes) n'a pas été modifié.** L'application reste fonctionnelle dans son état actuel ; les nouvelles tables sont simplement présentes et vides.

**Fichiers modifiés/créés à committer manuellement** (rappel : Claude ne fait aucune action git) :
- `packages/titan_core/src/enums/federation/` (nouveau dossier complet)
- `packages/titan_core/src/types/interface/models/federation/` (nouveau dossier complet)
- `packages/titan_core/src/sports/` (nouveau dossier complet)
- `packages/titan_core/src/enums/index.ts` (modifié)
- `packages/titan_core/src/types/interface/models/index.ts` (modifié)
- `packages/titan_core/src/index.ts` (modifié)
- `apps/api-titan/src/database/models/federation/` (nouveau dossier complet)
- `apps/api-titan/src/database/index.ts` (modifié)
- `apps/api-titan/src/loaders/database.loader.ts` (modifié)
- `apps/api-titan/src/loaders/index.ts` (modifié)
- `apps/api-titan/src/modules/scraping/README.md` (nouveau)
- `docs/architecture/data-model.md` (nouveau)
- `docs/architecture/sport-module.md` (nouveau)
