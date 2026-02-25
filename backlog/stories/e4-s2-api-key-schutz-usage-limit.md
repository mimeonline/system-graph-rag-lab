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
### Szenario 1: Kernverhalten

**Given**
ein separater API-Key im Projektbetrieb

**When**
die Anwendung produktiv läuft

**Then**
1. Ein Repository-Scan zeigt keinen offengelegten Schlüssel.
2. Ein aktives Usage-Limit ist für den verwendeten Schlüssel nachweisbar.

## Test Notes
Prüfe Repository-Scan, Runtime-Konfiguration und dokumentierten Nachweis des aktiven Usage-Limits.
