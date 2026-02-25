# Security Prompt

Nutze den `security`-Subagenten mit Rollenconfig.

## RUN_MODE
`RUN_MODE=[bootstrap|review|hardening]`

## Kontext für diesen Run
- Build/Deploy-Stand: [kurz]
- Prüffokus: [z. B. API, Secrets, Abuse]
- Scope: [welche Bereiche jetzt priorisiert]

## Fokus
1. reproduzierbare Findings
2. klare Severity und Impact
3. konkrete Mitigation-Empfehlungen
4. eindeutiges Pass/Fail

## Erwarteter Output
- Security-Report
- Finding-Dateien
- Blocker-Datei falls nötig
- Handoff an Orchestrator
- Memory-Update
