# Seed Data Feature

## Zweck
Dieses Feature erzeugt und validiert eine Seed-Datenbasis fuer das Wissensmodell.
Der aktuelle Stand nutzt einen deterministischen Datensatz als technische Basis.

## Funktionen
### `buildEmbedding(seed)`
1. Zweck: erzeugt ein kleines Embedding mit vier numerischen Werten.
2. Input: `seed` als Zahl.
3. Output: `number[]` mit vier Eintraegen.
4. Fehlerfall: kein Throw, bei ungeeigneten Inputs sinkt nur die Datenqualitaet.
5. Beispiel: `buildEmbedding(1)` ergibt `[0.01, 0.04, 0.07, 0.1]`.

### `createSeedDataset()`
1. Zweck: erzeugt den Seed-Datensatz mit Nodes und Edges im Ontologie-Rahmen.
2. Input: keiner.
3. Output: `SeedDataset`.
4. Fehlerfall: kein Throw, fachliche Fehler werden erst in der Validierung erkannt.
5. Beispiel: Ergebnis hat aktuell 130 Nodes und 315 Edges.

### `validateSeedDataset(dataset)`
1. Zweck: prueft Pflichtfelder, Eindeutigkeit, Referenzen und Ontologie-Regeln.
2. Input: `dataset` vom Typ `SeedDataset`.
3. Output: `SeedValidationResult` mit `valid` und `errors`.
4. Fehlerfall: kein Throw, alle Fehler werden in `errors` gesammelt.
5. Beispiel: `validateSeedDataset(createSeedDataset())` liefert `valid = true`.

## Hinweise
1. Nächster Schritt laut Story-Schnitt ist die Umstellung von synthetischen auf kuratierte Quellen.
2. Die vorhandene Validierungslogik soll dabei wiederverwendet und um Herkunftschecks erweitert werden.
