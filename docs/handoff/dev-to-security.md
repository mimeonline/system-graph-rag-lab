# DevOps to Security Handoff

## Deploy Status
1. Ops-Hardening-Artefakte für den Dev-Start sind erstellt und konsolidiert.
2. Vorhanden sind `docs/dev/runbook.md`, `docs/dev/workflow.md`, `docs/dev/env.md` und `docs/dev/prompt-template.md`.
3. Es wurden keine Scope-, Architektur- oder Feature-Änderungen vorgenommen.

## Aktive Guardrails
1. Secret Handling ist auf Environment Variables begrenzt.
2. `.env.local` ist lokal primär, `.env` optionaler Fallback.
3. Rate-Limit-Strategie bleibt Fixed Window mit `10` pro `60` Sekunden.
4. Logging darf keine Roh-User-Queries und keine Secret-Werte enthalten.

## Offene Risiken
1. `docs/qa/verdict.md` fehlt als Verifikationsgrundlage.
2. `docs/handoff/qa-to-devops.md` fehlt als QA-Übergabe.
3. Env-Fehlkonfiguration bleibt ein Ausfallrisiko für lokale und Public-Smoke-Checks.

## Erwartete Secrets und Environment Keys
1. `OPENAI_API_KEY`
2. `OPENAI_MODEL`
3. `NEO4J_URI`
4. `NEO4J_USERNAME`
5. `NEO4J_PASSWORD`
6. `RATE_LIMIT_MAX_REQUESTS`
7. `RATE_LIMIT_WINDOW_SECONDS`
8. `RATE_LIMIT_IP_SALT`
9. `KV_REST_API_URL`
10. `KV_REST_API_TOKEN`

## Security Prüfauftrag
1. Prüfen, dass keine Secrets im Repository oder in der Historie enthalten sind.
2. Prüfen, dass Logs keine Rohqueries und keine Secrets enthalten.
3. Prüfen, dass `429` Antworten konsistent `Retry-After` und `retryAfterSeconds` liefern.
4. Prüfen, dass Fehlerpfade bei fehlenden Env-Variablen kontrolliert ohne Datenleck reagieren.
