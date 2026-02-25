# DevOps Memory

## Deployment Status
1. Lokale Neo4j Docker Compose Datei wurde unter `docs/ops/docker-compose.local.yml` angelegt.
2. Datei setzt Service `neo4j`, Image `neo4j:5.26.0`, Ports `7474` und `7687`, persistentes Daten-Volume und ENV-basierte Auth.
3. Restart Policy ist auf `unless-stopped` gesetzt für stabile lokale Entwicklung.
4. Deployment-Ziel bleibt unverändert GitHub plus Vercel plus Neo4j Aura.

## Environment Configuration
1. Lokales Profil nutzt primär `.env.local`, optional `.env` als Fallback.
2. Pflichtkeys bleiben `OPENAI_API_KEY`, `OPENAI_MODEL`, `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`.
3. Rate-Limit-Konfiguration bleibt über `RATE_LIMIT_MAX_REQUESTS`, `RATE_LIMIT_WINDOW_SECONDS`, `RATE_LIMIT_IP_SALT`.
4. Public KV Keys bleiben `KV_REST_API_URL` und `KV_REST_API_TOKEN`.
5. Modell-Default ist verbindlich `OPENAI_MODEL=gpt-5-mini`.
6. Für lokalen Neo4j Docker-Start wird zusätzlich `NEO4J_AUTH` im Format `username/password` erwartet.

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
2. Blocker: `handoff/qa-to-devops.md` fehlt.
3. Blocker: Gewünschter Zielpfad `docs/docs/ops/docker-compose.local.yml` kollidiert mit aktivem DevOps-Schreibpfad-Guardrail `ops/**`.
4. Risiko: Fehlkonfiguration von Env Variablen verhindert lokalen Start und Deploy-Smoketests.
5. Risiko: Ohne QA-Nachweise bleibt Deploy-Readiness nur eingeschränkt bewertbar.

## Next Instructions
1. Entscheidung zum Zielpfad der Compose-Datei treffen: `ops/` beibehalten oder Schreibpfadfreigabe für `docs/ops/` erteilen.
2. QA-Artefakte einfordern und gegen Ops-Runbook gegenprüfen.
3. Security-Review für Secret-Hygiene, Logging-Redaction und Rate-Limit-Fehlerpfade durchführen.
