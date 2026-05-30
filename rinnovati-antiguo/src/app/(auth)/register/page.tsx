import { RegisterForm } from '@/components/shared/RegisterForm'

interface RegisterPageProps {
  searchParams: Promise<{ redirectTo?: string }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { redirectTo } = await searchParams

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <RegisterForm redirectTo={redirectTo} />
    </main>
  )
}
