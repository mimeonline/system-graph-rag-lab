# Dev to Security Handoff

## E1-S6 Neo4j lokal Seed Reset und Reseed (Bug-0003)
### Security Context
1. Scope dieses Runs ist rein dokumentativ fuer Story `E1-S6` und Bug `bug-0003`.
2. Der Security-relevante Seed-Reset-Flow bleibt unveraendert: local-only URI-Guard plus `ALLOW_DESTRUCTIVE_SEED_RESET=true` Opt-In.
3. Es wurden keine Architektur-, API- oder Retrieval-Contracts geaendert.

### Sicherheitsrelevante Eingaben und Endpoints
1. Sicherheitsrelevante Eingaben: `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`, `ALLOW_DESTRUCTIVE_SEED_RESET`.
2. Sicherheitsrelevanter Endpoint ist `POST /api/query` im bestehenden Contract-Kontext.
3. Local Maintenance-Command `seed:local:reset-reseed` bleibt destruktiv, aber auf lokale Runtime plus explizites Opt-In begrenzt.

### Bekannte Sicherheitsgrenzen und Risiken
1. Der Integrations-Test in `local-seed-reset.test.ts` bleibt ohne vollstaendige Neo4j-Umgebung `skipped`.
2. Es gibt weiterhin keinen automatisierten Security-Recheck-Job fuer destruktive lokale Maintenance-Commands.
3. Das Bugfix-Delta aendert kein Laufzeitverhalten und reduziert nur Fehlinterpretation der Test-Evidenz.

### Gezielte Security-Pruefpunkte
1. Doku/Runbooks zeigen weiterhin das Scope-Kommando `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts`.
2. Local-only Guard plus Opt-In bleiben im Seed-Reset-Code aktiv.
3. Keine nicht-lokalen destruktiven Pfade ergaenzt.
4. Keine Secrets in Story, Handoffs oder Logs neu eingefuehrt.

## E2-S1 Kontextkandidaten pro Frage bereitstellen
### Security Context
1. Die deterministische Kontextkandidaten-Berechnung nutzt nur lokal verifizierte Seed-Daten; keine externen Aufrufe oder Secrets.
2. API-Response bleibt im bestehenden Contract (nur zusätzliche `references` und Meta-Infos).
3. Keine neue Laufzeitkonfiguration; bestehende `OPENAI_*` und `NEO4J_*` Umgebungen werden weiter genutzt.

### Sicherheitsrelevante Eingaben und Endpoints
1. Endpoint `POST /api/query` bleibt einzige Sicherheitsberuehrung.
2. Keine neuen Secrets oder Laufzeitparameter eingefuehrt.

### Bekannte Sicherheitsgrenzen und Risiken
1. Kontextkandidaten basieren auf statischen Seeds, daher keine dynamischen Nachverarbeitungs-Calls vulnerable.
2. Lokale Seed-Daten sind gegen Duplikate und Budget-Guards getestet.

### Gezielte Security-Pruefpunkte
1. Verifizieren, dass `buildContextCandidates` ausschließlich lokale, in-code Seed-Daten nutzt.
2. Meta-Felder enthalten keine vertraulichen Informationen (nur counts und tokens).
3. Keine neuen Side-Effects oder Netzwerk-Calls ergaenzt worden.

## E2-S2 Kontext für Antwort konsistent erweitern
### Security Context
1. Das neue `context.elements` Paket bleibt innerhalb des Retrieval-Scopes und liefert ausschließlich lokal kuratierte Seed-Informationen.
2. Jeder Kontext enthält eine zitierfähige Quelle inklusive `sourceId`, damit keine dynamischen Datenverlinkungen entstehen.

### Sicherheitsrelevante Eingaben und Endpoints
1. Der Endpoint bleibt `POST /api/query`; nur die API-Response wurde erweitert.
2. Es werden weiterhin keine neuen Secrets oder Umgebungsvariablen benötigt.

### Bekannte Sicherheitsgrenzen und Risiken
1. Kontextzusammenfassungen bleiben lokal generiert, enthalten keine Nutzereingaben oder sensitive Daten.
2. Trunkierte Summaries verwenden weiterhin dieselben Seed-Metadaten; keine neuen externen Aufrufe nötig.

### Gezielte Security-Pruefpunkte
1. Verifizieren, dass `context.elements` keine doppelten `nodeId`s enthält und den Catalog-Quellen entspricht.
2. Prüfen, dass `context.elements[].source.publicReference` keine URLs/ISBNs enthält, die nicht kuratiert sind.

## E2-S3 Antwort aus strukturiertem Kontext erzeugen
### Security Context
1. Die Antwort wird ausschließlich aus den lokalen `references` und `context.elements` der Retrieval-Pipeline gebildet; es gibt keine zusätzlichen Netzwerkaufrufe oder Secrets.
2. Die zusätzliche Strukturierung nutzt keine neuen Environment-Variablen; sie bleibt innerhalb der bestehenden `OPENAI_*`-Konfiguration.
3. Der Fallbackpfad für fehlende Referenzen liefert eine klare Mitteilung, ohne weitere Kontextdaten zu persistieren.

### Sicherheitsrelevante Eingaben und Endpoints
1. `POST /api/query` bleibt der einzige Sicherheitskontaktpunkt.
2. Es wurden keine neuen Parameter oder Flags eingeführt.

### Bekannte Sicherheitsgrenzen und Risiken
1. Die Limitierung auf maximal drei Referenzen begrenzt die Sichtbarkeit potenziell sensibler Metadaten.
2. Context Summaries stammen weiter ausschließlich aus Kuratierungsdaten; keine User-Input-Felder werden direkt wiedergegeben.

### Gezielte Security-Pruefpunkte
1. Sicherstellen, dass die Antwort maximal drei Referenzen enthält und `context.elements` exakt mit diesen Referenzen übereinstimmt.
2. Prüfen, dass im No-Reference-Fallback keine zusätzlichen Datenquellen eingeblendet werden.

## E2-S4 Referenzkonzepte in Ausgabe absichern
### Security Context
1. Das neue Expectation-Matching nutzt ausschließlich statische Referenz-IDs aus `evals/rubric.md` (Q1–Q5); es werden keine Secrets oder Netzwerkaufrufe benötigt.
2. Der Fallback (`Hinweis: Unter den ersten drei Referenzen ...`) bleibt innerhalb von `answer.coreRationale` und liefert keine zusätzlichen Kontextdetails.
3. Es wurden keine neuen Environment- oder Config-Parameter eingeführt.

### Sicherheitsrelevante Eingaben und Endpoints
1. Der einzige Security-Kontaktpunkt bleibt `POST /api/query`.
2. Die Query bleibt das einzige Input-Feld; die Expectation-Logik verarbeitet nur die referenzierten Texte ohne weitere Parameter.
3. Im Fallback werden nur lokale Referenz-IDs genannt, keine Nutzerdaten.

### Bekannte Sicherheitsgrenzen und Risiken
1. Die Expectation-Liste ist statisch und kann nicht zur Codeinjektion missbraucht werden.
2. Fallback-Hinweise werden nur ausgegeben, wenn Referenzen fehlen; es gibt kein zusätzliches Logging oder State-Persistence.

### Gezielte Security-Prüfpunkte
1. Verifizieren, dass der `Hinweis`-Fallback weder private noch dynamische Daten enthält (nur Referenz-IDs).
2. Sicherstellen, dass keine neuen Endpoints/Flags eingeführt wurden und die Antwort nur lokale Daten verwendet.

## E3-S1 Query-Eingabe und Antwortansicht bereitstellen
### Security Context
1. Das Frontend nimmt eine Frage entgegen und kommuniziert ausschließlich mit dem bestehenden Endpoint `POST /api/query`.
2. Es werden weder neue Secrets noch zusätzliche Runtime-Konfigurationen benötigt; alle UI-Daten bleiben im Browser und werden nicht persistiert.
3. Die Story behandelt nur den erfolgreichen Kernfluss; komplexere Fehlerzustände folgen in E3-S2, daher gibt es keine neuen Exfiltrationspfade.

### Sicherheitsrelevante Eingaben und Endpoints
1. Sicherheitsrelevantes Input-Feld: die Query-Freitextbox auf der Startseite.
2. Sicherheitsrelevanter Endpoint bleibt ausschließlich `POST /api/query`; kein weiteres Backend oder Service wurde ergänzt.

### Bekannte Sicherheitsgrenzen und Risiken
1. Nutzerfragetexte werden in Klartext an `/api/query` gesendet; es gibt keine zusätzliche Verschlüsselung auf Anwendungsebene.
2. Fehler- und Loading-Zustände sind noch nicht Story-relevant; das Frontend zeigt lediglich Statushilfetexte ohne zusätzliche Logging-Mechanismen.

### Gezielte Security-Prüfpunkte
1. Sicherstellen, dass keine neuen Endpoints aufgerufen und keine Secrets im Client-Code geloggt werden.
2. Validitätsprüfung besteht darin, zwei Beispielanfragen aus Sicht eines Reviewers zu senden und in DevTools zu prüfen, dass nur `query` übergeben wird.

## E3-S2 Loading-, Fehler- und Leerezustände
### Security Context
1. Die neuen Statushilfetexte und `Nächste Aktion`-Hinweise bleiben vollständig im Frontend und enthalten keine persistenten Daten.
2. Der Error-Status präsentiert nur die API-Fehlermeldung oder eine generische Hilfestellung; es findet keine Verarbeitung sensibler Backend-Details statt.
3. Der Empty-Status gibt lediglich Hinweis-Text zum Nutzerverhalten; es werden keine zusätzlichen Kontextdaten exfiltriert.

### Sicherheitsrelevante Eingaben und Endpoints
1. Das einzige Input-Feld bleibt weiterhin die Query-Freitextbox; keine neuen Formulare oder Parameter wurden ergänzt.
2. Der einzige Kommunikationskanal ist `POST /api/query`; es wurden keine neuen Endpunkte, Webhooks oder WebSocket-Verbindungen aufgebaut.

### Bekannte Sicherheitsgrenzen und Risiken
1. Der Error-State zeigt die unveränderte API-Nachricht; die Story vermeidet dabei zusätzliche Logweitergabe oder Persistenz im Browser.
2. Loading-, Error- und Empty-Texte befinden sich im Helper-Panel und werden nicht geloggt oder ausgespielt; sie sind render-only.

### Gezielte Security-Prüfpunkte
1. Nachstellen eines Backend-Fehlers und validieren, dass der Helpertext nur die API-Nachricht und den vordefinierten „Nächste Aktion“-Hinweis anzeigt.
2. Empty-State simulieren (z. B. lokale Proxy/Mock-Response mit `references: []`) und sicherstellen, dass die Nachricht keine zusätzlichen Referenzdaten enthält.

## DevOps Gate Kontext zu E2
1. Observability-Signale (`referenceCount`, `contextCandidateCount`, `referenceFallbackUsed`) sind in Logs und API-Responses nachweisbar.
2. Guardrails sorgen fuer deterministische Referenzlisten und validierte Rate-Limit-Verhalten, auch wenn keine Referenzen veröffentlicht werden.
3. Security- und DevOps-Gates haben jeweils `Pass` fuer E2 dokumentiert, es existieren keine neuen Blocker.
