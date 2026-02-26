# QA to DevOps Handoff E1-S6

## Teststatus
1. Story `E1-S6` QA-Gate: `Pass`.
2. Ausgefuehrte Pflichtchecks: `pnpm --dir apps/web lint`, `pnpm --dir apps/web test`, `pnpm --dir apps/web build`.
3. Story-spezifische Checks: `pnpm --dir apps/web seed:local:reset-reseed` und `pnpm --dir apps/web test -- src/features/seed-data/local-seed-reset.test.ts`.
4. Alle genannten Checks mit Exit Code `0`.

## Bekannte Einschraenkungen
1. Story-Gate lief im lokalen Profil.
2. Public Runtime Checks auf Vercel plus Aura sind nicht Teil dieses Story-Gates.
3. Reset-Reseed-Ablauf ist destruktiv fuer lokale Seed-Daten und env-abhaengig.

## Monitoring Hinweise
1. Beim naechsten Epic-Gate auf Neo4j-Verbindungsfehler und Auth-Fehler im Reset-Reseed-Lauf achten.
2. Laufzeitdrift zwischen local und public bei Seed-Import und Runtime-Reads frueh pruefen.
3. Build- und TypeScript-Fehler als fruehe Regressionen fuer Seed-Storys priorisieren.

## Guardrails Hinweise
1. Rate Limit Messaging muss fuer `429` konsistent Header `Retry-After` und Body-Wert abbilden.
2. Keine Secrets oder Rohqueries in Logs.
3. Lokale Reset-Skripte nur in Dev-Profilen ausfuehren und nie im Public Runtime-Pfad triggern.
