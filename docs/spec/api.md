# API Definition Public MVP

## Runtime und API Grenze
1. API und Web UI laufen in derselben Next.js `16.1.6` Anwendung mit TypeScript.
2. Der API Layer wird als Next.js Route Handler für `POST /api/query` umgesetzt.
3. Der Handler liegt in `app/api/query/route.ts`.
4. Es gibt im MVP keinen separaten API Service.

## Laufzeitprofile
1. Profil `public`: Next.js auf Vercel, Neo4j Aura, Vercel KV.
2. Profil `local`: Next.js lokal auf `http://localhost:3000`, Neo4j Docker auf localhost, prozesslokaler Rate Limit Store.
3. Endpoint, Request und Response Schema sind in beiden Profilen identisch.

## Runtime Konfiguration und Secret Handling
1. Secrets und Keys werden ausschließlich als Environment Variables geladen.
2. Profil `local` nutzt `.env.local`, optional `.env` als Fallback.
3. Profil `public` nutzt ausschließlich Vercel Environment Variables.
4. `.env` und `.env.local` sind nicht versioniert und dürfen keine Repository Artefakte werden.

## Endpoint
1. Methode: `POST`
2. Pfad: `/api/query`
3. Zweck: Führt Retrieval plus LLM Antwortgenerierung für eine Nutzerfrage aus.

## Machine Readable Contract
1. OpenAPI 3.1 Spezifikation liegt in `docs/spec/api.openapi.yaml`.
2. Bei Abweichungen bleibt diese Datei die fachliche Source of Truth.

## Request Schema
```json
{
  "query": "Wie wirken Feedback Loops auf lokale Optimierung?",
  "clientRequestId": "optional-string"
}
```

## Request Regeln
1. `query` ist Pflichtfeld.
2. `query` Länge liegt zwischen 5 und 500 Zeichen.
3. `clientRequestId` ist optional und maximal 64 Zeichen.
4. Leere oder nur whitespace Queries sind ungültig.

## Response Schema bei Erfolg
```json
{
  "status": "ok",
  "state": "answer",
  "requestId": "uuid",
  "answer": {
    "main": "string",
    "coreRationale": "string"
  },
  "references": [
    {
      "nodeId": "concept:feedback_loops",
      "nodeType": "Concept",
      "title": "Feedback Loops",
      "score": 0.812345,
      "hop": 0
    }
  ],
  "meta": {
    "topK": 6,
    "hopDepth": 1,
    "retrievedNodeCount": 8,
    "contextTokens": 1320,
    "latencyMs": 845,
    "rateLimit": {
      "limit": 10,
      "windowSeconds": 60,
      "remaining": 7
    }
  }
}
```

## Response Regeln bei Erfolg
1. `references` ist stabil sortiert nach Retrieval Contract.
2. `references` enthält höchstens 3 Einträge für die UI Hauptfläche.
3. `meta.topK`, `meta.hopDepth` und `meta.contextTokens` müssen dem Retrieval Lauf entsprechen.
4. `state` ist entweder `answer` oder `empty`.
5. Bei `state="empty"` enthält `references` eine leere Liste.
6. Header `X-Request-Id` ist identisch zu `requestId` im Body.

## Error Schema
```json
{
  "status": "error",
  "requestId": "uuid",
  "error": {
    "code": "RATE_LIMIT",
    "message": "Zu viele Anfragen. Bitte kurz warten.",
    "retryable": true,
    "retryAfterSeconds": 25
  },
  "meta": {
    "latencyMs": 23
  }
}
```

## Error Codes
1. `400 INVALID_REQUEST`: Request Schema oder Query Regeln verletzt.
2. `429 RATE_LIMIT`: Ratenlimit überschritten.
3. `502 LLM_UPSTREAM_ERROR`: Fehler bei OpenAI API Aufruf.
4. `503 GRAPH_BACKEND_UNAVAILABLE`: Neo4j Backend nicht verfügbar.
5. `504 UPSTREAM_TIMEOUT`: Upstream Antwortzeit überschritten.
6. `500 INTERNAL_ERROR`: Unerwarteter interner Fehler.

## Rate Limit Contract
1. Profil `public` nutzt einen zentralen Vercel KV Fixed Window Counter pro `clientKey` und Route.
2. Profil `local` nutzt einen prozesslokalen Fixed Window Counter pro `clientKey` und Route.
3. Standardlimit ist 10 Requests pro 60 Sekunden je Client IP.
4. Bei `429` wird Header `Retry-After` gesetzt.
5. Bei `429` enthält Body `error.retryAfterSeconds` als ganzzahlige Wartezeit.
6. `Retry-After` und `error.retryAfterSeconds` müssen denselben ganzzahligen Wert tragen.
7. Die Wartezeit wird aus der verbleibenden TTL des aktiven Fensters abgeleitet.
8. Erfolgsresponse enthält in `meta.rateLimit` `limit`, `windowSeconds` und `remaining`.

## Observability Contract Minimal
1. Quelle ist ausschließlich der Next.js Route Handler.
2. Pro Request wird genau ein strukturiertes Abschluss Event als JSON geloggt.
3. Logziel ist profilabhängig: Vercel Runtime Logs in `public`, lokaler Log Stream in `local`.
4. Pflichtfelder im Event sind `requestId`, `route`, `method`, `statusCode`, `latencyMs`, `topK`, `hopDepth`, `retrievedNodeCount`, `contextTokens`, `rateLimitTriggered`, `errorCode`.
5. `route` ist immer `/api/query`.
6. `method` ist immer `POST`.
7. `errorCode` ist `null` bei Erfolg.
8. Rohquery Inhalte und Secrets werden nicht geloggt.

## Observability Event Schema
```json
{
  "requestId": "uuid",
  "route": "/api/query",
  "method": "POST",
  "statusCode": 200,
  "latencyMs": 845,
  "topK": 6,
  "hopDepth": 1,
  "retrievedNodeCount": 8,
  "contextTokens": 1320,
  "rateLimitTriggered": false,
  "errorCode": null
}
```

## Mapping UI Zustände
1. Loading: aktiv zwischen Request Start und finaler Response.
2. Empty: `status="ok"` und `answer.main` enthält den Fallback Hinweis bei zu geringer Evidenz.
3. Error: `status="error"` mit Code außer `RATE_LIMIT`.
4. Rate Limit: `status="error"` mit Code `RATE_LIMIT`.

## Lokale Betriebsannahmen
1. Lokale API Basis ist `http://localhost:3000`.
2. Lokales Graph Backend ist Neo4j Docker auf `bolt://localhost:7687`.
3. Für End to End Antwortgenerierung bleibt `OPENAI_API_KEY` erforderlich.
4. Die API darf lokal ohne Vercel KV Credentials startbar sein.
5. Lokale Secrets und Keys werden aus `.env.local` geladen, optional aus `.env`.
