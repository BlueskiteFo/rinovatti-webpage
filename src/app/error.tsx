'use client'

import { Button } from '@/components/ui/button'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="max-w-md px-4 text-center">
        <h1 className="text-foreground text-2xl font-semibold">Algo salió mal</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Ocurrió un error inesperado. Intenta de nuevo o contacta a soporte si el problema
          persiste.
        </p>
        {process.env.NODE_ENV === 'development' && error.message && (
          <pre className="bg-muted text-destructive mt-4 overflow-auto rounded p-3 text-left text-xs">
            {error.message}
          </pre>
        )}
        <Button onClick={reset} className="mt-6">
          Reintentar
        </Button>
      </div>
    </main>
  )
}
