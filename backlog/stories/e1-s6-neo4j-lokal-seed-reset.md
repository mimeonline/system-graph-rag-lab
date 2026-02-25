# Story E1-S6 Neo4j lokal Seed Reset und Reseed

## Status
todo

## Ziel
Ein reproduzierbarer lokaler Seed-Reset-und-Reseed-Ablauf fuer Neo4j Docker ist verfuegbar, damit die Datenbasis fuer Next.js Runtime-Reads sauber neu aufgebaut werden kann.

## Priorität
P0

## Abhängigkeiten
1. E1-S3

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Lokaler Seed Reset und Reseed ist reproduzierbar

**Given**
ein laufender lokaler Neo4j-Docker-Container, eine Seed-Quelle fuer die normalisierte Datenbasis und gesetzte Runtime-Variablen `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME` und `NEO4J_PASSWORD`

**When**
der lokale Ablauf Seed-Reset, Seed-Import und anschliessender Reseed ausgefuehrt wird

**Then**
1. wird die bestehende Seed-Datenbasis in Neo4j kontrolliert zurueckgesetzt.
2. wird die Seed-Datenbasis aus der freigegebenen Quelle erneut eingespielt.
3. sind nach dem Reseed echte Neo4j-Reads fuer mindestens zwei Nodes und zwei Relationen im lokalen Zielbetrieb wieder erfolgreich.

## Test Notes
1. Testlauf dokumentiert die Reihenfolge Reset, Seed, Reseed inklusive verwendeter lokaler Runtime-Variablen `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME` und `NEO4J_PASSWORD`.
2. Validierung erfolgt ueber echte Neo4j-Reads ohne Mocking im lokalen Next.js Runtime-Kontext.
3. Sonderfall: Bei fehlenden oder ungueltigen `NEO4J_USERNAME` oder `NEO4J_PASSWORD` bricht der Ablauf mit klarer Fehlermeldung ab und fuehrt keinen teilweisen Import aus.
