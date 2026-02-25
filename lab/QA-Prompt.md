# QA Prompt

Nutze den `qa`-Subagenten mit Rollenconfig.

## RUN_MODE
`RUN_MODE=[bootstrap|review|hardening]`

## Kontext für diesen Run
- Testfokus: [P0|P1]
- Zu prüfende Stories: [IDs]
- Besondere Risiken: [kurz]

## Fokus
1. Akzeptanzkriterien reproduzierbar prüfen
2. Evals nachvollziehbar dokumentieren
3. klare Pass/Fail-Entscheidung
4. konkrete Fix-Requests bei Fail

## Erwarteter Output
- QA-Artefakte und Eval-Bericht
- Verdict
- Handoff an DevOps
- Memory-Update
