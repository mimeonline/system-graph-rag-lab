# Finding E1 Local Reset Missing Runtime Guard

## Titel
Lokaler Seed-Reset konnte ohne Zielumgebungs-Guard gegen nicht-lokale Neo4j Instanzen ausgefuehrt werden.

## Severity
High

## Kategorie
OWASP A05 Security Misconfiguration

## Betroffene Komponente oder Datei oder Endpoint
1. `apps/web/src/features/seed-data/local-seed-reset.ts:167`
2. `apps/web/src/features/seed-data/local-seed-reset.ts:215`
3. `apps/web/scripts/local-seed-reset-reseed.ts:4`
4. `apps/web/src/features/seed-data/local-seed-reset.test.ts:170`

## Impact
1. Historisch konnte ein falsch gesetztes `NEO4J_URI` mit gueltigen Credentials einen destruktiven Reset auf nicht-lokalen Datenbanken ausloesen.
2. Im aktuellen Stand ist dieser Impact mitigiert, weil non-local Hosts und fehlendes Opt-In vor Driver-Initialisierung hart abgewiesen werden.

## Reproduktion
1. Setze `NEO4J_URI=neo4j+s://graph.prod.example.com`, gueltige `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` und `ALLOW_DESTRUCTIVE_SEED_RESET=true`.
2. Fuehre `pnpm --dir apps/web seed:local:reset-reseed` aus.
3. Beobachtung im Recheck: Lauf bricht vor DB-Operation mit Fehler zu lokaler Host-Policy ab.
4. Evidenz im Testlauf: `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts` mit Test `rejects non-local neo4j uri before driver initialization` erfolgreich.

## Empfehlung
1. Local-Only-Guard und explizites Opt-In unveraendert beibehalten.
2. Guard-Regel bei kuenftigen Refactors durch verpflichtende Negativtests absichern.
3. Den destruktiven Command weiter nur im lokalen Maintenance-Kontext dokumentieren.

## Test-Empfehlung
1. Unit-Test fuer non-local URI Reject vor Driver-Initialisierung.
2. Unit-Test fuer fehlendes `ALLOW_DESTRUCTIVE_SEED_RESET=true`.
3. Negativtest, dass bei Guard-Fail kein Delete-Query ausgefuehrt wird.

## Status
Mitigated

## Owner
dev

## Nachverfolgung
1. Epic `backlog/epics/e1-wissensmodell-seed-daten.md`
2. Story `backlog/stories/e1-s6-neo4j-lokal-seed-reset.md`
3. Dev-Fix Commit `7316aaa`
4. QA-Recheck Commit `e101878`
