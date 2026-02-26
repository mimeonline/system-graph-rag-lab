# QA to DevOps Handoff

## E1 Recheck
### Teststatus
1. Story-Gates E1-S1 bis E1-S6 stehen auf `accepted`.
2. QA-Story-Gate fuer E1-S6 steht auf `Pass` gemaess `docs/qa/verdict.md`.
3. Security-Epic-Gate E1 steht auf `Pass` gemaess `docs/security/verdict-epic.md`.
4. DevOps-Epic-Gate E1 steht auf `Pass` gemaess `docs/ops/verdict-epic.md`.
5. Eval-Status fuer E1 bleibt `Fail`, da Q1 bis Q5 laut `evals/report.md` nicht ausgefuehrt sind.

### Bekannte Einschränkungen
1. E1 hat keine abgeschlossene End-to-End-Eval-Evidenz fuer die fünf Pflichtfragen.
2. Epic-Status in `backlog/progress.md` bleibt aktuell `blocked` bis Eval und PM-Sync abgeschlossen sind.
3. Die vorhandene Reproduzierbarkeit bezieht sich auf lokale Evidenz; Public-Paritaet wird spaeter ueber E4-Gates abgesichert.

### Monitoring Hinweise
1. Beim Eval-Nachlauf pro Frage Antwortstruktur, Referenzqualitaet und Fehlerraten getrennt protokollieren.
2. Bei erneutem E1-Recheck Drift zwischen Eval-Report und Epic-Status in `backlog/progress.md` aktiv gegenpruefen.
3. Bei Public-Lauf auf 429-Ratenlimit-Verhalten plus Request-Korrelation ueber `requestId` achten.

### Guardrails Hinweise
1. Rate-Limit-Rueckgaben muessen Header `Retry-After` und Body-Feld `retryAfterSeconds` konsistent halten.
2. Logs duerfen keine Secrets und keine Rohquery-Inhalte enthalten.
3. Destruktive Seed-Reset-Laeufe bleiben strikt lokal mit Runtime-Guard und Opt-In.

## E2-S2 Kontext konsistent erweitern
### Teststatus
1. Story-Gate E2-S2 ist auf `Pass` gesetzt.
2. Reproduzierbare Tests: `pnpm --dir apps/web exec vitest run src/features/query/retrieval.test.ts` (3 tests, Exit Code 0) und `pnpm --dir apps/web exec vitest run src/app/api/query/route.test.ts` (2 tests, Exit Code 0).
3. Kontext-Verifikation: `context.elements` wurde auf deduplizierte Einträge mit `source.publicReference`, `sourceId`, `sourceFile` und `sourceType` geprüft.

### Bekannte Einschränkungen
1. Attribution basiert auf aktuellen Source-IDs und File-Pfaden; Updates am Source-Mapping erfordern neue QA-Pruefung.
2. `source.publicReference` ist derzeit Pflicht, nicht jedoch automatischer Fallback definiert.
3. Epic E2 bleibt in `todo`, daher sind Konsequenzen fuer nachfolgende Stories noch offen.

### Monitoring Hinweise
1. Beobachte, ob künftig neue Kontextfelder die Deduplizierungslogik beeinflussen.
2. Pruefe bei API-Updates, ob die `context.elements`-Länge weiterhin der Referenzliste entspricht.
3. Behalte das Datenmodell fuer Quellen-Attribute im Auge, damit Attribution konsistent bleibt.

## E2-S3 Antwort aus strukturiertem Kontext erzeugen
### Teststatus
1. Story-Gate E2-S3 ist auf `Pass` gesetzt.
2. Reproduzierbare Tests: `pnpm --dir apps/web exec vitest run src/features/query/answer.test.ts` (2 tests, Exit Code 0) und `pnpm --dir apps/web exec vitest run src/app/api/query/route.test.ts` (2 tests, Exit Code 0).
3. Antwort-Kernelemente inklusive `answer.main`, `answer.coreRationale`, `references` und `context.elements` wurden in den Tests validiert.

### Bekannte Einschränkungen
1. Referenz-Fallback-Text muss weiterhin bei fehlenden Referenzen klar und konsistent formuliert bleiben.
2. Referenzlimit auf drei Einträge über `MAX_REFERENCES_IN_RESPONSE` darf nicht überschritten werden.

### Monitoring Hinweise
1. Bei API-Änderungen sicherstellen, dass `references.length` im Contract weiterhin ≤ 3 bleibt.
2. Fallback und Core-Rationale Texte regelmäßig gegen neue Kontext-Summaries prüfen.
3. E2-S4 Referenz-Abgleich prüfen, wenn neue Erwartungslisten ergänzt werden.

## E2-S4 Referenzkonzepte in Ausgabe absichern
### Teststatus
1. Story-Gate E2-S4 ist auf `Pass` gesetzt.
2. Reproduzierbare Tests: `pnpm --dir apps/web exec vitest run src/features/query/answer.test.ts` (4 tests, Exit Code 0) – Match- und Fallback-Szenarien; `POST /api/query`-Beispielanfragen zeigen sowohl Hinweis-Ausbleiben als auch `Hinweis: ...` bei fehlenden Referenzen.
3. Erwartungsliste `reference-expectations.ts` deckt die fünf Eval-Fragen ab und bleibt deterministisch.

### Bekannte Einschränkungen
1. Erwartungslisten sind aktuell auf fünf Eval-Fragen begrenzt; zusätzliche Fragen müssen manuell ergänzt werden.
2. Fallback-Hinweis ist sprachlich klar definiert; jede professionelle Übersetzung/Paraphrase verlangt neue Tests.
3. API-Responses liefern maximal drei Referenzen; neue Referenzbegrenzungen müssen abgestimmt werden.

### Monitoring Hinweise
1. Bei neuen Eval-Fragen die `reference-expectations.ts`-Tabelle um erwartete Konzepte erweitern und Story neu testen.
2. Fallback-Hinweis muss bei Änderungen an `buildStructuredAnswer` oder `evaluateExpectationMatch` erneut überprüft werden.
3. Beobachte, ob Referenz-Reihenfolge durch Retrieval-Änderungen die deterministischen Matches beeinflusst.

## E3-S1 Query-Eingabe und Antwortansicht bereitstellen
### Teststatus
1. Story-Gate E3-S1 ist auf `pass` gesetzt.
2. Automatisierter Check: `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts` (3 tests, Exit Code 0) – validiert `buildQueryViewModel`, Statusfeedback und Aggregation von Antwort, Referenzen und Kernnachweis.
3. Manueller UI-Check: Dev-Server (`pnpm --dir apps/web dev`) starten, mindestens zwei Fragen absenden, Hauptantwort, Referenzen (max. 3) und `Knapper P0-Kernnachweis` für jede Antwort sichtbar dokumentieren.

### Bekannte Einschränkungen
1. Loading-, Fehler- und Leerezustände werden in E3-S2 behandelt; dieser Story-Run fokussiert nur den erfolgreichen Kernfluss.
2. Referenzliste bleibt auf drei Items begrenzt; zusätzliche Referenzen erweitern momentan weder UI noch Tests.

### Monitoring Hinweise
1. Bei API-Format- oder Referenzlimit-Anpassungen `buildQueryViewModel` und den manual QA-Flow erneut prüfen.
2. Beobachte, ob `coreRationale`-Inhalte bei neuen Fragen weiterhin den `Knappe P0-Kernnachweis` tragen.
3. E3-S2/E3-S3 müssen vor Epic-Abnahme durch PM ebenfalls geprüft werden, damit E3-Epic-Gate dokumentiert werden kann.
