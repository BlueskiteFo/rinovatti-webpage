import { LoginForm } from '@/components/shared/LoginForm'

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo, error } = await searchParams

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <LoginForm redirectTo={redirectTo} callbackError={error} />
    </main>
  )
}
