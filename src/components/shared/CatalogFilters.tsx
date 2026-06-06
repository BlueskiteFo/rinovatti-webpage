'use client'

import { useState } from 'react'
import type { Product, ProductCategory } from '@/core/domain/entities'
import { ProductCard } from './ProductCard'

// Categorías para visualización y filtro en la UI
export const PRODUCT_CATEGORIES: {
  value: ProductCategory | 'todos'
  label: string
}[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'sofas', label: 'Sofás' },
  { value: 'seccionales', label: 'Seccionales' },
  { value: 'butacas', label: 'Butacas' },
  { value: 'mesas', label: 'Mesas' },
  { value: 'dormitorios', label: 'Dormitorios' },
]

interface CatalogFiltersProps {
  products: Product[]
}

export function CatalogFilters({ products }: CatalogFiltersProps) {
  const [active, setActive] = useState<ProductCategory | 'todos'>('todos')

  const filtered = active === 'todos' ? products : products.filter((p) => p.category === active)

  return (
    <>
      {/* Filtros */}
      <div className="mb-10 flex flex-wrap gap-2">
        {PRODUCT_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActive(cat.value)}
            className={`cursor-pointer rounded-[2px] border px-5 py-2 font-sans text-[12px] tracking-[0.06em] transition-all ${
              active === cat.value
                ? 'bg-rv-dark border-rv-dark text-white'
                : 'text-rv-charcoal border-rv-sand hover:border-rv-terracotta hover:text-rv-terracotta bg-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      <div
        key={active}
        className="grid animate-[rv-fade-in_0.2s_ease-out] grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-rv-mid py-20 text-center text-[15px]">
          No hay productos en esta categoría todavía.
        </p>
      )}
    </>
  )
}
