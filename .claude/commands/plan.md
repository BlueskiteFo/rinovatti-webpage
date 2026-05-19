---
description: Arranca una tarea en plan mode siguiendo el workflow del proyecto
argument-hint: [descripción de la tarea]
---

Tarea solicitada: $ARGUMENTS

## Protocolo de arranque

1. Lee `tasks/todo.md` — identifica la fase actual y las tareas pendientes
2. Lee `tasks/lessons.md` — revisa si hay lecciones aplicables
3. Lee `.claude/memory/schema.md` — si la tarea toca DB
4. Lee `.claude/memory/decisions.md` — si la tarea impacta decisiones arquitectónicas
5. Si es trabajo con Next.js, consulta `node_modules/next/dist/docs/` antes de asumir APIs

## Entrega

Produce un plan con:

- **Fase del proyecto** que toca esta tarea
- **Archivos que se van a crear o modificar** (lista concreta)
- **Riesgos** identificados desde `lessons.md`
- **Orden de ejecución** paso a paso
- **Verificación** al final (lint, build, smoke test)

**No ejecutes ningún edit hasta que el usuario apruebe el plan.**
