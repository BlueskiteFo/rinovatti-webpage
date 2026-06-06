import { fal } from '@fal-ai/client'
import type { IAIVisualizerService } from '@/core/application/ports'
import type { VisualizerRequest } from '@/core/domain/entities'
import { InfrastructureError } from '@/core/infrastructure/errors'

/** Estructura de la respuesta de fal.ai para modelos de generación de imagen */
type FalOutput = {
  images?: Array<{ url: string; width: number; height: number }>
}

/**
 * Implementación del servicio de visualización IA usando fal.ai FLUX Kontext.
 *
 * Estrategia de endpoint:
 * - Si el producto tiene renders reales (`referenceImageUrls`), usa
 *   `fal-ai/flux-pro/kontext/max/multi` con las renders como imágenes de contexto.
 *   Las imágenes de renders se re-suben al CDN de fal.ai para garantizar acceso.
 * - Si no hay renders, usa `fal-ai/flux-pro/kontext` con solo la foto del cuarto.
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
    const hasRenders =
      Array.isArray(request.referenceImageUrls) &&
      request.referenceImageUrls.length > 0

    try {
      const imageUrl = hasRenders
        ? await this.generateWithMultiContext(request)
        : await this.generateSingle(request)

      return imageUrl
    } catch (error) {
      if (error instanceof InfrastructureError) throw error

      // Log completo para diagnóstico
      const errMsg = error instanceof Error ? error.message : String(error)
      console.error('[FalAI] Error:', errMsg)
      try {
        console.error('[FalAI] Full error:', JSON.stringify(error))
      } catch { /* no-op */ }

      throw new InfrastructureError(errMsg, 'fal.ai')
    }
  }

  // ─── Estrategia 1: multi-imagen con renders de referencia ──────────────────

  /**
   * Usa `flux-pro/kontext/max/multi` cuando el producto tiene renders.
   *
   * Las imágenes de renders se descargan y re-suben al CDN de fal.ai
   * para evitar problemas de acceso con URLs de Supabase Storage.
   *
   * Array de image_urls:
   *   [foto_cuarto, render1, render2]  (max 3: 1 cuarto + 2 mejores renders)
   */
  private async generateWithMultiContext(request: VisualizerRequest): Promise<string> {
    const renders = (request.referenceImageUrls ?? []).slice(0, 2) // máx 2 renders

    console.log('[FalAI] Multi-context mode. Room URL:', request.roomImageBase64.substring(0, 80))
    console.log('[FalAI] Render URLs:', renders)

    // Re-subir renders al CDN de fal.ai para garantizar acceso público
    const uploadedRenderUrls = await this.uploadUrlsToFalCdn(renders)
    console.log('[FalAI] Uploaded render URLs:', uploadedRenderUrls)

    const imageUrls = [request.roomImageBase64, ...uploadedRenderUrls]
    const prompt    = this.buildMultiPrompt(request)

    console.log('[FalAI] Sending to flux-pro/kontext/max/multi with', imageUrls.length, 'images')

    const result = await fal.subscribe('fal-ai/flux-pro/kontext/max/multi', {
      input: {
        prompt,
        image_urls: imageUrls,
      },
    })

    return this.extractImageUrl(result.data as unknown as FalOutput)
  }

  /**
   * Descarga cada URL de Supabase y la re-sube al CDN de fal.ai.
   * Esto garantiza que fal.ai pueda acceder a las imágenes sin restricciones.
   */
  private async uploadUrlsToFalCdn(urls: string[]): Promise<string[]> {
    const uploaded: string[] = []

    for (const url of urls) {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          console.warn(`[FalAI] No se pudo descargar render: ${url} (${response.status})`)
          continue
        }

        const blob      = await response.blob()
        const mimeType  = blob.type || 'image/jpeg'
        const ext       = mimeType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg'
        const file      = new File([blob], `render.${ext}`, { type: mimeType })

        const falUrl = await fal.storage.upload(file)
        uploaded.push(falUrl)
        console.log(`[FalAI] Render subido a fal CDN: ${falUrl}`)
      } catch (err) {
        console.warn(`[FalAI] Error subiendo render ${url}:`, err)
        // Si falla la subida de un render, continuamos sin él
      }
    }

    return uploaded
  }

  // ─── Estrategia 2: imagen única (sin renders) ─────────────────────────────

  /** Usa `flux-pro/kontext` cuando no hay renders disponibles. */
  private async generateSingle(request: VisualizerRequest): Promise<string> {
    const prompt = this.buildSinglePrompt(request)

    console.log('[FalAI] Single mode. URL:', request.roomImageBase64.substring(0, 80))

    const result = await fal.subscribe('fal-ai/flux-pro/kontext', {
      input: {
        prompt,
        image_url: request.roomImageBase64,
      },
    })

    return this.extractImageUrl(result.data as unknown as FalOutput)
  }

  // ─── Helpers privados ─────────────────────────────────────────────────────

  /**
   * Extrae la URL de imagen de la respuesta de fal.ai.
   * Lanza InfrastructureError si la respuesta no contiene imagen.
   */
  private extractImageUrl(output: FalOutput): string {
    const imageUrl = output?.images?.[0]?.url

    if (!imageUrl) {
      throw new InfrastructureError(
        'fal.ai no devolvió imagen en la respuesta',
        'fal.ai',
      )
    }

    return imageUrl
  }

  /**
   * Prompt para el modo multi-imagen con renders de referencia.
   * image_urls[0] = foto del cuarto, image_urls[1..N] = renders del mueble.
   */
  private buildMultiPrompt(request: VisualizerRequest): string {
    return (
      `The first image is a room photo. The remaining images show the exact ` +
      `${request.colorName} ${request.productName} (${request.material}) ` +
      `furniture piece from different angles. ` +
      `Place this exact furniture piece naturally into the room in the first image. ` +
      `Strictly preserve its shape, texture, color and design as shown. ` +
      `Match perspective, lighting and shadows to the room. ` +
      `Do not modify the room — only add the furniture.`
    )
  }

  /**
   * Prompt para el modo de imagen única (sin renders disponibles).
   */
  private buildSinglePrompt(request: VisualizerRequest): string {
    return (
      `Add a ${request.colorName} ${request.productName} sofa made of ${request.material} ` +
      `into this room photo naturally. ` +
      `Match perspective, lighting and shadows to the room. ` +
      `Do not modify the room — only add the furniture.`
    )
  }
}
