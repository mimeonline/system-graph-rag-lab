# Dev Memory

## Current Implementation Status
1. Story `E1-S4` ist implementiert und im aktuellen Prozess auf `pass` bewertet.
2. `runSeedDatasetQualityCheck` in `apps/web/src/features/seed-data/quality-check.ts` prueft Quellen, Nodes und Edges auf Konsistenz.
3. Das Pruefprotokoll liefert `checked`, `beanstandet`, `ausgeschlossen`, `issues` und `bySourceType`.
4. Story-spezifischer Test fuer E1-S4 laeuft ueber direkten Vitest-Run reproduzierbar.

## Active Epics and Stories
1. Source of truth ist `backlog/progress.md`; Story-Status wird nicht aus Memory abgeleitet.
2. E1 ist aktiv und enthaelt noch offene Stories (`E1-S5`, `E1-S6`).
3. PM-Freigaben bleiben strikt nach `pass`.

## Technical Constraints
1. API- und Retrieval-Contract aus `docs/spec/**` bleiben unveraendert bindend.
2. Next.js `16.1.6`, TypeScript `strict=true`.
3. Dev setzt Story-Status nur auf `in_progress`, `qa` oder `blocked`.
4. Keine Architekturabweichung ohne akzeptierte ADR.

## Known Technical Debt
1. Qualitaetsprotokoll ist derzeit nur In-Memory und nicht als persistentes Audit-Artefakt abgelegt.
2. Lokale Neo4j-Integrationslaeufe haengen von sauber gesetzten Runtime-Variablen ab.
3. Offene Upstream-Storys (`E1-S5`, `E1-S6`) koennen Folgeeffekte auf spaetere QA-Gates haben.

## Blocking Issues
1. Kein akuter Dev-Blocker dokumentiert.

## Next Instructions for Dev Agent
1. Vor Story-Start immer Story-Datei plus `backlog/progress.md` lesen und synchron halten.
2. Story-spezifische Tests mit exaktem Scope-Kommando ausfuehren.
3. Dev-Handoff und Dev-Memory nur mit verifizierten, langlebigen Informationen aktualisieren.
