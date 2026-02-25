# Dev to Security Handoff

## Security Context
1. Dieser Run liefert nur das technische Bootstrap ohne fachliche Retrieval- oder LLM-Logik.
2. Sicherheitsrelevant ist aktuell nur das API-Skelett `POST /api/query`.
3. Env-Handling wurde auf Runtime-Variablen ausgerichtet, ohne Secrets im Repository.

## Beruehrte Endpoints und Eingaben
1. Endpoint: `POST /api/query`.
2. Eingaben: `query` und optional `clientRequestId`.
3. Request-Validierung für Typen, Mindest- und Maximalgrenzen ist implementiert.

## Bereits umgesetzte Sicherheitsgrenzen
1. Fehlendes `OPENAI_MODEL` führt zu kontrolliertem `500 INTERNAL_ERROR` statt impliziter Defaults im Code.
2. Ungültige Requests führen zu `400 INVALID_REQUEST`.
3. `.env.example` enthält nur Platzhalterwerte, keine echten Secrets.
4. `.env.local` bleibt lokal und wird durch `.gitignore` nicht versioniert.

## Bekannte offene Risiken
1. Rate-Limit-Logik ist noch nicht implementiert.
2. OpenAI- und Neo4j-Integrationen sind noch nicht implementiert.
3. Strukturierte Abschlusslogs nach Observability-Contract sind noch nicht umgesetzt.

## Security Gate Fokus
1. Prüfen, dass keine Secret-Leaks durch neue Dateien oder Historie entstehen.
2. Prüfen, dass Fehlerpfade keine sensitiven Runtime-Infos oder Rohinputs offenlegen.
3. Prüfen, dass nach Story-Implementierungen `429` Verhalten plus `Retry-After` contract-konform ist.
4. Prüfen, dass Logging später ohne Rohquery und ohne Secrets bleibt.
