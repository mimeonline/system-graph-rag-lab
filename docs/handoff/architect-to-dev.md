# Architect to Dev Handoff Public MVP

## Architektur Kern in 10 Punkten
1. Public Runtime bleibt unverändert auf Vercel plus Neo4j Aura plus Vercel KV.
2. Local Dev ist ein eigenes Laufzeitprofil mit Next.js lokal und Neo4j Docker.
3. API Grenze bleibt in beiden Profilen identisch auf `POST /api/query` als Next.js Route Handler.
4. Es gibt im MVP keinen separaten API Service.
5. Retrieval Contract bleibt strikt deterministisch und profilunabhängig.
6. Seed Retrieval nutzt `TopK=6` über Vektorindex auf `Concept`, `Tool` und `Problem`.
7. Graph Expansion nutzt `HopDepth=1` und nur erlaubte Relationstypen.
8. Kontextbudget ist hart auf `1400` Tokens begrenzt und Empty Mapping ist strikt über `retrievedNodeCount` geregelt.
9. Next.js Implementierung ist verbindlich TypeScript mit `strict=true` als Default.
10. OpenAI Modell wird nur über `OPENAI_MODEL` konfiguriert, Default `gpt-5-mini`, ohne Hardcode im Code.

## Trennung Local Dev und Public Runtime
1. Public Runtime ist das alleinige Produktionsziel.
2. Local Dev dient reproduzierbarer Entwicklung ohne Vercel Runtime und ohne Neo4j Aura.
3. Unterschiede sind nur bei Laufzeitorten und Betriebsadaptern erlaubt.
4. Unterschiede in API Schema, Retrieval Parametern oder Fehlercodes sind nicht erlaubt.
5. Aktueller Implementierungsfokus in E1 ist verbindlich `local`.
6. Public Runtime Umsetzung wird für E4 Stories vorbereitet, aber in E1 nicht vorgezogen.

## Retrieval Contract Summary
1. Feste Parameter: `TOP_K=6`, `HOP_DEPTH=1`, `CONTEXT_BUDGET_TOKENS=1400`, `MAX_EVIDENCE_ITEMS=8`.
2. Reihenfolge ist deterministisch: `score DESC`, `hop ASC`, `nodeType ASC`, `nodeId ASC`.
3. Tokenbudget erzwingt Truncate und bei Bedarf Drop der niedrigsten Ränge.
4. Gleicher Input und gleicher Graph müssen identisches Evidence Ranking liefern.
5. API Mapping ist fix: `state=empty` nur bei `selectedCount=0`, sonst `state=answer`.

## API Contract Summary
1. Route ist `POST /api/query` im selben Deploy wie die Web UI.
2. Request Pflichtfeld ist `query`, Länge 5 bis 500 Zeichen.
3. Erfolgsresponse liefert `status`, `requestId`, `answer`, `references`, `meta`.
4. `state=empty` ist nur erlaubt bei `meta.retrievedNodeCount=0` und `references=[]`.
5. `state=answer` ist nur erlaubt bei `meta.retrievedNodeCount>=1` und `references` zwischen 1 und 3.
6. Fehlerresponse liefert `status`, `requestId`, `error`, `meta`.
7. `429 RATE_LIMIT` enthält `Retry-After` Header und `retryAfterSeconds` im Body mit identischem ganzzahligen Wert.
8. Header `X-Request-Id` muss auf `requestId` gemappt sein.
9. Observability Pflichtfelder im Abschluss Event sind `requestId`, `route`, `method`, `statusCode`, `latencyMs`, `topK`, `hopDepth`, `retrievedNodeCount`, `contextTokens`, `rateLimitTriggered`, `errorCode`.
10. `OPENAI_MODEL` ist Pflichtvariable mit Environment Default `gpt-5-mini`.

## Deterministischer Local Dev Setup Contract
1. Local URL ist fix `http://localhost:3000`.
2. Neo4j Docker Ports sind fix `7474` und `7687`.
3. `NEO4J_URI` ist lokal fix auf `bolt://localhost:7687`.
4. Local Profil nutzt denselben Datenmodell Contract wie `docs/architecture/data-model.md`.
5. Local Rate Limit nutzt denselben Grenzwert wie public: `10` Requests pro `60` Sekunden.
6. Local Profil benötigt keine Vercel KV Credentials.
7. OpenAI API bleibt für End to End Antwortgenerierung notwendig.
8. Mindest Smoke Test local: ein erfolgreicher `POST /api/query` und ein `429` Grenzfalltest.
9. Abschlussbedingung local: Contractkonforme Response plus genau ein strukturiertes Abschluss Event pro Request.
10. Local Config wird über `.env.local` gesetzt, optional `.env` als Fallback.
11. `.env` und `.env.local` werden nicht versioniert.
12. Local Neo4j Docker Image ist fest auf `neo4j:5.26.0` gepinnt.
13. Image Tag `latest` ist unzulässig.

## Implementierungsreihenfolge
1. E1 Startregel umsetzen: `local` vollständig lauffähig herstellen, `public` Zielbild unverändert lassen.
2. Laufzeitprofil Schalter für `public` und `local` mit identischer API Oberfläche umsetzen.
3. Local Neo4j Anbindung auf `bolt://localhost:7687` und public Aura Anbindung profilgebunden verdrahten.
4. Rate Limit Adapter profilabhängig verdrahten: Vercel KV für `public`, prozesslokal für `local`.
5. Retrieval Pipeline gemäß Contract umsetzen: Embedding, TopK, Hop Expansion, Dedupe, Sortierung, Budgetierung.
6. Response Mapping und Error Mapping contractkonform finalisieren.
7. Observability Abschluss Event mit Pflichtfeldern in beiden Profilen prüfen.
8. Public runtime-spezifische Verifikation als E4 Folgearbeit einplanen, ohne E1 Scope zu erweitern.

## Bekannte Failure Modes und Testhinweise
1. Public Profil: Vercel KV Ausfall oder hohe Latenz kann `500 INTERNAL_ERROR` auslösen.
2. Local Profil: Neo4j Container nicht erreichbar muss auf `503 GRAPH_BACKEND_UNAVAILABLE` mappen.
3. Beide Profile: OpenAI Upstream Fehler müssen als `502 LLM_UPSTREAM_ERROR` oder `504 UPSTREAM_TIMEOUT` mappen.
4. Beide Profile: Rate Limit Grenztest muss `10` erfolgreiche Requests und den `11.` Request als `429 RATE_LIMIT` prüfen.
5. Beide Profile: Determinismus Test muss bei identischem Input und unverändertem Graph identische Referenzreihenfolge bestätigen.
6. Beide Profile: Observability Test muss genau ein Abschluss Event je Request und vollständige Pflichtfelder verifizieren.

## Offene Risiken und technische Fragen
1. Trotz Pinning kann zwischen Neo4j Docker `5.26.0` local und Aura Runtime weiterhin Retrieval Drift auftreten.
2. OpenAI API bleibt externe Abhängigkeit für End to End Antwortpfad.
3. Welche konkrete lokale Datenbefüllung als Referenzsnapshot für deterministische QA Replays genutzt wird.
4. Wie der Laufzeitprofil Schalter technisch so umgesetzt wird, dass Fehlkonfigurationen früh und eindeutig fehlschlagen.

## Dev Guardrails
1. Kein Scope Change gegenüber Discovery, UX und bestehendem API Contract.
2. Keine Erweiterung von Endpoint Anzahl oder Service Landschaft im MVP.
3. Retrieval Konstanten nur über ADR Änderung anpassbar.
4. Tests sind Pflicht für Determinismus, Fehlercodes, Rate Limit Verhalten und Logfeld Vollständigkeit in beiden Profilen.
5. Keine Secrets oder Keys im Repository, nur Runtime Environment Variables.
6. TypeScript ist für Next.js Implementierung verbindlich.
7. TypeScript `strict=true` darf nicht deaktiviert werden.
8. Local Secrets und Keys nur über `.env.local` oder `.env`, niemals als committed Datei.
9. Public Runtime Ziel bleibt Vercel plus Neo4j Aura.
10. Kein OpenAI Modellname im Code hardcodieren.
