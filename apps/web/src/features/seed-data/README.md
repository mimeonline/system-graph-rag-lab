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

### `readSeedDatasetForRuntime(options?)`
1. Zweck: stellt die normalisierte Datenbasis fuer Runtime-Lesezugriffe auf Nodes und Relationen bereit.
2. Input: optional `options.datasetFactory` fuer Testinjektion.
3. Output: `RuntimeSeedReadResult` mit `nodes` und `edges` inklusive `sourceType` und `sourceFile`.
4. Fehlerfall: wirft einen Fehler, wenn die Datenbasis nicht valide ist.
5. Beispiel: `readSeedDatasetForRuntime().nodes.slice(0, 2)` liefert lesbare Node-Stichprobe mit Herkunft.

## Hinweise
1. `sourceType` ist je Eintrag auf `primary_md` oder `optional_internet` begrenzt.
2. `sourceFile` muss auf einen Eintrag im kuratierten Quellenkatalog verweisen.
3. `internalSource` ist fuer interne Nachvollziehbarkeit und wird nicht automatisch oeffentlich angezeigt.
4. `publicReference` enthaelt oeffentlich belastbare Literatur- oder Web-Referenzen.
5. Der MVP-Katalog umfasst neben Grundkonzepten auch konkrete `tool:*` Nodes vom Typ `Tool` sowie einzelne `system_traps`, `leverage_points`, `CAST`, `Second-Order Thinking`, `CATWOE`, `Network Analysis`, `Mental Models` und `System Archetypes`.
