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
| `titan_team_player` | `federation_team_member` | Historisé (dateFrom/dateTo) |
| `titan_match` (fédéraux) | `federation_match` | |
| `titan_match` (amicaux) | `titan_friendly_match` | Référence 2 `federation_team` |
| `titan_match_lineup` | `federation_match_lineup` + `titan_friendly_match_lineup` | |
| `titan_match_event` | `federation_match_event` + `titan_friendly_match_event` | |
| `titan_player_match_stats` | `federation_player_match_stats` + extension sport | |
| `titan_player_season_stats` | `federation_player_season_stats` + extension sport | |
| `titan_team_season_stats` | `federation_pool_standing` | |
| `titan_season` | `federation_season` | |
| `titan_venue` | `federation_venue` | Salles privées éventuelles via `isManual: true` |
| `titan_sport_config` | `SportModule` (code, `titan_core`) | Plus de config en BDD |

## Tables conservées (avec FK repointées)

| Table | Anciennes FK | Nouvelles FK |
|---|---|---|
| `titan_club_member` | `clubId → titan_club`, `seasonId → titan_season` | `clubAccountId → titan_club_account`, `seasonId → federation_season` |
| `titan_license` | `clubMemberId → titan_club_member` | inchangé |
| `titan_medical_certificate` | `clubMemberId → titan_club_member` | inchangé |
| `titan_training` | `teamId → titan_team`, `venueId → titan_venue` | `federationTeamId → federation_team`, `venueId → federation_venue` |
| `titan_training_attendance` | `clubMemberId → titan_club_member` | inchangé |
| `titan_fee_plan` | `clubId → titan_club`, `seasonId → titan_season` | `clubAccountId → titan_club_account`, `seasonId → federation_season` |
| `titan_payment` | `clubMemberId → titan_club_member` (déjà bien) | inchangé |
| `titan_budget_entry` | `clubId → titan_club`, `seasonId → titan_season` | `clubAccountId → titan_club_account`, `seasonId → federation_season` |
| `titan_club_invitation` | `clubId → titan_club` | `clubAccountId → titan_club_account` |
| `titan_staff_role` | `clubId → titan_club`, `seasonId → titan_season` | `clubAccountId → titan_club_account`, `seasonId → federation_season` |

## Nouvelles tables app

- **`titan_club_account`** — compte SaaS d'un club inscrit, rattaché 1-1 à un `federation_club`. Porte plan d'abonnement, dates, branding override.
- **`titan_team_settings`** — config app pour une équipe fédérale : coach (utilisateur Titan), assistant, notes, couleur d'affichage.
- **`titan_player_profile`** — données app pour un joueur fédéral : photo perso, contacts d'urgence, droit à l'image, lien vers compte utilisateur.
- **`titan_friendly_match`** + **`_lineup`** + **`_event`** — matchs amicaux hors fédération, créés manuellement par les clubs inscrits.

## Conséquences URL/API

Tous les endpoints qui prenaient `:clubId` prennent désormais `:clubAccountId` :
- `GET /api/titan/clubs/:clubAccountId/members`
- `POST /api/titan/clubs/:clubAccountId/fee-plans`
- `GET /api/titan/clubs/:clubAccountId/dashboard`
- etc.

Le front-titan doit être mis à jour en conséquence (voir tickets dédiés).

## Limitations connues

- Le **dashboard entraîneur** retourne actuellement toutes les équipes d'un club_account, pas seulement celles où l'utilisateur est coach. La filtration fine viendra quand `titan_team_settings.coachUserId` sera systématiquement renseigné.
- Le **dashboard joueur** lit `titan_player_profile` pour résoudre `federation_player` puis les équipes via `federation_team_member`. Si un user n'a pas encore de profile, ses dashboards seront vides.
- Le `clubStatsOverview` qui dépendait du service `stats` (supprimé) n'est plus inclus dans le dashboard dirigeant. À recâbler quand on aura des agrégats équivalents sur `federation_pool_standing` / `federation_player_season_stats`.
