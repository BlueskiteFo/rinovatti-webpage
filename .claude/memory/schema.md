# Schema — Boilerplate B2B

## Estado: 🟡 Planeado (se aplica en Fase 5)

> Este archivo documenta el schema **base** del boilerplate — multi-tenancy.
> Cada proyecto nuevo extiende este schema con sus tablas de negocio, todas con `organization_id`.

---

## Tablas base (Fase 5)

### `organizations`

| campo | tipo | notas |
|---|---|---|
| id | uuid | PK, default `gen_random_uuid()` |
| name | text | not null |
| slug | text | unique, lowercase, kebab-case |
| created_at | timestamptz | default `now()` |
| created_by | uuid | FK `auth.users(id)`, on delete set null |

### `organization_members`

| campo | tipo | notas |
|---|---|---|
| id | uuid | PK, default `gen_random_uuid()` |
| organization_id | uuid | FK `organizations(id)` on delete cascade |
| user_id | uuid | FK `auth.users(id)` on delete cascade |
| role | text | check in (`owner`, `admin`, `member`), default `member` |
| created_at | timestamptz | default `now()` |

**Índices:**
- `unique (organization_id, user_id)` — un user no puede ser miembro dos veces de la misma org
- `index (user_id)` — para queries del helper `getCurrentOrganization()`

---

## RLS — Patrón estándar

Función helper compartida (evita el subselect repetido y hace las policies ~10× más rápidas):

```sql
create or replace function is_member_of(org_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from organization_members
    where organization_id = org_id
      and user_id = auth.uid()
  );
$$;
```

**Policies sobre `organizations`:**
- `select`: `is_member_of(id)`
- `update`: `exists (select 1 from organization_members where organization_id = id and user_id = auth.uid() and role in ('owner', 'admin'))`
- `delete`: solo `role = 'owner'`

**Policies sobre `organization_members`:**
- `select`: `is_member_of(organization_id)`
- `insert/update/delete`: solo `owner` y `admin` de esa org

**Toda tabla de negocio futura:**
```sql
alter table <tabla> enable row level security;
create policy "members_only" on <tabla>
  for all using (is_member_of(organization_id));
```

---

## Trigger de onboarding

Cuando un user se registra, crear su org default + membership:

```sql
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  new_org_id uuid;
begin
  insert into organizations (name, slug, created_by)
  values (
    coalesce(new.raw_user_meta_data->>'organization_name', 'Mi organización'),
    'org-' || substr(new.id::text, 1, 8),
    new.id
  )
  returning id into new_org_id;

  insert into organization_members (organization_id, user_id, role)
  values (new_org_id, new.id, 'owner');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

---

## Constraints críticos

- Toda tabla de negocio debe tener `organization_id uuid not null references organizations(id) on delete cascade`
- Toda query del lado servidor debe pasar por el helper `getCurrentOrganization()` — no hardcodear ids
- El cliente nunca envía `organization_id` en el body — se infiere del usuario autenticado en el server

---

## "Org activa" del usuario

- Cookie httpOnly `active_org` (uuid)
- Fallback: primera org de `organization_members` ordenada por `created_at`
- Server Action `setActiveOrganization(orgId)` valida membership antes de setear

---

## Seed data

> Pendiente — el trigger crea automáticamente org y membership al primer signup.
> No requiere seed manual para que el boilerplate sea usable.
