# Dev Handoff E1-S2

## Was ist fertig
1. Story `E1-S2` ist technisch umgesetzt und auf `qa` gesetzt.
2. Seed-Datengenerator liefert eine deterministische MVP-Datenbasis mit 130 Nodes und 315 Edges.
3. Seed-Validator prüft Pflichtfelder, eindeutige IDs, bekannte Knotenreferenzen und erlaubte Relationsrichtungen laut Ontologie.
4. Unit- und Integrationsnahe Tests fuer gueltige sowie ungueltige Datensaetze sind vorhanden.

## Welche Stories wurden umgesetzt
1. `E1-S2 Seed-Datenbasis im MVP-Rahmen erzeugen`

## Wie kann QA lokal testen
1. In `apps/web` wechseln.
2. `pnpm install` ausfuehren, falls Dependencies fehlen.
3. `pnpm test` ausfuehren und auf gruenen Lauf achten.
4. Optional Vollpruefung mit `pnpm lint` und `pnpm build` ausfuehren.

## Welche Testdaten oder Seeds noetig sind
1. Keine externen Seeds noetig.
2. Tests nutzen den internen Generator in `src/features/seed-data/seed-data.ts`.

## Bekannte Einschraenkungen
1. Story deckt nur Erzeugung und Validierung der Datenbasis ab.
2. Persistierung in Neo4j ist nicht Teil von `E1-S2` und folgt in `E1-S3`.

## Erwartete Failure Modes
1. Fehlendes Pflichtfeld `summary`, `title` oder `name` fuehrt zu Validation-Fehlern.
2. Fehlendes `embedding` bei `Concept` oder `Problem` fuehrt zu Validation-Fehlern.
3. Nicht erlaubte Relationsrichtung fuehrt zu Ontologie-Verstoss im Validation-Report.
4. Doppelte Node-IDs oder doppelte Kanten fuehren zu Validation-Fehlern.

## Testkommandos mit erwarteten Ergebnissen
1. `pnpm lint` in `apps/web`: Exit Code `0` ohne ESLint-Fehler.
2. `pnpm test` in `apps/web`: Exit Code `0`, alle Testdateien gruen, inklusive `src/features/seed-data/seed-data.test.ts`.
3. `pnpm build` in `apps/web`: Exit Code `0`, Next.js Build erfolgreich.
