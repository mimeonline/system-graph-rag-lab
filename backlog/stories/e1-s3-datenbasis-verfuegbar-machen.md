# Story E1-S3 Normalisierte Datenbasis im Zielbetrieb verfügbar machen

## Status
qa

## Ziel
Die normalisierte Seed-Datenbasis im lokalen Zielbetrieb mit Next.js Runtime und Neo4j Docker über echte Neo4j-Lesezugriffe abrufbar bereitstellen.

## Priorität
P0

## Abhängigkeiten
1. E1-S5

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Datenbasis ist im lokalen Next.js-und-Neo4j-Docker-Zielbetrieb abrufbar

**Given**
eine normalisierte Seed-Datenbasis mit Herkunftskennzeichnung, eine laufende lokale Next.js Runtime und ein laufender lokaler Neo4j-Docker-Container mit gesetzten Runtime-Variablen `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME` und `NEO4J_PASSWORD`

**When**
ein Runtime-Read der lokal gestarteten Anwendung echte Nodes und Relationen direkt aus Neo4j liest

**Then**
1. werden Nodes und Relationen aus der normalisierten Datenbasis fehlerfrei aus Neo4j gelesen.
2. bleibt die Herkunftskennzeichnung `primary_md` oder `optional_internet` pro Eintrag abrufbar.
3. ist der Lese-Smoke-Test im lokalen Zielbetrieb reproduzierbar dokumentiert.

## Test Notes
1. `pnpm --dir apps/web lint` ausgefuehrt, Exit Code `0`.
2. `pnpm --dir apps/web test` ausgefuehrt, Exit Code `0`, dabei `17` Tests mit `16` Pass und `1` Skip.
3. `pnpm --dir apps/web build` ausgefuehrt, Exit Code `0`.
4. Neo4j Runtime-Read Smoke reproduzierbar:
5. Ohne gesetztes `NEO4J_DATABASE` wird der Integrationsblock in `runtime-read.test.ts` geskippt.
6. Mit gesetzten Variablen `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` laeuft der echte Read gegen Neo4j Docker gruen, nachgewiesen mit `pnpm --dir apps/web exec vitest run src/features/seed-data/runtime-read.test.ts --testNamePattern "integration with neo4j|reads real nodes"` und Exit Code `0`.
