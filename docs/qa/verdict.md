# QA Gate Verdicts

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

## Story E3-S1 Query-Eingabe und Antwortansicht bereitstellen

### Ergebnis
1. Verdict: Pass.
2. Gate-Typ: Story QA Gate.
3. Story-ID: E3-S1.
4. Epic-ID: E3.
5. Bewertungsdatum: 2026-02-26.

### Szenario-Prüfung Given When Then
1. Given: Der Nutzer hat eine gültige Frage in das Query-Panel eingegeben und das System kann `/api/query` erreichen.
2. When: Die Frage wird abgesendet und die API liefert `answer.main`, `coreRationale` und eine Referenzliste mit bis zu drei Einträgen.
3. Then-1: Die Hauptantwort wird in der `Hauptantwort`-Sektion sichtbar gerendert.
4. Then-2: Unter `Referenzkonzepte` erscheinen maximal drei Referenz-Items (Name + Quelle).
5. Then-3: Der `Knappe P0-Kernnachweis` zeigt den `coreRationale`-Text inklusive Hinweis auf relevante Referenzen.
6. Then-4: Der Submit-Button ist während des Ladens deaktiviert und die Statusanzeige wechselt über `loading` zu `success`.
7. Ergebnis: Pass, Hauptantwort, Referenzen und Kernnachweis sind nach zwei unterschiedlichen Fragen sichtbar dokumentiert.

### Ausgeführte QA-Checks
1. `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts` (3 tests, Exit Code 0) – validiert `buildQueryViewModel` inklusive Statusstrom, Antwortverarbeitung und Referenzaggregate.
2. Manuelle UI-Verifikation: Dev-Server (`pnpm --dir apps/web dev`), mindestens zwei unterschiedliche Fragen schicken (Default + eigene komplexe Frage), Hauptantwort, Referenzen und Kernnachweis jeweils sichtbar prüfen und dokumentieren.

### Merge Block & Fix Requests
1. Kein Merge Block.
2. Keine offenen Fix Requests innerhalb des Story-Scopes.

### Top 3 Risiken
1. UI-Visibility hängt von der Stabilität der Statusanzeige in `QueryInput`; Änderungen am Statusstrom erfordern erneute Validierung.
2. Referenzliste muss weiterhin auf drei Items begrenzt bleiben, sonst passt die Darstellung nicht zum Template.
3. Core-Rationale-Text basiert auf `answer.coreRationale`; Änderungen dort müssen mit E3-S1 rechecked werden.

### Nächste Tests
1. E3-S2 Loading-, Fehler- und Leerezustände in `QueryPanel` testen.
2. E3-S3 Herleitungsdetails sichtbarer machen und die UI-Metadaten (e.g. References & Rationale) in Story-Context ausbauen.
3. Sobald neue API-Antworten das Format ändern, `buildQueryViewModel` sowie die manuellen UI-Schritte erneut validieren.

## Story E3-S2 Loading-, Fehler- und Leerezustände

### Ergebnis
1. Verdict: Pass.
2. Gate-Typ: Story QA Gate.
3. Story-ID: E3-S2.
4. Epic-ID: E3.
5. Bewertungsdatum: 2026-02-26.

### Szenario-Prüfung Given When Then
1. Given: Die UI zeigt `QueryPanel` mit Status-Texten und zugehörigen `nextAction`-Hinweisen.
2. When: Der Status wechselt auf Loading, Error oder Empty.
3. Then-1: Status-Text ist jeweils unterscheidbar für Loading, Error und Empty.
4. Then-2: Für jeden Status erscheint eine klar benannte `Nächste Aktion`.
5. Then-3: `QueryInput` nutzt die Hinweise im Helper-Text und deaktiviert den Submit-Button während des Ladens.
6. Ergebnis: Pass, Status-/Action-Texte aus `getStatusHint` validiert und von `QueryPanel` übernommen, Submit-Button-Logik gewährleistet.

### Ausgeführte QA-Checks
1. `pnpm --dir apps/web exec vitest run src/components/organisms/query-panel-status.test.ts` (3 tests, Exit Code 0) – der Test prüft `getStatusHint` für Loading, Error und Empty inkl. `nextAction`.
2. Code Review `apps/web/src/components/organisms/query-panel.tsx` sowie `QueryInput`-Props bestätigt Fluss vom Status-Hinweis zu Helper-Text und Submit-Button-Zustand.

### Merge Block & Fix Requests
1. Kein Merge Block.
2. Keine offenen Fix Requests innerhalb des Story-Scopes.

### Top 3 Risiken
1. Manuelle UI-Simulation (offline/Error, Empty) wurde nicht im Browser-Dev-Server durchgeführt; sollte bei Bedarf lokal reproduziert werden.
2. Änderungen an der Submit-Logik in `QueryInput` könnten erneut die Helper-Text-Anbindung brechen; Recheck erforderlich.
3. Neue API-Fehlermeldungen könnten den `errorMessage`-Flow verändern; Kombination mit `getStatusHint` muss bestehen bleiben.

### Nächste Tests
1. E3-S3 Herleitungsdetails sichtbarer machen und ergänzende UI-Prüfungen dokumentieren.
2. Bei Template-Änderungen im QueryPanel erneut manuelle Status/Action-Simulation durchführen.
3. Nach Backend-Fehlermeldungsanpassungen `getStatusHint` neu validieren.

## Story E3-S3 Herleitungsdetails sichtbar machen

### Ergebnis
1. Verdict: Pass.
2. Gate-Typ: Story QA Gate.
3. Story-ID: E3-S3.
4. Epic-ID: E3.
5. Bewertungsdatum: 2026-02-26.

### Szenario-Prüfung Given When Then
1. Given: Der Query-ViewModel-Flow liefert eine API-Antwort mit mindestens einem Referenzkonzept sowie `coreRationale`.
2. When: `buildQueryViewModel` wird ausgeführt und das Query-Panel rendert die Antwortbereiche.
3. Then-1: `derivationDetails` stellt maximal drei nummerierte Kontextsummaries mit `sourceFile` sowie `sourceId` bereit und ergänzt die Erklärung.
4. Then-2: Hauptantwort, Referenzen und `Knapper P0-Kernnachweis` bleiben ohne weitere Interaktion vollständig sichtbar.
5. Ergebnis: Pass – `derivationDetails` erweitern die Erklärung, while die drei Kernsektionen stabil sichtbar bleiben.

### Ausgeführte QA-Checks
1. `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts` (3 tests, Exit Code 0) – validiert `derivationDetails`, das Referenzlimit ≤3 und das `coreRationale`-Fallback.
2. Manuelle UI-Verifikation: Dev-Server (`pnpm --dir apps/web dev`), Defaultfrage und eine zusätzliche Frage absenden; dokumentieren, dass die `Herleitungsdetails`-Sektion erscheint, jede Zeile Label/Summary/Quelle zeigt und Hauptantwort/Referenzen/Kernnachweis im Frontend durchgehend sichtbar sind.

### Merge Block & Fix Requests
1. Kein Merge Block.
2. Keine offenen Fix Requests innerhalb des Story-Scopes.

### Top 3 Risiken
1. `derivationDetails` hängt an `buildQueryViewModel`; Änderungen dort erfordern erneute QA und Referenzlimit-Checks.
2. Template-Anpassungen an der `Herleitungsdetails`-Sektion könnten die Sichtbarkeit der Hauptbereiche beeinträchtigen.
3. Änderungen am API-Response-Format (z. B. fehlende `sourceFile`-Angabe) drohen, die Attribution in `derivationDetails` zu beschädigen.

### Nächste Tests
1. E3-Epic-Check durchführen, sobald E3-S3, Security und DevOps-Gates in der Story-Reihenfolge abgeschlossen sind.
2. E4-Gates vorbereiten, falls E3-S3 durch neue UI-Templates zusätzliche Rendering-Workflows einführt.
3. Beobachte, ob `derivationDetails` bei neuen Fragen weiterhin stabil nummeriert und limitiert bleibt.
