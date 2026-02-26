# Ops Environment Configuration

## Pflichtvariablen
1. `OPENAI_API_KEY`
2. `OPENAI_MODEL`
3. `NEO4J_URI`
4. `NEO4J_DATABASE`
5. `NEO4J_USERNAME`
6. `NEO4J_PASSWORD`
7. `RATE_LIMIT_MAX_REQUESTS`
8. `RATE_LIMIT_WINDOW_SECONDS`
9. `RATE_LIMIT_IP_SALT`

## Public zusaetzlich
1. `KV_REST_API_URL`
2. `KV_REST_API_TOKEN`

## Beispielwerte ohne Secrets
```dotenv
OPENAI_API_KEY=sk-placeholder
OPENAI_MODEL=gpt-5-mini
NEO4J_URI=bolt://localhost:7687
NEO4J_DATABASE=neo4j
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=change-me
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_SECONDS=60
RATE_LIMIT_IP_SALT=replace-with-random-string
KV_REST_API_URL=https://kv.example.upstash.io
KV_REST_API_TOKEN=token-placeholder
```

## Hinweise
1. Default fuer `OPENAI_MODEL` ist `gpt-5-mini`.
2. Lokal ist `apps/web/.env.local` primaer, `apps/web/.env` optional.
3. Public werden Werte nur ueber Vercel Environment Variables gesetzt.
4. `.env` und `.env.local` duerfen nicht versioniert werden.
