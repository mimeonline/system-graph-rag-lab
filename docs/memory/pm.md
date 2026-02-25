# PM Memory

## Current Product Intent
Öffentlich erreichbares GraphRAG-MVP für System-Thinking mit klarem Frage zu Antwort Fluss, sichtbaren Referenzkonzepten und überprüfbarer Abnahme ohne Scope-Erweiterung.

## Scope Guardrails
### In Scope
1. Public Demo mit strukturierter Antwortdarstellung und nachvollziehbaren Referenzkonzepten.
2. Wissensbasis im freigegebenen Rahmen von 20 bis 30 Nodes und 10 bis 20 Relationen.
3. Operative MVP-Schutzmaßnahmen mit Secret-Hygiene, Usage-Limit und Basis-Rate-Limit.

### Out of Scope
1. Neue Epics oder Domänenerweiterung über den freigegebenen Rahmen hinaus.
2. Konten, Rollenmodell, Multi-Tenant, Personalisierung und Enterprise-Compliance-Ausbau.
3. PM-seitige Architekturentscheidungen und UX-Detailentscheidungen.

## Offene Annahmen
1. Der freigegebene Graphumfang reicht für die fünf MVP-Eval-Fragen aus.
2. Nutzer akzeptieren den Demo-Charakter, wenn Antwort und Herleitung klar strukturiert sind.
3. Story-Slices mit Aufwand <= 1 Tag reduzieren Planungsrisiko gegenüber breiten Sammelstories.

## Offene Entscheidungen
1. Welche messbare Regel in der Abnahme ein Referenzkonzept als relevant zählt.
2. Welche Mindesttiefe für Herleitungsdetails in P0 liegt und welche in P1 bleibt.
3. Welche P1-Stories bei Zeitdruck vor Public Demo auf P0 hochgezogen werden.

## Risiken
1. Scope-Drift durch spätere Re-Expansion des Graphumfangs ohne PM-Freigabe.
2. Qualitätsrisiko, falls Referenzkonzepte sichtbar sind, aber fachlich schwach bleiben.
3. Betriebsrisiko durch öffentliche Nutzungsspitzen trotz Basis-Guardrails.
4. Abnahmerisiko durch unklare Bewertungsregel für relevante Referenzkonzepte.

## Next Instructions
1. Halte Scope-Konsistenz zwischen Kickoff, PRD, Scope-Dokument, Backlog und Handoff bei jedem PM-Run.
2. Finalisiere mit QA die messbare Abnahmeregel für relevante Referenzkonzepte.
3. Übergib UX nur Ergebnisziele, Journeys und offene Fragen ohne Interaktionsmuster.
4. Prüfe vor Sprint-Start, dass jede Story im Tagesschnitt bleibt und testbare Given, When, Then Kriterien enthält.
