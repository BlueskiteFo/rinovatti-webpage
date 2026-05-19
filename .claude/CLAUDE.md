# Eassy Boilerplate B2B — Contexto del proyecto

Boilerplate reutilizable para web-apps B2B del mercado peruano. Debe poder clonarse como base sin arrastrar contexto de proyectos anteriores.

## Stack

- **Next.js 16.2+** (App Router) — TypeScript strict
- **Supabase** (PostgreSQL + Auth vía `@supabase/ssr`)
- **Tailwind CSS v4** (sin archivo de config)
- **shadcn/ui** preset Luma (`baseColor=neutral`, `radius=0.625rem`)
- **Zod** para validación
- **Vercel** hosting

## Estructura

```
src/
├── actions/      ← Server Actions (un archivo por dominio: auth.ts, items.ts…)
├── app/{api,(rutas)}
├── components/{ui,shared}
├── hooks/
├── lib/          ← clientes Supabase, constantes, utils/
├── proxy.ts      ← auth SSR (en src/, requerido por Next.js)
├── AGENTS.md     ← reglas para agentes de código (leer SIEMPRE antes de trabajo Next.js)
└── types/
```

Alias: `@/*` → `src/*`

## División de responsabilidades entre IAs

| IA                   | Rol                                                                       |
| -------------------- | ------------------------------------------------------------------------- |
| **Claude Code** (tú) | Arquitectura, estructura, schema DB, refactors >3 archivos, config        |
| **Cursor**           | Componentes, hooks, Server Actions, API Routes, lógica dentro de archivos |

- Reglas de Cursor viven en `.cursor/rules/` — no duplicar ni contradecir
- Si Cursor pregunta sobre arquitectura → redirigir a Claude Code
- Si Claude Code recibe pedido de UI/componente → redirigir a Cursor

## Flujo de trabajo (Boris Cherny)

### Antes de cualquier acción

1. Para trabajo Next.js: leer `src/AGENTS.md` → doc en `node_modules/next/dist/docs/`
2. Leer `tasks/todo.md` — plan y estado actual
3. Leer `tasks/lessons.md` — errores previos y patrones
4. Leer `.claude/memory/schema.md` — estado DB
5. Si cliente pide integración: leer `tasks/modules.md`

### Durante la ejecución

- Plan mode para cualquier tarea de 3+ pasos
- Si algo falla: STOP, re-planear, no empujar
- Una tarea por subagente, contexto limpio
- Nunca marcar tarea completa sin probar que funciona

### Después de cualquier acción

- Actualizar `tasks/todo.md`
- Corrección no trivial → usar `/lesson` (actualiza `tasks/lessons.md` y `.claude/memory/lessons-llm.md` en paralelo)
- Decisión arquitectónica → `.claude/memory/decisions.md`

## Skills disponibles (cargadas on-demand)

- `supabase-rls` — patrones RLS, multi-tenancy, queries seguras
- `server-action-patterns` — Patrón A (useActionState) y B (programático)
- `shadcn-luma` — convenciones del preset Luma (radix-ui unificado, Slot.Root, data-slot)
- `nextjs-app-router` — Server vs Client Components, route handlers, proxy

Cada skill vive en `.claude/skills/<nombre>/SKILL.md`.

## Subagentes disponibles

- `schema-architect` — cambios de DB, migrations, RLS
- `supabase-auditor` — auditar queries y policies por riesgos de seguridad
- `refactor-planner` — planificar refactors multi-archivo antes de ejecutar
- `docs-syncer` — mantener coherencia entre `CLAUDE.md`, `.cursor/rules/` y `skills/`

## Reglas globales obligatorias

- Sin `any` — usar `unknown` + narrowing
- Retorno async: `{ data, error }` — nunca `throw` en boundaries públicos
- Componentes: named exports. Excepción: archivos especiales de App Router
- `proxy.ts` usa export **nombrado** (`export async function proxy`)
- Constantes → `@/lib/constants`, nunca hardcodear
- Auth server-side: **siempre** `getUser()`, nunca `getSession()`
- Supabase: usar wrappers del proyecto, nunca `createClient` directo
- **Nada hardcodeado:** precios de delivery, radios, número WhatsApp, PIN → DB o env vars

## Multi-tenancy (activar cuando Fase 5 esté completa)

⚠️ No aplicar hasta que existan `organizations` y `organization_members` en DB.

- Queries escopadas a `organization_id`
- RLS activo en toda tabla de negocio
- Verificar membership en API Routes y Server Actions
