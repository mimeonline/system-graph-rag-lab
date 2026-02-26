# Dev Handoff

## E1-S6 Neo4j lokal Seed Reset und Reseed
### Was ist fertig
1. Runtime-Guard fuer destruktiven Seed-Reset ist hart lokal: nur `localhost`, `127.0.0.1`, `::1`.
2. Explizites Opt-In ist verpflichtend: `ALLOW_DESTRUCTIVE_SEED_RESET=true`.
3. Guard greift vor jeder destruktiven DB-Operation; bei Guard-Fail wird kein Driver erstellt und kein Delete-Query ausgefuehrt.
4. Delete-Scope ist auf Seed-Bestand begrenzt: `WHERE n.id IN $seedNodeIds`.
5. Security-Tests fuer non-local reject, missing opt-in reject und no delete on guard-fail sind vorhanden und gruen.
6. Bug-0003 ist gefixt: story-spezifisches Testkommando ist im E1-S6-Kontext auf `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts` normalisiert.

### Wie kann QA testen lokal inkl konkrete Startschritte
1. Lokalen Neo4j Docker starten, erreichbar unter `bolt://localhost:7687`.
2. In `apps/web/.env.local` setzen: `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`, `ALLOW_DESTRUCTIVE_SEED_RESET=true`.
3. Story-spezifischen Testlauf ausfuehren: `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts`.
4. Vollstaendige Verifikation mit Lint, Test, Build ausfuehren.
5. Optional CLI-Lauf ausfuehren: `pnpm --dir apps/web seed:local:reset-reseed`.

### Bekannte Einschraenkungen & Testdaten
1. Der Integrations-Test in `local-seed-reset.test.ts` bleibt ohne vollstaendige Neo4j-Env als `skipped` markiert.
2. Seed-Reset bleibt absichtlich destruktiv fuer Seed-IDs und ist deshalb per Opt-In abgesichert.
3. Unit-Tests nutzen injizierte Testdaten; CLI-Lauf nutzt `createSeedDataset()`.

### Erwartete Failure Modes
1. Nicht-lokale `NEO4J_URI` fuehrt zu sofortigem Abbruch.
2. Fehlendes oder anderes Opt-In als `ALLOW_DESTRUCTIVE_SEED_RESET=true` fuehrt zu sofortigem Abbruch.
3. Fehlende Credentials fuehren zu fail-fast vor Driver-Nutzung.
4. Neo4j Connectivitaets- oder Auth-Fehler brechen den Lauf mit Fehler ab.

### Genaue Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web lint` Exit Code `0`.
2. `pnpm --dir apps/web test` Exit Code `0`.
3. `pnpm --dir apps/web build` Exit Code `0`.
4. `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts` Exit Code `0`.
5. `pnpm --dir apps/web seed:local:reset-reseed` Exit Code `0` nur mit lokalem URI plus Opt-In.

## E2-S1 Kontextkandidaten pro Frage bereitstellen
### Was ist fertig
1. Keyword-basierter Vektor-Proxy indexiert alle Seed-Nodes deterministisch über Titel + Summary.
2. Top-6-Kandidaten werden stabil nach Score, Hop, Node-Type und Node-ID sortiert.
3. Kontextbudget bleibt innerhalb der vertraglichen 1.400 Tokens; doppelte Node-IDs werden durch das Indexmodell ausgeschlossen.
4. API antwortet mit `state="answer"`, `references`, `meta.retrievedNodeCount` und `meta.contextTokens`, sobald mindestens ein Kandidat zurückkommt.

### Wie kann QA testen
1. `pnpm --dir apps/web test -- src/features/query/retrieval.test.ts`
2. `pnpm --dir apps/web test -- src/app/api/query/route.test.ts`
3. Laufende Lint, Test und Build (siehe Liste oben) sichern den Contract.
