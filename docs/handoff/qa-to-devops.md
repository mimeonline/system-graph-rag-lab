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
3. Kontext-Verifikation: `context.elements` wurde auf deduplizierte Einträge mit `source.publicReference`, `sourceId`, `sourceFile`, `sourceType` und `sourceSummary` geprüft.

### Bekannte Einschränkungen
1. Attribution basiert auf aktuellen Source-IDs und File-Pfaden; Updates am Source-Mapping erfordern neue QA-Pruefung.
2. `source.publicReference` ist derzeit Pflicht, nicht jedoch automatischer Fallback definiert.
3. Epic E2 bleibt in `todo`, daher sind Konsequenzen fuer nachfolgende Stories noch offen.

### Monitoring Hinweise
1. Beobachte, ob künftig neue Kontextfelder die Deduplizierungslogik beeinflussen.
2. Pruefe bei API-Updates, ob die `context.elements`-Länge weiterhin der Referenzliste entspricht.
3. Behalte das Datenmodell fuer Quellen-Attribute im Auge, damit Attribution konsistent bleibt.
