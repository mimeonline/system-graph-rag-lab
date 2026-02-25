# Architect to Dev Handoff Public MVP

## Architektur Kern in 10 Punkten
1. Web UI und API Layer laufen als eine Next.js `16.1.6` Anwendung auf Vercel.
2. UI Stack ist fest auf Tailwind CSS und shadcn/ui sowie Atomic Design als Architekturpattern gebunden.
3. Der API Layer ist als Next.js Route Handler `POST /api/query` umzusetzen.
4. Es gibt im MVP keinen separaten API Service.
5. Neo4j Aura ist der einzige Graph und Vektor Backend Dienst.
6. Retrieval läuft strikt deterministisch nach dem fixierten Contract.
7. Seed Retrieval nutzt `TopK=6` über Vektorindex auf `Concept` und `Problem`.
8. Graph Expansion nutzt `HopDepth=1` ohne dynamische Tiefe und nur erlaubte Relationstypen.
9. Kontextbudget für Retrieval ist hart auf `1400` Tokens begrenzt.
10. API Fehlercodes, serverless konsistentes Rate Limiting auf Vercel KV und minimale Observability sind verbindliche Laufzeitcontracts.

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
6. `429 RATE_LIMIT` enthält `Retry-After` Header und `retryAfterSeconds` im Body mit identischem ganzzahligen Wert.
7. Header `X-Request-Id` muss auf `requestId` gemappt sein.
8. Observability Pflichtfelder im Abschluss Event sind `requestId`, `route`, `method`, `statusCode`, `latencyMs`, `topK`, `hopDepth`, `retrievedNodeCount`, `contextTokens`, `rateLimitTriggered`, `errorCode`.
9. Maschinenlesbare API Spezifikation liegt in `docs/spec/api.openapi.yaml` als OpenAPI 3.1 Abbild von `docs/spec/api.md`.

## Implementierungsreihenfolge
1. API Basisschicht für `POST /api/query` mit Request Validation, Response Mapping und Error Mapping aufbauen.
2. Rate Limit Schicht mit Vercel KV Fixed Window integrieren und `Retry-After` Contract verdrahten.
3. Retrieval Pipeline gemäß Contract umsetzen: Embedding, TopK, Hop Expansion, Dedupe, Sortierung, Budgetierung.
4. LLM Kontextbau und Antwortmapping auf `answer`, `references`, `meta` finalisieren.
5. Observability Abschluss Event mit allen Pflichtfeldern und ohne Rohquery Logging ergänzen.
6. Contract Tests gegen API Schema, Retrieval Determinismus und Rate Limit Grenzfälle ausführen.

## Bekannte Failure Modes und Testhinweise
1. Vercel KV Ausfall oder hohe Latenz kann `500 INTERNAL_ERROR` auslösen und erhöht `latencyMs`, daher Failure Injection für KV Fehlerfall testen.
2. Neo4j Aura Unerreichbarkeit muss deterministisch auf `503 GRAPH_BACKEND_UNAVAILABLE` mappen, inklusive `X-Request-Id`.
3. OpenAI Upstream Fehler müssen als `502 LLM_UPSTREAM_ERROR` oder `504 UPSTREAM_TIMEOUT` gemappt werden.
4. Rate Limit Grenztest muss `10` erfolgreiche Requests und den `11.` Request als `429 RATE_LIMIT` mit identischem `Retry-After` und `retryAfterSeconds` prüfen.
5. Determinismus Test muss bei identischem Input und unverändertem Graph identische Referenzreihenfolge bestätigen.
6. Observability Test muss genau ein Abschluss Event je Request und vollständige Pflichtfelder verifizieren.

## Offene Entscheidungen mit Impact und empfohlener Default Option
1. Entscheidung: Konkretes OpenAI Antwortmodell für P0. Impact: Kosten, Antwortlatenz und Output-Stabilität. Default Option: kleines, stabiles Modell pro aktuellem Betriebsbudget wählen und in Runtime-Konfiguration fixieren.
2. Entscheidung: Technische Empty Trennregel bei schwacher Evidenz. Impact: UX Konsistenz zwischen `answer` und `empty` sowie QA Abnahmesicherheit. Default Option: `state=empty`, wenn nach Budgetierung keine belastbare Evidenz mit Mindestscore verfügbar ist.
3. Entscheidung: `clientKey` Extraktion aus Headern hinter Vercel Proxy. Impact: Rate Limit Fairness und Datenschutzkonsistenz. Default Option: erste valide Client IP aus `x-forwarded-for` nutzen, mit `RATE_LIMIT_IP_SALT` hashen.

## Offene Risiken
1. Ausfall oder erhöhte Latenz von Vercel KV kann API Latenz erhöhen oder zu `500 INTERNAL_ERROR` führen.
2. Token Schätzung via Zeichenheuristik kann vom echten Modellverbrauch leicht abweichen.
3. Neo4j Aura Latenzspitzen können P95 Antwortzeit erhöhen.
4. Fehlende Log Disziplin im Handler kann den minimalen Observability Contract verletzen.

## Offene technische Fragen an Dev
1. Welche robuste Regel wird für `clientKey` Parsing aus `x-forwarded-for` und Fallback Headern verwendet.
2. Welches konkrete OpenAI Modell wird für Antwortgenerierung in P0 fixiert.
3. Wie wird die Empty Regel technisch umgesetzt, wenn Evidenzqualität unter Mindestniveau liegt.
4. Wird der Handler explizit auf Node.js Runtime gesetzt, damit Treiber und Retrieval stabil laufen.

## Dev Guardrails
1. Kein Scope Change gegenüber Discovery und UX Handoff.
2. Keine Erweiterung von Endpoint Anzahl oder Service-Landschaft im MVP.
3. Retrieval Konstanten nur über ADR Änderung anpassbar.
4. Tests sind Pflicht für Determinismus, Fehlercodes, Rate Limit Verhalten und Logfeld Vollständigkeit.
5. Rate Limit Tests müssen Grenzfall und Contract abdecken: `10` Requests erlaubt, `11.` Request `429`, `Retry-After == retryAfterSeconds`.
6. Keine Secrets im Repository, nur Runtime Environment Variables.
