import Link from 'next/link'
import { notFound } from 'next/navigation'
import { productRepository } from '@/core/infrastructure/dependencies'
import { updateProductAction } from '@/app/dashboard/actions'
import { ProductForm } from '@/app/dashboard/_components/ProductForm'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

// ─── Tipos de Next.js App Router ──────────────────────────────────────────────

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

// ─── Metadata dinámica ───────────────────────────────────────────────────────

export async function generateMetadata({ params }: EditProductPageProps) {
  const { id } = await params
  const product = await productRepository.getById(id)
  return {
    title: product
      ? `Editar: ${product.name} — Rinnovati Admin`
      : 'Producto no encontrado — Rinnovati Admin',
  }
}

// ─── Página ───────────────────────────────────────────────────────────────────

/**
 * Página de edición de producto.
 * Server Component: obtiene los datos del producto por ID y los pasa al
 * formulario pre-llenado. La action se vincula al id usando .bind().
 */
export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params

  // Obtener el producto actual; 404 si no existe
  const product = await productRepository.getById(id)
  if (!product) {
    notFound()
  }

  // Vincular la Server Action con el id del producto
  const boundUpdateAction = updateProductAction.bind(null, id)

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
            <span className="text-rv-dark truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="bg-white p-8 md:p-12 shadow-sm border border-rv-sand/50 rounded-sm">
            {/* Encabezado */}
            <div className="mb-8 text-center">
              <p className="text-rv-terracotta mb-3 text-[11px] font-medium tracking-[0.2em] uppercase">
                Dashboard de Administración
              </p>
              <h1 className="font-heading text-rv-dark text-[clamp(28px,3.5vw,44px)] leading-[1.15] font-light">
                Editar <em className="italic">producto</em>
              </h1>
              <p className="text-rv-mid mt-4 text-[14px] leading-relaxed font-light max-w-md mx-auto">
                Modifica los campos que desees actualizar y guarda los cambios.
              </p>
            </div>

            <ProductForm
              action={boundUpdateAction}
              defaultValues={product}
              submitLabel="Guardar Cambios"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
