# Security Report Epic E1

## Summary
1. Critical: 0
2. High: 1
3. Medium: 1
4. Low: 0
5. Gesamt: 2

## Top 5 Risiken
1. Fehlender Runtime-Guard fuer destruktiven Local-Reset erlaubt potenziellen Remote-Datenverlust.
2. Delete-Scope basiert nur auf Labels und entfernt auch Nicht-Seed-Daten.
3. `/api/query` enthaelt im aktuellen Stand noch kein aktives Rate-Limit-Verhalten gegen Abuse.
4. `apps/web/.env.local` ist versioniert und erhoeht das Risiko spaeterer Secret-Fehlcommits.
5. Security-Header und CORS-Haertung fuer Public Runtime sind fuer E4 noch offen.

## Findings Referenzen
1. `docs/security/finding-e1-local-reset-missing-runtime-guard.md`
2. `docs/security/finding-e1-local-reset-overbroad-delete-scope.md`

## Empfehlungen priorisiert
1. P0: Local-Only-Guard plus explizites Opt-In fuer destruktiven Reset implementieren.
2. P1: Delete-Operation auf Seed-Besitzmarker begrenzen.
3. P1: Negativtests fuer Guard-Fail und Nicht-Seed-Erhalt ergaenzen.
4. P2: `apps/web/.env.local` aus Versionierung entfernen und nur `.env.example` nutzen.
5. P2: Vor Public Demo Security-Header und Rate-Limit-Checks aus E4 verbindlich gate'n.

## Mitigation Ablauf Vorschlag
### Guard fuer destruktive Seed-Operation
1. Zweck: Verhindert Ausfuehrung des Reset-Ablaufs auf nicht-lokalen Neo4j-Zielen.
2. Input: `NEO4J_URI`, `ALLOW_DESTRUCTIVE_SEED_RESET`.
3. Output: Entweder Freigabe fuer Reset oder harter Abbruch mit Fehler.
4. Fehlerfall: Ungueltiger Host oder fehlendes Opt-In fuehrt zu Abbruch vor jeder DB-Operation.
5. Beispiel: `NEO4J_URI=neo4j+s://remote` und `ALLOW_DESTRUCTIVE_SEED_RESET` nicht `true` ergibt sofortigen Abbruch.

## Limitations des Reviews
1. Kein Live-Exploit gegen nicht-lokale Datenbank ausgefuehrt, um unbeabsichtigte Datenaenderungen zu vermeiden.
2. Kein dynamischer DAST-Lauf gegen public Deployment, da Scope E1 auf local fokussiert ist.
3. Kein vollstaendiger Dependency-Vulnerability-Scan in diesem Run ausgefuehrt.

## Epic Gate Scope
1. Epic: `backlog/epics/e1-wissensmodell-seed-daten.md`
2. Abgedeckte Stories:
3. `backlog/stories/e1-s1-ontologie-fachlich-definieren.md`
4. `backlog/stories/e1-s2-seed-datenbasis-erzeugen.md`
5. `backlog/stories/e1-s3-datenbasis-verfuegbar-machen.md`
6. `backlog/stories/e1-s4-qualitaetspruefung-seed-daten.md`
7. `backlog/stories/e1-s5-quellen-extraktion-normalisierung.md`
8. `backlog/stories/e1-s6-neo4j-lokal-seed-reset.md`

## Gate Decision fuer Epic
1. Fail.
2. Begruendung: Ein High-Finding ist offen und im MVP-Kontext reproduzierbar exploitierbar.
