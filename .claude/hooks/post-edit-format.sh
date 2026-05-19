#!/usr/bin/env bash
# Post-edit hook — se ejecuta después de cada Edit/Write
# Propósito: formatear automáticamente código TS/TSX editado

set -euo pipefail

INPUT=$(cat)

if command -v jq &> /dev/null; then
  FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')
else
  FILE_PATH=$(echo "$INPUT" | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/')
fi

[ -z "$FILE_PATH" ] && exit 0
[ ! -f "$FILE_PATH" ] && exit 0

# Solo formatear TS/TSX/JS/JSON/CSS/MD en el proyecto
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.mjs|*.jsx|*.json|*.css|*.md)
    if command -v npx &> /dev/null; then
      # Silencioso en éxito, muestra error solo si falla
      npx prettier --write "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
esac

exit 0
