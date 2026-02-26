# DevOps to Security Handoff Epic E1

## Deploy Status
1. Epic E1 ist lokal reproduzierbar betreibbar.
2. Public Zielbild bleibt Vercel plus Neo4j Aura und ist fuer E4 fokussiert.
3. CI-Basisworkflow fuer Lint, Test und Build ist erstellt.

## Aktive Guardrails
1. Environment-only Secret Handling bleibt verbindlich.
2. Basis Rate-Limit Contract ist dokumentiert.
3. Log-Redaction ohne Rohqueries und ohne Secrets ist dokumentiert.
4. Lokaler destruktiver Seed-Reset bleibt durch local-only und Opt-In Guard begrenzt.

## Offene Risiken
1. Public Runtime Guardrails sind noch nicht endgueltig auf Vercel verifiziert.
2. Dependency-Audit laeuft aktuell nur advisory im CI.
3. Drift zwischen local und public Konfiguration bleibt bis E4 operatives Risiko.

## Erwartete Secrets und ENV Keys
1. `OPENAI_API_KEY`
2. `OPENAI_MODEL`
3. `NEO4J_URI`
4. `NEO4J_DATABASE`
5. `NEO4J_USERNAME`
6. `NEO4J_PASSWORD`
7. `RATE_LIMIT_MAX_REQUESTS`
8. `RATE_LIMIT_WINDOW_SECONDS`
9. `RATE_LIMIT_IP_SALT`
10. `KV_REST_API_URL`
11. `KV_REST_API_TOKEN`

## Was Security gezielt pruefen soll
1. Keine Secrets in Repository, Logs und Handoffs.
2. `429` Contract-Konsistenz fuer Header und Body.
3. Keine Rohquery-Inhalte in Runtime-Logs.
4. Destruktive Seed-Commands bleiben ausserhalb nicht-lokaler Betriebsjobs.

## Epic Gate Kontext
1. Geprueftes Epic: `backlog/epics/e1-wissensmodell-seed-daten.md`.
2. Gate-Stories im Scope: `E1-S1`, `E1-S2`, `E1-S3`, `E1-S4`, `E1-S5`, `E1-S6`.
3. Offene Risiken mit Blocker-Status: keine aktuellen E1-Blocker, Risiken fuer E4 sind nicht blockierend fuer E1.
