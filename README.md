# System GraphRAG Lab

<p align="center">
  Public GraphRAG MVP for System Thinking.<br/>
  From plausible AI output to traceable decision paths.
</p>

<p align="center">
  <a href="https://nextjs.org/"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.1.6-111827?style=for-the-badge&logo=next.js"></a>
  <a href="https://pnpm.io/"><img alt="pnpm" src="https://img.shields.io/badge/pnpm-workspace-F69220?style=for-the-badge&logo=pnpm&logoColor=white"></a>
  <a href="https://neo4j.com/"><img alt="Neo4j" src="https://img.shields.io/badge/Neo4j-Graph%20Backend-008CC1?style=for-the-badge&logo=neo4j&logoColor=white"></a>
  <a href="./LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-0f172a?style=for-the-badge"></a>
</p>

## Overview

System GraphRAG Lab demonstrates how AI answers can be converted into transparent and auditable decision logic.
The core idea is architectural, not rhetorical.
Decision quality depends on explicit structure, context discipline, evidence paths and reproducible derivations.

Technically, the project combines:

1. Next.js frontend and API (`apps/web`)
2. Neo4j as graph backend
3. Curated seed dataset for system-thinking concepts

## Why this repository exists

Most AI demos optimize output quality.
This project optimizes decision traceability.

You can inspect how a question is transformed into:

1. prioritized context
2. explicit graph relations
3. synthesis with evidence path
4. operational decision framing

## Live surfaces in the app

1. `/demo` for the operational query flow
2. `/story/graphrag` for the 5-step technical narrative
3. `/essay` for architectural deep dives
4. `/about` for positioning and project context

## Repository structure

1. `apps/web` contains the Next.js app, API routes, UI and seed logic
2. `docs` contains architecture, ops, QA, handoffs and process artifacts
3. `input` contains local, non-versioned source material for seed curation
4. `.codex` and `AGENTS.md` contain process and collaboration setup used during development

## Development context

This repository intentionally includes process artifacts, not only runtime code.

1. Phase one used a multi-agent setup to structure scope, architecture and QA output.
2. Later implementation continued in single-agent mode due token budget efficiency.
3. Additional iteration support came from ChatGPT for content sparring and Antigravity for visual design direction.
4. Therefore `.codex/**` and `docs/**` remain part of the project context by design.

## Requirements

1. Node.js 20+
2. pnpm
3. Docker and Docker Compose

## Quick start

Run Neo4j, reseed data and start the app:

```bash
./scripts/dev-up.sh
```

Stop local infrastructure:

```bash
./scripts/dev-down.sh
```

Open:

```text
http://localhost:3000
```

## Manual setup

1. Create environment file:

```bash
cp apps/web/.env.example apps/web/.env.local
```

2. Set at least:

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

3. Start Neo4j:

```bash
NEO4J_AUTH=neo4j/change-me docker compose -f docs/ops/docker-compose.local.yml up -d
```

4. Install dependencies:

```bash
pnpm --dir apps/web install
```

5. Run local reset and reseed:

```bash
cd apps/web
set -a
source .env.local
set +a
export NEO4J_DATABASE=${NEO4J_DATABASE:-neo4j}
export ALLOW_DESTRUCTIVE_SEED_RESET=true
pnpm run seed:local:reset-reseed
```

6. Start development server:

```bash
pnpm --dir apps/web dev
```

## Validation commands

```bash
pnpm --dir apps/web lint
pnpm --dir apps/web typecheck
pnpm --dir apps/web test
pnpm --dir apps/web build
```

## Security baseline

1. Never commit real secrets.
2. `apps/web/.env.local` stays local.
3. Destructive seed reset is local-only and requires `ALLOW_DESTRUCTIVE_SEED_RESET=true`.

## Contact and project links

1. GitHub profile: https://github.com/mimeonline
2. Project repository: https://github.com/mimeonline/system-graph-rag-lab
3. LinkedIn: https://www.linkedin.com/in/michael-meierhoff-b5426458/
4. Project inquiry page: https://meierhoff-systemde.de
