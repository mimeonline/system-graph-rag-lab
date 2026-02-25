# Story E4-S5 Public Plattform Setup vorbereiten

## Status
todo

## Ziel
Die Public Plattform-Grundlage mit GitHub, Vercel, Neo4j Aura und Environment-Verkabelung als Voraussetzung fuer spaetere Public-Abnahme bereitstellen.

## Priorität
P0

## Abhängigkeiten
1. Keine

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Public Plattform Setup ist als Voraussetzung nachweisbar

**Given**
ein lauffaehiger lokaler Stand und ein vorgesehenes Public Zielprofil

**When**
das Public Plattform Setup vorbereitet und dokumentiert wird

**Then**
1. sind GitHub Repository, Vercel Projekt und Neo4j Aura Instanz als Zielplattformen eindeutig zugeordnet.
2. ist die Environment-Verkabelung fuer Public mit benoetigten Variablen und Zielsystem je Variable nachvollziehbar dokumentiert.
3. ist klar dokumentiert, dass dieses Setup die Voraussetzung fuer spaetere Public-Abnahme in E4 bildet.

## Test Notes
1. Pruefe den Nachweis, dass die vier Plattformbausteine GitHub, Vercel, Neo4j Aura und Public Environment-Verkabelung jeweils mit Zielstatus dokumentiert sind.
2. Pruefe, dass die Public-Variablenzuordnung pro Variable ein eindeutiges Zielsystem und keine lokalen Platzhalter enthaelt.
3. Pruefe, dass im Story-Nachweis die Rolle als Voraussetzung fuer die spaetere Public-Abnahme explizit genannt ist.
