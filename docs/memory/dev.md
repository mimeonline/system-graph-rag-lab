# Dev Memory

## Current Implementation Status
1. RUN_MODE bootstrap abgeschlossen mit lauffaehigem Grundgeruest unter `apps/web`.
2. Next.js `16.1.6`, TypeScript strict, Tailwind und shadcn/ui Basis sind eingerichtet.
3. API-Skelett `POST /api/query` mit Validierung und Contract-nahem Bootstrap-Response ist implementiert.
4. Unit- und einfache Integrations-Tests sind aktiv und gruen.

## Active Epics and Stories
1. Keine Story fachlich umgesetzt.
2. Naechster geplanter Startpunkt ist Epic E1 oder E2 Story-by-Story nach PM-Priorisierung.

## Technical Constraints
1. Kein Scope-Change und keine Architekturabweichung ohne ADR.
2. API- und Retrieval-Contract bleiben Source of Truth.
3. `OPENAI_MODEL` bleibt Pflicht-Env, Modellname darf nicht im Code hardcodiert sein.
4. Local-Profil bleibt Next.js lokal plus Neo4j Docker gemaess Architektur.

## Known Technical Debt
1. `/api/query` ist aktuell nur Skelett ohne Neo4j-Retrieval und ohne OpenAI-Completion.
2. Rate-Limit-Adapter und Observability-Event nach Contract fehlen noch.
3. UI ist nur Bootstrap-Struktur ohne Story-spezifische Interaktion.

## Blocking Issues
1. Keine Docker-Setup-Artefakte fuer lokale Neo4j-Laufzeit im Dev-Schreibbereich vorhanden.
2. Falls solche Artefakte ausserhalb erlaubter Dev-Pfade liegen, ist Abstimmung mit Architect oder DevOps erforderlich.

## Next Instructions for Dev Agent
1. Erste fachliche Story aus Backlog priorisiert starten und Status auf `in_progress` setzen.
2. Bei API-Storys zuerst Retrieval- und Error-Contract vollstaendig implementieren.
3. Anschliessend Rate-Limit und Observability contract-konform erweitern.
