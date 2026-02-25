# Ops Workflow

## Story Lifecycle
1. Verbindlicher Ablauf ist `todo -> in_progress -> qa -> accepted`.
2. Status `blocked` ist nur bei klar dokumentiertem Hindernis zulässig.

## Wer setzt welchen Status
1. PM setzt initial `todo`.
2. Dev setzt bei Start der Umsetzung `in_progress`.
3. Dev setzt nach Umsetzung und Selbsttest `qa` oder bei Hindernissen `blocked`.
4. QA verifiziert und liefert ein Ergebnis im QA-Artefakt.
5. PM setzt final `accepted` nach erfolgreichem QA-Gate.

## Epic Gates
1. Nach Abschluss der Stories eines Epics ist ein QA-Gate verpflichtend.
2. Pro Epic ist ein Security-Gate verpflichtend.
3. Pro Epic ist ein DevOps-Gate verpflichtend.
4. Vor Public Demo oder Release ist ein vollständiger Gate-Run mit QA, Security und DevOps verpflichtend.

## Operative Verantwortungen
1. Dev dokumentiert Test Notes in der Story.
2. QA dokumentiert Verdict und Risiken.
3. DevOps prüft Deploy-Readiness, Environment-Konfiguration und Guardrails.
4. Security prüft Secret-Hygiene, Abuse-Risiken und Logging-Sicherheit.
