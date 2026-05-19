---
name: shadcn-luma
description: Use when creating or modifying UI components that use shadcn/ui. Trigger on mentions of shadcn, Radix, `components/ui/`, `components/shared/`, `Slot.Root`, `data-slot`, or when extending UI primitives. Explains the Luma preset conventions used in this boilerplate.
---

# shadcn/ui — Preset Luma

El boilerplate usa `style: "radix-luma"` en `components.json`. Este preset **no es el shadcn estándar** — tiene diferencias importantes.

## Config actual

```json
{
  "style": "radix-luma",
  "baseColor": "neutral",
  "cssVariables": true,
  "iconLibrary": "lucide"
}
```

- Radius base: `0.625rem` (multiplicadores: `sm: 0.6x`, `md: 0.8x`, `lg: 1x`, `xl: 1.4x`, `2xl: 1.8x`, `3xl: 2.2x`, `4xl: 2.6x`)
- CSS vars en `src/app/globals.css` bajo `:root` y `.dark`

## Diferencias clave vs shadcn estándar

### 1. Paquete unificado `radix-ui`

```tsx
// ✅ Luma
import { Dialog, Slot, Label } from "radix-ui"

// ❌ No usar
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Slot } from "@radix-ui/react-slot"
```

### 2. Función + `data-slot`, NO `forwardRef`

```tsx
// ✅ Luma
function Button({ className, asChild, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"
  return <Comp data-slot="button" className={cn("...", className)} {...props} />
}

// ❌ Patrón shadcn clásico — no usar
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => {
  return <button ref={ref} className={cn("...", className)} {...props} />
})
```

### 3. Composición vía `Slot.Root`

Cuando un componente necesita poder delegar su elemento raíz:

```tsx
<Button asChild>
  <Link href="/dashboard">Ir</Link>
</Button>
```

## Agregar componentes nuevos

```bash
npx shadcn@latest add <componente>
```

Primitivos ya instalados: `button`, `input`, `label`, `select`, `badge`, `card`, `dialog`, `sonner`, `skeleton`.

## Dónde va qué

| Ubicación | Contenido |
|---|---|
| `src/components/ui/` | Primitivos puros de shadcn — **no escribir desde cero**, solo `npx shadcn add` |
| `src/components/shared/` | Compuestos con lógica de negocio (ej: `LoginForm`) — importan de `ui/` |

## Extender un primitivo

Si necesitas customizar un componente de `ui/`:
- Edit directo al archivo — shadcn copia el código, es tuyo
- Mantén el patrón Luma (función + `data-slot`, no reintroducir `forwardRef`)

Si necesitas una variante compuesta con lógica:
- Crear en `shared/`, importando el primitivo
- No reescribir el primitivo completo

## Iconos

**Solo `lucide-react`.** No instalar `react-icons`, `heroicons`, etc. Llega automático con shadcn.

## Toasts

Ya está `sonner` instalado con `Toaster` en `src/app/layout.tsx`. Para usarlo:

```tsx
'use client'
import { toast } from 'sonner'

toast.success('Guardado')
toast.error('Algo falló')
```

## Tema dark

El preset ya incluye `.dark` con `next-themes` + `ThemeProvider` en `layout.tsx`. Solo hay que llamar `useTheme()` o un selector UI cuando se necesite.

## Personalización de marca por proyecto

Editar ~10 líneas en `src/app/globals.css`:

```css
:root {
  --primary: oklch(...);        /* color de marca */
  --primary-foreground: ...;
  --radius: 0.625rem;           /* redondeo global */
}
.dark {
  --primary: ...;
}
```

No tocar `@theme inline` — es el puente entre las variables y Tailwind.
