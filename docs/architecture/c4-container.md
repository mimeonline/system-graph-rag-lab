# C4 Container Public MVP GraphRAG

## Containerübersicht
1. Web UI Container auf Vercel.
2. API Layer Container als Vercel Server Function.
3. Neo4j Aura Container als verwaltete Graph Datenbank.
4. Observability Minimal Container als strukturierte Runtime Logs.

## Containerdetails
### Web UI
1. Sendet `POST /api/query` an den API Layer.
2. Zeigt Hauptantwort, wichtige Bezüge und Kernnachweis.
3. Zeigt Zustände Loading, Empty, Error und Rate Limit inline im Antwortbereich.

### API Layer
1. Validiert Request Input und erzwingt Rate Limit.
2. Führt Retrieval Pipeline nach Contract aus.
3. Formatiert den LLM Kontext deterministisch.
4. Ruft OpenAI API auf und mapped Ergebnis in Response Schema.
5. Schreibt minimale Observability Felder in strukturierte Logs.

### Neo4j Aura
1. Hält Node Types `Concept`, `Author`, `Book`, `Problem`.
2. Hält Relationskanten laut Datenmodell.
3. Liefert TopK Seeds über Vektorindex und Nachbarschaften für Hop Expansion.

### Observability Minimal
1. Quelle ist der API Layer.
2. Persistenz erfolgt über Vercel Runtime Log Stream.
3. Felder sind `requestId`, `statusCode`, `latencyMs`, `topK`, `hopDepth`, `retrievedNodeCount`, `contextTokens`, `rateLimitTriggered`.

## Datenfluss Query zu Retrieval zu Response
1. Web UI sendet `POST /api/query` mit Query Text.
2. API Layer validiert Input und prüft Rate Limit.
3. API Layer erzeugt Query Embedding über OpenAI API.
4. API Layer liest TopK Seeds aus Neo4j Aura.
5. API Layer erweitert Seeds mit Hop Depth Regeln.
6. API Layer dedupliziert, sortiert stabil und budgetiert den Kontext.
7. API Layer ruft OpenAI API mit strukturiertem Kontext auf.
8. API Layer sendet Antwortobjekt mit Referenzen und Metadaten an Web UI.
