# Startprompt

Ich will dieses Feature mit dem Multi-Agent-Flow umsetzen.

## Kontext
- Kickoff liegt in `docs/discovery/feature-kickoff.md`.
- Nutze die Rollenconfigs aus `.codex/agents/*.toml`.
- Repo-Dateien sind Source of Truth.

## Auftrag
1. Starte die Rollen in dieser Reihenfolge:
   - `pm`
   - `ux`
   - `architect`
   - `dev`
   - `qa`
   - `devops`
2. Setze pro Rolle explizit einen `RUN_MODE`.
3. Prüfe nach jeder Rolle kurz:
   - nur erlaubte Pfade geändert
   - Handoff vorhanden
   - Memory aktualisiert
4. Starte die nächste Rolle nur, wenn das Gate passt.

## Modus-Vorschlag
- PM: `RUN_MODE=hardening`
- UX: `RUN_MODE=review`
- Architect: `RUN_MODE=review`
- Dev: `RUN_MODE=review`
- QA: `RUN_MODE=review`
- DevOps: `RUN_MODE=review`

## Output im Chat
- Status pro Rolle
- wichtigste Findings und Blocker
- nächste 3 Schritte
