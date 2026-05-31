import type { Product, ProductCategory } from '@/core/domain/entities'

/**
 * Puerto de salida para acceso a productos.
 * La capa de infraestructura provee la implementación concreta
 * (datos estáticos, Supabase, API externa, etc.).
 */
export interface IProductRepository {
  /** Obtiene todos los productos del catálogo */
  getAll(): Promise<Product[]>

  /** Filtra productos por categoría */
  getByCategory(category: ProductCategory): Promise<Product[]>

  /** Busca un producto por su slug. Retorna null si no existe. */
  getBySlug(slug: string): Promise<Product | null>
}
