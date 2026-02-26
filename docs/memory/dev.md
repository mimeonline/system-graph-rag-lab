# Dev Memory

## Current Implementation Status
1. Story `E1-S6` ist nach Bug-0003-Fix wieder auf `qa` gesetzt.
2. Story `E2-S1` liefert deterministische Kontextcandidates via Keyword-Index und Tokenbudget-Budgetierung; `state="answer"` sobald Referenzen existieren.
3. Story- und Dev-Handoff-Referenzen fuer den story-spezifischen Testlauf sind auf `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts` normalisiert.
4. Seed-Reset-Guards bleiben unveraendert: local-only URI, explizites `ALLOW_DESTRUCTIVE_SEED_RESET=true`, Delete-Scope auf Seed-IDs.
5. Verifikation im Fix-Run erfolgreich: scope-command, `lint`, `test`, `build` jeweils Exit Code `0`.
6. Story `E2-S2` ergänzt Retrieval um deduplizierte `context.elements` mit Quellverweisen; API liefert neues `context`-Objekt.
7. Verifikation: `pnpm --dir apps/web exec vitest run src/features/query/retrieval.test.ts` und `... src/app/api/query/route.test.ts` passierten mit Exit Code 0.

## Active Epics and Stories
1. Epic `E1` bleibt im Status `blocked` laut Progress.
2. Story `E1-S6` steht im Status `qa` und wartet auf QA-Recheck.
3. Epic `E2` ist aktiv; Story `E2-S1` steht nun auf `qa` mit deterministic retrieval proof.
4. Story `E2-S2` steht auf `qa` und erweitert Kontextpakete mit zitierfähigen Quellen.

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
2. Story `E2-S1` ist in QA; Dev muss QA-Tests aus `docs/handoff/dev-to-qa.md` mit Lint/Test/Build verifizieren.
3. Bei weiteren E1-S6-Doku-Abweichungen nur scope-strikt und ohne Contract- oder Architektur-Aenderung korrigieren.
4. Story niemals auf `accepted` setzen; nur QA und PM folgen dem Gate-Prozess.
5. Story `E2-S2` ist jetzt QA-ready; Dokumentation und `retrieval`/`route` Tests wurden ausgeführt.
