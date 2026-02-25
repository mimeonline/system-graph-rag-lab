# Dev Memory

## Current Implementation Status
1. Story `E1-S4` ist implementiert und auf `qa` gesetzt.
2. Neuer Qualitaetslauf `runSeedDatasetQualityCheck` ist in `apps/web/src/features/seed-data/quality-check.ts` umgesetzt.
3. Der Lauf prueft Quellen, Nodes und Edges auf Ontologiekonformitaet, Duplikate und Herkunftskonsistenz.
4. Das Pruefprotokoll liefert `checked`, `beanstandet`, `ausgeschlossen`, Issues und einen Split fuer `primary_md` sowie `optional_internet`.
5. Verifikation ist erfolgreich mit `pnpm --dir apps/web lint`, `pnpm --dir apps/web test`, `pnpm --dir apps/web build`.

## Active Epics and Stories
1. Epic `E1 Wissensmodell und Seed-Daten` ist `in_progress`.
2. Story `E1-S1` ist `accepted`.
3. Story `E1-S2` ist `accepted`.
4. Story `E1-S3` ist `accepted`.
5. Story `E1-S4` ist `qa`.
6. Story `E1-S5` ist `todo`.
7. Story `E1-S6` ist `todo`.

## Technical Constraints
1. API- und Retrieval-Contract aus `docs/spec/**` bleiben unveraendert bindend.
2. Next.js `16.1.6`, TypeScript `strict=true`, Tailwind CSS und shadcn/ui bleiben verbindlich.
3. Dev setzt Story-Status nur auf `in_progress`, `qa` oder `blocked`.
4. Keine Architekturabweichung ohne akzeptierte ADR.

## Known Technical Debt
1. Der Qualitaetslauf erzeugt ein strukturiertes In-Memory-Pruefprotokoll, aber noch keine persistierte Protokolldatei fuer Audit-Zwecke.
2. `E1-S5` Extraktion und Normalisierung bleibt als vorgelagerter Datenqualitaetsbaustein offen.
3. Der lokale Integrationsblock fuer Neo4j-Reads bleibt von gesetztem `NEO4J_DATABASE` abhaengig.

## Blocking Issues
1. Kein akuter Dev-Blocker fuer `E1-S4`.

## Next Instructions for Dev Agent
1. `E1-S5` umsetzen, damit der komplette Quellen-zu-Seed-Fluss vor QA vollständig geschlossen ist.
2. Danach `E1-S6` fuer reproduzierbaren Seed-Reset und Reseed im lokalen Neo4j-Profil umsetzen.
3. Optional pruefen, ob Pruefprotokolle aus E1-S4 fuer spaetere Gates als Datei exportiert werden sollen, ohne Contract-Scope zu erweitern.
