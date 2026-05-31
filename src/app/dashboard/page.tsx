'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createProductAction } from './actions'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-rv-dark hover:bg-rv-terracotta mt-4 w-full rounded-[2px] px-8 py-3.5 text-[12px] font-medium tracking-[0.1em] text-white uppercase no-underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Guardando...' : 'Crear Producto'}
    </button>
  )
}

export default function DashboardPage() {
  const [state, formAction] = useActionState(createProductAction, null)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-rv-cream pt-[120px] pb-24 px-[8%] flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white p-8 md:p-12 shadow-sm border border-rv-sand/50 rounded-sm">
          <div className="mb-8 text-center">
            <p className="text-rv-terracotta mb-3 text-[11px] font-medium tracking-[0.2em] uppercase">
              Dashboard de Administración
            </p>
            <h1 className="font-heading text-rv-dark text-[clamp(32px,4vw,48px)] leading-[1.15] font-light">
              Añadir un <br className="md:hidden" />
              <em className="italic">nuevo producto</em>
            </h1>
            <p className="text-rv-mid mt-4 text-[14px] leading-relaxed font-light max-w-md mx-auto">
              Ingresa los detalles del nuevo mueble para añadirlo al catálogo de Rinnovati.
            </p>
          </div>

          {state?.success && (
            <div className="mb-8 p-4 text-rv-dark bg-rv-gold-light/50 border border-rv-gold/30 rounded-sm text-center text-sm">
              ¡Producto creado con éxito! Puedes añadir otro si lo deseas.
            </div>
          )}

          {state?.error && (
            <div className="mb-8 p-4 text-red-800 bg-red-50 border border-red-200 rounded-sm text-center text-sm">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="name"
                  className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]"
                >
                  Nombre del producto
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="flex h-11 w-full rounded-sm border border-rv-sand bg-white px-4 py-2 text-[14px] text-rv-dark placeholder:text-rv-mid/50 focus:border-rv-terracotta focus:outline-none focus:ring-1 focus:ring-rv-terracotta transition-colors"
                  placeholder="Ej: Sofá Nórdico Premium"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]"
                >
                  Categoría
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="flex h-11 w-full rounded-sm border border-rv-sand bg-white px-4 py-2 text-[14px] text-rv-dark focus:border-rv-terracotta focus:outline-none focus:ring-1 focus:ring-rv-terracotta transition-colors"
                >
                  <option value="sofas">Sofás</option>
                  <option value="mesas">Mesas</option>
                  <option value="butacas">Butacas</option>
                  <option value="seccionales">Seccionales</option>
                  <option value="dormitorios">Dormitorios</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]"
                >
                  Precio (S/)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  className="flex h-11 w-full rounded-sm border border-rv-sand bg-white px-4 py-2 text-[14px] text-rv-dark placeholder:text-rv-mid/50 focus:border-rv-terracotta focus:outline-none focus:ring-1 focus:ring-rv-terracotta transition-colors"
                  placeholder="Ej: 1500.00"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="material"
                  className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]"
                >
                  Material
                </label>
                <input
                  id="material"
                  name="material"
                  type="text"
                  required
                  className="flex h-11 w-full rounded-sm border border-rv-sand bg-white px-4 py-2 text-[14px] text-rv-dark placeholder:text-rv-mid/50 focus:border-rv-terracotta focus:outline-none focus:ring-1 focus:ring-rv-terracotta transition-colors"
                  placeholder="Ej: Estructura de pino, tapizado en lino"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="description"
                  className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]"
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  className="flex min-h-[100px] w-full rounded-sm border border-rv-sand bg-white px-4 py-3 text-[14px] text-rv-dark placeholder:text-rv-mid/50 focus:border-rv-terracotta focus:outline-none focus:ring-1 focus:ring-rv-terracotta transition-colors resize-y"
                  placeholder="Describe las características y beneficios del producto..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="colors"
                  className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]"
                >
                  Colores (separados por comas)
                </label>
                <input
                  id="colors"
                  name="colors"
                  type="text"
                  required
                  className="flex h-11 w-full rounded-sm border border-rv-sand bg-white px-4 py-2 text-[14px] text-rv-dark placeholder:text-rv-mid/50 focus:border-rv-terracotta focus:outline-none focus:ring-1 focus:ring-rv-terracotta transition-colors"
                  placeholder="Ej: blanco, negro, beige"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="imageFile"
                  className="text-[11px] font-medium text-rv-charcoal uppercase tracking-[0.1em]"
                >
                  Imagen Principal
                </label>
                <div className="relative">
                  <input
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    accept="image/*"
                    required
                    className="flex w-full rounded-sm border border-rv-sand bg-white px-4 py-2.5 text-[14px] text-rv-dark file:mr-4 file:rounded file:border-0 file:bg-rv-dark file:px-4 file:py-1.5 file:text-[11px] file:font-medium file:text-white file:uppercase file:tracking-wider hover:file:bg-rv-terracotta focus:border-rv-terracotta focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
