# QA Gate Verdict Epic E2

## Story E2-S2 Kontext konsistent erweitern

### Ergebnis
1. Verdict: Pass.
2. Gate-Typ: Story QA Gate.
3. Story-ID: E2-S2.
4. Epic-ID: E2.
5. Bewertungsdatum: 2026-02-26.

### Szenario-Prüfung Given When Then
1. Given: Der Retrieval-Layer liefert Kontextkandidaten mit Source-Attributen.
2. When: Die Antwortpipeline erweitert den Kontext zu `context.elements`.
3. Then-1: Jede Referenz ist dedupliziert über `sourceId`, `sourceFile` und `source.publicReference`.
4. Then-2: Jedes Kontextelement enthält `source.publicReference`, `sourceId`, `sourceFile` und `sourceType`.
5. Ergebnis: Pass, deduplizierte Kontextpakete mit vollständiger Attribution reproduzierbar.

### Ausgeführte QA-Checks
1. `pnpm --dir apps/web exec vitest run src/features/query/retrieval.test.ts` (3 tests, Exit Code 0).
2. `pnpm --dir apps/web exec vitest run src/app/api/query/route.test.ts` (2 tests, Exit Code 0).

### Merge Block & Fix Requests
1. Kein Merge Block.
2. Keine offenen Fix Requests innerhalb des Story-Scopes.

### Top 3 Risiken
1. Deduplizierung stützt sich auf aktuelle Source-IDs und Dateipfade.
2. Attribution setzt `source.publicReference` voraus; Fallback noch manuell.
3. Epic E2 bleibt in `todo`, daher verlieren Probleme im Nachgang an Sichtbarkeit.

### Nächste Tests
1. E2-S3 Antwortgenerierung gegen strukturierte Kontextdaten testen.
2. E2-S4 Referenzabsicherung und Fallback-Regeln gegen Response-Contract prüfen.
3. E2-S2 re-checken, falls Kontextdatenmodell oder Attribution geändert werden.

## Story E2-S3 Antwort aus strukturiertem Kontext erzeugen

### Ergebnis
1. Verdict: Pass.
2. Gate-Typ: Story QA Gate.
3. Story-ID: E2-S3.
4. Epic-ID: E2.
5. Bewertungsdatum: 2026-02-26.

### Szenario-Prüfung Given When Then
1. Given: Ein strukturiertes Kontextpaket mit Referenzen aus `context.elements`.
2. When: Die Antwortpipeline wird ausgeführt.
3. Then-1: `answer.main` ist nicht leer und liefert eine erklärbare Aussage.
4. Then-2: Die Referenzsektion enthält maximal drei Konzepte oder einen klaren Fallback-Hinweis.
5. Ergebnis: Pass, Hauptantwort nicht leer, Referenzen auf ≤3 begrenzt, Core-Rationale aus Kontextsummaries.

### Ausgeführte QA-Checks
1. `pnpm --dir apps/web exec vitest run src/features/query/answer.test.ts` (2 tests, Exit Code 0) – prüft Fallback-Text und Referenzlimit.
2. `pnpm --dir apps/web exec vitest run src/app/api/query/route.test.ts` (2 tests, Exit Code 0) – bestätigt API-Contract, Referenz- und Kontextanalyse.

### Merge Block & Fix Requests
1. Kein Merge Block.
2. Keine offenen Fix Requests innerhalb des Story-Scopes.

### Top 3 Risiken
1. Fallback-Text muss bei fehlenden Referenzen exakt spezifiziert bleiben.
2. Referenzlimit auf drei Einträge darf durch Codeänderungen nicht aufweichen.
3. Core-Rationale hängt von `context.elements`-Summaries; Änderungen hier benötigen erneute QA.

### Nächste Tests
1. E2-S4 Referenzabsicherung und Referenz-Fallback gegen `/api/query` Response prüfen.
2. E2-S3 End-to-End-Query (z.B. via Story-Simulationsdaten) ausführen, sobald API-Samples verfügbar.
3. E2-S4 und E2-S5 als Konsistenz-Check erneut re-checken, falls Kontext/Antwort-Fix-Requests auftreten.

## Story E2-S4 Referenzkonzepte in Ausgabe absichern

### Ergebnis
1. Verdict: Pass.
2. Gate-Typ: Story QA Gate.
3. Story-ID: E2-S4.
4. Epic-ID: E2.
5. Bewertungsdatum: 2026-02-26.

### Szenario-Prüfung Given When Then
1. Given: Freigegebene Erwartungsliste für Eval-Fragen in `reference-expectations.ts`.
2. When: Antwortpipeline generiert `answer` und prüft die ersten drei Referenzen gegen die Liste.
3. Then-1: Mindestens zwei erwartete Konzepte erscheinen in den ersten drei Referenzen, oder es wird ein klarer Hinweis mit den fehlenden Konzepten eingeblendet.
4. Then-2: Der Hinweis referenziert die eigentlichen erwarteten Konzepte und fordert zum Hinzufügen von Kontext oder Korrektur auf.
5. Ergebnis: Pass, deterministische Match- und Fallback-Logik reproduzierbar.

### Ausgeführte QA-Checks
1. `pnpm --dir apps/web exec vitest run src/features/query/answer.test.ts` (4 tests, Exit Code 0) – validiert Match-Szenarien mit zwei erwarteten Referenzen sowie den Fallback-Text bei weniger als zwei Matches.
2. `POST /api/query` (Q1-Beispiel) bestätigt, dass bei zwei erwarteten Referenzen der Hinweis ausbleibt.
3. `POST /api/query` mit nicht passenden Konzepten belegt den `Hinweis: ...`-Fallback inklusive Referenzliste.

### Merge Block & Fix Requests
1. Kein Merge Block.
2. Keine offenen Fix Requests innerhalb des Story-Scopes.

### Top 3 Risiken
1. Erwartungslisten müssen bei künftigen Eval-Fragen konsistent erweitert werden, sonst brechen automatisierte Vergleiche.
2. Fallback-Hinweis-Text muss in mehreren Sprachvarianten identisch bleiben, um Tests zu halten.
3. API-spezifische Referenzbegrenzungen (`MAX_REFERENCES_IN_RESPONSE`) dürfen nicht angepasst werden, ohne Re-Test von E2-S4.

### Nächste Tests
1. E2-S4 gegen neue Eval-Fragen testen, sobald Liste erweitert wird.
2. E2-S3 End-to-End-Anfrage über `/api/query` mit Story-Daten durchspielen.
3. E2-S4 erneut re-checken, falls `reference-expectations.ts` oder `buildStructuredAnswer` angepasst wird.
