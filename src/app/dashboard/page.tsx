import Link from 'next/link'
import Image from 'next/image'
import { productRepository } from '@/core/infrastructure/dependencies'
import { DeleteProductButton } from '@/app/dashboard/_components/DeleteProductButton'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

export const metadata = {
  title: 'Dashboard — Rinnovati Admin',
  description: 'Gestión de productos del catálogo Rinnovati.',
}

const CATEGORY_LABELS: Record<string, string> = {
  sofas: 'Sofás',
  seccionales: 'Seccionales',
  butacas: 'Butacas',
  mesas: 'Mesas',
  dormitorios: 'Dormitorios',
}

export default async function DashboardPage() {
  const products = await productRepository.getAll()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-rv-cream pt-[120px] pb-24 px-[5%]">

        {/* ── Encabezado ─────────────────────────────────────────────────── */}
        <div className="mb-10 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-rv-terracotta mb-2 text-[11px] font-medium tracking-[0.2em] uppercase">
              Dashboard de Administración
            </p>
            <h1 className="font-heading text-rv-dark text-[clamp(28px,3.5vw,44px)] leading-[1.15] font-light">
              Catálogo de <em className="italic">productos</em>
            </h1>
          </div>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 bg-rv-dark hover:bg-rv-terracotta transition-colors px-6 py-3 rounded-sm text-white text-[12px] font-medium tracking-[0.1em] uppercase"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo Producto
          </Link>
        </div>

        {/* ── Tabla de productos ─────────────────────────────────────────── */}
        <div className="bg-white border border-rv-sand/50 rounded-sm shadow-sm overflow-hidden">
          {products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-rv-mid text-[14px]">No hay productos en el catálogo todavía.</p>
              <Link
                href="/dashboard/new"
                className="mt-4 inline-block text-rv-terracotta text-[13px] underline underline-offset-4"
              >
                Añade el primero
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-rv-sand/60 bg-rv-cream/50">
                    <th className="px-5 py-3.5 text-[10px] font-semibold text-rv-charcoal uppercase tracking-[0.15em]">
                      Imagen
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-semibold text-rv-charcoal uppercase tracking-[0.15em]">
                      Nombre
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-semibold text-rv-charcoal uppercase tracking-[0.15em] hidden sm:table-cell">
                      Categoría
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-semibold text-rv-charcoal uppercase tracking-[0.15em] hidden md:table-cell">
                      Precio
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-semibold text-rv-charcoal uppercase tracking-[0.15em]">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, idx) => (
                    <tr
                      key={product.id}
                      className={`border-b border-rv-sand/40 transition-colors hover:bg-rv-cream/30 ${idx % 2 === 0 ? '' : 'bg-rv-cream/10'}`}
                    >
                      {/* Miniatura */}
                      <td className="px-5 py-3">
                        <div className="relative h-12 w-16 overflow-hidden rounded-sm bg-rv-sand/20 flex-shrink-0">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </td>

                      {/* Nombre */}
                      <td className="px-5 py-3">
                        <span className="text-[14px] font-medium text-rv-dark leading-snug">
                          {product.name}
                        </span>
                        {product.badge && (
                          <span className="ml-2 inline-block px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded bg-rv-terracotta/10 text-rv-terracotta">
                            {product.badge}
                          </span>
                        )}
                      </td>

                      {/* Categoría */}
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className="text-[13px] text-rv-mid">
                          {CATEGORY_LABELS[product.category] ?? product.category}
                        </span>
                      </td>

                      {/* Precio */}
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="text-[13px] font-medium text-rv-dark">
                          S/ {product.price.toLocaleString('es-PE')}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {/* Editar */}
                          <Link
                            href={`/dashboard/${product.id}/edit`}
                            className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.08em] uppercase text-rv-charcoal border border-rv-sand px-3 py-1.5 rounded-sm hover:bg-rv-dark hover:text-white hover:border-rv-dark transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Editar
                          </Link>

                          {/* Eliminar */}
                          <DeleteProductButton
                            productId={product.id!}
                            productName={product.name}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-right text-[12px] text-rv-mid">
          {products.length} producto{products.length !== 1 ? 's' : ''} en el catálogo
        </p>
      </main>
      <Footer />
    </>
  )
}
