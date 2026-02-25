# Dev Memory

## Current Implementation Status
1. Story `E1-S2` wurde durch PM auf kuratierte Quellbasis geschärft und steht auf `in_progress`.
2. Aktuelle Implementierung in `apps/web/src/features/seed-data/seed-data.ts` ist weiterhin synthetisch und muss auf kuratierte Quellen umgestellt werden.
3. Der bisherige Datensatz ist deterministisch mit 130 Nodes und 315 Edges und dient als technische Basis.
4. Seed-Validierung gegen Ontologie-Regeln, Pflichtfelder, Duplikate und Referenzintegritaet ist umgesetzt und kann fuer kuratierte Daten wiederverwendet werden.
5. Letzter Lauf fuer den bestehenden Stand: `pnpm lint`, `pnpm test` und `pnpm build` in `apps/web` gruen.

## Active Epics and Stories
1. Epic `E1 Wissensmodell und Seed-Daten` steht auf `in_progress`.
2. Story `E1-S1` ist `accepted`.
3. Story `E1-S2` ist `in_progress` (kuratierte Quellenbasis).
4. Story `E1-S5` ist `todo` (Extraktion und Normalisierung).
5. Story `E1-S3` ist `todo` (Zielbetrieb verfuegbar machen).
6. Story `E1-S4` ist `todo` (Qualitaetspruefung).

## Technical Constraints
1. Kein Scope-Change und keine Architekturabweichung ohne ADR.
2. API- und Retrieval-Vertraege aus `docs/spec/**` bleiben bindend.
3. Next.js `16.1.6`, TypeScript `strict=true`, Tailwind CSS und shadcn/ui bleiben verbindlich.
4. Dev schreibt nur in erlaubte Pfade und setzt Story-Status nie direkt auf `accepted`.

## Known Technical Debt
1. Seed-Daten sind noch nicht aus kuratierten Quellen extrahiert und normalisiert.
2. Herkunftskennzeichnung pro Eintrag (`primary_md` oder `optional_internet`) ist noch nicht technisch umgesetzt.
3. Persistierung in Neo4j ist noch nicht umgesetzt.
4. API bleibt fuer Retrieval und LLM weiterhin im Bootstrap-Zustand.
5. Laufzeit-Guardrails fuer Rate-Limit und strukturierte Observability sind noch unvollstaendig.

## Blocking Issues
1. `E1-S3` ist durch Abhaengigkeit auf `E1-S5` blockiert.
2. Verbindlicher Primärquellenkatalog fuer `E1-S2` muss bereitgestellt und eingefroren werden.

## Next Instructions for Dev Agent
1. `E1-S2` abschliessen: kuratierte Quellenbasis inkl. `primary_md` und optionaler `optional_internet`-Ergaenzung dokumentieren.
2. `E1-S5` umsetzen: Quelleninhalte extrahieren, normalisieren und mit Herkunftsmetadaten versehen.
3. Bestehende Validatorlogik auf kuratierte Datensaetze anwenden und um Herkunftschecks erweitern.
4. Danach `E1-S3` starten und die normalisierte Datenbasis im Zielbetrieb verfuegbar machen.
