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

### Bugfix-Note
- Runtime-ReferenceError `nextAction is not defined` in `QueryInput` beendet, indem die Prop explizit destructed wird, sodass der `Nächste Aktion`-Hinweis nur mit vorhandenem Text rendert.
- Testkommando: `pnpm --dir apps/web exec vitest run src/components/organisms/query-panel-status.test.ts`

## E3-S3 Herleitungsdetails sichtbar machen
### Was ist fertig
1. `QueryPanel` bleibt bei den drei Hauptbereichen (Hauptantwort, Referenzen, Knapper P0-Kernnachweis) und ergänzt einen festen „Herleitungsdetails“-Block, der Kontextsummaries plus `sourceFile` listaartig zeigt.
2. `buildQueryViewModel` stellt das neue `derivationDetails`-Array bereit und nummeriert jeden Kontextblock zur klaren Nachvollziehbarkeit der Quellen.
3. Die zusätzlichen Details erweitern die Erklärung ohne weitere Interaktion; Hauptantwort, Referenzliste und P0-Kernnachweis bleiben durchgängig sichtbar.
### Wie kann QA testen lokal inkl konkrete Startschritte
1. `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts` – überprüft die Erzeugung von `derivationDetails` und den leeren Zustand ohne Referenzen.
2. Dev-Server starten (`pnpm --dir apps/web dev`), Defaultfrage absenden und sicherstellen:
   - Die „Herleitungsdetails“-Sektion erscheint unterhalb des Kernnachweises,
   - Jede Zeile zeigt nummeriertes Label, Summary und Quelle; es werden maximal drei Einträge dargestellt,
   - Hauptantwort, Referenzkonzepte und Knapper P0-Kernnachweis bleiben sichtbar, ohne zusätzliche Klicks.
3. Zweite Beispielanfrage absenden (z. B. „Wie beeinflussen Feedback Loops lokale Optimierungen?“) und prüfen, dass neue Kontexte ebenfalls unter Herleitungsdetails auftauchen.
### Genaue Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts` → Exit Code `0`, verifiziert die ViewModel-Erweiterung und die korrekte Limitierung auf drei Referenzen/Derivations.

## E4-S1 OpenAI Real Integration für Query API
### Was ist fertig
1. Die serverseitige Query-Pipeline ruft nun die OpenAI Chat Completions API via `fetch` auf und verwendet die bestehende Retrieval-Context-Pipeline als Prompt-Grundlage.
2. OpenAI-Antworten werden auf `main` und `coreRationale` normalisiert, Fehler vom Upstream werden contract-konform als `LLM_UPSTREAM_ERROR` oder `INTERNAL_ERROR` gemappt.
3. Tests mocken `fetch`, damit sowohl Erfolg als auch Fehler deterministisch reproduzierbar sind.

### Wie kann QA testen lokal inkl konkrete Startschritte
1. In `apps/web/.env.local` oder der Shell `OPENAI_MODEL` (z. B. `gpt-5-mini`) und `OPENAI_API_KEY` setzen; Schlüssel darf nicht in Logs oder Repo landen.
2. Optional: `pnpm --dir apps/web dev` starten und eine `POST http://localhost:3000/api/query` Anfrage absenden; die Antwort muss `status: "ok"` liefern, solange OpenAI-Reaktion erfolgreich ist.
3. Automatisiert: `pnpm --dir apps/web test -- src/app/api/query/route.test.ts` mit Exit Code `0`.

### Bekannte Einschränkungen & Testdaten
1. Der Live-Call erfordert Netzwerk und validen OpenAI-Key; ohne diesen liefert die API `INTERNAL_ERROR` oder `LLM_UPSTREAM_ERROR`.
2. Die Tests selbst simulieren OpenAI-Responses über `vitest`-Mocks; echte Call-Details bleiben geheim.

### Erwartete Failure Modes
1. Fehlender oder leerer `OPENAI_API_KEY` führt zu `500 INTERNAL_ERROR` und ist per Contract abgedeckt.
2. OpenAI meldet nicht-2xx → `502 LLM_UPSTREAM_ERROR` plus passende Fehlermeldung im Body.

### Genaue Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web test -- src/app/api/query/route.test.ts` Exit Code `0`.

### Bugfix-Note
- Non-2xx OpenAI-Antworten werden jetzt best-effort geparst; `error.message` enthält die upstream Message und `error.retryable` reflektiert 4xx (non-retryable) vs. 5xx/429 (retryable).
- Testkommando: `pnpm --dir apps/web test -- src/app/api/query/route.test.ts`.

## E4 Semantic Graph Retrieval via OpenAI Embeddings + Neo4j-Vektorindex
### Was ist fertig
1. Die Query-Pipeline erzeugt serverseitig ein Embedding (`OPENAI_EMBEDDINGS_MODEL`) und fragt den konfigurierten Neo4j-Vektorindex (`NEO4J_VECTOR_INDEX_NAME`) über `db.index.vector.queryNodes` an.
2. Top-K-Referenzen werden als `references` plus `context.elements` zurückgeliefert; optionale 1-Hop-Nachbarn erweitern den Kontext, ohne Duplikate oder Tokenbudget-Brüche zu produzieren.
3. Fehlt die Graph-Konfiguration oder ist der Vektorindex offline, fällt die Pipeline deterministisch auf den bisherigen Keyword-Index zurück; echte Graph-Ausfälle werden mit `GRAPH_BACKEND_UNAVAILABLE` gemappt.
4. Die Route-Tests (`src/app/api/query/route.test.ts`) decken Graph-Erfolg, Index-Offline, Fallback sowie das Error-Mapping ab, `src/features/query/retrieval.test.ts` bleibt für die Keyword-Alternative grün.

### Wie kann QA testen lokal inkl konkrete Startschritte
1. Neo4j plus Seed-Daten mit Embedded-Vektorindex bereithalten; die Runtime-Variablen in `apps/web/.env.local` setzen: `OPENAI_MODEL`, `OPENAI_API_KEY`, `OPENAI_EMBEDDINGS_MODEL`, `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`, `NEO4J_VECTOR_INDEX_NAME`.
2. Automatisiert: `pnpm --dir apps/web test -- src/app/api/query/route.test.ts`.
3. Optional: `pnpm --dir apps/web dev` starten und `POST /api/query` mit einer Frage senden; die Antwort sollte Graph-Referenzen plus Kontextsummaries enthalten.

### Bekannte Einschränkungen & Testdaten
1. Ohne die Graph-Env oder mit einem fehlenden Vektorindex bleibt die Antwort auf den Keyword-Fallback beschränkt; der Fehler erscheint nur als Log-Event, nicht in der Response.
2. Die 1-Hop-Erweiterung bleibt innerhalb des Tokenbudgets (1.400) und liefert nur zusätzliche Kontexte, wenn noch Budget frei ist.

### Neo4j Vector Index Setup
1. Die Runtime nutzt `node_embedding_index` als Default und aktiviert damit den Graph-Pfad auch dann, wenn `NEO4J_VECTOR_INDEX_NAME` in der Environment fehlt; der Index muss exakt wie im Seed-Dataset benannt sein, damit die Vektorabfragen Daten zurückliefern.
2. Beispiel-Cypher (Label/Property ggf. an eigene Seed-Daten anpassen):
```
CALL db.index.vector.createNodeIndex(
  "node_embedding_index",
  ["Concept"],
  ["embedding"],
  { dimensions: 384, similarity: "COSINE" }
);
```

### Erwartete Failure Modes
1. Neo4j ist unreachable → API antwortet mit `503 GRAPH_BACKEND_UNAVAILABLE`.
2. Vector-Index existiert nicht oder ist offline → die Pipeline fällt auf die Keyword-Retrieval-Alternative zurück, `status: "ok"` bleibt erhalten.

### Genaue Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web test -- src/app/api/query/route.test.ts` → Exit Code `0`.
2. `pnpm --dir apps/web test -- src/features/query/retrieval.test.ts` → Exit Code `0`.

## E3 ux-demo-clarity-and-tool-granularity
### Was ist fertig
1. Home-Template nutzt jetzt eine klar erkennbare Seitenstruktur mit Header, zentraler Inhaltsbühne und Footer analog UX-Mock.
2. Query-Ansicht ist als Panel A (Antwort) und Panel B (Kontext) aufgeteilt und bleibt auf Mobile einspaltig übersichtlich.
3. Eine neue Zone „Was bringt mir das jetzt?“ liefert konkrete nächste Schritte direkt aus dem View-Model.
4. Referenzkarten zeigen konkrete Toolnamen; grobe Labels wie „System Thinking Tools“, „Network Analysis“ und „Stocks and Flows“ werden auf konkrete Toollisten gemappt.

### Genaue Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web exec vitest run src/features/query/view-model.test.ts src/components/organisms/query-panel-status.test.ts` Exit Code `0`.

## E3 Frontend Nutzerfuehrung Startseite und Graph-Sichtbarkeit
### Was ist fertig
1. Die Startseite zeigt jetzt eine klare Erklaerung "So funktioniert GraphRAG" mit drei Schritten fuer Query, Graph-Kontext und Entscheidungsnutzen.
2. Das QueryPanel besitzt eine sichtbare, responsive Graph-Ansicht ohne neue externe UI-Abhaengigkeiten.
3. Die Graph-Ansicht nutzt vorhandene Query-Daten (`references`, `derivationDetails`) fuer Knoten/Kanten und zeigt ohne Query einen expliziten Fallback.
4. Die Ableitungslogik ist als separater Helper (`src/features/home/graph-view-model.ts`) mit Tests implementiert.

### Wie kann QA testen lokal inkl konkrete Startschritte
1. `pnpm --dir apps/web dev` starten und die Startseite laden.
2. Ohne Anfrage pruefen, dass die Graph-Ansicht sichtbar ist und den Fallback-Hinweis zeigt.
3. Eine Query absenden und pruefen, dass der Graph auf `query-basiert` wechselt und Referenzknoten aus der Antwort zeigt.
4. Mobile-Breite pruefen (z. B. DevTools iPhone-Viewport): Karten und Graph bleiben lesbar und ohne horizontalen Scroll-Zwang.

### Genaue Testkommandos mit erwarteten Ergebnissen
1. `pnpm --dir apps/web exec vitest run src/features/home/graph-view-model.test.ts src/features/query/view-model.test.ts` Exit Code `0`.
2. `pnpm --dir apps/web lint` Exit Code `0`.

## E3 Frontend Nutzerfuehrung Schnellfix Graph-Label-Overlap
### Was ist fertig
1. Node-Layer in  nutzt feste Hoehe  statt .
2. Node-Breite wurde von  auf  reduziert.
3. Scope blieb bei reinem UI-Layoutfix ohne neue Libraries.

### Wie kann QA testen
1. 
> web@0.1.0 dev /Users/michaelmeierhoff/Code/projects/system-graph-rag-lab/apps/web
> next dev

 ELIFECYCLE  Command failed with exit code -35. starten.
2. Fallback-Graph in der Home-Ansicht oeffnen.
3. Pruefen, dass Labels im Screenshot-Fall nicht mehr ueberlagert werden.

## E3 Frontend Nutzerfuehrung Schnellfix Graph-Label-Overlap
### Was ist fertig
1. Node-Layer in GraphPreview nutzt feste Hoehe h-[320px] statt h-full.
2. Node-Breite wurde von w-[150px] auf w-[128px] reduziert.
3. Scope blieb bei reinem UI-Layoutfix ohne neue Libraries.

### Wie kann QA testen
1. pnpm --dir apps/web dev starten.
2. Fallback-Graph in der Home-Ansicht oeffnen.
3. Pruefen, dass Labels im Screenshot-Fall nicht mehr ueberlagert werden.

## E3 Frontend Nutzerfuehrung Finaler UX-Fix obere Graph-Ueberdeckung
### Was ist fertig
1. `buildHomeGraphModel` positioniert den Query-Knoten tiefer (`y=20`) und verschiebt Referenzknoten nach unten, damit der obere Bereich mehr Luft zu Edge-Labels erhaelt.
2. `GraphPreview` rendert Kantenlinien und Kantenlabels getrennt, sodass Labels ueber den Nodes liegen und nicht mehr verdeckt werden.
3. Label-Positionen erhalten einen normalisierten Seiten-Offset plus vertikalen Push im oberen Bereich.
4. `src/features/home/graph-view-model.test.ts` wurde um Positions-Assertions erweitert.

### Wie kann QA testen lokal inkl konkrete Startschritte
1. `pnpm --dir apps/web dev` starten und die Home-Ansicht oeffnen.
2. Ohne Query den Fallback-Graph pruefen: oberer Knoten und `retrieval`/`ranking` Labels muessen sichtbar getrennt sein.
3. Mit Query-Daten pruefen: Labels liegen nicht unter den Knoten, besonders im oberen Drittel.
4. Mobile Viewport (z. B. 390x844) und Desktop Viewport (z. B. 1440x900) gegenpruefen.

### Genaue Testkommandos mit erwarteten Ergebnissen
1. `cd apps/web && pnpm exec vitest run src/features/home/graph-view-model.test.ts` sollte Exit Code `0` liefern.
2. Im aktuellen Dev-Run konnte der Test lokal nicht abgeschlossen werden wegen `fork: Resource temporarily unavailable` mit anschliessender `vitest`-Module-Resolution-Stoerung; QA bitte in stabiler Umgebung erneut ausfuehren.
