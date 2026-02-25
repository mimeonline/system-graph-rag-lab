# QA Memory

## Quality Focus Areas
1. Story-Gate Reproduzierbarkeit mit expliziter Command-Evidenz in Matrix und Verdict.
2. Konsistenz zwischen Story-Akzeptanzkriterien, Runtime-Read und Herkunftsfeldern `sourceType` und `sourceFile`.
3. Contract-Konformitaet von `POST /api/query` fuer kommende Retrieval- und Runtime-Stories.
4. Epic-Gate Trennung zwischen Story-QA, Security-Gate und DevOps-Gate.

## Known Failure Patterns
1. Story im Status `qa` ohne dokumentierten QA-Ausfuehrungslauf.
2. Drift zwischen Story-AK und tatsaechlich dokumentierter Testevidenz.
3. Integrations-Smoke wird stillschweigend `skipped`, wenn `NEO4J_DATABASE` im Laufkontext fehlt.
4. Spaete Entdeckung von Contract-Abweichungen, wenn Integrationschecks nur lokal und nicht profiluebergreifend laufen.

## Eval Status
1. Bootstrap fuer Rubrik und Report liegt vor.
2. Review-Run fuer `E1-S1` am 2026-02-25 abgeschlossen mit Story-Gate Pass.
3. Review-Run fuer `E1-S2` am 2026-02-25 abgeschlossen mit Story-Gate Pass.
4. Review-Run fuer `E1-S3` am 2026-02-25 validiert, Story und Progress im selben Run auf `pass` synchronisiert.
5. Eval-Set mit fuenf Fragen bleibt bis zum ersten End-to-End-Lauf auf Fail.

## Open Quality Risks
1. Epic E1 bleibt blockiert, solange `E1-S4`, `E1-S5` und `E1-S6` kein QA-Gate haben.
2. Story-Abhaengigkeit `E1-S3 -> E1-S5` ist prozessual offen, da `E1-S5` noch `todo` ist.
3. Paritaet zwischen lokalem Neo4j-Docker-Lauf und Aura-Lauf ist noch unbewertet.

## Next Instructions
1. Naechster QA-Run auf `E1-S5` mit Fokus auf Mengenkriterien, Herkunft und Ausschlussprotokoll.
2. Danach `E1-S4` auf Duplikatfreiheit, Ontologiekonformitaet und Pruefprotokoll pruefen.
3. Danach `E1-S6` auf reproduzierbaren Seed-Reset-und-Reseed-Lauf pruefen.
4. Vor Epic-Abnahme E1 Security- und DevOps-Gate-Status explizit verlinken.
