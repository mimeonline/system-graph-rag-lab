# Ops Environment Configuration

## Pflicht-Variablen
1. `OPENAI_API_KEY`
2. `OPENAI_MODEL`
3. `NEO4J_URI`
4. `NEO4J_USERNAME`
5. `NEO4J_PASSWORD`
6. `RATE_LIMIT_MAX_REQUESTS`
7. `RATE_LIMIT_WINDOW_SECONDS`
8. `RATE_LIMIT_IP_SALT`

## Public Profil zusätzliche Variablen
1. `KV_REST_API_URL`
2. `KV_REST_API_TOKEN`

## Beispielwerte ohne Secrets
```dotenv
OPENAI_API_KEY=sk-placeholder
OPENAI_MODEL=gpt-5-mini
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=change-me
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_SECONDS=60
RATE_LIMIT_IP_SALT=replace-with-random-string
KV_REST_API_URL=https://kv.example.upstash.io
KV_REST_API_TOKEN=token-placeholder
```

## Hinweise
1. `OPENAI_MODEL=gpt-5-mini` ist der verbindliche MVP-Default.
2. `.env.local` ist lokal primär, `.env` optional als Fallback.
3. In Vercel werden alle Werte ausschließlich als Environment Variables gesetzt.
4. Keine Secrets in Repository-Dateien oder Handoff-Dokumenten hinterlegen.
