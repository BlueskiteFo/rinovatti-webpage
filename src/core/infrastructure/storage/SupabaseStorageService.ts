import type { SupabaseClient } from '@supabase/supabase-js'
import type { IStorageService } from '@/core/application/ports'
import { InfrastructureError } from '@/core/infrastructure/errors'

/**
 * Implementación del puerto IStorageService usando Supabase Storage.
 *
 * Responsabilidad única: subir archivos al bucket de Supabase y retornar
 * la URL pública. No conoce lógica de negocio ni del dominio.
 */
export class SupabaseStorageService implements IStorageService {
  private readonly bucket = 'product-images'

  constructor(private readonly supabase: SupabaseClient) {}

  async uploadImage(file: File, path: string): Promise<string> {
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      throw new InfrastructureError(
        `Error subiendo imagen a Storage: ${error.message}`,
        'SupabaseStorage',
      )
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(path)

    if (!publicUrlData?.publicUrl) {
      throw new InfrastructureError(
        'No se pudo obtener la URL pública del archivo subido',
        'SupabaseStorage',
      )
    }

    return publicUrlData.publicUrl
  }

  async deleteImage(url: string): Promise<void> {
    // Extraer la ruta relativa dentro del bucket a partir de la URL pública.
    // Supabase Storage genera URLs con el patrón:
    //   <supabaseUrl>/storage/v1/object/public/<bucket>/<path>
    // Necesitamos solo la parte <path> para llamar a .remove().
    let filePath: string

    try {
      const parsed = new URL(url)
      // El pathname tiene forma: /storage/v1/object/public/product-images/products/file.jpg
      const marker = `/public/${this.bucket}/`
      const markerIndex = parsed.pathname.indexOf(marker)

      if (markerIndex === -1) {
        // URL no pertenece a este bucket: ignoramos silenciosamente
        return
      }

      filePath = parsed.pathname.slice(markerIndex + marker.length)
    } catch {
      // URL malformada: ignoramos silenciosamente
      return
    }

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([filePath])

    if (error) {
      throw new InfrastructureError(
        `Error eliminando imagen del Storage: ${error.message}`,
        'SupabaseStorage',
      )
    }
  }
}
