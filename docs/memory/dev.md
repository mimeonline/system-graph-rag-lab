# Dev Memory

## Update i18n Setup 2026-03-06
1. `apps/web` nutzt jetzt `next-intl` mit `de` und `en`, Middleware, `[locale]`-Routing und Root-Redirect von `/` auf sprachspezifische URLs.
2. SEO-Basis ist locale-aware: neue Helper in `src/lib/seo.ts` und `src/lib/page-metadata.ts`, sprachspezifische Canonicals/`hreflang`, locale-aware Sitemap und EN-Fallback-Seiten mit `sourceLocale`-Modell im Essay-Loader.
3. Essay-Content liegt jetzt unter `apps/web/content/de/blog/**`; `apps/web/content/en/blog/**` ist für echte EN-Origin-Dateien vorgesehen. EN-Essayrouten dürfen via Loader auf DE fallen, werden dann aber nicht als echte EN-Quelle behandelt.
4. Shared UI-Chrome ist teilweise an i18n angebunden: Header, Footer, TrackedLink, Query-Input, Status/Antwort-/Rationale-Karten und Fehlerseiten nutzen `messages/de.json` und `messages/en.json`.
5. Root-Routen ohne Locale wurden auf Redirects zu `/de/...` umgestellt, damit Build und Laufzeit nicht mehr außerhalb des `NextIntlClientProvider` rendern.
6. Verifikation für den Run erfolgreich: `pnpm --dir apps/web run typecheck`, `pnpm --dir apps/web run lint`, `pnpm --dir apps/web run build`.

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
12. Story `E3-S2` ergänzt `QueryPanel` um deterministische Status-/Action-Hinweise (Loading, Error, Empty) und `QueryInput` um den sichtbaren `Nächste Aktion`-Text; `pnpm --dir apps/web exec vitest run src/components/organisms/query-panel-status.test.ts` deckt die Mappinglogik ab.
13. Story `E3-S3` ergänzt die Antwortansicht um nummerierte Herleitungsdetails aus Kontextsummaries und verweist die Quelle, damit die Erklärung nachvollziehbar bleibt; `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts` bestätigt mit Exit Code `0`, dass `derivationDetails` korrekt aufgebaut und auf die drei Referenzen begrenzt sind.
14. Story `E4-S1` integriert die OpenAI Chat Completions API serverseitig in die Query-Pipeline; `pnpm --dir apps/web test -- src/app/api/query/route.test.ts` verifiziert erfolgreiche Antworten sowie das `LLM_UPSTREAM_ERROR`-Mapping bei non-2xx-Responses.
15. Story `e4-semantic-graph-retrieval` implementiert echte semantische Referenzen via OpenAI Embeddings + Neo4j Vector Index (inkl. 1-Hop-Erweiterung, Lexical-Fallback und `GRAPH_BACKEND_UNAVAILABLE` bei Ausfällen); Tests: `pnpm --dir apps/web test -- src/app/api/query/route.test.ts src/features/query/retrieval.test.ts`.
16. `E4-S1` bewahrt nun die parsed Upstream-Nachricht (`error.message` enthält die Details) und klassifiziert 4xx (non-retryable) vs. 5xx/429 (retryable); bei fehlendem `NEO4J_VECTOR_INDEX_NAME` wird der Default `node_embedding_index` genutzt, Tests `pnpm --dir apps/web test -- src/app/api/query/route.test.ts` wurden erneut durchlaufen (Exit Code `0`).
17. Story `bugfix-openai-400-and-vector-index-default` stabilisiert den OpenAI-Call mit GPT-5-kompatiblen Parametern, best-effort Upstream-Details, retry-mapping je Statusklasse sowie der Default-Index-Konfiguration `node_embedding_index`; verifiziert via `pnpm --dir apps/web test -- src/app/api/query/route.test.ts`.

## Active Epics and Stories
1. Epic `E1` bleibt im Status `blocked` laut Progress.
2. Story `E1-S6` steht im Status `qa` und wartet auf QA-Recheck.
3. Epic `E2` ist aktiv; Story `E2-S1` steht nun auf `qa` mit deterministic retrieval proof.
4. Story `E2-S2` steht auf `qa` und erweitert Kontextpakete mit zitierfähigen Quellen.
5. Story `E2-S3` steht auf `qa` und liefert strukturierte Antworten mit maximal drei Referenzen bzw. Fallback.
6. Story `E2-S4` steht auf `qa` und bestätigt mit den Tests in `src/features/query/answer.test.ts` sowohl positive als auch negative Expectation-Matches.
7. Epic `E3` ist auf `in_progress` gesprungen; Story `E3-S1` ist accepted, Story `E3-S2` ist QA-ready (Statusführung + `Nächste Aktion`), Story `E3-S3` ist QA-ready und wartet auf QA-Bestätigung der neuen Herleitungsdetails.
8. Epic `E4` ist aktiv; Story `e4-openai-real-integration` implementiert die Live-OpenAI-Integration in `POST /api/query` und steht im Scope der aktuellen Story, Story `e4-semantic-graph-retrieval` ist in Progress mit dem Neo4j Vector Retrieval plus Fallback und Error-Mapping.
9. Story `bugfix-openai-400-and-vector-index-default` läuft im aktuellen Bugfix-Run; sie dokumentiert die neuen QA- und Security-Handoffs zur Neo4j-Index-Errichtung und sorgt für die Default-Index-Nutzung plus resilientere OpenAI-Fehlerbehandlung.

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
10. Story `e4-openai-real-integration` ergänzt die Route um einen echten OpenAI-Call; Dev soll `pnpm --dir apps/web test -- src/app/api/query/route.test.ts` ausführen und die Mock-Erfolge wie die `LLM_UPSTREAM_ERROR`-Zustände prüfen.
11. Story `e4-semantic-graph-retrieval` bringt OpenAI-Embeddings, Neo4j Vector Index, 1-Hop-Kontext und `GRAPH_BACKEND_UNAVAILABLE`; Dev soll `pnpm --dir apps/web test -- src/app/api/query/route.test.ts src/features/query/retrieval.test.ts` laufen lassen und den Graph-Fallback sowie das Fehler-Mapping validieren.

## Recent Bugfixes
- Laufzeit-ReferenceError `nextAction is not defined` in `QueryInput` behoben, indem die Prop explizit destructed wird und der `Nächste Aktion`-Hinweis nur mit vorhandenem Text rendert.
- Test: `pnpm --dir apps/web exec vitest run src/components/organisms/query-panel-status.test.ts`

## Update E3 ux-demo-clarity-and-tool-granularity
1. Home/Query-Ansicht auf UX-Mock-Grundstruktur umgestellt: sichtbarer Header/Footer, klare Inhaltsbühne, 2-Panel-Layout auf Desktop und 1-Spalten-Layout auf Mobile.
2. QueryPanel zeigt neue Zone „Was bringt mir das jetzt?“ mit konkreten Next Steps aus dem Query-View-Model.
3. Referenzkarten wurden granularisiert: Keyword-Mapping für „System Thinking Tools“, „Network Analysis“, „Stocks and Flows“ auf konkrete Toolnamen.
4. Verifikation: `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts src/components/organisms/query-panel-status.test.ts` (Exit Code `0`).

## Update E3 Frontend Nutzerfuehrung Graph-Verstaendnis
1. HomeTemplate ergaenzt eine sichtbare Sektion "So funktioniert GraphRAG" mit drei klaren Schritten (Frage, Graph-Kontext, Handlungswert).
2. QueryPanel zeigt eine neue responsive Graph-Ansicht ohne externe Libraries; Darstellung basiert auf einem leichten SVG-/CSS-Layer.
3. Graph-Knoten und Kanten werden aus vorhandenen Query-Daten (`references`, `derivationDetails`) abgeleitet; ohne Daten wird ein expliziter Fallback-Graph angezeigt.
4. Neue Ableitungslogik liegt in `src/features/home/graph-view-model.ts`; Tests in `src/features/home/graph-view-model.test.ts` sichern Fallback und Query-basiertes Modell.

## Update E3 Graph Label Overlap Schnellfix
1. apps/web/src/components/molecules/graph-preview.tsx verwendet fuer den Node-Layer jetzt h-[320px] statt h-full.
2. Node-Breite ist reduziert auf w-[128px] vorher w-[150px] zur Entschaerfung von Label-Ueberlappung im Fallback.
3. Keine neuen Libraries, keine Contract-Aenderung, reiner UI-Layoutfix.

## Update E3 Finaler UX-Fix Graph obere Ueberdeckung
1. Query-Knoten wurde im Home-Graph von y=14 auf y=20 abgesenkt; Referenzknoten wurden vertikal nach unten verschoben (y=54/56/66 je Layout), um den oberen Bereich klarer zu trennen.
2. GraphPreview trennt jetzt Linien- und Label-Rendering in zwei SVG-Layern: Linien unter den Nodes, Labels darueber mit dynamischem Offset und Stroke-Hinterlegung fuer Lesbarkeit.
3. `src/features/home/graph-view-model.test.ts` prueft die neuen Vertikalpositionen fuer Fallback- und Query-Graph.
4. Geforderter Testlauf wurde gestartet, konnte aber lokal wegen Prozesslimit/Toolchain-Fehler (`fork: Resource temporarily unavailable`, nachfolgendes `vitest`-Module-Resolution-Problem) nicht erfolgreich abgeschlossen werden.
