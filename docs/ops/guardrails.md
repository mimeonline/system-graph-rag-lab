# Guardrails

## Rate limiting Strategie
1. Fixed-Window pro Client-Key und Route `/api/query`.
2. Zielwert bleibt 10 Requests pro 60 Sekunden.
3. Bei Ueberschreitung liefert API `429` und `Retry-After`.
4. Contract fordert Gleichheit von `Retry-After` Header und `retryAfterSeconds` Body.

## API usage limits
1. OpenAI Keys werden mit extern konfiguriertem Usage-Limit betrieben.
2. Production und Development nutzen getrennte Keys.
3. Key-Rotation erfolgt ohne Commit oder Log-Ausgabe von Secretwerten.

## Abuse patterns und Gegenmassnahmen
1. Burst-Traffic auf eine IP: Fixed-Window Block und Retry-Wartezeit.
2. Scripted Replay mit hohem Volumen: IP-Hash Monitoring und temporare Blockierung.
3. Prompt Flooding: harte Query-Validierung auf Laenge und Pflichtfeld.
4. Fehlkonfiguration destruktiver Commands: local-only Guard und explizites Opt-In.

## Kostenrisiko und Massnahmen
1. Kostenrisiko entsteht durch OpenAI-Lastspitzen.
2. Massnahmen sind Rate Limit, Query-Validierung und Model-Steuerung ueber `OPENAI_MODEL`.
3. Incident-Fall: Last drosseln und Key-Limit anpassen, danach Smoke und Log-Triage wiederholen.

## E2 Retrieval Guardrail
1. Antwortreferenzen sind auf maximal drei `referenceId`s pro Anfrage begrenzt; jede Referenz wird auf `referenceQuality` und `referenceSource` validiert.
2. Fehlende Referenzen fuehren zu einem klaren `referenceFallbackUsed`-Flag und einem kurzen Hinweistext ohne erweiterte Metadaten.
3. Die neue `referenceCount`-Metrik muss mit der Zahl der in der API-Antwort gelisteten Referenzen korrelieren, sonst ist ein Guardrail-Verstoss zu dokumentieren.
4. Guardrails fuer Requests ohne Referenz-Backup setzen die `Retry-After`-Integritaet nicht ausser Kraft und behalten das `429`-Contract-Verhalten bei.

## Betriebsablauf Rate-Limit Incident
1. Zweck: Kosten und Abuse kurzfristig eindaemmen.
2. Input: erhoehte `429` Quote, Fehlertrend, Log-Korrelation.
3. Output: stabilisierte Last und dokumentierte Anpassung.
4. Fehlerfall: fehlende Header-Body-Konsistenz bei `429` ist Gate-Blocker.
5. Beispiel: Lasttest reproduziert `429` und liefert identische Retry-Werte in Header und Body.

## E3 Query Flow Guardrails
1. Das Query-Panel sendet ausschließlich `POST /api/query` mit dem `query`-Payload; es wurden keine neuen Endpunkte oder Payload-Felder eingeführt (siehe QA-Szenarien in `docs/qa/verdict.md`).
2. Die Statushelfer (Loading, Error, Empty) aus E3-S1 bis E3-S3 deaktivieren den Submit-Button bei laufender Anfrage, wodurch das Rate-Limit durch UI-Steuerung zusätzlich geschützt wird (dokumentiert in `docs/handoff/qa-to-devops.md`).
3. Die Rate-Limit- und Redaction-Guardrails behalten ihre Gültigkeit: `Retry-After`-Header und `retryAfterSeconds`-Body bleiben konsistent, rohe Queries und Secrets werden nicht geloggt.
