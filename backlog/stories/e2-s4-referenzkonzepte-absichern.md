# Story E2-S4 Referenzkonzepte in Ausgabe absichern

## Status
todo

## Ziel
Konsistente Mindestqualität für Referenzkonzepte sicherstellen.

## Priorität
P0

## Abhängigkeiten
1. E2-S3

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kernverhalten

**Given**
eine erfolgreich erzeugte Antwort und eine freigegebene Erwartungsliste für die jeweilige Eval-Frage

**When**
die ersten drei Referenzkonzepte der Antwort geprüft werden

**Then**
1. sind mindestens zwei Konzepte in der Erwartungsliste enthalten oder es wird ein klarer Fallback-Hinweis ausgegeben

## Test Notes
Führe Positiv- und Negativfälle aus und dokumentiere die Trefferquote sowie das Fallback-Verhalten.
