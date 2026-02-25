# PRD Public MVP System GraphRAG Lab

## Problem
Standard-LLM-Antworten auf Systemfragen sind oft schwer nachvollziehbar und ihre Wissensbasis bleibt unklar. Für die Zielgruppe fehlt eine öffentliche Demo, die Antwortqualität und Herleitung gemeinsam sichtbar macht.

## Zielgruppe
### Primär
1. Software-Architekten
2. AI Engineers
3. Technische Entscheider
4. Interessierte an GraphRAG

### Sekundär
1. Leser technischer Artikel
2. Recruiter
3. Potenzielle Beratungskunden

## JTBD
1. Wenn ich eine komplexe Systemfrage stelle, möchte ich eine strukturierte Antwort mit sichtbaren Referenzkonzepten erhalten, damit ich die Herleitung prüfen kann.
2. Wenn ich den Ansatz bewerte, möchte ich nachvollziehen können, welche Wissenskontexte die Antwort stützen, damit ich Vertrauen in die Aussage aufbauen kann.
3. Wenn ich die Demo öffentlich teste, möchte ich ohne Setup-Hürden eine stabile Nutzerführung erleben, damit ich den Ansatz schnell einschätzen kann.

## MVP Scope
### In Scope
1. Öffentliche Demo mit Ende-zu-Ende-Fluss von Frage zu strukturierter Antwort.
2. Wissensbasis im freigegebenen Rahmen mit mehr als 100 Nodes und mehr als 200 Edges.
3. Sichtbare Referenzkonzepte je Antwort mit Mindestziel von drei Konzepten, sofern verfügbar.
4. Nachvollziehbare Herleitung im P0 als knapper Kernnachweis in der Hauptantwort.
5. Betriebsrahmen gemäß AGENTS mit Public Deployment, Secret-Hygiene, Usage-Limit und Basis-Rate-Limit.
6. Verbindliche Abnahmeregel für relevante Referenzkonzepte auf Basis eines festen Eval-Sets mit fünf Fragen.

### Out of Scope
1. Konten, Rollenmodell und Multi-Tenant-Fähigkeit.
2. Personalisierung, persistente Nutzerhistorie und Analytics-Ausbau.
3. Enterprise-Compliance oder Audit-Ausbau.
4. Umfangserweiterung über den freigegebenen Domänenrahmen hinaus.
5. Erweiterte Herleitungsdetails über den P0-Kernnachweis hinaus.

## Non-Goals
1. Kein Enterprise-Produkt im MVP.
2. Kein Authoring-System für umfangreiche Graph-Kuration.
3. Keine Produktisierung über den Public-Demo-Zweck hinaus.

## Risiken
1. Scope-Drift durch spätere Erweiterungen ohne PM-Freigabe.
2. Referenzkonzepte sind sichtbar, aber fachlich nicht belastbar genug für die Zielgruppe.
3. Öffentliche Nutzung kann Betriebskosten erhöhen, falls Guardrails nicht sauber greifen.
4. Abnahme kann verzögert werden, wenn Eval-Erwartungslisten pro Frage fehlen oder unklar sind.

## Annahmen
1. Der bestehende Domänenrahmen reicht aus, um mindestens fünf Demo-Fragen belastbar zu beantworten.
2. Die Zielgruppe akzeptiert den experimentellen Charakter, wenn Struktur und Kernnachweis klar sind.
3. Der vorgegebene Betriebsrahmen ist für die erwartete Demo-Last ausreichend.

## KPIs
1. Mindestens fünf definierte System-Thinking-Fragen bestehen die fachliche Abnahme.
2. Für jede Eval-Frage existiert vor dem Abnahmelauf eine freigegebene Erwartungsliste mit drei bis sechs zulässigen Referenzkonzepten.
3. Ein Referenzkonzept zählt als relevant, wenn es in der Erwartungsliste der jeweiligen Frage enthalten ist.
4. Eine Antwort erfüllt das Referenzziel, wenn unter den ersten drei gezeigten Referenzkonzepten mindestens zwei relevant sind oder ein klarer Fallback-Hinweis vorliegt.
5. Der Abnahmelauf ist bestanden, wenn mindestens vier von fünf Eval-Fragen das Referenzziel erfüllen.
6. Demo ist öffentlich erreichbar und operativ stabil.
7. Keine Secrets im Repository und keine ungeplanten API-Ausgaben über dem gesetzten Limit.

## Definition of Done
1. Public Demo ist erreichbar und der Frage-zu-Antwort-Fluss funktioniert.
2. Die fünf MVP-Eval-Fragen sind mit dokumentiertem Ergebnis durchgeführt.
3. Referenzkonzepte werden in Antworten konsistent sichtbar gemacht und nach der verbindlichen Relevanzregel bewertet.
4. P0-Herleitung ist vorhanden, P1-Herleitungsvertiefung bleibt außerhalb der MVP-Abnahme.
5. Guardrails für Key-Limit, Rate-Limit und Secret-Hygiene sind aktiv und überprüfbar.
6. PM-Artefakte sind auf denselben Scope konsolidiert.
