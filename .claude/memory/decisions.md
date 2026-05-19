# Decisiones arquitectónicas (ADRs)

Registro corto de decisiones que afectan >1 archivo o sientan patrón. Formato: qué, por qué, alternativas descartadas.

No borrar decisiones obsoletas — marcar `[SUPERSEDED por ADR-NNN]`.

---

## ADR-001 — `src/` como raíz del código

**Decisión:** todo el código vive en `src/`, incluido `proxy.ts`.
**Por qué:** separación clara código vs config; requerido por Next.js para que `proxy.ts` funcione dentro de `src/`.
**Alternativa descartada:** raíz plana — mezcla config con código, peor al clonar.
**Consecuencia:** alias `@/*` apunta a `./src/*` en `tsconfig.json`.

---

## ADR-002 — shadcn/ui preset Luma, no estándar

**Decisión:** `style: "radix-luma"`, `baseColor: neutral`, CSS variables activas.
**Por qué:** paquete `radix-ui` unificado, patrón `Slot.Root` + `data-slot` moderno (sin `forwardRef`), dark mode prácticamente gratis vía `.dark { --var }`.
**Alternativa descartada:** shadcn clásico con `@radix-ui/react-*` individuales y `forwardRef` — más boilerplate, más imports.
**Consecuencia:** ver skill `shadcn-luma` para el patrón obligatorio.

---

## ADR-003 — Multi-tenancy: 1 user → N organizations

**Decisión:** modelo `organization_members` con roles `owner | admin | member`. Org activa en cookie httpOnly `active_org`.
**Por qué:** cubre 100% de casos sin refactor. Proyectos simples ocultan el selector y crean la org en onboarding.
**Alternativa descartada:** 1 user → 1 org — requiere migration dolorosa cuando aparece el primer cliente con múltiples negocios.
**Alternativa descartada:** JWT custom claim para org activa — exige Edge Function para refresh, complejidad innecesaria.
**Consecuencia:** toda tabla de negocio lleva `organization_id`. Helper `is_member_of(org_id)` marcado `SECURITY DEFINER STABLE` en RLS.

---

## ADR-004 — Server Actions en dos patrones, no uno

**Decisión:** Patrón A (`useActionState` con `FormState`) para formularios; Patrón B (`{ data, error }` programático) para mutaciones desde handlers.
**Por qué:** los dos casos tienen ergonomía muy distinta. Forzar uno solo empeora uno de los dos.
**Alternativa descartada:** todo con `{ data, error }` — pierde `pending` automático y errores de campo nativos del form.
**Consecuencia:** ver skill `server-action-patterns` para cuándo usar cada uno.

---

## ADR-005 — `getUser()` siempre, `getSession()` nunca en server

**Decisión:** todo código server-side (proxy, Server Components, API Routes, Server Actions) usa `getUser()`.
**Por qué:** `getSession()` lee cookie sin validar JWT contra Supabase — bypass de auth posible con cookie forjada.
**Consecuencia:** Supabase cachea `getUser()` por request, así que llamarlo en proxy + página no duplica round-trip. `getSession()` queda reservado a client components.
**Ver:** Lección 005 en `tasks/lessons.md`.

---

## ADR-006 — Estructura `.claude/` con skills + agents + commands

**Decisión:** `CLAUDE.md` adelgazado (solo contexto). Reglas de código en `skills/` on-demand. Subagentes especializados en `agents/`. Slash commands en `commands/`.
**Por qué:** cargar reglas on-demand ahorra contexto en tareas simples. Subagentes mantienen contexto limpio por dominio.
**Alternativa descartada:** todo en `CLAUDE.md` monolítico — cada request carga 500+ líneas aunque sea para cambiar un string.
**Consecuencia:** agregar nueva regla de código → skill nueva, no editar `CLAUDE.md`.