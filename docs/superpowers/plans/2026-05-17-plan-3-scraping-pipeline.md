# Plan 3 — Pipeline de scraping fédéral + connecteur FFHB — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.
>
> **Règle spécifique à ce projet :** Claude **ne fait aucune opération git** (add/commit/push/branch). L'utilisateur gère tous les commits manuellement. Aucune étape de ce plan ne contient `git commit` ou équivalent.
>
> **Pré-requis :** Plans 1 et 2 doivent avoir été exécutés et mergés. Les tables `federation_*` et `titan_*` (refactorées) sont en place, la fédération FFHB est seedée.

**Goal:** Implémenter le pipeline de scraping fédéral générique (interface `FederationScraper`, gestion des `scrape_run`, mappers d'entités idempotents) et le connecteur concret pour la **Fédération Française de Handball (FFHB)**, plus les jobs cron de synchronisation et les endpoints admin de contrôle manuel.

**Architecture:** Module `apps/api-titan/src/modules/scraping/` organisé en `core/` (contrat + services partagés), `ffhb/` (implémentation concrète), `jobs/` (cron) et `api/` (endpoints admin). Tous les mappers font de l'upsert idempotent sur `UNIQUE(federationId, externalId)`. Chaque scrap = 1 `federation_scrape_run` en BDD pour audit.

**Tech Stack:** TypeScript, Sequelize-TypeScript, axios, cheerio (HTML parser), node-cron, Express.

## ⚠ Gotcha critique — Build dépendance `titan_core` ⇒ `api-titan`

Toute modification de `titan_core/src/` (DTOs scraping notamment) doit être suivie de `pnpm run tsc` dans `packages/titan_core/` pour rebuilder `dist/`.

## ⚠ Découverte FFHB nécessaire

Le HTML de la FFHB n'est pas modélisable a priori — il faut **observer les pages réelles** avant d'écrire les sélecteurs CSS du parser. Plusieurs tâches incluent une étape "exploration manuelle" via `WebFetch` ou un navigateur. C'est volontaire et fait partie du travail d'implémentation.

---

## Phase A — Scaffolding du module + DTOs

### Task 1 : Créer la structure du module `scraping/`

**Files:**
- Create: `apps/api-titan/src/modules/scraping/core/.gitkeep`
- Create: `apps/api-titan/src/modules/scraping/ffhb/.gitkeep`
- Create: `apps/api-titan/src/modules/scraping/ffhb/ffhb-mappers/.gitkeep`
- Create: `apps/api-titan/src/modules/scraping/jobs/.gitkeep`
- Create: `apps/api-titan/src/modules/scraping/api/.gitkeep`

- [ ] **Step 1: Créer les dossiers**

```bash
mkdir -p apps/api-titan/src/modules/scraping/core
mkdir -p apps/api-titan/src/modules/scraping/ffhb/ffhb-mappers
mkdir -p apps/api-titan/src/modules/scraping/jobs
mkdir -p apps/api-titan/src/modules/scraping/api
```

- [ ] **Step 2: Vérifier que le README existe**

Le README du module a été créé en Plan 1 Task 25. Vérifier qu'il existe :
```bash
ls apps/api-titan/src/modules/scraping/README.md
```

Si manquant, le créer avec le contenu prévu en Plan 1 Task 25.

---

### Task 2 : DTOs scraping dans `titan_core`

**Files:**
- Create: `packages/titan_core/src/types/dto/scraping/federation-club.dto.ts`
- Create: `packages/titan_core/src/types/dto/scraping/federation-player.dto.ts`
- Create: `packages/titan_core/src/types/dto/scraping/federation-season.dto.ts`
- Create: `packages/titan_core/src/types/dto/scraping/federation-venue.dto.ts`
- Create: `packages/titan_core/src/types/dto/scraping/federation-competition.dto.ts`
- Create: `packages/titan_core/src/types/dto/scraping/federation-match.dto.ts`
- Create: `packages/titan_core/src/types/dto/scraping/federation-pool-standing.dto.ts`
- Create: `packages/titan_core/src/types/dto/scraping/scrape-result.dto.ts`
- Create: `packages/titan_core/src/types/dto/scraping/index.ts`
- Modify: `packages/titan_core/src/types/dto/index.ts`

> Ces DTO représentent les données **telles qu'elles arrivent du scrapper**, avant transformation vers les entités BDD. C'est l'interface entre le parser HTML et les mappers.

- [ ] **Step 1: Créer `federation-club.dto.ts`**

```ts
export type FederationClubDTO = {
  externalId: string;
  name: string;
  shortName?: string;
  city?: string;
  logoUrl?: string;
  colors?: string[];
  website?: string;
  phone?: string;
  email?: string;
  foundingYear?: number;
  sourceUrl: string;
};
```

- [ ] **Step 2: Créer `federation-player.dto.ts`**

```ts
import { FederationGender, FederationShootingHand, HandballPlayerPosition } from '../../../enums';

export type FederationPlayerDTO = {
  externalId: string;
  licenseNumber?: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  gender?: FederationGender;
  nationality?: string;
  photoUrl?: string;
  height?: number;
  weight?: number;
  sourceUrl: string;
  // Sport-specific (optional, populated only by scrappers that retrieve them)
  handball?: {
    positions?: HandballPlayerPosition[];
    shootingHand?: FederationShootingHand;
    preferredJerseyNumber?: number;
  };
};
```

- [ ] **Step 3: Créer `federation-season.dto.ts`**

```ts
import { SportType } from '../../../enums';

export type FederationSeasonDTO = {
  externalId: string;
  sport: SportType;
  label: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  sourceUrl: string;
};
```

- [ ] **Step 4: Créer `federation-venue.dto.ts`**

```ts
export type FederationVenueDTO = {
  externalId?: string;
  name: string;
  address?: string;
  city?: string;
  postalCode?: string;
  capacity?: number;
  latitude?: string;
  longitude?: string;
  sourceUrl: string;
};
```

- [ ] **Step 5: Créer `federation-competition.dto.ts`**

Inclut les sous-DTOs phase, pool, matchday — l'arbre complet d'une compétition scrapée.

```ts
import { SportType, FederationCompetitionType, FederationGender } from '../../../enums';

export type FederationCompetitionDTO = {
  externalId: string;
  sport: SportType;
  seasonExternalId: string;
  name: string;
  level: string;
  type: FederationCompetitionType;
  gender: FederationGender;
  category: string;
  sourceUrl: string;
};

export type FederationPhaseDTO = {
  externalId?: string;
  name: string;
  order: number;
  startDate?: string;
  endDate?: string;
};

export type FederationPoolDTO = {
  externalId: string;
  name: string;
  category?: string;
  teamExternalIds: string[]; // clés naturelles des équipes inscrites
};

export type FederationMatchdayDTO = {
  externalId?: string;
  number: number;
  label?: string;
  plannedDate?: string;
};

export type FederationCompetitionTreeDTO = {
  competition: FederationCompetitionDTO;
  phases: Array<{
    phase: FederationPhaseDTO;
    pools: Array<{
      pool: FederationPoolDTO;
      matchdays: FederationMatchdayDTO[];
    }>;
  }>;
};
```

- [ ] **Step 6: Créer `federation-match.dto.ts`**

```ts
import {
  FederationMatchStatus, MatchSide, FederationMatchEventType, ForfeitSide,
} from '../../../enums';

export type FederationMatchLineupDTO = {
  playerExternalId: string;
  side: MatchSide;
  starter: boolean;
  jerseyNumber?: number;
  position?: string;
  isCaptain?: boolean;
};

export type FederationMatchEventDTO = {
  minute: number;
  second?: number;
  side: MatchSide;
  type: FederationMatchEventType;
  subtype?: string;
  playerExternalId?: string;
  relatedPlayerExternalId?: string;
  details?: Record<string, unknown>;
};

export type FederationPlayerMatchStatsDTO = {
  playerExternalId: string;
  side: MatchSide;
  minutesPlayed?: number;
  goals: number;
  assists: number;
  saves?: number;
  // Sport-specific
  handball?: {
    shotsAttempted6m?: number; shotsMade6m?: number;
    shotsAttempted7m?: number; shotsMade7m?: number;
    shotsAttempted9m?: number; shotsMade9m?: number;
    shotsAttemptedWing?: number; shotsMadeWing?: number;
    shotsAttemptedFastbreak?: number; shotsMadeFastbreak?: number;
    savesTotal?: number;
    savesByZone?: Record<string, number>;
    twoMinutesCount?: number;
    yellowCard?: boolean;
    redCard?: boolean;
    blueCard?: boolean;
    disqualified?: boolean;
    assists?: number;
    technicalFaults?: number;
    steals?: number;
  };
};

export type FederationMatchDTO = {
  externalId: string;
  poolExternalId?: string;
  matchdayNumber?: number;
  homeTeamExternalId: string;
  awayTeamExternalId: string;
  dateUtc: string;
  status: FederationMatchStatus;
  scoreHome?: number;
  scoreAway?: number;
  venueExternalId?: string;
  forfeitSide?: ForfeitSide;
  lineup?: FederationMatchLineupDTO[];
  events?: FederationMatchEventDTO[];
  stats?: FederationPlayerMatchStatsDTO[];
  // Sport-specific match details
  handball?: {
    scoreHalfHome?: number;
    scoreHalfAway?: number;
    hasExtraTime?: boolean;
    scoreExtraHome?: number;
    scoreExtraAway?: number;
    hasShootout?: boolean;
    scoreShootoutHome?: number;
    scoreShootoutAway?: number;
    matchDurationMinutes: number;
  };
  sourceUrl: string;
};
```

- [ ] **Step 7: Créer `federation-pool-standing.dto.ts`**

```ts
export type FederationPoolStandingDTO = {
  poolExternalId: string;
  teamExternalId: string;
  rank: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  penaltyPoints?: number;
  scrapedAt: string;
  sourceUrl: string;
};
```

- [ ] **Step 8: Créer `scrape-result.dto.ts`**

```ts
export type ScrapeResult<T> = {
  data: T | null;
  scrapeRunId: string;
  rowsInserted: number;
  rowsUpdated: number;
  rowsSkipped: number;
  warnings: string[];
};
```

- [ ] **Step 9: Créer l'index `scraping/index.ts`**

```ts
export * from './federation-club.dto';
export * from './federation-player.dto';
export * from './federation-season.dto';
export * from './federation-venue.dto';
export * from './federation-competition.dto';
export * from './federation-match.dto';
export * from './federation-pool-standing.dto';
export * from './scrape-result.dto';
```

- [ ] **Step 10: Re-exporter depuis l'index DTO global**

Lire `packages/titan_core/src/types/dto/index.ts` et ajouter :

```ts
export * from './scraping';
```

- [ ] **Step 11: Build titan_core**

```bash
cd packages/titan_core && pnpm run tsc
```
Expected : no errors.

---

### Task 3 : Interface `FederationScraper`

**Files:**
- Create: `apps/api-titan/src/modules/scraping/core/federation-scraper.interface.ts`

- [ ] **Step 1: Créer le fichier**

```ts
import {
  ScrapeResult,
  FederationClubDTO,
  FederationPlayerDTO,
  FederationCompetitionTreeDTO,
  FederationMatchDTO,
  FederationPoolStandingDTO,
  FederationSeasonDTO,
} from 'titan_core';
import { Federation } from '../../../database';

export interface ScrapeCompetitionOptions {
  /** Si true, scrape récursivement poules + matchs + stats. Sinon, juste la compétition + phases. */
  deep?: boolean;
}

export interface FederationScraper {
  /** Le modèle Federation pour lequel ce scrapper est instancié. */
  federation: Federation;

  /** Scrape un club par son ID externe. */
  scrapeClub(externalId: string): Promise<ScrapeResult<FederationClubDTO>>;

  /** Scrape un joueur (licencié) par son numéro de licence ou ID externe. */
  scrapePlayer(externalId: string): Promise<ScrapeResult<FederationPlayerDTO>>;

  /** Scrape une compétition. Avec deep=true, récurse poules + matchs + stats. */
  scrapeCompetition(
    externalId: string,
    options?: ScrapeCompetitionOptions,
  ): Promise<ScrapeResult<FederationCompetitionTreeDTO>>;

  /** Scrape un match avec lineup + events + stats. */
  scrapeMatch(externalId: string): Promise<ScrapeResult<FederationMatchDTO>>;

  /** Scrape le classement d'une poule à un instant T. */
  scrapePoolStandings(
    poolExternalId: string,
  ): Promise<ScrapeResult<FederationPoolStandingDTO[]>>;

  /** Découvre la saison correspondant à une année donnée (e.g. 2024 → "2024-2025"). */
  discoverSeason(year: number): Promise<ScrapeResult<FederationSeasonDTO>>;
}
```

- [ ] **Step 2: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 4 : Service `ScrapeRunService`

**Files:**
- Create: `apps/api-titan/src/modules/scraping/core/scrape-run.service.ts`

- [ ] **Step 1: Créer le service**

```ts
import { ScrapeRunStatus, ScrapeRunTrigger } from 'titan_core';
import { FederationScrapeRun } from '../../../database';
import { Service } from '../../../core';

export interface ScrapeRunStartOptions {
  federationId: string;
  trigger: ScrapeRunTrigger;
  targetType: string;
  targetExternalId?: string;
  initiatedByUserId?: string;
}

export interface ScrapeRunFinishOptions {
  scrapeRunId: string;
  status: ScrapeRunStatus;
  rowsInserted: number;
  rowsUpdated: number;
  rowsSkipped: number;
  errors?: Array<{ message: string; context?: Record<string, unknown> }>;
}

class ScrapeRunService extends Service {
  async start(opts: ScrapeRunStartOptions): Promise<FederationScrapeRun> {
    const run = await FederationScrapeRun.create({
      federationId: opts.federationId,
      startedAt: new Date().toISOString(),
      status: ScrapeRunStatus.RUNNING,
      trigger: opts.trigger,
      targetType: opts.targetType,
      targetExternalId: opts.targetExternalId ?? null,
      initiatedByUserId: opts.initiatedByUserId ?? null,
      rowsInserted: 0,
      rowsUpdated: 0,
      rowsSkipped: 0,
      errors: [],
    });
    this.logger.log(`ScrapeRun ${run.id} started (${opts.targetType}/${opts.targetExternalId ?? 'all'})`);
    return run;
  }

  async finish(opts: ScrapeRunFinishOptions): Promise<FederationScrapeRun> {
    const run = await FederationScrapeRun.findByPk(opts.scrapeRunId);
    if (!run) throw new Error(`ScrapeRun ${opts.scrapeRunId} not found`);

    const startedAt = new Date(run.startedAt);
    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - startedAt.getTime();

    await run.update({
      finishedAt: finishedAt.toISOString(),
      status: opts.status,
      rowsInserted: opts.rowsInserted,
      rowsUpdated: opts.rowsUpdated,
      rowsSkipped: opts.rowsSkipped,
      errors: opts.errors ?? [],
      durationMs,
    });

    this.logger.log(
      `ScrapeRun ${run.id} finished: ${opts.status} ` +
      `(+${opts.rowsInserted} ~${opts.rowsUpdated} =${opts.rowsSkipped} in ${durationMs}ms)`,
    );
    return run;
  }

  async fail(scrapeRunId: string, error: Error): Promise<FederationScrapeRun> {
    return this.finish({
      scrapeRunId,
      status: ScrapeRunStatus.FAILED,
      rowsInserted: 0,
      rowsUpdated: 0,
      rowsSkipped: 0,
      errors: [{ message: error.message, context: { stack: error.stack } }],
    });
  }
}

export default new ScrapeRunService();
```

- [ ] **Step 2: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

## Phase B — Entity mappers (DTO → upsert idempotent)

> Chaque mapper :
> - Reçoit un DTO + un `scrapeRunId` + le `federationId` courant.
> - Cherche l'entité existante par `(federationId, externalId)`.
> - Insère si absente, met à jour les champs si présente.
> - Retourne `{ entity, wasCreated, wasUpdated }` pour permettre le décompte au scrape_run.

### Task 5 : `ClubMapper`

**Files:**
- Create: `apps/api-titan/src/modules/scraping/core/mappers/club.mapper.ts`

- [ ] **Step 1: Créer le mapper**

```ts
import { FederationClubDTO } from 'titan_core';
import { FederationClub } from '../../../../database';

export interface MapperResult<T> {
  entity: T;
  wasCreated: boolean;
  wasUpdated: boolean;
}

export class ClubMapper {
  static async upsert(
    dto: FederationClubDTO,
    federationId: string,
    scrapeRunId: string,
  ): Promise<MapperResult<FederationClub>> {
    const existing = await FederationClub.findOne({
      where: { externalId: dto.externalId, federationId },
    });

    const payload = {
      name: dto.name,
      shortName: dto.shortName ?? null,
      city: dto.city ?? null,
      logoUrl: dto.logoUrl ?? null,
      colors: dto.colors ?? null,
      website: dto.website ?? null,
      phone: dto.phone ?? null,
      email: dto.email ?? null,
      foundingYear: dto.foundingYear ?? null,
      sourceUrl: dto.sourceUrl,
      lastScrapedAt: new Date().toISOString(),
      lastScrapeRunId: scrapeRunId,
    };

    if (existing) {
      await existing.update(payload);
      return { entity: existing, wasCreated: false, wasUpdated: true };
    }

    const created = await FederationClub.create({
      externalId: dto.externalId,
      federationId,
      isManual: false,
      ...payload,
    });
    return { entity: created, wasCreated: true, wasUpdated: false };
  }
}
```

- [ ] **Step 2: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 6 : `PlayerMapper` (avec extension handball)

**Files:**
- Create: `apps/api-titan/src/modules/scraping/core/mappers/player.mapper.ts`

- [ ] **Step 1: Créer le mapper**

```ts
import { FederationPlayerDTO, SportType } from 'titan_core';
import { FederationPlayer, FederationPlayerHandball, Federation } from '../../../../database';
import { MapperResult } from './club.mapper';

export class PlayerMapper {
  static async upsert(
    dto: FederationPlayerDTO,
    federationId: string,
    scrapeRunId: string,
  ): Promise<MapperResult<FederationPlayer>> {
    const existing = await FederationPlayer.findOne({
      where: { externalId: dto.externalId, federationId },
    });

    const corePayload = {
      licenseNumber: dto.licenseNumber ?? null,
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: dto.birthDate ?? null,
      gender: dto.gender ?? null,
      nationality: dto.nationality ?? null,
      photoUrl: dto.photoUrl ?? null,
      height: dto.height ?? null,
      weight: dto.weight ?? null,
      sourceUrl: dto.sourceUrl,
      lastScrapedAt: new Date().toISOString(),
      lastScrapeRunId: scrapeRunId,
    };

    let player: FederationPlayer;
    let wasCreated = false;
    let wasUpdated = false;

    if (existing) {
      await existing.update(corePayload);
      player = existing;
      wasUpdated = true;
    } else {
      player = await FederationPlayer.create({
        externalId: dto.externalId,
        federationId,
        isManual: false,
        ...corePayload,
      });
      wasCreated = true;
    }

    // Extension handball si la fédération est de type handball ET le DTO porte des données handball
    const federation = await Federation.findByPk(federationId);
    if (federation?.sport === SportType.HANDBALL && dto.handball) {
      const existingHandball = await FederationPlayerHandball.findByPk(player.id);
      const handballPayload = {
        positions: dto.handball.positions ?? [],
        shootingHand: dto.handball.shootingHand ?? null,
        preferredJerseyNumber: dto.handball.preferredJerseyNumber ?? null,
      };

      if (existingHandball) {
        await existingHandball.update(handballPayload);
      } else {
        await FederationPlayerHandball.create({
          playerId: player.id,
          ...handballPayload,
        });
      }
    }

    return { entity: player, wasCreated, wasUpdated };
  }
}
```

- [ ] **Step 2: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 7 : `SeasonMapper` et `VenueMapper`

**Files:**
- Create: `apps/api-titan/src/modules/scraping/core/mappers/season.mapper.ts`
- Create: `apps/api-titan/src/modules/scraping/core/mappers/venue.mapper.ts`

- [ ] **Step 1: Créer `season.mapper.ts`**

```ts
import { FederationSeasonDTO } from 'titan_core';
import { FederationSeason } from '../../../../database';
import { MapperResult } from './club.mapper';

export class SeasonMapper {
  static async upsert(
    dto: FederationSeasonDTO,
    federationId: string,
    scrapeRunId: string,
  ): Promise<MapperResult<FederationSeason>> {
    const existing = await FederationSeason.findOne({
      where: { externalId: dto.externalId, federationId },
    });

    const payload = {
      sport: dto.sport,
      label: dto.label,
      startDate: dto.startDate,
      endDate: dto.endDate,
      isCurrent: dto.isCurrent,
      sourceUrl: dto.sourceUrl,
      lastScrapedAt: new Date().toISOString(),
      lastScrapeRunId: scrapeRunId,
    };

    if (existing) {
      await existing.update(payload);
      return { entity: existing, wasCreated: false, wasUpdated: true };
    }

    const created = await FederationSeason.create({
      externalId: dto.externalId,
      federationId,
      isManual: false,
      ...payload,
    });
    return { entity: created, wasCreated: true, wasUpdated: false };
  }
}
```

- [ ] **Step 2: Créer `venue.mapper.ts`**

```ts
import { FederationVenueDTO } from 'titan_core';
import { FederationVenue } from '../../../../database';
import { MapperResult } from './club.mapper';
import { Op } from 'sequelize';

export class VenueMapper {
  static async upsert(
    dto: FederationVenueDTO,
    federationId: string,
    scrapeRunId: string,
  ): Promise<MapperResult<FederationVenue>> {
    // Une salle peut ne pas avoir d'externalId — on déduplique alors sur (federationId, name, city)
    let existing: FederationVenue | null = null;
    if (dto.externalId) {
      existing = await FederationVenue.findOne({
        where: { externalId: dto.externalId, federationId },
      });
    } else {
      existing = await FederationVenue.findOne({
        where: {
          federationId,
          name: dto.name,
          city: dto.city ?? { [Op.is]: null } as any,
        },
      });
    }

    const payload = {
      name: dto.name,
      address: dto.address ?? null,
      city: dto.city ?? null,
      postalCode: dto.postalCode ?? null,
      capacity: dto.capacity ?? null,
      latitude: dto.latitude ?? null,
      longitude: dto.longitude ?? null,
      sourceUrl: dto.sourceUrl,
      lastScrapedAt: new Date().toISOString(),
      lastScrapeRunId: scrapeRunId,
    };

    if (existing) {
      await existing.update(payload);
      return { entity: existing, wasCreated: false, wasUpdated: true };
    }

    const created = await FederationVenue.create({
      externalId: dto.externalId ?? null,
      federationId,
      isManual: false,
      ...payload,
    });
    return { entity: created, wasCreated: true, wasUpdated: false };
  }
}
```

- [ ] **Step 3: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 8 : `CompetitionMapper` (arbre complet : competition → phases → pools → matchdays)

**Files:**
- Create: `apps/api-titan/src/modules/scraping/core/mappers/competition.mapper.ts`

- [ ] **Step 1: Créer le mapper**

```ts
import {
  FederationCompetitionTreeDTO,
  FederationCompetitionDTO,
  FederationPhaseDTO,
  FederationPoolDTO,
  FederationMatchdayDTO,
} from 'titan_core';
import {
  FederationCompetition, FederationPhase, FederationPool,
  FederationMatchday, FederationPoolTeam, FederationTeam, FederationSeason,
} from '../../../../database';
import { MapperResult } from './club.mapper';

export interface CompetitionTreeUpsertCounts {
  inserted: number;
  updated: number;
  skipped: number;
}

export class CompetitionMapper {
  /**
   * Upsert d'un arbre compétition complet : competition + phases + pools + matchdays + inscriptions équipes.
   * Les équipes (externalId) référencées dans les pools doivent déjà exister en BDD (sinon skipées).
   * Retourne les compteurs agrégés.
   */
  static async upsertTree(
    tree: FederationCompetitionTreeDTO,
    federationId: string,
    scrapeRunId: string,
  ): Promise<CompetitionTreeUpsertCounts> {
    const counts: CompetitionTreeUpsertCounts = { inserted: 0, updated: 0, skipped: 0 };

    // 1. Competition
    const season = await FederationSeason.findOne({
      where: { externalId: tree.competition.seasonExternalId, federationId },
    });
    if (!season) {
      counts.skipped++;
      return counts; // ne pas créer une compétition orpheline
    }

    const compResult = await this.upsertCompetition(
      tree.competition, federationId, season.id, scrapeRunId,
    );
    this.bumpCounts(counts, compResult);
    const competition = compResult.entity;

    // 2. Phases
    for (const { phase, pools } of tree.phases) {
      const phaseResult = await this.upsertPhase(phase, competition.id, scrapeRunId);
      this.bumpCounts(counts, phaseResult);

      // 3. Pools
      for (const { pool, matchdays } of pools) {
        const poolResult = await this.upsertPool(pool, federationId, phaseResult.entity.id, scrapeRunId);
        this.bumpCounts(counts, poolResult);

        // 3.a. Inscriptions des équipes dans la poule
        for (const teamExternalId of pool.teamExternalIds) {
          const team = await FederationTeam.findOne({
            where: { externalId: teamExternalId, federationId },
          });
          if (!team) {
            counts.skipped++;
            continue;
          }
          const [, created] = await FederationPoolTeam.findOrCreate({
            where: { poolId: poolResult.entity.id, teamId: team.id },
            defaults: {
              poolId: poolResult.entity.id,
              teamId: team.id,
              withdrawn: false,
              lastScrapedAt: new Date().toISOString(),
              lastScrapeRunId: scrapeRunId,
            },
          });
          if (created) counts.inserted++; else counts.skipped++;
        }

        // 4. Matchdays
        for (const matchday of matchdays) {
          const mdResult = await this.upsertMatchday(matchday, poolResult.entity.id, scrapeRunId);
          this.bumpCounts(counts, mdResult);
        }
      }
    }

    return counts;
  }

  private static async upsertCompetition(
    dto: FederationCompetitionDTO,
    federationId: string,
    seasonId: string,
    scrapeRunId: string,
  ): Promise<MapperResult<FederationCompetition>> {
    const existing = await FederationCompetition.findOne({
      where: { externalId: dto.externalId, federationId },
    });
    const payload = {
      seasonId,
      sport: dto.sport,
      name: dto.name,
      level: dto.level,
      type: dto.type,
      gender: dto.gender,
      category: dto.category,
      sourceUrl: dto.sourceUrl,
      lastScrapedAt: new Date().toISOString(),
      lastScrapeRunId: scrapeRunId,
    };
    if (existing) {
      await existing.update(payload);
      return { entity: existing, wasCreated: false, wasUpdated: true };
    }
    const created = await FederationCompetition.create({
      externalId: dto.externalId, federationId, isManual: false, ...payload,
    });
    return { entity: created, wasCreated: true, wasUpdated: false };
  }

  private static async upsertPhase(
    dto: FederationPhaseDTO,
    competitionId: string,
    scrapeRunId: string,
  ): Promise<MapperResult<FederationPhase>> {
    // Pas d'externalId garanti → on déduplique sur (competitionId, order)
    const existing = await FederationPhase.findOne({
      where: { competitionId, order: dto.order },
    });
    const payload = {
      externalId: dto.externalId ?? null,
      name: dto.name,
      startDate: dto.startDate ?? null,
      endDate: dto.endDate ?? null,
      lastScrapedAt: new Date().toISOString(),
      lastScrapeRunId: scrapeRunId,
    };
    if (existing) {
      await existing.update(payload);
      return { entity: existing, wasCreated: false, wasUpdated: true };
    }
    const created = await FederationPhase.create({
      competitionId, order: dto.order, isManual: false, ...payload,
    });
    return { entity: created, wasCreated: true, wasUpdated: false };
  }

  private static async upsertPool(
    dto: FederationPoolDTO,
    federationId: string,
    phaseId: string,
    scrapeRunId: string,
  ): Promise<MapperResult<FederationPool>> {
    const existing = await FederationPool.findOne({
      where: { externalId: dto.externalId, federationId },
    });
    const payload = {
      phaseId,
      name: dto.name,
      category: dto.category ?? null,
      lastScrapedAt: new Date().toISOString(),
      lastScrapeRunId: scrapeRunId,
    };
    if (existing) {
      await existing.update(payload);
      return { entity: existing, wasCreated: false, wasUpdated: true };
    }
    const created = await FederationPool.create({
      externalId: dto.externalId, federationId, isManual: false, ...payload,
    });
    return { entity: created, wasCreated: true, wasUpdated: false };
  }

  private static async upsertMatchday(
    dto: FederationMatchdayDTO,
    poolId: string,
    scrapeRunId: string,
  ): Promise<MapperResult<FederationMatchday>> {
    const existing = await FederationMatchday.findOne({
      where: { poolId, number: dto.number },
    });
    const payload = {
      externalId: dto.externalId ?? null,
      label: dto.label ?? null,
      plannedDate: dto.plannedDate ?? null,
      lastScrapedAt: new Date().toISOString(),
      lastScrapeRunId: scrapeRunId,
    };
    if (existing) {
      await existing.update(payload);
      return { entity: existing, wasCreated: false, wasUpdated: true };
    }
    const created = await FederationMatchday.create({
      poolId, number: dto.number, isManual: false, ...payload,
    });
    return { entity: created, wasCreated: true, wasUpdated: false };
  }

  private static bumpCounts(
    counts: CompetitionTreeUpsertCounts,
    result: MapperResult<unknown>,
  ): void {
    if (result.wasCreated) counts.inserted++;
    else if (result.wasUpdated) counts.updated++;
    else counts.skipped++;
  }
}
```

- [ ] **Step 2: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 9 : `MatchMapper` (avec lineup, events, stats + extension handball)

**Files:**
- Create: `apps/api-titan/src/modules/scraping/core/mappers/match.mapper.ts`

- [ ] **Step 1: Créer le mapper**

```ts
import {
  FederationMatchDTO, FederationMatchLineupDTO,
  FederationMatchEventDTO, FederationPlayerMatchStatsDTO,
  SportType,
} from 'titan_core';
import {
  FederationMatch, FederationMatchHandball, FederationMatchLineup,
  FederationMatchEvent, FederationPlayerMatchStats,
  FederationPlayerMatchStatsHandball, FederationTeam, FederationPlayer,
  FederationVenue, FederationMatchday, FederationPool, Federation,
} from '../../../../database';
import { MapperResult } from './club.mapper';

export interface MatchUpsertCounts {
  inserted: number;
  updated: number;
  skipped: number;
}

export class MatchMapper {
  /**
   * Upsert d'un match avec toutes ses dépendances (lineup, events, stats).
   * Les équipes/joueurs/venues référencés doivent déjà exister (sinon skip).
   */
  static async upsert(
    dto: FederationMatchDTO,
    federationId: string,
    scrapeRunId: string,
  ): Promise<MapperResult<FederationMatch> & { counts: MatchUpsertCounts }> {
    const counts: MatchUpsertCounts = { inserted: 0, updated: 0, skipped: 0 };

    // Résolution des FK
    const [homeTeam, awayTeam] = await Promise.all([
      FederationTeam.findOne({ where: { externalId: dto.homeTeamExternalId, federationId } }),
      FederationTeam.findOne({ where: { externalId: dto.awayTeamExternalId, federationId } }),
    ]);
    if (!homeTeam || !awayTeam) {
      counts.skipped++;
      throw new Error(
        `Match ${dto.externalId} skipped: missing team ` +
        `(home=${dto.homeTeamExternalId} found=${!!homeTeam}, ` +
        `away=${dto.awayTeamExternalId} found=${!!awayTeam})`,
      );
    }

    let venueId: string | null = null;
    if (dto.venueExternalId) {
      const venue = await FederationVenue.findOne({
        where: { externalId: dto.venueExternalId, federationId },
      });
      venueId = venue?.id ?? null;
    }

    let matchdayId: string | null = null;
    let poolId: string | null = null;
    if (dto.poolExternalId) {
      const pool = await FederationPool.findOne({
        where: { externalId: dto.poolExternalId, federationId },
      });
      poolId = pool?.id ?? null;
      if (pool && dto.matchdayNumber !== undefined) {
        const md = await FederationMatchday.findOne({
          where: { poolId: pool.id, number: dto.matchdayNumber },
        });
        matchdayId = md?.id ?? null;
      }
    }

    // Upsert du match
    const existing = await FederationMatch.findOne({
      where: { externalId: dto.externalId, federationId },
    });
    const payload = {
      matchdayId,
      poolId,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      dateUtc: dto.dateUtc,
      status: dto.status,
      scoreHome: dto.scoreHome ?? null,
      scoreAway: dto.scoreAway ?? null,
      venueId,
      forfeitSide: dto.forfeitSide ?? null,
      sourceUrl: dto.sourceUrl,
      lastScrapedAt: new Date().toISOString(),
      lastScrapeRunId: scrapeRunId,
    };

    let match: FederationMatch;
    let wasCreated = false;
    let wasUpdated = false;
    if (existing) {
      await existing.update(payload);
      match = existing;
      wasUpdated = true;
      counts.updated++;
    } else {
      match = await FederationMatch.create({
        externalId: dto.externalId, federationId, isManual: false, ...payload,
      });
      wasCreated = true;
      counts.inserted++;
    }

    // Extension handball (match)
    const federation = await Federation.findByPk(federationId);
    if (federation?.sport === SportType.HANDBALL && dto.handball) {
      const existingHb = await FederationMatchHandball.findByPk(match.id);
      const hbPayload = {
        scoreHalfHome: dto.handball.scoreHalfHome ?? null,
        scoreHalfAway: dto.handball.scoreHalfAway ?? null,
        hasExtraTime: dto.handball.hasExtraTime ?? false,
        scoreExtraHome: dto.handball.scoreExtraHome ?? null,
        scoreExtraAway: dto.handball.scoreExtraAway ?? null,
        hasShootout: dto.handball.hasShootout ?? false,
        scoreShootoutHome: dto.handball.scoreShootoutHome ?? null,
        scoreShootoutAway: dto.handball.scoreShootoutAway ?? null,
        matchDurationMinutes: dto.handball.matchDurationMinutes,
      };
      if (existingHb) {
        await existingHb.update(hbPayload);
      } else {
        await FederationMatchHandball.create({ matchId: match.id, ...hbPayload });
      }
    }

    // Lineup
    if (dto.lineup?.length) {
      // Remplacement complet : suppression puis insertion
      await FederationMatchLineup.destroy({ where: { matchId: match.id } });
      for (const item of dto.lineup) {
        await this.insertLineupRow(match.id, item, federationId, scrapeRunId, counts);
      }
    }

    // Events
    if (dto.events?.length) {
      await FederationMatchEvent.destroy({ where: { matchId: match.id } });
      for (const event of dto.events) {
        await this.insertEventRow(match.id, event, federationId, scrapeRunId, counts);
      }
    }

    // Stats
    if (dto.stats?.length) {
      await FederationPlayerMatchStats.destroy({ where: { matchId: match.id } });
      for (const stat of dto.stats) {
        await this.insertStatRow(
          match.id, stat, federationId, scrapeRunId, counts,
          federation?.sport === SportType.HANDBALL,
        );
      }
    }

    return { entity: match, wasCreated, wasUpdated, counts };
  }

  private static async insertLineupRow(
    matchId: string,
    item: FederationMatchLineupDTO,
    federationId: string,
    scrapeRunId: string,
    counts: MatchUpsertCounts,
  ): Promise<void> {
    const player = await FederationPlayer.findOne({
      where: { externalId: item.playerExternalId, federationId },
    });
    if (!player) { counts.skipped++; return; }
    await FederationMatchLineup.create({
      matchId,
      playerId: player.id,
      side: item.side,
      starter: item.starter,
      jerseyNumber: item.jerseyNumber ?? null,
      position: item.position ?? null,
      isCaptain: item.isCaptain ?? false,
      lastScrapedAt: new Date().toISOString(),
      lastScrapeRunId: scrapeRunId,
    });
    counts.inserted++;
  }

  private static async insertEventRow(
    matchId: string,
    event: FederationMatchEventDTO,
    federationId: string,
    scrapeRunId: string,
    counts: MatchUpsertCounts,
  ): Promise<void> {
    let playerId: string | null = null;
    if (event.playerExternalId) {
      const p = await FederationPlayer.findOne({
        where: { externalId: event.playerExternalId, federationId },
      });
      playerId = p?.id ?? null;
    }
    let relatedPlayerId: string | null = null;
    if (event.relatedPlayerExternalId) {
      const p = await FederationPlayer.findOne({
        where: { externalId: event.relatedPlayerExternalId, federationId },
      });
      relatedPlayerId = p?.id ?? null;
    }
    await FederationMatchEvent.create({
      matchId,
      minute: event.minute,
      second: event.second ?? null,
      side: event.side,
      type: event.type,
      subtype: event.subtype ?? null,
      playerId,
      relatedPlayerId,
      details: event.details ?? null,
      lastScrapedAt: new Date().toISOString(),
      lastScrapeRunId: scrapeRunId,
    });
    counts.inserted++;
  }

  private static async insertStatRow(
    matchId: string,
    stat: FederationPlayerMatchStatsDTO,
    federationId: string,
    scrapeRunId: string,
    counts: MatchUpsertCounts,
    isHandball: boolean,
  ): Promise<void> {
    const player = await FederationPlayer.findOne({
      where: { externalId: stat.playerExternalId, federationId },
    });
    if (!player) { counts.skipped++; return; }

    const core = await FederationPlayerMatchStats.create({
      matchId,
      playerId: player.id,
      side: stat.side,
      minutesPlayed: stat.minutesPlayed ?? null,
      goals: stat.goals,
      assists: stat.assists,
      saves: stat.saves ?? null,
      lastScrapedAt: new Date().toISOString(),
      lastScrapeRunId: scrapeRunId,
    });
    counts.inserted++;

    if (isHandball && stat.handball) {
      await FederationPlayerMatchStatsHandball.create({
        matchStatsId: core.id,
        shotsAttempted6m: stat.handball.shotsAttempted6m ?? 0,
        shotsMade6m: stat.handball.shotsMade6m ?? 0,
        shotsAttempted7m: stat.handball.shotsAttempted7m ?? 0,
        shotsMade7m: stat.handball.shotsMade7m ?? 0,
        shotsAttempted9m: stat.handball.shotsAttempted9m ?? 0,
        shotsMade9m: stat.handball.shotsMade9m ?? 0,
        shotsAttemptedWing: stat.handball.shotsAttemptedWing ?? 0,
        shotsMadeWing: stat.handball.shotsMadeWing ?? 0,
        shotsAttemptedFastbreak: stat.handball.shotsAttemptedFastbreak ?? 0,
        shotsMadeFastbreak: stat.handball.shotsMadeFastbreak ?? 0,
        savesTotal: stat.handball.savesTotal ?? null,
        savesByZone: stat.handball.savesByZone ?? null,
        twoMinutesCount: stat.handball.twoMinutesCount ?? 0,
        yellowCard: stat.handball.yellowCard ?? false,
        redCard: stat.handball.redCard ?? false,
        blueCard: stat.handball.blueCard ?? false,
        disqualified: stat.handball.disqualified ?? false,
        assists: stat.handball.assists ?? 0,
        technicalFaults: stat.handball.technicalFaults ?? 0,
        steals: stat.handball.steals ?? 0,
      });
    }
  }
}
```

- [ ] **Step 2: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 10 : `PoolStandingMapper`

**Files:**
- Create: `apps/api-titan/src/modules/scraping/core/mappers/pool-standing.mapper.ts`

- [ ] **Step 1: Créer le mapper**

```ts
import { FederationPoolStandingDTO } from 'titan_core';
import {
  FederationPoolStanding, FederationPool, FederationTeam,
} from '../../../../database';

export class PoolStandingMapper {
  /**
   * Le classement est snapshoté : à chaque scrap, on **ajoute** une nouvelle ligne plutôt que de remplacer.
   * L'historique est conservé.
   */
  static async insertSnapshot(
    standings: FederationPoolStandingDTO[],
    federationId: string,
    scrapeRunId: string,
  ): Promise<{ inserted: number; skipped: number }> {
    let inserted = 0;
    let skipped = 0;
    const scrapedAt = new Date().toISOString();

    for (const standing of standings) {
      const pool = await FederationPool.findOne({
        where: { externalId: standing.poolExternalId, federationId },
      });
      const team = await FederationTeam.findOne({
        where: { externalId: standing.teamExternalId, federationId },
      });
      if (!pool || !team) { skipped++; continue; }

      await FederationPoolStanding.create({
        poolId: pool.id,
        teamId: team.id,
        rank: standing.rank,
        played: standing.played,
        won: standing.won,
        drawn: standing.drawn,
        lost: standing.lost,
        goalsFor: standing.goalsFor,
        goalsAgainst: standing.goalsAgainst,
        goalDifference: standing.goalDifference,
        points: standing.points,
        penaltyPoints: standing.penaltyPoints ?? 0,
        scrapedAt: standing.scrapedAt ?? scrapedAt,
        lastScrapeRunId: scrapeRunId,
      });
      inserted++;
    }
    return { inserted, skipped };
  }
}
```

- [ ] **Step 2: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 11 : `TeamMapper` (utilisé par PlayerMapper et MatchMapper)

**Files:**
- Create: `apps/api-titan/src/modules/scraping/core/mappers/team.mapper.ts`

- [ ] **Step 1: Créer le mapper**

> Pas de DTO dédié dans Plan 3 Task 2 (les équipes sont scrapées en lazy via les compétitions et les matchs). On utilise un DTO inline ici, à enrichir si nécessaire.

```ts
import { FederationTeam, FederationClub, FederationSeason } from '../../../../database';
import { FederationGender } from 'titan_core';
import { MapperResult } from './club.mapper';

export interface FederationTeamScrapedDTO {
  externalId: string;
  clubExternalId: string;
  seasonExternalId: string;
  name: string;
  category: string;
  genderSection: FederationGender;
  level?: string;
  sourceUrl: string;
}

export class TeamMapper {
  static async upsert(
    dto: FederationTeamScrapedDTO,
    federationId: string,
    scrapeRunId: string,
  ): Promise<MapperResult<FederationTeam> | null> {
    const [club, season] = await Promise.all([
      FederationClub.findOne({ where: { externalId: dto.clubExternalId, federationId } }),
      FederationSeason.findOne({ where: { externalId: dto.seasonExternalId, federationId } }),
    ]);
    if (!club || !season) return null;

    const existing = await FederationTeam.findOne({
      where: { externalId: dto.externalId, federationId },
    });
    const payload = {
      clubId: club.id,
      seasonId: season.id,
      name: dto.name,
      category: dto.category,
      genderSection: dto.genderSection,
      level: dto.level ?? null,
      sourceUrl: dto.sourceUrl,
      lastScrapedAt: new Date().toISOString(),
      lastScrapeRunId: scrapeRunId,
    };

    if (existing) {
      await existing.update(payload);
      return { entity: existing, wasCreated: false, wasUpdated: true };
    }
    const created = await FederationTeam.create({
      externalId: dto.externalId, federationId, isManual: false, ...payload,
    });
    return { entity: created, wasCreated: true, wasUpdated: false };
  }
}
```

- [ ] **Step 2: Type-check + index export**

Créer `apps/api-titan/src/modules/scraping/core/mappers/index.ts` :

```ts
export * from './club.mapper';
export * from './player.mapper';
export * from './season.mapper';
export * from './venue.mapper';
export * from './competition.mapper';
export * from './match.mapper';
export * from './pool-standing.mapper';
export * from './team.mapper';
```

Type-check :
```bash
cd apps/api-titan && pnpm run tsc
```

---

## Phase C — Conflict resolver

### Task 12 : Service `ConflictResolver`

**Files:**
- Create: `apps/api-titan/src/modules/scraping/core/conflict-resolver.ts`

- [ ] **Step 1: Créer le service**

```ts
import { Service } from '../../../core';

export interface FieldChange {
  field: string;
  before: unknown;
  after: unknown;
}

export interface ConflictDetectionOptions {
  /** Champs critiques où un changement post-finalisation est suspect. */
  criticalFields: string[];
  /** Statut de l'entité actuelle (e.g. 'finished' pour un match). */
  currentStatus?: string;
  /** Liste des statuts considérés comme "verrouillés". */
  lockedStatuses?: string[];
}

class ConflictResolver extends Service {
  /**
   * Détecte les changements problématiques entre un état persisté et un nouveau scrap.
   * Ne bloque pas l'écrasement — log seulement.
   */
  detectChanges(
    existing: Record<string, unknown>,
    incoming: Record<string, unknown>,
    options: ConflictDetectionOptions,
  ): FieldChange[] {
    const changes: FieldChange[] = [];

    const isLocked =
      options.lockedStatuses &&
      options.currentStatus &&
      options.lockedStatuses.includes(options.currentStatus);

    for (const field of options.criticalFields) {
      const before = existing[field];
      const after = incoming[field];
      if (before === after) continue;
      // Normaliser null/undefined
      if (before == null && after == null) continue;
      changes.push({ field, before, after });
    }

    if (changes.length > 0 && isLocked) {
      this.logger.warn(
        `Conflict detected on locked entity (status=${options.currentStatus}): ` +
        JSON.stringify(changes),
      );
    }

    return changes;
  }
}

export default new ConflictResolver();
```

- [ ] **Step 2: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

## Phase D — Connecteur FFHB

### Task 13 : HTTP client FFHB (axios + retry + rate-limit)

**Files:**
- Create: `apps/api-titan/src/modules/scraping/ffhb/ffhb-client.ts`

- [ ] **Step 1: Vérifier la dispo des dépendances**

`axios` est déjà installé (dans `apps/api-titan/package.json`).

Pour le rate-limit/retry, on utilise les fonctionnalités natives d'axios + un délai manuel. Pas de nouvelle dépendance pour cette première implémentation.

- [ ] **Step 2: Créer le client**

```ts
import axios, { AxiosInstance, AxiosError } from 'axios';

export interface FFHBClientOptions {
  baseURL: string;
  /** Délai minimum entre 2 requêtes (ms). Par défaut 1500ms (FFHB rate-limit prudent). */
  minIntervalMs?: number;
  /** Nombre de retries en cas d'échec réseau. Par défaut 3. */
  maxRetries?: number;
  /** Délai initial avant retry (ms), doublé à chaque tentative. Par défaut 2000ms. */
  initialBackoffMs?: number;
}

export class FFHBClient {
  private readonly axios: AxiosInstance;
  private readonly minIntervalMs: number;
  private readonly maxRetries: number;
  private readonly initialBackoffMs: number;
  private lastRequestAt = 0;

  constructor(options: FFHBClientOptions) {
    this.minIntervalMs = options.minIntervalMs ?? 1500;
    this.maxRetries = options.maxRetries ?? 3;
    this.initialBackoffMs = options.initialBackoffMs ?? 2000;
    this.axios = axios.create({
      baseURL: options.baseURL,
      timeout: 30000,
      headers: {
        'User-Agent': 'TitanScraper/1.0 (+https://titan.app)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
  }

  /** GET avec rate-limit + retry. Retourne le HTML brut. */
  async get(url: string): Promise<string> {
    await this.waitForRateLimit();

    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.axios.get(url, { responseType: 'text' });
        this.lastRequestAt = Date.now();
        return response.data as string;
      } catch (err) {
        lastError = err as Error;
        const axiosErr = err as AxiosError;
        const status = axiosErr.response?.status;
        // Ne pas retry les 4xx (sauf 429)
        if (status && status >= 400 && status < 500 && status !== 429) {
          throw err;
        }
        if (attempt < this.maxRetries) {
          const backoff = this.initialBackoffMs * Math.pow(2, attempt);
          await this.sleep(backoff);
        }
      }
    }
    throw lastError ?? new Error('FFHB GET failed without error');
  }

  private async waitForRateLimit(): Promise<void> {
    const elapsed = Date.now() - this.lastRequestAt;
    if (elapsed < this.minIntervalMs) {
      await this.sleep(this.minIntervalMs - elapsed);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

- [ ] **Step 3: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 14 : URLs constantes FFHB

**Files:**
- Create: `apps/api-titan/src/modules/scraping/ffhb/ffhb-urls.ts`

> Les chemins exacts doivent être confirmés par observation du site FFHB. Cette tâche pose la structure ; les vraies URLs seront affinées en Task 15.

- [ ] **Step 1: Créer le fichier (URLs initiales à confirmer)**

```ts
export const FFHB_BASE_URL = 'https://www.ffhandball.fr';

/**
 * IMPORTANT — Les URLs exactes doivent être validées par observation du site réel.
 * Les valeurs ci-dessous sont des hypothèses raisonnables, à ajuster lors du Task 15.
 */
export const FFHB_URLS = {
  /** Page d'accueil compétitions (point d'entrée pour découvrir les saisons et compétitions). */
  competitions: '/competitions',

  /** Page d'une compétition donnée. {0} = code compétition externe. */
  competition: (externalId: string): string => `/competitions/${externalId}`,

  /** Page d'une poule. */
  pool: (externalId: string): string => `/competitions/poule/${externalId}`,

  /** Page d'un match (feuille de match + stats). */
  match: (externalId: string): string => `/competitions/match/${externalId}`,

  /** Page d'un club. */
  club: (externalId: string): string => `/clubs/${externalId}`,

  /** Page d'un licencié (rarement publique — souvent restreint). */
  player: (externalId: string): string => `/licencies/${externalId}`,
};
```

---

### Task 15 : Exploration manuelle de la structure HTML FFHB

**Files:** (aucun changement de code — investigation)

> Cette tâche **doit être exécutée par un humain ou un agent disposant de `WebFetch`**. Elle informe les sélecteurs CSS utilisés en Tasks 16-21.

- [ ] **Step 1: Visiter la page d'une compétition réelle**

URL exemple : `https://www.ffhandball.fr/competitions/...` (à confirmer une fois sur le site).

Identifier :
- Le sélecteur CSS du nom de la compétition.
- Le sélecteur de la liste des phases/poules.
- Le format des liens vers les poules (pour extraire `externalId`).

- [ ] **Step 2: Visiter une page de poule**

Identifier :
- Le sélecteur de la liste des équipes inscrites.
- Le sélecteur du calendrier (matchs par journée).
- Le sélecteur du classement.

- [ ] **Step 3: Visiter une page de match**

Identifier :
- Le sélecteur du score, mi-temps.
- Le sélecteur de la composition (lineup) home/away.
- Le sélecteur des événements timés (buts, sanctions).
- Le sélecteur des stats individuelles (si présentes).

- [ ] **Step 4: Visiter une page de club**

Identifier :
- Le sélecteur du nom, logo, adresse.
- Le sélecteur de la liste des équipes du club.

- [ ] **Step 5: Documenter les sélecteurs trouvés**

Mettre à jour `ffhb-urls.ts` avec les URLs réelles confirmées. Créer un fichier de notes dans le module :

```bash
touch apps/api-titan/src/modules/scraping/ffhb/SELECTORS.md
```

Y consigner toutes les observations (selectors CSS, format d'IDs, particularités).

- [ ] **Step 6: Vérifier la dispo de `cheerio` comme parser HTML**

```bash
cd apps/api-titan && grep cheerio package.json
```

Si absent, l'ajouter :
```bash
cd apps/api-titan && pnpm add cheerio && pnpm add -D @types/cheerio
```

---

### Task 16 : Parser FFHB (squelette + utilitaires)

**Files:**
- Create: `apps/api-titan/src/modules/scraping/ffhb/ffhb-parser.ts`

- [ ] **Step 1: Créer le parser squelette**

```ts
import * as cheerio from 'cheerio';

export class FFHBParser {
  /** Parse une chaîne HTML et retourne l'instance cheerio. */
  static load(html: string): cheerio.CheerioAPI {
    return cheerio.load(html);
  }

  /** Helper : extrait du texte trimmé d'un selector, ou null. */
  static text($: cheerio.CheerioAPI, selector: string): string | null {
    const value = $(selector).first().text().trim();
    return value.length > 0 ? value : null;
  }

  /** Helper : extrait un attribut d'un selector, ou null. */
  static attr(
    $: cheerio.CheerioAPI,
    selector: string,
    attribute: string,
  ): string | null {
    const value = $(selector).first().attr(attribute);
    return value && value.length > 0 ? value : null;
  }

  /**
   * Extrait l'externalId depuis une URL FFHB.
   * Ex: '/competitions/match/12345' → '12345'
   */
  static extractIdFromUrl(url: string, prefix: string): string | null {
    const match = url.match(new RegExp(`${prefix}/([^/?#]+)`));
    return match?.[1] ?? null;
  }

  /** Parse un score "27-29" → { home: 27, away: 29 }. Retourne null si non parsable. */
  static parseScore(text: string | null): { home: number; away: number } | null {
    if (!text) return null;
    const match = text.match(/(\d+)\s*[-–:]\s*(\d+)/);
    if (!match) return null;
    return { home: parseInt(match[1], 10), away: parseInt(match[2], 10) };
  }

  /**
   * Parse une date FR ("15/03/2025 20:30") → ISO UTC.
   * Heure locale assumée en Europe/Paris.
   */
  static parseDateFR(text: string | null): string | null {
    if (!text) return null;
    const match = text.match(/(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
    if (!match) return null;
    const [, dd, mm, yyyy, hh = '00', min = '00'] = match;
    // Conversion approximative en UTC (Europe/Paris = UTC+1 ou +2 selon saison).
    // Pour précision, utiliser dayjs avec timezone plus tard.
    const iso = `${yyyy}-${mm}-${dd}T${hh}:${min}:00+01:00`;
    return new Date(iso).toISOString();
  }
}
```

- [ ] **Step 2: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 17 : Mapper HTML → DTO : `club.mapper.ts` (ffhb-mappers)

**Files:**
- Create: `apps/api-titan/src/modules/scraping/ffhb/ffhb-mappers/club.mapper.ts`

> Sélecteurs CSS à confirmer en Task 15. Les lignes `$('selector-here')` sont à compléter à partir des notes de SELECTORS.md.

- [ ] **Step 1: Créer le fichier**

```ts
import { FederationClubDTO } from 'titan_core';
import { FFHBParser } from '../ffhb-parser';
import { FFHB_URLS, FFHB_BASE_URL } from '../ffhb-urls';

export class FFHBClubMapper {
  /**
   * Parse une page club FFHB en FederationClubDTO.
   * SÉLECTEURS À CONFIRMER après observation (cf. SELECTORS.md).
   */
  static fromHtml(html: string, externalId: string): FederationClubDTO {
    const $ = FFHBParser.load(html);

    const name = FFHBParser.text($, '.club-name, h1.title') ?? `Club ${externalId}`;
    const shortName = FFHBParser.text($, '.club-short-name');
    const city = FFHBParser.text($, '.club-city, .club-address .city');
    const logoUrl = FFHBParser.attr($, '.club-logo img', 'src');
    const website = FFHBParser.attr($, 'a.club-website', 'href');
    const phone = FFHBParser.text($, '.club-phone');
    const email = FFHBParser.attr($, 'a.club-email', 'href')?.replace(/^mailto:/, '');
    const foundingYearText = FFHBParser.text($, '.club-founding-year');
    const foundingYear = foundingYearText ? parseInt(foundingYearText, 10) : undefined;

    return {
      externalId,
      name,
      shortName: shortName ?? undefined,
      city: city ?? undefined,
      logoUrl: logoUrl ?? undefined,
      website: website ?? undefined,
      phone: phone ?? undefined,
      email: email ?? undefined,
      foundingYear: Number.isFinite(foundingYear) ? foundingYear : undefined,
      sourceUrl: `${FFHB_BASE_URL}${FFHB_URLS.club(externalId)}`,
    };
  }
}
```

- [ ] **Step 2: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 18 : Mapper HTML → DTO : `player.mapper.ts`, `competition.mapper.ts`, `match.mapper.ts`, `pool-standings.mapper.ts`

**Files:**
- Create: `apps/api-titan/src/modules/scraping/ffhb/ffhb-mappers/player.mapper.ts`
- Create: `apps/api-titan/src/modules/scraping/ffhb/ffhb-mappers/competition.mapper.ts`
- Create: `apps/api-titan/src/modules/scraping/ffhb/ffhb-mappers/match.mapper.ts`
- Create: `apps/api-titan/src/modules/scraping/ffhb/ffhb-mappers/pool-standings.mapper.ts`
- Create: `apps/api-titan/src/modules/scraping/ffhb/ffhb-mappers/index.ts`

> Pour chaque mapper, la **structure et signature** sont précisées ci-dessous. **Les sélecteurs CSS internes seront affinés** après l'observation HTML de Task 15. À l'écriture initiale, on met les sélecteurs hypothétiques (préfixe `.fhb-…`) qui seront corrigés ensuite.

- [ ] **Step 1: Créer `player.mapper.ts`**

```ts
import { FederationPlayerDTO, FederationGender } from 'titan_core';
import { FFHBParser } from '../ffhb-parser';
import { FFHB_URLS, FFHB_BASE_URL } from '../ffhb-urls';

export class FFHBPlayerMapper {
  static fromHtml(html: string, externalId: string): FederationPlayerDTO {
    const $ = FFHBParser.load(html);

    const firstName = FFHBParser.text($, '.player-firstname, .firstname') ?? '';
    const lastName = FFHBParser.text($, '.player-lastname, .lastname') ?? '';
    const licenseNumber = FFHBParser.text($, '.player-license, .license-number');
    const birthDateText = FFHBParser.text($, '.player-birthdate');
    const birthDate = birthDateText
      ? FFHBParser.parseDateFR(birthDateText)?.split('T')[0]
      : undefined;
    const genderText = FFHBParser.text($, '.player-gender');
    const gender =
      genderText?.toLowerCase().startsWith('f') ? FederationGender.FEMALE
        : genderText?.toLowerCase().startsWith('m') ? FederationGender.MALE
        : undefined;
    const photoUrl = FFHBParser.attr($, '.player-photo img', 'src');
    const nationality = FFHBParser.text($, '.player-nationality');

    return {
      externalId,
      licenseNumber: licenseNumber ?? undefined,
      firstName,
      lastName,
      birthDate,
      gender,
      photoUrl: photoUrl ?? undefined,
      nationality: nationality ?? undefined,
      sourceUrl: `${FFHB_BASE_URL}${FFHB_URLS.player(externalId)}`,
    };
  }
}
```

- [ ] **Step 2: Créer `competition.mapper.ts`**

```ts
import {
  FederationCompetitionTreeDTO, SportType,
  FederationCompetitionType, FederationGender,
} from 'titan_core';
import { FFHBParser } from '../ffhb-parser';
import { FFHB_URLS, FFHB_BASE_URL } from '../ffhb-urls';

export class FFHBCompetitionMapper {
  /**
   * Parse une page compétition (arbre complet : phases + pools + matchdays).
   * Les équipes inscrites par poule sont récupérées via teamExternalIds.
   * Si la compétition est très détaillée, certaines parties peuvent nécessiter
   * des fetchs supplémentaires (cf. ffhb-scraper.service.ts).
   */
  static fromHtml(
    html: string,
    externalId: string,
    seasonExternalId: string,
  ): FederationCompetitionTreeDTO {
    const $ = FFHBParser.load(html);

    const name = FFHBParser.text($, '.competition-name, h1') ?? `Compétition ${externalId}`;
    const level = FFHBParser.text($, '.competition-level') ?? 'unknown';

    // Type (championnat/coupe/tournoi) — déduit du nom si pas explicite
    const lowerName = name.toLowerCase();
    let type = FederationCompetitionType.CHAMPIONSHIP;
    if (lowerName.includes('coupe')) type = FederationCompetitionType.CUP;
    else if (lowerName.includes('tournoi')) type = FederationCompetitionType.TOURNAMENT;
    else if (lowerName.includes('play-off') || lowerName.includes('play off')) {
      type = FederationCompetitionType.PLAY_OFF;
    }

    // Genre déduit du nom
    let gender = FederationGender.MIXED;
    if (/masculin/i.test(name)) gender = FederationGender.MALE;
    else if (/feminin|féminin/i.test(name)) gender = FederationGender.FEMALE;

    const category = FFHBParser.text($, '.competition-category') ?? 'Seniors';

    // Phases + pools — sélecteurs à confirmer
    const phases: FederationCompetitionTreeDTO['phases'] = [];
    $('.phase-block').each((phaseIndex, phaseEl) => {
      const phaseName = $(phaseEl).find('.phase-name').text().trim() || `Phase ${phaseIndex + 1}`;
      const pools: FederationCompetitionTreeDTO['phases'][number]['pools'] = [];

      $(phaseEl).find('.pool-block').each((_, poolEl) => {
        const poolHref = $(poolEl).find('a.pool-link').attr('href') ?? '';
        const poolExternalId = FFHBParser.extractIdFromUrl(poolHref, '/competitions/poule') ?? `unknown-${poolHref}`;
        const poolName = $(poolEl).find('.pool-name').text().trim() || `Poule ${poolExternalId}`;
        const teamExternalIds: string[] = [];
        $(poolEl).find('.team-link').each((_, teamEl) => {
          const teamHref = $(teamEl).attr('href') ?? '';
          const teamId = FFHBParser.extractIdFromUrl(teamHref, '/equipes');
          if (teamId) teamExternalIds.push(teamId);
        });

        const matchdays: FederationCompetitionTreeDTO['phases'][number]['pools'][number]['matchdays'] = [];
        $(poolEl).find('.matchday-row').each((_, mdEl) => {
          const mdNumberText = $(mdEl).find('.matchday-number').text().trim();
          const mdNumber = parseInt(mdNumberText, 10);
          if (!Number.isFinite(mdNumber)) return;
          const mdLabel = $(mdEl).find('.matchday-label').text().trim() || undefined;
          const mdDateText = $(mdEl).find('.matchday-date').text().trim();
          const mdDate = mdDateText ? FFHBParser.parseDateFR(mdDateText)?.split('T')[0] : undefined;
          matchdays.push({ number: mdNumber, label: mdLabel, plannedDate: mdDate });
        });

        pools.push({
          pool: { externalId: poolExternalId, name: poolName, teamExternalIds },
          matchdays,
        });
      });

      phases.push({
        phase: { name: phaseName, order: phaseIndex + 1 },
        pools,
      });
    });

    return {
      competition: {
        externalId,
        sport: SportType.HANDBALL,
        seasonExternalId,
        name,
        level,
        type,
        gender,
        category,
        sourceUrl: `${FFHB_BASE_URL}${FFHB_URLS.competition(externalId)}`,
      },
      phases,
    };
  }
}
```

- [ ] **Step 3: Créer `match.mapper.ts`**

```ts
import {
  FederationMatchDTO, FederationMatchStatus, MatchSide,
  FederationMatchEventType,
} from 'titan_core';
import { FFHBParser } from '../ffhb-parser';
import { FFHB_URLS, FFHB_BASE_URL } from '../ffhb-urls';

export class FFHBMatchMapper {
  /**
   * Parse une feuille de match FFHB.
   * Inclut : score, mi-temps, lineup, events, stats si présents.
   * Les sélecteurs sont indicatifs — à confirmer après observation HTML réelle.
   */
  static fromHtml(html: string, externalId: string): FederationMatchDTO {
    const $ = FFHBParser.load(html);

    const homeTeamHref = $('.match-home-team a').first().attr('href') ?? '';
    const awayTeamHref = $('.match-away-team a').first().attr('href') ?? '';
    const homeTeamExternalId = FFHBParser.extractIdFromUrl(homeTeamHref, '/equipes') ?? 'unknown';
    const awayTeamExternalId = FFHBParser.extractIdFromUrl(awayTeamHref, '/equipes') ?? 'unknown';

    const dateText = FFHBParser.text($, '.match-date');
    const dateUtc = FFHBParser.parseDateFR(dateText) ?? new Date().toISOString();

    const scoreText = FFHBParser.text($, '.match-score');
    const score = FFHBParser.parseScore(scoreText);

    const halfScoreText = FFHBParser.text($, '.match-half-score');
    const halfScore = FFHBParser.parseScore(halfScoreText);

    // Statut déduit
    let status = FederationMatchStatus.SCHEDULED;
    if (score) status = FederationMatchStatus.FINISHED;
    if ($('.match-postponed').length > 0) status = FederationMatchStatus.POSTPONED;
    if ($('.match-cancelled').length > 0) status = FederationMatchStatus.CANCELLED;

    const venueExternalId = FFHBParser.attr($, '.match-venue a', 'href')
      ? FFHBParser.extractIdFromUrl(
          FFHBParser.attr($, '.match-venue a', 'href') ?? '',
          '/gymnases',
        ) ?? undefined
      : undefined;

    // Lineup
    const lineup: FederationMatchDTO['lineup'] = [];
    $('.lineup-row').each((_, row) => {
      const sideAttr = $(row).attr('data-side');
      const side = sideAttr === 'away' ? MatchSide.AWAY : MatchSide.HOME;
      const playerHref = $(row).find('a.player-link').attr('href') ?? '';
      const playerExternalId = FFHBParser.extractIdFromUrl(playerHref, '/licencies');
      if (!playerExternalId) return;
      const jerseyText = $(row).find('.jersey-number').text().trim();
      const jerseyNumber = parseInt(jerseyText, 10);
      const starter = $(row).hasClass('starter');
      const isCaptain = $(row).find('.captain-badge').length > 0;
      const position = $(row).find('.position').text().trim() || undefined;
      lineup.push({
        playerExternalId, side, starter,
        jerseyNumber: Number.isFinite(jerseyNumber) ? jerseyNumber : undefined,
        position, isCaptain,
      });
    });

    // Events
    const events: FederationMatchDTO['events'] = [];
    $('.event-row').each((_, row) => {
      const minuteText = $(row).find('.event-minute').text().trim();
      const minute = parseInt(minuteText, 10);
      if (!Number.isFinite(minute)) return;
      const typeText = ($(row).attr('data-type') ?? '').toLowerCase();
      let type = FederationMatchEventType.OTHER;
      if (typeText.includes('goal') || typeText.includes('but')) type = FederationMatchEventType.GOAL;
      else if (typeText.includes('sanction')) type = FederationMatchEventType.SANCTION;
      else if (typeText.includes('save')) type = FederationMatchEventType.SAVE;
      else if (typeText.includes('substitution')) type = FederationMatchEventType.SUBSTITUTION;
      else if (typeText.includes('timeout')) type = FederationMatchEventType.TIMEOUT;
      const subtype = $(row).attr('data-subtype') ?? undefined;
      const sideAttr = $(row).attr('data-side');
      const side = sideAttr === 'away' ? MatchSide.AWAY : MatchSide.HOME;
      const playerHref = $(row).find('a.player-link').attr('href') ?? '';
      const playerExternalId = FFHBParser.extractIdFromUrl(playerHref, '/licencies') ?? undefined;
      events.push({ minute, side, type, subtype, playerExternalId });
    });

    return {
      externalId,
      homeTeamExternalId,
      awayTeamExternalId,
      dateUtc,
      status,
      scoreHome: score?.home,
      scoreAway: score?.away,
      venueExternalId,
      lineup: lineup.length > 0 ? lineup : undefined,
      events: events.length > 0 ? events : undefined,
      handball: status === FederationMatchStatus.FINISHED ? {
        scoreHalfHome: halfScore?.home,
        scoreHalfAway: halfScore?.away,
        matchDurationMinutes: 60,
      } : undefined,
      sourceUrl: `${FFHB_BASE_URL}${FFHB_URLS.match(externalId)}`,
    };
  }
}
```

- [ ] **Step 4: Créer `pool-standings.mapper.ts`**

```ts
import { FederationPoolStandingDTO } from 'titan_core';
import { FFHBParser } from '../ffhb-parser';
import { FFHB_URLS, FFHB_BASE_URL } from '../ffhb-urls';

export class FFHBPoolStandingsMapper {
  /**
   * Parse le tableau de classement d'une poule.
   */
  static fromHtml(html: string, poolExternalId: string): FederationPoolStandingDTO[] {
    const $ = FFHBParser.load(html);
    const standings: FederationPoolStandingDTO[] = [];
    const scrapedAt = new Date().toISOString();
    const sourceUrl = `${FFHB_BASE_URL}${FFHB_URLS.pool(poolExternalId)}`;

    $('.standings-row').each((_, row) => {
      const rankText = $(row).find('.rank').text().trim();
      const rank = parseInt(rankText, 10);
      if (!Number.isFinite(rank)) return;
      const teamHref = $(row).find('a.team-link').attr('href') ?? '';
      const teamExternalId = FFHBParser.extractIdFromUrl(teamHref, '/equipes');
      if (!teamExternalId) return;

      const intOr = (sel: string, fallback = 0): number => {
        const n = parseInt($(row).find(sel).text().trim(), 10);
        return Number.isFinite(n) ? n : fallback;
      };

      const played = intOr('.played');
      const won = intOr('.won');
      const drawn = intOr('.drawn');
      const lost = intOr('.lost');
      const goalsFor = intOr('.goals-for');
      const goalsAgainst = intOr('.goals-against');
      const goalDifference = intOr('.goal-difference', goalsFor - goalsAgainst);
      const points = intOr('.points');
      const penaltyPoints = intOr('.penalty-points', 0);

      standings.push({
        poolExternalId, teamExternalId, rank, played, won, drawn, lost,
        goalsFor, goalsAgainst, goalDifference, points, penaltyPoints,
        scrapedAt, sourceUrl,
      });
    });

    return standings;
  }
}
```

- [ ] **Step 5: Créer l'index**

`apps/api-titan/src/modules/scraping/ffhb/ffhb-mappers/index.ts` :

```ts
export * from './club.mapper';
export * from './player.mapper';
export * from './competition.mapper';
export * from './match.mapper';
export * from './pool-standings.mapper';
```

- [ ] **Step 6: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 19 : Service `FFHBScraperService` (implémente `FederationScraper`)

**Files:**
- Create: `apps/api-titan/src/modules/scraping/ffhb/ffhb-scraper.service.ts`

- [ ] **Step 1: Créer le service**

```ts
import createError from 'http-errors';
import {
  ScrapeResult, ScrapeRunStatus, ScrapeRunTrigger,
  FederationClubDTO, FederationPlayerDTO,
  FederationCompetitionTreeDTO, FederationMatchDTO,
  FederationPoolStandingDTO, FederationSeasonDTO, SportType,
} from 'titan_core';
import { Federation, FederationClub } from '../../../database';
import { Service } from '../../../core';
import { FederationScraper, ScrapeCompetitionOptions } from '../core/federation-scraper.interface';
import scrapeRunService from '../core/scrape-run.service';
import { ClubMapper } from '../core/mappers/club.mapper';
import { PlayerMapper } from '../core/mappers/player.mapper';
import { CompetitionMapper } from '../core/mappers/competition.mapper';
import { MatchMapper } from '../core/mappers/match.mapper';
import { PoolStandingMapper } from '../core/mappers/pool-standing.mapper';
import { SeasonMapper } from '../core/mappers/season.mapper';
import { FFHBClient } from './ffhb-client';
import { FFHB_URLS, FFHB_BASE_URL } from './ffhb-urls';
import {
  FFHBClubMapper, FFHBPlayerMapper, FFHBCompetitionMapper,
  FFHBMatchMapper, FFHBPoolStandingsMapper,
} from './ffhb-mappers';

export class FFHBScraperService extends Service implements FederationScraper {
  readonly federation: Federation;
  private readonly client: FFHBClient;

  constructor(federation: Federation) {
    super();
    if (federation.sport !== SportType.HANDBALL) {
      throw new Error(`FFHBScraperService expects sport=handball, got ${federation.sport}`);
    }
    this.federation = federation;
    this.client = new FFHBClient({ baseURL: FFHB_BASE_URL });
  }

  /** Factory : instancie un scraper pour la FFHB seedée en BDD. */
  static async createForFFHB(): Promise<FFHBScraperService> {
    const ffhb = await Federation.findOne({ where: { code: 'FFHB' } });
    if (!ffhb) throw createError(500, 'FFHB federation not seeded');
    return new FFHBScraperService(ffhb);
  }

  async scrapeClub(externalId: string): Promise<ScrapeResult<FederationClubDTO>> {
    const run = await scrapeRunService.start({
      federationId: this.federation.id,
      trigger: ScrapeRunTrigger.MANUAL,
      targetType: 'club',
      targetExternalId: externalId,
    });
    try {
      const html = await this.client.get(FFHB_URLS.club(externalId));
      const dto = FFHBClubMapper.fromHtml(html, externalId);
      const result = await ClubMapper.upsert(dto, this.federation.id, run.id);
      const counts = {
        inserted: result.wasCreated ? 1 : 0,
        updated: result.wasUpdated ? 1 : 0,
        skipped: 0,
      };
      await scrapeRunService.finish({
        scrapeRunId: run.id,
        status: ScrapeRunStatus.SUCCESS,
        ...counts,
      });
      return { data: dto, scrapeRunId: run.id, ...counts, warnings: [] };
    } catch (err) {
      await scrapeRunService.fail(run.id, err as Error);
      throw err;
    }
  }

  async scrapePlayer(externalId: string): Promise<ScrapeResult<FederationPlayerDTO>> {
    const run = await scrapeRunService.start({
      federationId: this.federation.id,
      trigger: ScrapeRunTrigger.MANUAL,
      targetType: 'player',
      targetExternalId: externalId,
    });
    try {
      const html = await this.client.get(FFHB_URLS.player(externalId));
      const dto = FFHBPlayerMapper.fromHtml(html, externalId);
      const result = await PlayerMapper.upsert(dto, this.federation.id, run.id);
      const counts = {
        inserted: result.wasCreated ? 1 : 0,
        updated: result.wasUpdated ? 1 : 0,
        skipped: 0,
      };
      await scrapeRunService.finish({
        scrapeRunId: run.id,
        status: ScrapeRunStatus.SUCCESS,
        ...counts,
      });
      return { data: dto, scrapeRunId: run.id, ...counts, warnings: [] };
    } catch (err) {
      await scrapeRunService.fail(run.id, err as Error);
      throw err;
    }
  }

  async scrapeCompetition(
    externalId: string,
    options: ScrapeCompetitionOptions = {},
  ): Promise<ScrapeResult<FederationCompetitionTreeDTO>> {
    const run = await scrapeRunService.start({
      federationId: this.federation.id,
      trigger: ScrapeRunTrigger.MANUAL,
      targetType: 'competition',
      targetExternalId: externalId,
    });
    try {
      const html = await this.client.get(FFHB_URLS.competition(externalId));
      // La saison externalId doit être déduite du HTML (ex: badge "Saison 2024-2025")
      // Pour MVP, on lit la saison courante ; à raffiner.
      const seasonExternalId = '2024-2025';
      const tree = FFHBCompetitionMapper.fromHtml(html, externalId, seasonExternalId);

      const counts = await CompetitionMapper.upsertTree(tree, this.federation.id, run.id);
      const warnings: string[] = [];

      if (options.deep) {
        // Récurser sur poules → matchdays → matchs serait fait ici.
        // Pour MVP, on log un warning et on laisse l'utilisateur appeler scrapeMatch individuellement.
        warnings.push('Deep scraping not yet implemented — call scrapeMatch per match.');
      }

      await scrapeRunService.finish({
        scrapeRunId: run.id,
        status: ScrapeRunStatus.SUCCESS,
        ...counts,
      });
      return { data: tree, scrapeRunId: run.id, ...counts, warnings };
    } catch (err) {
      await scrapeRunService.fail(run.id, err as Error);
      throw err;
    }
  }

  async scrapeMatch(externalId: string): Promise<ScrapeResult<FederationMatchDTO>> {
    const run = await scrapeRunService.start({
      federationId: this.federation.id,
      trigger: ScrapeRunTrigger.MANUAL,
      targetType: 'match',
      targetExternalId: externalId,
    });
    try {
      const html = await this.client.get(FFHB_URLS.match(externalId));
      const dto = FFHBMatchMapper.fromHtml(html, externalId);
      const result = await MatchMapper.upsert(dto, this.federation.id, run.id);
      await scrapeRunService.finish({
        scrapeRunId: run.id,
        status: ScrapeRunStatus.SUCCESS,
        ...result.counts,
      });
      return {
        data: dto,
        scrapeRunId: run.id,
        ...result.counts,
        warnings: [],
      };
    } catch (err) {
      await scrapeRunService.fail(run.id, err as Error);
      throw err;
    }
  }

  async scrapePoolStandings(
    poolExternalId: string,
  ): Promise<ScrapeResult<FederationPoolStandingDTO[]>> {
    const run = await scrapeRunService.start({
      federationId: this.federation.id,
      trigger: ScrapeRunTrigger.MANUAL,
      targetType: 'pool_standings',
      targetExternalId: poolExternalId,
    });
    try {
      const html = await this.client.get(FFHB_URLS.pool(poolExternalId));
      const dtos = FFHBPoolStandingsMapper.fromHtml(html, poolExternalId);
      const counts = await PoolStandingMapper.insertSnapshot(
        dtos, this.federation.id, run.id,
      );
      await scrapeRunService.finish({
        scrapeRunId: run.id,
        status: ScrapeRunStatus.SUCCESS,
        rowsInserted: counts.inserted,
        rowsUpdated: 0,
        rowsSkipped: counts.skipped,
      });
      return {
        data: dtos, scrapeRunId: run.id,
        rowsInserted: counts.inserted, rowsUpdated: 0, rowsSkipped: counts.skipped,
        warnings: [],
      };
    } catch (err) {
      await scrapeRunService.fail(run.id, err as Error);
      throw err;
    }
  }

  async discoverSeason(year: number): Promise<ScrapeResult<FederationSeasonDTO>> {
    const run = await scrapeRunService.start({
      federationId: this.federation.id,
      trigger: ScrapeRunTrigger.MANUAL,
      targetType: 'season',
      targetExternalId: String(year),
    });
    try {
      // Convention : "2024-2025" pour une saison qui commence en 2024.
      const label = `${year}-${year + 1}`;
      const dto: FederationSeasonDTO = {
        externalId: label,
        sport: SportType.HANDBALL,
        label,
        startDate: `${year}-09-01`,
        endDate: `${year + 1}-06-30`,
        isCurrent: false,
        sourceUrl: `${FFHB_BASE_URL}${FFHB_URLS.competitions}`,
      };
      const result = await SeasonMapper.upsert(dto, this.federation.id, run.id);
      const counts = {
        inserted: result.wasCreated ? 1 : 0,
        updated: result.wasUpdated ? 1 : 0,
        skipped: 0,
      };
      await scrapeRunService.finish({
        scrapeRunId: run.id,
        status: ScrapeRunStatus.SUCCESS,
        ...counts,
      });
      return { data: dto, scrapeRunId: run.id, ...counts, warnings: [] };
    } catch (err) {
      await scrapeRunService.fail(run.id, err as Error);
      throw err;
    }
  }
}
```

- [ ] **Step 2: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

## Phase E — Jobs de synchronisation

### Task 20 : Installer `node-cron`

**Files:**
- Modify: `apps/api-titan/package.json`

- [ ] **Step 1: Installer la dépendance**

```bash
cd apps/api-titan && pnpm add node-cron && pnpm add -D @types/node-cron
```

- [ ] **Step 2: Vérifier l'installation**

```bash
cd apps/api-titan && grep node-cron package.json
```
Expected : présent dans `dependencies` et `devDependencies`.

---

### Task 21 : Jobs `nightly-sync.job.ts`, `live-match.job.ts`, `on-demand.job.ts`

**Files:**
- Create: `apps/api-titan/src/modules/scraping/jobs/nightly-sync.job.ts`
- Create: `apps/api-titan/src/modules/scraping/jobs/live-match.job.ts`
- Create: `apps/api-titan/src/modules/scraping/jobs/on-demand.job.ts`
- Create: `apps/api-titan/src/modules/scraping/jobs/index.ts`

- [ ] **Step 1: Créer `nightly-sync.job.ts`**

```ts
import { FFHBScraperService } from '../ffhb/ffhb-scraper.service';
import { FederationCompetition } from '../../../database';
import { Service } from '../../../core';

class NightlySyncJob extends Service {
  /**
   * Re-scrape toutes les compétitions actives de la saison en cours.
   * À déclencher quotidiennement.
   */
  async run(): Promise<void> {
    this.logger.log('NightlySyncJob started');
    const scraper = await FFHBScraperService.createForFFHB();

    // Charger toutes les compétitions de la fédé pour la saison courante
    const competitions = await FederationCompetition.findAll({
      where: { federationId: scraper.federation.id },
      include: [{ association: 'season', where: { isCurrent: true } }],
    });

    let success = 0;
    let failed = 0;
    for (const competition of competitions) {
      try {
        await scraper.scrapeCompetition(competition.externalId, { deep: false });
        success++;
      } catch (err) {
        this.logger.error(
          `Failed to scrape competition ${competition.externalId}: ${(err as Error).message}`,
        );
        failed++;
      }
    }
    this.logger.log(`NightlySyncJob finished: ${success} ok, ${failed} failed`);
  }
}

export default new NightlySyncJob();
```

- [ ] **Step 2: Créer `live-match.job.ts`**

```ts
import { Op } from 'sequelize';
import { FFHBScraperService } from '../ffhb/ffhb-scraper.service';
import { FederationMatch } from '../../../database';
import { FederationMatchStatus } from 'titan_core';
import { Service } from '../../../core';

class LiveMatchJob extends Service {
  /**
   * Re-scrape les matchs prévus dans une fenêtre J-2 / J+1.
   * À déclencher fréquemment (toutes les 15 minutes les jours de match).
   */
  async run(): Promise<void> {
    this.logger.log('LiveMatchJob started');
    const scraper = await FFHBScraperService.createForFFHB();

    const from = new Date();
    from.setDate(from.getDate() - 2);
    const to = new Date();
    to.setDate(to.getDate() + 1);

    const matches = await FederationMatch.findAll({
      where: {
        federationId: scraper.federation.id,
        dateUtc: { [Op.between]: [from, to] },
        status: { [Op.in]: [FederationMatchStatus.SCHEDULED, FederationMatchStatus.LIVE] },
      },
      limit: 100,
    });

    let success = 0;
    let failed = 0;
    for (const match of matches) {
      try {
        await scraper.scrapeMatch(match.externalId);
        success++;
      } catch (err) {
        this.logger.error(
          `Failed to scrape match ${match.externalId}: ${(err as Error).message}`,
        );
        failed++;
      }
    }
    this.logger.log(`LiveMatchJob finished: ${success} ok, ${failed} failed`);
  }
}

export default new LiveMatchJob();
```

- [ ] **Step 3: Créer `on-demand.job.ts`**

```ts
import { FFHBScraperService } from '../ffhb/ffhb-scraper.service';
import { Service } from '../../../core';

export interface OnDemandJobInput {
  targetType: 'club' | 'player' | 'competition' | 'match' | 'pool_standings' | 'season';
  externalId: string;
  initiatedByUserId?: string;
  deep?: boolean;
}

class OnDemandJob extends Service {
  /**
   * Lance un scrap unique sur demande (admin / webhook).
   */
  async run(input: OnDemandJobInput): Promise<{ scrapeRunId: string }> {
    this.logger.log(`OnDemandJob: ${input.targetType} ${input.externalId}`);
    const scraper = await FFHBScraperService.createForFFHB();

    switch (input.targetType) {
      case 'club':
        return { scrapeRunId: (await scraper.scrapeClub(input.externalId)).scrapeRunId };
      case 'player':
        return { scrapeRunId: (await scraper.scrapePlayer(input.externalId)).scrapeRunId };
      case 'competition':
        return {
          scrapeRunId: (await scraper.scrapeCompetition(input.externalId, { deep: input.deep })).scrapeRunId,
        };
      case 'match':
        return { scrapeRunId: (await scraper.scrapeMatch(input.externalId)).scrapeRunId };
      case 'pool_standings':
        return { scrapeRunId: (await scraper.scrapePoolStandings(input.externalId)).scrapeRunId };
      case 'season':
        return {
          scrapeRunId: (await scraper.discoverSeason(parseInt(input.externalId, 10))).scrapeRunId,
        };
      default:
        throw new Error(`Unknown targetType: ${input.targetType}`);
    }
  }
}

export default new OnDemandJob();
```

- [ ] **Step 4: Créer l'index jobs**

```ts
export { default as nightlySyncJob } from './nightly-sync.job';
export { default as liveMatchJob } from './live-match.job';
export { default as onDemandJob } from './on-demand.job';
```

- [ ] **Step 5: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 22 : Scheduler cron au démarrage de l'app

**Files:**
- Create: `apps/api-titan/src/modules/scraping/jobs/scheduler.ts`
- Modify: `apps/api-titan/src/loaders/index.ts`

- [ ] **Step 1: Créer le scheduler**

```ts
import cron from 'node-cron';
import { nightlySyncJob, liveMatchJob } from './index';
import AppConfig from '../../../modules/app-config.module';
import { LogScenario } from 'abyss_monitor_core';

export const startScrapingScheduler = (): void => {
  // En dev, on ne lance pas les jobs cron automatiquement
  if (AppConfig.process.env !== 'production') {
    AppConfig.logger.log('Scraping scheduler disabled in non-production env', {
      scenario: LogScenario.SYSTEM_STARTUP,
    });
    return;
  }

  // Nightly : tous les jours à 3h du matin
  cron.schedule('0 3 * * *', () => {
    nightlySyncJob.run().catch((err) =>
      AppConfig.logger.error(err, { scenario: LogScenario.SYSTEM_STARTUP }),
    );
  });

  // Live : toutes les 15 minutes, entre 12h et 23h (créneaux de matchs)
  cron.schedule('*/15 12-23 * * *', () => {
    liveMatchJob.run().catch((err) =>
      AppConfig.logger.error(err, { scenario: LogScenario.SYSTEM_STARTUP }),
    );
  });

  AppConfig.logger.log('Scraping scheduler started', {
    scenario: LogScenario.SYSTEM_STARTUP,
  });
};
```

- [ ] **Step 2: Appeler le scheduler dans `appLoader`**

Modify `apps/api-titan/src/loaders/index.ts` — ajouter en haut :

```ts
import { startScrapingScheduler } from '../modules/scraping/jobs/scheduler';
```

Et à la fin de `appLoader`, après les seeds :

```ts
  startScrapingScheduler();
```

- [ ] **Step 3: Type-check + démarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```
Expected : log "Scraping scheduler disabled in non-production env" en dev.

---

## Phase F — Endpoints admin

### Task 23 : Middleware admin

**Files:**
- Verify: `apps/api-titan/src/api/middlewares/` — existe-t-il déjà un middleware `requireAdmin` ?

- [ ] **Step 1: Lister les middlewares existants**

```bash
ls apps/api-titan/src/api/middlewares/
```

- [ ] **Step 2: Si pas de middleware admin, en créer un**

`apps/api-titan/src/api/middlewares/require-admin.ts` :

```ts
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { UserRoleEnum } from 'titan_core';
import { ILocals } from '../../core';

export const requireAdmin = (
  req: Request,
  res: Response<unknown, ILocals>,
  next: NextFunction,
): void => {
  const user = res.locals.user;
  if (!user || user.role !== UserRoleEnum.ADMIN) {
    next(createError(403, 'Admin role required'));
    return;
  }
  next();
};
```

- [ ] **Step 3: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 24 : Controller `scrape.controller.ts` + routes admin

**Files:**
- Create: `apps/api-titan/src/modules/scraping/api/scrape.controller.ts`
- Create: `apps/api-titan/src/modules/scraping/api/scrape.validation.ts`
- Create: `apps/api-titan/src/modules/scraping/api/scrape.route.ts`
- Modify: `apps/api-titan/src/api/routes/index.ts`

- [ ] **Step 1: Créer `scrape.validation.ts`**

```ts
import Joi from 'joi';

class ScrapeValidation {
  triggerBody(body: any) {
    const schema = Joi.object({
      targetType: Joi.string()
        .valid('club', 'player', 'competition', 'match', 'pool_standings', 'season')
        .required(),
      externalId: Joi.string().required(),
      deep: Joi.boolean().optional(),
    });
    const { value, error } = schema.validate(body);
    if (error) throw new Error(error.message);
    return value as {
      targetType: 'club' | 'player' | 'competition' | 'match' | 'pool_standings' | 'season';
      externalId: string;
      deep?: boolean;
    };
  }

  listQuery(query: any) {
    const schema = Joi.object({
      status: Joi.string().valid('running', 'success', 'partial', 'failed').optional(),
      limit: Joi.number().integer().min(1).max(500).default(50),
      offset: Joi.number().integer().min(0).default(0),
    });
    const { value, error } = schema.validate(query);
    if (error) throw new Error(error.message);
    return value as { status?: string; limit: number; offset: number };
  }
}

export default new ScrapeValidation();
```

- [ ] **Step 2: Créer `scrape.controller.ts`**

```ts
import { Request, Response } from 'express';
import { IResponse } from 'titan_core';
import { Controller, LoggerModel, ILocals } from '../../../core';
import { onDemandJob } from '../jobs';
import { FederationScrapeRun } from '../../../database';
import ScrapeValidation from './scrape.validation';

class ScrapeController implements Controller {
  private static readonly logger = new LoggerModel(ScrapeController.name);

  /** POST /admin/scrape — déclenche un scrap manuel. */
  async trigger(
    req: Request,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = ScrapeValidation.triggerBody(req.body);
    const result = await onDemandJob.run({
      targetType: body.targetType,
      externalId: body.externalId,
      deep: body.deep,
      initiatedByUserId: res.locals.user?.id,
    });
    res.json({ data: result });
  }

  /** GET /admin/scrape/runs — liste paginée des runs avec filtre status. */
  async listRuns(
    req: Request,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const { status, limit, offset } = ScrapeValidation.listQuery(req.query);
    const where: any = {};
    if (status) where.status = status;
    const runs = await FederationScrapeRun.findAll({
      where,
      order: [['startedAt', 'DESC']],
      limit,
      offset,
    });
    res.json({ data: runs });
  }

  /** GET /admin/scrape/runs/:id — détail d'un run. */
  async getRun(
    req: Request<{ id: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const run = await FederationScrapeRun.findByPk(req.params.id);
    if (!run) {
      res.status(404).json({ data: null });
      return;
    }
    res.json({ data: run });
  }
}

export default new ScrapeController();
```

- [ ] **Step 3: Créer `scrape.route.ts`**

```ts
import { Router } from 'express';
import scrapeController from './scrape.controller';
import auth from '../../../api/middlewares/auth';
import { requireAdmin } from '../../../api/middlewares/require-admin';

const route = Router();

export const AdminScrapeRouter = (app: Router): Router => {
  app.use('/admin/scrape', route);

  route.post('/', auth, requireAdmin, scrapeController.trigger);
  route.get('/runs', auth, requireAdmin, scrapeController.listRuns);
  route.get('/runs/:id', auth, requireAdmin, scrapeController.getRun);

  return route;
};
```

- [ ] **Step 4: Enregistrer la route**

Modify `apps/api-titan/src/api/routes/index.ts` — ajouter :

```ts
// Admin scraping
export * from '../../modules/scraping/api/scrape.route';
```

- [ ] **Step 5: Vérifier que `apiLoader` charge bien la route**

Lire `apps/api-titan/src/loaders/api.loader.ts` et s'assurer que toutes les exports de `routes/index.ts` sont appliqués. Si le loader liste les routes à la main, ajouter `AdminScrapeRouter`.

- [ ] **Step 6: Type-check + démarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```

---

## Phase G — Tests et documentation

### Task 25 : Test fonctionnel manuel du pipeline

**Files:** (aucun changement — vérification via Postman/curl)

> Comme on n'a pas d'infra de test automatisé (cf. décision Plan 1), on valide manuellement.

- [ ] **Step 1: Trigger un scrap de compétition de test**

```bash
curl -X POST http://localhost:3000/admin/scrape \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"targetType": "competition", "externalId": "<un externalId réel FFHB>"}'
```
Expected : 200 OK avec `{ data: { scrapeRunId: "..." } }`.

- [ ] **Step 2: Lister les runs**

```bash
curl http://localhost:3000/admin/scrape/runs?limit=10 \
  -H "Authorization: Bearer <admin-token>"
```
Expected : liste des derniers runs avec leurs statuts.

- [ ] **Step 3: Vérifier en BDD**

```sql
SELECT COUNT(*) FROM federation_competition;
SELECT COUNT(*) FROM federation_pool;
SELECT COUNT(*) FROM federation_matchday;
```
Expected : valeurs > 0.

- [ ] **Step 4: Re-trigger le même scrap (test idempotence)**

Re-jouer la commande de Step 1. Le `rowsInserted` du nouveau run doit être proche de 0 (tout est déjà présent), `rowsUpdated` reflète les changements éventuels.

- [ ] **Step 5: Tester un scrap de match**

```bash
curl -X POST http://localhost:3000/admin/scrape \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"targetType": "match", "externalId": "<externalId match>"}'
```
Vérifier en BDD :
```sql
SELECT * FROM federation_match WHERE "externalId" = '<...>';
SELECT * FROM federation_match_handball WHERE "matchId" = '<id du match>';
SELECT COUNT(*) FROM federation_match_lineup WHERE "matchId" = '<id>';
```

- [ ] **Step 6: Si erreurs sur sélecteurs CSS**

C'est à ce moment qu'on découvre les sélecteurs incorrects. Mettre à jour les mappers ffhb-mappers correspondants en consultant le HTML réel.

---

### Task 26 : Documentation `scraping-pipeline.md`

**Files:**
- Create: `docs/architecture/scraping-pipeline.md`

- [ ] **Step 1: Créer le document**

```markdown
# Pipeline de scraping fédéral

> Implémenté en Plan 3. Voir le spec [`../superpowers/specs/2026-05-17-ffhb-scraping-and-federation-model-design.md`](../superpowers/specs/2026-05-17-ffhb-scraping-and-federation-model-design.md) section 6 pour le raisonnement.

## Architecture

\`\`\`
apps/api-titan/src/modules/scraping/
├── core/                                    Contrat + services partagés
│   ├── federation-scraper.interface.ts      Contrat commun (FederationScraper)
│   ├── scrape-run.service.ts                Gestion des federation_scrape_run
│   ├── conflict-resolver.ts                 Détection de diffs sur entités verrouillées
│   └── mappers/                             Mappers DTO → BDD (upsert idempotent)
│       ├── club.mapper.ts
│       ├── player.mapper.ts
│       ├── season.mapper.ts
│       ├── venue.mapper.ts
│       ├── team.mapper.ts
│       ├── competition.mapper.ts            (gère phase + pool + matchday en cascade)
│       ├── match.mapper.ts                  (gère lineup + events + stats)
│       └── pool-standing.mapper.ts          (snapshot, pas d'upsert)
│
├── ffhb/                                    Connecteur FFHB
│   ├── ffhb-client.ts                       HTTP (axios + retry + rate-limit)
│   ├── ffhb-urls.ts                         Endpoints connus
│   ├── ffhb-parser.ts                       Helpers cheerio (texte, attr, date, score…)
│   ├── ffhb-scraper.service.ts              Implémente FederationScraper
│   ├── ffhb-mappers/                        HTML → DTO
│   │   ├── club.mapper.ts
│   │   ├── player.mapper.ts
│   │   ├── competition.mapper.ts
│   │   ├── match.mapper.ts
│   │   └── pool-standings.mapper.ts
│   └── SELECTORS.md                         Notes sur les sélecteurs CSS découverts
│
├── jobs/                                    Synchronisation automatisée
│   ├── nightly-sync.job.ts                  Compétitions actives, nuit
│   ├── live-match.job.ts                    Matchs J-2/J+1, fréquent
│   ├── on-demand.job.ts                     Trigger admin
│   └── scheduler.ts                         node-cron, activé en production
│
└── api/                                     Endpoints admin
    ├── scrape.controller.ts                 POST /admin/scrape, GET /admin/scrape/runs
    ├── scrape.validation.ts                 Joi schemas
    └── scrape.route.ts                      Router + middleware admin
\`\`\`

## Contrat `FederationScraper`

Toute fédération supportée implémente cette interface :

\`\`\`ts
interface FederationScraper {
  federation: Federation;
  scrapeClub(externalId): Promise<ScrapeResult<FederationClubDTO>>;
  scrapePlayer(externalId): Promise<ScrapeResult<FederationPlayerDTO>>;
  scrapeCompetition(externalId, options?): Promise<ScrapeResult<FederationCompetitionTreeDTO>>;
  scrapeMatch(externalId): Promise<ScrapeResult<FederationMatchDTO>>;
  scrapePoolStandings(poolExternalId): Promise<ScrapeResult<FederationPoolStandingDTO[]>>;
  discoverSeason(year): Promise<ScrapeResult<FederationSeasonDTO>>;
}
\`\`\`

## Idempotence et audit

- Chaque scrap = 1 `federation_scrape_run` créé puis clôturé (status `success`/`partial`/`failed`).
- Tous les upserts utilisent la clé naturelle `UNIQUE(federationId, externalId)`.
- Les pivots (lineup, events, stats) sont **remplacés en bloc** : à chaque scrap d'un match, on supprime puis ré-insère.
- Les classements (`federation_pool_standing`) sont **historisés** : chaque scrap **ajoute** un snapshot daté.
- Le champ `lastScrapeRunId` de chaque ligne pointe vers le scrape_run d'origine.

## Stratégie de fraîcheur (jobs)

| Job | Fréquence | Portée |
|---|---|---|
| `nightlySyncJob` | 1×/jour, 3h UTC | Toutes les compétitions actives de la saison courante (deep=false) |
| `liveMatchJob` | toutes les 15 min, 12h-23h | Matchs scheduled/live dans la fenêtre J-2/J+1 |
| `onDemandJob` | sur trigger admin | Cible spécifique |

En dev, les jobs cron sont **désactivés**. Seul `onDemandJob` via l'API admin est utilisable.

## Endpoints admin

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/admin/scrape` | Trigger un scrap. Body : `{ targetType, externalId, deep? }` |
| `GET` | `/admin/scrape/runs?status=&limit=&offset=` | Liste des runs (DESC). |
| `GET` | `/admin/scrape/runs/:id` | Détail d'un run. |

Tous protégés par `auth` + `requireAdmin`.

## Ajouter une fédération

1. Créer un dossier `apps/api-titan/src/modules/scraping/<code>/` (ex : `fff/`).
2. Implémenter un `<Code>Client` (HTTP) et un `<Code>Parser` (HTML/JSON).
3. Créer les mappers `<code>-mappers/` qui produisent les DTO `Federation*DTO`.
4. Créer le service `<Code>ScraperService` qui implémente `FederationScraper`.
5. Si le sport est différent, vérifier qu'un `SportModule` existe (cf. [`sport-module.md`](./sport-module.md)).
6. Ajouter une factory dans les jobs (`createForFFF()`, etc.) ou refactoriser la résolution pour utiliser un registre par `FederationCode`.

## Limitations connues

- **Sélecteurs CSS hypothétiques** : les premières versions des `ffhb-mappers` utilisent des sélecteurs basés sur une observation initiale. Si la structure HTML FFHB change, ils doivent être mis à jour. Consigner les changements dans `SELECTORS.md`.
- **Rate-limit modeste** : 1 requête / 1.5s. Si la FFHB tolère plus, augmenter `minIntervalMs` dans `FFHBClient`.
- **Deep scraping de compétition** : pour MVP, `scrapeCompetition(externalId, { deep: true })` log un warning et ne récurse pas automatiquement sur les matchs. À enrichir.
- **Pas de tests automatisés** : validation manuelle uniquement (cf. décision en Plan 1).
```

---

## Tâches finales — Récapitulatif Plan 3

À la fin de l'exécution :

- ✅ Contrat `FederationScraper` + service `ScrapeRunService` + 7 mappers core.
- ✅ Client HTTP FFHB avec rate-limit + retry.
- ✅ Parser HTML (cheerio) + 5 mappers FFHB DTO.
- ✅ Service `FFHBScraperService` implémentant le contrat.
- ✅ 3 jobs (nightly, live, on-demand) + scheduler cron.
- ✅ Endpoints admin `/admin/scrape/*` protégés.
- ✅ Documentation `scraping-pipeline.md`.

**Fichiers créés à committer manuellement** (rappel : Claude ne fait aucune action git) :

Module scraping :
- `core/federation-scraper.interface.ts`
- `core/scrape-run.service.ts`
- `core/conflict-resolver.ts`
- `core/mappers/` (8 fichiers)
- `ffhb/ffhb-client.ts`
- `ffhb/ffhb-urls.ts`
- `ffhb/ffhb-parser.ts`
- `ffhb/ffhb-scraper.service.ts`
- `ffhb/ffhb-mappers/` (6 fichiers)
- `ffhb/SELECTORS.md`
- `jobs/nightly-sync.job.ts`
- `jobs/live-match.job.ts`
- `jobs/on-demand.job.ts`
- `jobs/scheduler.ts`
- `jobs/index.ts`
- `api/scrape.controller.ts`
- `api/scrape.validation.ts`
- `api/scrape.route.ts`

DTOs titan_core :
- `types/dto/scraping/` (8 fichiers)

Middlewares (si pas existant) :
- `api/middlewares/require-admin.ts`

Modifications :
- `loaders/index.ts` (appel scheduler)
- `api/routes/index.ts` (registre route admin)
- `types/dto/index.ts` (export scraping)

Dépendances ajoutées :
- `cheerio` + `@types/cheerio`
- `node-cron` + `@types/node-cron`

Documentation :
- `docs/architecture/scraping-pipeline.md`

---

## Conclusion globale (3 plans)

À l'issue des Plans 1, 2 et 3, Titan dispose de :
- Un **référentiel fédéral** complet alimenté par scraping (3 couches : core, extensions sport, app).
- Un **pipeline de scraping pluggable** par fédération, instancié pour la FFHB.
- Un **workflow d'onboarding club** opérationnel.
- Une **documentation** architecture et opérationnelle.

Travaux logiques de suite, hors périmètre de ces plans :
- Renforcement de la vérification d'identité lors du claim d'un club fédéral.
- Implémentation du "deep scrape" de compétition (récursion automatique sur les matchs).
- Front Titan adapté aux nouveaux endpoints (`/titan/onboarding/*`, `/admin/scrape/*`, lecture de `federation_*`).
- Tests automatisés (Jest + fixtures HTML pour les mappers, tests d'intégration BDD).
- Connecteurs additionnels (FFF, FFBB…) suivant le contrat `FederationScraper`.
