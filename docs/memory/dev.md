# Dev Memory

## Current Implementation Status
1. Story `E1-S6` ist implementiert und auf Status `qa` gesetzt.
2. Lokaler Neo4j Workflow fuer `reset -> reseed -> read-check` ist in `apps/web/src/features/seed-data/local-seed-reset.ts` umgesetzt.
3. Script-Aufruf `pnpm --dir apps/web seed:local:reset-reseed` ist verfuegbar.

## Active Epics and Stories
1. Epic `E1` bleibt `in_progress`.
2. Story `E1-S6` wartet im Status `qa` auf QA-Gate.
3. PM-Freigabe auf `accepted` bleibt nach QA-Status `pass` vorbehalten.

## Technical Constraints
1. API- und Retrieval-Contracts unter `docs/spec/**` bleiben unveraendert.
2. Stack-Invarianten bleiben bindend: Next.js `16.1.6`, TypeScript `strict=true`, Tailwind CSS und shadcn/ui.
3. Lokaler Seed-Workflow darf nur ueber Runtime-Variablen arbeiten, ohne Secrets im Repository.
4. Story-Status durch Dev nur `in_progress`, `qa` oder `blocked`.

## Known Technical Debt
1. Der lokale Seed-Scriptlauf benoetigt vollstaendige Neo4j Runtime-Variablen und hat keine komfortable Default-Konfiguration fuer `NEO4J_DATABASE` im Code.
2. Seed-Dataset bleibt statisch im Code gepflegt und nicht aus separatem Extraktionsartefakt generiert.
3. Qualitaetsreporting bleibt nicht persistent.

## Blocking Issues
1. Kein aktueller Blocker fuer QA.

## Next Instructions for Dev Agent
1. QA-Feedback zu `E1-S6` priorisiert bearbeiten und Status-Sync beibehalten.
2. Bei QA-Fail gezielt in `local-seed-reset.ts` oder Testabdeckung nachziehen, ohne Contract-Aenderung.
3. Danach naechste Story gemaess Backlog mit erstem Schritt `in_progress` plus sofortigem Sync in `backlog/progress.md` starten.
