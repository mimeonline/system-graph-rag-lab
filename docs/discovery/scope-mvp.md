# MVP Scope Public Demo

## In Scope
1. Öffentliche Demo für Systemfragen mit klarem Frage-zu-Antwort-Fluss.
2. Wissensbasis mit 20 bis 30 Nodes und 10 bis 20 Relationen im freigegebenen Rahmen.
3. Strukturierte Antwortdarstellung mit sichtbaren Referenzkonzepten.
4. P0-Herleitung als knapper Kernnachweis in der Hauptantwort.
5. Verbindliche Relevanzprüfung für Referenzkonzepte auf Basis des fünfteiligen Eval-Sets.
6. Betriebsrahmen gemäß AGENTS mit Public Deployment, Secret-Hygiene und Basis-Schutzmaßnahmen.

## Out of Scope
1. Scope-Erweiterung der Domäne über den freigegebenen Rahmen hinaus.
2. Produktfunktionen für Konten, Rollen oder Multi-Tenant.
3. Persistente Nutzerhistorie, Personalisierung oder umfangreiche Analytics.
4. Enterprise-Compliance-Ausbau oder formale Zertifizierungsziele.
5. P1-Herleitungsvertiefung über den P0-Kernnachweis hinaus.

## Guardrails
1. Keine neuen Epics, nur Konsolidierung und Schärfung bestehender Epics E1 bis E5.
2. Keine Architekturentscheidungen in PM-Artefakten.
3. Keine UX-Detailentscheidungen in PM-Artefakten.
4. Jede Story bleibt auf einen umsetzbaren Tagesschnitt begrenzt.
5. Jede Story enthält testbare Akzeptanzkriterien im einheitlichen Given/When/Then-Template.
6. Relevanzregel ist verbindlich: Ein Referenzkonzept gilt nur dann als relevant, wenn es in der freigegebenen Erwartungsliste der jeweiligen Eval-Frage steht.
7. Abnahmeziel ist verbindlich: Pro Eval-Frage gelten mindestens zwei relevante Konzepte unter den ersten drei Referenzkonzepten oder ein klarer Fallback-Hinweis.

## Prioritäten
1. P0 enthält Ende-zu-Ende-Nutzerfluss, Hauptantwort, sichtbare Referenzkonzepte, P0-Kernnachweis und Public Betriebsfähigkeit.
2. P1 enthält Herleitungsvertiefung, Betriebsqualitätserweiterungen und formale Abnahmedokumentation nach erreichter P0-Stabilität.
3. P2 enthält Iterationsvorbereitung nach MVP-Abschluss.

## Offene Entscheidungen
1. Kein offener PM-Entscheidungspunkt zur Relevanzregel oder P0/P1-Grenze im Hardening-Stand.
2. Priorisierung einzelner P1-Stories bei Zeitdruck bleibt abhängig vom Implementierungsfortschritt.
