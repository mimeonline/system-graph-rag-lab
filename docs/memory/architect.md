# Architect Memory

## Architectural Vision
1. Public MVP bleibt eine einfache, testbare GraphRAG Architektur mit klaren Laufzeitgrenzen zwischen Next.js `16.1.6`, Neo4j Aura, OpenAI API und Vercel KV.
2. Schwerpunkt bleibt reproduzierbare Antwortherleitung statt Funktionsausbau.
3. Tech Stack Bindung für UI bleibt fest auf Tailwind CSS, shadcn/ui und Atomic Design.
4. Deployment bleibt als eigenes Architekturartefakt dokumentiert, damit Laufzeitorte, Netzgrenzen und Rollback prüfbar bleiben.
5. Architekturartefakte bleiben dual geführt als fachlicher Markdown Contract und maschinenlesbare OpenAPI Spezifikation.

## Key Decisions (Summary of ADRs)
1. ADR-0001 fixiert Deployment auf Vercel plus Neo4j Aura mit GitHub als Quellbasis.
2. ADR-0002 fixiert Retrieval Contract mit `TopK=6`, `HopDepth=1`, `ContextBudget=1400` und stabiler Sortierung.
3. ADR-0003 fixiert Tech Stack als Next.js `16.1.6` Einheit mit Route Handler, Tailwind CSS, shadcn/ui, Atomic Design und minimaler Observability.
4. ADR-0004 fixiert serverless konsistentes Rate Limiting auf Vercel KV mit Fixed Window und `429` Contract Mapping.
5. Arc42, C4 und Deployment View wurden auf konsistente KV Darstellung und identische Laufzeitgrenzen synchronisiert.
6. Retrieval Contract enthält eine explizite Allowlist erlaubter Relationstypen für Hop Expansion.
7. API Contract bleibt ohne Scope-Erweiterung in `docs/spec/api.md` und `docs/spec/api.openapi.yaml` synchron.

## Retrieval Strategy Snapshot
1. TopK: 6 Seeds aus Vektorindex auf `Concept` und `Problem`.
2. Hop Depth: 1 Hop Expansion über die erlaubten Relationen `WROTE`, `EXPLAINS`, `ADDRESSES`, `RELATES_TO`, `INFLUENCES`, `CONTRASTS_WITH`.
3. Context Budget Strategy: harte Grenze 1400 Tokens, Dedupe vor Budgetierung, Truncate vor Drop.
4. Evidence Limit bleibt bei maximal 8 Knoten mit stabiler Sortierung.
5. API Hauptfläche bleibt auf maximal 3 Referenzen begrenzt.

## Non Functional Constraints
1. Performance: geringe Latenz durch begrenzte Hop Tiefe und kleine Evidenzmenge.
2. Security: Secrets nur in Runtime, kein Logging von Rohqueries.
3. Cost: feste Budgetgrenzen für Kontext und Basis Rate Limit 10 Requests pro 60 Sekunden je IP über zentralen Vercel KV Counter.
4. Operability: genau ein strukturiertes Abschluss Log Event je Request mit fixen Pflichtfeldern.
5. Contract Stability: `docs/spec/api.md` bleibt fachliche Quelle, OpenAPI bleibt daraus abgeleitet.
6. Deployment Safety: Rollback erfolgt über vorheriges stabiles Vercel Deployment mit unverändertem Datenmodell.
7. Privacy: Rate Limit Schlüssel werden gehasht geführt statt Klartext IP Persistenz.

## Open Architecture Questions
1. Exakte Empty Abgrenzung bei schwacher Evidenz inklusive Mindestscore bleibt offen.
2. Modellfixierung für P0 Antwortgenerierung inklusive Max Token Setting.
3. Welches CI Gate OpenAPI Konsistenzprüfung gegen `docs/spec/api.md` verbindlich absichert.
4. Wie Outbound Restriktionen auf Vercel für nur OpenAI API, Neo4j Aura und Vercel KV praktisch abgesichert werden.

## Next Instructions for Architect Agent
1. Bei Retrieval Parameteränderung zuerst ADR-0002 aktualisieren, danach Retrieval Contract und API Spezifikation synchronisieren.
2. Bei API Laufzeit oder Servicegrenzen Änderungen zuerst ADR-0001, ADR-0003 oder ADR-0004 und danach C4, Arc42, Deployment View und API Spezifikation synchronisieren.
3. Bei Änderungen an C4, ADR, Deployment oder API stets `docs/architecture/arc42.md` synchron halten.
4. Vor Dev Übergabe stets Determinismus Regeln gegen API Schema, Logfeld Contract und QA Kriterien querprüfen.
5. Handoff an Dev immer mit Implementierungsreihenfolge, Failure Modes und offenen Entscheidungen mit Default Option ausgeben.
6. Bei Contract Änderungen zuerst `docs/spec/api.md` anpassen und danach `docs/spec/api.openapi.yaml` regenerieren.
