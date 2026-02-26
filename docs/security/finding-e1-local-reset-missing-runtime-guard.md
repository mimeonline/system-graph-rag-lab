# Finding E1 Local Reset Missing Runtime Guard

## Titel
Lokaler Seed-Reset kann ohne Zielumgebungs-Guard gegen nicht-lokale Neo4j Instanzen ausgefuehrt werden.

## Severity
High

## Kategorie
OWASP A05 Security Misconfiguration

## Betroffene Komponente oder Datei oder Endpoint
1. `apps/web/src/features/seed-data/local-seed-reset.ts:188`
2. `apps/web/src/features/seed-data/local-seed-reset.ts:212`
3. `apps/web/scripts/local-seed-reset-reseed.ts:4`
4. `apps/web/src/features/seed-data/README.md:51`

## Impact
1. Ein falsch gesetztes `NEO4J_URI` plus gueltige Credentials kann einen destruktiven Reset auf nicht-lokalen Datenbanken ausloesen.
2. Im MVP-Kontext fuehrt das zu Datenverlust auf produktionsnahen Graphen, weil der Ablauf keinen expliziten Local-Only-Schutz erzwingt.

## Reproduktion
1. Setze eine nicht-lokale URI, zum Beispiel `NEO4J_URI=neo4j+s://<remote-host>` sowie gueltige `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`.
2. Fuehre `pnpm --dir apps/web seed:local:reset-reseed` aus.
3. Verifiziere in Neo4j, dass der Queryblock mit `DETACH DELETE n` auf erlaubte Labels ausgefuehrt wurde.

## Empfehlung
1. Fuehre vor jeder DB-Operation einen harten Runtime-Guard ein, der nur lokale Ziele erlaubt, zum Beispiel Host Allowlist `localhost`, `127.0.0.1`, `::1`.
2. Fuehre ein explizites Opt-In ein, zum Beispiel `ALLOW_DESTRUCTIVE_SEED_RESET=true`.
3. Breche den Lauf mit Fehler ab, wenn Guard oder Opt-In nicht erfuellt sind.
4. Entferne den direkten Standardaufruf aus allgemeinen Skripten oder kapsle ihn hinter einen dedizierten lokalen Maintenance-Command.

## Test-Empfehlung
1. Unit-Test: Nicht-lokale URI wird abgelehnt, vor `driver.verifyConnectivity`.
2. Unit-Test: Fehlendes Opt-In wird abgelehnt.
3. Unit-Test: Bei Guard-Fehler wird kein `transaction.run` mit Delete-Query ausgefuehrt.

## Status
Open

## Owner
dev

## Nachverfolgung
1. Epic `backlog/epics/e1-wissensmodell-seed-daten.md`
2. Story `backlog/stories/e1-s6-neo4j-lokal-seed-reset.md`
