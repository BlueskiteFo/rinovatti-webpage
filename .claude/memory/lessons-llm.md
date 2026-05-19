# Lessons — LLM Rules

- **Next.js SC**: no event handlers → Tailwind `hover:`. `"use client"` solo para estado/lógica, nunca para CSS
- **Supabase client**: nunca `createClient` directo → `createSupabaseBrowserClient()` (client) / `createSupabaseServerClient()` (server/actions)
- **SQL joins**: siempre prefixar columnas con alias de tabla
- **tsconfig alias**: en proyectos con `src/` → `"@/*": ["./src/*"]`
- **Auth server**: `getUser()` siempre en servidor. `getSession()` solo en client components
- **Next.js changes**: leer `src/AGENTS.md` primero → luego doc local en `node_modules/next/dist/docs/`. No crear `middleware.ts`
- **Turbopack**: tras cualquier reorganización de carpetas en `app/` → `rm -rf .next node_modules package-lock.json && npm install`
- **Forms + Server Actions**: validación con Zod (no atributos HTML5). Persistir `email` en `FormState` en caso de error, nunca la contraseña
- **Route groups**: `(nombre)` solo si el segmento NO debe aparecer en la URL. Validar antes de ejecutar algún cambio de notación
