# Story E1-S6 Neo4j lokal Seed Reset und Reseed

## Status
pass

## Ziel
Ein reproduzierbarer lokaler Seed-Reset-und-Reseed-Ablauf fuer Neo4j Docker ist verfuegbar, damit die Datenbasis fuer Next.js Runtime-Reads sauber neu aufgebaut werden kann.

## Priorität
P0

## Abhängigkeiten
1. E1-S3
2. Security-Fixes aus `docs/security/finding-e1-local-reset-missing-runtime-guard.md` und `docs/security/finding-e1-local-reset-overbroad-delete-scope.md`

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Lokaler Seed Reset und Reseed ist reproduzierbar

**Given**
ein laufender lokaler Neo4j-Docker-Container, eine Seed-Quelle fuer die normalisierte Datenbasis und gesetzte Runtime-Variablen `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME` und `NEO4J_PASSWORD`

**When**
der lokale Ablauf Seed-Reset, Seed-Import und anschliessender Reseed ausgefuehrt wird

**Then**
1. wird die bestehende Seed-Datenbasis in Neo4j kontrolliert zurueckgesetzt.
2. wird die Seed-Datenbasis aus der freigegebenen Quelle erneut eingespielt.
3. sind nach dem Reseed echte Neo4j-Reads fuer mindestens zwei Nodes und zwei Relationen im lokalen Zielbetrieb wieder erfolgreich.

### Szenario 2: Security-Gate ist Pflicht vor Epic-Freigabe

**Given**
ein Security-Verdict fuer Epic E1 mit Status `Fail` und dokumentierten offenen Blocker-Findings zur Story E1-S6

**When**
PM die Story fuer Epic-Freigabe prueft

**Then**
1. bleibt die Story im Status `blocked`, bis die dokumentierten Security-Fixes umgesetzt und erneut geprueft sind.
2. darf Epic E1 nicht freigegeben werden, solange Security-Blocker fuer E1-S6 offen sind.

## Test Notes
1. `pnpm --dir apps/web seed:local:reset-reseed` erfolgreich nach lokalem Env-Load aus `.env.local` und Fallback `NEO4J_DATABASE=neo4j`; Ergebnis: `Importierte Nodes: 105`, `Importierte Relationen: 203`, `Read-Check Nodes: 105`, `Read-Check Relationen: 203`.
2. `pnpm --dir apps/web test -- src/features/seed-data/local-seed-reset.test.ts` erfolgreich mit echtem Neo4j-Integrationslauf; 25 Tests bestanden.
3. Fehlerfall verifiziert: fehlende `NEO4J_USERNAME` oder `NEO4J_PASSWORD` fuehren zu fail-fast Fehler vor Driver-Initialisierung und verhindern Teilimporte.
4. PM-Entscheidung vom 2026-02-26: Re-Open auf `blocked` wegen Security-Gate-Fail in `docs/security/verdict-epic.md` und offenem Blocker in `docs/security/blocker.md`.
5. Pflicht fuer Freigabe: erst nach dokumentiertem Security-Recheck ohne offene Blocker fuer E1-S6 darf eine erneute PM-Abnahme erfolgen.
6. `pnpm --dir apps/web test -- src/features/seed-data/local-seed-reset.test.ts` erfolgreich nach Security-Fix; Ergebnis: 6 Tests bestanden, 1 Integrations-Test wie vorgesehen ohne vollstaendige Neo4j-Env geskippt.
7. Security-Guard verifiziert: non-local `NEO4J_URI` wird abgelehnt, fehlendes `ALLOW_DESTRUCTIVE_SEED_RESET=true` wird abgelehnt und bei Guard-Fehler wird kein Delete-Query ausgefuehrt.
8. Delete-Scope verifiziert: Reset loescht nur Nodes mit Seed-IDs (`WHERE n.id IN $seedNodeIds`) statt Label-basiertem Global-Delete.
9. Gesamtverifikation erfolgreich am 2026-02-26: `pnpm --dir apps/web lint`, `pnpm --dir apps/web test`, `pnpm --dir apps/web build`.
10. Reopen-Verifikation am 2026-02-26 erneut erfolgreich: `pnpm --dir apps/web lint`, `pnpm --dir apps/web test`, `pnpm --dir apps/web build`, plus story-spezifischer Lauf `pnpm --dir apps/web test -- src/features/seed-data/local-seed-reset.test.ts`; Ergebnis: Guard- und Scope-Tests gruen, Integrations-Test weiterhin env-abhaengig geskippt.
11. QA-Review-Recheck am 2026-02-26 erfolgreich: `pnpm --dir apps/web seed:local:reset-reseed` mit `Importierte Nodes: 105`, `Importierte Relationen: 203`, `Read-Check Nodes: 105`, `Read-Check Relationen: 203`; `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts` mit `5 passed, 1 skipped`; `pnpm --dir apps/web lint`, `pnpm --dir apps/web test`, `pnpm --dir apps/web build` alle Exit Code `0`.
