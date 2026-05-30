// ─── Rutas protegidas ────────────────────────────────────────────────────────
// El proxy redirige a LOGIN_PATH si el usuario no tiene sesión.
// Agregar aquí cualquier ruta que requiera autenticación.
export const PROTECTED_ROUTES = ['/dashboard'] as const

export const LOGIN_PATH = '/login' as const
export const DEFAULT_AUTH_REDIRECT = '/dashboard' as const

// ─── Roles de organización (Fase 5 — multi-tenancy) ─────────────────────────
// Orden jerárquico: owner > admin > member
export const ORG_ROLES = ['owner', 'admin', 'member'] as const
export type OrgRole = (typeof ORG_ROLES)[number]

// ─── App ─────────────────────────────────────────────────────────────────────
export const APP_NAME = 'Eassy Boilerplate' as const
