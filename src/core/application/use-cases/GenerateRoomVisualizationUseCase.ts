import { VisualizerRequestSchema } from '@/core/domain/entities'
import { ValidationError } from '@/core/domain/errors'
import type { IAIVisualizerService } from '@/core/application/ports'

/**
 * Caso de uso: Generar 4 visualizaciones en perspectiva de un mueble en la sala del usuario.
 *
 * Responsabilidades:
 * 1. Validar el input crudo con VisualizerRequestSchema
 * 2. Delegar la generación paralela al servicio IA inyectado
 * 3. Retornar el array de 4 URLs (Centro, Izquierda, Derecha, Fondo)
 */
export class GenerateRoomVisualizationUseCase {
  private readonly aiService: IAIVisualizerService

  constructor(aiService: IAIVisualizerService) {
    this.aiService = aiService
  }

  /**
   * Ejecuta la generación en paralelo de 4 perspectivas.
   * @param input - Datos crudos (sin validar) provenientes del controller/route handler
   * @returns Array con las 4 URLs de perspectivas generadas por IA
   * @throws ValidationError si el input no cumple el esquema
   * @throws InfrastructureError si el servicio IA falla
   */
  async execute(input: unknown): Promise<string[]> {
    const parsed = VisualizerRequestSchema.safeParse(input)

    if (!parsed.success) {
      throw ValidationError.fromZodError(parsed.error)
    }

    const imageUrls = await this.aiService.generateVisualization(parsed.data)

    return imageUrls
  }
}
