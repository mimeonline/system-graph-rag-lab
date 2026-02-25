# Ops Workflow

## Story Lifecycle
1. Verbindlicher Ablauf ist `todo -> in_progress -> qa -> pass -> accepted`.
2. Status `blocked` ist nur bei klar dokumentiertem Hindernis zulässig.
3. Sobald die erste Story eines Epics nicht mehr `todo` ist, muss das Epic auf `in_progress` gesetzt werden.

## Wer setzt welchen Status
1. PM setzt initial `todo`.
2. Dev setzt bei Start der Umsetzung als ersten operativen Schritt `in_progress`.
3. Dev synchronisiert `backlog/progress.md` unmittelbar nach dem Wechsel auf `in_progress`.
4. Dev setzt nach Umsetzung und Selbsttest `qa` oder bei Hindernissen `blocked`.
5. QA verifiziert, dokumentiert das Ergebnis und setzt bei erfolgreichem QA-Gate den Status `pass`.
6. QA synchronisiert im selben Run `backlog/progress.md`.
7. PM setzt final `accepted` nach PM-Review auf Basis von `pass`.

## Epic Status Sync
1. Story-Status ist die führende Quelle für den operativen Start eines Epics.
2. Wenn eine Story den Status `in_progress`, `qa`, `pass`, `accepted` oder `blocked` hat, darf das zugehörige Epic nicht `todo` bleiben.
3. Änderungen an Story- oder Epic-Status werden im selben Run in `backlog/progress.md` synchronisiert.

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
