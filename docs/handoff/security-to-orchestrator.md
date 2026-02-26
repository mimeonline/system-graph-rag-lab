# Security to Orchestrator Handoff

## Epic E1: Wissensmodell und Seed-Daten

### Gesamtverdikt
1. Pass

### Epic Gate
1. Pass

### Blocker vorhanden
1. Nein

### Top Findings
1. `finding-e1-local-reset-missing-runtime-guard.md` ist mitigiert, non-local URI wird vor Driver-Init geblockt.
2. `finding-e1-local-reset-overbroad-delete-scope.md` ist mitigiert, Delete-Scope ist auf `seedNodeIds` begrenzt.
3. Residualrisiko bleibt: lokaler Reset ist fuer Seed-IDs destruktiv und verlangt weiter diszipliniertes Opt-In.

### Betroffene Stories und Epic-ID
1. Epic-ID: E1
2. Story: `backlog/stories/e1-s6-neo4j-lokal-seed-reset.md`

### Naechste Schritte fuer Dev
1. Optionalen Integrations-Negativtest fuer Erhalt eines Nicht-Seed-Knotens im Reset-Lauf ergaenzen.
2. Guard- und Scope-Tests als verpflichtende Regressionstests fuer kuenftige Refactors beibehalten.

### Naechste Schritte fuer DevOps
1. E4-Gate fuer Public Rate-Limit und Security-Header vor Demo oder Release strikt absichern.
2. Sicherstellen, dass destruktive Seed-Commands nicht in nicht-lokalen Betriebsjobs aufgerufen werden.

### Naechste Schritte fuer Architect
1. Residualrisiko von ID-Kollisionen bei lokalen Maintenance-Resets im Betriebskontext als akzeptierte Restrisiko-Notiz fuehren.
2. E4-Sicherheitsanforderungen fuer Public Runtime weiter kontraktbasiert absichern.

## Epic E2: Retrieval und Antwortpipeline

### Gesamtverdikt
1. Pass

### Epic Gate
1. Pass

### Blocker vorhanden
1. Nein

### Top Risiken
1. `answer.main` und `answer.coreRationale` werden direkt mit dem User-Query interpoliert; Rendering-Seiten muessen weiterhin `textContent` nutzen, um reflektiertes XSS zu verhindern.
2. Der `Hinweis: Unter den ersten drei Referenzen ...`-Fallback gibt statische Expectation-IDs preis; neue Eintraege muessen kuratiert bleiben und sensible Graph-Kontexte vermeiden.
3. Die Endpoint-Metadaten enthalten noch keine Abuse-Schutz-Maßnahmen; E4 muss Rate-Limit, API-Key- und Abuse-Checks nachreichen.

### Betroffene Stories und Epic-ID
1. Epic-ID: E2
2. Stories: `backlog/stories/e2-s1-kontextkandidaten-bereitstellen.md`, `backlog/stories/e2-s2-kontext-konsistent-erweitern.md`, `backlog/stories/e2-s3-antwort-aus-kontext-erzeugen.md`, `backlog/stories/e2-s4-referenzkonzepte-absichern.md`

### Naechste Schritte fuer Dev
1. Bei neuen Fragen/Logiken sicherstellen, dass nur lokale Seed-Daten genutzt werden und keine neuen Secrets eingebracht werden.
2. Neue Expectation-IDs vor Release gegen den Threat-Model-Review auf sensitive oder security-kritische Graph-IDs pruefen.

### Naechste Schritte fuer DevOps
1. Den Public-Endpoint `/api/query` im E4-Run mit Rate-Limit, API-Key-Schutz und Abuse-Monitoring weiter absichern.
2. Monitoring aufbauen, um Missbrauch der Query-Route und unautorisierte Bot/Script-Zugriffe zu erkennen.

### Naechste Schritte fuer Architect
1. Threat-Model-Reviews dokumentieren, sobald neue Retrieval-Datenquellen oder Referenzlisten hinzukommen.
2. Epics parallel zu E2 in E4 fortfuehren, um die Public-Runtime-Hardening-Verpflichtungen zu erfuellen.

## Epic E3: MVP-Frontend und Nutzerführung

### Gesamtverdikt
1. Pass

### Epic Gate
1. Pass

### Blocker vorhanden
1. Nein

### Top Risiken
1. Der QueryPanel-Flow interpoliert weiterhin das User-Query in `answer.main`, `coreRationale` und `derivationDetails`; das Rendering muss, wie im aktuellen Code verankert, rein textbasiert bleiben (`textContent`) und darf nicht zu `innerHTML`-basierter Anzeige wechseln.
2. `derivationDetails` zeigt `sourceFile` und `summary` aus `context.elements`; bei Erweiterung der Seed-Daten ist darauf zu achten, dass keine empfindlichen Pfade oder internen Daten freigegeben werden.
3. `/api/query` bleibt ohne zusätzliche Auth/Rate-Limit; die Belastung und Abuse-Monitoring-Hardening ist weiterhin für E4 vorgesehen.

### Betroffene Stories und Epic-ID
1. Epic-ID: E3
2. Stories: `backlog/stories/e3-s1-query-und-antwortansicht.md`, `backlog/stories/e3-s2-loading-fehler-leere-zustaende.md`, `backlog/stories/e3-s3-herleitungsdetails-sichtbar-machen.md`

### Naechste Schritte fuer Dev
1. Jede Änderung an `buildQueryViewModel` oder der neuen Herleitungsdetails-Sektion nach Security-Prinzipien evaluieren, insbesondere ob neue Felder der API den Clients mehr als nur beschriebene Textdaten liefern.
2. Bei Änderungen am `context.elements`-Modell sicherstellen, dass `summary` und `sourceFile` weiterhin kuratierte, nicht sensitive Informationen enthalten.

### Naechste Schritte fuer DevOps
1. `/api/query` bei E4 weiterhin mit Abuse-Detection, Rate-Limits und API-Key-Hardening absichern, da keine neuen Endpoints oder Authentifizierungen in E3 eingezogen wurden.
2. Monitoring etablieren, damit auffällige Query-Muster oder plötzlich steigende Antwortzeiten früh erkannt werden.

### Naechste Schritte fuer Architect
1. Die neuen Herleitungsdetails als Teil des UI-Flow dokumentieren, inklusive der Annahme, dass nur Seed-basierte Kontextdaten angezeigt werden.
2. Bei künftigen Source-File-Erweiterungen prüfen, dass die gezeigten Namen nicht auf interne Infrastruktur oder vertrauliche Pfade schließen lassen.
