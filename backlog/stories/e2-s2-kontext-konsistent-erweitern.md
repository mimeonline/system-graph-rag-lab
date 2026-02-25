# Story E2-S2 Kontext für Antwort konsistent erweitern

## Status
todo

## Ziel
Primärkandidaten um relevante Kontextelemente für die Antwortvorbereitung ergänzen.

## Priorität
P0

## Abhängigkeiten
1. E2-S1
2. E1-S3

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kernverhalten

**Given**
eine Kandidatenliste

**When**
die Kontextanreicherung ausgeführt wird

**Then**
1. Ein deduplizierter Antwortkontext liegt vor, in dem jedes Konzept höchstens einmal vorkommt.
2. Jedes Kontextelement ist einem Kandidaten oder einer Erweiterungsquelle zugeordnet.

## Test Notes
Prüfe Duplikatfreiheit und dokumentiere für jedes Kontextelement die zugeordnete Quelle.
