# Dev Memory

## Current Implementation Status
1. Story `E1-S1` ist umgesetzt und auf `qa` gesetzt.
2. Fachliche Ontologie liegt in `apps/web/src/features/ontology/` mit Node-Typen und erlaubten Relationen.
3. Unit-Tests fuer Ontologie und bestehende API-Bootstrap-Tests laufen gruen.

## Active Epics
1. Epic `E1 Wissensmodell und Seed-Daten` ist aktiv.
2. Naechste fachliche Stories in E1 sind `E1-S2` bis `E1-S4`.

## Technical Constraints
1. Kein Scope-Change und keine Architekturabweichung ohne ADR.
2. Verträge aus `docs/spec/**` und Architektur aus `docs/architecture/**` bleiben bindend.
3. Dev-Schreibpfade bleiben strikt auf erlaubte Bereiche begrenzt.
4. TypeScript `strict=true` und Next.js `16.1.6` bleiben verpflichtend.

## Known Technical Debt
1. API ist weiterhin Bootstrap-Skelett ohne echtes Retrieval und ohne LLM-Antwortpipeline.
2. Seed-Datenmodell ist fachlich definiert, aber noch nicht in Neo4j als Datensatz verankert.
3. Rate-Limit- und Observability-Verträge sind noch nicht vollständig implementiert.

## Blocking Issues
1. Keine aktiven Blocker für den nächsten Story-Run.

## Next Instructions
1. Story `E1-S2` starten und Seed-Datenbasis auf der definierten Ontologie aufbauen.
2. Bei Start von E1-S2 die Relationen strikt gegen `apps/web/src/features/ontology/ontology.ts` validieren.
3. Vor QA-Übergabe weiterhin `pnpm lint`, `pnpm test`, `pnpm build` in `apps/web` ausfuehren.
