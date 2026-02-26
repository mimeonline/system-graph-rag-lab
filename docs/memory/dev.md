# Dev Memory

## Current Implementation Status
1. Story `E1-S6` ist nach Bug-0003-Fix wieder auf `qa` gesetzt.
2. Story- und Dev-Handoff-Referenzen fuer den story-spezifischen Testlauf sind auf `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts` normalisiert.
3. Seed-Reset-Guards bleiben unveraendert: local-only URI, explizites `ALLOW_DESTRUCTIVE_SEED_RESET=true`, Delete-Scope auf Seed-IDs.
4. Verifikation im Fix-Run erfolgreich: scope-command, `lint`, `test`, `build` jeweils Exit Code `0`.

## Active Epics and Stories
1. Epic `E1` bleibt im Status `blocked` laut Progress.
2. Story `E1-S6` steht im Status `qa` und wartet auf QA-Recheck.

## Technical Constraints
1. Keine API- oder Retrieval-Contract-Aenderungen ausserhalb Story-Scope.
2. Stack-Invarianten bleiben bindend: Next.js `16.1.6`, TypeScript `strict=true`, Tailwind CSS, shadcn/ui.
3. Dev setzt Story-Status nur auf `in_progress`, `qa` oder `blocked`.
4. Doku-Aenderungen in diesem Run bleiben auf erlaubte Dev-Schreibpfade begrenzt.

## Known Technical Debt
1. Integrationslauf fuer Seed-Reset bleibt ohne lokale Neo4j-Umgebung nicht voll reproduzierbar.
2. Automatisierter Security-Recheck fuer destruktive lokale Maintenance-Commands fehlt weiterhin.

## Blocking Issues
1. Kein technischer Dev-Blocker im aktuellen Bugfix-Run.
2. QA-Recheck fuer `E1-S6` ist weiterhin erforderlich.

## Next Instructions for Dev Agent
1. Auf QA-Feedback zu `E1-S6` reagieren und Story plus Progress synchron halten.
2. Bei weiteren E1-S6-Doku-Abweichungen nur scope-strikt und ohne Contract- oder Architektur-Aenderung korrigieren.
3. Story niemals auf `accepted` setzen; nur QA und PM folgen dem Gate-Prozess.
