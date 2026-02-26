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
