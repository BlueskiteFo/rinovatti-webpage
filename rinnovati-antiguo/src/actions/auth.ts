'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { safeRedirect } from '@/lib/utils'
import { LOGIN_PATH } from '@/lib/constants'

const loginSchema = z.object({
  email: z.string().email({ message: 'Ingresa un email válido.' }),
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
})

const registerSchema = z.object({
  email: z.string().email({ message: 'Ingresa un email válido.' }),
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
})

export type AuthState =
  | {
      error?: string
      fieldErrors?: {
        email?: string[]
        password?: string[]
      }
    }
  | undefined

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const redirectTo = formData.get('redirectTo') as string | null
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: 'Credenciales incorrectas. Verifica tu email y contraseña.' }
  }

  redirect(safeRedirect(redirectTo))
}

export async function registerAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const redirectTo = formData.get('redirectTo') as string | null
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signUp(parsed.data)

  if (error) {
    return { error: 'No se pudo crear la cuenta. Intenta de nuevo.' }
  }

  redirect(safeRedirect(redirectTo))
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect(LOGIN_PATH)
}
