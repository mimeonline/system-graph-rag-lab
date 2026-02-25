# Story E1-S3 Datenbasis im Zielbetrieb verfügbar machen

## Ziel
Die Datenbasis im vorgesehenen Betriebsrahmen abrufbar bereitstellen.

## Priorität
P0

## Abhängigkeiten
1. E1-S2

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1
Given gültige Zugangsdaten im Runtime-Kontext
When die Anwendung die Datenbasis abfragt
Then werden Nodes und Relationen fehlerfrei gelesen

## Test Notes
Führe einen Lese-Smoke-Test gegen den Zielbetrieb aus.
