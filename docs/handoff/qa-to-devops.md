# QA to DevOps Handoff E1 Recheck

## Teststatus
1. Story-Gates E1-S1 bis E1-S6 stehen auf `accepted`.
2. QA-Story-Gate fuer E1-S6 steht auf `Pass` gemaess `docs/qa/verdict.md`.
3. Security-Epic-Gate E1 steht auf `Pass` gemaess `docs/security/verdict-epic.md`.
4. DevOps-Epic-Gate E1 steht auf `Pass` gemaess `docs/ops/verdict-epic.md`.
5. Eval-Status fuer E1 bleibt `Fail`, da Q1 bis Q5 laut `evals/report.md` nicht ausgefuehrt sind.

## Bekannte Einschraenkungen
1. E1 hat keine abgeschlossene End-to-End-Eval-Evidenz fuer die fuenf Pflichtfragen.
2. Epic-Status in `backlog/progress.md` bleibt aktuell `blocked` bis Eval und PM-Sync abgeschlossen sind.
3. Die vorhandene Reproduzierbarkeit bezieht sich auf lokale Evidenz; Public-Paritaet wird spaeter ueber E4-Gates abgesichert.

## Monitoring Hinweise
1. Beim Eval-Nachlauf pro Frage Antwortstruktur, Referenzqualitaet und Fehlerraten getrennt protokollieren.
2. Bei erneutem E1-Recheck Drift zwischen Eval-Report und Epic-Status in `backlog/progress.md` aktiv gegenpruefen.
3. Bei Public-Lauf auf 429-Ratenlimit-Verhalten plus Request-Korrelation ueber `requestId` achten.

## Guardrails Hinweise
1. Rate-Limit-Rueckgaben muessen Header `Retry-After` und Body-Feld `retryAfterSeconds` konsistent halten.
2. Logs duerfen keine Secrets und keine Rohquery-Inhalte enthalten.
3. Destruktive Seed-Reset-Laeufe bleiben strikt lokal mit Runtime-Guard und Opt-In.
