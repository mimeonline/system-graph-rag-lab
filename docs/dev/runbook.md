# Dev Runbook

## Start lokal
1. In `apps/web` Abhaengigkeiten installieren: `pnpm install --frozen-lockfile`.
2. Lokalen Neo4j Docker mit `neo4j:5.26.0` starten.
3. `apps/web/.env.local` setzen, optional `apps/web/.env` als Fallback.
4. App starten: `pnpm --dir apps/web dev`.
5. Erreichbarkeit auf `http://localhost:3000` pruefen.

## Start Tests
1. Lint: `pnpm --dir apps/web lint`.
2. Tests: `pnpm --dir apps/web test`.
3. Build: `pnpm --dir apps/web build`.
4. Story E1-S6 lokal: `pnpm --dir apps/web seed:local:reset-reseed`.

## Troubleshooting
1. Build oder TypeScript Fehler: `pnpm --dir apps/web install --frozen-lockfile` erneut und danach Lint plus Test plus Build.
2. Smoke-Check Fehler: `X-Request-Id` notieren und Abschluss-Event im Log pruefen.
3. Laufzeitdifferenz local versus public: zuerst identische Env-Namen und Rate-Limit-Werte abgleichen.

## Common failure modes
1. DB unreachable: `NEO4J_URI` oder Neo4j Container ist nicht erreichbar.
2. Rate limit: `429` mit `Retry-After`; Last reduzieren und nach Wartezeit erneut pruefen.
3. Key missing: fehlendes `OPENAI_API_KEY` oder leeres `OPENAI_MODEL` fuehrt zu API-Fehler.
4. Auth failure: `NEO4J_USERNAME` oder `NEO4J_PASSWORD` sind falsch.

## Betriebsablauf API Smoke
1. Zweck: Schnellpruefung nach lokalem Start oder Rollback.
2. Input: laufende App, gesetzte Env-Variablen, laufender Neo4j.
3. Output: valide JSON-Response oder reproduzierbarer Fehlercode.
4. Fehlerfall: `5xx` oder Timeout blockiert Gate bis Ursache dokumentiert ist.
5. Beispiel:
```bash
curl -s -X POST http://localhost:3000/api/query \
  -H 'Content-Type: application/json' \
  -d '{"query":"Was sind Feedback Loops?"}'
```
