import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { getProductBySlug, RINNOVATI_CONFIG } from '@/lib/constants/rinnovati'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado — Rinnovati' }
  return {
    title: `${product.name} — Rinnovati`,
    description: product.description,
  }
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) notFound()

  return (
    <>
      <Navbar />

      <main className="pt-[72px]">
        {/* Breadcrumb */}
        <div className="bg-rv-cream border-rv-sand border-b px-[8%] py-4">
          <nav className="text-rv-mid flex items-center gap-2 text-[12px]">
            <Link href="/" className="hover:text-rv-terracotta no-underline transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link
              href="/catalogo"
              className="hover:text-rv-terracotta no-underline transition-colors"
            >
              Catálogo
            </Link>
            <span>/</span>
            <span className="text-rv-dark">{product.name}</span>
          </nav>
        </div>

        {/* Producto */}
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          {/* Imagen */}
          <div className="bg-rv-cream relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[500px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.badge && (
              <span
                className={`absolute top-5 left-5 rounded-[2px] px-3 py-1.5 text-[10px] font-medium tracking-[0.1em] text-white uppercase ${
                  product.badge === 'nuevo' ? 'bg-rv-dark' : 'bg-rv-terracotta'
                }`}
              >
                {product.badge === 'nuevo' ? 'Nuevo' : 'Popular'}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="bg-rv-warm-white flex flex-col justify-center px-[8%] py-16">
            <p className="text-rv-terracotta mb-3 text-[11px] font-medium tracking-[0.2em] uppercase">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </p>
            <h1 className="font-heading text-rv-dark mb-3 text-[clamp(36px,4vw,52px)] leading-[1.15] font-light">
              {product.name}
            </h1>
            <p className="text-rv-mid mb-5 text-[13px] tracking-[0.05em]">{product.material}</p>
            <p className="text-rv-mid mb-6 text-[15px] leading-relaxed font-light">
              {product.description}
            </p>

            {product.dimensions && (
              <p className="text-rv-charcoal mb-6 text-[13px]">
                <span className="font-medium">Medidas:</span> {product.dimensions}
              </p>
            )}

            {/* Colores */}
            <div className="mb-8">
              <p className="text-rv-charcoal mb-3 text-[11px] font-medium tracking-[0.12em] uppercase">
                Colores disponibles
              </p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <div key={color.name} className="flex items-center gap-2">
                    <span
                      className="border-rv-sand h-5 w-5 rounded-full border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-rv-mid text-[12px]">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Precio */}
            <p className="text-rv-dark mb-8 text-[22px] font-medium">{product.price}</p>

            {/* Botones CTA */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/visualizador/${product.slug}`}
                className="bg-rv-terracotta flex-1 rounded-[2px] px-6 py-3.5 text-center text-[12px] font-medium tracking-[0.08em] text-white uppercase no-underline transition-colors hover:bg-[#A85D3A]"
              >
                ✦ Probar visualizador IA
              </Link>
              <a
                href={`https://wa.me/${RINNOVATI_CONFIG.whatsappNumber}?text=Hola Rinnovati! Me interesa el ${product.name}. ¿Podemos agendar una cita?`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-rv-dark hover:bg-rv-charcoal flex-1 rounded-[2px] px-6 py-3.5 text-center text-[12px] font-medium tracking-[0.08em] text-white uppercase no-underline transition-colors"
              >
                Agendar cita directamente
              </a>
            </div>

            <p className="text-rv-mid mt-4 text-center text-[12px]">
              Sin compromiso de compra · Asesoría personalizada en tienda
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
