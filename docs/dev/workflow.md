# Ops Workflow

## Story Lifecycle
1. Verbindlicher Ablauf ist `todo -> in_progress -> qa -> pass -> accepted`.
2. `blocked` ist nur bei dokumentiertem Hindernis zulaessig.

## Status Owner
1. `todo` wird durch PM gesetzt.
2. `in_progress` wird durch Dev gesetzt.
3. `qa` wird durch Dev gesetzt.
4. `pass` wird durch QA gesetzt.
5. `accepted` wird durch PM gesetzt.
6. `blocked` wird durch die aktive Rolle mit Begruendung gesetzt.

## Rollenverantwortung pro Status
1. Dev: Umsetzung, Selbsttest, Uebergabe auf `qa`.
2. QA: Test-Gate, Defect-Doku, Status auf `pass` oder Rueckgabe.
3. PM: finale Freigabe auf `accepted`.
4. DevOps: Epic-Gate fuer Deploybarkeit, Runbook und Betriebsrisiken.
5. Security: Epic-Gate fuer Secrets, Abuse und Logging-Hygiene.

## Epic Gates und Trigger
1. Trigger: Sobald alle Epic-Stories mindestens `pass` sind, starten Epic-Gates.
2. Pflicht-Gates: QA, Security und DevOps pro Epic.
3. Vor Public Demo oder Release ist ein kompletter Gate-Run verpflichtend.
4. Epic bleibt `in_progress`, solange ein Pflicht-Gate offen oder `Fail` ist.
5. DevOps-Gates dokumentieren Referenzen- und Observability-Integritaeten (z.B. `referenceCount`, `contextCandidateCount`, Log-Felder) wenn sie neue API-Flow-Elemente einführen.
