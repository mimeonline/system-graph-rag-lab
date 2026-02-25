# Dev Handoff E1-S1

## Was ist fertig
1. Fachliche Ontologie fuer Story `E1-S1` ist implementiert und dokumentiert unter `apps/web/src/features/ontology/`.
2. Node-Typen `Concept`, `Author`, `Book`, `Problem` sind als feste Typmenge definiert.
3. Erlaubte Relationen `WROTE`, `EXPLAINS`, `ADDRESSES`, `RELATES_TO`, `INFLUENCES`, `CONTRASTS_WITH` inklusive Source-Target-Matrix sind umgesetzt.
4. Validierungs-Helper `isAllowedOntologyRelation` ist vorhanden.
5. Unit-Tests fuer Vollstaendigkeit und Relationserlaubnis sind vorhanden.

## Wie kann QA testen
1. In `apps/web` wechseln.
2. `pnpm test` ausfuehren und auf gruenen Lauf inkl. `src/features/ontology/ontology.test.ts` pruefen.
3. Optional Gesamtpruefung laufen lassen: `pnpm lint` und `pnpm build`.
4. Dokumentationssicht pruefen: `apps/web/src/features/ontology/README.md` muss alle vier Node-Typen und alle sechs erlaubten Relationen enthalten.

## Bekannte Einschraenkungen
1. Die Story liefert nur die fachliche Ontologie-Definition, noch keine Seed-Daten oder Neo4j-Constraints-Ausfuehrung.
2. Es gibt keinen separaten Runtime-Endpoint fuer Ontologie-Inspektion im Scope dieser Story.

## Erwartete Failure Modes
1. Bei unvollstaendiger Ontologie-Definition schlagen `ontology.test.ts` Assertions fehl.
2. Bei versehentlicher Aenderung erlaubter Relationsrichtungen schlaegt der Testfall fuer erlaubte versus unerlaubte Relationen fehl.
3. Bei TypeScript-Fehlern im Ontologie-Modul scheitert `pnpm build` im Type-Check-Schritt.
