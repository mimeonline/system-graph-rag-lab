# API Definition Public MVP

## Endpoint
1. Methode: `POST`
2. Pfad: `/api/query`
3. Zweck: Führt Retrieval plus LLM Antwortgenerierung für eine Nutzerfrage aus.

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
5. Bei `state=\"empty\"` enthält `references` eine leere Liste.

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
4. `503 GRAPH_BACKEND_UNAVAILABLE`: Neo4j Aura nicht verfügbar.
5. `504 UPSTREAM_TIMEOUT`: Upstream Antwortzeit überschritten.
6. `500 INTERNAL_ERROR`: Unerwarteter interner Fehler.

## Rate Limit Contract
1. Standardlimit ist 10 Requests pro 60 Sekunden je Client IP.
2. Bei `429` wird Header `Retry-After` gesetzt.
3. Bei `429` enthält Body `error.retryAfterSeconds` als ganzzahlige Wartezeit.
4. Response enthält in `meta.rateLimit` die verbleibende Anfragezahl bei Erfolg.

## Observability Felder Minimal
1. `requestId`
2. `statusCode`
3. `latencyMs`
4. `topK`
5. `hopDepth`
6. `retrievedNodeCount`
7. `contextTokens`
8. `rateLimitTriggered`

## Mapping UI Zustände
1. Loading: aktiv zwischen Request Start und finaler Response.
2. Empty: `status="ok"` und `answer.main` enthält den Fallback Hinweis bei zu geringer Evidenz.
3. Error: `status="error"` mit Code außer `RATE_LIMIT`.
4. Rate Limit: `status="error"` mit Code `RATE_LIMIT`.
