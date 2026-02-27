#!/usr/bin/env bash
set -euo pipefail

DATABASE_NAME="cpsc_304_project"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

MIGRATION_SQL="$SCRIPT_DIR/../sql/migrations/001_init.sql"
TEST_DATA_SQL="$SCRIPT_DIR/../sql/test_data/test_insert.sql"

createdb "$DATABASE_NAME" 2>/dev/null || true

psql -d "$DATABASE_NAME" -v ON_ERROR_STOP=1 -f "$MIGRATION_SQL"

psql -d "$DATABASE_NAME" -v ON_ERROR_STOP=1 -f "$TEST_DATA_SQL"

echo "$DATABASE_NAME is set up"