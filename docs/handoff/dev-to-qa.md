# Dev Handoff E1-S6

## Was ist fertig
1. Lokaler Neo4j Ablauf fuer `Seed-Reset -> Seed-Import -> Reseed-Read-Check` ist implementiert.
2. Neue Orchestrierung `runLocalSeedResetAndReseed` fuehrt kontrolliertes Reset auf erlaubten Node-Typen aus, importiert das qualitaetsgepruefte Seed-Dataset und validiert anschliessend echte Runtime-Reads.
3. CLI-Aufruf ist verfuegbar ueber `pnpm --dir apps/web seed:local:reset-reseed`.
4. Unit- und Integrationspfad fuer den neuen Ablauf sind in `local-seed-reset.test.ts` abgedeckt.

## Umgesetzte Stories
1. `E1-S6 Neo4j lokal Seed Reset und Reseed` ist auf Status `qa` gesetzt.

## Wie QA lokal testet
1. Neo4j Docker starten und Erreichbarkeit auf `bolt://localhost:7687` sicherstellen.
2. Runtime-Variablen setzen: `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`.
3. Falls `.env.local` kein `NEO4J_DATABASE` enthaelt, fuer den Lauf `NEO4J_DATABASE=neo4j` exportieren.
4. Vollpruefung ausfuehren:
```bash
pnpm --dir apps/web lint
pnpm --dir apps/web test
pnpm --dir apps/web build
```
5. Story-spezifischen Ablauf ausfuehren:
```bash
set -a
. apps/web/.env.local
set +a
export NEO4J_DATABASE=${NEO4J_DATABASE:-neo4j}
pnpm --dir apps/web seed:local:reset-reseed
pnpm --dir apps/web test -- src/features/seed-data/local-seed-reset.test.ts
```

## Testdaten oder Seeds
1. Seed-Quelle ist `createSeedDataset()` plus `runSeedDatasetQualityCheck(...)` aus `apps/web/src/features/seed-data`.
2. Erwartete Importmenge im aktuellen Stand: `105` Nodes und `203` Relationen.

## Bekannte Einschraenkungen
1. Der CLI-Lauf erwartet gesetzte Neo4j Runtime-Variablen und bricht bei fehlenden Werten fail-fast ab.
2. Integrationschecks gegen Neo4j sind env-abhaengig und ohne gueltige lokale Credentials nicht ausfuehrbar.

## Erwartete Failure Modes
1. Fehlende oder leere `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` erzeugen sofortige Fehlermeldung ohne Import.
2. Neo4j Auth-Fehler oder Verbindungsfehler brechen den Ablauf mit `Neo4j Seed-Reset/Reseed fehlgeschlagen` ab.
3. Read-Check fehlschlaegt, wenn nach dem Import weniger als zwei Nodes oder zwei Relationen lesbar sind.

## Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web lint` erwartet Exit Code `0`.
2. `pnpm --dir apps/web test` erwartet Exit Code `0`.
3. `pnpm --dir apps/web build` erwartet Exit Code `0`.
4. `pnpm --dir apps/web seed:local:reset-reseed` erwartet Exit Code `0` und Ausgabe mit importierten sowie gelesenen Mengen.
5. `pnpm --dir apps/web test -- src/features/seed-data/local-seed-reset.test.ts` erwartet Exit Code `0` mit bestandenem Integrationslauf bei gueltiger Neo4j-Umgebung.
