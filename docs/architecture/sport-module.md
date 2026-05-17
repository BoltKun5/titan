# SportModule — Ajouter un nouveau sport à Titan

## Principe

Titan est conçu comme un gestionnaire de club **multi-sport**. Le handball est le premier sport supporté, mais l'architecture permet d'ajouter foot, basket, rugby ou volley sans refactor du code core.

Chaque sport est encapsulé dans un `SportModule` (TypeScript) qui définit :
- les postes de jeu valides ;
- les sous-types d'événement de match autorisés ;
- les périodes de jeu (mi-temps, quart-temps…) ;
- quelles tables d'extension SQL existent (`federation_<entity>_<sport>`).

Le `SportModule` est consommé côté **code uniquement** — il n'y a pas de table `sport_config` en BDD (c'est l'objet du Plan 2 de supprimer `titan_sport_config`).

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
   - Le `databaseLoader` charge automatiquement le dossier (cf. `models/federation/handball` enregistré dans `database.loader.ts`). Ajouter une ligne pour le nouveau sport.
8. **Tester** : `pnpm run tsc` puis `pnpm run dev`, vérifier la création des tables au log.
9. **Connecteur fédération** : voir `scraping-pipeline.md` (à venir Plan 3) pour ajouter un scraper FFR, FFF, etc.

## Décider : faut-il une table d'extension ?

Une extension n'est nécessaire **que si** le sport a des champs réellement spécifiques nécessitant une colonne SQL typée. Sinon :
- Pour les positions → utiliser le champ `position` (string) dans `federation_team_member` et `federation_match_lineup` ; la validation est faite par le `SportModule.playerPositions`.
- Pour les types d'événement → utiliser `type` (enum générique) + `subtype` (string) + `details` (JSONB) sur `federation_match_event`.

Critères pour créer une extension :
- Champs **numériques agrégés** (stats par zone de tir, par quart-temps…).
- Format **structuré spécifique** (mi-temps vs quart-temps vs sets).
- Constructeur d'ENUM SQL qui n'a de sens que pour ce sport (main de tir, etc.).

## ⚠ Convention loader

Le `databaseLoader` scanne récursivement les dossiers de modèles. Pour qu'un dossier d'extension sport soit pris en compte :
- Le dossier doit **exister** (créer un `index.ts` vide pour les nouveaux sports même sans extension).
- Une ligne `requireModules(path.join(__dirname, '../database/models/federation/X'))` doit être ajoutée dans [`apps/api-titan/src/loaders/database.loader.ts`](../../apps/api-titan/src/loaders/database.loader.ts).
- Le scanner exclut les `index.ts` (cf. `import.utils.ts`) pour éviter la double-registration. Si tu vois une erreur Sequelize `alias X used twice`, c'est généralement ce souci.

## SportModule existants

| Sport | Module | Extensions |
|---|---|---|
| Handball | [`HandballModule`](../../packages/titan_core/src/sports/handball.module.ts) | player, match, playerMatchStats, playerSeasonStats |
