# QA Test Matrix MVP

## Mapping Stories zu Akzeptanzkriterien und Tests
| Story | AC-ID | Test-ID | Testfall | Umgebung | Pass | Fail | Evidenz |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E1-S1 | AC-1 | QA-E1-S1-01 | Ontologie enthaelt exakt die fuenf Node-Typen inklusive `Tool` und erlaubte Relationen | local | x |  | 2026-02-25: `pnpm test` gruen inkl. `src/features/ontology/ontology.test.ts`; `pnpm lint` gruen; `pnpm build` gruen; Doku-Abgleich `apps/web/src/features/ontology/README.md` |
| E1-S2 | AC-1 | QA-E1-S2-01 | Quellenkatalog dokumentiert relevante MD-Quellen und je Quelle `sourceType` mit `primary_md` oder `optional_internet` | local | x |  | 2026-02-25: `pnpm --dir apps/web test -- src/features/seed-data/seed-data.test.ts` Pass; `pnpm --dir apps/web lint` Pass; `pnpm --dir apps/web test` Pass; `pnpm --dir apps/web build` Pass; Artefaktabgleich `apps/web/src/features/seed-data/seed-data.ts` und `apps/web/src/features/seed-data/README.md` |
| E1-S2 | AC-1 | QA-E1-S2-02 | Optionale Internet-Quellen sind als `optional_internet` markiert und enthalten dokumentierte Lueckenbegruendung (`gapNote`) | local | x |  | 2026-02-25: Sichtpruefung `apps/web/src/features/seed-data/seed-data.ts` in `CURATED_SOURCES`, alle `optional_internet` mit `gapNote` |
| E1-S3 | AC-1 | QA-E1-S3-01 | Graph-Lese-Smoke gegen Zielbetrieb liefert Nodes und Relationen fehlerfrei | local | x |  | 2026-02-25: `pnpm --dir apps/web lint` Pass; `pnpm --dir apps/web test` Pass; `pnpm --dir apps/web build` Pass; `pnpm --dir apps/web exec vitest run src/features/seed-data/runtime-read.test.ts --testNamePattern "integration with neo4j\|reads real nodes"` erst Skip ohne `NEO4J_DATABASE`, danach Pass mit gesetzter Variable |
| E1-S4 | AC-1 | QA-E1-S4-01 | Qualitaetslauf entfernt Duplikate und behaelt nur ontologiekonforme Eintraege | local | x |  | 2026-02-25: `pnpm --dir apps/web exec vitest run src/features/seed-data/quality-check.test.ts` Pass (3/3); `pnpm --dir apps/web test` Pass (19 Pass, 1 Skip); `pnpm --dir apps/web lint` Pass; `pnpm --dir apps/web build` Pass; Code-Review `apps/web/src/features/seed-data/quality-check.ts` |
| E1-S5 | AC-1 | QA-E1-S5-01 | Extraktion und Normalisierung erzeugen eine reproduzierbare Seed-Datenbasis mit Herkunftskennzeichnung und Ausschlussprotokoll | local | x |  | 2026-02-25: `pnpm --dir apps/web lint` Pass; `pnpm --dir apps/web test` Pass (21 Pass, 1 Skip); `pnpm --dir apps/web build` Pass; AK-Evidenz in `src/features/seed-data/seed-data.test.ts` und `src/features/seed-data/quality-check.test.ts` |
| E1-S6 | AC-1 | QA-E1-S6-01 | Lokaler Neo4j Seed-Reset und Reseed ist reproduzierbar und Runtime-Reads sind danach wieder erfolgreich | local | x |  | 2026-02-26 Recheck: `pnpm --dir apps/web seed:local:reset-reseed` Pass mit `Importierte Nodes: 105`, `Importierte Relationen: 203`, `Read-Check Nodes: 105`, `Read-Check Relationen: 203`; `pnpm --dir apps/web lint` Pass; `pnpm --dir apps/web test` Pass (26 Pass, 2 Skip); `pnpm --dir apps/web build` Pass |
| E1-S6 | AC-2 | QA-E1-S6-02 | Security-Recheck fuer local-only Guard, Opt-In, fail-fast und Delete-Scope ist reproduzierbar bestanden | local | x |  | 2026-02-26 Recheck: `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts` Pass (5 Pass, 1 Skip); Scope-Praezision bestaetigt durch Gegenprobe: `pnpm --dir apps/web test -- src/features/seed-data/local-seed-reset.test.ts` fuehrt weiter 7 Testdateien aus; Epic-Ebene bleibt durch offenes Security-Gate formal blockiert |
| E2-S1 | AC-1 | QA-E2-S1-01 | Kontextkandidatenliste ist duplikatfrei | local | x |  | 2026-02-26: `pnpm --dir apps/web exec vitest run src/features/query/retrieval.test.ts` Pass; keine doppelten Node-IDs in Ergebnissen |
| E2-S1 | AC-2 | QA-E2-S1-02 | Drei identische Laeufe liefern identische Top-3 Reihenfolge | local,aura | x |  | 2026-02-26: `pnpm --dir apps/web exec vitest run src/features/query/retrieval.test.ts` Pass; stabile Top-3-Reihenfolge ueber Wiederholungen bestaetigt |
| E2-S2 | AC-1 | QA-E2-S2-01 | Antwortkontext ist dedupliziert, jedes Konzept maximal einmal | local | x |  | 2026-02-26: `pnpm --dir apps/web exec vitest run src/features/query/retrieval.test.ts` (3 tests, Exit Code 0) und `pnpm --dir apps/web exec vitest run src/app/api/query/route.test.ts` (2 tests, Exit Code 0). |
| E2-S2 | AC-2 | QA-E2-S2-02 | Jedes Kontextelement ist auf Kandidat oder Erweiterungsquelle rueckfuehrbar | local | x |  | 2026-02-26: Obige Tests bestaetigen das `context.elements`-Paket inklusive `source.publicReference`, `sourceId`, `sourceFile` und `sourceType`. |
| E2-S3 | AC-1 | QA-E2-S3-01 | Hauptantwort ist nicht leer | local,vercel | x |  | 2026-02-26: `pnpm --dir apps/web exec vitest run src/features/query/answer.test.ts` (2 tests, Exit Code 0) und `pnpm --dir apps/web exec vitest run src/app/api/query/route.test.ts` (2 tests, Exit Code 0); `answer.main` bleibt nicht leer. |
| E2-S3 | AC-2 | QA-E2-S3-02 | Referenzsektion enthaelt bis zu drei Konzepte oder klaren Fallback-Hinweis | local,vercel | x |  | 2026-02-26: Obige Tests bestaetigen `references.length <= 3` sowie fallback-spezifische Texte. |
| E2-S4 | AC-1 | QA-E2-S4-01 | Unter den ersten drei Referenzen sind mindestens zwei erwartete Konzepte oder klarer Fallback | local,vercel |  |  |  |
| E3-S1 | AC-1 | QA-E3-S1-01 | Hauptantwort sichtbar nach gueltiger Anfrage | local,vercel |  |  |  |
| E3-S1 | AC-2 | QA-E3-S1-02 | Referenzkonzepte und P0-Kernnachweis sichtbar | local,vercel |  |  |  |
| E3-S2 | AC-1 | QA-E3-S2-01 | Loading, Fehler, Leere zeigen unterscheidbaren Status-Text | local,vercel |  |  |  |
| E3-S2 | AC-2 | QA-E3-S2-02 | Jeder Status zeigt klar benannte naechste Aktion | local,vercel |  |  |  |
| E3-S3 | AC-1 | QA-E3-S3-01 | Zusatzdetails erweitern Erklaerung gegenueber P0 | local,vercel |  |  |  |
| E3-S3 | AC-2 | QA-E3-S3-02 | Hauptantwort, Referenzen und P0-Nachweis bleiben ohne Interaktion voll sichtbar | local,vercel |  |  |  |
| E4-S1 | AC-1 | QA-E4-S1-01 | Live-URL liefert HTTP 200 | vercel |  |  |  |
| E4-S1 | AC-2 | QA-E4-S1-02 | Zwei Smoke-Fragen liefern sichtbare Hauptantwort ohne Laufzeitfehler | vercel |  |  |  |
| E4-S2 | AC-1 | QA-E4-S2-01 | Repo-Scan findet keine offengelegten API-Keys | local |  |  |  |
| E4-S2 | AC-2 | QA-E4-S2-02 | Aktives Usage-Limit fuer Produktions-Key ist nachweisbar | vercel |  |  |  |
| E4-S3 | AC-1 | QA-E4-S3-01 | Limitueberschreitung liefert temporaere Blockierung mit verstaendlicher Rueckmeldung | local,vercel |  |  |  |
| E4-S3 | AC-2 | QA-E4-S3-02 | Nach Zeitfenster erlaubt System wieder regulaere Requests | local,vercel |  |  |  |
| E4-S4 | AC-1 | QA-E4-S4-01 | Logs enthalten keine Roh-Nutzereingaben | local,vercel |  |  |  |
| E4-S4 | AC-2 | QA-E4-S4-02 | Logs enthalten keine Secrets | local,vercel |  |  |  |
| E5-S1 | AC-1 | QA-E5-S1-01 | Eval-Set enthaelt exakt fuenf Fragen | local |  |  |  |
| E5-S1 | AC-2 | QA-E5-S1-02 | Jede Frage hat Erwartungsliste mit 3 bis 6 Konzepten | local |  |  |  |
| E5-S1 | AC-3 | QA-E5-S1-03 | Jede Frage hat klare Erfolgskriterien | local |  |  |  |
| E5-S2 | AC-1 | QA-E5-S2-01 | Ergebnisse je Frage sind im Abnahmelauf dokumentiert | local,vercel |  |  |  |
| E5-S2 | AC-2 | QA-E5-S2-02 | Mindestens 4 von 5 Fragen bestehen Referenzziel oder Fallback-Regel | local,vercel |  |  |  |
| E5-S3 | AC-1 | QA-E5-S3-01 | Liste mit mindestens fuenf Folgeaktionen vorhanden | local |  |  |  |
| E5-S3 | AC-2 | QA-E5-S3-02 | Jede Folgeaktion enthaelt Prioritaet, Zweck und naechsten Schritt | local |  |  |  |

## Statuskonvention fuer Pass und Fail Felder
1. Pass markieren mit `x` in Spalte Pass.
2. Fail markieren mit `x` in Spalte Fail.
3. Evidenz verweist auf Datei oder reproduzierbaren Command-Lauf mit Datum.
