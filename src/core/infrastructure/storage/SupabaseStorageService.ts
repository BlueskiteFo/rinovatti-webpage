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
}
