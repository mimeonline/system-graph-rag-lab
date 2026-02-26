# Dev Handoff E1-S6

## Was ist fertig
1. Runtime-Guard fuer destruktiven Seed-Reset ist hart lokal: nur `localhost`, `127.0.0.1`, `::1`.
2. Explizites Opt-In ist verpflichtend: `ALLOW_DESTRUCTIVE_SEED_RESET=true`.
3. Guard greift vor jeder destruktiven DB-Operation; bei Guard-Fail wird kein Driver erstellt und kein Delete-Query ausgefuehrt.
4. Delete-Scope ist auf Seed-Bestand begrenzt: `WHERE n.id IN $seedNodeIds`.
5. Security-Tests fuer non-local reject, missing opt-in reject und no delete on guard-fail sind vorhanden und gruen.

## Welche Stories wurden umgesetzt
1. `E1-S6 Neo4j lokal Seed Reset und Reseed` ist von Dev bearbeitet und auf `qa` gesetzt.

## Wie kann QA testen lokal inkl konkrete Startschritte
1. Lokalen Neo4j Docker starten, erreichbar unter `bolt://localhost:7687`.
2. In `apps/web/.env.local` setzen: `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`, `ALLOW_DESTRUCTIVE_SEED_RESET=true`.
3. Story-spezifischen Testlauf ausfuehren.
4. Vollstaendige Verifikation mit Lint, Test, Build ausfuehren.
5. Optional CLI-Resetlauf ausfuehren.

## Welche Testdaten oder Seeds noetig sind
1. Unit-Tests nutzen injizierte Testdaten und benoetigen keine externe Seed-Datei.
2. Optionaler CLI-Lauf nutzt Seed-Dataset aus `createSeedDataset()`.

## Bekannte Einschraenkungen
1. Der Integrations-Test in `local-seed-reset.test.ts` bleibt ohne vollstaendige Neo4j-Env als `skipped` markiert.
2. Seed-Reset bleibt absichtlich destruktiv fuer Seed-IDs und ist deshalb per Opt-In abgesichert.

## Erwartete Failure Modes
1. Nicht-lokale `NEO4J_URI` fuehrt zu sofortigem Abbruch.
2. Fehlendes oder anderes Opt-In als `ALLOW_DESTRUCTIVE_SEED_RESET=true` fuehrt zu sofortigem Abbruch.
3. Fehlende Credentials fuehren zu fail-fast vor Driver-Nutzung.
4. Neo4j Connectivitaets- oder Auth-Fehler brechen den Lauf mit Fehler ab.

## Genaue Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web lint` erwartet Exit Code `0`.
2. `pnpm --dir apps/web test` erwartet Exit Code `0`.
3. `pnpm --dir apps/web build` erwartet Exit Code `0`.
4. `pnpm --dir apps/web test -- src/features/seed-data/local-seed-reset.test.ts` erwartet Exit Code `0` mit Guard-Tests gruen und env-abhaengigem Integrations-Skip.
5. `pnpm --dir apps/web seed:local:reset-reseed` erwartet Exit Code `0` nur bei local URI plus Opt-In.
