# C4 Kontext Public MVP GraphRAG

## Systemgrenze
1. Das System ist eine öffentlich erreichbare Demo für System Thinking Fragen.
2. Innerhalb der Grenze liegen Web UI, API Layer und Retrieval Orchestrierung.
3. Außerhalb der Grenze liegen LLM Inferenz, Graph Datenhaltung und Hosting Plattform.

## Akteure
1. Public User stellt eine Frage und bewertet Hauptantwort, wichtige Bezüge und Kernnachweis.
2. Dev Team implementiert den API Contract, den Retrieval Contract und die Betriebs Guardrails.
3. QA Team prüft deterministisches Retrieval, API Fehlercodes und Mindestqualität der Antwortstruktur.

## Externe Systeme
1. OpenAI API liefert Query Embeddings und Antwortgenerierung.
2. Neo4j Aura hält den Wissensgraphen und den Vektorindex.
3. Vercel stellt Web Runtime und API Runtime bereit.

## Kontextfluss
1. Public User sendet eine Frage an die Web UI.
2. Web UI sendet die Frage an den API Layer.
3. API Layer fragt Neo4j Aura für Seed Retrieval und Graph Expansion ab.
4. API Layer baut einen budgetierten Kontext und ruft OpenAI API auf.
5. API Layer liefert strukturierte Antwortdaten zurück an die Web UI.
6. Vercel protokolliert minimale technische Telemetrie pro Request.
