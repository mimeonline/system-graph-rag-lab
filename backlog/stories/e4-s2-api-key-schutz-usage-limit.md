# Story E4-S2 API-Key-Schutz und Usage-Limit verifizieren

## Ziel
Kostenrisiko und Secret-Risiko im MVP-Betrieb begrenzen.

## Priorität
P0

## Abhängigkeiten
1. E4-S1

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1
Given ein separater API-Key im Projektbetrieb
When die Anwendung produktiv läuft
Then bleibt der Schlüssel nicht öffentlich sichtbar und ein Usage-Limit ist aktiv

## Test Notes
Prüfe Konfiguration, Repository-Scan und Betriebsgrenzen.
