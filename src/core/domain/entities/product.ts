import { z } from 'zod'

// ─── Esquemas Zod ─────────────────────────────────────────────────────────────

/** Categorías de producto disponibles en el catálogo */
export const ProductCategorySchema = z.enum([
  'sofas',
  'seccionales',
  'butacas',
  'mesas',
  'dormitorios',
])

/** Color disponible para un producto (nombre legible + código hex) */
export const ProductColorSchema = z.object({
  name: z.string().min(1),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Código hex inválido (ej: #C4714A)'),
})

/** Badge promocional que puede tener un producto */
export const ProductBadgeSchema = z.enum(['nuevo', 'popular'])

/** Esquema completo de un producto del catálogo */
export const ProductSchema = z.object({
  /** ID autogenerado por la base de datos (UUID). Presente solo en registros persistidos. */
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  category: ProductCategorySchema,
  /** Precio en la moneda local (número, no string) */
  price: z.number().positive(),
  material: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().url(),
  /** Imagen para superponer en el visualizador (modo canvas). Idealmente PNG sin fondo. */
  overlayImageUrl: z.string().url().nullable().optional(),
  /** URLs de fotos adicionales para IP-Adapter (ComfyUI fase producción).
   *  Con 2-3 fotos desde ángulos distintos mejora la fidelidad del mueble generado. */
  referenceImageUrls: z.array(z.string().url()).optional(),
  colors: z.array(ProductColorSchema).min(1),
  badge: ProductBadgeSchema.optional(),
  dimensions: z.string().optional(),
})

// ─── Tipos inferidos ──────────────────────────────────────────────────────────

export type ProductCategory = z.infer<typeof ProductCategorySchema>
export type ProductColor = z.infer<typeof ProductColorSchema>
export type ProductBadge = z.infer<typeof ProductBadgeSchema>
export type Product = z.infer<typeof ProductSchema>
