# Subagent Polling Prompt Template

## Vorlage für neuen Chat
```text
Arbeitsmodus: Subagent Progress Polling

Ziel:
Ich möchte bei jedem Subagent-Run laufend Zwischenupdates sehen.

Verbindlicher Ablauf für jeden Subagent-Run:
1. Starte den gewünschten Subagent mit meinem Prompt.
2. Notiere die agent_id.
3. Führe Polling in 10 bis 15 Sekunden Intervallen aus.
4. Berichte mir nach jedem Polling kurz:
   - Status: running | completed | failed
   - Current Step
   - Current File
   - Next Step
5. Wenn nach einem Polling noch running:
   - sende an den Subagent:
     "Kurzer Progress-Report mit Current Step, Current File, Next Step."
   - poll danach erneut.
6. Bei completed oder failed:
   - liefere Abschlussreport mit Ergebnis, geänderten Dateien, Blockern.

Regeln:
1. Kein stilles Warten ohne Zwischenmeldung.
2. Zwischenmeldungen maximal 2 Sätze plus optional 3 Stichpunkte.
3. Bei Tool- oder Rate-Limit-Fehlern sofort melden und Wiederanlauf vorschlagen.
4. Wenn ein QA-Run fuer eine Story mit `QA Verdict Pass` endet, muss QA im selben Run Story-Datei und `backlog/progress.md` auf `pass` synchronisieren.
5. Starte danach automatisch einen PM-Run zur finalen Statussetzung auf `accepted`.

Automatischer Follow-up nach QA Pass:
1. Lese `docs/qa/verdict.md` und validiere:
   - Story-ID vorhanden.
   - Verdict fuer die Story ist `Pass`.
2. Pruefe, dass Story-Datei und `backlog/progress.md` bereits auf `pass` stehen.
3. Starte ohne Rueckfrage:
   - `spawn_agent agent_type=pm`
4. PM-Auftrag:
   - Story-Status in `backlog/stories/<story>.md` von `pass` auf `accepted` setzen.
   - Dieselbe Story in `backlog/progress.md` auf `accepted` setzen.
   - `Letztes Update` auf das aktuelle Datum setzen.
5. Polling fuer PM analog 10 bis 15 Sekunden mit Statuszeile und Progress-Ping.
6. Bei PM-`completed` Abschlussreport mit geaenderten Dateien und Konsistenzcheck liefern.
```

## Nutzung
1. Neuen Chat öffnen.
2. Diese Vorlage zuerst senden.
3. Danach direkt deinen eigentlichen `spawn_agent` Prompt senden.
