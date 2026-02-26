# Story E1-S5 Quelleninhalte extrahieren und normalisieren

## Status
accepted

## Ziel
Kuratierte Inhalte aus freigegebenen Quellen ontologiekonform in eine belastbare Seed-Datenbasis überführen.

## Priorität
P0

## Abhängigkeiten
1. E1-S2

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kuratierte Quellen werden in Seed-Daten überführt

**Given**
ein kuratierter Quellenkatalog aus `primary_md` und optional `optional_internet` sowie eine freigegebene Ontologie

**When**
Quelleninhalte extrahiert und auf die Ontologie normalisiert werden

**Then**
1. enthält die normalisierte Datenbasis mehr als 100 valide Nodes und mehr als 200 valide Edges.
2. ist für jeden Eintrag eine Herkunftsquelle mit Typ `primary_md` oder `optional_internet` hinterlegt.
3. werden Inhalte ohne belastbare Quellenreferenz nicht übernommen und im Laufprotokoll ausgewiesen.

## Test Notes
1. `pnpm --dir apps/web test` erfolgreich; E1-S5 Tests validieren `105` Nodes und `203` Edges nach Normalisierung.
2. `apps/web/src/features/seed-data/seed-data.test.ts` validiert Herkunftskennzeichnung fuer `sources`, `nodes` und `edges` auf `primary_md` oder `optional_internet`.
3. `apps/web/src/features/seed-data/quality-check.test.ts` validiert Ausschluss ohne belastbare Quellenreferenz und dokumentierten Grund im Laufprotokoll (`issues`).
