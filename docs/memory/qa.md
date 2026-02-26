# QA Memory

## Quality Focus Areas
1. Epic-Rechecks muessen Story-Status, QA-, Security- und DevOps-Gates im selben Run konsistent querpruefen.
2. Gate-Evidenz bleibt nur valide mit klarer Dateireferenz plus aktuellem Datum.
3. Cross-Epic-Abhaengigkeiten duerfen nur gelten, wenn sie explizit gefordert sind.
4. Status-Synchronisation zwischen Story-Dateien, Epic-Progress und Gate-Artefakten muss konsistent bleiben.

## Known Failure Patterns
1. Epic-Gates koennen formal auf Fail bleiben, obwohl Story-, Security- und DevOps-Gates bereits auf Pass stehen.
2. Cross-Epic-Kopplung wird faelschlich als Blocker genutzt, obwohl keine Abhaengigkeit dokumentiert ist.
3. Backlog-Epic-Status kann nach Recheck in `blocked` verbleiben, wenn PM-Sync nicht nachgezogen wird.

## Eval Status
1. Recheck E1 am 2026-02-26 durchgefuehrt.
2. Story- und QA-Gate fuer E1 stehen auf Pass/accepted.
3. Security-Gate E1: Pass.
4. DevOps-Gate E1: Pass.
5. E5-Eval Q1 bis Q5 bleibt offen, ist aber kein Blocker fuer E1 gemaess Recheck-Regel.
6. QA Epic Verdict E1: Pass.
7. Story-Gate E2-S1 am 2026-02-26 auf Pass gesetzt.
8. Evidenz fuer E2-S1: retrieval- und route-Tests sowie lint/test/build sind reproduzierbar gruen.
9. Story-Gate E2-S2 am 2026-02-26 auf Pass gesetzt; Retrieval- und API-Tests bestaetigen deduplizierte `context.elements` mit Source-Attribution.
10. Story-Gate E2-S3 am 2026-02-26 auf Pass gesetzt; `answer`- und `route`-Tests demonstrieren nicht leere Hauptantwort, Referenzlimit ≤3 und neue Fallback-Logik.

## Open Quality Risks
1. Public-Betriebsparitaet bleibt bis zu E4-Gates unvollstaendig abgesichert.
2. Eval-Ergebnislage fuer Q1 bis Q5 bleibt fuer E5-Abnahme offen.
3. Epic-Progress kann ohne PM-Sync von QA-Verdikten abweichen.
4. E2-Retrieval ist aktuell keyword-basiert und kann semantische Randfaelle schlechter priorisieren.
5. Kontext-Attribution in `context.elements` braucht enge Nachverfolgung, falls sich Source-IDs oder Source-Filestructure aendern.
6. Referenz-Fallback-Text und Referenzlimit müssen bei künftigen Antwort-Anpassungen nachziehen, sonst drohen Inkonsistenzen.

## Next Instructions
1. PM-Sync fuer Epic E1 in `backlog/progress.md` auf Basis des QA-Epic-Pass durchfuehren.
2. E5-S2 Eval-Lauf fuer Q1 bis Q5 separat ausfuehren und `evals/report.md` aktualisieren.
3. Nach E5-Eval einen eigenstaendigen QA-Recheck fuer E5 starten.
4. PM-Abnahme fuer E2-S1 auf Basis von `docs/handoff/qa-to-pm.md` durchfuehren.
5. Story E2-S4 Referenzkonzepte absichern und Fallback-Regeln gegen `/api/query`-Contract prüfen.
