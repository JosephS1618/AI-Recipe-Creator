#!/usr/bin/env bash
set -euo pipefail

DATABASE_NAME="cpsc_304_project"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SETUP_SQL="$SCRIPT_DIR/../sql/setup.sql"

createdb "$DATABASE_NAME" 2>/dev/null || true

psql -d "$DATABASE_NAME" -v ON_ERROR_STOP=1 -f "$SETUP_SQL"

echo "$DATABASE_NAME is set up"
