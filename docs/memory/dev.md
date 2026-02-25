# Dev Memory

## Current Implementation Status
1. Story `E1-S3` ist implementiert und auf `qa` gesetzt.
2. `readSeedDatasetForRuntime` liest Nodes und Relationen als echten Runtime-Read aus Neo4j inklusive `sourceType` und `sourceFile`.
3. Runtime-Read prueft Pflichtfelder, erlaubte Source-Typen und schlaegt bei invaliden Daten oder Neo4j-Fehlern deterministisch fehl.
4. Verifikation ist erfolgreich mit `pnpm --dir apps/web lint`, `pnpm --dir apps/web test`, `pnpm --dir apps/web build`.
5. Neo4j-Integrations-Smoke ist reproduzierbar gruen, wenn `NEO4J_DATABASE` gesetzt ist.

## Active Epics and Stories
1. Epic `E1 Wissensmodell und Seed-Daten` ist `in_progress`.
2. Story `E1-S1` ist `accepted`.
3. Story `E1-S2` ist `accepted`.
4. Story `E1-S3` ist `qa`.
5. Story `E1-S5` ist `todo`.
6. Story `E1-S4` ist `todo`.
7. Story `E1-S6` ist `todo`.

## Technical Constraints
1. API- und Retrieval-Contract aus `docs/spec/**` bleiben unveraendert bindend.
2. Next.js `16.1.6`, TypeScript `strict=true`, Tailwind CSS und shadcn/ui bleiben verbindlich.
3. Dev setzt Story-Status nur auf `in_progress`, `qa` oder `blocked`.
4. Keine Architekturabweichung ohne akzeptierte ADR.

## Known Technical Debt
1. Lokale `.env.local` Konfiguration enthaelt nicht durchgaengig `NEO4J_DATABASE`; dadurch kann der Integrationsblock ohne explizites Setzen geskippt werden.
2. E1-S5 Extraktion und Normalisierung aus Quellen mit Laufprotokoll ist noch offen.
3. E1-S4 Qualitaetspruefung auf persistiertem Datenstand ist noch offen.

## Blocking Issues
1. Kein akuter Dev-Blocker fuer E1-S3.

## Next Instructions for Dev Agent
1. E1-S5 umsetzen und normalisierte Datenbasis samt Laufprotokoll fertigstellen.
2. Danach E1-S4 zur Qualitaetspruefung fuer Konsistenz, Herkunft und Duplikate umsetzen.
3. Lokale Developer-Dokumentation oder Setup-Pruefung fuer Pflichtvariable `NEO4J_DATABASE` weiter absichern.
