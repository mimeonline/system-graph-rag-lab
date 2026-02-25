# Story E4-S3 Basis-Rate-Limit aktivieren

## Ziel
Missbrauchsschutz für den Public-Endpunkt aktiv halten.

## Priorität
P0

## Abhängigkeiten
1. E4-S1

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kernverhalten

**Given**
wiederholte Anfragen eines Clients in kurzer Zeit

**When**
das definierte Limit überschritten wird

**Then**
1. Das System blockiert weitere Anfragen temporär mit verständlicher Rückmeldung.
2. Nach Ablauf des Zeitfensters erlaubt das System wieder reguläre Anfragen.

## Test Notes
Sende Burst-Requests über den Schwellwert hinaus und prüfe sowohl Blockierung als auch Wiederfreigabe nach Zeitfenster.
