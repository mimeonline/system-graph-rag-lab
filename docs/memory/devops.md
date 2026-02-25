# DevOps Memory

## Deployment Status
1. Hardening-Grundlagen in `docs/ops/` wurden konsolidiert und aktualisiert.
2. Neu oder aktualisiert: `docs/dev/runbook.md`, `docs/dev/workflow.md`, `docs/dev/env.md`, `docs/dev/prompt-template.md`.
3. Deployment-Ziel bleibt unverändert GitHub plus Vercel plus Neo4j Aura.
4. `docs/dev/prompt-template.md` nutzt jetzt einen neutralen gültigen Run-Mode Platzhalter `RUN_MODE=<bootstrap|review|hardening>`.

## Environment Configuration
1. Lokales Profil nutzt primär `.env.local`, optional `.env` als Fallback.
2. Pflichtkeys bleiben `OPENAI_API_KEY`, `OPENAI_MODEL`, `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`.
3. Rate-Limit-Konfiguration bleibt über `RATE_LIMIT_MAX_REQUESTS`, `RATE_LIMIT_WINDOW_SECONDS`, `RATE_LIMIT_IP_SALT`.
4. Public KV Keys bleiben `KV_REST_API_URL` und `KV_REST_API_TOKEN`.
5. Modell-Default ist verbindlich `OPENAI_MODEL=gpt-5-mini`.

## Observability Setup
1. Minimalanforderung bleibt ein strukturiertes Abschluss-Event pro API-Request.
2. Keine Roh-User-Queries oder Secrets in Logs.
3. Pflichtfelder folgen `docs/spec/api.md` und ADR-0003.

## Rate Limiting Status
1. Zielstrategie bleibt Fixed Window mit `10` Requests pro `60` Sekunden.
2. Public Profil nutzt Vercel KV, lokal prozesslokaler Store.
3. `429` Verhalten mit konsistentem `Retry-After` bleibt verbindlich.

## Operational Risks
1. Blocker: `docs/qa/verdict.md` fehlt.
2. Blocker: `docs/handoff/qa-to-devops.md` fehlt.
3. Risiko: Fehlkonfiguration von Env Variablen verhindert lokalen Start und Deploy-Smoketests.
4. Risiko: Ohne QA-Nachweise bleibt Deploy-Readiness nur eingeschränkt bewertbar.

## Next Instructions
1. QA-Artefakte einfordern und gegen Ops-Runbook gegenprüfen.
2. Security-Review für Secret-Hygiene, Logging-Redaction und Rate-Limit-Fehlerpfade durchführen.
3. Nach QA-Input ein DevOps-Gate mit dokumentiertem Deploy-Readiness-Status fahren.
