# Dev Handoff E1-S4

## Was ist fertig
1. Qualitaetspruefung fuer die normalisierte Seed-Datenbasis ist als eigenes Modul umgesetzt in `apps/web/src/features/seed-data/quality-check.ts`.
2. Der Qualitaetslauf prueft Ontologiekonformitaet, Duplikate und Herkunftsfelder fuer `sources`, `nodes` und `edges`.
3. Ein Pruefprotokoll wird erzeugt mit `checked`, `beanstandet`, `ausgeschlossen` sowie Split nach `primary_md` und `optional_internet`.
4. Beanstandete Eintraege werden aus dem Ergebnisdatensatz ausgeschlossen und als Issues dokumentiert.
5. Feature-Dokumentation wurde in `apps/web/src/features/seed-data/README.md` erweitert.

## Welche Stories wurden umgesetzt
1. `E1-S4 Qualitaetspruefung fuer kuratierte Seed-Daten ausfuehren`

## Wie kann QA testen lokal inkl konkrete Startschritte
1. In das Repo wechseln und sicherstellen, dass Abhaengigkeiten installiert sind.
2. Unit-Test fuer den Qualitaetslauf ausfuehren: `pnpm --dir apps/web test -- src/features/seed-data/quality-check.test.ts`.
3. Gesamte Testsuite ausfuehren: `pnpm --dir apps/web test`.
4. Lint ausfuehren: `pnpm --dir apps/web lint`.
5. Build ausfuehren: `pnpm --dir apps/web build`.

## Welche Testdaten oder Seeds noetig sind
1. Keine externen Seeds notwendig.
2. Die Tests verwenden den kuratierten Datensatz aus `createSeedDataset()` und erzeugen zusaetzlich kontrollierte invalide Eintraege im Test.

## Bekannte Einschraenkungen
1. Der Qualitaetslauf schliesst beanstandete Eintraege aus und protokolliert diese, korrigiert aber keine Quelldaten automatisch.
2. Der Lauf ist aktuell ein In-Memory-Pruefschritt und schreibt kein separates Dateiprotokoll auf Disk.

## Erwartete Failure Modes
1. Duplizierte Node-IDs werden als `duplizierte node id` im Report ausgewiesen.
2. Duplizierte Relationen werden als `duplizierte relation` im Report ausgewiesen.
3. Unbekannte Quellenverweise werden als `unbekannte Quelle` im Report ausgewiesen.
4. Relationen mit ungueltigen Node-Bezuegen oder Ontologieverletzungen werden als Beanstandung markiert und ausgeschlossen.

## Genaue Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web test -- src/features/seed-data/quality-check.test.ts` erwartet Exit Code `0` und `3` bestandene Tests.
2. `pnpm --dir apps/web test` erwartet Exit Code `0` mit `19` bestanden und `1` skipped.
3. `pnpm --dir apps/web lint` erwartet Exit Code `0` ohne ESLint-Fehler.
4. `pnpm --dir apps/web build` erwartet Exit Code `0` mit erfolgreichem Next.js Build.
