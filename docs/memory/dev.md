# Dev Memory

## Current Implementation Status
1. Story `E1-S6` ist nach Bug-0003-Fix wieder auf `qa` gesetzt.
2. Story `E2-S1` liefert deterministische Kontextcandidates via Keyword-Index und Tokenbudget-Budgetierung; `state="answer"` sobald Referenzen existieren.
3. Story- und Dev-Handoff-Referenzen fuer den story-spezifischen Testlauf sind auf `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts` normalisiert.
4. Seed-Reset-Guards bleiben unveraendert: local-only URI, explizites `ALLOW_DESTRUCTIVE_SEED_RESET=true`, Delete-Scope auf Seed-IDs.
5. Verifikation im Fix-Run erfolgreich: scope-command, `lint`, `test`, `build` jeweils Exit Code `0`.
6. Story `E2-S2` ergänzt Retrieval um deduplizierte `context.elements` mit Quellverweisen; API liefert neues `context`-Objekt.
7. Verifikation: `pnpm --dir apps/web exec vitest run src/features/query/retrieval.test.ts` und `... src/app/api/query/route.test.ts` passierten mit Exit Code 0.
8. Story `E2-S3` formt aus dem Retrieval-Kontext eine strukturierte Antwort mit maximal drei Referenzen oder klarem Fallback; Tests in `src/features/query/answer.test.ts` plus Route-Test spiegeln die neue Pipeline.
9. Story `E2-S4` ist QA-ready; die Erwartungsliste aus `evals/rubric` (Q1–Q5) sichert die ersten drei Referenzen ab und ergänzt bei Bedarf den `Hinweis`-Fallback in `answer.coreRationale`. Tests `src/features/query/answer.test.ts` prüfen die positiven und negativen Matching-Szenarien.
10. Story `E3-S1` bringt die interaktive Query-Eingabe ins Frontend, ruft die bestehende `/api/query`-Route auf und rendert Hauptantwort, Referenzkonzepte sowie den P0-Kernnachweis via `buildQueryViewModel`.
11. Story `E3-S1` ist QA-ready; Tests `src/features/query/view-model.test.ts` grün und manuelle Prüfung der drei Anzeigeabschnitte (Hauptantwort, Referenzen, Kernnachweis) bestätigt die AC-Erfüllung für mindestens zwei Fragen.
12. Story `E3-S2` ergänzt `QueryPanel` um deterministische Status-/Action-Hinweise (Loading, Error, Empty) und `QueryInput` um den sichtbaren `Nächste Aktion`-Text; `src/components/organisms/query-panel-status.test.ts` deckt die Mappinglogik ab.

9. Story `E3-S3` ergänzt die Antwortansicht um nummerierte Herleitungsdetails aus Kontextsummaries und verweist die Quelle, damit die Erklärung nachvollziehbar bleibt; `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts` bestätigt mit Exit Code `0`, dass `derivationDetails` korrekt aufgebaut und auf die drei Referenzen begrenzt sind.

## Active Epics and Stories
1. Epic `E1` bleibt im Status `blocked` laut Progress.
2. Story `E1-S6` steht im Status `qa` und wartet auf QA-Recheck.
3. Epic `E2` ist aktiv; Story `E2-S1` steht nun auf `qa` mit deterministic retrieval proof.
4. Story `E2-S2` steht auf `qa` und erweitert Kontextpakete mit zitierfähigen Quellen.
5. Story `E2-S3` steht auf `qa` und liefert strukturierte Antworten mit maximal drei Referenzen bzw. Fallback.
6. Story `E2-S4` steht auf `qa` und bestätigt mit den Tests in `src/features/query/answer.test.ts` sowohl positive als auch negative Expectation-Matches.
7. Epic `E3` ist auf `in_progress` gesprungen; Story `E3-S1` ist accepted, Story `E3-S2` ist QA-ready (Statusführung + `Nächste Aktion`), Story `E3-S3` ist QA-ready und wartet auf QA-Bestätigung der neuen Herleitungsdetails.

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
6. Story `E2-S3` ist QA-ready; Tests `src/features/query/answer.test.ts` und `src/app/api/query/route.test.ts` legen die Antwortpipeline und Referenzlimits offen.
7. Story `E3-S1` ist in Arbeit; verifiziere `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts` und dokumentiere den manuellen Durchlauf für Hauptantwort, Referenzen und Kernnachweis (mindestens zwei Fragen).
8. Story `E3-S2` ist QA-ready; für den QA-Run `pnpm --dir apps/web exec vitest run src/components/organisms/query-panel-status.test.ts` ausführen und die Loading-/Error-/Empty-Hilfetexte sowie die `Nächste Aktion`-Hinweise gemäß QA-Handoff prüfen.
9. Story `E3-S3` erweitert das QueryPanel um die neuen Herleitungsdetails; QA soll (erneut) `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts` ausführen und im Dev-Server überprüfen, dass Hauptantwort, Referenzen und der P0-Kernnachweis stets sichtbar bleiben, während die nummerierten Details darunter erscheinen.

## Recent Bugfixes
- Laufzeit-ReferenceError `nextAction is not defined` in `QueryInput` behoben, indem die Prop explizit destructed wird und der `Nächste Aktion`-Hinweis nur mit vorhandenem Text rendert.
- Test: `pnpm --dir apps/web exec vitest run src/components/organisms/query-panel-status.test.ts`
