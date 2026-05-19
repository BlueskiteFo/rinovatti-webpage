# Reset de Identidad — Boilerplate limpia

Objetivo: dejar este repo sin rastro del cliente anterior, listo para clonar como base de cualquier web-app.

Al terminar todos los pasos, limpiar `.claude/` y `tasks/todo.md` para tener la plantilla final.

## Dependencias de fase

| Fase                           | Requiere                  |
| ------------------------------ | ------------------------- |
| 1 — Limpieza y estructura base | — (punto de partida)      |
| 2 — Componentes UI con shadcn  | Fase 1 completa           |
| 3 — Auth UI                    | Fase 2 completa           |
| 4 — Validación con Zod         | Fase 3 completa           |
| 5 — Multi-tenancy base         | Fase 3 + Fase 4 completas |
| 6 — Supabase Realtime          | Fase 5 completa           |

---

## Fase 1 — Limpieza y estructura base ✅

> Eliminar todo rastro del cliente anterior y dejar el esqueleto listo para clonar.

### Estructura del proyecto

- [x] Migración a `src/` — `app/`, `lib/`, `proxy.ts` movidos a `src/`
- [x] Carpetas vacías creadas con `.gitkeep`: `components/ui`, `components/shared`, `hooks`, `types`, `actions`
- [x] `tsconfig.json` — alias `@/*` actualizado a `./src/*`
- [x] `proxy.ts` movido a `src/proxy.ts` (requerido por Next.js con `src/`)

### Sistema de instrucciones IA

- [x] `.claude/CLAUDE.md` — estructura actualizada, tabla de división de responsabilidades IA añadida
- [x] `.claude/memory/schema.md` — plantilla vacía lista para el próximo proyecto
- [x] `.cursor/rules/` — 5 archivos `.mdc` creados (project, typescript, components, api-routes, server-actions)
- [x] `.cursorrules` legacy eliminado
- [x] Bugs corregidos en reglas: nombre de función `createSupabaseServerClient`, ruta de schema, Lección 002

### Documentación de desarrollo

- [x] `tasks/lessons.md` — lecciones generalizadas, Lección 002 corregida (patrón Supabase SSR)
- [x] `tasks/lessons.md` — Lección 004: patrón `src/` y alias `@/*` agregada. Añadida también Lección 005 (getUser vs getSession)

### Identidad del proyecto

- [x] `package.json` — nombre `eassy-apps-boilerplate`, descripción limpia
- [x] **Logos e imágenes** — `public/` solo contiene SVGs genéricos de Next.js, sin assets del cliente anterior
- [x] **Metadatos de la app** — `src/app/layout.tsx`: title y description actualizados

### Código fuente

- [x] **Nombres hardcodeados** — eliminados: rutas y referencias al cliente anterior
- [x] **Rutas específicas del cliente** — eliminadas
- [x] **Componentes de negocio** — todos eliminados junto con sus rutas
- [x] **`src/app/page.tsx`** — reemplazada: página de bienvenida neutra
- [x] **`src/lib/supabase.ts`** — eliminado; quedan solo `supabase-browser.ts` y `supabase-server.ts` (SSR-safe)

### Entorno y base de datos

- [x] **`.env.example`** — creado con variables Supabase documentadas
- [x] **`.env.local` en `.gitignore`** — cubierto por `.env*` + excepción `!.env.example`
- [x] **Limpieza de Supabase** — dashboard limpio, listo para proyecto nuevo

### Dependencias base

- [x] `zod` instalado como dependencia base — requerido por todas las API Routes y Server Actions

### Cierre

- [x] `README.md` — reemplazado con documentación del boilerplate
- [x] Verificar `git status` — sin archivos sensibles sin gitignorear
- [x] `src/proxy.ts` — generalizado: array `protectedRoutes`, redirect a `/login`
- [x] Reiniciado a boilerplate

---

## Fase 2 — Componentes UI primitivos con shadcn/ui ✅

> **Hacer esto antes que Auth UI.** shadcn copia el código al repo (no es dependencia externa), usa Radix UI headless como base, e incluye accesibilidad correcta desde el día uno. Sin estos primitivos, Cursor inventa estilos propios en cada componente — exactamente lo que el boilerplate quiere evitar.
> `lucide-react` llega como dependencia automática de shadcn — no instalar por separado.

**Decisión arquitectónica (aplicada):** `style=radix-luma` (preset Luma sobre Radix, elegido al ejecutar `init`), `baseColor=neutral`, **CSS variables = yes**, `radius=0.625rem` (valor por defecto del preset Luma). Razón: las variables se sobrescriben por proyecto editando ~10 líneas de `globals.css`, y dejan dark mode prácticamente gratis (`.dark { --background: ... }`). `neutral` es la paleta más agnóstica de marca. Luma usa el paquete `radix-ui` unificado (no `@radix-ui/*` separados) y el patrón `Slot.Root` + `data-slot` en lugar de `forwardRef`.

- [x] `npx shadcn@latest init` — preset Luma sobre Radix (variables en `@theme` de `globals.css`)
- [x] Verificar que `components.json` quedó con `tsx: true`, `rsc: true`, alias `@/components` y `@/lib/utils`
- [x] Instalar componentes base en una sola tanda: `button`, `input`, `label`, `select`, `badge`, `card`, `dialog`, `sonner`, `skeleton`
- [x] Confirmar que `lucide-react` quedó en `dependencies` (llega con shadcn)
- [x] Smoke test: `<Button>` renderizado en `src/app/page.tsx` + `npm run build` limpio
- [x] Actualizar `.cursor/rules/02-components.mdc` — patrón Luma (`radix-ui` unificado, `Slot.Root`, `data-slot`), no `forwardRef`
- [x] Actualizar `CLAUDE.md` — nota: "shadcn ya inicializado — usar `npx shadcn@latest add <componente>` para agregar nuevos; no instalar otras librerías UI"

---

## Fase 3 — Auth UI (desbloqueante para cualquier app B2B) ✅

> Sin estas páginas, "autenticación lista" no es cierto. Son el 60% del trabajo de auth.
> Requiere Fase 2 completa — usa Button, Input, Card de shadcn.

**Infraestructura (Claude Code) ✅**

- [x] `src/lib/utils/index.ts` — `safeRedirect()` agregado: valida rutas internas, fallback a `DEFAULT_AUTH_REDIRECT`
- [x] `src/app/(auth)/callback/route.ts` — handler OAuth/magic link: `exchangeCodeForSession` + `safeRedirect`
- [x] Carpetas `src/app/(auth)/login/` y `src/app/(auth)/register/` creadas

**UI + lógica ✅**

- [x] `src/actions/auth.ts` — `loginAction`, `registerAction`, `logoutAction` con Zod + `createSupabaseServerClient()`
- [x] `src/components/shared/LoginForm.tsx` — Client Component con `useActionState`, shadcn Card/Input/Label/Button
- [x] `src/components/shared/RegisterForm.tsx` — mismo patrón
- [x] `src/app/(auth)/login/page.tsx` — Server Component, lee `searchParams` como Promise (Next.js 16)
- [x] `src/app/(auth)/register/page.tsx` — mismo patrón
- [x] `proxy.ts` — generalizado en Fase 1: array `protectedRoutes`, redirect a `/login` con `redirectTo` preservado
- [x] Probar flujo completo: login → sesión → logout → redirect correcto, incluido deep-link con `redirectTo`

---

## Fase 4 — Validación estructurada con Zod

> Zod ya está instalado (Fase 1). Esta fase establece los patrones de uso que Cursor replicará en cada proyecto.
> Requiere Fase 3 completa.

**Decisión cerrada:** el ejemplo de API Route va en `.cursor/rules/03-api-routes.mdc` como código inline (no ejecutable), igual que los patrones de Server Actions en `04-server-actions.mdc`. Razón: un `route.ts` ejecutable puede quedar activo en producción por error; los docs de Cursor ya sirven como referencia suficiente. `src/actions/auth.ts` es la referencia real de Server Actions (Patrón A).

- [x] ~~`npm install zod`~~ — instalado en Fase 1
- [x] Patrón de Server Actions documentado — dos variantes (useActionState y programático) en `04-server-actions.mdc` y `CLAUDE.md`
- [ ] Documentar patrón Zod para API Routes en `.cursor/rules/03-api-routes.mdc` con ejemplo concreto (`safeParse`, `{ data, error }`, `createSupabaseServerClient()`)

---

## Fase 5 — Multi-tenancy base (requerido para POS, inventario, dashboards multi-cliente)

> Sin esto cada proyecto nuevo resuelve aislamiento de datos desde cero.
> Requiere Fase 3 (auth funcionando) y Fase 4 (patrones Zod establecidos para los helpers de organización).

**Decisiones arquitectónicas (locked):**

- **Modelo:** 1 user → N organizations vía `organization_members` (cubre el 100% de los casos sin refactor; proyectos simples no muestran el selector y crean la org en el onboarding).
- **"Org activa" del usuario:** cookie httpOnly (`active_org`) con fallback a la primera org del user. **No** JWT custom claim — exigiría Edge Function para refresh y complejidad innecesaria al inicio.
- **RLS performante:** función `is_member_of(org_id uuid) returns boolean` marcada `SECURITY DEFINER STABLE`, usada en cada policy. Postgres la cachea por query y evita el subselect repetido en `auth.uid() IN (SELECT ...)`.
- **Onboarding:** trigger `on_auth_user_created` en `auth.users` que inserta una org default y la membership con `role='owner'`. Así proyectos sin selector siguen funcionando sin código extra.

**Tareas:**

- [ ] Documentar el schema base completo en `.claude/memory/schema.md` (tablas + RLS + trigger)
- [ ] Migration SQL: tablas `organizations`, `organization_members` (roles `owner | admin | member`), índices
- [ ] Función `is_member_of(org_id)` en SQL + RLS policies de ambas tablas
- [ ] Trigger `on_auth_user_created` que crea org + membership inicial
- [ ] Helper `getCurrentOrganization()` en `src/lib/organizations.ts` — lee cookie, valida membership con `getUser()`, fallback a primera org
- [ ] Helper `setActiveOrganization(orgId)` (Server Action) — valida membership antes de setear cookie
- [ ] Probar con 2 usuarios distintos: User A no debe ver datos de Org de User B
- [ ] Actualizar `.cursor/rules/` — toda query de negocio escopada por `organization_id`; nunca confiar en filtro de cliente

---

## Fase 6 — Supabase Realtime (POS, cocina, dashboards en vivo)

> Para POS↔Cocina y cualquier app que necesite actualizaciones sin refresh.
> Requiere Fase 5 — el hook filtra por `organization_id`.

- [ ] Crear `src/hooks/useRealtimeTable.ts` — hook genérico que suscribe a cambios de una tabla con filtro
- [ ] Ejemplo de uso: suscripción a `pedidos` filtrado por `organization_id`
- [ ] Documentar en `tasks/lessons.md` el patrón de cleanup de suscripción (evitar memory leaks)
- [ ] Probar con Supabase Dashboard que los eventos llegan correctamente

---

## Módulos opcionales

Ver `tasks/modules.md` — catálogo de integraciones por proyecto.
Activar los que apliquen al inicio de cada proyecto nuevo.
