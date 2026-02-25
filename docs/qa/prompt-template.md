# QA Story Prompt Template

## Vorlage
```text
spawn_agent agent_type=qa

RUN_MODE=review

Rolle: QA
Story-ID: <STORY_ID>
Epic-ID: <EPIC_ID>

Kontext:
- Epic-Referenz: <PFAD_ZU_EPIC_MD>
- Story-Referenz: <PFAD_ZU_STORY_MD>
- Dev-Handoff: docs/handoff/dev-to-qa.md
- Scope, Akzeptanzkriterien und Test Notes direkt aus der Story-Datei übernehmen.
- Status-Workflow: todo -> in_progress -> qa -> pass -> accepted -> blocked

Leitplanken:
- Keine Implementierung, nur Prüfung.
- Keine Scope- oder Architekturänderung.
- Nur erlaubte QA-Schreibpfade laut .codex/agents/qa.toml.

Aufgabe:
1. Lies alle relevanten Pflicht-Inputs für diese Story.
2. Prüfe Story gegen Akzeptanzkriterien mit Szenario-Block Given, When, Then.
3. Führe verfügbare QA-Checks aus, mindestens die im Dev-Handoff genannten Commands.
4. Dokumentiere Ergebnis in QA-Artefakten.
5. Setze QA-Gate für die Story auf Pass oder Fail mit Begründung.
6. Wenn Pass, setze Story-Status in der Story-Datei auf `pass` und synchronisiere `backlog/progress.md` im selben Run.
7. Wenn Fail, erfasse Blocker präzise und reproduzierbar.

Outputformat:
1. Status
2. Geänderte Dateien
3. Ausgeführte Tests mit Commands und Ergebnis
4. QA Verdict Pass oder Fail
5. Blocker-Liste
6. Offene Risiken
7. Self-Check gemäß qa.toml

Post-Condition fuer Orchestrator:
1. Wenn `QA Verdict Pass`, dann nach Run-Ende automatisch PM-Run starten.
2. PM setzt danach bei PM-Freigabe Story-Status auf `accepted` in Story-Datei und `backlog/progress.md`.
```

## Platzhalterhilfe
1. `<STORY_ID>`: Story-Referenz aus `backlog/stories`.
2. `<EPIC_ID>`: Zugehörige Epic-Referenz aus `backlog/epics`.
3. `<PFAD_ZU_EPIC_MD>`: Pfad zur Epic-Datei unter `backlog/epics/*.md`.
4. `<PFAD_ZU_STORY_MD>`: Pfad zur Story-Datei unter `backlog/stories/*.md`.
