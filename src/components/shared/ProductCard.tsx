'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/constants/rinnovati'

type Props = {
  product: Product
}

export function ProductCard({ product }: Props) {
  return (
    <div className="group cursor-pointer overflow-hidden rounded bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(28,26,24,0.08)]">
      {/* Imagen */}
      <div className="bg-rv-cream relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-400 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {product.badge && (
          <span
            className={`absolute top-3 left-3 rounded-[2px] px-2.5 py-1 text-[10px] font-medium tracking-[0.1em] text-white uppercase ${
              product.badge === 'nuevo' ? 'bg-rv-dark' : 'bg-rv-terracotta'
            }`}
          >
            {product.badge === 'nuevo' ? 'Nuevo' : 'Popular'}
          </span>
        )}

        {/* Overlay con botones */}
        <div className="bg-rv-dark/50 absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Link
            href={`/catalogo/${product.slug}`}
            className="text-rv-dark hover:bg-rv-terracotta rounded-[2px] bg-white px-5 py-2.5 text-[12px] font-medium tracking-[0.08em] uppercase no-underline transition-colors hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            Ver detalle
          </Link>
        </div>
      </div>

      {/* Info */}
      <Link href={`/catalogo/${product.slug}`} className="block p-5 no-underline">
        <h3 className="font-heading text-rv-dark mb-1 text-[20px] font-normal">{product.name}</h3>
        <p className="text-rv-mid mb-3 text-[12px] tracking-[0.05em]">{product.material}</p>

        <div className="flex items-center justify-between">
          <span className="text-rv-dark text-[16px] font-medium">{product.price}</span>
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
