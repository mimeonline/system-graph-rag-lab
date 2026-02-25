# Dev Handoff E1-S2

## Was ist fertig
1. Story `E1-S2` wurde auf `qa` gesetzt.
2. `apps/web/src/features/seed-data/seed-data.ts` nutzt jetzt einen kuratierten Quellenkatalog aus freigegebenen MD-Quellen statt rein synthetischer Platzhalterdaten.
3. Pro Eintrag sind Herkunftsfelder `sourceType` und `sourceFile` sowie das erweiterte Quellenmodell `internalSource` und `publicReference` umgesetzt.
4. Die Validierung prueft zusaetzlich Quellenkatalog, gueltige Herkunftstypen, Referenzintegritaet und Konsistenz zwischen Top-Level-Quelle und `internalSource` fuer Sources, Nodes und Edges.
5. Inhaltliche Abdeckung wurde ausgebaut: einzelne `system_traps`, `leverage_points` und mehrere `tool_*` Konzepte sind als eigene Nodes und Relationen enthalten.
6. Feature-Doku fuer die geaenderten Funktionen wurde in `apps/web/src/features/seed-data/README.md` aktualisiert.

## Welche Stories wurden umgesetzt
1. `E1-S2 Kuratierte Quellbasis aus bereitgestellten Quellen erfassen`

## Wie kann QA lokal testen
1. In `apps/web` wechseln.
2. Optional `pnpm install` ausfuehren.
3. `pnpm lint` ausfuehren.
4. `pnpm test` ausfuehren.
5. `pnpm build` ausfuehren.
6. Fuer inhaltliche Stichprobe `apps/web/src/features/seed-data/seed-data.ts` oeffnen und mehrere `sourceType` plus `sourceFile` Eintraege pruefen.

## Welche Testdaten oder Seeds noetig sind
1. Keine externen Seeds noetig.
2. Seed-Daten sind im kuratierten Katalog in `seed-data.ts` hinterlegt und deterministisch.

## Bekannte Einschraenkungen
1. Umfangreiche, vollstaendige Extraktion aller Inhalte aus den Quellen bleibt Scope von `E1-S5`.
2. Internet-Quellen sind optional und aktuell nur punktuell fuer dokumentierte Ergaenzungen enthalten.
3. Die kuratierte Seed-Basis ist bewusst MVP-fokussiert und nicht als vollstaendige Ontologie zu verstehen.

## Erwartete Failure Modes
1. Fehlender oder ungueltiger `sourceType` fuehrt zu Validierungsfehlern.
2. Fehlendes `sourceFile` fuehrt zu Validierungsfehlern.
3. Node- oder Edge-Referenz auf nicht katalogisierte Quelle fuehrt zu Validierungsfehlern.
4. Ontologieverletzungen bei Kantenrichtung fuehren zu Validierungsfehlern.

## Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web test -- src/features/seed-data/seed-data.test.ts`: Exit Code `0`, 6 gruene Tests in `seed-data.test.ts`.
2. Optionaler Regression-Check: `pnpm --dir apps/web test`: Exit Code `0`.
