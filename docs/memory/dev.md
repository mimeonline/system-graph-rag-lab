# Dev Memory

## Current Implementation Status
1. Story `E1-S2` ist umgesetzt und auf `qa` gesetzt.
2. Seed-Daten in `apps/web/src/features/seed-data/seed-data.ts` sind auf kuratierte Quellenbasis umgestellt.
3. Herkunft ist pro Eintrag ueber `sourceType` und `sourceFile` sowie `internalSource` und `publicReference` in `sources`, `nodes` und `edges` erfasst.
4. Validierung deckt Quellenkatalog, gueltige Herkunftstypen, Quellenreferenzintegritaet und Feldkonsistenz zwischen Top-Level-Quelle und `internalSource` ab.
5. Inhaltliche Seed-Abdeckung fuer E1-S2 umfasst jetzt auch konkrete Tool-Konzepte sowie einzelne `system_traps` und `leverage_points`.
6. Verifikation fuer diesen Stand ist gruen mit `pnpm --dir apps/web test -- src/features/seed-data/seed-data.test.ts`.

## Active Epics and Stories
1. Epic `E1 Wissensmodell und Seed-Daten` steht auf `in_progress`.
2. Story `E1-S1` ist `accepted`.
3. Story `E1-S2` ist `qa`.
4. Story `E1-S5` ist `todo` und naechster inhaltlicher Umsetzungsschritt.
5. Stories `E1-S3` und `E1-S4` bleiben `todo`.

## Technical Constraints
1. Kein Scope- oder Architekturwechsel ohne akzeptierte ADR.
2. API- und Retrieval-Contracts aus `docs/spec/**` bleiben unveraendert bindend.
3. Next.js `16.1.6`, TypeScript `strict=true`, Tailwind CSS und shadcn/ui bleiben verbindlich.
4. Dev setzt Story-Status nach Umsetzung nur auf `qa` oder `blocked`.

## Known Technical Debt
1. E1-S5 Extraktion und Ontologie-Normalisierung aus den kuratierten Quellen ist noch offen.
2. Optionale `optional_internet` Quellenlogik ist eingefuehrt, braucht aber fuer den Betrieb einen klaren Qualitaets- und Aktualisierungsprozess.
3. Persistierung der normalisierten Seed-Daten in Neo4j ist noch offen.

## Blocking Issues
1. Keine akuten Blocker fuer `E1-S2`.
2. Fuer `E1-S5` wird ein klarer Laufprozess fuer dokumentierte Inhaltsluecken bei `optional_internet` benoetigt.

## Next Instructions for Dev Agent
1. `E1-S5` umsetzen: kuratierte Quelleninhalte extrahieren und ontologiekonform normalisieren.
2. Herkunftsmetadaten aus `E1-S2` in den Normalisierungspfad uebernehmen und hart validieren.
3. Danach `E1-S3` starten und die normalisierte Datenbasis im Zielbetrieb verfuegbar machen.
