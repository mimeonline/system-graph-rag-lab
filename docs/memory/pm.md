# PM Memory

## Current Product Intent
1. E1 ist als lokaler Datenbasis-Nachweis abgeschlossen und PM-seitig auf `accepted` gesetzt.
2. E4 bleibt der separate Nachweisstrang fuer Public-Plattform-Readiness.
3. PM-Entscheidungen bleiben gate-basiert mit synchronem Statusabgleich in `backlog/progress.md`.
4. E2-S1 Kontextkandidaten pro Frage bereitstellen wird nach QA-Pass von PM akzeptiert; Status und Progress sind synchronisiert.
5. Story E2-S2 Kontext für Antwort konsistent erweitern wurde nach `docs/qa/verdict.md`-Pass von PM auf `accepted` gesetzt; `backlog/progress.md` ist im selben Run konsistent.
6. Story E2-S3 Antwort aus strukturiertem Kontext erzeugen wurde ebenfalls nach dem QA-Verdikt vom 26.02.2026 in `docs/qa/verdict.md` auf `accepted` gesetzt; QA bestätigt Referenzlimit und Fallback-Stabilität.
7. Story E2-S4 Referenzkonzepte in Ausgabe absichern folgte dem QA-Verdikt `Pass` vom 26.02.2026 (`docs/qa/verdict.md`) und wurde PM-seitig auf `accepted` gesetzt, um die Erwartungslisten- und Fallback-Checks rechtzeitig zu verankern.
8. Epic E2 ist nach QA-, Security- und DevOps-`Pass`-Verdikten durchgängig synchronisiert und PM-seitig nun ebenfalls auf `accepted`.

## MVP Scope Guardrails In Out
### In
1. Verbindlicher Workflow `todo -> in_progress -> qa -> pass -> accepted` auf Story-Ebene.
2. Status-Synchronisierung im selben Run zwischen Story-Datei und `backlog/progress.md`.
3. QA pro Story sowie Security- und DevOps-Gate pro Epic.

### Out
1. Keine PM-seitigen Architektur- oder Implementierungsentscheidungen.
2. Keine Freigabe `accepted` ohne vorheriges `pass`.
3. Keine Scope-Erweiterung ausserhalb bestehender Epics E1 bis E5.

## Open Assumptions
1. Public-Nachweise werden in E4 separat und vollstaendig erbracht.
2. QA-, Security- und DevOps-Evidenz bleiben auch in Folgeruns konsistent referenzierbar.
3. E5-Eval bleibt fuer die Gesamt-MVP-Abnahme relevant, ohne Rueckwirkung auf den abgeschlossenen E1-Epic-Status.

## Open Decisions
1. Reihenfolge der naechsten PM-Abnahmen fuer E2 bis E5 bleibt offen und wird am Story- und Gate-Fortschritt ausgerichtet.
2. Zeitpunkt fuer den finalen vollstaendigen Gate-Run vor Public Demo bleibt offen.

## Risks to Monitor
1. Statusdrift zwischen Story-Datei, QA-Artefakten und `backlog/progress.md`.
2. Vermischung von lokalem Nachweis E1 und Public-Nachweis E4.
3. Regressionsrisiko bei spaeteren Aenderungen am lokalen Reset-Guard.
4. Risiko spaeterer Gate-Regressionen durch unsynchronisierte Rechecks in QA, Security oder DevOps.
5. Retrieval bleibt derzeit keyword-basiert; semantische Embeddings müssen in späteren Stories nachgezogen werden.
6. Erwartungslistenpflege für neue Eval-Fragen muss parallel zu Story- oder Eval-Erweiterungen koordiniert werden, sonst verlieren Referenz-Matching-Checks wie in E2-S4 ihre Validität.

## Next Instructions for PM Agent
1. Vor jeder PM-Abnahme Story-Status, QA-Verdict und Progress querpruefen.
2. Bei jedem Statuswechsel Story oder Epic im selben Run `backlog/progress.md` synchronisieren.
3. Epic-Freigaben nur setzen, wenn QA-, Security- und DevOps-Gate fuer das Epic dokumentiert `Pass` sind.
4. Nach PM-Abnahmen kurz im PM-Memory festhalten, welcher verdiktierte QA-Report die Entscheidung trug.
