### Mise en production

# core

Rebuild avec 'pnpm run tsc'

# Front - core > package.json

"main": "src/index.ts",
"types": "src/index.ts",

# Back - core > package.json

"main": "dist/index.js",
"types": "dist/index.d.ts",

# Back - Mise en ligne

Rebuild le back

# Redémarrer les volumes API 

Appeller l'endpoint du webhook de redémarrage

# En cas de migration :

Si la stack était éteinte, d'abord en lancer une pour qu'elle fasse la migration en passant le réplika à 1 (ou l'allumer)