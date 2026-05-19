---
name: nextjs-app-router
description: Use when working with Next.js App Router — Server Components, Client Components, route handlers, layouts, loading/error boundaries, metadata, `searchParams`, or `proxy.ts`. Trigger on mentions of `page.tsx`, `layout.tsx`, `route.ts`, `'use client'`, or Next.js patterns.
---

# Next.js App Router — Convenciones del boilerplate

## Antes de escribir código Next.js

Consultar `node_modules/next/dist/docs/` — el conocimiento de entrenamiento está desactualizado. Estructura:

- `01-app/` → App Router
- `03-architecture/` → internals
- `index.md` → índice

## Server vs Client Components

**Server por defecto.** `"use client"` solo cuando hay:
- Estado (`useState`, `useReducer`)
- Efectos (`useEffect`, `useLayoutEffect`)
- Eventos del DOM (`onClick`, `onChange`, `onSubmit` — excepto `<form action={serverAction}>`)
- Hooks del navegador (`usePathname`, `useRouter` de `next/navigation`)

Si un Server Component necesita interactividad, **extraer solo la parte interactiva** a un Client Component hijo. No marcar toda la página como cliente.

```tsx
// ❌ Mal — convierte toda la página en cliente
'use client'
export default function Page() {
  const [open, setOpen] = useState(false)
  // ... mucho contenido estático
}

// ✅ Bien — página es Server, extrae interactivos
export default function Page() {
  const data = await fetchData() // server-side
  return (
    <main>
      <StaticHeader />
      <InteractiveWidget /> {/* este sí es 'use client' */}
    </main>
  )
}
```

## Event handlers NO van en Server Components

Lección 001 — `onMouseEnter`, `onClick`, etc. requieren `"use client"`. Para efectos visuales puros, usar Tailwind:

```tsx
// ✅ Server Component con hover CSS
<div className="hover:bg-muted transition-colors">...</div>

// ❌ Server Component con handler — error de runtime
<div onMouseEnter={() => ...}>...</div>
```

## `searchParams` y `params` son Promises (Next.js 15+)

```tsx
interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params
  const { q } = await searchParams
  // ...
}
```

## Archivos especiales (requieren `export default`)

Estos son los únicos archivos donde se usa `export default`:

- `page.tsx`, `layout.tsx`, `template.tsx`, `default.tsx`
- `route.ts` (usa `export async function GET/POST/...`)
- `error.tsx`, `global-error.tsx`, `not-found.tsx`
- `loading.tsx`

Todo lo demás: **named exports** (`export function Foo`).

## Metadata

```tsx
// Estática
export const metadata: Metadata = {
  title: 'Dashboard',
  description: '...',
}

// Dinámica
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Item ${id}` }
}
```

## Route Handlers (`route.ts`)

Estructura estándar del proyecto:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const Schema = z.object({ /* ... */ })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: 'Input inválido' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // ... lógica

    return NextResponse.json({ data: result, error: null }, { status: 200 })
  } catch {
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

Respuestas siempre `{ data, error }` — consistente con Server Actions.

## `proxy.ts` (en `src/proxy.ts`)

⚠️ Este proyecto usa `src/` — el archivo vive en `src/proxy.ts`, no en la raíz.
⚠️ Export **nombrado**: `export async function proxy(request)`, no default.
⚠️ Usar `createServerClient` inline con getters de cookies, no el wrapper — necesita acceso a request/response.

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { LOGIN_PATH, PROTECTED_ROUTES } from '@/lib/constants'

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })
  const supabase = createServerClient(/* ... */)

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = PROTECTED_ROUTES.some((r) => request.nextUrl.pathname.startsWith(r))
  if (isProtected && !user) {
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = { matcher: [/* ... */] }
```

## Rutas protegidas

Editar `PROTECTED_ROUTES` en `@/lib/constants` — nunca hardcodear rutas en `proxy.ts`.

## Cache y revalidación

- Después de mutación con Server Action: `revalidatePath('/ruta')` o `revalidateTag('tag')`
- Fetch con tags: `fetch(url, { next: { tags: ['items'] } })`
- Dynamic rendering forzado: `export const dynamic = 'force-dynamic'` (usar solo cuando sea necesario)
