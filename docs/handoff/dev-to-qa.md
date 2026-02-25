# Dev Handoff E1-S3

## Was ist fertig
1. Runtime-Read fuer die normalisierte Seed-Datenbasis liest echte Nodes und Relationen direkt aus Neo4j in `apps/web/src/features/seed-data/runtime-read.ts`.
2. Der Read liefert `sourceType` und `sourceFile` fuer Nodes und Relationen contract-konform.
3. Fehlerfaelle sind abgesichert fuer fehlende Neo4j-Runtime-Variablen, Verbindungsprobleme und ungueltige Datensaetze.
4. Feature-Dokumentation fuer `readSeedDatasetForRuntime` ist in `apps/web/src/features/seed-data/README.md` aktualisiert.

## Welche Stories wurden umgesetzt
1. `E1-S3 Normalisierte Datenbasis im Zielbetrieb verfuegbar machen`

## Wie kann QA testen lokal inkl konkrete Startschritte
1. Sicherstellen, dass Docker-Container `neo4j-local` auf `neo4j:5.26.0` laeuft und `7687` erreichbar ist.
2. In `apps/web/.env.local` oder Shell die Variablen `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` setzen.
3. Lint ausfuehren: `pnpm --dir apps/web lint`.
4. Gesamte Tests ausfuehren: `pnpm --dir apps/web test`.
5. Build ausfuehren: `pnpm --dir apps/web build`.
6. Neo4j-Read-Smoke explizit ausfuehren: `pnpm --dir apps/web exec vitest run src/features/seed-data/runtime-read.test.ts --testNamePattern "integration with neo4j|reads real nodes"`.

## Welche Testdaten oder Seeds noetig sind
1. Keine manuelle Vorbefuellung noetig.
2. Der Integrationstest erzeugt eigene Marker-Knoten und -Kanten in Neo4j und loescht diese im Cleanup wieder.

## Bekannte Einschraenkungen
1. Wenn `NEO4J_DATABASE` lokal nicht gesetzt ist, wird der Integrationsblock in `runtime-read.test.ts` automatisch geskippt.
2. Bei fehlender Neo4j-Erreichbarkeit ist ein gruenes Integrations-Smoke nicht moeglich.

## Erwartete Failure Modes
1. Fehlende Variable fuehrt zu Fehlern wie `Neo4j Runtime-Read hat ungueltiges Feld NEO4J_URI`.
2. Neo4j nicht erreichbar fuehrt zu `Neo4j Runtime-Read fehlgeschlagen` mit Connectivity-Hinweis.
3. Unerlaubte `sourceType` Werte in Neo4j-Daten fuehren zu Fehler bei Runtime-Read.

## Genaue Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web lint` erwartet Exit Code `0` ohne ESLint-Fehler.
2. `pnpm --dir apps/web test` erwartet Exit Code `0` mit bestandenem Suite-Run.
3. `pnpm --dir apps/web build` erwartet Exit Code `0` mit erfolgreichem Next.js Build.
4. `pnpm --dir apps/web exec vitest run src/features/seed-data/runtime-read.test.ts --testNamePattern "integration with neo4j|reads real nodes"` erwartet Exit Code `0` mit erfolgreichem realem Neo4j-Read-Test.
