# Role Progress Tracking

## Ziel
Dieses Verzeichnis dient als einheitlicher Live-Progress-Kanal fuer Subagent-Runs.
Jede Rolle schreibt nur in ihren eigenen Unterordner.

## Rollenpfade
1. PM: `docs/progress/pm/`
2. UX: `docs/progress/ux/`
3. Architect: `docs/progress/architect/`
4. Dev: `docs/progress/dev/`
5. QA: `docs/progress/qa/`
6. DevOps: `docs/progress/devops/`
7. Security: `docs/progress/security/`

## Dateimuster
1. `current.md` fuer den zuletzt aktiven Lauf.
2. Optional `run-<id>.md` fuer run-spezifische Protokolle.
3. Bei jedem Fortschrittswechsel wird die jeweilige Datei vollstaendig ueberschrieben.

## Format
```text
Status: running | completed | failed
Current Step: <kurz und konkret>
Current File: <dateipfad oder n/a>
Next Step: <naechster konkreter schritt>
Time: <ISO-8601>
```

## Regeln
1. Memory-Dateien unter `docs/memory/**` enthalten nur strategische Erinnerungen und keine Live-Schrittlogs.
2. Orchestrator pollt `wait` plus passende Progress-Datei im 10 bis 15 Sekunden Intervall.
3. Bei `completed` oder `failed` bleibt der letzte Stand als Abschlusszustand in der Datei stehen.
