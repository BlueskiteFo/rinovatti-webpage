import { fal } from '@fal-ai/client'
import type { IAIVisualizerService } from '@/core/application/ports'
import type { VisualizerRequest } from '@/core/domain/entities'
import { InfrastructureError } from '@/core/infrastructure/errors'

/** Estructura de la respuesta de fal.ai para modelos de generación de imagen */
type FalOutput = {
  images?: Array<{ url: string; width: number; height: number }>
}

/**
 * Perspectivas de colocación del mueble en la sala.
 * Cada una modifica el prompt para guiar al modelo hacia
 * una posición distinta dentro del espacio.
 */
type PerspectiveKey = 'center' | 'left' | 'right' | 'background'

const PERSPECTIVE_INSTRUCTIONS: Record<PerspectiveKey, string> = {
  center:
    'Position the furniture piece perfectly centered in the room, creating a balanced and symmetrical composition.',
  left:
    'Position the furniture piece shifted towards the left side of the room, close to the left wall, leaving open space on the right.',
  right:
    'Position the furniture piece shifted towards the right side of the room, close to the right wall, leaving open space on the left.',
  background:
    'Position the furniture piece pushed towards the back of the room, further from the camera, to emphasize the depth and perspective of the space.',
}

/**
 * Implementación del servicio de visualización IA usando fal.ai FLUX Kontext Max.
 *
 * Estrategia de generación paralela:
 * - Ejecuta 4 peticiones simultáneas con Promise.all
 * - Cada petición apunta a `fal-ai/flux-pro/kontext/max/multi`
 * - Cada prompt incluye una instrucción de posicionamiento diferente
 *   (Centro · Izquierda · Derecha · Fondo)
 *
 * Estrategia de endpoint:
 * - Si el producto tiene renders reales (`referenceImageUrls`), usa
 *   `fal-ai/flux-pro/kontext/max/multi` con las renders como imágenes de contexto.
 *   Las imágenes de renders se re-suben al CDN de fal.ai para garantizar acceso.
 * - Si no hay renders, usa `fal-ai/flux-pro/kontext` con solo la foto del cuarto.
 *
 * Responsabilidades:
 * - Configurar credenciales de fal.ai
 * - Construir el prompt a partir del VisualizerRequest + perspectiva
 * - Mapear la request al formato que espera la API de fal.ai
 * - Convertir errores de la API a InfrastructureError
 */
export class FalAiVisualizerService implements IAIVisualizerService {
  constructor() {
    fal.config({ credentials: process.env.FAL_KEY })
  }

  /**
   * Genera las 4 perspectivas en paralelo con Promise.all.
   * Retorna un array de 4 URLs en el orden: [Centro, Izquierda, Derecha, Fondo].
   */
  async generateVisualization(request: VisualizerRequest): Promise<string[]> {
    const hasRenders =
      Array.isArray(request.referenceImageUrls) &&
      request.referenceImageUrls.length > 0

    try {
      // Pre-upload renders once to avoid 4x redundant uploads
      const uploadedRenderUrls = hasRenders
        ? await this.uploadUrlsToFalCdn((request.referenceImageUrls ?? []).slice(0, 3))
        : []

      const perspectives: PerspectiveKey[] = ['center', 'left', 'right', 'background']

      const results = await Promise.all(
        perspectives.map((perspective) =>
          hasRenders
            ? this.generateWithMultiContext(request, uploadedRenderUrls, perspective)
            : this.generateSingle(request, perspective)
        )
      )

      return results
    } catch (error) {
      if (error instanceof InfrastructureError) throw error

      // Log completo para diagnóstico
      const errMsg = error instanceof Error ? error.message : String(error)
      console.error('[FalAI] Error en generación paralela:', errMsg)
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
   * Array de image_urls:
   *   [foto_cuarto, render1, render2]  (max 3: 1 cuarto + 2 mejores renders)
   *
   * @param perspective - Perspectiva de colocación del mueble
   */
  private async generateWithMultiContext(
    request: VisualizerRequest,
    uploadedRenderUrls: string[],
    perspective: PerspectiveKey,
  ): Promise<string> {
    const imageUrls = [request.roomImageBase64, ...uploadedRenderUrls]
    const prompt    = this.buildMultiPrompt(request, uploadedRenderUrls.length, perspective)

    console.log(`[FalAI] Multi-context [${perspective}] with`, imageUrls.length, 'images')

    const result = await fal.subscribe('fal-ai/flux-pro/kontext/max/multi', {
      input: {
        prompt,
        image_urls: imageUrls,
        // @ts-expect-error type definitions are missing this property but the API accepts it
        image_prompt_strength: 1.0, // Forzar el máximo respeto por la forma del mueble original
      },
    })

    return this.extractImageUrl(result.data as unknown as FalOutput, perspective)
  }

  /**
   * Descarga cada URL de Supabase y la re-sube al CDN de fal.ai.
   * Esto garantiza que fal.ai pueda acceder a las imágenes sin restricciones.
   * Se ejecuta UNA sola vez antes del Promise.all para evitar uploads duplicados.
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

  /**
   * Usa `flux-pro/kontext` cuando no hay renders disponibles.
   * @param perspective - Perspectiva de colocación del mueble
   */
  private async generateSingle(
    request: VisualizerRequest,
    perspective: PerspectiveKey,
  ): Promise<string> {
    const prompt = this.buildSinglePrompt(request, perspective)

    console.log(`[FalAI] Single mode [${perspective}]. URL:`, request.roomImageBase64.substring(0, 80))

    const result = await fal.subscribe('fal-ai/flux-pro/kontext', {
      input: {
        prompt,
        image_url: request.roomImageBase64,
      },
    })

    return this.extractImageUrl(result.data as unknown as FalOutput, perspective)
  }

  // ─── Helpers privados ─────────────────────────────────────────────────────

  /**
   * Extrae la URL de imagen de la respuesta de fal.ai.
   * Lanza InfrastructureError si la respuesta no contiene imagen.
   */
  private extractImageUrl(output: FalOutput, perspective: PerspectiveKey): string {
    const imageUrl = output?.images?.[0]?.url

    if (!imageUrl) {
      throw new InfrastructureError(
        `fal.ai no devolvió imagen para la perspectiva "${perspective}"`,
        'fal.ai',
      )
    }

    return imageUrl
  }

  /**
   * Prompt para el modo multi-imagen con renders de referencia.
   * image_urls[0] = foto del cuarto, image_urls[1..N] = renders del mueble.
   *
   * Prompt extremadamente defensivo para evitar que el modelo use los fondos
   * de los renders (estudio blanco) como sala en vez de @image1.
   *
   * @param perspective - Posición específica del mueble en la sala
   */
  private buildMultiPrompt(
    request: VisualizerRequest,
    numRenders: number,
    perspective: PerspectiveKey,
  ): string {
    const renderTags = Array.from({ length: numRenders }, (_, i) => `@image${i + 2}`).join(', ')
    const positionInstruction = PERSPECTIVE_INSTRUCTIONS[perspective]

    return (
      // ── PASO 1: Define el rol de cada imagen con suma claridad ──
      `ROOM (use this as the scene): @image1 is the ACTUAL REAL ROOM where the furniture must be placed. ` +
      `Copy its walls, floor, ceiling, windows, lighting conditions, and perspective EXACTLY. ` +
      `FURNITURE REFERENCES (shape only, ignore their backgrounds): ` +
      `${renderTags} show the ${request.colorName} ${request.productName} made of ${request.material} from multiple angles. ` +
      `Use these images ONLY to understand the furniture's exact 3D shape, color, and design. ` +
      // ── PASO 2: Prohibición explícita ──
      `CRITICAL — DO NOT use the white, grey, or studio backgrounds from ${renderTags} as the room. ` +
      `The final image MUST show the exact same room as @image1. ` +
      // ── PASO 3: Instrucción de colocación ──
      `PLACEMENT: ${positionInstruction} ` +
      // ── PASO 4: Reglas de síntesis ──
      `Generate EXACTLY ONE seamless photorealistic photograph showing the furniture placed inside the room from @image1. ` +
      `Match the perspective, lighting, and shadows of @image1. ` +
      `Preserve the furniture's exact shape, proportions, and design. DO NOT add legs or alter the base if it sits flat. ` +
      // ── PASO 5: Defensa anti-artefactos ──
      `STRICTLY FORBIDDEN: grids, collages, multiple frames, white studio backgrounds, text, labels, UI elements, or bounding boxes. ` +
      `Output must be a single clean photorealistic photo with NO graphic overlays.`
    )
  }

  /**
   * Prompt para el modo de imagen única (sin renders disponibles).
   *
   * @param perspective - Posición específica del mueble en la sala
   */
  private buildSinglePrompt(
    request: VisualizerRequest,
    perspective: PerspectiveKey,
  ): string {
    const positionInstruction = PERSPECTIVE_INSTRUCTIONS[perspective]

    return (
      `Add a ${request.colorName} ${request.productName} sofa made of ${request.material} into this room photo naturally. ` +
      `${positionInstruction} ` +
      `Match the perspective, lighting, and shadows of the existing room. ` +
      `Do not modify the room — only add the sofa. ` +
      `DEFENSIVE RULE: Ignore and remove any text, UI elements, bounding boxes, labels, or collage formatting. The final output must be a clean, photorealistic photograph with NO text or graphic overlays.`
    )
  }
}
