# QA Test Plan MVP

## Teststrategie
### Unit
1. Story-Fokus `E1-S4`: `runSeedDatasetQualityCheck(dataset)` prueft Ontologiekonformitaet, Duplikate und Herkunftskennzeichnung fuer `sources`, `nodes`, `edges`.
2. Pflichtlauf fuer Story-Gate: `pnpm --dir apps/web exec vitest run src/features/seed-data/quality-check.test.ts`.
3. Unit-Akzeptanz fuer die Story gilt nur bei gruenem Testlauf mit den drei Story-Tests.

### Integration
1. Regression auf Feature-Ebene: `pnpm --dir apps/web test`.
2. Ziel ist das Zusammenspiel aus Seed-Datensatz, Ontologie-Constraints und Qualitaetslauf ohne Contract-Drift.
3. Erwartung fuer Review-Run: Exit Code `0`, keine fehlschlagenden Tests.

### E2E minimal
1. Build-Readiness als Minimal-E2E fuer Story-Gate: `pnpm --dir apps/web build`.
2. Statische Qualitaet: `pnpm --dir apps/web lint`.
3. Vercel und Aura bleiben fuer Epic E4 und E5 ausserhalb des Story-Gates.

## Testumgebung
### local
1. Verbindliche Story-Umgebung fuer diesen Run.
2. Ausgefuehrte Commands: `pnpm --dir apps/web exec vitest run src/features/seed-data/quality-check.test.ts`, `pnpm --dir apps/web test`, `pnpm --dir apps/web lint`, `pnpm --dir apps/web build`.
3. Laufdatum: `2026-02-25`.

### vercel
1. Nicht im Scope des Story-Gates `E1-S4`.
2. Bleibt Epic-Risiko bis E4-Gate.

### aura
1. Nicht im Scope des Story-Gates `E1-S4`.
2. Bleibt Epic-Risiko bis E4-Gate.

## Testdaten und Seed Voraussetzungen
1. Kein externer Seed oder Datenbank-Setup erforderlich.
2. Tests nutzen `createSeedDataset()` und erzeugen kontrollierte ungueltige Eintraege fuer Negativfaelle.
3. Herkunfts-Split `primary_md` und `optional_internet` muss im Report vorhanden sein.

## Abnahmekriterien
### Story E1-S4 Szenario
1. Given: normalisierte Seed-Datenbasis und kuratierter Quellenkatalog liegen vor.
2. When: Qualitaetsregeln werden auf den Datensatz angewendet.
3. Then: alle verbleibenden Eintraege sind ontologiekonform, keine doppelten IDs oder Relationen bleiben erhalten, Herkunft ist je Eintrag nachverfolgbar, und ein Pruefprotokoll mit `checked`, `beanstandet`, `ausgeschlossen` liegt vor.

### Gate-Regel
1. Story-Gate ist Pass, wenn alle vier Pflicht-Commands mit Exit Code `0` laufen und die Given/When/Then-Bedingungen durch Testevidenz gedeckt sind.
2. Story-Gate ist Fail, wenn ein Pflicht-Command fehlschlaegt oder eine Then-Bedingung nicht reproduzierbar belegt ist.
