# Architect to Dev Handoff Public MVP

## Architektur Kern in 10 Punkten
1. Deployment Ziel ist Vercel für Web UI und API Layer sowie Neo4j Aura für Graph Datenhaltung.
2. Es gibt genau einen MVP Endpoint `POST /api/query`.
3. Retrieval läuft strikt deterministisch nach festem Contract.
4. Seed Retrieval nutzt TopK 6 über Vektorindex auf `Concept` und `Problem`.
5. Graph Expansion nutzt Hop Depth 1 und keine dynamische Tiefe.
6. Kontextbudget für Retrieval ist hart auf 1400 Tokens begrenzt.
7. Evidenz wird dedupliziert über `nodeId` und stabil sortiert.
8. API Response enthält `answer.main`, `answer.coreRationale` und maximal drei Referenzen.
9. Fehlerbehandlung ist standardisiert über sechs Error Codes inklusive `RATE_LIMIT`.
10. Observability ist minimal, aber pro Request vollständig mit Kernfeldern instrumentiert.

## Retrieval Contract Summary
1. Feste Parameter: `TOP_K=6`, `HOP_DEPTH=1`, `CONTEXT_BUDGET_TOKENS=1400`, `MAX_EVIDENCE_ITEMS=8`.
2. Reihenfolge ist deterministisch: `score DESC`, `hop ASC`, `nodeType ASC`, `nodeId ASC`.
3. Tokenbudget erzwingt Truncate und bei Bedarf Drop der niedrigsten Ränge.
4. Gleicher Input und gleicher Graph müssen identisches Evidence Ranking liefern.

## API Contract Summary
1. Request Pflichtfeld ist `query`, Länge 5 bis 500 Zeichen.
2. Erfolgsresponse liefert `status`, `requestId`, `answer`, `references`, `meta`.
3. `references` ist auf drei Elemente begrenzt für die Hauptfläche.
4. Fehlerresponse liefert `status`, `requestId`, `error`, `meta`.
5. `429 RATE_LIMIT` enthält `Retry-After` Header und `retryAfterSeconds` im Body.

## Offene Risiken
1. Serverless taugliches Rate Limiting benötigt persistente Store Entscheidung.
2. Token Schätzung via Zeichenheuristik kann vom echten Modellverbrauch leicht abweichen.
3. Neo4j Aura Latenzspitzen können P95 Antwortzeit erhöhen.

## Offene technische Fragen an Dev
1. Welcher persistente Store wird für IP Rate Limit genutzt, damit Vercel Instanzen konsistent bleiben.
2. Welches konkrete OpenAI Modell wird für Antwortgenerierung in P0 fixiert.
3. Wie wird die Empty Regel technisch umgesetzt, wenn Evidenzqualität unter Mindestniveau liegt.

## Dev Guardrails
1. Kein Scope Change gegenüber Discovery und UX Handoff.
2. Keine Erweiterung von Endpoint Anzahl im MVP.
3. Retrieval Konstanten nur über ADR Änderung anpassbar.
4. Tests sind Pflicht für Determinismus, Fehlercodes und Rate Limit Verhalten.
5. Keine Secrets im Repository, nur Runtime Environment Variables.
