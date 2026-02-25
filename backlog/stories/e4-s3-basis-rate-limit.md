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
1. Given wiederholte Anfragen eines Clients in kurzer Zeit
2. When das definierte Limit überschritten wird
3. Then blockiert das System temporär weitere Anfragen mit verständlicher Rückmeldung

## Test Notes
Sende Burst-Requests und bestätige die Reaktion an der Schwelle.
