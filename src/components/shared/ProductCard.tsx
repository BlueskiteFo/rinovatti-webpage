'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/core/domain/entities'

type Props = {
  product: Product
}

export function ProductCard({ product }: Props) {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-sm bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(28,26,24,0.10)]">

      {/* ── Imagen ─────────────────────────────────────────────────────────── */}
      {/*
        Estructura plana: sin wrappers anidados ni padding interno.
        - w-full + aspect-[4/5]: relación vertical de catálogo, sin alturas fijas en px.
        - object-cover: la foto ocupa todo el marco sin bordes vacíos grises.
        - quality={100}: sin compresión — crítico para texturas de tapizado.
        - sizes exactos al grid: 1col (mobile) / 2col (sm) / 3col (lg).
      */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          unoptimized={true}
          className="object-contain object-center w-full h-full transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 rounded-[2px] px-2.5 py-1 text-[10px] font-medium tracking-[0.1em] text-white uppercase ${
              product.badge === 'nuevo' ? 'bg-rv-dark' : 'bg-rv-terracotta'
            }`}
          >
            {product.badge === 'nuevo' ? 'Nuevo' : 'Popular'}
          </span>
        )}

        {/* Overlay hover */}
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-rv-dark/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Link
            href={`/catalogo/${product.slug}`}
            className="rounded-[2px] bg-white px-5 py-2.5 text-[12px] font-medium tracking-[0.08em] text-rv-dark uppercase no-underline transition-colors hover:bg-rv-terracotta hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            Ver detalle
          </Link>
        </div>
      </div>

      {/* ── Info ───────────────────────────────────────────────────────────── */}
      <Link href={`/catalogo/${product.slug}`} className="block p-5 no-underline">
        <h3 className="font-heading text-rv-dark mb-1 text-[20px] font-normal">{product.name}</h3>
        <p className="text-rv-mid mb-3 text-[12px] tracking-[0.05em]">{product.material}</p>

        <div className="flex items-center justify-between">
          <span className="text-rv-dark text-[16px] font-medium">
            S/ {product.price.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </span>
          <div className="flex gap-1.5">
            {product.colors.map((color) => (
              <span
                key={color.name}
                title={color.name}
                className="hover:border-rv-dark h-3.5 w-3.5 cursor-pointer rounded-full border-[1.5px] border-transparent transition-colors"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      </Link>
    </div>
  )
}
