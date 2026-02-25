# Architect Memory

## Architectural Vision
1. Public MVP bleibt eine einfache, testbare GraphRAG Architektur mit klaren Laufzeitgrenzen zwischen Next.js API, Neo4j Aura und OpenAI API.
2. Schwerpunkt bleibt reproduzierbare Antwortherleitung statt Funktionsausbau.
3. Architekturartefakte bleiben dual geführt als fachlicher Markdown Contract und maschinenlesbare OpenAPI Spezifikation.

## Key Decisions (Summary of ADRs)
1. ADR-0001 fixiert Deployment auf Vercel plus Neo4j Aura mit GitHub als Quellbasis.
2. ADR-0002 fixiert Retrieval Contract mit `TopK=6`, `HopDepth=1`, `ContextBudget=1400` und stabiler Sortierung.
3. ADR-0003 fixiert Tech Stack als eine Next.js Einheit mit Route Handler und minimaler Observability.
4. API Contract wird ohne Scope-Erweiterung in `docs/spec/api.md` und `docs/spec/api.openapi.yaml` synchron gehalten.

## Retrieval Strategy Snapshot
1. TopK: 6 Seeds aus Vektorindex auf `Concept` und `Problem`.
2. Hop Depth: 1 Hop Expansion über erlaubte Relationen.
3. Context Budget Strategy: harte Grenze 1400 Tokens, Dedupe vor Budgetierung, Truncate vor Drop.

## NFR Constraints
1. Performance: geringe Latenz durch begrenzte Hop Tiefe und kleine Evidenzmenge.
2. Security: Secrets nur in Runtime, kein Logging von Rohqueries.
3. Cost: feste Budgetgrenzen für Kontext und Basis Rate Limit 10 Requests pro 60 Sekunden je IP.
4. Operability: genau ein strukturiertes Abschluss Log Event je Request mit fixen Pflichtfeldern.
5. Contract Stability: `docs/spec/api.md` bleibt fachliche Quelle, OpenAPI bleibt daraus abgeleitet.

## Open Questions
1. Persistenter Rate Limit Store für serverless Konsistenz auf Vercel.
2. Exakte Empty Abgrenzung bei schwacher Evidenz in der Implementierung.
3. Modellfixierung für P0 Antwortgenerierung inklusive Max Token Setting.
4. Explizite Runtime Wahl Node.js versus Edge für den finalen Handler Betrieb.
5. Welches CI Gate OpenAPI Konsistenzprüfung gegen `docs/spec/api.md` verbindlich absichert.

## Next Instructions for Architect Agent
1. Bei Retrieval Parameteränderung zuerst ADR-0002 aktualisieren, danach Retrieval Contract und API Spezifikation synchronisieren.
2. Bei API Laufzeit oder Servicegrenzen Änderungen zuerst ADR-0003 und danach C4 plus API Spezifikation synchronisieren.
3. Vor Dev Übergabe stets Determinismus Regeln gegen API Schema, Logfeld Contract und QA Kriterien querprüfen.
4. Bei Contract Änderungen zuerst `docs/spec/api.md` anpassen und danach `docs/spec/api.openapi.yaml` regenerieren.
