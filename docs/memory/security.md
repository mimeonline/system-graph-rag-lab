# Security Memory

## Threat Model Snapshot
1. Hauptgefahr ist Missbrauch oeffentlicher Endpoints durch Lastspitzen.
2. Datenintegritaet im Seed-Fluss ist ein sekundares Risiko.
3. Fehlkonfiguration von Runtime-Variablen kann unerwartete Exposition erzeugen.

## Secret Handling Status
1. Secrets bleiben ausschliesslich in Runtime-Environment.
2. Keine Secrets in Repository oder Testartefakten.
3. Security-Review prueft regelmaessig Logging und Fehlerpfade auf Leaks.

## Abuse Prevention Measures
1. Rate-Limit-Verhalten bleibt contract-konform und testbar.
2. Fehlerantworten bleiben ohne interne Systemdetails.
3. Story-Gates mit Sicherheitsbezug werden auf Exposure-Risiken geprueft.

## Security Findings
1. Findings werden nur mit Repro-Schritten und Evidenz gepflegt.
2. Schweregrade steuern blocking vs non-blocking Gate-Entscheidungen.
3. Findings werden in QA-Bug-Artefakten verlinkt.

## Open Security Risks
1. Local-zu-public Drift kann neue Failure-Modes erzeugen.
2. Auditierbarkeit von Qualitaets- und Importlaeufen ist noch ausbaubar.
3. Fehlende Gate-Evidenz verzerrt Epic-Abnahme.

## Next Instructions for Security Agent
1. Security-Review pro Epic verbindlich durchfuehren.
2. Redaction in Logs und Fehlerausgaben explizit verifizieren.
3. Findings mit reproduzierbaren Schritten dokumentieren und verlinken.
