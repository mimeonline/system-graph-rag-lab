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
```

## Nutzung
1. Neuen Chat öffnen.
2. Diese Vorlage zuerst senden.
3. Danach direkt deinen eigentlichen `spawn_agent` Prompt senden.
