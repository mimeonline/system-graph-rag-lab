# Architect Memory

## Architectural Vision
1. Public MVP bleibt eine klare GraphRAG Architektur mit unverändertem Produktionsziel auf Vercel plus Neo4j Aura.
2. Dieselben API und Retrieval Contracts gelten in zwei Laufzeitprofilen: `public` und `local`.
3. Local Dev muss reproduzierbar startbar sein mit Next.js lokal und Neo4j Docker ohne Abhängigkeit von Vercel Runtime oder Neo4j Aura.
4. Next.js Implementierung bleibt verbindlich TypeScript in Web UI und API Layer mit `strict=true` als Default.
5. OpenAI Modellwahl bleibt environment-basiert mit Default `gpt-5-mini`; kein Modell-Hardcode im Code.
6. Secrets und Keys werden in `local` über `.env.local` oder `.env` geführt und in `public` über Vercel Environment Variables.
7. Architekturartefakte bleiben synchron zwischen ADR, Arc42, Deployment View, API Spec und Retrieval Contract.

## Key Decisions (Summary of ADRs)
1. ADR-0001 fixiert Public Deployment auf Vercel plus Neo4j Aura.
2. ADR-0002 fixiert Retrieval Contract mit `TopK=6`, `HopDepth=1`, `ContextBudget=1400`, stabiler Sortierung und eindeutiger Empty Mapping Regel.
3. ADR-0003 fixiert Tech Stack auf Next.js `16.1.6` mit TypeScript `strict=true`, Route Handler, Tailwind CSS, shadcn/ui, Atomic Design und minimaler Observability.
4. ADR-0004 fixiert serverless konsistentes Rate Limiting im Public Profil auf Vercel KV.
5. ADR-0005 fixiert Local Dev Topologie mit Next.js lokal, Neo4j Docker Pinning `neo4j:5.26.0` und profilabhängigem Rate Limit Store bei identischem Contractverhalten.

## Retrieval Strategy Snapshot
1. TopK: 6 Seeds aus Vektorindex auf `Concept`, `Tool` und `Problem`.
2. Hop Depth: 1 Hop Expansion über `WROTE`, `EXPLAINS`, `ADDRESSES`, `RELATES_TO`, `INFLUENCES`, `CONTRASTS_WITH`.
3. Context Budget Strategy: harte Grenze 1400 Tokens, Dedupe vor Budgetierung, Truncate vor Drop.
4. Evidence Limit bleibt bei maximal 8 Knoten mit stabiler Sortierung.
5. API State Mapping bleibt retrieval-gebunden: `empty` nur bei `selectedCount=0`.
6. Retrieval Contract gilt identisch in `public` und `local`.

## Non Functional Constraints
1. Performance: geringe Latenz durch begrenzte Hop Tiefe und kleine Evidenzmenge.
2. Security: Secrets und Keys nur in Runtime, kein Logging von Rohqueries, keine versionierten `.env` oder `.env.local` Dateien.
3. Cost: feste Kontextbudgetgrenzen und Basis Rate Limit `10` pro `60` Sekunden.
4. Operability: genau ein strukturiertes Abschluss Log Event je Request mit fixen Pflichtfeldern.
5. Contract Stability: `docs/spec/api.md` bleibt fachliche Quelle, OpenAPI bleibt daraus abgeleitet.
6. Local Reproducibility: feste Local Ports, Neo4j Image Pinning `neo4j:5.26.0`, TypeScript Strictness und profilklare Environment Variablen.

## Open Architecture Questions
1. Welche Referenzdatenbasis wird als lokaler Snapshot für deterministische QA Replays gepflegt.
2. Welches CI Gate OpenAPI Konsistenzprüfung gegen `docs/spec/api.md` verbindlich absichert.
3. Ob ein verpflichtendes `.env.example` als nicht geheimes Variablen Template im Repo geführt werden soll.
4. Ob ein fixer `OPENAI_MAX_OUTPUT_TOKENS` Wert für P0 zusätzlich als Runtime Variable dokumentiert werden muss.

## Next Instructions for Architect Agent
1. Bei Änderungen an Laufzeitprofilen zuerst ADR aktualisieren, danach Arc42, Deployment View, API und Retrieval Spec synchronisieren.
2. Bei Retrieval Parameteränderung zuerst ADR-0002 aktualisieren, danach Retrieval Contract und API Spezifikation synchronisieren.
3. Bei Rate Limit Änderungen Public und Local Profiltrennung explizit dokumentieren.
4. Vor Dev Übergabe stets prüfen, dass Public Ziel unverändert bleibt und Local Setup inklusive Neo4j Pinning deterministisch reproduzierbar beschrieben ist.
5. Vor Dev Übergabe stets prüfen, dass TypeScript Strictness, `OPENAI_MODEL` Default und `.env` oder `.env.local` Secret-Regel in allen Architekturartefakten konsistent sind.
