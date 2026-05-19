---
description: Valida el estado de la fase actual del boilerplate
---

## Protocolo

1. Lee `tasks/todo.md`
2. Identifica la **fase activa** (la primera con tareas sin marcar `[x]`)
3. Para cada tarea sin completar de esa fase:
   - Verifica en el filesystem si ya está hecha (archivos existen, código presente)
   - Reporta discrepancias: "Tarea marcada pendiente pero el archivo X ya existe con el contenido correcto"
4. Para cada tarea marcada completa:
   - Validación rápida de que el archivo/código existe realmente

## Entrega

```
## Estado Fase N — <nombre>

### ✅ Verificadas como completas
- <tarea> → <archivo que lo prueba>

### ⚠️ Inconsistencias
- <tarea marcada> pero <problema>

### ⬜ Pendientes reales
- <tarea> — <próximo paso sugerido>

### 🚫 Bloqueantes para avanzar de fase
- <lista>
```

No modifiques `todo.md` automáticamente — solo reporta. El usuario decide si actualizar marcas.
