#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

docker compose -f docs/ops/docker-compose.local.yml down
echo "Lokale Neo4j-Umgebung wurde gestoppt."
