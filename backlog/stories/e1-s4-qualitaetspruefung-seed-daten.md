# Story E1-S4 Qualitätsprüfung für kuratierte Seed-Daten ausführen

## Status
accepted

## Ziel
Konsistenz, Herkunft und Eindeutigkeit der kuratierten Seed-Daten vor Nutzung absichern.

## Priorität
P0

## Abhängigkeiten
1. E1-S5
2. E1-S3

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Qualitätsregeln sichern die kuratierte Datenbasis

**Given**
eine im Zielbetrieb verfügbare, normalisierte Seed-Datenbasis und ein kuratierter Quellenkatalog

**When**
Qualitätsregeln ausgeführt werden

**Then**
1. sind alle geprüften Einträge ontologiekonform.
2. sind keine doppelten IDs oder doppelten Relationen vorhanden.
3. besitzt jeder Eintrag eine nachvollziehbare Herkunftskennzeichnung.
4. liegt ein Prüfprotokoll mit Anzahl geprüfter, beanstandeter und ausgeschlossener Einträge vor.

## Test Notes
1. `pnpm --dir apps/web test -- src/features/seed-data/quality-check.test.ts` ausgefuehrt, Exit Code `0`, alle `3` Tests bestanden.
2. Im Test `creates a clean report for the curated dataset` ist das Pruefprotokoll ohne Beanstandungen und Ausschluesse (`issues=[]`, `ausgeschlossen=0`) fuer den kuratierten Datensatz.
3. Im Test `flags and excludes duplicate ids and duplicate relations` werden doppelte Node-IDs und doppelte Relationen als `beanstandet` markiert und aus dem Ergebnisdatensatz ausgeschlossen.
4. Im Test `reports source type split for primary_md and optional_internet` ist die getrennte Ausweisung im Pruefprotokoll fuer `primary_md` und `optional_internet` verifiziert.
