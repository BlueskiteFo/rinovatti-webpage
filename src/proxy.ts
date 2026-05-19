import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { LOGIN_PATH, PROTECTED_ROUTES } from '@/lib/constants'

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })
  const { pathname } = request.nextUrl

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() verifica el JWT contra el servidor de Supabase — no confía en la cookie sin validar.
  // NUNCA usar getSession() en proxy: un cookie forjado puede bypassear la auth.
  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))

  if (isProtected && !user) {
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set('redirectTo', pathname + request.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Ejecutar proxy en todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico, archivos de public/
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
