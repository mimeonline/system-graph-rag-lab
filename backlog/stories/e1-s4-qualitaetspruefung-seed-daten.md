# Story E1-S4 Qualitätsprüfung für Seed-Daten ausführen

## Ziel
Konsistenz und Eindeutigkeit der Seed-Daten vor Nutzung absichern.

## Priorität
P0

## Abhängigkeiten
1. E1-S2

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kernverhalten

**Given**
eine erzeugte Seed-Datenbasis

**When**
Qualitätsregeln ausgeführt werden

**Then**
1. bleiben nur ontologiekonforme und nicht duplizierte Einträge bestehen

## Test Notes
Vergleiche den Datensatz vor und nach dem Qualitätslauf und dokumentiere entfernte Duplikate.
