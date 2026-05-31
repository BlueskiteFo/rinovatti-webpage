import { GoogleGenAI, type Part } from '@google/genai'
import type { IAIVisualizerService } from '@/core/application/ports'
import type { VisualizerRequest } from '@/core/domain/entities'
import { InfrastructureError } from '@/core/infrastructure/errors'

/**
 * Implementación del servicio de visualización IA usando el ecosistema de Google.
 *
 * Estrategia "Doble Cerebro":
 *  - Paso 1 (Análisis): Gemini 1.5 Flash recibe la imagen de la sala + datos del producto
 *    y devuelve un prompt detallado en inglés para un generador de imágenes.
 *  - Paso 2 (Generación): Gemini 2.0 Flash Image Generation genera la imagen final
 *    con el mueble integrado de forma realista en la sala.
 *
 * Nota: Se usa gemini-2.0-flash-preview-image-generation en lugar de Imagen 3
 * porque Imagen 3 requiere Google Cloud / Vertex AI (no disponible en AI Studio gratuito).
 *
 * Responsabilidades:
 *  - Configurar el cliente de Google GenAI con la API key del entorno.
 *  - Extraer la parte base64 pura de la imagen de la sala (sea data URL o base64 puro).
 *  - Construir el prompt de análisis y solicitar el prompt de renderizado a Gemini.
 *  - Invocar el modelo de generación de imágenes y retornar la imagen como Data URI.
 *  - Convertir errores de la API de Google en InfrastructureError.
 */
export class GeminiAiVisualizerService implements IAIVisualizerService {
  private readonly ai: GoogleGenAI

  /** Modelo de análisis visual (Paso 1) */
  private readonly ANALYSIS_MODEL = 'gemini-3.5-flash'

  /** Modelo de generación de imágenes (Paso 2) — disponible en AI Studio gratuito */
  private readonly GENERATION_MODEL = 'gemini-3.1-flash-image'

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY ?? '' })
  }

  async generateVisualization(request: VisualizerRequest): Promise<string> {
    try {
      // ── Paso 1: Análisis visual con Gemini ──────────────────────────────────
      const detailedPrompt = await this.analyzeRoomAndBuildPrompt(request)
      console.log('[GeminiAI] Paso 1 completado. Prompt generado:', detailedPrompt.slice(0, 120) + '...')

      // ── Paso 2: Generación de imagen con Gemini Image Generation ────────────
      const imageDataUri = await this.generateRoomImage(detailedPrompt)
      console.log('[GeminiAI] Paso 2 completado. Imagen generada como Data URI.')

      return imageDataUri
    } catch (error) {
      // Re-lanzar nuestros propios errores sin re-envolver
      if (error instanceof InfrastructureError) {
        throw error
      }

      const message = error instanceof Error
        ? error.message
        : 'Error desconocido en el ecosistema de Google AI'
      console.error('[GeminiAI] Error no capturado:', message, error)

      throw new InfrastructureError(message, 'Google AI')
    }
  }

  // ─── Paso 1: Análisis ────────────────────────────────────────────────────────

  /**
   * Usa Gemini 1.5 Flash para analizar la sala y generar un prompt de renderizado
   * altamente detallado en inglés.
   */
  private async analyzeRoomAndBuildPrompt(request: VisualizerRequest): Promise<string> {
    const base64Image = this.extractBase64(request.roomImageBase64)

    const analysisPrompt =
      `You are an expert interior designer and prompt engineer for AI image generation. ` +
      `Analyze the provided room photo carefully, noting the style, lighting, colors, and layout. ` +
      `\n\nThe user wants to visualize the following furniture piece integrated into this room:\n` +
      `- Product: ${request.productName}\n` +
      `- Color: ${request.colorName}\n` +
      `- Material: ${request.material || 'unspecified'}\n` +
      `\nGenerate ONLY a highly detailed image generation prompt in English (no explanation, ` +
      `no preamble, no markdown, just the prompt text). ` +
      `The prompt must describe how the furniture piece would look naturally integrated in the room, ` +
      `respecting the room's existing lighting, perspective, shadows, color palette, and architectural style. ` +
      `The room should remain unchanged except for the addition of the furniture piece.`

    const response = await this.ai.models.generateContent({
      model: this.ANALYSIS_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
            { text: analysisPrompt },
          ],
        },
      ],
    })

    const promptText = response.text?.trim()

    if (!promptText) {
      throw new InfrastructureError(
        'Gemini no devolvió un prompt de renderizado válido',
        'Gemini 1.5 Flash',
      )
    }

    return promptText
  }

  // ─── Paso 2: Generación ──────────────────────────────────────────────────────

  /**
   * Usa Gemini 2.0 Flash Image Generation para generar la imagen final
   * a partir del prompt enriquecido producido por Gemini en el Paso 1.
   */
  private async generateRoomImage(detailedPrompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: this.GENERATION_MODEL,
      contents: [{ role: 'user', parts: [{ text: detailedPrompt }] }],
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    })

    // Buscar la parte de imagen en los candidates
    const parts: Part[] = response.candidates?.[0]?.content?.parts ?? []
    console.log('[GeminiAI] Partes recibidas del modelo:', parts.map((p: Part) => Object.keys(p)))

    const imagePart = parts.find(
      (p: Part) => p.inlineData?.mimeType?.startsWith('image/') === true
    )

    if (!imagePart?.inlineData?.data) {
      throw new InfrastructureError(
        'El modelo de generación no devolvió datos de imagen en la respuesta',
        'Gemini 2.0 Flash Image Generation',
      )
    }

    const { mimeType, data } = imagePart.inlineData as { mimeType: string; data: string | Uint8Array }

    // data puede ser string base64 o Uint8Array — normalizar a string
    const base64String = typeof data === 'string'
      ? data
      : Buffer.from(data).toString('base64')

    return `data:${mimeType};base64,${base64String}`
  }

  // ─── Utilidades ──────────────────────────────────────────────────────────────

  /**
   * Extrae la parte base64 pura de una cadena que puede ser:
   *  - Un data URL: "data:image/jpeg;base64,<datos>"
   *  - Base64 puro directamente
   */
  private extractBase64(imageData: string): string {
    const dataUrlPrefix = 'base64,'
    const prefixIndex = imageData.indexOf(dataUrlPrefix)

    if (prefixIndex !== -1) {
      return imageData.slice(prefixIndex + dataUrlPrefix.length)
    }

    return imageData
  }
}
