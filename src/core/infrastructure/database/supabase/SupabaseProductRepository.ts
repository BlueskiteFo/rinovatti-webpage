import type { SupabaseClient } from '@supabase/supabase-js'
import type { IProductRepository } from '@/core/application/ports'
import type { Product, ProductCategory } from '@/core/domain/entities'
import { InfrastructureError } from '@/core/infrastructure/errors'

// ─── Tipo interno: fila de Supabase (snake_case) ──────────────────────────────

interface ProductRow {
  id: string
  slug: string
  name: string
  category: string
  price: number
  material: string
  description: string
  image_url: string
  overlay_image_url: string | null
  /** URLs de renders del producto usadas como contexto visual para la IA */
  context_images: string[]
  colors: Array<{ name: string; hex: string }>
  created_at: string
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

/** Convierte una fila de Supabase (snake_case) al tipo de dominio (camelCase) */
function toDomain(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as ProductCategory,
    price: row.price,
    material: row.material,
    description: row.description,
    imageUrl: row.image_url,
    overlayImageUrl: row.overlay_image_url,
    referenceImageUrls: row.context_images?.length ? row.context_images : undefined,
    colors: row.colors,
  }
}

/** Convierte un objeto de dominio (camelCase) a la estructura de inserción (snake_case) */
function toRow(product: Omit<Product, 'id'>): Omit<ProductRow, 'id' | 'created_at'> {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    material: product.material,
    description: product.description,
    image_url: product.imageUrl,
    overlay_image_url: product.overlayImageUrl ?? null,
    context_images: product.referenceImageUrls ?? [],
    colors: product.colors,
  }
}

/** Convierte una actualización parcial de dominio (camelCase) a snake_case para Supabase */
function toPartialRow(
  data: Partial<Omit<Product, 'id'>>,
): Partial<Omit<ProductRow, 'id' | 'created_at'>> {
  const row: Partial<Omit<ProductRow, 'id' | 'created_at'>> = {}

  if (data.slug !== undefined)              row.slug              = data.slug
  if (data.name !== undefined)              row.name              = data.name
  if (data.category !== undefined)          row.category          = data.category
  if (data.price !== undefined)             row.price             = data.price
  if (data.material !== undefined)          row.material          = data.material
  if (data.description !== undefined)       row.description       = data.description
  if (data.imageUrl !== undefined)          row.image_url         = data.imageUrl
  if ('overlayImageUrl' in data)            row.overlay_image_url = data.overlayImageUrl ?? null
  if (data.referenceImageUrls !== undefined) row.context_images   = data.referenceImageUrls
  if (data.colors !== undefined)            row.colors            = data.colors

  return row
}

// ─── Repositorio ──────────────────────────────────────────────────────────────

/**
 * Implementación del puerto IProductRepository usando Supabase (PostgreSQL).
 *
 * Responsabilidad única: ejecutar queries contra la tabla `products`
 * y traducir entre el formato de la DB (snake_case) y el dominio (camelCase).
 * Todos los errores de Supabase se envuelven en InfrastructureError.
 */
export class SupabaseProductRepository implements IProductRepository {
  private readonly table = 'products'

  constructor(private readonly supabase: SupabaseClient) {}

  async getAll(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new InfrastructureError(
        `Error obteniendo productos: ${error.message}`,
        'SupabaseDB',
      )
    }

    return (data as ProductRow[]).map(toDomain)
  }

  async getByCategory(category: ProductCategory): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) {
      throw new InfrastructureError(
        `Error filtrando productos por categoría "${category}": ${error.message}`,
        'SupabaseDB',
      )
    }

    return (data as ProductRow[]).map(toDomain)
  }

  async getBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      throw new InfrastructureError(
        `Error buscando producto con slug "${slug}": ${error.message}`,
        'SupabaseDB',
      )
    }

    if (!data) {
      return null
    }

    return toDomain(data as ProductRow)
  }

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new InfrastructureError(
        `Error buscando producto con id "${id}": ${error.message}`,
        'SupabaseDB',
      )
    }

    if (!data) {
      return null
    }

    return toDomain(data as ProductRow)
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const row = toRow(product)

    const { data, error } = await this.supabase
      .from(this.table)
      .insert(row)
      .select()

    if (error) {
      throw new InfrastructureError(
        `Error creando producto: ${error.message}`,
        'SupabaseDB',
      )
    }

    const created = (data as ProductRow[])[0]
    if (!created) {
      throw new InfrastructureError(
        'El producto fue insertado pero no se pudo recuperar el registro creado.',
        'SupabaseDB',
      )
    }

    return toDomain(created)
  }

  async update(id: string, data: Partial<Omit<Product, 'id'>>): Promise<Product> {
    const partialRow = toPartialRow(data)

    // ── 1. Ejecutar el UPDATE sin intentar recuperar la fila de vuelta.
    //    RLS puede bloquear el SELECT inline del mismo statement aunque
    //    sí permite la escritura. Separamos las dos operaciones.
    const { error } = await this.supabase
      .from(this.table)
      .update(partialRow)
      .eq('id', id)

    if (error) {
      throw new InfrastructureError(
        `Error actualizando producto con id "${id}": ${error.message}`,
        'SupabaseDB',
      )
    }

    // ── 2. Leer el producto actualizado con una query SELECT independiente.
    const updated = await this.getById(id)
    if (!updated) {
      throw new InfrastructureError(
        `Producto con id "${id}" no encontrado tras la actualización.`,
        'SupabaseDB',
      )
    }

    return updated
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq('id', id)

    if (error) {
      throw new InfrastructureError(
        `Error eliminando producto con id "${id}": ${error.message}`,
        'SupabaseDB',
      )
    }
  }
}
