# Story E4-S1 Public Deployment lauffähig machen

## Status
todo

## Ziel
Die Demo im vorgesehenen Betriebsrahmen öffentlich erreichbar bereitstellen.

## Priorität
P0

## Abhängigkeiten
1. E2-S3
2. E3-S1

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kernverhalten

**Given**
ein konfiguriertes Repository mit Laufzeitvariablen

**When**
ein Deployment ausgeführt wird

**Then**
1. Die Live-URL liefert den Status 200.
2. Zwei definierte Smoke-Fragen enden ohne Laufzeitfehler mit sichtbarer Hauptantwort.

## Test Notes
Führe einen Smoke-Test auf der Live-URL mit zwei definierten Fragen durch und protokolliere Ergebnis und Laufzeitfehler.
