# Security Report

## Epic E1 Wissensmodell und Seed-Daten

### Summary
1. Critical: 0
2. High: 0
3. Medium: 0
4. Low: 0
5. Offene Findings gesamt: 0
6. Mitigated Findings gesamt: 2

### Top 5 Risiken
1. Der lokale Seed-Reset bleibt fuer Seed-IDs absichtlich destruktiv und erfordert weiterhin operatives Opt-In.
2. Bei ID-Kollisionen zwischen lokalen Arbeitsdaten und Seed-IDs kann es weiterhin zu lokalem Datenverlust kommen.
3. Public Abuse-Haertung wie produktive Rate-Limit- und Header-Gates liegt ausserhalb E1 und bleibt in E4 zu validieren.
4. Security-Hygiene bleibt von sauberem Env-Handling im lokalen Setup abhaengig.
5. Ein vollstaendiger Dependency-Vulnerability-Scan wurde in diesem Recheck nicht ausgefuehrt.

### Findings Referenzen
1. `docs/security/finding-e1-local-reset-missing-runtime-guard.md` Status `Mitigated`
2. `docs/security/finding-e1-local-reset-overbroad-delete-scope.md` Status `Mitigated`

### Empfehlungen priorisiert
1. P0: Keine weiteren E1-Blocker offen, Epic-Gate kann auf Pass gesetzt werden.
2. P1: Zusaetzlichen Integrations-Negativtest fuer Nicht-Seed-Erhalt bei lokalem Reset ergaenzen.
3. P1: In Betriebsdoku klar halten, dass Reset nur fuer lokale Maintenance und nur mit explizitem Opt-In vorgesehen ist.
4. P2: E4-Run fuer Public Rate-Limit, Security-Header, CORS und Abuse-Schutz strikt gate'n.
5. P2: Regelmaessigen Dependency-Security-Scan in den Qualitaetsablauf aufnehmen.

### Recheck Ablauf
1. Zweck: Verifizieren, dass beide dokumentierten E1-Findings im aktuellen Stand nicht mehr reproduzierbar sind.
2. Input: Aktuelle Implementierung `apps/web/src/features/seed-data/local-seed-reset.ts`, Testsuite `local-seed-reset.test.ts`, Commits `7316aaa` und `e101878`.
3. Output: Finding-Status je Artefakt auf `Mitigated` oder `Open` plus aktualisierter Epic-Gate-Entscheid.
4. Fehlerfall: Wenn non-local URI den Reset weiterhin ausfuehren kann oder Delete-Scope wieder label-basiert ist, muss der Status auf `Open` bleiben und Gate auf `Fail`.
5. Beispiel: Testlauf `pnpm --dir apps/web exec vitest run src/features/seed-data/local-seed-reset.test.ts` ergibt `5 passed | 1 skipped` und bestaetigt Guard- und Scope-Mitigation.

### Limitations des Reviews
1. Kein Live-Exploit gegen echte nicht-lokale Datenbank ausgefuehrt, um unbeabsichtigte Datenaenderungen zu vermeiden.
2. Kein DAST-Lauf gegen Public Deployment, da Epic-Gate E1 lokal fokussiert ist.
3. Kein vollstaendiger Dependency-Vulnerability-Scan in diesem Run ausgefuehrt.
4. Keine fehlenden Pflicht-Inputs fuer diesen Review-Run.

### Epic Gate Scope
1. Epic: `backlog/epics/e1-wissensmodell-seed-daten.md`
2. Abgedeckte Stories:
3. `backlog/stories/e1-s1-ontologie-fachlich-definieren.md`
4. `backlog/stories/e1-s2-seed-datenbasis-erzeugen.md`
5. `backlog/stories/e1-s3-datenbasis-verfuegbar-machen.md`
6. `backlog/stories/e1-s4-qualitaetspruefung-seed-daten.md`
7. `backlog/stories/e1-s5-quellen-extraktion-normalisierung.md`
8. `backlog/stories/e1-s6-neo4j-lokal-seed-reset.md`

### Gate Decision fuer Epic
1. Pass.
2. Begruendung: Beide E1-Findings sind im Recheck nicht mehr reproduzierbar und auf `Mitigated` gesetzt; keine offenen Critical oder High Blocker im E1-Scope.

## Epic E2 Retrieval und Antwortpipeline

### Summary
1. Critical: 0
2. High: 0
3. Medium: 0
4. Low: 0
5. Offene Findings gesamt: 0
6. Mitigated Findings gesamt: 0

### Top Risiken
1. Die Antwortpipeline interpoliert den vom User gestellten `query`-String direkt in `answer.main` und `answer.coreRationale`; Consumer muessen diese Werte als Text behandeln, da sonst ein reflektiertes XSS-Szenario moeglich bleibt.
2. Der `Hinweis: Unter den ersten drei Referenzen ...`-Fallback offenbart die statischen Expectation-IDs aus `apps/web/src/features/query/reference-expectations.ts`; neue Eintraege muessen daher kuratiert bleiben, um keine sensiblen Graph-IDs oder Kontexte ungewollt preiszugeben.
3. `buildStructuredAnswer` begrenzt Referenzen und Kontext auf Kuratiertes aus lokalen Seeds; jede Aenderung am Retrieval-Pfad sollte sicherstellen, dass neue Daten weiterhin ausschließlich aus dieser kontrollierten Quelle stammen.
4. Die Runtime-Rate-Limit-Metadaten werden lediglich als Information herausgegeben; ohne die noch ausstehende E4-Rate-Limit-Implementierung bleibt das Endpoint-niveau potentiell abuse-anfällig.
5. Das Query-Handling fuehrt keine zusätzlichen Authentifizierungs- oder Abuse-Checks durch; jede kontaktiere Laufzeit muss sauberes Logging und Monitoring sicherstellen, damit Missbrauchsversuche zeitnah sichtbar werden.

### Findings Referenzen
1. Keine offenen Findings fuer E2.

### Empfehlungen priorisiert
1. P1: In der Public-Response dokumentieren und ggf. automatisieren, dass `answer.*`-Felder als Text gerendert werden (z.B. `textContent` statt `innerHTML`), um XSS aus dem interpolierten Query zu verhindern.
2. P1: Expectation-IDs nur in der vorliegenden statischen Liste pflegen und bei Erweiterungen prüfen, dass sie keine operationskritischen Graph-IDs enthalten.
3. P2: Neue Retrievaldaten nur dann zulassen, wenn ein Threat-Model-Review sicherstellt, dass sie aus kuratierten Seeds stammen.

### Recheck Ablauf
1. Zweck: Als Security-Review das neue E2-Response-Mapping gegen die Agenten-Instruktionen und Open-Risk-Hinweise validieren.
2. Input: `backlog/epics/e2-retrieval-antwortpipeline.md`, `docs/handoff/dev-to-security.md`, `apps/web/src/features/query/handler.ts`, `apps/web/src/features/query/answer.ts`, `apps/web/src/features/query/reference-expectations.ts`, `docs/spec/api.md`, `docs/spec/api.openapi.yaml`.
3. Output: Keine Findings, Gate-Verdict `Pass` mit begruendetem Risikokontext.
4. Fehlerfall: Wenn Referenzen oder Kontext wiederholt sensitive Daten enthalten oder neue Endpoints ohne Review aufgehen, muss Gate auf `Fail`.
5. Beispiel: `pnpm --dir apps/web exec vitest run src/features/query/answer.test.ts` fuehrt positive und negative Expectation-Matching-Szenarien aus.

### Limitations des Reviews
1. Keine Frontend-Rendering-Pruefung der `answer`-Felder im E2-UI-Stack erfolgt.
2. Kein Live-Load- oder Abuse-Testing gegen das `/api/query`-Endpoint innerhalb dieses Reviews.
3. Der erwartete Public-Hardening-Fokus (Rate-Limit, API-Key-Schutz) wird in E4 weiter verfolgt.

### Epic Gate Scope
1. Epic: `backlog/epics/e2-retrieval-antwortpipeline.md`
2. Abgedeckte Stories:
3. `backlog/stories/e2-s1-kontextkandidaten-bereitstellen.md`
4. `backlog/stories/e2-s2-kontext-konsistent-erweitern.md`
5. `backlog/stories/e2-s3-antwort-aus-kontext-erzeugen.md`
6. `backlog/stories/e2-s4-referenzkonzepte-absichern.md`

### Gate Decision fuer Epic
1. Pass.
2. Begruendung: Alle E2-Stories wurden accepted, der Response-Flow verwendet nur lokale Seeds, Reference-Limits und statische Expectation-Lists, es gibt keine neuen Endpoints oder Secrets und keine offenen Findings.

## Epic E3 MVP-Frontend und Nutzerführung

### Summary
1. Critical: 0
2. High: 0
3. Medium: 0
4. Low: 0
5. Offene Findings gesamt: 0
6. Mitigated Findings gesamt: 0

### Top Risiken
1. `answer.main`, `answer.coreRationale` und die neuen `derivationDetails` liefern unveränderte Backend-Daten; sie dürfen nur mit Text-Rendering (`textContent`) angezeigt werden, um reflektiertes XSS aus dem Query-String zu verhindern – der QueryPanel-Code respektiert das bereits.
2. Die `sourceFile`-Angaben stammen aus kuratierten Seed-Daten; bei künftigen Quellenanpassungen muss sichergestellt werden, dass keine sensiblen oder internen Pfade publik gemacht werden.
3. `/api/query` bleibt ohne zusätzliche Authentifizierung oder Rate-Limits; Abuse- und Monitoring-Hardening steht weiterhin als E4-Run auf der Agenda.

### Recheck Ablauf
1. Scope: Der QueryFlow nutzt weiterhin ausschließlich `POST /api/query`; keine neuen Endpoints oder Secrets wurden eingeführt (Code: `apps/web/src/components/organisms/query-panel.tsx` und `apps/web/src/features/query/view-model.ts`).
2. `buildQueryViewModel` erzeugt `derivationDetails` rein aus `context.elements` und gibt den Titel, Summary und `sourceFile` als Text aus (die Seriennummern sind auf drei Items limitiert – gedeckt durch `view-model.test.ts`).
3. QA-Verifikation (`docs/qa/verdict.md`) dokumentiert manuelle Abnahme der Herleitungsdetails und Referenzen nach dem E3-S3-Run.
4. Ziel ist, dass `derivationDetails` keine Benutzer- oder Hochrisiko-Metadaten übermittelt und dass die Anzeige strikt textbasiert bleibt.

### Limitations des Reviews
1. Kein Security-Run gegen den laufenden Dev-Server; die UI-Abnahme erfolgt über die QA-Dokumentation.
2. Keine dynamischen Penetrationstests gegen `/api/query`; Hardening bleibt E4.

### Epic Gate Scope
1. Epic: `backlog/epics/e3-frontend-nutzerfuehrung.md`
2. Abgedeckte Stories:
3. `backlog/stories/e3-s1-query-und-antwortansicht.md`
4. `backlog/stories/e3-s2-loading-fehler-leere-zustaende.md`
5. `backlog/stories/e3-s3-herleitungsdetails-sichtbar-machen.md`

### Gate Decision fuer Epic
1. Pass.
2. Begruendung: Die neuen E3-Features arbeiten mit den bestehenden `/api/query`-Antwortdaten; `derivationDetails` zeigt nur kuratierte Kontexte/Quellen und die Anzeige erfolgt textbasiert, es gibt keine zusätzlichen Secrets oder Endpoints und keine offenen Findings.
