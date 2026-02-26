# PM Memory

## Current Product Intent
1. E1 liefert lokale Datenbasis-Readiness.
2. E4 liefert Public-Plattform-Readiness.
3. Nachweise fuer local und public bleiben getrennt.
4. E1-S6 ist nach QA-`pass` PM-seitig auf `accepted` freigegeben.
5. Epic E1 bleibt `blocked`, bis Epic-QA plus Eval Q1 bis Q5 auf `Pass` stehen.

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
1. Public-Nachweise werden in E4 separat erbracht.
2. QA-Evidenz bleibt reproduzierbar und eindeutig pro Story.
3. Der vollstaendige Eval-Lauf Q1 bis Q5 fuer E1 wird im naechsten Gate-Run nachgezogen.

## Open Decisions
1. Epic-Abschluss E1 wird erst bei vollstaendigen Pflicht-Gates freigegeben.
2. PM-Entscheidungen werden in Handoff plus Progress konsistent gespiegelt.
3. Zeitpunkt fuer finalen E1-Abschlusslauf mit Eval Q1 bis Q5 bleibt offen.
4. Epic E1 bleibt `blocked`, bis `docs/qa/verdict-epic.md` auf `Pass` und Eval-Report ohne offene Q1 bis Q5 Fails steht.

## Risks to Monitor
1. Statusdrift zwischen Story-Datei, QA-Artefakten und `backlog/progress.md`.
2. Vermischung von lokalem und Public-Nachweis.
3. Epic-QA-Verdict kann trotz akzeptierter Story auf Fail stehen und muss getrennt gesteuert werden.
4. E1-Eval bleibt aktuell `Fail` fuer Q1 bis Q5 und blockiert den Epic-Abschluss.
5. Regressionsrisiko bei spaeteren Aenderungen am lokalen Reset-Guard bleibt bestehen.

## Next Instructions for PM Agent
1. Vor jeder Abnahme Story-Status, QA-Verdict und Progress querpruefen.
2. `accepted` nur setzen, wenn Story bereits `pass` ist.
3. Fuer E1 als naechstes einen vollstaendigen Eval-Lauf Q1 bis Q5 einfordern und in QA-Artefakten spiegeln.
4. Epic E1 erst auf `accepted` setzen, wenn QA, Security und DevOps fuer E1 ohne Blocker `Pass` sind.
