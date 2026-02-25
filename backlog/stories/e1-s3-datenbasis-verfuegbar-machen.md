# Story E1-S3 Normalisierte Datenbasis im Zielbetrieb verfügbar machen

## Status
qa

## Ziel
Die normalisierte Seed-Datenbasis im vorgesehenen Betriebsrahmen abrufbar bereitstellen.

## Priorität
P0

## Abhängigkeiten
1. E1-S5

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Datenbasis ist im Zielbetrieb abrufbar

**Given**
eine normalisierte Seed-Datenbasis mit Herkunftskennzeichnung und gültige Zugangsdaten im Runtime-Kontext

**When**
die Anwendung Nodes und Relationen im Zielbetrieb abfragt

**Then**
1. werden Nodes und Relationen aus der normalisierten Datenbasis fehlerfrei gelesen.
2. bleibt die Herkunftskennzeichnung `primary_md` oder `optional_internet` pro Eintrag abrufbar.

## Test Notes
1. `pnpm --dir apps/web test -- src/features/seed-data/runtime-read.test.ts` erfolgreich am 2026-02-25, inklusive Lese-Smoke-Test mit mindestens zwei Nodes und zwei Relationen.
2. Im Smoke-Test sind fuer die gepruefte Node- und Relationsstichprobe `sourceType` und `sourceFile` enthalten; `sourceType` ist je Eintrag `primary_md` oder `optional_internet`.
3. Regression erfolgreich mit `pnpm --dir apps/web test`, `pnpm --dir apps/web lint` und `pnpm --dir apps/web build`.
