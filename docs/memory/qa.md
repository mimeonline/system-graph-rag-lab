# QA Memory

## Quality Focus Areas
1. Story-Gate Reproduzierbarkeit mit expliziter Command-Evidenz in Matrix und Verdict.
2. Konsistenz zwischen Story-Akzeptanzkriterien, Seed-Daten-Artefakten und Testabdeckung.
3. Contract-Konformitaet von `POST /api/query` fuer kommende Retrieval- und Runtime-Stories.
4. Epic-Gate Trennung zwischen Story-QA, Security-Gate und DevOps-Gate.

## Known Failure Patterns
1. Story im Status `qa` ohne dokumentierten QA-Ausfuehrungslauf.
2. Drift zwischen Story-AK und tatsaechlich dokumentierter Testevidenz.
3. Spaete Entdeckung von Contract-Abweichungen, wenn Integrationstests nicht frueh ausgefuehrt werden.
4. E1-Seed-Risiko: `optional_internet` ohne klare Lueckenbegruendung fuehrt zu Nachvollziehbarkeitsverlust.

## Eval Status
1. Bootstrap fuer Rubrik und Report liegt vor.
2. Review-Run fuer `E1-S1` am 2026-02-25 abgeschlossen mit Story-Gate Pass.
3. Review-Run fuer `E1-S2` am 2026-02-25 abgeschlossen mit Story-Gate Pass.
4. Eval-Set mit fuenf Fragen bleibt bis zum ersten End-to-End-Lauf auf Fail.

## Open Quality Risks
1. Epic E1 bleibt blockiert, solange `E1-S3`, `E1-S4` und `E1-S5` kein QA-Gate haben.
2. Datenzugriff im Zielbetrieb ist noch unbewertet, da `E1-S3` offen ist.
3. Datenqualitaet auf Duplikate und Ausschlussprotokoll ist noch unbewertet, da `E1-S4` offen ist.

## Next Instructions
1. Naechster QA-Run auf `E1-S5` mit Fokus auf Mengenkriterien, Herkunft und Ausschlussprotokoll.
2. Danach `E1-S3` auf Zielbetriebs-Lesezugriff und Herkunftsfelder pruefen.
3. Danach `E1-S4` auf Duplikatfreiheit, Ontologiekonformitaet und Pruefprotokoll pruefen.
4. Vor Epic-Abnahme E1 Security- und DevOps-Gate-Status explizit verlinken.
