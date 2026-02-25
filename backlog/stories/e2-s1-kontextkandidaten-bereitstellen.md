# Story E2-S1 Kontextkandidaten pro Frage bereitstellen

## Status
todo

## Ziel
Zu einer Nutzerfrage belastbare Kontextkandidaten in definierter Struktur liefern.

## Priorität
P0

## Abhängigkeiten
1. E1-S2

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kernverhalten

**Given**
eine Nutzerfrage und verfügbare Wissensbasis

**When**
die Kontextsuche ausgeführt wird

**Then**
1. Das System liefert eine Kandidatenliste ohne Duplikate.
2. Bei drei identischen Testläufen im selben Datenstand bleibt die Reihenfolge der ersten drei Kandidaten identisch.

## Test Notes
Prüfe für dieselbe Frage drei Läufe hintereinander auf identische Top-3-Reihenfolge und Duplikatfreiheit.
