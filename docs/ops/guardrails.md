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

## Betriebsablauf Rate-Limit Incident
1. Zweck: Kosten und Abuse kurzfristig eindaemmen.
2. Input: erhoehte `429` Quote, Fehlertrend, Log-Korrelation.
3. Output: stabilisierte Last und dokumentierte Anpassung.
4. Fehlerfall: fehlende Header-Body-Konsistenz bei `429` ist Gate-Blocker.
5. Beispiel: Lasttest reproduziert `429` und liefert identische Retry-Werte in Header und Body.
