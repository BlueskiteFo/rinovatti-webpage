import Link from 'next/link'
import { createProductAction } from '@/app/dashboard/actions'
import { ProductForm } from '@/app/dashboard/_components/ProductForm'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

export const metadata = {
  title: 'Nuevo Producto — Rinnovati Admin',
  description: 'Añade un nuevo mueble al catálogo de Rinnovati.',
}

/**
 * Página de creación de producto.
 * Server Component: no tiene lógica de cliente, solo orquesta layout y action.
 */
export default function NewProductPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-rv-cream pt-[120px] pb-24 px-[8%] flex flex-col items-center">
        <div className="w-full max-w-2xl">

          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-[12px] text-rv-mid">
            <Link href="/dashboard" className="hover:text-rv-dark transition-colors">
              Dashboard
            </Link>
            <span>›</span>
            <span className="text-rv-dark">Nuevo producto</span>
          </nav>

          <div className="bg-white p-8 md:p-12 shadow-sm border border-rv-sand/50 rounded-sm">
            {/* Encabezado */}
            <div className="mb-8 text-center">
              <p className="text-rv-terracotta mb-3 text-[11px] font-medium tracking-[0.2em] uppercase">
                Dashboard de Administración
              </p>
              <h1 className="font-heading text-rv-dark text-[clamp(28px,3.5vw,44px)] leading-[1.15] font-light">
                Añadir un <em className="italic">nuevo producto</em>
              </h1>
              <p className="text-rv-mid mt-4 text-[14px] leading-relaxed font-light max-w-md mx-auto">
                Ingresa los detalles del nuevo mueble para añadirlo al catálogo.
              </p>
            </div>

            <ProductForm action={createProductAction} submitLabel="Crear Producto" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
