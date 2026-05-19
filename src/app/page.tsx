import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Eassy Boilerplate</h1>
        <p className="text-sm text-muted-foreground">Next.js + Supabase — listo para clonar</p>
        <Button>Comenzar</Button>
      </div>
    </main>
  )
}
