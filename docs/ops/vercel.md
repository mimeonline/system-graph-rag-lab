# Vercel Deployment Setup

## Projekt Setup
1. Runtime-Ziel ist Vercel mit App Root `apps/web`.
2. Das Repository wird in Vercel importiert und mit dem Production-Branch verknuepft.
3. Build Command ist `pnpm build` mit Working Directory `apps/web`.
4. Install Command ist `pnpm install --frozen-lockfile` im Working Directory `apps/web`.
5. Node Runtime muss mit Next.js `16.1.6` kompatibel sein.

## Required Environment Variables
1. `OPENAI_API_KEY`
2. `OPENAI_MODEL`
3. `NEXT_PUBLIC_SITE_URL`
4. `NEO4J_URI`
5. `NEO4J_DATABASE`
6. `NEO4J_USERNAME`
7. `NEO4J_PASSWORD`
8. `RATE_LIMIT_MAX_REQUESTS`
9. `RATE_LIMIT_WINDOW_SECONDS`
10. `RATE_LIMIT_IP_SALT`
11. `KV_REST_API_URL`
12. `KV_REST_API_TOKEN`

## Neo4j Aura Verbindung
1. Aura Endpoint wird ueber `NEO4J_URI` gesetzt.
2. Datenbankname wird ueber `NEO4J_DATABASE` gesetzt.
3. Authentisierung nutzt `NEO4J_USERNAME` und `NEO4J_PASSWORD`.
4. Werte werden nur als Vercel Environment Variables gepflegt.

## OpenAI Key Handling
1. OpenAI Zugriff erfolgt nur ueber `OPENAI_API_KEY`.
2. Modellwahl erfolgt nur ueber `OPENAI_MODEL`.
3. Default fuer `OPENAI_MODEL` bleibt `gpt-5-mini`.
4. API Keys werden nicht in Repo, Logs oder Handoffs abgelegt.

## Public URL Handling
1. `NEXT_PUBLIC_SITE_URL` muss auf die produktive HTTPS-Domain gesetzt werden.
2. Der Wert steuert Canonical-URL, OpenGraph-URL, `robots.txt`, `sitemap.xml` und `llms.txt`.

## Deploy Ablauf
### Betriebsablauf: Vercel Deploy und Smoke
1. Zweck: Reproduzierbares Deployment mit schnellem Fehlernachweis.
2. Input: Gemergter Branch, gesetzte Vercel Variablen, gruene CI.
3. Output: Erfolgreiches Deployment plus Smoke-Evidenz fuer `POST /api/query`.
4. Fehlerfall: Build oder Runtime-Fehler fuehren zu nicht promotetem Deployment.
5. Beispiel:
```bash
curl -s -X POST https://<deployment-url>/api/query \
  -H 'Content-Type: application/json' \
  -d '{"query":"Wie wirken Feedback Loops auf lokale Optimierung?"}'
```

## Rollback Hinweise
1. In Vercel wird das letzte stabile Deployment erneut promoted.
2. Rollback umfasst immer Code plus zugehoerige Environment-Konfiguration.
3. Nach Rollback wird derselbe API-Smoke erneut ausgefuehrt.
4. Bei weiterem Fehler bleibt das Epic-Gate auf `Fail` bis zur neuen Evidenz.
