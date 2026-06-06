import type { IProductRepository } from '@/core/application/ports'
import type { IStorageService } from '@/core/application/ports'
import { NotFoundError } from '@/core/domain/errors'

/**
 * Caso de uso: Eliminar un producto del catálogo con limpieza de Storage.
 *
 * Flujo:
 *  1. Obtener el producto por id (getById). Si no existe → NotFoundError.
 *  2. Extraer las URLs de imagen (imageUrl y overlayImageUrl si existe).
 *  3. Eliminar las imágenes del Storage (best-effort, no bloquea si falla).
 *  4. Eliminar el registro de la base de datos.
 *
 * Responsabilidad única: orquestar el borrado coordinado de DB y Storage.
 * No conoce ni Supabase, ni Next.js, ni ningún proveedor externo.
 */
export class DeleteProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(id: string): Promise<void> {
    // ── 1. Verificar que el producto existe ────────────────────────────────
    const product = await this.productRepository.getById(id)

    if (!product) {
      throw new NotFoundError('Product', id)
    }

    // ── 2. Recopilar las URLs de imágenes a borrar ─────────────────────────
    const imageUrls: string[] = [product.imageUrl]

    if (product.overlayImageUrl) {
      imageUrls.push(product.overlayImageUrl)
    }

    // ── 3. Borrar imágenes del Storage (en paralelo, best-effort) ──────────
    //    Si la imagen no existe en Storage o el borrado falla, lo ignoramos
    //    con un catch individual para no bloquear la eliminación del registro.
    await Promise.allSettled(
      imageUrls.map((url) => this.storageService.deleteImage(url)),
    )

    // ── 4. Eliminar el registro de la base de datos ────────────────────────
    await this.productRepository.delete(id)
  }
}
