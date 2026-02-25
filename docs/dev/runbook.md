# Dev Runbook

## Ziel und Scope
1. Dieses Runbook ist die verbindliche Arbeitsgrundlage vor dem Dev Start im MVP.
2. Es beschreibt nur Betriebsabläufe für lokale Entwicklung, Verifikation und Übergaben.
3. Es führt keine Scope Erweiterung, keine Architekturänderung und keine Featureänderung ein.

## Voraussetzungen lokal
1. Node.js in einer Version, die mit Next.js `16.1.6` kompatibel ist.
2. Paketmanager gemäß Projektkonvention und installierte Abhängigkeiten.
3. Docker Desktop oder kompatible Docker Runtime für lokalen Neo4j Betrieb.
4. Netzwerkzugriff für OpenAI API.

## Local Start Reihenfolge
1. Neo4j Docker starten.
2. Neo4j Erreichbarkeit prüfen auf `bolt://localhost:7687`.
3. Environment-Datei laden über `.env.local`, optional `.env` als Fallback.
4. Next.js lokal starten auf `http://localhost:3000`.
5. API Smoke Check gegen `POST /api/query` ausführen.

## Environment Handling Best Practices
1. Primär wird `.env.local` genutzt.
2. Optional kann `.env` als Fallback genutzt werden.
3. Secrets und Keys bleiben immer außerhalb des Repository.
4. `.env.example` dient nur als Template ohne echte Werte.
5. `.env.local` und `.env` dürfen nicht versioniert werden.

## Pflichtvariablen
1. `OPENAI_API_KEY`
2. `OPENAI_MODEL` mit Default `gpt-5-mini`
3. `NEO4J_URI`
4. `NEO4J_USERNAME`
5. `NEO4J_PASSWORD`

## Story Workflow und Status
1. Zulässige Story Status sind `todo`, `in_progress`, `qa`, `accepted`, `blocked`.
2. Dev setzt nach Umsetzung nur `qa` oder `blocked`.
3. Dev setzt nicht `accepted`.
4. PM setzt `accepted` erst nach erfolgreichem QA Gate.

## Epic Gate Trigger
1. Alle Stories eines Epics müssen mindestens Status `qa` haben.
2. Danach sind Security Gate und DevOps Gate verpflichtend.
3. Erst nach diesen Gates ist die Epic Freigabe für den nächsten Schritt belastbar.

## Verifikation
1. Lint: `pnpm lint`
2. Tests: `pnpm test`
3. Build: `pnpm build`
4. Smoke Check lokal:
```bash
curl -s -X POST http://localhost:3000/api/query \
  -H 'Content-Type: application/json' \
  -d '{"query":"Wie wirken Feedback Loops auf lokale Optimierung?"}'
```

## Troubleshooting Kurz
1. `NEO4J_URI` nicht erreichbar: Docker Container, Port-Mapping und lokale Firewall prüfen.
2. `OPENAI_API_KEY` fehlt oder ungültig: lokale Env-Datei und Key-Status prüfen.
3. `429 RATE_LIMIT`: kurz warten, `Retry-After` beachten und Last reduzieren.
4. Build Fehler: zuerst `pnpm install --frozen-lockfile` erneut ausführen und danach Lint plus Tests wiederholen.
5. Unvollständige Antwortdaten: Logs auf `requestId`, `errorCode` und `statusCode` prüfen.

## Übergabehinweise an QA und PM
1. Übergabe an QA enthält Story Status, Test Notes und Verifikationsresultate.
2. QA prüft Contract-Verhalten, Fehlercodes und Smoke-Reproduzierbarkeit.
3. Übergabe an PM erfolgt erst nach QA Ergebnis mit klarer Empfehlung `accepted` oder `blocked`.
4. PM setzt finalen Story-Status `accepted` nur nach erfolgreicher QA Prüfung.
