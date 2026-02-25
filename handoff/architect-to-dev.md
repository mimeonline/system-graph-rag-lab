# Architect to Dev Handoff Public MVP

## Architektur Kern in 10 Punkten
1. Web UI und API Layer laufen als eine Next.js Anwendung auf Vercel.
2. Der API Layer ist als Next.js Route Handler `POST /api/query` umzusetzen.
3. Es gibt im MVP keinen separaten API Service.
4. Neo4j Aura ist der einzige Graph und Vektor Backend Dienst.
5. Retrieval läuft strikt deterministisch nach dem fixierten Contract.
6. Seed Retrieval nutzt `TopK=6` über Vektorindex auf `Concept` und `Problem`.
7. Graph Expansion nutzt `HopDepth=1` ohne dynamische Tiefe.
8. Kontextbudget für Retrieval ist hart auf `1400` Tokens begrenzt.
9. API Fehlerbehandlung ist standardisiert über die definierten Error Codes inklusive `429 RATE_LIMIT`.
10. Observability erfolgt minimal über strukturierte JSON Events in Vercel Runtime Logs.

## Retrieval Contract Summary
1. Feste Parameter: `TOP_K=6`, `HOP_DEPTH=1`, `CONTEXT_BUDGET_TOKENS=1400`, `MAX_EVIDENCE_ITEMS=8`.
2. Reihenfolge ist deterministisch: `score DESC`, `hop ASC`, `nodeType ASC`, `nodeId ASC`.
3. Tokenbudget erzwingt Truncate und bei Bedarf Drop der niedrigsten Ränge.
4. Gleicher Input und gleicher Graph müssen identisches Evidence Ranking liefern.

## API Contract Summary
1. Route ist `POST /api/query` als Next.js Route Handler im selben Deploy wie die Web UI.
2. Request Pflichtfeld ist `query`, Länge 5 bis 500 Zeichen.
3. Erfolgsresponse liefert `status`, `requestId`, `answer`, `references`, `meta`.
4. `references` ist auf drei Elemente begrenzt für die Hauptfläche.
5. Fehlerresponse liefert `status`, `requestId`, `error`, `meta`.
6. `429 RATE_LIMIT` enthält `Retry-After` Header und `retryAfterSeconds` im Body.
7. Header `X-Request-Id` muss auf `requestId` gemappt sein.
8. Observability Pflichtfelder im Abschluss Event sind `requestId`, `route`, `method`, `statusCode`, `latencyMs`, `topK`, `hopDepth`, `retrievedNodeCount`, `contextTokens`, `rateLimitTriggered`, `errorCode`.
9. Maschinenlesbare API Spezifikation liegt in `docs/spec/api.openapi.yaml` als OpenAPI 3.1 Abbild von `docs/spec/api.md`.

## Offene Risiken
1. Serverless taugliches Rate Limiting benötigt persistente Store Entscheidung.
2. Token Schätzung via Zeichenheuristik kann vom echten Modellverbrauch leicht abweichen.
3. Neo4j Aura Latenzspitzen können P95 Antwortzeit erhöhen.
4. Fehlende Log Disziplin im Handler kann den minimalen Observability Contract verletzen.

## Offene technische Fragen an Dev
1. Welcher persistente Store wird für IP Rate Limit genutzt, damit Vercel Instanzen konsistent bleiben.
2. Welches konkrete OpenAI Modell wird für Antwortgenerierung in P0 fixiert.
3. Wie wird die Empty Regel technisch umgesetzt, wenn Evidenzqualität unter Mindestniveau liegt.
4. Wird der Handler explizit auf Node.js Runtime gesetzt, damit Treiber und Retrieval stabil laufen.

## Dev Guardrails
1. Kein Scope Change gegenüber Discovery und UX Handoff.
2. Keine Erweiterung von Endpoint Anzahl oder Service-Landschaft im MVP.
3. Retrieval Konstanten nur über ADR Änderung anpassbar.
4. Tests sind Pflicht für Determinismus, Fehlercodes, Rate Limit Verhalten und Logfeld Vollständigkeit.
5. Keine Secrets im Repository, nur Runtime Environment Variables.
