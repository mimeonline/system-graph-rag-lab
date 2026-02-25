# Story E4-S4 Log-Minimum und Privacy-Regeln prüfen

## Status
todo

## Ziel
Nur notwendige Betriebsdaten ohne sensible Inhalte protokollieren.

## Priorität
P1

## Abhängigkeiten
1. E4-S1

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kernverhalten

**Given**
produktive Anfragen und Fehlerfälle

**When**
Logs erzeugt werden

**Then**
1. Logs enthalten keine Roh-Nutzereingaben.
2. Logs enthalten keine Secrets.

## Test Notes
Führe einen Log-Review mit Stichprobe aus Erfolgs- und Fehlerfällen durch.
