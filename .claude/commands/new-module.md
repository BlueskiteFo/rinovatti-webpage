---
description: Activa un módulo opcional del catálogo tasks/modules.md copiando sus tareas a todo.md
argument-hint: [nombre del módulo — ej: "WhatsApp", "Pagos", "Realtime"]
---

Módulo a activar: $ARGUMENTS

## Protocolo

1. Lee `tasks/modules.md` — catálogo completo
2. Busca el módulo solicitado. Si no existe exactamente, proponer los más cercanos
3. Marca el módulo como `[x]` en la sección **"Módulos activos en este proyecto"** de `modules.md`
4. Copia las tareas del módulo (la sección `**Tareas a copiar en todo.md:**`) al final de `tasks/todo.md` bajo un nuevo header `## Módulo: <nombre>`
5. Si el módulo requiere variables de entorno (mencionadas en `modules.md`), recordar al usuario descomentarlas en `.env.example` y crear su `.env.local`
6. Si el módulo tiene dependencias con otros módulos o fases (ej: Realtime requiere Fase 5), avisar

## Entrega

```
## Módulo <nombre> activado

### Cambios aplicados
- tasks/modules.md: marcado [x]
- tasks/todo.md: N tareas añadidas

### Acciones manuales requeridas
- [ ] Descomentar variables en .env.example: <lista>
- [ ] Completar en .env.local
- [ ] Instalar dependencias: <lista si aplica>

### Dependencias con otras fases
- <nota>

### Siguiente paso sugerido
/plan <primera tarea del módulo>
```
