# Story E4-S5 Public Plattform Setup vorbereiten

## Status
todo

## Ziel
Die Public Plattform-Grundlage mit GitHub, Vercel, Neo4j Aura und Environment-Verkabelung als Voraussetzung fuer spaetere Public-Abnahme bereitstellen.

## Priorität
P0

## Abhängigkeiten
1. Keine

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Public Plattform Setup ist als Voraussetzung nachweisbar

**Given**
ein lauffaehiger lokaler Stand und ein vorgesehenes Public Zielprofil

**When**
das Public Plattform Setup vorbereitet und dokumentiert wird

**Then**
1. sind GitHub Repository, Vercel Projekt und Neo4j Aura Instanz als Zielplattformen eindeutig zugeordnet.
2. ist die Environment-Verkabelung fuer Public mit benoetigten Variablen und Zielsystem je Variable nachvollziehbar dokumentiert.
3. ist klar dokumentiert, dass dieses Setup die Voraussetzung fuer spaetere Public-Abnahme in E4 bildet.

## Kontext
1. Die Infrastruktur-Zielarchitektur bleibt Vercel plus Neo4j Aura (Public) und GitHub als Source-of-Truth; `docs/ops/vercel.md` beschreibt die verbindlichen Build-, Runtime- und Env-Details, die hier referenziert werden.
2. Die Environment-Variablenliste spiegelt die `apps/web/.env.example` mit OpenAI-, Neo4j- und Rate-Limit-Keys wider; im Public-Betrieb sind die Werte als Vercel Secrets zu pflegen, nicht im Repo.
3. Dieses Story-Artefakt ist ein Gate für die nachfolgenden E4-Stories (Deployment, Guardrails, Rate-Limit) und muss dokumentieren, wo die Plattform-Ziele festgehalten werden.

## Test Notes
1. Pruefe den Nachweis, dass die vier Plattformbausteine GitHub, Vercel, Neo4j Aura und Public Environment-Verkabelung jeweils mit Zielstatus dokumentiert sind.
2. Pruefe, dass die Public-Variablenzuordnung pro Variable ein eindeutiges Zielsystem und keine lokalen Platzhalter enthaelt.
3. Pruefe, dass im Story-Nachweis die Rolle als Voraussetzung fuer die spaetere Public-Abnahme explizit genannt ist.

## Umsetzungsklärungen
### Zielplattform-Verankerung
- Dokumentiere Name/URL des GitHub-Repositories, Branch-Policies und das zugehoerige Vercel-Projekt inklusive Build-/Install-Commands sowie Node-Version (siehe `docs/ops/vercel.md`).
- Halte die Neo4j Aura Instanz-ID, Region und Credential-Aufbewahrung fest, damit QA/Security die korrekte Zielumgebung nachziehen koennen.
### Environment-Verkabelung
- Fuehre jede Environment-Variable aus `apps/web/.env.example` auf und ordne sie dem Zielsystem zu (z. B. `OPENAI_API_KEY` → OpenAI Edge, `NEO4J_URI`/`PASSWORD` → Aura, Rate-Limit-Variablen → Vercel Rate-Limit-Adapter). Nutze dazu den Abschnitt "Required Environment Variables" aus `docs/ops/vercel.md`.
- Beschreibe mit klarer Kennzeichnung, dass Secret-Werte nur in Vercel eingepflegt werden und nicht Teil des Repositorys sind; Platzhalter wie `sk-placeholder` oder `change-me` sind nur in lokalen Examples erlaubt.
### Abnahme-Bindung
- Vermerke im Story-Nachweis, dass diese Dokumentation die Voraussetzung fuer E4-S1 bis E4-S4 bildet; QA oder Security darf erst nach erfolgreicher Verankerung der Infrastruktur starten.
