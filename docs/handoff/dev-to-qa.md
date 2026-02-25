# Dev Handoff E1-S3

## Was ist fertig
1. Story `E1-S3` wurde umgesetzt und auf `qa` gesetzt.
2. Runtime-Lesezugriff auf die normalisierte Seed-Datenbasis ist ueber `readSeedDatasetForRuntime` verfuegbar.
3. Der Lesezugriff liefert Nodes und Relationen inklusive Herkunftskennzeichnung `sourceType` und `sourceFile`.
4. Validierung der Datenbasis ist im Runtime-Read-Pfad erzwungen und liefert bei inkonsistenter Datenbasis einen Fehler.
5. Feature-Doku fuer die neue Funktion wurde in `apps/web/src/features/seed-data/README.md` ergaenzt.

## Welche Stories wurden umgesetzt
1. `E1-S3 Normalisierte Datenbasis im Zielbetrieb verfuegbar machen`

## Wie kann QA lokal testen
1. `cd apps/web`
2. `pnpm test -- src/features/seed-data/runtime-read.test.ts`
3. Optionaler Regressionlauf: `pnpm test`
4. Optionaler Qualitaetslauf: `pnpm lint`
5. Optionaler Buildlauf: `pnpm build`

## Welche Testdaten oder Seeds noetig sind
1. Keine externen Seeds erforderlich.
2. Der Test nutzt die normalisierte Seed-Datenbasis aus `apps/web/src/features/seed-data/seed-data.ts`.

## Bekannte Einschraenkungen
1. Der Runtime-Lesezugriff arbeitet aktuell auf der im Code normalisierten Seed-Datenbasis, nicht auf Neo4j.
2. Persistierte Datenverfuegbarkeit in Neo4j bleibt von den nachfolgenden Stories in Epic E1 abhaengig.

## Erwartete Failure Modes
1. Ungueltige oder inkonsistente Datenbasis fuehrt im Runtime-Read zu einem Fehler.
2. Fehlende Herkunftsfelder in den Seed-Daten fuehren zu Validierungsfehlern.

## Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web test -- src/features/seed-data/runtime-read.test.ts` erwartet Exit Code `0` und 2 gruene Tests.
2. `pnpm --dir apps/web test` erwartet Exit Code `0` und alle Testdateien gruen.
3. `pnpm --dir apps/web lint` erwartet Exit Code `0` ohne ESLint-Fehler.
4. `pnpm --dir apps/web build` erwartet Exit Code `0` mit erfolgreichem Next.js Build.
