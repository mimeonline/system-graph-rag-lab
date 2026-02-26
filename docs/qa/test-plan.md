# QA Test Plan MVP

## Teststrategie
### Unit
1. Story-Fokus `E1-S6`: Validierung der lokalen Seed-Reset-Orchestrierung und der Fail-Fast-Regeln fuer fehlende Neo4j-Credentials.
2. Security-Recheck fuer Story `E1-S6`: local-only Guard, Opt-In Guard, fail-fast vor Driver-Init und Delete-Scope auf `seedNodeIds`.
3. Story-spezifische Evidenz ueber `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts`.

### Integration
1. Regressionslauf ueber `pnpm --dir apps/web test`.
2. Erwartung: Exit Code `0` und gruenes Verhalten fuer Seed-Domain, API-Route und lokale Neo4j-Integrationspfade.

### Story E2-S2 Kontext-Erweiterung
1. Validierung des Response-Pakets `context.elements` auf einen eindeutigen Kontextelementsatz, der keine Duplikate mit derselben `sourceId` oder `sourceFile` enthaelt.
2. Sicherstellen, dass jedes Kontextelement eine `source.publicReference` sowie `sourceId`, `sourceFile` und `sourceType` enthaelt und einer Kandidatenquelle oder Erweiterungsquelle zugeordnet werden kann.
3. Story-spezifischer Testlauf mit `pnpm --dir apps/web exec vitest run src/features/query/retrieval.test.ts` und `pnpm --dir apps/web exec vitest run src/app/api/query/route.test.ts`.
4. Erwartung: Beide Tests laufen mit Exit Code `0` und bestaetigen deduplizierte `context.elements` plus die Source-Attribute.

### E2E minimal
1. Statische Qualitaet: `pnpm --dir apps/web lint`.
2. Build-Readiness: `pnpm --dir apps/web build`.
3. Story-spezifischer Runtime-Ablauf: `pnpm --dir apps/web seed:local:reset-reseed` nach Env-Load mit explizitem Opt-In.

## Testumgebung
### local
1. Verbindliche Umgebung fuer Story-Gate `E1-S6`.
2. Neo4j Docker lokal erreichbar auf `bolt://localhost:7687`.
3. Runtime-Variablen gesetzt: `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`.
4. Laufdatum: `2026-02-26`.

### vercel
1. Nicht im Scope dieses Story-Gates.

### aura
1. Nicht im Scope dieses Story-Gates.

## Testdaten und Seed Voraussetzungen
1. Seed-Quelle: `createSeedDataset()` plus `runSeedDatasetQualityCheck(...)`.
2. Erwartete Importgroesse im aktuellen Stand: `105` Nodes und `203` Relationen.
3. Fuer reproduzierbare lokale Laeufe gilt Fallback `NEO4J_DATABASE=neo4j`, falls nicht in `.env.local` gesetzt.

## Abnahmekriterien
### Story E1-S6 Szenario
1. Given: laufender lokaler Neo4j-Docker-Container, verfuegbare Seed-Quelle, gesetzte Runtime-Variablen.
2. When: lokaler Ablauf fuer Seed-Reset, Seed-Import und Reseed wird ausgefuehrt.
3. Then: bestehende Seed-Datenbasis wird kontrolliert zurueckgesetzt.
4. Then: Seed-Datenbasis wird aus freigegebener Quelle erneut eingespielt.
5. Then: echte Neo4j-Reads fuer mindestens zwei Nodes und zwei Relationen sind nach Reseed erfolgreich.

### Security-Recheck Szenario E1-S6
1. Given: Security-Findings zu Runtime-Guard und Delete-Scope liegen als Recheck-Ziel vor.
2. When: story-spezifische Tests fuer `local-seed-reset` werden ausgefuehrt.
3. Then: non-local URI wird vor Driver-Init abgelehnt.
4. Then: fehlendes `ALLOW_DESTRUCTIVE_SEED_RESET=true` wird vor Driver-Init abgelehnt.
5. Then: bei Guard-Fail wird kein Delete-Query ausgefuehrt.
6. Then: Delete-Query ist auf `WHERE n.id IN $seedNodeIds` begrenzt.

### Gate-Regel
1. Pass: `lint`, `test`, `build` und story-spezifischer Reset-Reseed-Check laufen mit Exit Code `0` und die Given-When-Then-Bedingungen sind reproduzierbar belegt.
2. Fail: mindestens ein Pflicht-Check fehlschlaegt oder eine Then-Bedingung ist nicht reproduzierbar nachweisbar.

## Funktionsdoku fuer Pruefablauf
### Pruefablauf `seed:local:reset-reseed`
1. Zweck: Reproduzierbar pruefen, dass lokaler Neo4j-Reset, Reimport und Runtime-Read-Check als zusammenhaengender Story-Ablauf funktionieren.
2. Input: geladene lokale Env-Werte, laufender Neo4j-Container, Seed-Dataset.
3. Output: Exit Code `0` und Kennzahlen fuer importierte sowie gelesene Nodes und Relationen.
4. Fail oder Edge-Case: fehlende Neo4j-Credentials fuehren zu Fail-Fast vor Driver-Initialisierung; nicht erreichbarer Neo4j-Endpunkt bricht den Ablauf.
5. Beispiel: `set -a; . apps/web/.env.local; set +a; export NEO4J_DATABASE=${NEO4J_DATABASE:-neo4j}; export ALLOW_DESTRUCTIVE_SEED_RESET=${ALLOW_DESTRUCTIVE_SEED_RESET:-true}; pnpm --dir apps/web seed:local:reset-reseed`.

### Pruefablauf `vitest scoped local-seed-reset`
1. Zweck: Story-spezifische Testevidenz fuer E1-S6 ohne Suite-Verwischung sicherstellen.
2. Input: Testdatei `src/features/seed-data/local-seed-reset.test.ts`.
3. Output: Genau eine ausgefuehrte Testdatei, reproduzierbar `5 passed` und `1 skipped`.
4. Fail oder Edge-Case: `pnpm --dir apps/web test -- src/features/seed-data/local-seed-reset.test.ts` ist nicht zulassig fuer Scope-Evidenz, da der Lauf weiterhin die Gesamtsuite startet.
5. Beispiel: `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts`.

### Story E2-S3 Antwort aus strukturiertem Kontext
1. Validierung, dass `answer.main` nicht leer bleibt und `answer.coreRationale` den Kontext nachvollziehbar zusammenfasst.
2. Sicherstellung, dass `references.length <= 3` und bei leerem Referenzset ein klarer Fallback-Text erscheint.
3. Story-spezifischer Testlauf:
   - `pnpm --dir apps/web exec vitest run src/features/query/answer.test.ts`
   - `pnpm --dir apps/web exec vitest run src/app/api/query/route.test.ts`
4. Erwartung: Beide Tests Exit Code `0`, API-Contract bleibt intakt (`status`, `state`, `references`, `context.elements`, `meta`, `answer`).

### Story E2-S4 Referenzkonzepte absichern
1. Erwartungsliste aus `apps/web/src/features/query/reference-expectations.ts` wird gegen die ersten drei Referenzen der generierten Antwort geprüft und erlaubt nur deterministische Matches.
2. Story-spezifischer Testlauf: `pnpm --dir apps/web exec vitest run src/features/query/answer.test.ts` (vier Tests, inklusive Match- und Fallback-Szenarien).
3. Zusatzcheck: manuelle `POST /api/query`-Beispielanfrage (Q1 oder eine Frage ohne passende Konzepte) dokumentieren und prüfen, dass im ersten Fall der Hinweis ausbleibt und im zweiten Fall der `Hinweis: ...`-Fallback erscheint.
4. Abnahme erwartet: mindestens zwei erwartete Konzepte unter den ersten drei Referenzen oder ein deutlich formulierter Fallback-Hinweis mit Bezug auf die erwarteten Konzepte.

### Story E3-S1 Query-Eingabe und Antwortansicht
1. Automatisierter View-Model-Check: `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts` – validiert `buildQueryViewModel`, Statusstrom und die Fragmentierung von Hauptantwort, Referenzen (maximal drei) und `coreRationale`.
2. Manuelle UI-Flow-Pruefung: Dev-Server (`pnpm --dir apps/web dev`) starten, mindestens zwei Fragen (Default + eine komplexe eigene Frage) absenden und nach jeder Antwort die Sektionen `Hauptantwort`, `Referenzkonzepte` (≤3 Items) und `Knapper P0-Kernnachweis` prüfen.
3. Beobachtung: Der Submit-Button darf währen des Ladens inaktiv sein und die Statusanzeige muss von `loading` auf `success` wechseln, bevor neue Queries möglich sind.
4. Abnahme: Hauptantwort, Referenzliste und Kernnachweis bleiben nach je zwei Queries sichtbar dokumentiert; Screenshot/Notizen festhalten.

### Story E3-S2 Loading-, Fehler- und Leerezustände
1. Status-Texts für Loading, Error und Empty müssen unterscheidbar sein und mit der richtigen `Nächsten Aktion` verbunden sein; `QueryPanel` und `QueryInput` sollen diese Texte im Helper-Text und im Status-Hinweis anzeigen.
2. Testlauf: `pnpm --dir apps/web exec vitest run src/components/organisms/query-panel-status.test.ts` (3 tests, Exit Code 0) – prüft `getStatusHint` für Loading, Error und Empty sowie die Next-Action-Formulierungen.
3. Manuelle Prüfung: Lade eine Frage, simuliere einen Fehler (z. B. Browser offline) und eine Antwort mit leeren Referenzen (`references: []`), prüfe jeweils den Status-Text, die `Nächste Aktion` und den deaktivierten Submit-Button bzw. Helper-Text.
### Story E3-S3 Herleitungsdetails sichtbar machen
1. Validierung, dass `buildQueryViewModel` ein `derivationDetails`-Array bereitstellt, das nummerierte Kontextsummaries mit `sourceFile`-Attribution sowie maximal drei Einträge enthält.
2. Story-spezifischer Testlauf: `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts` (3 tests, Exit Code 0) – bestätigt `derivationDetails`, Referenzlimit und `coreRationale`-Fallback bei leeren Referenzen, sowie die Statusstrom-Handhabung.
3. Manuelle UI-Flow-Überprüfung: Dev-Server (`pnpm --dir apps/web dev`) starten, Defaultfrage und mindestens eine weitere komplexe Frage absenden und prüfen:
   - Die `Herleitungsdetails`-Sektion erscheint unterhalb des `Knapper P0-Kernnachweis`.
   - Jede Zeile zeigt Label, Summary und `sourceFile`, es werden maximal drei Einträge dargestellt.
   - Hauptantwort, Referenzen und Kernnachweis bleiben ohne zusätzliche Interaktion vollständig sichtbar.
4. Abnahme: `derivationDetails` generieren zusätzliche Erklärungstiefe, während die Hauptbereiche stabil sichtbar bleiben; Evidence per Testlauf und kurzen Notizen/Screenshots dokumentieren.
