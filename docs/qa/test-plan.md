# QA Test Plan MVP Bootstrap

## Ziel und Scope
1. Dieses Dokument definiert die initiale QA-Strategie fuer den MVP-Start.
2. Scope umfasst die Stories E1 bis E5, API Contract, Retrieval Contract und Betriebs-Guardrails.
3. Scope umfasst keine Feature-Implementierung und keine Architekturentscheidung.

## Teststrategie
### Unit Tests
1. Ziel ist schnelle Pruefung von Modulen mit deterministischem Verhalten.
2. Fokus liegt auf Ontologie-Regeln, Schema-Validierung, Sortierung, Dedupe und Fehlercode-Mapping.
3. Minimaler Pflichtlauf pro Story ist `pnpm test` im jeweiligen Projektpfad.

### Integration Tests
1. Ziel ist Contract-Treue zwischen Route Handler, Retrieval und Runtime-Konfiguration.
2. Fokus liegt auf `POST /api/query` Request-Regeln, Success-State-Mapping, Error-Codes und Header-Konsistenz.
3. Pflichtfaelle enthalten `400`, `429`, `500`, sowie `state=answer` und `state=empty`.

### E2E Tests Minimal
1. Ziel ist reproduzierbare End-to-End-Pruefung ueber UI bis API.
2. Fokus liegt auf Kernfluss, sichtbarer Hauptantwort, Referenzkonzepten, Kernnachweis und Statuszustaenden.
3. Pflichtlauf enthaelt mindestens zwei Smoke-Fragen lokal und auf Public URL nach Deployment.

## Testumgebung
### Local
1. Next.js lokal auf `http://localhost:3000`.
2. Neo4j lokal auf `bolt://localhost:7687` mit Docker Image `neo4j:5.26.0`.
3. Local Rate-Limit Store aktiv mit denselben Grenzwerten wie public.

### Public Vercel
1. Runtime auf Vercel mit produktionsnaher Konfiguration.
2. API-Aufrufe gegen Live-URL fuer Smoke und Fehlerpfade.
3. Fokus auf Erreichbarkeit, Contract-Treue, Guardrails und Laufzeitverhalten.

### Neo4j Aura
1. Public Graph Backend fuer produktive Retrieval-Pfade.
2. Stichproben fuer Erreichbarkeit und konsistente Retrieval-Metadaten.
3. Vertragsrelevante Kennzahlen sind `topK=6`, `hopDepth=1`, `contextTokens<=1400`.

## Testdaten und Seed Voraussetzungen
1. Ontologie muss die Typen `Concept`, `Author`, `Book`, `Problem` vollstaendig abbilden.
2. Erlaubte Relationen muessen auf sechs Typen begrenzt sein.
3. Seed-Datenziel ist mehr als 100 valide Nodes und mehr als 200 valide Edges.
4. Eval-Sets nutzen fuenf feste Fragen mit erwarteten Referenzkonzepten je Frage.
5. Fuer Reproduzierbarkeit muessen Datenstand, Runtime-Profil und Commit-Referenz dokumentiert werden.

## Durchfuehrung und Evidenz
1. Jede Story-Pruefung erzeugt Testeintraege in `docs/qa/test-matrix.md`.
2. Jedes Fehlverhalten erzeugt einen reproduzierbaren Report in `docs/qa/bugs/bug-xxxx.md`.
3. Story-Gate wird in `docs/qa/verdict.md` dokumentiert.
4. Epic-Gate wird in `docs/qa/verdict-epic.md` dokumentiert.
5. Abnahmelauf wird in `evals/report.md` dokumentiert.

## Abnahmekriterien
1. Story-Gate Pass erfordert, dass alle Akzeptanzkriterien der Story reproduzierbar als Pass dokumentiert sind.
2. Story-Gate Fail gilt, wenn mindestens ein Akzeptanzkriterium fehlt, nicht reproduzierbar ist oder failt.
3. Epic-Gate Pass erfordert Story-Gates, Security-Gate und DevOps-Gate ohne offene Blocker.
4. Eval-Gesamtpass erfordert mindestens 4 von 5 Fragen mit Pass gemaess Rubrik.
5. Bei Eval-Faellen mit verfuegbaren Referenzen gilt als Mindestziel: mindestens 2 relevante Konzepte unter den ersten 3 Referenzen oder klarer Fallback-Hinweis.
