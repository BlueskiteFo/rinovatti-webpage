# Glosario del dominio

Términos que aparecen en código, docs y conversación. Si un término no está aquí, proponer agregarlo antes de usarlo con otro significado.

---

## Multi-tenancy

 ⚠️ Los términos de esta sección aplican a partir de Fase 5.
- **Organization (org):** tenant del sistema. Unidad de aislamiento de datos. Tabla `organizations`.
- **Member:** user vinculado a una org vía `organization_members`. Puede pertenecer a N orgs.
- **Role:** jerarquía `owner > admin > member`. Definida en `ORG_ROLES` (`@/lib/constants`).
- **Owner:** único rol que puede eliminar la org. Se asigna al creador vía trigger `handle_new_user`.
- **Active org:** org en contexto del user actual. Vive en cookie httpOnly `active_org`. Fallback: primera org por `created_at`.
- **`is_member_of(org_id)`:** función SQL helper para RLS. `SECURITY DEFINER STABLE` — cacheable por query.

## Auth

- **Sesión:** JWT de Supabase en cookie. Gestionado por `@supabase/ssr`.
- **`getUser()`:** valida JWT contra servidor Supabase. Obligatorio server-side.
- **`getSession()`:** lectura pasiva de cookie. Solo client-side.
- **`safeRedirect(path)`:** valida que `path` sea ruta interna. Fallback a `DEFAULT_AUTH_REDIRECT`.
- **`PROTECTED_ROUTES`:** array en `@/lib/constants`. Proxy redirige a login si no hay user.

## Componentes

- **Primitivo:** componente puro en `src/components/ui/`. Generado por `npx shadcn add`. No se escribe desde cero.
- **Shared:** compuesto con lógica de negocio en `src/components/shared/`. Importa primitivos.
- **Slot (Luma):** `Slot.Root` del paquete `radix-ui`. Permite `asChild` — delegar el elemento raíz.
- **`data-slot`:** atributo en cada subparte de un componente Luma. Permite targetear variantes externamente.

## Server Actions

- **Patrón A:** acción de formulario con `useActionState`. Firma `(prevState, formData) => FormState`.
- **Patrón B:** acción programática. Firma `(input) => { data, error }`.
- **`FormState`:** tipo que exporta la acción. El Client Component lo importa para tipar el hook.
- **`fieldErrors`:** errores por campo, provenientes de `zod.flatten().fieldErrors`.

## Base de datos

- **Schema:** `.claude/memory/schema.md` — documenta el estado esperado.
- **Migration:** SQL que lleva la DB de estado N a N+1. No se ejecuta destructivo sin confirmación.
- **RLS:** Row Level Security. Policy sobre cada tabla de negocio usando `is_member_of`.
- **Service role:** `SUPABASE_SERVICE_ROLE_KEY`. Bypassa RLS. Solo server-side, nunca con prefijo `NEXT_PUBLIC_`.

## Flujo de trabajo

- **Fase:** etapa del boilerplate en `tasks/todo.md`. 1-6 actualmente, ordenadas por dependencia.
- **Módulo:** integración opcional en `tasks/modules.md` (WhatsApp, Pagos, Realtime…). Se activa con `/new-module`.
- **Lección:** error aprendido en `tasks/lessons.md`. Numeración ascendente, no se reutilizan números.
- **ADR:** decisión arquitectónica en `.claude/memory/decisions.md`. Numeración ascendente.