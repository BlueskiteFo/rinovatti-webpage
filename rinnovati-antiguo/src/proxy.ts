import { NextResponse, type NextRequest } from 'next/server'

// MVP Rinnovati: sin auth. El proxy no protege ninguna ruta.
// Restaurar la lógica Supabase cuando se active auth en una fase posterior.
export async function proxy(_request: NextRequest) {
  return NextResponse.next()
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
