import { z } from 'zod'
import { ProductCategorySchema, ProductColorSchema } from '@/core/domain/entities'
import type { Product } from '@/core/domain/entities'
import type { IProductRepository, IStorageService } from '@/core/application/ports'
import { ValidationError } from '@/core/domain/errors'

// ─── Schema de entrada del caso de uso ────────────────────────────────────────

/**
 * Schema Zod para validar el FormData de creación de producto.
 * Refleja exactamente los campos que el formulario del admin envía.
 */
const CreateProductInputSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  category: ProductCategorySchema,
  price: z
    .string()
    .min(1, 'El precio es obligatorio')
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive('El precio debe ser un número positivo')),
  material: z.string().min(1, 'El material es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  /** Colores en formato JSON string: [{ name: string, hex: string }] */
  colors: z
    .string()
    .min(1, 'Se requiere al menos un color')
    .transform((val) => JSON.parse(val) as unknown)
    .pipe(z.array(ProductColorSchema).min(1, 'Se requiere al menos un color')),
  /** Imagen de overlay en base64 o URL (opcional) */
  overlayImageUrl: z.string().url().optional().nullable(),
  badge: z.enum(['nuevo', 'popular']).optional(),
  dimensions: z.string().optional(),
})

type CreateProductInput = z.infer<typeof CreateProductInputSchema>

// ─── Caso de uso ──────────────────────────────────────────────────────────────

/**
 * Caso de uso: Crear un producto nuevo en el catálogo.
 *
 * Flujo:
 *  1. Extraer los campos del FormData.
 *  2. Validar los datos con Zod (lanza ValidationError si falla).
 *  3. Subir la imagen principal usando el IStorageService.
 *  4. Auto-generar el slug a partir del nombre del producto.
 *  5. Construir el objeto Product completo.
 *  6. Persistir el producto usando IProductRepository.create().
 *  7. Retornar el producto creado con su id asignado.
 *
 * Responsabilidad única: orquestar la lógica de negocio de creación.
 * No conoce ni Supabase, ni Next.js, ni ningún proveedor externo.
 */
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(formData: FormData): Promise<Product> {
    // ── 1. Extraer campos del FormData ─────────────────────────────────────
    const rawInput = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: formData.get('price'),
      material: formData.get('material'),
      description: formData.get('description'),
      colors: formData.get('colors'),
      overlayImageUrl: formData.get('overlayImageUrl') || null,
      badge: formData.get('badge') || undefined,
      dimensions: formData.get('dimensions') || undefined,
    }

    const imageFile = formData.get('imageFile')

    // ── 2. Validar con Zod ─────────────────────────────────────────────────
    const parseResult = CreateProductInputSchema.safeParse(rawInput)

    if (!parseResult.success) {
      throw ValidationError.fromZodError(parseResult.error)
    }

    const input: CreateProductInput = parseResult.data

    if (!(imageFile instanceof File) || imageFile.size === 0) {
      throw new ValidationError('La imagen principal es obligatoria', {
        imageFile: ['Se requiere un archivo de imagen válido'],
      })
    }

    // ── 3. Subir imagen principal ──────────────────────────────────────────
    const imagePath = `products/${this.generateSlug(input.name)}-${Date.now()}.${this.getExtension(imageFile.name)}`
    const imageUrl = await this.storageService.uploadImage(imageFile, imagePath)

    // ── 4. Auto-generar el slug ────────────────────────────────────────────
    const slug = this.generateSlug(input.name)

    // ── 5. Construir el objeto Product ─────────────────────────────────────
    const productData: Omit<Product, 'id'> = {
      slug,
      name: input.name,
      category: input.category,
      price: input.price,
      material: input.material,
      description: input.description,
      imageUrl,
      overlayImageUrl: input.overlayImageUrl ?? null,
      colors: input.colors,
      badge: input.badge,
      dimensions: input.dimensions,
    }

    // ── 6. Persistir el producto ───────────────────────────────────────────
    const createdProduct = await this.productRepository.create(productData)

    // ── 7. Retornar el producto con su id ──────────────────────────────────
    return createdProduct
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
