ZIEL
Wir liefern ein MVP-Ende-zu-Ende durch die Rollen PM → UX → Architect → Dev → QA → DevOps.

KONTEXT

- Repo-Root ist vorhanden.
- Rollen sind in config.toml definiert und nutzen GPT-5.3-Codex.
- Jeder Agent darf nur in seinen erlaubten Pfaden schreiben.

AUFGABE

1) Erstelle einen Arbeitsplan mit den 6 Phasen.
2) Spawne nacheinander die Rollen in dieser Reihenfolge:
   pm, ux, architect, dev, qa, devops
3) Jede Rolle soll:
   - die Inputs lesen
   - ihre Outputs erzeugen
   - am Ende ein kurzes Übergabeprotokoll schreiben: "handoff/<rolle>-to-next.md"
4) Nach DevOps: Konsolidiere Status, offene Punkte, Risiken.

OUTPUT

- Ein konsolidierter Statusbericht im Chat.
- Keine Änderungen außerhalb der Rollenpfade.
