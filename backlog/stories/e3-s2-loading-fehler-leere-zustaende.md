# Story E3-S2 Zustände für Loading, Fehler und Leere bereitstellen

## Status
qa

## Ziel
Nutzerführung in nicht idealen Antwortpfaden absichern.

## Priorität
P0

## Abhängigkeiten
1. E3-S1

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kernverhalten

**Given**
eine laufende Anfrage oder ein Fehlerfall

**When**
der jeweilige Zustand eintritt

**Then**
1. Die Oberfläche zeigt für Loading, Fehler und Leere jeweils einen unterscheidbaren Status-Text.
2. Für jeden dieser Zustände wird eine klar benannte nächste Aktion angezeigt.

## Test Notes
Simuliere Loading, Fehler und leere Ergebnisse separat und dokumentiere je Zustand Status-Text und nächste Aktion.
