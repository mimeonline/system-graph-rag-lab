# Seed Data Feature

## Zweck
Dieses Feature erstellt und validiert eine kuratierte Seed-Datenbasis fuer das Wissensmodell.
Die Daten stammen aus freigegebenen Markdown-Quellen und enthalten Herkunftsmetadaten pro Eintrag.

## Funktionen
### `createCuratedSourceCatalog()`
1. Zweck: liefert den kuratierten Quellenkatalog fuer die Seed-Datenbasis.
2. Input: keiner.
3. Output: `CuratedSourceEntry[]` mit `sourceType`, `sourceFile`, `internalSource` und `publicReference`.
4. Fehlerfall: kein Throw, ungueltige Quellen werden in `validateSeedDataset` gemeldet.
5. Beispiel: `createCuratedSourceCatalog()[0].sourceType` ist `primary_md`.

### `createSeedDataset()`
1. Zweck: erzeugt ein deterministisches Seed-Dataset aus kuratierten Quellen.
2. Input: keiner.
3. Output: `SeedDataset` mit `sources`, `nodes` und `edges`.
4. Fehlerfall: kein Throw, fachliche Fehler werden in der Validierung erkannt.
5. Beispiel: Ergebnis enthaelt kuratierte Quellen und ontologiekonforme Knoten/Kanten.

### `validateSeedDataset(dataset)`
1. Zweck: prueft Quellenkatalog, Pflichtfelder, Eindeutigkeit, Referenzen und Ontologie-Regeln.
2. Input: `dataset` vom Typ `SeedDataset`.
3. Output: `SeedValidationResult` mit `valid` und `errors`.
4. Fehlerfall: kein Throw, alle Befunde werden in `errors` gesammelt.
5. Beispiel: `validateSeedDataset(createSeedDataset())` liefert `valid = true`.

### `runSeedDatasetQualityCheck(dataset)`
1. Zweck: fuehrt den Qualitaetslauf aus und erstellt ein Pruefprotokoll mit `checked`, `beanstandet`, `ausgeschlossen`.
2. Input: `dataset` vom Typ `SeedDataset`.
3. Output: `SeedQualityCheckResult` mit gefiltertem Datensatz und `report` inkl. Split nach `primary_md` und `optional_internet`.
4. Fehlerfall: kein Throw, ungueltige Eintraege werden im Report als `issues` dokumentiert und ausgeschlossen.
5. Beispiel: `runSeedDatasetQualityCheck(createSeedDataset()).report.nodes.checked > 0`.

### `readSeedDatasetForRuntime(options?)`
1. Zweck: liest die normalisierte Datenbasis als echten Runtime-Read direkt aus Neo4j.
2. Input: `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` plus optional `options.driverFactory` fuer Testinjektion.
3. Output: `Promise<RuntimeSeedReadResult>` mit `nodes` und `edges` inklusive `sourceType` und `sourceFile`.
4. Fehlerfall: wirft einen Fehler bei fehlenden Env-Variablen, Neo4j-Verbindungsproblemen oder ungueltigen Datensaetzen.
5. Beispiel: `const rows = await readSeedDatasetForRuntime(); rows.nodes.slice(0, 2)`.

### `runLocalSeedResetAndReseed(options?)`
1. Zweck: fuehrt den lokalen Ablauf Reset, Seed-Import und Reseed-Read-Check fuer Neo4j reproduzierbar aus.
2. Input: `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`, `ALLOW_DESTRUCTIVE_SEED_RESET=true` plus optional `options.driverFactory`, `options.runtimeRead` und `options.seedDatasetFactory`.
3. Output: `Promise<LocalSeedResetReseedResult>` mit importierten Node und Relationsmengen sowie Read-Check Kennzahlen.
4. Fehlerfall: wirft einen Fehler bei fehlenden Runtime-Variablen, nicht-lokaler `NEO4J_URI`, fehlendem Opt-In, fehlgeschlagenem Import oder wenn der Read-Check weniger als zwei Nodes oder zwei Relationen liefert.
5. Beispiel: `const result = await runLocalSeedResetAndReseed(); result.readCheckNodeCount >= 2`.

## Lokaler Ablauf Seed Reset und Reseed
1. Runtime-Variablen setzen: `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`, `ALLOW_DESTRUCTIVE_SEED_RESET=true`.
2. `NEO4J_URI` muss auf lokalen Host zeigen: `localhost`, `127.0.0.1` oder `::1`.
3. Ablauf starten mit `pnpm --dir apps/web seed:local:reset-reseed`.
4. Erfolgsfall liefert Importmengen plus Read-Check fuer Nodes und Relationen.

## Hinweise
1. `sourceType` ist je Eintrag auf `primary_md` oder `optional_internet` begrenzt.
2. `sourceFile` muss auf einen Eintrag im kuratierten Quellenkatalog verweisen.
3. `internalSource` ist fuer interne Nachvollziehbarkeit und wird nicht automatisch oeffentlich angezeigt.
4. `publicReference` enthaelt oeffentlich belastbare Literatur- oder Web-Referenzen.
5. Der MVP-Katalog umfasst neben Grundkonzepten auch konkrete `tool:*` Nodes vom Typ `Tool` sowie einzelne `system_traps`, `leverage_points`, `CAST`, `Second-Order Thinking`, `CATWOE`, `Network Analysis`, `Mental Models` und `System Archetypes`.
