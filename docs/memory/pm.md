# PM Memory

## Current Product Intent
1. E1 liefert lokale Datenbasis-Readiness.
2. E4 liefert Public-Plattform-Readiness.
3. Nachweise fuer local und public bleiben getrennt.
4. E1-S6 ist wegen Security-Gate-Fail wieder offen und steht auf `blocked`, bis Security-Fixes nachgeprueft sind.
5. Epic E1 bleibt bis dokumentiertem Security- und DevOps-Gate im Status in_progress.

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
1. Dev liefert fuer E1-S6 einen Security-Fix, der Runtime-Guard und Delete-Scope-Absicherung abdeckt.
2. Public-Nachweise werden in E4 separat erbracht.
3. QA-Evidenz bleibt reproduzierbar und eindeutig pro Story.

## Open Decisions
1. Epic-Abschluss E1 wird erst bei vollstaendigen Pflicht-Gates freigegeben.
2. PM-Entscheidungen werden in Handoff plus Progress konsistent gespiegelt.
3. Zeitpunkt fuer finalen E1-Abschlusslauf mit Eval Q1 bis Q5 bleibt offen.
4. E1-S6 bleibt `blocked` bis Security-Verdict fuer E1 ohne Blocker vorliegt.

## Risks to Monitor
1. Statusdrift zwischen Story-Datei, QA-Artefakten und `backlog/progress.md`.
2. Vermischung von lokalem und Public-Nachweis.
3. Epic E1 bleibt blockiert bis Security plus DevOps Gate dokumentiert sind.
4. Epic-QA-Verdict kann trotz akzeptierter Story auf Fail stehen und muss getrennt gesteuert werden.
5. Regressionsrisiko, falls E1-S6 nach Fix ohne erneuten Security-Recheck wieder freigegeben wird.

## Next Instructions for PM Agent
1. Vor jeder Abnahme Story-Status, QA-Verdict und Progress querpruefen.
2. `accepted` nur setzen, wenn Story bereits `pass` ist.
3. Fuer E1-S6 Security-Fix-Nachweis und Recheck einfordern, danach QA und PM-Freigabe erneut pruefen.
4. Fuer E1 als naechstes Security- und DevOps-Gates nachziehen und Epic-QA erneut laufen lassen.
