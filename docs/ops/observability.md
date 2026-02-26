# Observability Minimal

## Erfasste Metriken und Logs
1. Pro API-Request genau ein strukturiertes Abschluss-Event.
2. Pflichtfelder: `requestId`, `route`, `method`, `statusCode`, `latencyMs`, `topK`, `hopDepth`, `retrievedNodeCount`, `contextTokens`, `rateLimitTriggered`, `errorCode`.
3. E2-spezifische Felder: `referenceCount`, `contextCandidateCount`, `referenceQuality`, `referenceFallbackUsed`.
4. Public Ziel ist Vercel Runtime Log Stream.
5. Lokal werden dieselben Felder im lokalen Log Stream erfasst.

## Log Redaction Regeln
1. Keine Roh-User-Queries loggen.
2. Keine Secrets oder Key-Material loggen.
3. IP-Adressen nur gehasht fuer Rate-Limit-Keys verwenden.
4. Fehlertexte werden ohne sensible Runtime-Details ausgegeben.

## Fehlerklassen und Korrelation
1. Fehlerklassen: `INVALID_REQUEST`, `RATE_LIMIT`, `LLM_UPSTREAM_ERROR`, `GRAPH_BACKEND_UNAVAILABLE`, `UPSTREAM_TIMEOUT`, `INTERNAL_ERROR`.
2. `requestId` ist in Header und Body konsistent.
3. Incident-Triage startet immer mit `requestId`.

## Betriebsablauf Log-Triage
1. Zweck: Reproduzierbare Fehleranalyse ohne Datenleck.
2. Input: `requestId`, Zeitfenster, betroffene Route.
3. Output: Fehlerklasse, Latenzbild, naechster operativer Schritt.
4. Fehlerfall: Fehlende `requestId` blockiert schnelle Korrelation und wird als Defekt dokumentiert.
5. Beispiel: Suche nach `requestId=<uuid>` im Runtime-Log und mappe auf `errorCode`.

## E3 Query Flow Observability
1. Die Query-Panel- und View-Model-Änderungen basieren auf den gleichen `/api/query`-Completion-Events; es werden weiterhin `requestId`, `route`, `statusCode`, `latencyMs` und die E2-Fields (`referenceCount`, `referenceFallbackUsed`, `referenceQuality`) pro Request ausgegeben.
2. Die manuellen QA-Schritte in `docs/handoff/qa-to-devops.md` dokumentieren, dass jede UI-Abfrage über die bestehende Lifecycle-Logik läuft, sodass Triage über das `requestId`-Korrelationselement weiter funktionsfähig bleibt.
3. Keine neuen Log-Felder oder Public-Exponierungen wurden eingeführt; der Observability-Minimalstandard bleibt der zentrale Referenzpunkt für alle Query-Flows.
