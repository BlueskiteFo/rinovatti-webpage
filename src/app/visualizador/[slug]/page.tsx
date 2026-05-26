'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { PhotoUploader } from '@/components/shared/PhotoUploader'
import { VisualizerAI } from '@/components/shared/VisualizerAI'
import { getProductBySlug } from '@/lib/constants/rinnovati'

type Props = {
  params: Promise<{ slug: string }>
}

export default function VisualizadorPage({ params }: Props) {
  const { slug } = use(params)
  const product = getProductBySlug(slug)

  const [roomPhoto, setRoomPhoto] = useState<string | null>(null)

  if (!product) notFound()

  return (
    <>
      <Navbar />

      <main className="bg-rv-warm-white min-h-screen pt-[72px]">
        {/* Header */}
        <div className="bg-rv-cream border-rv-sand border-b px-[8%] py-8">
          <nav className="text-rv-mid mb-4 flex items-center gap-2 text-[12px]">
            <Link
              href="/catalogo"
              className="hover:text-rv-terracotta no-underline transition-colors"
            >
              Catálogo
            </Link>
            <span>/</span>
            <Link
              href={`/catalogo/${product.slug}`}
              className="hover:text-rv-terracotta no-underline transition-colors"
            >
              {product.name}
            </Link>
            <span>/</span>
            <span className="text-rv-dark">Visualizador</span>
          </nav>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-rv-terracotta mb-1 text-[11px] font-medium tracking-[0.2em] uppercase">
                Visualizador IA
              </p>
              <h1 className="font-heading text-rv-dark text-[28px] font-light">{product.name}</h1>
              <p className="text-rv-mid text-[13px]">{product.material}</p>
            </div>
            <Link
              href={`/catalogo/${product.slug}`}
              className="text-rv-charcoal hover:text-rv-terracotta flex items-center gap-1 text-[13px] no-underline transition-colors"
            >
              ← Volver al producto
            </Link>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-[8%] py-12">
          {roomPhoto === null ? (
            /* Paso 1: Upload */
            <div className="mx-auto max-w-2xl">
              <PhotoUploader onPhotoSelected={setRoomPhoto} />
            </div>
          ) : (
            /* Paso 2: Visualizador canvas */
            <div className="mx-auto max-w-4xl">
              <VisualizerAI
                product={product}
                roomPhotoUrl={roomPhoto}
                onRetry={() => setRoomPhoto(null)}
                onCancel={() => window.history.back()}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
