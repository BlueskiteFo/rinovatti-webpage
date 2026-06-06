import { z } from 'zod'
import { ProductCategorySchema, ProductColorSchema } from '@/core/domain/entities'
import type { Product } from '@/core/domain/entities'
import type { IProductRepository, IStorageService } from '@/core/application/ports'
import { ValidationError } from '@/core/domain/errors'

// ─── Schema de entrada del caso de uso ────────────────────────────────────────

/**
 * Schema Zod para validar el FormData de actualización de producto.
 * Todos los campos son opcionales para soportar actualizaciones parciales (PATCH).
 */
const UpdateProductInputSchema = z.object({
  name: z.string().min(1, 'El nombre no puede estar vacío').optional(),
  category: ProductCategorySchema.optional(),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive('El precio debe ser un número positivo'))
    .optional(),
  material: z.string().min(1, 'El material no puede estar vacío').optional(),
  description: z.string().min(1, 'La descripción no puede estar vacía').optional(),
  /** Colores en formato JSON string: [{ name: string, hex: string }] */
  colors: z
    .string()
    .transform((val) => JSON.parse(val) as unknown)
    .pipe(z.array(ProductColorSchema).min(1, 'Se requiere al menos un color'))
    .optional(),
  /** Imagen de overlay en base64 o URL (opcional) */
  overlayImageUrl: z.string().url().optional().nullable(),
  badge: z.enum(['nuevo', 'popular']).optional().nullable(),
  dimensions: z.string().optional(),
})

type UpdateProductInput = z.infer<typeof UpdateProductInputSchema>

// ─── Caso de uso ──────────────────────────────────────────────────────────────

/**
 * Caso de uso: Actualizar un producto existente en el catálogo.
 *
 * Flujo:
 *  1. Extraer los campos presentes en el FormData.
 *  2. Validar los datos con Zod (todos opcionales, lanza ValidationError si falla).
 *  3. Si incluye un nuevo archivo de imagen (size > 0), subirlo con IStorageService.
 *  4. Si el nombre cambió, auto-generar un nuevo slug.
 *  5. Construir el objeto con los datos actualizados.
 *  6. Persistir los cambios usando IProductRepository.update(id, data).
 *  7. Retornar el producto actualizado.
 *
 * Responsabilidad única: orquestar la lógica de negocio de actualización.
 * No conoce ni Supabase, ni Next.js, ni ningún proveedor externo.
 */
export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(id: string, formData: FormData): Promise<Product> {
    // ── 1. Extraer campos presentes en el FormData ──────────────────────────
    //    Solo incluimos los campos que realmente fueron enviados (no undefined)
    const rawInput: Record<string, unknown> = {}

    const fieldNames = [
      'name',
      'category',
      'price',
      'material',
      'description',
      'colors',
      'overlayImageUrl',
      'badge',
      'dimensions',
    ] as const

    for (const field of fieldNames) {
      const value = formData.get(field)
      if (value !== null) {
        rawInput[field] = value === '' ? undefined : value
      }
    }

    const imageFile = formData.get('imageFile')

    // ── 2. Validar con Zod ─────────────────────────────────────────────────
    const parseResult = UpdateProductInputSchema.safeParse(rawInput)

    if (!parseResult.success) {
      throw ValidationError.fromZodError(parseResult.error)
    }

    const input: UpdateProductInput = parseResult.data

    // ── 3. Subir nueva imagen (solo si se envió un File válido) ─────────────
    let imageUrl: string | undefined

    if (imageFile instanceof File && imageFile.size > 0) {
      const slugBase = input.name ?? id
      const imagePath = `products/${this.generateSlug(slugBase)}-${Date.now()}.${this.getExtension(imageFile.name)}`
      imageUrl = await this.storageService.uploadImage(imageFile, imagePath)
    }

    // ── 4. Regenerar slug si el nombre cambió ──────────────────────────────
    const slug = input.name !== undefined ? this.generateSlug(input.name) : undefined

    // ── 5. Construir objeto con datos actualizados ─────────────────────────
    //    Solo incluimos las propiedades que realmente cambian
    const updatedData: Partial<Omit<Product, 'id'>> = {
      ...(slug !== undefined && { slug }),
      ...(input.name !== undefined && { name: input.name }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.material !== undefined && { material: input.material }),
      ...(input.description !== undefined && { description: input.description }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...('overlayImageUrl' in input && { overlayImageUrl: input.overlayImageUrl ?? null }),
      ...('badge' in input && { badge: input.badge ?? undefined }),
      ...(input.dimensions !== undefined && { dimensions: input.dimensions }),
      ...(input.colors !== undefined && { colors: input.colors }),
    }

    // ── 6. Persistir los cambios ───────────────────────────────────────────
    const updatedProduct = await this.productRepository.update(id, updatedData)

    // ── 7. Retornar el producto actualizado ────────────────────────────────
    return updatedProduct
  }

  // ─── Helpers privados ────────────────────────────────────────────────────────

  /**
   * Convierte un nombre en un slug URL-friendly.
   * Ej: "Sofá Nórdico Premium" → "sofa-nordico-premium"
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')   // eliminar tildes
      .replace(/[^a-z0-9\s-]/g, '')      // eliminar caracteres especiales
      .trim()
      .replace(/\s+/g, '-')              // espacios → guiones
      .replace(/-+/g, '-')               // múltiples guiones → uno solo
  }

  /** Extrae la extensión de un nombre de archivo */
  private getExtension(filename: string): string {
    const parts = filename.split('.')
    return parts.length > 1 ? (parts.pop() ?? 'jpg') : 'jpg'
  }
}
