# QA Memory

## Quality Focus Areas
1. Story-Gate Reproduzierbarkeit mit eindeutiger Evidenz in Matrix und Verdict.
2. Contract-Konformitaet fuer `POST /api/query` inklusive Error-Codes, Header und State-Mapping.
3. Retrieval-Determinismus mit stabiler Top-3 Reihenfolge bei konstantem Datenstand.
4. Referenzqualitaet gemaess Relevanzregel fuer die ersten drei Referenzen.
5. Guardrails fuer Rate-Limit, Secret-Hygiene und Logging-Minimum.

## Active Test Suites
1. QA-E1 bis QA-E5 Testfall-IDs in `docs/qa/test-matrix.md` als Bootstrap-Vorlage.

## Known Failure Patterns
1. Story im Status `qa` ohne dokumentierten QA-Ausfuehrungslauf.
2. Drift zwischen Story-AK und tatsaechlich dokumentierter Testevidenz.
3. API Contract-Drift bei Fehlerpfaden, insbesondere 429 Header-Body-Inkonsistenz.
4. Unklare Referenzqualitaet ohne freigegebene Erwartungslisten pro Eval-Frage.
5. Log-Events mit Risiko auf zu breite Felder statt minimalem Contract.

## Eval Status
1. Bootstrap abgeschlossen am 2026-02-25.
2. Rubrik mit 5 Fragen angelegt in `evals/rubric.md`.
3. Eval-Report als Template angelegt in `evals/report.md`.
4. Gesamtstatus aktuell Fail bis erster reproduzierbarer Eval-Lauf dokumentiert ist.

## Open Quality Risks
1. Fehlende Story-Ausfuehrungsevidenz blockiert belastbare QA-Gate-Freigaben.
2. Public-Runtime Guardrails koennen ohne Lasttests spaet auffallen.
3. Neo4j local versus aura kann Retrieval-Reihenfolgen abweichend machen.
4. Erwartungslisten fuer Referenzrelevanz sind fuer echte Abnahme noch nicht freigegeben.

## Next Instructions for QA Agent
1. Bei naechstem Run zuerst Story mit Status `qa` testen und Matrix markieren.
2. Danach `docs/qa/verdict.md` mit konkretem Story-Ergebnis aktualisieren.
3. Bei jedem Fail sofort Bug-Report anlegen oder aktualisieren.
4. Vor Epic-Gate Security- und DevOps-Gate-Status explizit verlinken.
5. Nach erstem Eval-Lauf `evals/report.md` mit Messwerten und Beobachtungen fortschreiben.
