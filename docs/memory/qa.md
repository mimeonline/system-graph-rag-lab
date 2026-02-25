# QA Memory

## Quality Focus Areas
1. Story-Gate Reproduzierbarkeit mit expliziter Command-Evidenz in Matrix und Verdict.
2. Konsistenz zwischen Story-Akzeptanzkriterien, Code-Artefakten und Dokumentation.
3. Contract-Konformitaet von `POST /api/query` fuer spaetere Story-Runs inklusive Fehlerpfaden.
4. Epic-Gate Trennung zwischen Story-QA, Security-Gate und DevOps-Gate.

## Known Failure Patterns
1. Story im Status `qa` ohne dokumentierten QA-Ausfuehrungslauf.
2. Drift zwischen Story-AK und tatsaechlich dokumentierter Testevidenz.
3. Spaete Entdeckung von Contract-Abweichungen, wenn Integrationstests nicht frueh ausgefuehrt werden.

## Eval Status
1. Bootstrap fuer Rubrik und Report liegt vor.
2. Review-Run fuer `E1-S1` am 2026-02-25 abgeschlossen.
3. Story-Gate `E1-S1` ist Pass mit dokumentierter Evidenz.
4. Eval-Set mit fuenf Fragen bleibt bis zum ersten End-to-End-Lauf auf Fail.

## Open Quality Risks
1. Epic E1 bleibt blockiert, solange `E1-S2` bis `E1-S4` kein QA-Gate haben.
2. Datenqualitaet und Retrieval-Determinismus sind noch unbewertet, da ausserhalb `E1-S1`.
3. Public-Runtime-Verhalten und Rate-Limit-Konformitaet sind fuer dieses Epic noch offen.

## Next Instructions
1. Naechster QA-Run auf `E1-S2` mit Fokus auf Datenmenge, Schema-Konformitaet und Reproduzierbarkeit.
2. Danach `E1-S3` auf Datenzugriff im Zielbetrieb pruefen.
3. Danach `E1-S4` auf Duplikatbereinigung und Ontologie-Konformitaet pruefen.
4. Vor Epic-Abnahme E1 Security- und DevOps-Gate-Status explizit verlinken.
