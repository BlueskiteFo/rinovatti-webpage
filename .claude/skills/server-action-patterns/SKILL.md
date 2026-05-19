---
name: server-action-patterns
description: Use when creating or modifying Server Actions in `src/actions/`. Trigger on `'use server'`, `useActionState`, FormData handling, or mutations called from Client Components. Explains the two canonical patterns (A — form with useActionState, B — programmatic).
---

# Server Actions — Dos patrones canónicos

El boilerplate usa dos patrones según cómo se invoca la acción. Elegir uno por archivo; no mezclarlos.

---

## Patrón A — Formulario con `useActionState`

**Cuándo:** formularios de auth, onboarding, cualquier form con errores inline sin recargar.

### Servidor

```ts
'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { safeRedirect } from '@/lib/utils'

const Schema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
  password: z.string().min(8, { message: 'Mínimo 8 caracteres.' }),
})

// Exportar el tipo — el Client Component lo importa
export type FormState =
  | { error?: string; fieldErrors?: { email?: string[]; password?: string[] } }
  | undefined

// Firma obligatoria: (prevState, formData)
export async function myFormAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = Schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) return { error: 'Credenciales incorrectas.' } // nunca exponer error.message

  redirect(safeRedirect(formData.get('redirectTo') as string | null))
}
```

### Cliente

```tsx
'use client'

import { useActionState } from 'react'
import { myFormAction, type FormState } from '@/actions/my-actions'

export function MyForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(myFormAction, undefined)

  return (
    <form action={action}>
      <input name="email" type="email" required />
      {state?.fieldErrors?.email && <p>{state.fieldErrors.email[0]}</p>}

      {state?.error && <p>{state.error}</p>}

      <button type="submit" disabled={pending}>
        {pending ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  )
}
```

**Referencia real:** `src/actions/auth.ts` + `src/components/shared/LoginForm.tsx`.

---

## Patrón B — Acción programática

**Cuándo:** mutaciones llamadas desde `onClick`, lógica condicional, o código que maneja el resultado con `if (error)`.

```ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const InputSchema = z.object({ name: z.string().min(1) })

export async function createItem(
  input: z.infer<typeof InputSchema>
): Promise<{ data: Item | null; error: string | null }> {
  const parsed = InputSchema.safeParse(input)
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0].message }
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  const { data, error } = await supabase.from('items').insert(parsed.data).select().single()

  if (error) return { data: null, error: 'Error al guardar' }

  revalidatePath('/items')
  return { data, error: null }
}
```

---

## Reglas comunes a ambos patrones

- `'use server'` al inicio del archivo
- Validar con Zod **antes** de cualquier operación
- Nunca `throw` hacia el cliente — siempre retornar estado/resultado
- Nunca exponer `error.message` interno — mensajes genéricos en español
- Un archivo por dominio: `auth.ts`, `items.ts`, `organizations.ts`
- Verificar sesión con `getUser()` no `getSession()` (ver skill `supabase-rls`)
- Después de mutación que afecte UI: `revalidatePath()` o `revalidateTag()`
- Si la acción redirige: `redirect()` va **fuera** del `try/catch` (Next lo implementa con throw interno)

## Cuándo NO usar Server Action

Usar API Route en su lugar cuando:

- Endpoint lo consume un servicio externo (webhook, integración)
- Requiere headers custom (content-type no-form, auth Bearer)
- Streaming de respuesta
