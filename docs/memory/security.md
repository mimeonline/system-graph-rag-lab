# Security Memory

## Threat Model Snapshot
1. Hauptgefahr in E1 ist destruktiver Fehlbetrieb bei lokalen Seed-Reset-Ablaeufen mit falschem Zielsystem.
2. Datenintegritaet bleibt kritisch, weil Label-basierter Reset auch Nicht-Seed-Daten treffen kann.
3. Public Abuse-Risiken bleiben fuer spaetere E4-Haertung relevant.

## Secret Handling Status
1. Keine produktiven Secrets im Repository gefunden.
2. `apps/web/.env.local` ist versioniert, derzeit mit Platzhaltern, bleibt aber ein Fehlbedienungsrisiko.
3. Error-Ausgaben enthalten aktuell keine explizite Secret-Redaction-Logik.

## Abuse Prevention Measures
1. Input-Validierung fuer `POST /api/query` ist vorhanden.
2. Contract-konformes aktives Rate-Limit ist im aktuellen E1-Stand noch nicht umgesetzt.
3. Destruktive Seed-Operationen haben derzeit keinen Local-Only-Guard.

## Security Findings Summary
1. High: Fehlender Runtime-Guard fuer destruktiven Seed-Reset gegen nicht-lokale Neo4j-Ziele.
2. Medium: Overbroad Delete-Scope beim Seed-Reset ohne Seed-Besitzmarker.

## Open Security Risks
1. Datenverlustrisiko bei Fehlkonfiguration von `NEO4J_URI` im Reset-Workflow.
2. Kollaterales Loeschen lokaler Nicht-Seed-Daten beim Reseed.
3. Public Abuse- und Header-Haertung bleibt offen bis E4-Gate.

## Next Instructions for Security Agent
1. Im naechsten Security-Run den Fix-Status fuer Local-Guard und Delete-Scope erneut verifizieren.
2. Vor Public-Demo den Rate-Limit- und Header-Status gegen E4-Artefakte hart gate'n.
3. Weiterhin Secret-Hygiene inklusive Versionierungsstatus von Env-Dateien pruefen.
