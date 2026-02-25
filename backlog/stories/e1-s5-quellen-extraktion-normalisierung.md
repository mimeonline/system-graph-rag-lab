# Story E1-S5 Quelleninhalte extrahieren und normalisieren

## Status
todo

## Ziel
Kuratierte Inhalte aus freigegebenen Quellen ontologiekonform in eine belastbare Seed-Datenbasis überführen.

## Priorität
P0

## Abhängigkeiten
1. E1-S2

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kuratierte Quellen werden in Seed-Daten überführt

**Given**
ein kuratierter Quellenkatalog aus `primary_md` und optional `optional_internet` sowie eine freigegebene Ontologie

**When**
Quelleninhalte extrahiert und auf die Ontologie normalisiert werden

**Then**
1. enthält die normalisierte Datenbasis mehr als 100 valide Nodes und mehr als 200 valide Edges.
2. ist für jeden Eintrag eine Herkunftsquelle mit Typ `primary_md` oder `optional_internet` hinterlegt.
3. werden Inhalte ohne belastbare Quellenreferenz nicht übernommen und im Laufprotokoll ausgewiesen.

## Test Notes
1. Prüfe, dass die Mengenkriterien für Nodes und Edges nach Normalisierung erreicht sind.
2. Prüfe stichprobenartig je fünf Nodes und Relationen auf vollständige Herkunftskennzeichnung.
3. Prüfe im Laufprotokoll, dass ausgeschlossene Inhalte mit Grund dokumentiert sind.
