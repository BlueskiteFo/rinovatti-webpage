# Eassy Boilerplate

Esqueleto B2B reutilizable — Next.js App Router + Supabase.

## Stack

- **Next.js** (App Router) — TypeScript strict
- **Supabase** — PostgreSQL + Auth SSR (`@supabase/ssr`)
- **Tailwind CSS v4** — sin archivo de config
- **shadcn/ui** — componentes UI (Radix UI + lucide-react)
- **Zod** — validación de input en API Routes y Server Actions
- **Vercel** — hosting

## Arrancar un proyecto nuevo

1. Clonar este repo
2. Copiar `.env.example` → `.env.local` y completar las variables
3. `npm install`
4. Inicializar shadcn/ui — copia los componentes base al repo:
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add button input select badge card dialog sonner skeleton
   ```
   > Zod ya viene instalado — no requiere paso extra.
5. Conectar el proyecto a tu instancia de Supabase
6. `npm run dev`

## Estructura

```
src/
├── app/
│   ├── actions/        ← Server Actions centralizadas
│   ├── api/            ← API Routes
│   ├── (rutas)/        ← Páginas del App Router
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/             ← Primitivos shadcn/ui (Button, Input, Card…)
│   └── shared/         ← Compuestos con lógica de negocio
├── hooks/              ← Custom React hooks
├── lib/                ← Clientes Supabase
│   ├── supabase-server.ts
│   └── supabase-browser.ts
├── proxy.ts            ← Auth SSR
└── types/              ← Tipos globales
```

## Variables de entorno

Ver `.env.example` para la lista completa con descripción de cada variable.

## Fases de construcción

El boilerplate se completa por fases. Ver `tasks/todo.md` para el estado actual:

| Fase | Contenido                           | Estado      |
| ---- | ----------------------------------- | ----------- |
| 1    | Limpieza, estructura base, Zod      | ✅ Completa |
| 2    | shadcn/ui init + componentes base   | ⬅ Siguiente |
| 3    | Auth UI (login, register, callback) | Pendiente   |
| 4    | Patrones Zod + example route        | Pendiente   |
| 5    | Multi-tenancy (organizations + RLS) | Pendiente   |
| 6    | Supabase Realtime                   | Pendiente   |

## División de responsabilidades IA

| IA              | Rol                                            |
| --------------- | ---------------------------------------------- |
| **Claude Code** | Arquitectura, estructura, schema DB, config    |
| **Cursor**      | Componentes, hooks, Server Actions, API Routes |

Ver `.claude/CLAUDE.md` y `.cursor/rules/` para las reglas completas.
