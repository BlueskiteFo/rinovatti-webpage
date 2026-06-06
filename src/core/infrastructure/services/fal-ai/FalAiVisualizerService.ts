import { fal } from '@fal-ai/client'
import type { IAIVisualizerService } from '@/core/application/ports'
import type { VisualizerRequest } from '@/core/domain/entities'
import { InfrastructureError } from '@/core/infrastructure/errors'

/** Estructura de la respuesta de fal.ai para modelos de generación de imagen */
type FalOutput = {
  images?: Array<{ url: string; width: number; height: number }>
}

/**
 * Implementación del servicio de visualización IA usando fal.ai FLUX Kontext Max.
 *
 * Responsabilidades:
 * - Configurar credenciales de fal.ai
 * - Construir el prompt a partir del VisualizerRequest
 * - Mapear la request al formato que espera la API de fal.ai
 * - Convertir errores de la API a InfrastructureError
 */
export class FalAiVisualizerService implements IAIVisualizerService {
  constructor() {
    fal.config({ credentials: process.env.FAL_KEY })
  }

  async generateVisualization(request: VisualizerRequest): Promise<string> {
    const prompt = this.buildPrompt(request)

    try {
      const result = await fal.subscribe('fal-ai/flux-kontext/max', {
        input: {
          prompt,
          image_url: request.roomImageBase64,
          reference_image_url: request.productImageUrl,
        },
      })

      const output = result.data as unknown as FalOutput
      const imageUrl = output?.images?.[0]?.url

      if (!imageUrl) {
        throw new InfrastructureError(
          'fal.ai no devolvió imagen en la respuesta',
          'fal.ai',
        )
      }

      return imageUrl
    } catch (error) {
      // Si ya es nuestro error, re-lanzar
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError(
        error instanceof Error ? error.message : 'Error desconocido en fal.ai',
        'fal.ai',
      )
    }
  }

  /** Construye el prompt de generación a partir de los datos del producto */
  private buildPrompt(request: VisualizerRequest): string {
    return (
      `Integrate the ${request.colorName} ${request.productName} furniture piece ` +
      `(${request.material}) shown in the reference image into this room photo. ` +
      `Place it naturally with realistic perspective, lighting, and shadows. ` +
      `Preserve the room exactly — only add the furniture piece.`
    )
  }
}
