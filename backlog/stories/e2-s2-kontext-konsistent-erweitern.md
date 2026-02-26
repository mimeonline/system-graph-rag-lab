# Story E2-S2 Kontext für Antwort konsistent erweitern

## Status
pass

## Ziel
Primärkandidaten um relevante Kontextelemente für die Antwortvorbereitung ergänzen.

## Priorität
P0

## Abhängigkeiten
1. E2-S1
2. E1-S3

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kernverhalten

**Given**
eine Kandidatenliste

**When**
die Kontextanreicherung ausgeführt wird

**Then**
1. Ein deduplizierter Antwortkontext liegt vor, in dem jedes Konzept höchstens einmal vorkommt.
2. Jedes Kontextelement ist einem Kandidaten oder einer Erweiterungsquelle zugeordnet.

## Test Notes
- Prüfe Duplikatfreiheit sowie den `context.elements`-Katalog inklusive `source.publicReference`.
- Verifiziere die neuen Assertions mit `pnpm --dir apps/web exec vitest run src/features/query/retrieval.test.ts` (Exit Code 0).
- Stelle sicher, dass die API `context.elements` im Response liefert: `pnpm --dir apps/web exec vitest run src/app/api/query/route.test.ts` (Exit Code 0).
