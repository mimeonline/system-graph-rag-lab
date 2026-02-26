# Dev Story Prompt Template

## Template
```text
RUN_MODE=review

Rolle: Dev
Story-ID: <STORY_ID>

Kontext:
- Epic: <EPIC_FILE>
- Story: <STORY_FILE>
- Scope: <SCOPE>
- Akzeptanzkriterien: <AC_LIST>
- Testfokus: <TEST_FOCUS>

Leitplanken:
- Keine Scope-Erweiterung
- Keine Architektur-Aenderung
- Nur erlaubte Dev-Schreibpfade

Aufgabe:
1. Pflicht-Inputs lesen.
2. Story auf `in_progress` setzen und `backlog/progress.md` sofort synchronisieren.
3. Scope minimal-invasiv umsetzen.
4. Lint, Tests und Build ausfuehren.
5. Story-Status auf `qa` oder `blocked` setzen und Progress synchronisieren.
6. Handoff und `docs/memory/dev.md` aktualisieren.
7. `docs/progress/dev/current.md` final auf `completed` oder `failed` setzen.

Outputformat:
1. Status
2. Geaenderte Dateien
3. Testergebnisse je Command
4. Offene Risiken
5. Blocker
6. Scope- und Architektur-Check
```

## Platzhalter
1. `<STORY_ID>` ist die Story-ID aus `backlog/stories`.
2. `<EPIC_FILE>` ist der Pfad der Epic-Datei.
3. `<STORY_FILE>` ist der Pfad der Story-Datei.
4. `<SCOPE>`, `<AC_LIST>` und `<TEST_FOCUS>` kommen direkt aus der Story.
