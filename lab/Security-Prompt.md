Starte eine Security-Review der aktuellen Änderungen.

Spawn den security Agenten:

- Fokus: OWASP Top 10, AuthN/AuthZ, IDOR, Input Validation, Secrets, Logging, Supply Chain.
- Ergebnis: docs/security/findings-*.md pro Finding und ggf. docs/security/blocker.md.

Parallel dazu:
Spawn den qa Agenten:

- Fokus: P0 Akzeptanzkriterien, Integrationstests, Repro-Schritte bei Fehlern.
- Ergebnis: docs/qa/**und evals/**, ggf. handoff/qa-blocker.md.

Warte auf beide Agenten und liefere anschließend eine konsolidierte Zusammenfassung:

- Blocker (Security/QA)
- High/Medium Findings
- empfohlene Next Steps in Reihenfolge
