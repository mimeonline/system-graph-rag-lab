# Architect to Dev Handoff

## Architektur-Kern
1. Zwei Laufzeitprofile: `local` und `public`.
2. Public-Zielbild bleibt Vercel plus Neo4j Aura.
3. Local-Profil bleibt Next.js lokal plus Neo4j Docker.
4. API-Grenze bleibt `POST /api/query`.
5. Retrieval- und API-Contract gelten identisch in beiden Profilen.

## Verbindliche Invarianten
1. Next.js `16.1.6`, TypeScript `strict=true`.
2. Keine Contract-Aenderung ohne ADR.
3. Keine Secrets in versionierten Dateien.
4. Modellwahl nur ueber Environment.

## Dev-Umsetzungsleitplanken
1. E1 bleibt local-first, E4 deckt public runtime nachgelagert ab.
2. Profilunterschiede nur in Adaptern, nicht im API-Verhalten.
3. Story-Implementierungen muessen bestehende Specs respektieren: `docs/spec/api.md`, `docs/spec/retrieval.md`.

## Pflichtpruefungen pro Story
1. Scope-Tests plus `lint`, `test`, `build`.
2. Bei Runtime-Themen zusaetzlich profilbezogene Smoke-Checks.

## Offene Architektur-Risiken
1. Drift zwischen lokalem Neo4j Docker und Aura.
2. Fehlende fail-fast Validierung bei Profil-Fehlkonfiguration.
