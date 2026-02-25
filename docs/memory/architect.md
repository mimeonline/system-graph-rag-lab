# Architect Memory

## Architectural Vision
1. Public MVP bleibt eine einfache, testbare GraphRAG Architektur mit klaren API und Retrieval Grenzen.
2. Schwerpunkt liegt auf reproduzierbarer Antwortherleitung statt auf Funktionsausbau.

## Key Decisions (Summary of ADRs)
1. ADR-0001: Deployment bleibt auf Vercel plus Neo4j Aura mit GitHub als Quellbasis.
2. ADR-0002: Retrieval Contract ist fix mit `TopK=6`, `HopDepth=1`, `ContextBudget=1400` und stabiler Sortierung.

## Retrieval Strategy Snapshot
1. TopK: 6 Seeds aus Vektorindex auf `Concept` und `Problem`.
2. Hop Depth: 1 Hop Expansion über erlaubte Relationen.
3. Context Budget Strategy: harte Grenze 1400 Tokens, Dedupe vor Budgetierung, Truncate vor Drop.

## Non Functional Constraints
1. Performance: Ziel ist niedrige Latenz durch begrenzte Hop Tiefe und kleine Evidenzmenge.
2. Security: Secrets nur in Runtime, kein Logging von Rohqueries.
3. Cost: feste Budgetgrenzen für Kontext und Basis Rate Limit 10 Requests pro 60 Sekunden je IP.

## Open Architecture Questions
1. Persistenter Rate Limit Store für serverless Konsistenz auf Vercel.
2. Exakte Empty Abgrenzung bei schwacher Evidenz in der Implementierung.
3. Modellfixierung für P0 Antwortgenerierung inklusive Max Token Setting.

## Next Instructions for Architect Agent
1. Bei Retrieval Parameteränderung zuerst ADR-0002 aktualisieren, danach Retrieval Contract und API Spec synchronisieren.
2. Bei neuen UX Transparenzfeldern zuerst prüfen, ob sie ohne Scope Erweiterung aus bestehendem Retrieval Output ableitbar sind.
3. Vor Dev Übergabe stets Determinismus Regeln gegen API Schema und QA Kriterien querprüfen.
