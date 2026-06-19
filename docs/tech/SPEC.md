# SPEC

## Zweck
Dieses Dokument ist der aktive technische Einstiegspunkt für System GraphRAG Lab.

Die detaillierten technischen Verträge bleiben in ihren spezialisierten Dateien. Diese SPEC bündelt die Pfade und macht klar, welche Dokumente aktuell maßgeblich sind.

## Dokumentstatus
1. Status: `active`
2. Zuletzt aktualisiert: `2026-06-19`
3. Scope: Public GraphRAG MVP für System Thinking.

## PRD-Bezug
1. Produktreferenz: `docs/product/PRD.md`
2. MVP-Scope: `docs/product/scope-mvp.md`
3. Produkt-Roadmap: `docs/product/roadmap.md`

## Technische Kurzentscheidung
1. Runtime-Modell: Next.js App Router mit Route Handlern.
2. UI: Tailwind CSS und shadcn/ui.
3. Graph Backend: Neo4j.
4. LLM/Embeddings: OpenAI API.
5. Deployment-Ziel: Vercel für Public Demo, lokale Entwicklung mit Docker Compose für Neo4j.
6. Package Manager: pnpm im App-Verzeichnis `apps/web`.

## Maßgebliche technische Referenzen
1. Architekturüberblick: `docs/tech/architecture/arc42.md`
2. C4 Kontext: `docs/tech/architecture/c4-context.md`
3. C4 Container: `docs/tech/architecture/c4-container.md`
4. Deployment View: `docs/tech/architecture/deployment-view.md`
5. Datenmodell: `docs/tech/models/data-model.md`
6. API-Vertrag: `docs/tech/spec/api.md`
7. OpenAPI-Vertrag: `docs/tech/spec/api.openapi.yaml`
8. Retrieval Contract: `docs/tech/spec/retrieval-contract.md`

## Betriebsreferenzen
1. Lokaler Runbook-Kontext: `docs/tech/operations/runbook.md`
2. Environment-Dokumentation: `docs/tech/operations/env.md`
3. Vercel-Dokumentation: `docs/tech/operations/vercel.md`
4. Observability: `docs/tech/operations/observability.md`
5. Guardrails: `docs/tech/operations/guardrails.md`

## Architekturentscheidungen
Die aktuellen ADRs liegen unter `docs/tech/ADR/`.

## Pflegepunkte
1. Interne Pfadverweise müssen bei weiteren Dokumentationsbewegungen synchron aktualisiert werden.
2. Bei Code- oder App-Konfigurationsänderungen gelten weiterhin die Validierungsbefehle aus `README.md` und `AGENTS.md`.
