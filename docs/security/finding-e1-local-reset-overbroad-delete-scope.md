# Finding E1 Local Reset Overbroad Delete Scope

## Titel
Seed-Reset loescht alle Knoten erlaubter Labels ohne Seed-Besitzmarker.

## Severity
Medium

## Kategorie
OWASP A01 Broken Access Control

## Betroffene Komponente oder Datei oder Endpoint
1. `apps/web/src/features/seed-data/local-seed-reset.ts:210`
2. `apps/web/src/features/seed-data/local-seed-reset.ts:214`

## Impact
1. Auch fachfremde oder manuell angelegte Daten mit denselben Labels werden geloescht.
2. Der Ablauf ist nicht auf den Seed-Datensatz begrenzt und kann lokale Arbeitsdaten kollateral entfernen.

## Reproduktion
1. Lege in der Zieldatenbank einen nicht zum Seed gehoerenden Knoten an, zum Beispiel `(:Concept {id:'custom:keep', sourceType:'primary_md', sourceFile:'manual'})`.
2. Fuehre `pnpm --dir apps/web seed:local:reset-reseed` aus.
3. Pruefe, dass `custom:keep` nach dem Lauf nicht mehr vorhanden ist.

## Empfehlung
1. Fuehre einen Seed-Besitzmarker ein, zum Beispiel `seedOwner='e1_seed'` oder `seedBatchId`.
2. Begrenze den Delete-Query auf diesen Marker statt auf Label-Only.
3. Dokumentiere den Marker im Seed-Contract und im lokalen Runbook.

## Test-Empfehlung
1. Integrationstest mit Seed- und Nicht-Seed-Knoten.
2. Erwartung: Nur markierte Seed-Knoten werden geloescht.
3. Erwartung: Nicht-markierte Knoten bleiben erhalten.

## Status
Open

## Owner
dev

## Nachverfolgung
1. Epic `backlog/epics/e1-wissensmodell-seed-daten.md`
2. Story `backlog/stories/e1-s6-neo4j-lokal-seed-reset.md`
