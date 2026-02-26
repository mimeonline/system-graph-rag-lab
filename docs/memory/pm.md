# PM Memory

## Current Product Intent
1. E1 liefert lokale Datenbasis-Readiness.
2. E4 liefert Public-Plattform-Readiness.
3. Nachweise fuer local und public bleiben getrennt.
4. E1-S4 und E1-S5 sind PM-seitig accepted, Restumfang E1 bleibt gate-gebunden.

## MVP Scope Guardrails In Out
### In
1. Strikter Workflow `todo -> in_progress -> qa -> pass -> accepted -> blocked`.
2. Status-Synchronisierung im selben Run zwischen Story-Datei und `backlog/progress.md`.
3. QA pro Story sowie Security- und DevOps-Gate pro Epic.

### Out
1. Keine PM-seitige Architektur- oder Implementierungsaenderung.
2. Keine Freigabe `accepted` ohne vorheriges `pass`.
3. Keine Scope-Erweiterung ausserhalb genehmigter Storys.

## Open Assumptions
1. Die QA-Evidenz fuer E1-S5 bleibt bei Folgeaenderungen reproduzierbar stabil.
2. Public-Nachweise werden in E4 separat erbracht.
3. QA-Evidenz bleibt reproduzierbar und eindeutig pro Story.

## Open Decisions
1. Reihenfolge und Begruendung der offenen E1-Story `E1-S6` muss explizit dokumentiert bleiben.
2. Epic-Abschluss wird erst bei vollstaendigen Pflicht-Gates freigegeben.
3. PM-Entscheidungen werden in Handoff plus Progress konsistent gespiegelt.

## Risks to Monitor
1. Statusdrift zwischen Story-Datei, QA-Artefakten und `backlog/progress.md`.
2. Vermischung von lokalem und Public-Nachweis.
3. Epic E1 bleibt blockiert bis `E1-S6` mindestens `pass` ist und Security plus DevOps Gate dokumentiert sind.

## Next Instructions for PM Agent
1. Vor jeder Abnahme Story-Status, QA-Verdict und Progress querpruefen.
2. `accepted` nur setzen, wenn Story bereits `pass` ist.
3. Fuer E1 als naechstes `E1-S6` QA-ready treiben und Epic-Gates separat nachhalten.
