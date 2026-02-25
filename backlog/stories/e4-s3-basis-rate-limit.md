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
### Szenario 1
Given wiederholte Anfragen eines Clients in kurzer Zeit
When das definierte Limit überschritten wird
Then blockiert das System temporär weitere Anfragen mit verständlicher Rückmeldung

## Test Notes
Sende Burst-Requests und bestätige die Reaktion an der Schwelle.
