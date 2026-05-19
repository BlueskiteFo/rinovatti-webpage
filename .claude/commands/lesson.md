---
description: Añade una nueva lección a tasks/lessons.md y su entrada condensada en .claude/memory/lessons-llm.md
argument-hint: [qué pasó brevemente]
---

Contexto: $ARGUMENTS

## Protocolo

1. Lee `tasks/lessons.md` y `.claude/memory/lessons-llm.md`
2. Cuenta cuántas lecciones numeradas hay en `tasks/lessons.md` — la nueva será `Lección NNN` con el siguiente número
3. Identifica la categoría correcta en `tasks/lessons.md` (sección existente o crear una nueva)
4. Genera ambas entradas:

**Para `tasks/lessons.md`** — formato completo:

```md
### Lección NNN — <título corto>

- **Qué pasó**: <descripción del error o corrección>
- **Por qué**: <causa raíz>
- **Regla**: <lo que Claude debe hacer diferente>
```

**Para `.claude/memory/lessons-llm.md`** — una línea, misma posición ordinal:

```md
- **<Área clave>**: <regla accionable en ≤ 20 palabras>
```

5. Propón ambos diffs al usuario antes de aplicar
6. Una vez aprobado, aplicar `Edit` sobre los dos archivos en paralelo

## Reglas

- No renumerar lecciones existentes
- Si la lección ya existe con otro número, decirlo y no duplicar
- Si la causa raíz no está clara, pedir al usuario que la explique antes de escribir
- El orden de entradas en `lessons-llm.md` debe coincidir con el orden numérico de `tasks/lessons.md`
