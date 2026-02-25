# Story E1-S4 Qualitätsprüfung für kuratierte Seed-Daten ausführen

## Status
todo

## Ziel
Konsistenz, Herkunft und Eindeutigkeit der kuratierten Seed-Daten vor Nutzung absichern.

## Priorität
P0

## Abhängigkeiten
1. E1-S5
2. E1-S3

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Qualitätsregeln sichern die kuratierte Datenbasis

**Given**
eine im Zielbetrieb verfügbare, normalisierte Seed-Datenbasis und ein kuratierter Quellenkatalog

**When**
Qualitätsregeln ausgeführt werden

**Then**
1. sind alle geprüften Einträge ontologiekonform.
2. sind keine doppelten IDs oder doppelten Relationen vorhanden.
3. besitzt jeder Eintrag eine nachvollziehbare Herkunftskennzeichnung.
4. liegt ein Prüfprotokoll mit Anzahl geprüfter, beanstandeter und ausgeschlossener Einträge vor.

## Test Notes
1. Vergleiche Datensatzstände vor und nach dem Qualitätslauf und dokumentiere ausgeschlossene Einträge.
2. Prüfe im Prüfprotokoll die getrennte Ausweisung für `primary_md` und `optional_internet`.
