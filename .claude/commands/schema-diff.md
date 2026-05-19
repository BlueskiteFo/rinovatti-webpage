---
description: Compara el schema documentado en .claude/memory/schema.md con el estado real del proyecto
---

## Protocolo

1. Lee `.claude/memory/schema.md` — schema documentado
2. Lee `src/types/database.ts` si existe — tipos generados desde Supabase
3. Busca en `src/` referencias a tablas (`supabase.from('...')`) y compara contra lo documentado
4. Si el usuario tiene CLI de Supabase instalado, sugerir `npx supabase db diff` para comparación real con la DB remota

## Entrega

```
## Schema Diff

### Tablas documentadas pero no encontradas en código
- <tabla> — mencionada en schema.md, sin uso en src/

### Tablas usadas en código pero no documentadas
- <tabla> en <archivo>:<línea> — agregar a schema.md

### Desalineación de columnas
- <tabla>.<columna> — docs dicen X, types dicen Y

### Siguiente acción sugerida
- Regenerar tipos: `npm run db:types`
- Invocar agente `schema-architect` si hay cambios no documentados
```

**No edites `schema.md` automáticamente** — delegar al agente `schema-architect` para cambios formales.
