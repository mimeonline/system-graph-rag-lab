# Subagent Run Template with Live Progress

## Ziel
Dieses Template erzwingt Live-Progress pro Rollenlauf und macht den aktuellen Schritt pollbar.

## Prompt Zusatz fuer jeden Rollenlauf
```text
Live Progress Pflicht:
1. Schreibe sofort zu Run-Beginn in docs/progress/<rolle>/current.md mit:
   - Status: running
   - Current Step
   - Current File
   - Next Step
   - Time (ISO-8601)
2. Aktualisiere docs/progress/<rolle>/current.md bei jedem Phasenwechsel.
3. Ueberschreibe die Datei vollstaendig bei jedem Update.
4. Am Ende setze Status auf completed oder failed und hinterlasse den finalen Stand.
```

## Polling Ablauf fuer Orchestrator
1. Subagent starten und `agent_id` notieren.
2. Alle 10 bis 15 Sekunden pollen:
   - `wait` auf `agent_id`
   - `cat docs/progress/<rolle>/current.md`
3. Im Chat pro Polling reporten:
   - Status
   - Current Step
   - Current File
   - Next Step
4. Bei `running` den Subagent kurz pingen:
   - `Kurzer Progress-Report mit Current Step, Current File, Next Step.`
5. Bei `completed` oder `failed` Abschlussreport liefern.
