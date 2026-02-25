# PM Memory

## Current Product Intent
Oeffentlich erreichbares GraphRAG-MVP mit klar getrenntem Delivery-Schnitt: E1 liefert lokal belastbare Datenbasis-Verfuegbarkeit als Vorstufe, E4 liefert Public-Plattform-Readiness fuer die Demo-Freigabe.

## MVP Scope Guardrails In Out
### In
1. E1 fokussiert lokale Datenbasis-Readiness inklusive reproduzierbarem Lese-Smoke-Test im lokalen Zielbetrieb.
2. E4 fokussiert Public-Plattform-Setup und Public-Betriebsfaehigkeit inkl. Guardrails fuer Secrets, Limits und Logging.
3. Statusfuehrung bleibt strikt synchron zwischen Story/Epic-Dateien und `backlog/progress.md`.
4. QA pro Story sowie Security- und DevOps-Gate pro Epic bleiben verpflichtend.

### Out
1. Keine Vermischung von lokalem E1-Nachweis mit Public-Abnahme in E4.
2. Keine neuen Epics oder Scope-Erweiterungen ausserhalb E1 bis E5.
3. Keine PM-seitigen Architektur-, Retrieval- oder UX-Detailentscheidungen.
4. Keine Story-Freigabe `accepted` ohne vorherigen Status `pass` und explizites PM-OK.

## Open Assumptions
1. Die lokale E1-Datenbasis ist ausreichend stabil, um als belastbare Voraussetzung fuer Public-Schritte zu dienen.
2. Das in E4-S5 dokumentierte Public-Plattform-Setup ist ohne Scope-Erweiterung in E4-S1 bis E4-S4 operationalisierbar.
3. QA-Evidenz fuer lokale und Public-Nachweise bleibt in den nachfolgenden Story-Runs sauber getrennt dokumentiert.

## Open Decisions
1. PM-Entscheidung vom 2026-02-25: `E1-S3` bleibt auf `qa` bis QA-`pass` mit lokalem Lese-Smoke-Test-Evidenzpaket vorliegt.
2. PM-Entscheidung vom 2026-02-25: `E4-S5` ist als Public-Voraussetzungsstory im Backlog fixiert und vor den operativen Public-Storys einzuordnen.
3. Offen bleibt, in welcher Reihenfolge E4-S1 bis E4-S4 nach Abschluss von E4-S5 zuerst in `in_progress` gesetzt werden.

## Risks to Monitor
1. Abnahme-Risiko durch Nachweisvermischung zwischen lokalem E1-Zielbetrieb und Public-E4-Zielbetrieb.
2. Tracking-Risiko bei Status-Divergenz zwischen Story-Dateien, Epic-Dateien und `backlog/progress.md`.
3. Gate-Risiko pro Epic, solange Security- und DevOps-Nachweise fuer E1 und E4 noch nicht dokumentiert sind.
4. Sequenzrisiko, falls E4-S5 als Voraussetzung umgangen wird und Public-Storys ohne Plattformgrundlage starten.

## Next Instructions for PM Agent
1. Erzwinge die Trennung im Wording und in der Abnahme: E1 lokal, E4 public.
2. Synchronisiere jede Statusaenderung im selben Run in `backlog/progress.md`.
3. Setze `accepted` nur nach dokumentiertem QA-`pass` und explizitem PM-OK.
4. Fuehre E4 nach Start der ersten nicht-`todo`-Story sofort auf Epic-Status `in_progress`.
5. Markiere Epic-Abschluss nur mit dokumentierten QA-, Security- und DevOps-Gates.
