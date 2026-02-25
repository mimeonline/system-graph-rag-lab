# Story E1-S2 Kuratierte Quellbasis aus bereitgestellten Quellen erfassen

## Status
qa

## Ziel
Eine belastbare Quellbasis aus bereitgestellten MD-Inhalten und optionalen Internet-Ergänzungen kuratieren.

## Priorität
P0

## Abhängigkeiten
1. E1-S1

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kuratierte Quellenbasis ist dokumentiert

**Given**
eine freigegebene Ontologie und bereitgestellte MD-Quellen

**When**
die Quellen für die Seed-Datenbasis gesichtet und kuratiert werden

**Then**
1. enthält der Quellenkatalog alle für den MVP relevanten bereitgestellten MD-Quellen.
2. ist je Quelle der Typ `primary_md` oder `optional_internet` dokumentiert.
3. sind optionale Internet-Quellen nur für dokumentierte Inhaltslücken ergänzt und als optional markiert.

## Test Notes
1. `pnpm --dir apps/web test -- src/features/seed-data/seed-data.test.ts` erfolgreich am 2026-02-25, inklusive Validierung von Quellenkatalog, Referenzintegritaet und Ontologie-Regeln.
2. Stichprobe im kuratierten Katalog: Eintraege mit `sourceType=primary_md` und `sourceType=optional_internet` sind vorhanden und pro Eintrag mit `internalSource` sowie `publicReference` erfasst.
3. Inhaltliche Abdeckung wurde erweitert: konkrete Tool-Konzepte sowie einzelne `system_traps` und `leverage_points` sind als eigene Nodes mit Quellenbezug in der Seed-Basis enthalten.
