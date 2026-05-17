# Plan 2 — Refactor `titan_*` (couche app + onboarding) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.
>
> **Règle spécifique à ce projet :** Claude **ne fait aucune opération git** (add/commit/push/branch). L'utilisateur gère tous les commits manuellement. Aucune étape de ce plan ne contient `git commit` ou équivalent.
>
> **Pré-requis :** Plan 1 (schéma fédéral) doit avoir été exécuté et mergé. Les tables `federation_*` existent.

**Goal:** Restructurer la couche app (`titan_*`) selon la section 5 du spec : supprimer les tables dont l'identité passe au référentiel fédéral, créer les tables "données app" (`titan_club_account`, `titan_team_settings`, `titan_player_profile`, `titan_friendly_match*`), repointer les FK des tables conservées vers `federation_*`, et exposer l'onboarding club (recherche + claim d'un `federation_club`).

**Architecture:** Approche **drop & recreate** (BDD non-prod). Suppression de modèles/controllers/services/routes obsolètes en blocs cohérents, puis création des nouveaux. Refactor des fichiers conservés via diffs ciblés. Validation par `pnpm run tsc` + redémarrage du serveur dev (`sync({ force: true })` rebuild la BDD).

**Tech Stack:** TypeScript, Sequelize-TypeScript, PostgreSQL, Express, pnpm workspaces.

## ⚠ Gotcha critique — Build dépendance `titan_core` ⇒ `api-titan`

Le package `titan_core` expose `"main": "dist/index.js"`. Chaque modification dans `titan_core/src/` doit être suivie de `pnpm run tsc` dans `packages/titan_core/` pour rebuilder `dist/`, **avant** que `api-titan` voie les nouveaux types.

## ⚠ État intermédiaire prévisible

Pendant l'exécution de ce plan, l'app sera **temporairement non-fonctionnelle** entre la suppression des anciens controllers/services et la mise en place des nouveaux. Les tests manuels via Postman seront cassés sur certaines routes jusqu'à la fin de la Phase G. C'est attendu — l'app n'est pas en prod, on assume.

---

## Phase A — Suppression des modèles, controllers et services obsolètes

### Task 1 : Supprimer les modèles `titan_*` remplacés par `federation_*`

> Les entités d'identité (Club, Team, Player, Match…) basculent vers `federation_*`. Les tables `titan_*` correspondantes disparaissent ; leurs remplaçants côté app (`titan_club_account`, `titan_team_settings`, etc.) sont créés plus loin.

**Files (à supprimer) :**
- `apps/api-titan/src/database/models/titan/club.model.ts`
- `apps/api-titan/src/database/models/titan/team.model.ts`
- `apps/api-titan/src/database/models/titan/team-player.model.ts`
- `apps/api-titan/src/database/models/titan/player.model.ts`
- `apps/api-titan/src/database/models/titan/match.model.ts`
- `apps/api-titan/src/database/models/titan/match-lineup.model.ts`
- `apps/api-titan/src/database/models/titan/match-event.model.ts`
- `apps/api-titan/src/database/models/titan/player-match-stats.model.ts`
- `apps/api-titan/src/database/models/titan/player-season-stats.model.ts`
- `apps/api-titan/src/database/models/titan/team-season-stats.model.ts`
- `apps/api-titan/src/database/models/titan/season.model.ts`
- `apps/api-titan/src/database/models/titan/sport-config.model.ts`
- `apps/api-titan/src/database/models/titan/venue.model.ts`

> Note : `titan_venue` est supprimé. Le spec mentionnait de le conserver pour les salles privées d'entraînement, mais simplifier d'abord (les entraînements peuvent référencer `federation_venue` directement). Si besoin de salles privées plus tard, on les ajoutera comme entrées `federation_venue` avec `isManual: true`.

**Files (à modifier) :**
- `apps/api-titan/src/database/models/titan/index.ts` — retirer les exports correspondants.

- [ ] **Step 1: Supprimer les 13 fichiers de modèles**

```bash
rm apps/api-titan/src/database/models/titan/club.model.ts \
   apps/api-titan/src/database/models/titan/team.model.ts \
   apps/api-titan/src/database/models/titan/team-player.model.ts \
   apps/api-titan/src/database/models/titan/player.model.ts \
   apps/api-titan/src/database/models/titan/match.model.ts \
   apps/api-titan/src/database/models/titan/match-lineup.model.ts \
   apps/api-titan/src/database/models/titan/match-event.model.ts \
   apps/api-titan/src/database/models/titan/player-match-stats.model.ts \
   apps/api-titan/src/database/models/titan/player-season-stats.model.ts \
   apps/api-titan/src/database/models/titan/team-season-stats.model.ts \
   apps/api-titan/src/database/models/titan/season.model.ts \
   apps/api-titan/src/database/models/titan/sport-config.model.ts \
   apps/api-titan/src/database/models/titan/venue.model.ts
```

- [ ] **Step 2: Mettre à jour `apps/api-titan/src/database/models/titan/index.ts`**

Remplacer son contenu par :

```ts
export * from './staff-role.model';
export * from './club-member.model';
export * from './license.model';
export * from './medical-certificate.model';
export * from './training.model';
export * from './training-attendance.model';
export * from './fee-plan.model';
export * from './payment.model';
export * from './budget-entry.model';
export * from './club-invitation.model';
```

- [ ] **Step 3: Ne pas essayer de tsc à ce stade**

Le code va casser à plusieurs endroits (controllers/services importent les modèles supprimés). On répare progressivement dans les tâches suivantes. Passer directement à la Task 2.

---

### Task 2 : Supprimer les controllers, services, routes et validations obsolètes

**Files (à supprimer) :**
- `apps/api-titan/src/api/controllers/titan/club.controller.ts`
- `apps/api-titan/src/api/controllers/titan/team.controller.ts`
- `apps/api-titan/src/api/controllers/titan/player.controller.ts`
- `apps/api-titan/src/api/controllers/titan/match.controller.ts`
- `apps/api-titan/src/api/controllers/titan/stats.controller.ts`
- `apps/api-titan/src/api/routes/titan/club.route.ts`
- `apps/api-titan/src/api/routes/titan/team.route.ts`
- `apps/api-titan/src/api/routes/titan/player.route.ts`
- `apps/api-titan/src/api/routes/titan/match.route.ts`
- `apps/api-titan/src/api/routes/titan/stats.route.ts`
- `apps/api-titan/src/services/titan/club.service.ts`
- `apps/api-titan/src/services/titan/team.service.ts`
- `apps/api-titan/src/services/titan/player.service.ts`
- `apps/api-titan/src/services/titan/match.service.ts`
- `apps/api-titan/src/services/titan/stats.service.ts`
- `apps/api-titan/src/api/validations/titan/club.validation.ts`
- `apps/api-titan/src/api/validations/titan/team.validation.ts`
- `apps/api-titan/src/api/validations/titan/player.validation.ts`
- `apps/api-titan/src/api/validations/titan/match.validation.ts`
- `apps/api-titan/src/api/validations/titan/stats.validation.ts`

**Files (à modifier) :**
- `apps/api-titan/src/api/routes/index.ts` — retirer les exports correspondants.
- `apps/api-titan/src/services/titan/index.ts` — retirer les exports correspondants.

> Note : `dashboard.controller`, `dashboard.service`, `dashboard.route` font de l'agrégation sur tout ; ils seront refactorés en Task 30 (pas supprimés).

- [ ] **Step 1: Supprimer les 20 fichiers**

```bash
rm apps/api-titan/src/api/controllers/titan/club.controller.ts \
   apps/api-titan/src/api/controllers/titan/team.controller.ts \
   apps/api-titan/src/api/controllers/titan/player.controller.ts \
   apps/api-titan/src/api/controllers/titan/match.controller.ts \
   apps/api-titan/src/api/controllers/titan/stats.controller.ts \
   apps/api-titan/src/api/routes/titan/club.route.ts \
   apps/api-titan/src/api/routes/titan/team.route.ts \
   apps/api-titan/src/api/routes/titan/player.route.ts \
   apps/api-titan/src/api/routes/titan/match.route.ts \
   apps/api-titan/src/api/routes/titan/stats.route.ts \
   apps/api-titan/src/services/titan/club.service.ts \
   apps/api-titan/src/services/titan/team.service.ts \
   apps/api-titan/src/services/titan/player.service.ts \
   apps/api-titan/src/services/titan/match.service.ts \
   apps/api-titan/src/services/titan/stats.service.ts \
   apps/api-titan/src/api/validations/titan/club.validation.ts \
   apps/api-titan/src/api/validations/titan/team.validation.ts \
   apps/api-titan/src/api/validations/titan/player.validation.ts \
   apps/api-titan/src/api/validations/titan/match.validation.ts \
   apps/api-titan/src/api/validations/titan/stats.validation.ts
```

- [ ] **Step 2: Lire `apps/api-titan/src/api/routes/index.ts`**

Pour voir l'état actuel.

- [ ] **Step 3: Mettre à jour `apps/api-titan/src/api/routes/index.ts`**

Remplacer le contenu par :

```ts
export * from './auth.route';
export * from './user.route';
export * from './conversation.route';
export * from './message.route';

// Titan (sera enrichi par les nouvelles routes en Phase G)
export * from './titan/member.route';
export * from './titan/training.route';
export * from './titan/finance.route';
export * from './titan/dashboard.route';
```

- [ ] **Step 4: Lire `apps/api-titan/src/services/titan/index.ts`**

Pour voir l'état actuel.

- [ ] **Step 5: Mettre à jour `apps/api-titan/src/services/titan/index.ts`**

Le contenu doit re-exporter uniquement les services conservés :

```ts
export { default as memberService } from './member.service';
export { default as trainingService } from './training.service';
export { default as financeService } from './finance.service';
export { default as dashboardService } from './dashboard.service';
```

> Note : conserver le pattern d'export utilisé par le projet — si l'existant utilise `export * from`, l'adapter. La forme `default as` est utilisée parce que les services sont des `class` exportées en default.

- [ ] **Step 6: Suppression du seed SportConfig dans `apps/api-titan/src/loaders/index.ts`**

Le modèle `SportConfig` n'existe plus. Supprimer :
- L'import `SportConfig` (déjà détecté en lisant le fichier en Phase de prep)
- La constante `SPORT_CONFIGS`
- La fonction `seedSportConfigs`
- L'appel `await seedSportConfigs();` dans `appLoader`

Vérifier après modification que le fichier ne référence plus `SportConfig`.

- [ ] **Step 7: Ne pas essayer de tsc encore**

Plusieurs imports cassés dans les interfaces titan_core. On nettoie ça dans la Phase B.

---

### Task 3 : Nettoyer les interfaces obsolètes dans `titan_core`

**Files (à supprimer) :**
- `packages/titan_core/src/types/interface/models/titan/club.model.ts`
- `packages/titan_core/src/types/interface/models/titan/team.model.ts`
- `packages/titan_core/src/types/interface/models/titan/team-player.model.ts`
- `packages/titan_core/src/types/interface/models/titan/player.model.ts`
- `packages/titan_core/src/types/interface/models/titan/match.model.ts`
- `packages/titan_core/src/types/interface/models/titan/match-lineup.model.ts`
- `packages/titan_core/src/types/interface/models/titan/match-event.model.ts`
- `packages/titan_core/src/types/interface/models/titan/player-match-stats.model.ts`
- `packages/titan_core/src/types/interface/models/titan/player-season-stats.model.ts`
- `packages/titan_core/src/types/interface/models/titan/team-season-stats.model.ts`
- `packages/titan_core/src/types/interface/models/titan/season.model.ts`
- `packages/titan_core/src/types/interface/models/titan/sport-config.model.ts`
- `packages/titan_core/src/types/interface/models/titan/venue.model.ts`

**Files (à modifier) :**
- `packages/titan_core/src/types/interface/models/titan/index.ts` — retirer les exports.
- `packages/titan_core/src/enums/titan/match-event-type.enum.ts` — déjà existant ; le conserver tel quel (utilisé éventuellement par d'autres parties du code, mais sinon inoffensif).
- `packages/titan_core/src/enums/titan/sanction-type.enum.ts` — idem, conserver.
- `packages/titan_core/src/types/dto/` (à vérifier) — supprimer les DTO `CreatePlayerBody`, `UpdatePlayerBody`, etc. correspondants aux entités disparues.

- [ ] **Step 1: Supprimer les 13 interfaces**

```bash
rm packages/titan_core/src/types/interface/models/titan/club.model.ts \
   packages/titan_core/src/types/interface/models/titan/team.model.ts \
   packages/titan_core/src/types/interface/models/titan/team-player.model.ts \
   packages/titan_core/src/types/interface/models/titan/player.model.ts \
   packages/titan_core/src/types/interface/models/titan/match.model.ts \
   packages/titan_core/src/types/interface/models/titan/match-lineup.model.ts \
   packages/titan_core/src/types/interface/models/titan/match-event.model.ts \
   packages/titan_core/src/types/interface/models/titan/player-match-stats.model.ts \
   packages/titan_core/src/types/interface/models/titan/player-season-stats.model.ts \
   packages/titan_core/src/types/interface/models/titan/team-season-stats.model.ts \
   packages/titan_core/src/types/interface/models/titan/season.model.ts \
   packages/titan_core/src/types/interface/models/titan/sport-config.model.ts \
   packages/titan_core/src/types/interface/models/titan/venue.model.ts
```

- [ ] **Step 2: Lire l'index actuel**

```bash
cat packages/titan_core/src/types/interface/models/titan/index.ts
```

- [ ] **Step 3: Réécrire l'index pour ne garder que les entités conservées**

`packages/titan_core/src/types/interface/models/titan/index.ts` doit contenir :

```ts
export * from './staff-role.model';
export * from './club-member.model';
export * from './license.model';
export * from './medical-certificate.model';
export * from './training.model';
export * from './training-attendance.model';
export * from './fee-plan.model';
export * from './payment.model';
export * from './budget-entry.model';
export * from './club-invitation.model';
```

- [ ] **Step 4: Inspecter le dossier DTO**

```bash
ls packages/titan_core/src/types/dto/
```

Pour chaque DTO clairement lié à une entité supprimée (`*player*`, `*team*`, `*club*`, `*match*`, `*stats*`, `*season*`, `*venue*`, `*sport-config*`), supprimer le fichier et nettoyer l'index correspondant. **Ne pas supprimer** les DTO liés à `member`, `license`, `medical-certificate`, `training`, `finance`, `dashboard`.

- [ ] **Step 5: Build titan_core (échec attendu)**

```bash
cd packages/titan_core && pnpm run tsc
```

Va probablement échouer si des fichiers conservés référencent des interfaces supprimées (ex : `ClubMember.clubId: string` qui faisait référence implicite à `Club`). C'est normal — on les corrige dans les tâches suivantes (repointage FK).

Noter les erreurs reportées pour les adresser en Phase F.

---

## Phase B — Restructurer `titan_club` → `titan_club_account`

### Task 4 : Interface `ITitanClubAccount`

**Files:**
- Create: `packages/titan_core/src/types/interface/models/titan/club-account.model.ts`
- Modify: `packages/titan_core/src/types/interface/models/titan/index.ts`

- [ ] **Step 1: Créer l'interface**

```ts
export type ITitanClubAccount = {
  id: string;
  federationClubId: string;     // 1-1 avec federation_club (UNIQUE)
  displayName: string | null;   // override du nom fédéral pour l'app
  brandingColors: string[] | null;
  brandingLogoUrl: string | null;
  subscriptionPlan: string;     // 'free' | 'pro' | 'enterprise' | …
  subscriptionStatus: string;   // 'active' | 'past_due' | 'cancelled'
  subscribedAt: string;
  cancelledAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 2: Re-exporter**

Ajouter dans `packages/titan_core/src/types/interface/models/titan/index.ts` :

```ts
export * from './club-account.model';
```

- [ ] **Step 3: Build titan_core**

```bash
cd packages/titan_core && pnpm run tsc
```

---

### Task 5 : Modèle `TitanClubAccount`

**Files:**
- Create: `apps/api-titan/src/database/models/titan/club-account.model.ts`
- Modify: `apps/api-titan/src/database/models/titan/index.ts`

- [ ] **Step 1: Créer le modèle**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Unique,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ITitanClubAccount } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationClub } from '../federation/federation-club.model';

export type CreationModelTitanClubAccount = WithRequired<
  Partial<ITitanClubAccount>,
  'federationClubId' | 'subscriptionPlan' | 'subscriptionStatus' | 'subscribedAt'
>;

@Table({ tableName: 'titan_club_account', paranoid: false, timestamps: true })
export class TitanClubAccount extends CustomModel<ITitanClubAccount, CreationModelTitanClubAccount> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @Unique
  @ForeignKey(() => FederationClub)
  @Column({ type: DataType.UUID })
  federationClubId: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  displayName: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.JSON })
  brandingColors: string[] | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  brandingLogoUrl: string | null;

  @AllowNull(false) @Default('free') @Column({ type: DataType.STRING })
  subscriptionPlan: string;

  @AllowNull(false) @Default('active') @Column({ type: DataType.STRING })
  subscriptionStatus: string;

  @AllowNull(false) @Default(() => new Date())
  @Column({ type: DataType.DATE })
  subscribedAt: string;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  cancelledAt: string | null;

  @BelongsTo(() => FederationClub)
  federationClub: FederationClub;
}
```

- [ ] **Step 2: Re-exporter**

Ajouter au début de `apps/api-titan/src/database/models/titan/index.ts` :

```ts
export * from './club-account.model';
```

- [ ] **Step 3: Build api-titan + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc
```
Si erreurs résiduelles dans les fichiers conservés (license, medical-certificate, training, etc.), on les corrige en Phase F. À ce stade, on accepte les erreurs.

Lancer le serveur :
```bash
cd apps/api-titan && pnpm run dev
```
Si le serveur démarre → la table `titan_club_account` est créée. Si erreurs de compilation bloquent le démarrage → passer à la phase suivante et revenir après.

---

## Phase C — Créer `titan_team_settings`

### Task 6 : Interface `ITitanTeamSettings`

**Files:**
- Create: `packages/titan_core/src/types/interface/models/titan/team-settings.model.ts`
- Modify: `packages/titan_core/src/types/interface/models/titan/index.ts`

- [ ] **Step 1: Créer l'interface**

```ts
export type ITitanTeamSettings = {
  id: string;
  federationTeamId: string;        // 1-1 (UNIQUE)
  clubAccountId: string;           // raccourci de jointure (denormalisé)
  coachUserId: string | null;      // FK -> titan_user
  assistantCoachUserId: string | null;
  internalNotes: string | null;
  displayColor: string | null;     // override couleur d'affichage
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 2: Re-exporter et build**

Ajouter `export * from './team-settings.model';` dans l'index. Puis :

```bash
cd packages/titan_core && pnpm run tsc
```

---

### Task 7 : Modèle `TitanTeamSettings`

**Files:**
- Create: `apps/api-titan/src/database/models/titan/team-settings.model.ts`
- Modify: `apps/api-titan/src/database/models/titan/index.ts`

- [ ] **Step 1: Créer le modèle**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Unique,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ITitanTeamSettings } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationTeam } from '../federation/federation-team.model';
import { TitanClubAccount } from './club-account.model';
import { User } from '../user.model';

export type CreationModelTitanTeamSettings = WithRequired<
  Partial<ITitanTeamSettings>,
  'federationTeamId' | 'clubAccountId'
>;

@Table({ tableName: 'titan_team_settings', paranoid: false, timestamps: true })
export class TitanTeamSettings extends CustomModel<ITitanTeamSettings, CreationModelTitanTeamSettings> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @Unique
  @ForeignKey(() => FederationTeam)
  @Column({ type: DataType.UUID })
  federationTeamId: string;

  @AllowNull(false)
  @ForeignKey(() => TitanClubAccount)
  @Column({ type: DataType.UUID })
  clubAccountId: string;

  @AllowNull(true) @Default(null)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  coachUserId: string | null;

  @AllowNull(true) @Default(null)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  assistantCoachUserId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.TEXT })
  internalNotes: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  displayColor: string | null;

  @BelongsTo(() => FederationTeam)
  federationTeam: FederationTeam;

  @BelongsTo(() => TitanClubAccount)
  clubAccount: TitanClubAccount;

  @BelongsTo(() => User, 'coachUserId')
  coach: User;

  @BelongsTo(() => User, 'assistantCoachUserId')
  assistantCoach: User;
}
```

- [ ] **Step 2: Re-exporter**

```ts
export * from './team-settings.model';
```

- [ ] **Step 3: Build + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```

---

## Phase D — Créer `titan_player_profile`

### Task 8 : Interface `ITitanPlayerProfile`

**Files:**
- Create: `packages/titan_core/src/types/interface/models/titan/player-profile.model.ts`
- Modify: `packages/titan_core/src/types/interface/models/titan/index.ts`

- [ ] **Step 1: Créer l'interface**

```ts
export type ITitanPlayerProfile = {
  id: string;
  federationPlayerId: string;       // 1-1 (UNIQUE)
  clubAccountId: string;            // FK -> titan_club_account (le club qui gère ce profil)
  userId: string | null;            // lien compte Mimas/Titan, optionnel
  customPhotoUrl: string | null;    // photo perso (override de federation_player.photoUrl)
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelation: string | null;
  internalNotes: string | null;
  imageRightsConsented: boolean;
  imageRightsConsentDate: string | null;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 2: Re-exporter et build**

Ajouter `export * from './player-profile.model';`. Puis :

```bash
cd packages/titan_core && pnpm run tsc
```

---

### Task 9 : Modèle `TitanPlayerProfile`

**Files:**
- Create: `apps/api-titan/src/database/models/titan/player-profile.model.ts`
- Modify: `apps/api-titan/src/database/models/titan/index.ts`

- [ ] **Step 1: Créer le modèle**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Unique,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ITitanPlayerProfile } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationPlayer } from '../federation/federation-player.model';
import { TitanClubAccount } from './club-account.model';
import { User } from '../user.model';

export type CreationModelTitanPlayerProfile = WithRequired<
  Partial<ITitanPlayerProfile>,
  'federationPlayerId' | 'clubAccountId'
>;

@Table({ tableName: 'titan_player_profile', paranoid: false, timestamps: true })
export class TitanPlayerProfile extends CustomModel<ITitanPlayerProfile, CreationModelTitanPlayerProfile> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @Unique
  @ForeignKey(() => FederationPlayer)
  @Column({ type: DataType.UUID })
  federationPlayerId: string;

  @AllowNull(false)
  @ForeignKey(() => TitanClubAccount)
  @Column({ type: DataType.UUID })
  clubAccountId: string;

  @AllowNull(true) @Default(null)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  customPhotoUrl: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  emergencyContactName: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  emergencyContactPhone: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  emergencyContactRelation: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.TEXT })
  internalNotes: string | null;

  @AllowNull(false) @Default(false) @Column({ type: DataType.BOOLEAN })
  imageRightsConsented: boolean;

  @AllowNull(true) @Default(null) @Column({ type: DataType.DATE })
  imageRightsConsentDate: string | null;

  @BelongsTo(() => FederationPlayer)
  federationPlayer: FederationPlayer;

  @BelongsTo(() => TitanClubAccount)
  clubAccount: TitanClubAccount;

  @BelongsTo(() => User)
  user: User;
}
```

- [ ] **Step 2: Re-exporter**

```ts
export * from './player-profile.model';
```

- [ ] **Step 3: Build + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```

---

## Phase E — Créer `titan_friendly_match` et ses annexes

### Task 10 : Interfaces friendly match (3 entités)

**Files:**
- Create: `packages/titan_core/src/types/interface/models/titan/friendly-match.model.ts`
- Create: `packages/titan_core/src/types/interface/models/titan/friendly-match-lineup.model.ts`
- Create: `packages/titan_core/src/types/interface/models/titan/friendly-match-event.model.ts`
- Modify: `packages/titan_core/src/types/interface/models/titan/index.ts`

- [ ] **Step 1: Créer `friendly-match.model.ts`**

```ts
import { FederationMatchStatus, MatchSide } from '../../../../enums';

export type ITitanFriendlyMatch = {
  id: string;
  clubAccountId: string;            // qui a créé cet amical
  homeFederationTeamId: string;     // peut être une équipe externe (federation_team avec isManual=true autorisé)
  awayFederationTeamId: string;
  dateUtc: string;
  status: FederationMatchStatus;
  scoreHome: number | null;
  scoreAway: number | null;
  scoreHalfHome: number | null;
  scoreHalfAway: number | null;
  venueId: string | null;           // FK -> federation_venue
  ourSide: MatchSide;               // 'home' ou 'away' selon où joue le club
  notes: string | null;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 2: Créer `friendly-match-lineup.model.ts`**

```ts
import { MatchSide } from '../../../../enums';

export type ITitanFriendlyMatchLineup = {
  id: string;
  friendlyMatchId: string;
  federationPlayerId: string;
  side: MatchSide;
  starter: boolean;
  jerseyNumber: number | null;
  position: string | null;
  isCaptain: boolean;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 3: Créer `friendly-match-event.model.ts`**

```ts
import { MatchSide, FederationMatchEventType } from '../../../../enums';

export type ITitanFriendlyMatchEvent = {
  id: string;
  friendlyMatchId: string;
  minute: number;
  second: number | null;
  side: MatchSide;
  type: FederationMatchEventType;
  subtype: string | null;
  federationPlayerId: string | null;
  details: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 4: Re-exporter**

Ajouter dans `packages/titan_core/src/types/interface/models/titan/index.ts` :

```ts
export * from './friendly-match.model';
export * from './friendly-match-lineup.model';
export * from './friendly-match-event.model';
```

- [ ] **Step 5: Build titan_core**

```bash
cd packages/titan_core && pnpm run tsc
```

---

### Task 11 : Modèles friendly match (3 entités)

**Files:**
- Create: `apps/api-titan/src/database/models/titan/friendly-match.model.ts`
- Create: `apps/api-titan/src/database/models/titan/friendly-match-lineup.model.ts`
- Create: `apps/api-titan/src/database/models/titan/friendly-match-event.model.ts`
- Modify: `apps/api-titan/src/database/models/titan/index.ts`

- [ ] **Step 1: Créer `friendly-match.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ITitanFriendlyMatch, FederationMatchStatus, MatchSide } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { TitanClubAccount } from './club-account.model';
import { FederationTeam } from '../federation/federation-team.model';
import { FederationVenue } from '../federation/federation-venue.model';
import { TitanFriendlyMatchLineup } from './friendly-match-lineup.model';
import { TitanFriendlyMatchEvent } from './friendly-match-event.model';

export type CreationModelTitanFriendlyMatch = WithRequired<
  Partial<ITitanFriendlyMatch>,
  'clubAccountId' | 'homeFederationTeamId' | 'awayFederationTeamId' | 'dateUtc' | 'ourSide'
>;

@Table({ tableName: 'titan_friendly_match', paranoid: false, timestamps: true })
export class TitanFriendlyMatch extends CustomModel<ITitanFriendlyMatch, CreationModelTitanFriendlyMatch> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => TitanClubAccount)
  @Column({ type: DataType.UUID })
  clubAccountId: string;

  @AllowNull(false)
  @ForeignKey(() => FederationTeam)
  @Column({ type: DataType.UUID })
  homeFederationTeamId: string;

  @AllowNull(false)
  @ForeignKey(() => FederationTeam)
  @Column({ type: DataType.UUID })
  awayFederationTeamId: string;

  @AllowNull(false) @Column({ type: DataType.DATE })
  dateUtc: string;

  @AllowNull(false) @Default(FederationMatchStatus.SCHEDULED)
  @Column({ type: DataType.ENUM(...Object.values(FederationMatchStatus)) })
  status: FederationMatchStatus;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreHome: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreAway: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreHalfHome: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  scoreHalfAway: number | null;

  @AllowNull(true) @Default(null)
  @ForeignKey(() => FederationVenue)
  @Column({ type: DataType.UUID })
  venueId: string | null;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(MatchSide)) })
  ourSide: MatchSide;

  @AllowNull(true) @Default(null) @Column({ type: DataType.TEXT })
  notes: string | null;

  @BelongsTo(() => TitanClubAccount)
  clubAccount: TitanClubAccount;

  @BelongsTo(() => FederationTeam, 'homeFederationTeamId')
  homeTeam: FederationTeam;

  @BelongsTo(() => FederationTeam, 'awayFederationTeamId')
  awayTeam: FederationTeam;

  @BelongsTo(() => FederationVenue)
  venue: FederationVenue;

  @HasMany(() => TitanFriendlyMatchLineup)
  lineup: TitanFriendlyMatchLineup[];

  @HasMany(() => TitanFriendlyMatchEvent)
  events: TitanFriendlyMatchEvent[];
}
```

- [ ] **Step 2: Créer `friendly-match-lineup.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ITitanFriendlyMatchLineup, MatchSide } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { TitanFriendlyMatch } from './friendly-match.model';
import { FederationPlayer } from '../federation/federation-player.model';

export type CreationModelTitanFriendlyMatchLineup = WithRequired<
  Partial<ITitanFriendlyMatchLineup>,
  'friendlyMatchId' | 'federationPlayerId' | 'side' | 'starter'
>;

@Table({ tableName: 'titan_friendly_match_lineup', paranoid: false, timestamps: true })
export class TitanFriendlyMatchLineup extends CustomModel<ITitanFriendlyMatchLineup, CreationModelTitanFriendlyMatchLineup> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => TitanFriendlyMatch)
  @Index({ name: 'titan_fml_unique', unique: true })
  @Column({ type: DataType.UUID })
  friendlyMatchId: string;

  @AllowNull(false)
  @ForeignKey(() => FederationPlayer)
  @Index({ name: 'titan_fml_unique', unique: true })
  @Column({ type: DataType.UUID })
  federationPlayerId: string;

  @AllowNull(false)
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

  @BelongsTo(() => TitanFriendlyMatch)
  friendlyMatch: TitanFriendlyMatch;

  @BelongsTo(() => FederationPlayer)
  player: FederationPlayer;
}
```

- [ ] **Step 3: Créer `friendly-match-event.model.ts`**

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import {
  ITitanFriendlyMatchEvent, MatchSide, FederationMatchEventType,
} from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { TitanFriendlyMatch } from './friendly-match.model';
import { FederationPlayer } from '../federation/federation-player.model';

export type CreationModelTitanFriendlyMatchEvent = WithRequired<
  Partial<ITitanFriendlyMatchEvent>,
  'friendlyMatchId' | 'minute' | 'side' | 'type'
>;

@Table({ tableName: 'titan_friendly_match_event', paranoid: false, timestamps: true })
export class TitanFriendlyMatchEvent extends CustomModel<ITitanFriendlyMatchEvent, CreationModelTitanFriendlyMatchEvent> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => TitanFriendlyMatch)
  @Index('titan_fme_match_minute_idx')
  @Column({ type: DataType.UUID })
  friendlyMatchId: string;

  @AllowNull(false)
  @Index('titan_fme_match_minute_idx')
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

  @AllowNull(true) @Default(null)
  @ForeignKey(() => FederationPlayer)
  @Column({ type: DataType.UUID })
  federationPlayerId: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.JSONB })
  details: Record<string, unknown> | null;

  @BelongsTo(() => TitanFriendlyMatch)
  friendlyMatch: TitanFriendlyMatch;

  @BelongsTo(() => FederationPlayer)
  player: FederationPlayer;
}
```

- [ ] **Step 4: Re-exporter**

```ts
export * from './friendly-match.model';
export * from './friendly-match-lineup.model';
export * from './friendly-match-event.model';
```

- [ ] **Step 5: Build + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```

---

## Phase F — Repointer les FK des tables conservées

> Ces tables existent toujours mais référençaient des modèles supprimés. On les repointe vers `federation_*` ou `titan_club_account` selon les cas.

### Task 12 : `titan_club_member` → FK vers `titan_club_account` et `federation_season`

**Files:**
- Modify: `packages/titan_core/src/types/interface/models/titan/club-member.model.ts`
- Modify: `apps/api-titan/src/database/models/titan/club-member.model.ts`

- [ ] **Step 1: Lire l'interface actuelle**

```bash
cat packages/titan_core/src/types/interface/models/titan/club-member.model.ts
```

- [ ] **Step 2: Modifier l'interface**

Remplacer la propriété `clubId: string;` par `clubAccountId: string;` et `seasonId: string;` reste mais désigne désormais une `federation_season`. Garder les autres champs.

Le résultat doit avoir cette structure :

```ts
import { ClubMemberRole, ClubMemberStatus } from '../../../../enums';

export type IClubMember = {
  id: string;
  clubAccountId: string;          // ← renommé (depuis clubId)
  userId: string;
  seasonId: string;               // ← maintenant FK vers federation_season
  role: ClubMemberRole;
  status: ClubMemberStatus;
  position: string | null;
  jerseyNumber: number | null;
  emergencyContact: string | null;
  emergencyPhone: string | null;
  joinedAt: string;
  createdAt?: string;
  updatedAt?: string;
};
```

- [ ] **Step 3: Modifier le modèle `club-member.model.ts`**

Remplacer les imports `Club` et `Season` supprimés par `TitanClubAccount` et `FederationSeason` :

```ts
import { TitanClubAccount } from './club-account.model';
import { FederationSeason } from '../federation/federation-season.model';
```

Renommer le champ `clubId` en `clubAccountId` (avec la FK pointant vers `TitanClubAccount`). Le champ `seasonId` change sa cible vers `FederationSeason`. Le `CreationModel` doit refléter les nouveaux noms.

Code final :

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IClubMember, ClubMemberRole, ClubMemberStatus } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { TitanClubAccount } from './club-account.model';
import { User } from '../user.model';
import { FederationSeason } from '../federation/federation-season.model';
import { License } from './license.model';
import { MedicalCertificate } from './medical-certificate.model';

export type CreationModelClubMember = WithRequired<
  Partial<IClubMember>,
  'clubAccountId' | 'userId' | 'seasonId' | 'role'
>;

@Table({ tableName: 'titan_club_member', paranoid: false, timestamps: true })
export class ClubMember extends CustomModel<IClubMember, CreationModelClubMember> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => TitanClubAccount)
  @Column({ type: DataType.UUID })
  clubAccountId: string;

  @AllowNull(false) @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @AllowNull(false) @ForeignKey(() => FederationSeason)
  @Column({ type: DataType.UUID })
  seasonId: string;

  @AllowNull(false) @Default(ClubMemberRole.PLAYER)
  @Column({ type: DataType.ENUM(...Object.values(ClubMemberRole)) })
  role: ClubMemberRole;

  @AllowNull(false) @Default(ClubMemberStatus.ACTIVE)
  @Column({ type: DataType.ENUM(...Object.values(ClubMemberStatus)) })
  status: ClubMemberStatus;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  position: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.INTEGER })
  jerseyNumber: number | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  emergencyContact: string | null;

  @AllowNull(true) @Default(null) @Column({ type: DataType.STRING })
  emergencyPhone: string | null;

  @AllowNull(false) @Default(() => new Date())
  @Column({ type: DataType.DATE })
  joinedAt: string;

  @BelongsTo(() => TitanClubAccount)
  clubAccount: TitanClubAccount;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => FederationSeason)
  season: FederationSeason;

  @HasMany(() => License)
  licenses: License[];

  @HasMany(() => MedicalCertificate)
  medicalCertificates: MedicalCertificate[];
}
```

- [ ] **Step 4: Build**

```bash
cd packages/titan_core && pnpm run tsc && cd ../../apps/api-titan && pnpm run tsc
```

---

### Task 13 : `titan_license` → FK vers `federation_player`

**Files:**
- Modify: `packages/titan_core/src/types/interface/models/titan/license.model.ts`
- Modify: `apps/api-titan/src/database/models/titan/license.model.ts`

- [ ] **Step 1: Lire l'interface et le modèle actuels**

```bash
cat packages/titan_core/src/types/interface/models/titan/license.model.ts
cat apps/api-titan/src/database/models/titan/license.model.ts
```

- [ ] **Step 2: Adapter l'interface**

Remplacer toute occurrence de `playerId: string` (ou équivalent qui pointait vers l'ancien `Player`) par `federationPlayerId: string`. Le champ `seasonId` (s'il existe) doit désormais pointer vers `federation_season`.

- [ ] **Step 3: Adapter le modèle**

Remplacer les imports `Player` et `Season` supprimés par :

```ts
import { FederationPlayer } from '../federation/federation-player.model';
import { FederationSeason } from '../federation/federation-season.model';
```

Renommer la FK `playerId` → `federationPlayerId` avec `@ForeignKey(() => FederationPlayer)`. Adapter `seasonId` pour pointer vers `FederationSeason`. Adapter le `CreationModel` et le `BelongsTo` correspondants.

- [ ] **Step 4: Build**

```bash
cd packages/titan_core && pnpm run tsc && cd ../../apps/api-titan && pnpm run tsc
```

---

### Task 14 : `titan_medical_certificate` → FK vers `federation_player`

**Files:**
- Modify: `packages/titan_core/src/types/interface/models/titan/medical-certificate.model.ts`
- Modify: `apps/api-titan/src/database/models/titan/medical-certificate.model.ts`

- [ ] **Step 1: Lire l'existant**

```bash
cat packages/titan_core/src/types/interface/models/titan/medical-certificate.model.ts
cat apps/api-titan/src/database/models/titan/medical-certificate.model.ts
```

- [ ] **Step 2: Adapter l'interface**

Remplacer `playerId` → `federationPlayerId` (FK vers `federation_player`).

- [ ] **Step 3: Adapter le modèle**

Import `FederationPlayer` à la place de `Player`. FK et BelongsTo mis à jour.

- [ ] **Step 4: Build**

```bash
cd packages/titan_core && pnpm run tsc && cd ../../apps/api-titan && pnpm run tsc
```

---

### Task 15 : `titan_training` → FK vers `federation_team`

**Files:**
- Modify: `packages/titan_core/src/types/interface/models/titan/training.model.ts`
- Modify: `apps/api-titan/src/database/models/titan/training.model.ts`

- [ ] **Step 1: Adapter l'interface**

Remplacer `teamId: string;` par `federationTeamId: string;`. Le champ `venueId` désigne désormais une `federation_venue` (au lieu de l'ancien `titan_venue` supprimé).

- [ ] **Step 2: Adapter le modèle**

Imports :
```ts
import { FederationTeam } from '../federation/federation-team.model';
import { FederationVenue } from '../federation/federation-venue.model';
```

Le code complet du modèle après refactor :

```ts
import {
  DataType, Column, IsUUID, PrimaryKey, Table, Default,
  AllowNull, ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ITraining, TrainingRecurrence } from 'titan_core';
import { WithRequired } from '../../../core';
import { CustomModel } from '../../custom/custom-model.model';
import { FederationTeam } from '../federation/federation-team.model';
import { FederationVenue } from '../federation/federation-venue.model';
import { TrainingAttendance } from './training-attendance.model';

export type CreationModelTraining = WithRequired<
  Partial<ITraining>,
  'federationTeamId' | 'date' | 'startTime' | 'endTime'
>;

@Table({ tableName: 'titan_training', paranoid: false, timestamps: true })
export class Training extends CustomModel<ITraining, CreationModelTraining> {
  @IsUUID(4) @PrimaryKey @Default(() => uuidv4())
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false) @ForeignKey(() => FederationTeam)
  @Column({ type: DataType.UUID })
  federationTeamId: string;

  @AllowNull(true) @ForeignKey(() => FederationVenue)
  @Default(null) @Column({ type: DataType.UUID })
  venueId: string | null;

  @AllowNull(false) @Column({ type: DataType.DATEONLY })
  date: string;

  @AllowNull(false) @Column({ type: DataType.TIME })
  startTime: string;

  @AllowNull(false) @Column({ type: DataType.TIME })
  endTime: string;

  @AllowNull(false) @Default(TrainingRecurrence.ONCE)
  @Column({ type: DataType.ENUM(...Object.values(TrainingRecurrence)) })
  recurrence: TrainingRecurrence;

  @AllowNull(false) @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isCancelled: boolean;

  @AllowNull(true) @Default(null) @Column({ type: DataType.TEXT })
  notes: string | null;

  @BelongsTo(() => FederationTeam)
  team: FederationTeam;

  @BelongsTo(() => FederationVenue)
  venue: FederationVenue;

  @HasMany(() => TrainingAttendance)
  attendance: TrainingAttendance[];
}
```

- [ ] **Step 3: Build**

```bash
cd packages/titan_core && pnpm run tsc && cd ../../apps/api-titan && pnpm run tsc
```

---

### Task 16 : `titan_training_attendance` → FK vers `federation_player`

**Files:**
- Modify: `packages/titan_core/src/types/interface/models/titan/training-attendance.model.ts`
- Modify: `apps/api-titan/src/database/models/titan/training-attendance.model.ts`

- [ ] **Step 1: Lire l'existant**

```bash
cat packages/titan_core/src/types/interface/models/titan/training-attendance.model.ts
cat apps/api-titan/src/database/models/titan/training-attendance.model.ts
```

- [ ] **Step 2: Adapter**

Remplacer `playerId` → `federationPlayerId` (FK vers `FederationPlayer`).

- [ ] **Step 3: Build**

```bash
cd packages/titan_core && pnpm run tsc && cd ../../apps/api-titan && pnpm run tsc
```

---

### Task 17 : Finance — `titan_fee_plan`, `titan_payment`, `titan_budget_entry` → FK vers `titan_club_account` (et `federation_player` pour payment)

**Files:**
- Modify: `packages/titan_core/src/types/interface/models/titan/fee-plan.model.ts`
- Modify: `packages/titan_core/src/types/interface/models/titan/payment.model.ts`
- Modify: `packages/titan_core/src/types/interface/models/titan/budget-entry.model.ts`
- Modify: `apps/api-titan/src/database/models/titan/fee-plan.model.ts`
- Modify: `apps/api-titan/src/database/models/titan/payment.model.ts`
- Modify: `apps/api-titan/src/database/models/titan/budget-entry.model.ts`

- [ ] **Step 1: Lire l'existant**

```bash
cat packages/titan_core/src/types/interface/models/titan/fee-plan.model.ts
cat packages/titan_core/src/types/interface/models/titan/payment.model.ts
cat packages/titan_core/src/types/interface/models/titan/budget-entry.model.ts
cat apps/api-titan/src/database/models/titan/fee-plan.model.ts
cat apps/api-titan/src/database/models/titan/payment.model.ts
cat apps/api-titan/src/database/models/titan/budget-entry.model.ts
```

- [ ] **Step 2: Adapter `fee-plan`**

Remplacer `clubId` → `clubAccountId` (FK vers `TitanClubAccount`). Si présent, `seasonId` doit pointer vers `federation_season`.

- [ ] **Step 3: Adapter `payment`**

Remplacer `clubId` → `clubAccountId` (FK vers `TitanClubAccount`). Remplacer `playerId` (s'il existe) → `federationPlayerId` (FK vers `FederationPlayer`).

- [ ] **Step 4: Adapter `budget-entry`**

Remplacer `clubId` → `clubAccountId` (FK vers `TitanClubAccount`).

- [ ] **Step 5: Build**

```bash
cd packages/titan_core && pnpm run tsc && cd ../../apps/api-titan && pnpm run tsc
```

---

### Task 18 : `titan_club_invitation`, `titan_staff_role` → FK vers `titan_club_account`

**Files:**
- Modify: `packages/titan_core/src/types/interface/models/titan/club-invitation.model.ts`
- Modify: `packages/titan_core/src/types/interface/models/titan/staff-role.model.ts`
- Modify: `apps/api-titan/src/database/models/titan/club-invitation.model.ts`
- Modify: `apps/api-titan/src/database/models/titan/staff-role.model.ts`

- [ ] **Step 1: Lire les fichiers**

```bash
cat packages/titan_core/src/types/interface/models/titan/club-invitation.model.ts
cat packages/titan_core/src/types/interface/models/titan/staff-role.model.ts
cat apps/api-titan/src/database/models/titan/club-invitation.model.ts
cat apps/api-titan/src/database/models/titan/staff-role.model.ts
```

- [ ] **Step 2: Adapter chacun**

Remplacer `clubId` → `clubAccountId` (FK vers `TitanClubAccount`).

- [ ] **Step 3: Build complet et redémarrer**

```bash
cd packages/titan_core && pnpm run tsc && cd ../../apps/api-titan && pnpm run tsc && pnpm run dev
```

À ce point, toutes les tables `titan_*` conservées sont repointées et le serveur démarre. Vérifier en BDD que les FK existent bien (ex : `\d titan_training` doit montrer `federationTeamId` au lieu de `teamId`).

---

## Phase G — Reconstruire les controllers / services / routes refactorés

### Task 19 : Adapter `member.service.ts` (remplace les références `Club`, `Season`, `Player`)

**Files:**
- Read: `apps/api-titan/src/services/titan/member.service.ts`
- Modify: ce fichier

- [ ] **Step 1: Lire le service actuel**

```bash
cat apps/api-titan/src/services/titan/member.service.ts
```

- [ ] **Step 2: Identifier toutes les occurrences de modèles supprimés**

Chercher dans le fichier : `Club`, `Player`, `Season`, `Team`, etc. (sans préfixe `Federation` ni `TitanClubAccount`). Repérer chaque endroit qui doit changer.

- [ ] **Step 3: Remplacer**

Règles de remplacement :
- `Club` → `TitanClubAccount` (import depuis `'../../database'`)
- `Player` → `FederationPlayer`
- `Season` → `FederationSeason`
- `Team` → `FederationTeam`
- `clubId` (en propriété/FK) → `clubAccountId`
- `playerId` (en propriété/FK vers ex-Player) → `federationPlayerId`
- `teamId` → `federationTeamId`
- Toute requête `Player.findOne({ where: { clubId, ... }})` devient `FederationPlayer.findOne` avec join sur `titan_player_profile` si nécessaire pour filtrer par club d'app.

- [ ] **Step 4: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

Corriger les erreurs reportées.

---

### Task 20 : Adapter `member.controller.ts` (idem)

**Files:**
- Read: `apps/api-titan/src/api/controllers/titan/member.controller.ts`
- Modify: ce fichier

- [ ] **Step 1: Lire le controller**

```bash
cat apps/api-titan/src/api/controllers/titan/member.controller.ts
```

- [ ] **Step 2: Mêmes règles de remplacement que Task 19**

- [ ] **Step 3: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 21 : Adapter `member.validation.ts` et `member.route.ts`

**Files:**
- Read & Modify: `apps/api-titan/src/api/validations/titan/member.validation.ts`
- Read & Modify: `apps/api-titan/src/api/routes/titan/member.route.ts`

- [ ] **Step 1: Lire les deux fichiers**

```bash
cat apps/api-titan/src/api/validations/titan/member.validation.ts
cat apps/api-titan/src/api/routes/titan/member.route.ts
```

- [ ] **Step 2: Remplacer dans validation**

Si le schéma Joi référence `clubId`, le renommer en `clubAccountId`. Idem pour `playerId` → `federationPlayerId` quand pertinent.

- [ ] **Step 3: Remplacer dans route**

Les paramètres de chemin `/:clubId` deviennent `/:clubAccountId` (à confirmer selon la convention du projet — peut rester `/:clubId` côté URL si on préfère mais le code derrière prend `clubAccountId`).

- [ ] **Step 4: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 22 : Adapter `training.{controller,service,validation,route}.ts`

**Files:**
- Read & Modify: les 4 fichiers training

- [ ] **Step 1: Lire les 4 fichiers**

```bash
cat apps/api-titan/src/services/titan/training.service.ts
cat apps/api-titan/src/api/controllers/titan/training.controller.ts
cat apps/api-titan/src/api/validations/titan/training.validation.ts
cat apps/api-titan/src/api/routes/titan/training.route.ts
```

- [ ] **Step 2: Appliquer les règles de remplacement**

Mêmes que Task 19 :
- `Team` → `FederationTeam`
- `Venue` → `FederationVenue`
- `Player` → `FederationPlayer`
- `teamId` → `federationTeamId`
- `playerId` → `federationPlayerId`
- Les associations `team.players` (qui passait par `TeamPlayer`) deviennent une jointure sur `federation_team_member`.

- [ ] **Step 3: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 23 : Adapter `finance.{controller,service,validation,route}.ts`

**Files:**
- Read & Modify: les 4 fichiers finance

- [ ] **Step 1: Lire les 4 fichiers**

```bash
cat apps/api-titan/src/services/titan/finance.service.ts
cat apps/api-titan/src/api/controllers/titan/finance.controller.ts
cat apps/api-titan/src/api/validations/titan/finance.validation.ts
cat apps/api-titan/src/api/routes/titan/finance.route.ts
```

- [ ] **Step 2: Remplacer**

- `Club` → `TitanClubAccount`
- `clubId` → `clubAccountId`
- `Player` → `FederationPlayer`
- `playerId` (sur Payment) → `federationPlayerId`

- [ ] **Step 3: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

## Phase H — Onboarding club (recherche + claim)

### Task 24 : Service `OnboardingService` (recherche fédération + claim)

**Files:**
- Create: `apps/api-titan/src/services/titan/onboarding.service.ts`
- Modify: `apps/api-titan/src/services/titan/index.ts`

- [ ] **Step 1: Créer le service**

```ts
import { Op } from 'sequelize';
import createError from 'http-errors';
import { Service } from '../../core';
import {
  FederationClub, Federation, TitanClubAccount,
} from '../../database';
import { FederationCode } from 'titan_core';

class OnboardingService extends Service {
  /**
   * Recherche des federation_club par nom partiel ou code externe.
   * Filtre optionnel par fédération.
   */
  async searchFederationClubs(
    query: string,
    federationCode?: FederationCode,
  ): Promise<FederationClub[]> {
    const federationWhere = federationCode ? { code: federationCode } : {};

    return FederationClub.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { shortName: { [Op.iLike]: `%${query}%` } },
          { externalId: query },
        ],
      },
      include: [
        {
          model: Federation,
          where: federationWhere,
          required: true,
        },
      ],
      limit: 25,
      order: [['name', 'ASC']],
    });
  }

  /**
   * Vérifie qu'un federation_club existe et n'est pas déjà revendiqué.
   */
  async checkClaimAvailability(federationClubId: string): Promise<{
    federationClub: FederationClub;
    alreadyClaimed: boolean;
  }> {
    const federationClub = await FederationClub.findByPk(federationClubId);
    if (!federationClub) throw createError(404, 'Federation club not found');

    const existing = await TitanClubAccount.findOne({
      where: { federationClubId },
    });

    return {
      federationClub,
      alreadyClaimed: existing !== null,
    };
  }

  /**
   * Crée un titan_club_account rattaché à un federation_club.
   * Échoue si le club est déjà revendiqué.
   */
  async claimFederationClub(
    federationClubId: string,
    options: {
      displayName?: string;
      subscriptionPlan?: string;
    } = {},
  ): Promise<TitanClubAccount> {
    const { alreadyClaimed } = await this.checkClaimAvailability(federationClubId);
    if (alreadyClaimed) {
      throw createError(409, 'This federation club is already claimed on Titan');
    }

    const account = await TitanClubAccount.create({
      federationClubId,
      displayName: options.displayName ?? null,
      subscriptionPlan: options.subscriptionPlan ?? 'free',
      subscriptionStatus: 'active',
      subscribedAt: new Date().toISOString(),
    });

    this.logger.log(
      `Titan club account ${account.id} claimed federation_club ${federationClubId}`,
    );
    return account;
  }
}

export default new OnboardingService();
```

- [ ] **Step 2: Re-exporter**

Modify `apps/api-titan/src/services/titan/index.ts` — ajouter :

```ts
export { default as onboardingService } from './onboarding.service';
```

- [ ] **Step 3: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 25 : Validation `onboarding.validation.ts`

**Files:**
- Create: `apps/api-titan/src/api/validations/titan/onboarding.validation.ts`

- [ ] **Step 1: Créer le fichier**

```ts
import Joi from 'joi';
import { FederationCode } from 'titan_core';

class OnboardingValidation {
  searchQuery(query: any) {
    const schema = Joi.object({
      q: Joi.string().trim().min(2).required(),
      federation: Joi.string()
        .valid(...Object.values(FederationCode))
        .optional(),
    });
    const { value, error } = schema.validate(query);
    if (error) throw new Error(error.message);
    return value as { q: string; federation?: FederationCode };
  }

  claimBody(body: any) {
    const schema = Joi.object({
      federationClubId: Joi.string().uuid().required(),
      displayName: Joi.string().trim().max(255).optional(),
      subscriptionPlan: Joi.string().valid('free', 'pro', 'enterprise').optional(),
    });
    const { value, error } = schema.validate(body);
    if (error) throw new Error(error.message);
    return value as {
      federationClubId: string;
      displayName?: string;
      subscriptionPlan?: 'free' | 'pro' | 'enterprise';
    };
  }
}

export default new OnboardingValidation();
```

- [ ] **Step 2: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 26 : Controller `onboarding.controller.ts`

**Files:**
- Create: `apps/api-titan/src/api/controllers/titan/onboarding.controller.ts`

- [ ] **Step 1: Créer le fichier**

```ts
import { Request, Response } from 'express';
import { IResponse } from 'titan_core';
import { Controller, LoggerModel, ILocals } from '../../../core';
import { onboardingService } from '../../../services/titan';
import OnboardingValidation from '../../validations/titan/onboarding.validation';

class OnboardingController implements Controller {
  private static readonly logger = new LoggerModel(OnboardingController.name);

  async searchFederationClubs(
    req: Request,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const { q, federation } = OnboardingValidation.searchQuery(req.query);
    const clubs = await onboardingService.searchFederationClubs(q, federation);
    res.json({ data: clubs });
  }

  async checkAvailability(
    req: Request<{ federationClubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const result = await onboardingService.checkClaimAvailability(
      req.params.federationClubId,
    );
    res.json({ data: result });
  }

  async claim(
    req: Request,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = OnboardingValidation.claimBody(req.body);
    const account = await onboardingService.claimFederationClub(
      body.federationClubId,
      { displayName: body.displayName, subscriptionPlan: body.subscriptionPlan },
    );
    res.json({ data: account });
  }
}

export default new OnboardingController();
```

- [ ] **Step 2: Type-check**

```bash
cd apps/api-titan && pnpm run tsc
```

---

### Task 27 : Route `onboarding.route.ts`

**Files:**
- Create: `apps/api-titan/src/api/routes/titan/onboarding.route.ts`
- Modify: `apps/api-titan/src/api/routes/index.ts`

- [ ] **Step 1: Créer la route**

```ts
import { Router } from 'express';
import onboardingController from '../../controllers/titan/onboarding.controller';
import auth from '../../middlewares/auth';

const route = Router();

export const TitanOnboardingRouter = (app: Router): Router => {
  app.use('/titan/onboarding', route);

  // Recherche des clubs FFHB (et autres fédérations à terme)
  route.get('/federation-clubs', auth, onboardingController.searchFederationClubs);

  // Vérification de disponibilité avant claim
  route.get(
    '/federation-clubs/:federationClubId/availability',
    auth,
    onboardingController.checkAvailability,
  );

  // Création du titan_club_account
  route.post('/claim', auth, onboardingController.claim);

  return route;
};
```

- [ ] **Step 2: Enregistrer la route**

Modify `apps/api-titan/src/api/routes/index.ts` — ajouter :

```ts
export * from './titan/onboarding.route';
```

- [ ] **Step 3: Vérifier que `apiLoader` charge bien cette route**

Lire `apps/api-titan/src/loaders/api.loader.ts` pour s'assurer qu'il itère sur tous les exports du `routes/index.ts`. Si la liste est explicite (chaque route ajoutée à la main), ajouter `TitanOnboardingRouter` à l'appel.

- [ ] **Step 4: Type-check + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```

---

## Phase I — Dashboard et tests fonctionnels

### Task 28 : Adapter `dashboard.{controller,service,route}.ts`

**Files:**
- Read & Modify: les 3 fichiers dashboard

- [ ] **Step 1: Lire les 3 fichiers**

```bash
cat apps/api-titan/src/services/titan/dashboard.service.ts
cat apps/api-titan/src/api/controllers/titan/dashboard.controller.ts
cat apps/api-titan/src/api/routes/titan/dashboard.route.ts
```

- [ ] **Step 2: Identifier les requêtes touchées**

Le dashboard agrège : nombre de membres, prochains matchs, résultats récents, alertes. Les sources changent :
- "Nombre de membres" : `ClubMember` filtré par `clubAccountId`.
- "Prochains matchs" : `FederationMatch` joint à `FederationTeam` joint à `TitanClubAccount.federationClubId` + `TitanFriendlyMatch` filtré par `clubAccountId`.
- "Stats équipe" : `FederationPlayerSeasonStats` ou `FederationPoolStanding`.

- [ ] **Step 3: Refactorer**

Adapter les requêtes Sequelize en conséquence. Tester que chaque endpoint renvoie une structure cohérente avec ce que le front consommait — vérifier dans `apps/front-titan/src/pages/Dashboard/` pour confirmer les noms de champs attendus.

- [ ] **Step 4: Type-check + redémarrer**

```bash
cd apps/api-titan && pnpm run tsc && pnpm run dev
```

---

### Task 29 : Vérification end-to-end manuelle

**Files:** (aucun changement)

- [ ] **Step 1: Vérifier la liste des tables titan_***

En BDD :
```sql
\dt titan_*
```
Attendu (liste finale) :
```
titan_budget_entry
titan_club_account
titan_club_invitation
titan_club_member
titan_fee_plan
titan_friendly_match
titan_friendly_match_event
titan_friendly_match_lineup
titan_license
titan_medical_certificate
titan_payment
titan_player_profile
titan_staff_role
titan_team_settings
titan_training
titan_training_attendance
```
**Tables qui ne doivent PLUS exister :** `titan_club`, `titan_team`, `titan_team_player`, `titan_player`, `titan_match`, `titan_match_lineup`, `titan_match_event`, `titan_player_match_stats`, `titan_player_season_stats`, `titan_team_season_stats`, `titan_season`, `titan_venue`, `titan_sport_config`.

- [ ] **Step 2: Test fonctionnel onboarding via Postman**

1. `GET /titan/onboarding/federation-clubs?q=test` → 200 avec une liste vide ou les `federation_club` matchés.
2. Créer manuellement un `federation_club` en BDD pour pouvoir le claim.
3. `POST /titan/onboarding/claim` avec body `{ "federationClubId": "<uuid>" }` → 200 avec le `titan_club_account` créé.
4. Re-claim le même → 409 conflict.

- [ ] **Step 3: Test fonctionnel member/training/finance**

Tester au moins une route de chaque domaine pour confirmer qu'elles fonctionnent avec les nouveaux modèles. Pas besoin de couvrir tout — juste vérifier qu'il n'y a pas de regression "modèle inconnu".

---

## Phase J — Documentation

### Task 30 : Document `titan-refactor.md`

**Files:**
- Create: `docs/architecture/titan-refactor.md`

- [ ] **Step 1: Créer le document**

```markdown
# Refactor `titan_*` — Couche app sur référentiel fédéral

> **Statut :** Refactor effectué (Plan 2). Pour le contexte, voir le spec [`../superpowers/specs/2026-05-17-ffhb-scraping-and-federation-model-design.md`](../superpowers/specs/2026-05-17-ffhb-scraping-and-federation-model-design.md) section 5.

## Vue d'ensemble

Avant ce refactor, les tables `titan_*` portaient à la fois :
- l'**identité** des entités (club, équipe, joueur, match) ;
- les **données app** spécifiques aux clubs inscrits sur Titan (cotisations, entraînements, contacts urgence…).

Le refactor sépare ces deux responsabilités :
- L'**identité** part dans le référentiel fédéral (`federation_*`, voir [`data-model.md`](./data-model.md)).
- Les **données app** restent dans `titan_*` mais référencent désormais le référentiel.

Résultat : un club non encore inscrit sur Titan existe quand même en BDD (puisqu'on scrape la FFHB en entier), et son inscription crée simplement un `titan_club_account` qui se rattache à l'entité fédérale.

## Mapping ancien → nouveau

| Ancien | Nouveau | Notes |
|---|---|---|
| `titan_club` | `federation_club` (identité) + `titan_club_account` (compte SaaS) | Lien 1-1 unique |
| `titan_team` | `federation_team` + `titan_team_settings` | Coach app, notes internes, couleur |
| `titan_player` | `federation_player` + `titan_player_profile` | Photo perso, contacts urgence, droit à l'image |
| `titan_team_player` | `federation_team_member` | Historisé |
| `titan_match` (fédéraux) | `federation_match` | |
| `titan_match` (amicaux) | `titan_friendly_match` | Référence 2 `federation_team` |
| `titan_match_lineup` | `federation_match_lineup` + `titan_friendly_match_lineup` | |
| `titan_match_event` | `federation_match_event` + `titan_friendly_match_event` | |
| `titan_player_match_stats` | `federation_player_match_stats` + extension sport | |
| `titan_player_season_stats` | `federation_player_season_stats` + extension sport | |
| `titan_team_season_stats` | `federation_pool_standing` | |
| `titan_season` | `federation_season` | |
| `titan_venue` | `federation_venue` | Tous les gymnases passent dans le référentiel (incl. salles privées si nécessaire via `isManual: true`) |
| `titan_sport_config` | `SportModule` (code, `titan_core`) | Plus de config en BDD |

## Tables conservées (avec FK repointées)

| Table | Anciennes FK | Nouvelles FK |
|---|---|---|
| `titan_club_member` | `clubId → titan_club`, `seasonId → titan_season` | `clubAccountId → titan_club_account`, `seasonId → federation_season` |
| `titan_license` | `playerId → titan_player` | `federationPlayerId → federation_player` |
| `titan_medical_certificate` | `playerId → titan_player` | `federationPlayerId → federation_player` |
| `titan_training` | `teamId → titan_team`, `venueId → titan_venue` | `federationTeamId → federation_team`, `venueId → federation_venue` |
| `titan_training_attendance` | `playerId → titan_player` | `federationPlayerId → federation_player` |
| `titan_fee_plan` | `clubId → titan_club` | `clubAccountId → titan_club_account` |
| `titan_payment` | `clubId`, `playerId` | `clubAccountId`, `federationPlayerId` |
| `titan_budget_entry` | `clubId → titan_club` | `clubAccountId → titan_club_account` |
| `titan_club_invitation` | `clubId → titan_club` | `clubAccountId → titan_club_account` |
| `titan_staff_role` | `clubId → titan_club` | `clubAccountId → titan_club_account` |

## Nouvelles tables app

- **`titan_club_account`** — compte SaaS d'un club inscrit, rattaché 1-1 à un `federation_club`. Porte plan d'abonnement, dates, branding override.
- **`titan_team_settings`** — config app pour une équipe fédérale : coach (utilisateur Titan), notes, couleur d'affichage.
- **`titan_player_profile`** — données app pour un joueur fédéral : photo perso, contacts d'urgence, droit à l'image, lien vers compte utilisateur.
- **`titan_friendly_match`** + **`_lineup`** + **`_event`** — matchs amicaux hors fédération, créés manuellement par les clubs inscrits.
```

---

### Task 31 : Document `onboarding-club.md`

**Files:**
- Create: `docs/architecture/onboarding-club.md`

- [ ] **Step 1: Créer le document**

```markdown
# Workflow d'onboarding club Titan

> Comment un club affilié FFHB s'inscrit sur Titan et rattache ses données.

## Pré-requis

Le club doit déjà exister dans le **référentiel fédéral** (`federation_club`). Deux possibilités :
1. Le scrapper l'a déjà découvert lors d'un sync précédent (cas standard).
2. Un admin Titan crée le `federation_club` manuellement (`isManual: true`) — cas exceptionnel pour les clubs très nouveaux ou les amicaux étrangers.

## Diagramme de séquence

\`\`\`mermaid
sequenceDiagram
    actor Admin as Admin club
    participant UI as Front Titan
    participant API as API /titan/onboarding/*
    participant DB as Postgres

    Admin->>UI: Tape le nom du club
    UI->>API: GET /federation-clubs?q=Cesson
    API->>DB: SELECT federation_club WHERE name ILIKE ...
    DB-->>API: liste federation_club
    API-->>UI: 200 OK + liste
    UI-->>Admin: Affiche les clubs

    Admin->>UI: Sélectionne "Cesson Rennes Métropole HB"
    UI->>API: GET /federation-clubs/:id/availability
    API->>DB: SELECT titan_club_account WHERE federationClubId
    DB-->>API: 0 résultat
    API-->>UI: { alreadyClaimed: false }

    Admin->>UI: Confirme la création du compte
    UI->>API: POST /claim { federationClubId, displayName?, plan? }
    API->>DB: INSERT titan_club_account
    DB-->>API: created
    API-->>UI: 201 OK + titan_club_account
    UI-->>Admin: Bienvenue ! Dashboard du club affiché
\`\`\`

## Endpoints exposés

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/titan/onboarding/federation-clubs?q=<query>&federation=<code>?` | Recherche par nom partiel ou code externe. Limite 25 résultats. |
| `GET` | `/titan/onboarding/federation-clubs/:federationClubId/availability` | Vérifie qu'un club fédéral peut être revendiqué (pas déjà claimé). |
| `POST` | `/titan/onboarding/claim` | Crée le `titan_club_account`. Body : `{ federationClubId, displayName?, subscriptionPlan? }` |

## Cas marginaux

- **Club déjà revendiqué** → `POST /claim` retourne `409 Conflict`. À terme, on ajoutera un mécanisme d'invitation/transfert pour gérer les changements de propriétaire.
- **Club introuvable dans le référentiel** → l'utilisateur peut soit attendre le prochain sync FFHB, soit demander à un admin Titan de créer le `federation_club` manuellement.
- **Vérification d'identité** → pour l'instant, n'importe quel utilisateur authentifié peut claimer n'importe quel club. À renforcer plus tard (validation par email du club, code de vérification fédéral, etc.). C'est explicitement hors périmètre de cette implémentation initiale.

## Suite : invitations

Une fois le `titan_club_account` créé, l'admin peut inviter d'autres utilisateurs via `titan_club_invitation` (endpoint déjà existant adapté en Task 18). Le flux d'invitation n'est pas modifié par ce refactor — seul le FK source change (`clubAccountId` à la place de `clubId`).
```

---

## Tâches finales — Récapitulatif Plan 2

À la fin de l'exécution :

- ✅ Tables d'identité dupliquées supprimées (`titan_club`, `titan_team`, `titan_player`, `titan_match*`, etc.).
- ✅ Nouvelles tables app créées : `titan_club_account`, `titan_team_settings`, `titan_player_profile`, `titan_friendly_match*`.
- ✅ Tables conservées repointées vers `federation_*` ou `titan_club_account`.
- ✅ Controllers/services/routes : member, training, finance, dashboard refactorés. Anciens club/team/player/match/stats supprimés.
- ✅ Onboarding fonctionnel (`/titan/onboarding/*`).
- ✅ Documentation : `titan-refactor.md`, `onboarding-club.md`.

**Fichiers modifiés/créés à committer manuellement** (rappel : Claude ne fait aucune action git) :

Suppressions :
- 13 modèles `titan_*` obsolètes
- 5 paires controller/route/service/validation (`club`, `team`, `player`, `match`, `stats`)
- 13 interfaces titan_core obsolètes
- Plusieurs DTO titan_core

Créations :
- 4 modèles app + interfaces (`club_account`, `team_settings`, `player_profile`, `friendly_match*`)
- 3 fichiers onboarding (controller, service, validation, route)
- 2 fichiers de doc (`titan-refactor.md`, `onboarding-club.md`)

Modifications :
- 10 modèles conservés (FK repointées)
- 4 controllers + services + validations + routes conservés (member, training, finance, dashboard)
- Index et loaders
