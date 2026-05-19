---
name: supabase-rls
description: Use when writing or reviewing code that queries Supabase tables, defines RLS policies, handles multi-tenancy with `organization_id`, or uses `createSupabaseServerClient()`/`createSupabaseBrowserClient()`. Trigger on mentions of RLS, row level security, policies, multi-tenancy, or `auth.uid()`.
---

# Supabase + RLS — Patrones del boilerplate

## Clientes: cuál usar dónde

| Contexto | Cliente |
|---|---|
| Server Component, API Route, Server Action | `createSupabaseServerClient()` de `@/lib/supabase-server` |
| Client Component, hook | `createSupabaseBrowserClient()` de `@/lib/supabase-browser` |
| `proxy.ts` | `createServerClient` inline (no usar el wrapper — necesita acceso a request/response cookies) |

**Nunca** usar `createClient` de `@supabase/supabase-js` directo — guarda sesión en localStorage y rompe SSR (Lección 002).

## Auth server-side: `getUser()` obligatorio

```ts
// ✅ Correcto — valida JWT contra servidor de Supabase
const { data: { user } } = await supabase.auth.getUser()
if (!user) return { data: null, error: 'Unauthorized' }

// ❌ Mal — lee cookie sin validar, bypass de auth posible
const { data: { session } } = await supabase.auth.getSession()
```

Razón: un cookie forjado puede tener sesión válida pero JWT inválido. `getUser()` hace round-trip al servidor. Supabase cachea la respuesta dentro del mismo request, así que llamarlo en proxy + page no duplica la llamada (Lección 005).

`getSession()` queda reservado solo para **client components** (lectura pasiva del estado en browser).

## Multi-tenancy (Fase 5+)

Toda tabla de negocio:

```sql
create table <tabla> (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  -- ... resto de columnas
  created_at timestamptz default now()
);

alter table <tabla> enable row level security;

create policy "members_only" on <tabla>
  for all using (is_member_of(organization_id));
```

Función helper (ya debe existir, marcada `SECURITY DEFINER STABLE`):

```sql
create or replace function is_member_of(org_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from organization_members
    where organization_id = org_id and user_id = auth.uid()
  );
$$;
```

## Regla de oro del cliente

**El cliente nunca envía `organization_id` en el body.** Se infiere del user autenticado en el server:

```ts
// ✅ Correcto
const orgId = await getCurrentOrganization() // lee cookie, valida membership
const { data } = await supabase.from('items').insert({ ...input, organization_id: orgId })

// ❌ Mal — user puede forjar organization_id de otra org
const { data } = await supabase.from('items').insert(input) // input viene del cliente
```

## Joins: prefixar columnas

Lección 003 — PostgreSQL tira `column reference ambiguous` si dos tablas tienen columna con el mismo nombre:

```ts
// ✅
.select('items.id, items.name, organizations.name as org_name')

// ❌ — error si ambas tablas tienen columna `name`
.select('id, name, organizations(name)')
```

## Service role

`SUPABASE_SERVICE_ROLE_KEY` bypassa RLS. Usos válidos:

- Triggers de onboarding (crear org inicial)
- Operaciones admin server-side
- Webhooks de terceros (pagos, WhatsApp)

**Nunca** con prefijo `NEXT_PUBLIC_`. Si aparece en código cliente → bandera roja crítica.

## Checklist antes de commitear código que toca Supabase

- [ ] `getUser()` no `getSession()` en server
- [ ] Wrapper del proyecto, no `createClient` directo
- [ ] Si la tabla tiene `organization_id`: filtro presente y derivado del server
- [ ] RLS activo en la tabla
- [ ] Columnas prefijadas en joins
- [ ] No hay `NEXT_PUBLIC_SERVICE_ROLE`
- [ ] Errores al cliente son genéricos, no `error.message` raw de Supabase
