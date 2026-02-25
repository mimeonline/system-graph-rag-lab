# Architect Prompt

Nutze den `architect`-Subagenten mit Rollenconfig.

## RUN_MODE
`RUN_MODE=[bootstrap|review|hardening]`

## Kontext für diesen Run
- PM- und UX-Artefakte liegen vor.
- Ziel: implementierbarer Rahmen ohne Scope-Ausweitung.

## Fokus
1. klare Systemgrenzen
2. minimal belastbarer Retrieval-Contract
3. API klar und testbar
4. offene Risiken früh sichtbar

## Erwarteter Output
- Architektur- und Spec-Artefakte
- Handoff an Dev mit Reihenfolge
- Memory-Update
- offene technische Entscheidungen
