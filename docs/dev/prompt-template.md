# Dev Story Prompt Template

## Vorlage
```text
RUN_MODE=review

Rolle: Dev
Story-ID: <STORY_ID>

Kontext:
- Epic-Referenz: <EPIC_MD_PFAD>
- Story-Referenz: <STORY_MD_PFAD>
- Scope, Akzeptanzkriterien und Testfokus direkt aus der Story-Datei übernehmen.

Leitplanken:
- Keine Scope-Erweiterung.
- Keine Architekturänderung.
- Nur erlaubte Schreibpfade für Dev.
- Bestehende Konventionen, Contracts und ADRs einhalten.

Aufgabe:
1. Lies alle relevanten Pflicht-Inputs für die Story.
2. Setze als ersten operativen Schritt den Story-Status auf `in_progress` und synchronisiere sofort `backlog/progress.md`.
3. Implementiere minimal-invasiv nur den Story-Scope.
4. Führe Lint, Tests und Build aus, soweit im Projekt verfügbar.
5. Aktualisiere Story-Datei und Backlog-Fortschritt gemäß Workflow.
6. Wenn die Story die erste aktive Story ihres Epics ist, setze das Epic im selben Run auf `in_progress` und synchronisiere `backlog/progress.md`.
7. Erzeuge oder aktualisiere das Dev-Handoff und die Dev-Memory-Datei.

Outputformat:
1. Status
2. Geänderte Dateien
3. Testergebnisse mit Command-Übersicht
4. Offene Risiken
5. Blocker
6. Bestätigung zu Scope und Architekturkonformität
```

## Platzhalterhilfe
1. `<STORY_ID>`: eindeutige Story-Referenz aus `backlog/stories`.
2. `<EPIC_MD_PFAD>`: Pfad zur Epic-Datei unter `backlog/epics/*.md`.
3. `<STORY_MD_PFAD>`: Pfad zur Story-Datei unter `backlog/stories/*.md`.
4. Scope, Akzeptanzkriterien und Testfokus werden nicht doppelt im Prompt gepflegt, sondern aus der Story referenziert.
