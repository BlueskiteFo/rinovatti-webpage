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
    colors: product.colors,
  }
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

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const row = toRow(product)

    const { data, error } = await this.supabase
      .from(this.table)
      .insert(row)
      .select()
      .single()

    if (error) {
      throw new InfrastructureError(
        `Error creando producto: ${error.message}`,
        'SupabaseDB',
      )
    }

    return toDomain(data as ProductRow)
  }
}
