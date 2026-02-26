# Story E1-S6 Neo4j lokal Seed Reset und Reseed

## Status
qa

## Ziel
Ein reproduzierbarer lokaler Seed-Reset-und-Reseed-Ablauf fuer Neo4j Docker ist verfuegbar, damit die Datenbasis fuer Next.js Runtime-Reads sauber neu aufgebaut werden kann.

## Priorität
P0

## Abhängigkeiten
1. E1-S3

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Lokaler Seed Reset und Reseed ist reproduzierbar

**Given**
ein laufender lokaler Neo4j-Docker-Container, eine Seed-Quelle fuer die normalisierte Datenbasis und gesetzte Runtime-Variablen `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME` und `NEO4J_PASSWORD`

**When**
der lokale Ablauf Seed-Reset, Seed-Import und anschliessender Reseed ausgefuehrt wird

**Then**
1. wird die bestehende Seed-Datenbasis in Neo4j kontrolliert zurueckgesetzt.
2. wird die Seed-Datenbasis aus der freigegebenen Quelle erneut eingespielt.
3. sind nach dem Reseed echte Neo4j-Reads fuer mindestens zwei Nodes und zwei Relationen im lokalen Zielbetrieb wieder erfolgreich.

## Test Notes
1. `pnpm --dir apps/web seed:local:reset-reseed` erfolgreich nach lokalem Env-Load aus `.env.local` und Fallback `NEO4J_DATABASE=neo4j`; Ergebnis: `Importierte Nodes: 105`, `Importierte Relationen: 203`, `Read-Check Nodes: 105`, `Read-Check Relationen: 203`.
2. `pnpm --dir apps/web test -- src/features/seed-data/local-seed-reset.test.ts` erfolgreich mit echtem Neo4j-Integrationslauf; 25 Tests bestanden.
3. Fehlerfall verifiziert: fehlende `NEO4J_USERNAME` oder `NEO4J_PASSWORD` fuehren zu fail-fast Fehler vor Driver-Initialisierung und verhindern Teilimporte.
