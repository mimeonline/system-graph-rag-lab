#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="$ROOT_DIR/apps/web"
ENV_FILE="$WEB_DIR/.env.local"
ENV_EXAMPLE="$WEB_DIR/.env.example"

if ! command -v docker >/dev/null 2>&1; then
  echo "Fehler: docker ist nicht installiert oder nicht im PATH."
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "Fehler: pnpm ist nicht installiert oder nicht im PATH."
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  if [ -f "$ENV_EXAMPLE" ]; then
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    echo "Hinweis: $ENV_FILE wurde aus .env.example erstellt. Bitte Werte pruefen."
  else
    echo "Fehler: $ENV_FILE fehlt und $ENV_EXAMPLE wurde nicht gefunden."
    exit 1
  fi
fi

cd "$WEB_DIR"
set -a
source "$ENV_FILE"
set +a

NEO4J_USERNAME="${NEO4J_USERNAME:-neo4j}"
NEO4J_PASSWORD="${NEO4J_PASSWORD:-change-me}"
NEO4J_DATABASE="${NEO4J_DATABASE:-neo4j}"

export NEO4J_AUTH="$NEO4J_USERNAME/$NEO4J_PASSWORD"
export NEO4J_DATABASE
export ALLOW_DESTRUCTIVE_SEED_RESET=true

cd "$ROOT_DIR"
docker compose -f docs/ops/docker-compose.local.yml up -d

pnpm --dir "$WEB_DIR" install
pnpm --dir "$WEB_DIR" run seed:local:reset-reseed

echo "Neo4j laeuft und Seed ist eingespielt. Starte Dev-Server..."
pnpm --dir "$WEB_DIR" dev
