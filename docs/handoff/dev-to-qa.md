# Dev Handoff

## E1-S6 Neo4j lokal Seed Reset und Reseed
### Was ist fertig
1. Runtime-Guard fuer destruktiven Seed-Reset ist hart lokal: nur `localhost`, `127.0.0.1`, `::1`.
2. Explizites Opt-In ist verpflichtend: `ALLOW_DESTRUCTIVE_SEED_RESET=true`.
3. Guard greift vor jeder destruktiven DB-Operation; bei Guard-Fail wird kein Driver erstellt und kein Delete-Query ausgefuehrt.
4. Delete-Scope ist auf Seed-Bestand begrenzt: `WHERE n.id IN $seedNodeIds`.
5. Security-Tests fuer non-local reject, missing opt-in reject und no delete on guard-fail sind vorhanden und gruen.
6. Bug-0003 ist gefixt: story-spezifisches Testkommando ist im E1-S6-Kontext auf `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts` normalisiert.

### Wie kann QA testen lokal inkl konkrete Startschritte
1. Lokalen Neo4j Docker starten, erreichbar unter `bolt://localhost:7687`.
2. In `apps/web/.env.local` setzen: `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`, `ALLOW_DESTRUCTIVE_SEED_RESET=true`.
3. Story-spezifischen Testlauf ausfuehren: `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts`.
4. Vollstaendige Verifikation mit Lint, Test, Build ausfuehren.
5. Optional CLI-Lauf ausfuehren: `pnpm --dir apps/web seed:local:reset-reseed`.

### Bekannte Einschraenkungen & Testdaten
1. Der Integrations-Test in `local-seed-reset.test.ts` bleibt ohne vollstaendige Neo4j-Env als `skipped` markiert.
2. Seed-Reset bleibt absichtlich destruktiv fuer Seed-IDs und ist deshalb per Opt-In abgesichert.
3. Unit-Tests nutzen injizierte Testdaten; CLI-Lauf nutzt `createSeedDataset()`.

### Erwartete Failure Modes
1. Nicht-lokale `NEO4J_URI` fuehrt zu sofortigem Abbruch.
2. Fehlendes oder anderes Opt-In als `ALLOW_DESTRUCTIVE_SEED_RESET=true` fuehrt zu sofortigem Abbruch.
3. Fehlende Credentials fuehren zu fail-fast vor Driver-Nutzung.
4. Neo4j Connectivitaets- oder Auth-Fehler brechen den Lauf mit Fehler ab.

### Genaue Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web lint` Exit Code `0`.
2. `pnpm --dir apps/web test` Exit Code `0`.
3. `pnpm --dir apps/web build` Exit Code `0`.
4. `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts` Exit Code `0`.
5. `pnpm --dir apps/web seed:local:reset-reseed` Exit Code `0` nur mit lokalem URI plus Opt-In.

## E2-S1 Kontextkandidaten pro Frage bereitstellen
### Was ist fertig
1. Keyword-basierter Vektor-Proxy indexiert alle Seed-Nodes deterministisch über Titel + Summary.
2. Top-6-Kandidaten werden stabil nach Score, Hop, Node-Type und Node-ID sortiert.
3. Kontextbudget bleibt innerhalb der vertraglichen 1.400 Tokens; doppelte Node-IDs werden durch das Indexmodell ausgeschlossen.
4. API antwortet mit `state="answer"`, `references`, `meta.retrievedNodeCount` und `meta.contextTokens`, sobald mindestens ein Kandidat zurückkommt.

### Wie kann QA testen
1. `pnpm --dir apps/web test -- src/features/query/retrieval.test.ts`
2. `pnpm --dir apps/web test -- src/app/api/query/route.test.ts`
3. Laufende Lint, Test und Build (siehe Liste oben) sichern den Contract.

## E2-S2 Kontext für Antwort konsistent erweitern
### Was ist fertig
1. Die Retrieval-Antwort enthält ein `context.elements` Paket, das jede Referenz mit deduplizierten Kontextelementen verbindet.
2. Jedes Kontextelement enthält den gekürzten Summarytext (max. 280 Zeichen) sowie das `source`-Objekt mit `sourceId`, `sourceFile`, `sourceType` und öffentlicher Referenz.
3. `context.elements.length` entspricht der Referenzliste, sodass QA jedes Element eindeutig einem Kandidaten zuordnen kann.

### Wie kann QA testen
1. `pnpm --dir apps/web exec vitest run src/features/query/retrieval.test.ts`
2. `pnpm --dir apps/web exec vitest run src/app/api/query/route.test.ts`

## E2-S3 Antwort aus strukturiertem Kontext erzeugen
### Was ist fertig
1. Die Antwortpipeline erzeugt aus dem Retrieval-Kontext eine nicht-leere `answer.main` und eine strukturierte `coreRationale`.
2. Es werden maximal drei Referenzkonzepte aus dem Kontextpaket übergeben; wenn keine Referenzen vorliegen, liefert die Antwort einen klaren Hinweis zum Nachsteuern.
3. `context.elements`, `meta.retrievedNodeCount` und `contextTokens` stimmen mit den gelieferten Referenzen überein und reflektieren nur die sichtbaren Kontextelemente.

### Wie kann QA testen
1. `pnpm --dir apps/web exec vitest run src/features/query/answer.test.ts`
2. `pnpm --dir apps/web exec vitest run src/app/api/query/route.test.ts`
3. Eine Beispielanfrage an `/api/query` starten und prüfen, dass `references.length <= 3`, `context.elements.length` mit Referenzen korrespondiert und `answer.coreRationale` die Kontextsummaries wiedergibt.

## E2-S4 Referenzkonzepte in Ausgabe absichern
### Was ist fertig
1. Die ersten drei Referenzen einer Antwort werden gegen die freigegebenen Erwartungslisten der fünf Eval-Fragen (Q1–Q5 in `evals/rubric.md`) abgeglichen, ohne externe Abhängigkeiten.
2. Falls weniger als zwei erwartete Konzepte unter diesen Referenzen auftauchen, ergänzt `answer.coreRationale` den `Hinweis: Unter den ersten drei Referenzen ...`-Fallback, damit Eval-Verantwortliche die fehlenden Konzepte sehen.
3. Die Erwartungsliste ist deterministisch im Code hinterlegt (`apps/web/src/features/query/reference-expectations.ts`) und die Tests prüfen positive sowie negative Matching-Szenarien.

### Wie kann QA testen
1. `pnpm --dir apps/web exec vitest run src/features/query/answer.test.ts`
2. Beispielanfrage an `POST /api/query` mit `{"query":"Wie wirken Feedback Loops auf lokale Optimierung in komplexen Systemen?"}` senden und prüfen, dass zwei erwartete Referenzen enthalten sind und der Hinweis ausbleibt.
3. Beispielanfrage mit einer Frage ohne passende Referenzen ausführen und prüfen, dass die Antwort `answer.coreRationale` den `Hinweis`-Fallback enthält.

### Bekannte Einschränkungen & Testdaten
1. Erwartungslisten decken nur die fünf Eval-Fragen ab; andere Queries lösen kein Matching und keinen Hinweis aus.
2. Die Logik prüft immer die tatsächlich gelieferten ersten drei Referenzen und ist damit deterministisch, auch wenn z.B. `context.elements` kürzer ist als die Referenzliste.

### Erwartete Failure Modes
1. Fällt die `Hinweis`-Nachricht trotz fehlender erwarteter Konzepte aus, ist der Matcher defekt; die Tests aus `answer.test.ts` helfen bei der Rekonstruktion.

### Genaue Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web exec vitest run src/features/query/answer.test.ts` Exit Code `0`.

## E3-S1 Query-Eingabe und Antwortansicht bereitstellen
### Was ist fertig
1. Die Query-Panel-UI nimmt Freitext entgegen, sendet ihn an `POST /api/query` und visualisiert den Haupttext, die Referenzliste sowie den knappen P0-Kernnachweis.
2. `QueryInput` ist interaktiv, zeigt den aktuellen Status (idle, loading, success/error) sowie Statushilfetext und deaktiviert den Submit-Button während des Ladens.
3. `QueryPanel` wertet die strukturierte API-Antwort mit `buildQueryViewModel` aus und hält die maximal drei Referenzen, Kontextsummarys sowie das Tokenbudget fest.

### Wie kann QA testen lokal inkl konkrete Startschritte
1. `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts` – bestätigt die View-Model-Logik für die UI-Flow-Steuerung.
2. Dev-Server starten (`pnpm --dir apps/web dev`), Browser öffnen und Homepage laden.
3. Mindestens zwei verschiedene Fragen absenden (z. B. die Defaultfrage plus eine weitere), jeweils prüfen, dass
   - die Hauptantwort (`Hauptantwort`-Sektion) sichtbar ist,
   - unter `Referenzkonzepte` maximal drei Items auftauchen,
   - der `Knapper P0-Kernnachweis` die `coreRationale` aus der API zeigt und Referenzmöglichkeiten dokumentiert.

### Bekannte Einschränkungen & Testdaten
1. Loading-, Fehler- und Leerezustände bleiben für E3-S2 reserviert; aktuell wird nur der erfolgreiche Kernfluss behandelt, Fehlermeldungen erscheinen als einfacher Statustext.
2. Die API-Antworten kommen aus der bestehenden Route `/api/query`; keine neuen Endpoints oder Secrets wurden eingeführt.

### Erwartete Failure Modes
1. `/api/query` ist nicht erreichbar oder liefert einen Fehlerstatus → UI zeigt die Fehlermeldung im Helper-Text, kann aber keine Antwort darstellen.
2. Query-Text leer lassen → es wird eine clientseitige Validierung ausgelöst und der Submit ist für diese Frage deaktiviert.

### Genaue Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts` Exit Code `0`.

## E3-S2 Loading-, Fehler- und Leerezustände
### Was ist fertig
1. `QueryPanel` liefert für Loading, Fehler und einen No-Reference-Fallback je einen individuellen Statustext plus klar benannte `Nächste Aktion`.
2. `QueryPanel` wechselt nach erfolgreichem API-Antwort-Zyklus automatisch in den Status `empty`, sobald keine Referenzkonzepte zurückkommen.
3. `QueryInput` zeigt den passenden `Nächste Aktion`-Hinweis unterhalb des Hilfetextes und hält den Submit-Button während des Ladens deaktiviert.

### Wie kann QA testen lokal inkl konkrete Startschritte
1. `pnpm --dir apps/web exec vitest run src/components/organisms/query-panel-status.test.ts` – validiert die Status-/Action-Zuordnung für Loading, Error und Empty.
2. Dev-Server starten (`pnpm --dir apps/web dev`), Browser öffnen und die Defaultfrage absenden; prüfe beim Absenden den Helper-Text sowie den `Nächste Aktion`-Hinweis während des Ladens.
3. API-Antwort simulieren (z. B. über Chrome DevTools → Network → Offline setzen oder `POST /api/query` blockieren): die Fehlermeldung im Helper-Text sollte angezeigt werden und die `Nächste Aktion` lautet „Fehler prüfen …“.
4. Empty-Zustand simulieren, indem die Anfrage im Browser oder über einen lokalen Proxy auf eine Response mit `references: []` umgeleitet wird; anschließend sollte der Helper-Text auf „keine Referenzkonzepte“ hinweisen und die `Nächste Aktion` zur präziseren Formulierung auffordern.

### Bekannte Einschränkungen & Testdaten
1. Empty-Antworten treten nur auf, wenn keine Referenzkonzepte gefunden werden; im normal frontenden Dataset ist das selten, daher ist die Umleitung der Response für den Test hilfreich.
2. Der Loading-Text erscheint nur während einer aktiven Fetch-Anfrage; ein kurzzeitiges Nachladeverhalten lässt sich z. B. mit „Slow 3G“+Throttling in DevTools visualisieren.

### Erwartete Failure Modes
1. Der `Nächste Aktion`-Hinweis fehlt oder ist nicht unterscheidbar zwischen Loading, Error und Empty → Story nicht erfüllt.
2. Error-Helpertext enthält mehr Details als die API-Nachricht und könnte sensitive Infos referenzieren.

### Genaue Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web exec vitest run src/components/organisms/query-panel-status.test.ts` Exit Code `0`.
