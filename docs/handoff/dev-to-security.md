# Dev to Security Handoff E1-S6 Bug-0003

## Security Context
1. Scope dieses Runs ist rein dokumentativ fuer Story `E1-S6` und Bug `bug-0003`.
2. Der Security-relevante Seed-Reset-Flow bleibt unveraendert: local-only URI-Guard plus `ALLOW_DESTRUCTIVE_SEED_RESET=true` Opt-In.
3. Es wurden keine Architektur-, API- oder Retrieval-Contracts geaendert.

## Sicherheitsrelevante Eingaben und Endpoints
1. Sicherheitsrelevante Eingaben im Story-Kontext bleiben `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`, `ALLOW_DESTRUCTIVE_SEED_RESET`.
2. Sicherheitsrelevanter Endpoint bleibt `POST /api/query` im bestehenden Contract-Kontext.
3. Der lokale Maintenance-Command `seed:local:reset-reseed` bleibt destruktiv, aber auf lokale Runtime plus explizites Opt-In begrenzt.

## Bekannte Sicherheitsgrenzen und offene Risiken
1. Der Integrations-Test in `local-seed-reset.test.ts` bleibt ohne vollstaendige lokale Neo4j-Umgebung `skipped`.
2. Es gibt weiterhin keinen automatisierten Security-Recheck-Job fuer destruktive lokale Maintenance-Commands.
3. Das Bugfix-Delta selbst aendert kein Laufzeitverhalten und reduziert nur Fehlinterpretation der Test-Evidenz.

## Gezielte Security-Pruefpunkte fuer Epic-Gate
1. Verifizieren, dass Doku und Runbooks fuer E1-S6 konsistent das exakte Scope-Kommando `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts` verwenden.
2. Verifizieren, dass local-only Guard und Opt-In-Anforderung im Seed-Reset-Code unveraendert aktiv bleiben.
3. Verifizieren, dass keine nicht-lokalen destruktiven Ausfuehrungspfade eingefuehrt wurden.
4. Verifizieren, dass keine Secrets in Story, Handoffs oder Logs auftauchen.
