# Dev Memory

## Current Implementation Status
1. Story `E1-S3` ist umgesetzt und auf `qa` gesetzt.
2. Runtime-Lesezugriff auf die normalisierte Seed-Datenbasis ist in `apps/web/src/features/seed-data/runtime-read.ts` umgesetzt.
3. Der Read-Pfad liefert Nodes und Relationen inklusive Herkunftskennzeichnung `sourceType` und `sourceFile`.
4. Runtime-Read validiert die Seed-Datenbasis vor Ausgabe und bricht bei invalidem Datensatz mit Fehler ab.
5. Verifikation fuer den Stand ist gruen mit `pnpm --dir apps/web lint`, `pnpm --dir apps/web test` und `pnpm --dir apps/web build`.

## Active Epics and Stories
1. Epic `E1 Wissensmodell und Seed-Daten` bleibt `in_progress`.
2. Story `E1-S1` ist `accepted`.
3. Story `E1-S2` ist `accepted`.
4. Story `E1-S3` ist `qa`.
5. Story `E1-S5` ist `todo`.
6. Story `E1-S4` ist `todo`.

## Technical Constraints
1. Kein Scope- oder Architekturwechsel ohne akzeptierte ADR.
2. API- und Retrieval-Contracts aus `docs/spec/**` bleiben unveraendert bindend.
3. Next.js `16.1.6`, TypeScript `strict=true`, Tailwind CSS und shadcn/ui bleiben verbindlich.
4. Story-Status durch Dev nur `qa` oder `blocked`.

## Known Technical Debt
1. Persistente Verfuegbarkeit der normalisierten Datenbasis in Neo4j ist noch offen.
2. E1-S5 Extraktion und Normalisierung aus Quellen mit Laufprotokoll ist noch offen.

## Blocking Issues
1. Keine akuten Blocker fuer den aktuellen Stand.

## Next Instructions for Dev Agent
1. `E1-S5` umsetzen: Extraktion und Ontologie-Normalisierung mit Laufprotokoll fertigstellen.
2. Neo4j-Persistenzpfad fuer Seed-Daten vorbereiten, damit `E1-S3` Read-Pfad spaeter auf Zielbetriebsspeicher umgestellt werden kann.
3. Danach `E1-S4` Qualitaetspruefung auf dem persistierten Datenstand umsetzen.
