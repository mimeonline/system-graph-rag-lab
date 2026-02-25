# QA to DevOps Handoff E1-S1 Review

## Teststatus
1. Story `E1-S1` QA-Gate ist Pass.
2. Ausgefuehrte Commands in `apps/web`: `pnpm test`, `pnpm lint`, `pnpm build`, jeweils Pass.
3. Epic `E1` bleibt insgesamt auf QA-Gate Fail, da nur `E1-S1` geprueft wurde.

## Bekannte Einschraenkungen
1. Keine E2E- oder Runtime-Lastmessung in diesem Story-Run.
2. Keine Neo4j Aura oder Vercel Smoke-Checks im Scope von `E1-S1`.
3. Eval-Set mit fuenf Fragen wurde in diesem Lauf nicht ausgefuehrt.

## Monitoring Hinweise
1. Fuer kommende Stories frueh auf `INVALID_REQUEST`, `RATE_LIMIT`, `LLM_UPSTREAM_ERROR`, `GRAPH_BACKEND_UNAVAILABLE`, `UPSTREAM_TIMEOUT` monitoren.
2. Bei Rate-Limit-Pruefungen Konsistenz zwischen `Retry-After` und `error.retryAfterSeconds` sicherstellen.
3. Structured Logs weiter auf minimale Pflichtfelder ohne Rohquery und ohne Secrets pruefen.

## Guardrails Hinweise
1. Rate-Limit Messaging muss fuer Nutzer klar und reproduzierbar bleiben.
2. Keine Secrets in Logs, Build-Ausgaben oder Handoffs.
3. Local und public muessen denselben API- und Retrieval-Contract einhalten.
