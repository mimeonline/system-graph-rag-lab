# PM Story Acceptance Prompt Template

## Vorlage
```text
spawn_agent agent_type=pm

RUN_MODE=review

Rolle: PM
Story-ID: <STORY_ID>
Epic-ID: <EPIC_ID>

Kontext:
- Epic-Referenz: <PFAD_ZU_EPIC_MD>
- Story-Referenz: <PFAD_ZU_STORY_MD>
- QA-Verdict: docs/qa/verdict.md
- QA Epic-Verdict: docs/qa/verdict-epic.md
- Progress-Referenz: backlog/progress.md
- Status-Workflow: todo -> in_progress -> qa -> pass -> accepted -> blocked

Live Progress Pflicht:
1. Schreibe sofort zu Run-Beginn in docs/progress/pm/current.md mit:
   - Status: running
   - Current Step
   - Current File
   - Next Step
   - Time (ISO-8601)
2. Aktualisiere docs/progress/pm/current.md bei jedem Phasenwechsel.
3. Ueberschreibe die Datei vollstaendig bei jedem Update.
4. Am Ende setze Status auf completed oder failed und hinterlasse den finalen Stand.

Leitplanken:
- Keine Implementierung, keine Architektur- oder Scope-Aenderung.
- Nur PM-erlaubte Schreibpfade laut .codex/agents/pm.toml.
- PM setzt kein `pass`.
- `accepted` nur setzen, wenn die Story bereits auf `pass` steht.

Aufgabe:
1. Lies alle relevanten Pflicht-Inputs fuer diese Story.
2. Pruefe QA-Ergebnis und offene Risiken fuer die Story.
3. Triff PM-Abnahmeentscheidung.
4. Bei finaler PM-Freigabe:
   - setze Story-Status auf `accepted`
   - synchronisiere `backlog/progress.md` im selben Run
5. Bei Nicht-Freigabe:
   - setze Story nicht auf `accepted`
   - dokumentiere klare Gruende und naechste Schritte.
7. Aktualisiere PM-Memory und PM-Handoff falls betroffen.

Outputformat:
1. Status
2. Geaenderte Dateien
3. PM-Abnahmeentscheidung pass oder accepted oder nicht accepted
4. Begruendung mit Verweis auf QA-Evidenz
5. Offene Risiken
6. Self-Check gemaess pm.toml
```

## Platzhalterhilfe
1. `<STORY_ID>`: Story-Referenz aus `backlog/stories`.
2. `<EPIC_ID>`: Zugehoerige Epic-Referenz aus `backlog/epics`.
3. `<PFAD_ZU_EPIC_MD>`: Pfad zur Epic-Datei unter `backlog/epics/*.md`.
4. `<PFAD_ZU_STORY_MD>`: Pfad zur Story-Datei unter `backlog/stories/*.md`.
