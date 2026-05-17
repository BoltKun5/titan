# Module de scraping fédéral

> **Statut :** Pas encore implémenté. Cf. Plan 3 ([`docs/superpowers/plans/`](../../../../docs/superpowers/plans/)).

Ce module hébergera :
- `core/` : contrat `FederationScraper`, service `ScrapeRun`, mappers d'entités, résolveur de conflits.
- `ffhb/` : implémentation pour la Fédération Française de Handball.
- `jobs/` : jobs cron (nightly sync, live match, on-demand).
- `api/` : endpoints admin de trigger/inspection.

Voir le design : [`docs/superpowers/specs/2026-05-17-ffhb-scraping-and-federation-model-design.md`](../../../../docs/superpowers/specs/2026-05-17-ffhb-scraping-and-federation-model-design.md) section 6.

## Pré-requis déjà en place (Plan 1)

- Modèles `federation_*` (couche 1) opérationnels.
- Extensions `federation_*_handball` (couche 2) opérationnelles.
- `SportModule` + `HandballModule` dans `titan_core/sports`.
- Fédération FFHB seedée au démarrage de l'app (`Federation { code: 'FFHB' }`).
- Modèle d'audit `federation_scrape_run` prêt à recevoir les exécutions.
