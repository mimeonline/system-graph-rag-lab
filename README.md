# System GraphRAG Lab

Public GraphRAG MVP fuer System Thinking.

Das Projekt zeigt, wie aus plausiblen KI-Antworten nachvollziehbare und pruefbare Entscheidungswege werden.  
Technisch kombiniert es:

1. Next.js Frontend/API (`apps/web`)
2. Neo4j als Graph-Backend
3. Kuratiertes Seed-Dataset fuer System-Thinking-Konzepte

## Projektstruktur

1. `apps/web`: Next.js App (UI, API, Seed-Logik)
2. `docs/`: Architektur, Ops, QA, Handoffs
3. `input/`: lokale, nicht versionierte Arbeitsquellen fuer Seed-Kuration
4. `AGENTS.md` und `.codex/`: Multi-Agent- und Workflow-Konfiguration fuer reproduzierbare Entwicklungsablaeufe mit Codex

Hinweis zu Multi-Agent-Artefakten:  
Die Dateien sind absichtlich im Repo, weil sie den Engineering-Prozess dokumentieren und reproduzierbar machen. Sie gehoeren damit zum Projektbetrieb, nicht zu Runtime-Secrets.

## Entwicklungskontext

Dieses Repository ist nicht nur Code, sondern auch ein transparenter Entwicklungsverlauf.

1. In der ersten Projektphase wurde ein Multi-Agent-Setup mit Rollenartefakten genutzt (`.codex/**`, `docs/**`), um Scope, Architektur und QA strukturiert aufzubauen.
2. Danach wurde auf Single-Agent-Umsetzung gewechselt, weil der Tokenverbrauch im laufenden Build zu hoch war.
3. Ergaenzend wurden punktuell ChatGPT fuer inhaltliche Sparring-Runden und Antigravity fuer Design-Iterationen genutzt.
4. Deshalb bleiben Prozessdateien, Handoffs und Decision-Dokumentation bewusst im Repo, auch wenn sie fuer den Runtime-Betrieb nicht direkt benoetigt werden.

## Voraussetzungen

1. `pnpm` (Pflicht, kein npm/yarn)
2. Docker + Docker Compose
3. Node.js 20+

## Quick Start (empfohlen)

Starte Neo4j, spiele Seed-Daten ein und starte danach die Web-App:

```bash
./scripts/dev-up.sh
```

Stoppe lokale Infra wieder:

```bash
./scripts/dev-down.sh
```

## Manuelle Einrichtung

1. Environment anlegen:

```bash
cp apps/web/.env.example apps/web/.env.local
```

2. In `apps/web/.env.local` mindestens setzen:

```dotenv
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5-mini
OPENAI_EMBEDDINGS_MODEL=text-embedding-3-small
NEO4J_URI=bolt://localhost:7687
NEO4J_DATABASE=neo4j
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=change-me
NEO4J_VECTOR_INDEX_NAME=node_embedding_index
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_SECONDS=60
RATE_LIMIT_IP_SALT=replace-with-random-string
```

3. Neo4j starten:

```bash
NEO4J_AUTH=neo4j/change-me docker compose -f docs/ops/docker-compose.local.yml up -d
```

4. Dependencies installieren:

```bash
pnpm --dir apps/web install
```

5. Seed reset/reseed ausfuehren:

```bash
cd apps/web
set -a
source .env.local
set +a
export NEO4J_DATABASE=${NEO4J_DATABASE:-neo4j}
export ALLOW_DESTRUCTIVE_SEED_RESET=true
pnpm run seed:local:reset-reseed
```

6. Dev-Server starten:

```bash
pnpm --dir apps/web dev
```

Danach: `http://localhost:3000`

## Wichtige Sicherheitsregeln

1. Keine echten Secrets committen.
2. `apps/web/.env.local` bleibt lokal.
3. Destruktiver Seed-Reset ist nur lokal erlaubt und braucht explizit `ALLOW_DESTRUCTIVE_SEED_RESET=true`.

## Nützliche Befehle

```bash
pnpm --dir apps/web typecheck
pnpm --dir apps/web test
pnpm --dir apps/web build
```
