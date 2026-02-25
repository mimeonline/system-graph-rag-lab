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

## Automatischer PM Follow-up nach QA Pass
1. Wenn der abgeschlossene Lauf die Rolle `qa` war und das Story-Verdict `Pass` ist:
   - ohne Rueckfrage direkt `agent_type=pm` starten.
2. QA muss vor PM-Start bereits synchron auf `pass` gesetzt haben:
   - Story-Status in `backlog/stories/<story>.md` auf `pass`
   - Story-Status in `backlog/progress.md` auf `pass`
3. PM setzt im selben Lauf:
   - Story-Status in `backlog/stories/<story>.md` auf `accepted`
   - Story-Status in `backlog/progress.md` auf `accepted`
   - `Letztes Update` auf aktuelles Datum
4. PM-Run wird mit demselben Polling-Standard begleitet:
   - 10 bis 15 Sekunden Intervall
   - Statuszeile pro Polling
   - Progress-Ping bei `running`
