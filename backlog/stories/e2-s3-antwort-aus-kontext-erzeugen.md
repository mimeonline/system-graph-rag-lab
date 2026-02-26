# Story E2-S3 Antwort aus strukturiertem Kontext erzeugen

## Status
pass

## Ziel
Aus vorbereitetem Kontext eine strukturierte Antwort erzeugen.

## Priorität
P0

## Abhängigkeiten
1. E2-S2

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kernverhalten

**Given**
ein strukturiertes Kontextpaket

**When**
die Antworterzeugung ausgeführt wird

**Then**
1. Das Ergebnis enthält eine nicht leere Hauptantwort.
2. Das Ergebnis enthält eine Referenzsektion mit bis zu drei Referenzkonzepten oder einem klaren Fallback-Hinweis.

## Test Notes
1. Prüfe Nicht-Leere der Hauptantwort sowie Referenzsektion inklusive Fallback-Verhalten in Negativfällen.
2. `pnpm --dir apps/web exec vitest run src/features/query/answer.test.ts src/app/api/query/route.test.ts`
