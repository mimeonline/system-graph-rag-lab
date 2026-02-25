# Dev Handoff E1-S4

## Umsetzung
1. Seed-Qualitaetspruefung ist in `apps/web/src/features/seed-data/quality-check.ts` implementiert.
2. Geprueft werden Ontologiekonformitaet, Duplikate und Herkunftskonsistenz fuer `sources`, `nodes`, `edges`.
3. Ergebnis liefert Pruefprotokoll mit `checked`, `beanstandet`, `ausgeschlossen`, `issues` und `bySourceType`.

## Story Scope
1. Umgesetzt: `E1-S4 Qualitaetspruefung fuer kuratierte Seed-Daten ausfuehren`.

## QA Startschritte
1. Story-spezifischer Test: `pnpm --dir apps/web exec vitest run src/features/seed-data/quality-check.test.ts`
2. Gesamtsuite: `pnpm --dir apps/web test`
3. Lint: `pnpm --dir apps/web lint`
4. Build: `pnpm --dir apps/web build`

## Erwartete Ergebnisse
1. Story-Test laeuft gruen (`3 passed`).
2. Gesamtsuite, Lint und Build laufen mit Exit Code `0`.

## Failure Modes
1. Duplikate werden beanstandet und ausgeschlossen.
2. Unbekannte Quellen werden beanstandet und ausgeschlossen.
3. Ontologieverletzende Relationen werden beanstandet und ausgeschlossen.

## Einschraenkungen
1. Der Lauf korrigiert Quelldaten nicht automatisch.
2. Das Pruefprotokoll ist aktuell In-Memory.
