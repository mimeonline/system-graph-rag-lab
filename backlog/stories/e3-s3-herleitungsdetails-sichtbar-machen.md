# Story E3-S3 Herleitungsdetails sichtbar machen

## Status
accepted

## Ziel
Die Nachvollziehbarkeit der Antwort für Nutzer über den P0-Kernnachweis hinaus erhöhen.

## Priorität
P1

## Abhängigkeiten
1. E2-S2
2. E3-S1

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kernverhalten

**Given**
eine erfolgreich beantwortete Frage mit vorhandenem P0-Kernnachweis

**When**
zusätzliche Herleitungsdetails angezeigt werden

**Then**
1. Die zusätzlichen Herleitungsdetails erweitern die Erklärung.
2. Hauptantwort, Referenzkonzepte und P0-Kernnachweis bleiben ohne zusätzliche Interaktion vollständig sichtbar.

## Test Notes
- Validiere, dass P0-Ausgabe ohne P1-Details vollständig nutzbar bleibt und dokumentiere den Zusatznutzen in mindestens zwei Beispielanfragen.
- `2026-02-26`: `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts` (Exit Code `0`) – bestätigt `derivationDetails` plus `coreRationale` und Referenzlimit.
