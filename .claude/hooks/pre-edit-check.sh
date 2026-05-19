#!/usr/bin/env bash
# Pre-edit hook — se ejecuta antes de cada Edit/Write
# Propósito: recordar a Claude leer docs relevantes antes de editar archivos críticos

set -euo pipefail

# Leer el input JSON del hook desde stdin
INPUT=$(cat)

# Extraer path del archivo a editar (jq si está disponible, fallback a grep)
if command -v jq &> /dev/null; then
  FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')
else
  FILE_PATH=$(echo "$INPUT" | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/')
fi

[ -z "$FILE_PATH" ] && exit 0

# Reglas según tipo de archivo
case "$FILE_PATH" in
  */proxy.ts|*/lib/supabase-*.ts)
    echo "⚠️  Archivo crítico de auth. Verificar Lección 002 y 005 en tasks/lessons.md antes de editar." >&2
    ;;
  */actions/*)
    echo "ℹ️  Server Action. Skill relevante: server-action-patterns. Elegir Patrón A o B." >&2
    ;;
  */components/ui/*)
    echo "ℹ️  Primitivo shadcn. Skill relevante: shadcn-luma (patrón Slot.Root + data-slot, NO forwardRef)." >&2
    ;;
  *.sql|*schema.md)
    echo "⚠️  Cambio de schema. Considerar invocar al agente schema-architect." >&2
    ;;
  *.env*)
    # Defensa en profundidad además del deny en settings.json
    echo "🚫 No editar archivos .env directamente. Usar .env.example como plantilla." >&2
    exit 2
    ;;
esac

exit 0
