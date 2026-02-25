# Story E1-S3 Normalisierte Datenbasis im Zielbetrieb verfügbar machen

## Status
qa

## Ziel
Die normalisierte Seed-Datenbasis im lokalen Zielbetrieb mit Next.js lokal und Neo4j Docker abrufbar bereitstellen.

## Priorität
P0

## Abhängigkeiten
1. E1-S5

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Datenbasis ist im Zielbetrieb abrufbar

**Given**
eine normalisierte Seed-Datenbasis mit Herkunftskennzeichnung sowie lokal gesetzte Runtime-Variablen für Next.js und Neo4j Docker

**When**
die lokal gestartete Anwendung Nodes und Relationen aus Neo4j Docker abfragt

**Then**
1. werden Nodes und Relationen aus der normalisierten Datenbasis fehlerfrei gelesen.
2. bleibt die Herkunftskennzeichnung `primary_md` oder `optional_internet` pro Eintrag abrufbar.
3. ist der Lese-Smoke-Test im lokalen Zielbetrieb reproduzierbar dokumentiert.

## Test Notes
1. Lokaler Nachweis ueber `pnpm --dir apps/web test -- src/features/seed-data/runtime-read.test.ts` mit laufendem Neo4j Docker und lokalem Next.js Runtime-Kontext.
2. Der Lese-Smoke-Test prueft mindestens zwei Nodes und zwei Relationen inklusive `sourceType` und `sourceFile`; `sourceType` ist je Eintrag `primary_md` oder `optional_internet`.
3. Lokale Regression im selben Zielbetrieb ueber `pnpm --dir apps/web test`, `pnpm --dir apps/web lint` und `pnpm --dir apps/web build`.
