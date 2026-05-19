# Lessons Learned — Boilerplate

## Índice

| #                                                                                           | Área                    | Título                                                                     |
| ------------------------------------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------- |
| [001](#lección-001--event-handlers-en-server-components)                                    | Next.js App Router      | Event handlers en Server Components                                        |
| [002](#lección-002--auth-loop-infinito-por-mismatch-localstorage--cookies)                  | Supabase + Next.js SSR  | Auth loop infinito por mismatch localStorage / cookies                     |
| [003](#lección-003--column-reference-ambiguous-en-queries-con-joins)                        | PostgreSQL / SQL        | Column reference ambiguous en queries con joins                            |
| [004](#lección-004--alias--y-estructura-src)                                                | Estructura del proyecto | Alias `@/*` y estructura `src/`                                            |
| [005](#lección-005--getsession-vs-getuser-en-código-de-servidor)                            | Supabase — Seguridad    | `getSession()` vs `getUser()` en código de servidor                        |
| [006](#lección-006--middlewarets-no-se-usa--leer-agentsmd-antes-de-nextjs)                  | Next.js — Arquitectura  | `middleware.ts` no se usa — leer `AGENTS.md` primero                       |
| [007](#lección-007--rutas-404-tras-reorganización-de-carpetas-turbopack)                    | Next.js — Turbopack     | Rutas 404 tras reorganización de carpetas (Turbopack)                      |
| [008](#lección-008--ux-en-formularios-de-auth-con-server-actions)                           | UX — Formularios        | UX en formularios de auth con Server Actions                               |
| [009](#lección-009--route-groups-nombre-solo-cuando-el-segmento-no-debe-aparecer-en-la-url) | Next.js App Router      | Route groups `(nombre)` solo cuando el segmento NO debe aparecer en la URL |

## Formato

- **Qué pasó**: descripción del error o corrección
- **Por qué**: causa raíz
- **Regla**: lo que Claude debe hacer diferente

---

## Next.js App Router

### Lección 001 — Event handlers en Server Components

- **Qué pasó**: Se usaron `onMouseEnter`/`onMouseLeave` en server components
- **Por qué**: App Router no permite event handlers en server components — solo los client components (`"use client"`) pueden registrar eventos del DOM
- **Regla**: Usar clases Tailwind `hover:` para efectos visuales en server components. Agregar `"use client"` solo cuando hay estado real (`useState`, `useEffect`) o eventos de lógica de negocio, no para CSS hover

---

## Supabase + Next.js SSR

### Lección 002 — Auth loop infinito por mismatch localStorage / cookies

- **Qué pasó**: Login exitoso quedaba colgado en un loop de redirección infinita
- **Por qué**: `createClient` de `@supabase/supabase-js` guarda la sesión en **localStorage**. El proxy con `@supabase/ssr` lee **cookies**. Después del login, el proxy no encontraba sesión en cookies y redirigía de vuelta al login
- **Regla**: Usar siempre los wrappers del proyecto. En client components: `createSupabaseBrowserClient()` de `@/lib/supabase-browser`. En server components, API Routes y Server Actions: `createSupabaseServerClient()` de `@/lib/supabase-server`. No usar `createClient` de `@supabase/supabase-js` directamente — no maneja cookies y rompe la sesión SSR

---

## PostgreSQL / SQL

### Lección 003 — Column reference ambiguous en queries con joins

- **Qué pasó**: Error de columna ambigua en SQL con subquery + cross join
- **Por qué**: Dos tablas tenían una columna con el mismo nombre; PostgreSQL no sabe cuál usar
- **Regla**: Siempre prefixar columnas con alias de tabla en queries con joins o subqueries

---

## Estructura del proyecto

### Lección 004 — Alias `@/*` y estructura `src/`

- **Qué pasó**: Imports rotos al mover archivos a `src/` sin actualizar `tsconfig.json`
- **Por qué**: Next.js resuelve `@/*` desde la raíz por defecto; al usar `src/` hay que apuntarlo explícitamente a `./src/*`
- **Regla**: En proyectos con `src/`, el alias en `tsconfig.json` debe ser `"@/*": ["./src/*"]`. Verificar esto al inicializar cualquier proyecto nuevo sobre el boilerplate

---

## Supabase — Seguridad

### Lección 005 — `getSession()` vs `getUser()` en código de servidor

- **Qué pasó**: Middleware usaba `getSession()` para verificar autenticación
- **Por qué**: `getSession()` lee la cookie sin validarla contra el servidor — un cookie manipulado puede bypassear la auth completamente. `getUser()` hace una llamada al servidor Supabase para verificar el JWT
- **Regla**: Usar siempre `getUser()` en código del servidor — `proxy.ts`, Server Components, API Routes y Server Actions. Valida el JWT contra el servidor de Supabase; un token manipulado no pasa. Supabase cachea la respuesta dentro del mismo request, por lo que llamarlo en proxy y luego en la página no duplica el round-trip.
  - **`getSession()`** queda reservada para **client components** (lectura pasiva del estado de sesión en el browser). Nunca usarla en el servidor: aunque parezca segura porque el proxy ya corrió `getUser()` aguas arriba, esa garantía depende del matcher del proxy — si alguien lo cambia para excluir una ruta pública, la invariante se rompe silenciosamente. `getUser()` no tiene ese footgun.

---

## Next.js — Arquitectura

### Lección 006 — `middleware.ts` no se usa — leer `AGENTS.md` antes de Next.js

- **Qué pasó**: Claude creó `src/middleware.ts` para "activar" el proxy de auth, y trabajó sobre Next.js sin consultar la documentación local actualizada
- **Por qué**: Asumió que `proxy.ts` necesita un `middleware.ts` que lo importe — no es así. Además, el conocimiento de entrenamiento sobre Next.js está desactualizado; `src/AGENTS.md` existe precisamente para apuntar a los docs correctos en `node_modules/next/dist/docs/`
- **Regla**: Antes de cualquier trabajo Next.js: (1) leer `src/AGENTS.md` para obtener el puntero al doc local correcto, (2) leer ese doc en `node_modules/next/dist/docs/`. No crear `middleware.ts` — el auth SSR de este proyecto vive en `proxy.ts` y no requiere ningún archivo intermediario de Next.js

---

## Next.js — Turbopack

### Lección 007 — Rutas 404 tras reorganización de carpetas (Turbopack)

- **Qué pasó**: Durante una refactorización (en ese caso específico, renombrar `auth/` a `(auth)/` y mover `app/actions/` a `actions/`), todas las rutas afectadas devolvían 404 en `next dev`. Borrar solo `.next/` no solucionaba el problema.
- **Por qué**: Turbopack FileSystem Cache persiste estado de módulos y rutas entre sesiones en `.next/`. Cualquier reorganización de carpetas en `app/` puede dejar el cache en estado inconsistente — especialmente renombrados. Borrar solo `.next/` no es suficiente si `node_modules/.cache` tiene estado residual.
- **Regla general**: Después de **cualquier** reorganización de carpetas en `app/` (renombrar, mover, cambiar a/desde route groups), hacer limpieza completa antes de reiniciar:

```bash
  rm -rf .next node_modules package-lock.json
  npm install
  npm run dev
```

Si las rutas siguen dando 404 tras la limpieza, verificar que los archivos `page.tsx` existen en las rutas correctas con `git ls-files src/app/`.

---

## UX — Formularios

### Lección 008 — UX en formularios de auth con Server Actions

- **Qué pasó**: Durante las pruebas manuales de Fase 3 se detectaron dos fricciones de UX en los formularios de login y registro:
  1. Los mensajes de validación de campo (`type="email"`, `required`) aparecen en el idioma del browser, no en el de la app.
  2. Al retornar un error desde el Server Action, todos los campos del formulario se vacían — el usuario debe reescribir el email aunque solo falló la contraseña.
- **Por qué**:
  1. Los atributos HTML5 (`type="email"`, `required`) disparan la validación nativa del browser antes de que el form llegue al Server Action — el browser usa su propio locale.
  2. Con `useActionState` + Server Actions, el formulario no es controlado: React no persiste los valores de los inputs entre renders causados por el estado del action.
- **Regla**: Al construir formularios de auth (o cualquier form con Server Actions y múltiples campos):
  1. Para mensajes en el idioma de la app: quitar `type="email"` y `required` nativos y delegar toda validación a Zod en el Server Action. Perder la validación inline es aceptable porque Zod responde antes del round-trip completo gracias al optimistic UI de `useActionState`.
  2. Para preservar el email en error: guardar el email en el `FormState` que retorna el action (`state.values?.email`) y usarlo como `defaultValue` del input. La contraseña **nunca** se preserva por seguridad.

---

## Next.js App Router

### Lección 009 — Route groups `(nombre)` solo cuando el segmento NO debe aparecer en la URL

- **Qué pasó**: Se planeó renombrar `app/dashboard/` a `app/(dashboard)/` porque `todo.md` usaba esa notación, sin evaluar si el route group era necesario.
- **Por qué**: Se copió el path del `todo.md` literalmente sin cuestionar la notación. Un route group en `dashboard` no aporta nada porque `/dashboard` sí debe aparecer en la URL — un `layout.tsx` en `app/dashboard/` funciona exactamente igual.
- **Regla**: Usar route groups `(nombre)` solo cuando el nombre de la carpeta **no debe** aparecer en la URL (ej: `(auth)` agrupa `/login` y `/register` sin prefijo `/auth/`). Si el segmento de URL es deseado, usar carpeta normal con `layout.tsx`. Cuando `todo.md` o cualquier spec use notación `(nombre)`, validar antes de ejecutar si el route group es realmente necesario.
