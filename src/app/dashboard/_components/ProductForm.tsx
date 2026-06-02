'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import type { Product } from '@/core/domain/entities'

// ─── Submit Button ──────────────────────────────────────────────────────────

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-rv-dark hover:bg-rv-terracotta mt-4 w-full rounded-sm px-8 py-3.5 text-[12px] font-medium tracking-[0.1em] text-white uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Guardando...' : label}
    </button>
  )
}

// ─── Props ──────────────────────────────────────────────────────────────────

interface ProductFormProps {
  /**
   * Server Action ya vinculada con el id (para edición)
   * o sin vincular (para creación).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<{ success: boolean; error: string | null }>
  /** Datos del producto actual para pre-llenar el formulario (modo edición). */
  defaultValues?: Product
  /** Etiqueta del botón de envío */
  submitLabel?: string
}

// ─── Componente ──────────────────────────────────────────────────────────────

/**
 * Formulario de producto reutilizable.
 * En creación: todos los campos vacíos, imagen requerida.
 * En edición: campos pre-llenados con defaultValues, imagen opcional.
 */
export function ProductForm({
  action,
  defaultValues,
  submitLabel = 'Guardar Producto',
}: ProductFormProps) {
  const [state, formAction] = useActionState(action, null)
  const isEdit = !!defaultValues

  // Colores → string plano separado por comas para mostrar en el input
  const colorsDefaultString = defaultValues?.colors.map((c) => c.name).join(', ') ?? ''

  return (
    <>
      {state?.success && (
        <div className="mb-8 p-4 text-rv-dark bg-rv-gold-light/50 border border-rv-gold/30 rounded-sm text-center text-sm">
          {isEdit ? '¡Producto actualizado con éxito!' : '¡Producto creado con éxito!'}
        </div>
      )}

      {state?.error && (
        <div className="mb-8 p-4 text-red-800 bg-red-50 border border-red-200 rounded-sm text-center text-sm">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nombre */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="name" className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]">
              Nombre del producto
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={defaultValues?.name}
              className="flex h-11 w-full rounded-sm border border-rv-sand bg-white px-4 py-2 text-[14px] text-rv-dark placeholder:text-rv-mid/50 focus:border-rv-terracotta focus:outline-none focus:ring-1 focus:ring-rv-terracotta transition-colors"
              placeholder="Ej: Sofá Nórdico Premium"
            />
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]">
              Categoría
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue={defaultValues?.category ?? 'sofas'}
              className="flex h-11 w-full rounded-sm border border-rv-sand bg-white px-4 py-2 text-[14px] text-rv-dark focus:border-rv-terracotta focus:outline-none focus:ring-1 focus:ring-rv-terracotta transition-colors"
            >
              <option value="sofas">Sofás</option>
              <option value="seccionales">Seccionales</option>
              <option value="butacas">Butacas</option>
              <option value="mesas">Mesas</option>
              <option value="dormitorios">Dormitorios</option>
            </select>
          </div>

          {/* Precio */}
          <div className="space-y-2">
            <label htmlFor="price" className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]">
              Precio (S/)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              required
              defaultValue={defaultValues?.price}
              className="flex h-11 w-full rounded-sm border border-rv-sand bg-white px-4 py-2 text-[14px] text-rv-dark placeholder:text-rv-mid/50 focus:border-rv-terracotta focus:outline-none focus:ring-1 focus:ring-rv-terracotta transition-colors"
              placeholder="Ej: 1500.00"
            />
          </div>

          {/* Material */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="material" className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]">
              Material
            </label>
            <input
              id="material"
              name="material"
              type="text"
              required
              defaultValue={defaultValues?.material}
              className="flex h-11 w-full rounded-sm border border-rv-sand bg-white px-4 py-2 text-[14px] text-rv-dark placeholder:text-rv-mid/50 focus:border-rv-terracotta focus:outline-none focus:ring-1 focus:ring-rv-terracotta transition-colors"
              placeholder="Ej: Estructura de pino, tapizado en lino"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description" className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              required
              defaultValue={defaultValues?.description}
              className="flex min-h-[100px] w-full rounded-sm border border-rv-sand bg-white px-4 py-3 text-[14px] text-rv-dark placeholder:text-rv-mid/50 focus:border-rv-terracotta focus:outline-none focus:ring-1 focus:ring-rv-terracotta transition-colors resize-y"
              placeholder="Describe las características y beneficios del producto..."
            />
          </div>

          {/* Colores */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="colors" className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]">
              Colores (separados por comas)
            </label>
            <input
              id="colors"
              name="colors"
              type="text"
              required
              defaultValue={colorsDefaultString}
              className="flex h-11 w-full rounded-sm border border-rv-sand bg-white px-4 py-2 text-[14px] text-rv-dark placeholder:text-rv-mid/50 focus:border-rv-terracotta focus:outline-none focus:ring-1 focus:ring-rv-terracotta transition-colors"
              placeholder="Ej: blanco, negro, beige"
            />
          </div>

          {/* Imagen principal */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="imageFile" className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]">
              Imagen Principal{isEdit && <span className="ml-2 text-rv-mid font-normal normal-case">(dejar vacío para mantener la actual)</span>}
            </label>
            {isEdit && defaultValues.imageUrl && (
              <div className="mb-2 flex items-center gap-3 p-3 bg-rv-cream/60 border border-rv-sand/40 rounded-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={defaultValues.imageUrl}
                  alt="Imagen actual"
                  className="h-16 w-20 object-cover rounded-sm flex-shrink-0"
                />
                <p className="text-[12px] text-rv-mid leading-snug">Imagen actual. Sube una nueva para reemplazarla.</p>
              </div>
            )}
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              required={!isEdit}
              className="flex w-full rounded-sm border border-rv-sand bg-white px-4 py-2.5 text-[14px] text-rv-dark file:mr-4 file:rounded file:border-0 file:bg-rv-dark file:px-4 file:py-1.5 file:text-[11px] file:font-medium file:text-white file:uppercase file:tracking-wider hover:file:bg-rv-terracotta focus:border-rv-terracotta focus:outline-none transition-colors"
            />
          </div>

          {/* Badge (opcional) */}
          <div className="space-y-2">
            <label htmlFor="badge" className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]">
              Badge <span className="text-rv-mid font-normal normal-case">(opcional)</span>
            </label>
            <select
              id="badge"
              name="badge"
              defaultValue={defaultValues?.badge ?? ''}
              className="flex h-11 w-full rounded-sm border border-rv-sand bg-white px-4 py-2 text-[14px] text-rv-dark focus:border-rv-terracotta focus:outline-none focus:ring-1 focus:ring-rv-terracotta transition-colors"
            >
              <option value="">Sin badge</option>
              <option value="nuevo">Nuevo</option>
              <option value="popular">Popular</option>
            </select>
          </div>

          {/* Dimensiones (opcional) */}
          <div className="space-y-2">
            <label htmlFor="dimensions" className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]">
              Dimensiones <span className="text-rv-mid font-normal normal-case">(opcional)</span>
            </label>
            <input
              id="dimensions"
              name="dimensions"
              type="text"
              defaultValue={defaultValues?.dimensions}
              className="flex h-11 w-full rounded-sm border border-rv-sand bg-white px-4 py-2 text-[14px] text-rv-dark placeholder:text-rv-mid/50 focus:border-rv-terracotta focus:outline-none focus:ring-1 focus:ring-rv-terracotta transition-colors"
              placeholder="Ej: 220 x 90 x 80 cm"
            />
          </div>

        </div>

        <div className="pt-4">
          <SubmitButton label={submitLabel} />
        </div>
      </form>
    </>
  )
}
