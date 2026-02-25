# Architect Memory

## Architectural Vision
1. Public-Zielbild bleibt Vercel plus Neo4j Aura.
2. Local-Profil bleibt Next.js lokal plus Neo4j Docker.
3. API- und Retrieval-Verhalten bleiben profiluebergreifend konsistent.

## Key Decisions (Summary of ADRs)
1. Profiltrennung `local` und `public` ist etabliert.
2. API-Grenze bleibt `POST /api/query`.
3. Retrieval- und Contract-Parameter bleiben ADR-gebunden.
4. Modellkonfiguration erfolgt nur ueber Environment.

## Retrieval Strategy Snapshot
1. Deterministische Retrieval-Regeln bleiben verbindlich.
2. TopK-, Hop- und Budget-Logik werden nicht storyweise variiert.
3. Empty-vs-Answer-Mapping bleibt contract-basiert.

## Non Functional Constraints
1. Next.js `16.1.6`, TypeScript `strict=true`.
2. Keine Secrets in versionierten Dateien.
3. Architekturartefakte muessen synchron bleiben: ADR, arc42, deployment, spec.

## Open Architecture Questions
1. Wie wird ein stabiler Referenzsnapshot fuer deterministische Replay-Tests gepflegt.
2. Wie wird Profil-Fehlkonfiguration frueh und eindeutig abgefangen.
3. Wie wird local-aura Drift transparent gemessen.

## Next Instructions for Architect Agent
1. Bei Profil- oder Contract-Aenderungen zuerst ADR aktualisieren.
2. Danach Architektur- und Spec-Artefakte synchronisieren.
3. Handoffs auf Delta-Infos begrenzen, keine Vollwiederholung.
