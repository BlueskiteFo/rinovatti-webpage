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

  /**
   * Busca un producto por su UUID. Retorna null si no existe.
   * @param id - UUID del producto a buscar.
   */
  getById(id: string): Promise<Product | null>

  /**
   * Persiste un nuevo producto en la base de datos.
   * @param product - Datos del producto sin el campo `id` (lo genera la DB).
   * @returns El producto completo con el `id` asignado por la base de datos.
   * @throws InfrastructureError si la operación falla en la capa de persistencia.
   */
  create(product: Omit<Product, 'id'>): Promise<Product>

  /**
   * Actualiza parcialmente un producto existente.
   * @param id - UUID del producto a actualizar.
   * @param data - Campos a actualizar (todos opcionales).
   * @returns El producto completo con los datos actualizados.
   * @throws NotFoundError si el producto no existe.
   * @throws InfrastructureError si la operación falla en la capa de persistencia.
   */
  update(id: string, data: Partial<Omit<Product, 'id'>>): Promise<Product>

  /**
   * Elimina permanentemente un producto de la base de datos.
   * @param id - UUID del producto a eliminar.
   * @throws InfrastructureError si la operación falla en la capa de persistencia.
   */
  delete(id: string): Promise<void>
}
