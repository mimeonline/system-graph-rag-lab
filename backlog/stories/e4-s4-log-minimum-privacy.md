# Story E4-S4 Log-Minimum und Privacy-Regeln prüfen

## Ziel
Nur notwendige Betriebsdaten ohne sensible Inhalte protokollieren.

## Priorität
P1

## Abhängigkeiten
1. E4-S1

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1
Given produktive Anfragen und Fehlerfälle
When Logs erzeugt werden
Then enthalten sie keine Roh-Nutzereingaben und keine Secrets

## Test Notes
Führe einen Log-Review mit Stichprobe aus Erfolgs- und Fehlerfällen durch.
