# Finding E1 Local Reset Overbroad Delete Scope

## Titel
Seed-Reset loeschte historisch alle Knoten erlaubter Labels ohne Seed-Besitzmarker.

## Severity
Medium

## Kategorie
OWASP A01 Broken Access Control

## Betroffene Komponente oder Datei oder Endpoint
1. `apps/web/src/features/seed-data/local-seed-reset.ts:235`
2. `apps/web/src/features/seed-data/local-seed-reset.ts:240`
3. `apps/web/src/features/seed-data/local-seed-reset.test.ts:270`

## Impact
1. Historisch konnten fachfremde oder manuell angelegte Daten mit denselben Labels kollateral geloescht werden.
2. Im aktuellen Stand ist der Label-only Scope mitigiert, weil nur `id`-Treffer aus `seedNodeIds` geloescht werden.

## Reproduktion
1. Lege in der Zieldatenbank einen nicht zum Seed gehoerenden Knoten an, zum Beispiel `(:Concept {id:'custom:keep'})`.
2. Fuehre `pnpm --dir apps/web seed:local:reset-reseed` aus.
3. Beobachtung im Recheck: Label-only Massenloeschung ist nicht mehr moeglich, weil Delete auf `WHERE n.id IN $seedNodeIds` begrenzt ist.
4. Evidenz im Testlauf: `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts` validiert den ID-begrenzten Delete-Query.

## Empfehlung
1. ID-begrenzten Delete-Scope unveraendert beibehalten.
2. Optional zusaetzlichen Integrations-Negativtest dokumentieren, der `custom:keep` explizit erhalten muss.
3. Im Runbook klar halten, dass der Ablauf fuer Seed-IDs destruktiv bleibt.

## Test-Empfehlung
1. Unit-Test auf Query-String `WHERE n.id IN $seedNodeIds`.
2. Integrationstest mit Seed-Node plus Nicht-Seed-Node zur Erhaltungspruefung.
3. Regressionstest fuer neue Seed-Import-Generierungen mit stabilen Seed-IDs.

## Status
Mitigated

## Owner
dev

## Nachverfolgung
1. Epic `backlog/epics/e1-wissensmodell-seed-daten.md`
2. Story `backlog/stories/e1-s6-neo4j-lokal-seed-reset.md`
3. Dev-Fix Commit `7316aaa`
4. QA-Recheck Commit `e101878`
