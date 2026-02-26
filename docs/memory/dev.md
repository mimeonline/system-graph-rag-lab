# Dev Memory

## Current Implementation Status
1. Story `E1-S6` steht nach Reopen-Run wieder auf `qa`.
2. `runLocalSeedResetAndReseed` erzwingt Local-Only-Guard auf `localhost`, `127.0.0.1`, `::1`.
3. Destruktiver Reset erfordert explizit `ALLOW_DESTRUCTIVE_SEED_RESET=true`.
4. Delete-Scope ist auf Seed-IDs begrenzt (`WHERE n.id IN $seedNodeIds`).
5. Reopen-Verifikation war gruen fuer Lint, Test, Build und story-spezifischen Testlauf.

## Active Epics and Stories
1. Epic `E1` bleibt `in_progress`.
2. Story `E1-S6` wartet im Status `qa` auf QA-Gate und Security-Recheck.

## Technical Constraints
1. Keine API- oder Retrieval-Contract-Aenderung ausserhalb Story-Scope.
2. Stack-Invarianten bleiben bindend: Next.js `16.1.6`, TypeScript `strict=true`, Tailwind CSS, shadcn/ui.
3. Seed-Reset bleibt lokaler Maintenance-Flow und env-gesteuert.
4. Story-Status durch Dev nur `in_progress`, `qa` oder `blocked`.

## Known Technical Debt
1. Integrationslauf fuer Seed-Reset ist ohne lokale Neo4j-Umgebung nicht voll reproduzierbar.
2. Es gibt keinen automatisierten Security-Recheck-Job fuer lokale destruktive Maintenance-Commands.

## Blocking Issues
1. Kein technischer Dev-Blocker offen.
2. Formale Epic-Freigabe bleibt bis QA-Pass und Security-Gate-Recheck offen.

## Next Instructions for Dev Agent
1. QA-Feedback zu `E1-S6` priorisiert umsetzen und Status-Sync strikt einhalten.
2. Bei neuen Security-Befunden nur minimal-invasiv in `local-seed-reset.ts` und zugehoerigen Tests nachziehen.
3. Kein `accepted` durch Dev setzen, auf QA-Pass und PM-Review warten.
