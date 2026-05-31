import type { IProductRepository } from '@/core/application/ports'
import type { Product, ProductCategory } from '@/core/domain/entities'
import { PRODUCTS_SEED } from './products-seed'

/**
 * Repositorio de productos en memoria usando datos estáticos.
 *
 * Implementación para desarrollo y MVP. En producción será reemplazado
 * por SupabaseProductRepository sin cambiar la capa de aplicación.
 */
export class InMemoryProductRepository implements IProductRepository {
  private readonly products: Product[]

  constructor(products: Product[] = PRODUCTS_SEED) {
    this.products = products
  }

  async getAll(): Promise<Product[]> {
    return this.products
  }

  async getByCategory(category: ProductCategory): Promise<Product[]> {
    return this.products.filter((p) => p.category === category)
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return this.products.find((p) => p.slug === slug) ?? null
  }
}
