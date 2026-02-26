# QA Test Plan MVP

## Teststrategie
### Unit
1. Story-Fokus `E1-S5`: `createSeedDataset`, `validateSeedDataset` und `runSeedDatasetQualityCheck` pruefen Volumen, Herkunftstypen und Ausschlussregeln.
2. Story-spezifische Evidenz ueber `pnpm --dir apps/web exec vitest run src/features/seed-data/seed-data.test.ts`.
3. Negativfall-Evidenz ueber `pnpm --dir apps/web exec vitest run src/features/seed-data/quality-check.test.ts`.

### Integration
1. Regressionslauf ueber `pnpm --dir apps/web test`.
2. Erwartung: Exit Code `0` mit gruenen Seed- und Quality-Check-Tests.

### E2E minimal
1. Statische Qualitaet: `pnpm --dir apps/web lint`.
2. Build-Readiness: `pnpm --dir apps/web build`.
3. Public Runtime Checks auf Vercel und Aura bleiben ausserhalb dieses Story-Gates.

## Testumgebung
### local
1. Verbindliche Umgebung fuer Story-Gate `E1-S5`.
2. Ausgefuehrte Pflicht-Commands: `pnpm --dir apps/web lint`, `pnpm --dir apps/web test`, `pnpm --dir apps/web build`.
3. Zusatz-Evidenz: `pnpm --dir apps/web install` und story-spezifische Testdatei-Analyse.
4. Laufdatum: `2026-02-25`.

### vercel
1. Nicht im Scope dieses Story-Gates.
2. Bleibt Risiko bis Epic-Gates E4 und E5.

### aura
1. Nicht im Scope dieses Story-Gates.
2. Runtime-Read-Integration bleibt env-abhaengig und kann lokal geskippt sein.

## Testdaten und Seed Voraussetzungen
1. Kein externer Seed erforderlich.
2. Story-Evidenz basiert auf kuratiertem In-Memory-Dataset in `apps/web/src/features/seed-data/seed-data.ts`.
3. Zulassige Herkunftstypen bleiben `primary_md` und `optional_internet`.
4. Ausschluesse ohne belastbare Referenz muessen im Protokoll `issues` sichtbar sein.

## Abnahmekriterien
### Story E1-S5 Szenario
1. Given: kuratierter Quellenkatalog aus `primary_md` und `optional_internet` plus freigegebene Ontologie.
2. When: Quelleninhalte werden extrahiert und ontologiekonform normalisiert.
3. Then: mehr als 100 valide Nodes und mehr als 200 valide Edges, Herkunft je Eintrag auf erlaubte Typen begrenzt, Eintraege ohne belastbare Quellenreferenz ausgeschlossen und im Laufprotokoll ausgewiesen.

### Gate-Regel
1. Pass: `lint`, `test` und `build` laufen mit Exit Code `0` und die Then-Bedingungen sind durch Testevidenz reproduzierbar belegt.
2. Fail: mindestens ein Pflicht-Command fehlschlaegt oder eine Then-Bedingung ist nicht reproduzierbar nachweisbar.
