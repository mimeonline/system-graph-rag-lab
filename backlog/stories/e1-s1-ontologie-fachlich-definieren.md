# Story E1-S1 Ontologie fachlich definieren

## Status
pass

## Ziel
Ein fachlich konsistentes Modell für die MVP-Domäne bereitstellen.

## Priorität
P0

## Abhängigkeiten
1. Keine

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kernverhalten

**Given**
ein leeres Wissensmodell

**When**
die Ontologie dokumentiert wird

**Then**
1. sind die Typen Concept, Author, Book, Problem und ihre erlaubten Beziehungen klar beschrieben

## Implementierungsnotizen
1. Ontologie ist als fachliches Feature unter `apps/web/src/features/ontology/` umgesetzt.
2. Node-Typen und erlaubte Beziehungen sind als strukturierte Definition plus lesbare Tabelle dokumentiert.

## Test Notes
1. Unit-Test `src/features/ontology/ontology.test.ts` prüft Vollständigkeit der Node-Typen.
2. Unit-Test `src/features/ontology/ontology.test.ts` prüft die vollständige Relationstabelle und erlaubte versus unerlaubte Beziehungen.
3. Projektweite Verifikation in `apps/web`: `pnpm lint`, `pnpm test`, `pnpm build`.

## Blocker
1. Keine.
