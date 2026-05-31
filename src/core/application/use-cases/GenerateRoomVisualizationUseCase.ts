import { VisualizerRequestSchema } from '@/core/domain/entities'
import { ValidationError } from '@/core/domain/errors'
import type { IAIVisualizerService } from '@/core/application/ports'

/**
 * Caso de uso: Generar visualización de un mueble en la sala del usuario.
 *
 * Responsabilidades:
 * 1. Validar el input crudo con VisualizerRequestSchema
 * 2. Delegar la generación de imagen al servicio IA inyectado
 * 3. Retornar la URL de la imagen generada
 */
export class GenerateRoomVisualizationUseCase {
  private readonly aiService: IAIVisualizerService

  constructor(aiService: IAIVisualizerService) {
    this.aiService = aiService
  }

  /**
   * Ejecuta la generación de visualización.
   * @param input - Datos crudos (sin validar) provenientes del controller/route handler
   * @returns URL de la imagen generada por IA
   * @throws ValidationError si el input no cumple el esquema
   * @throws DomainError si el servicio IA falla
   */
  async execute(input: unknown): Promise<string> {
    const parsed = VisualizerRequestSchema.safeParse(input)

    if (!parsed.success) {
      throw ValidationError.fromZodError(parsed.error)
    }

    const imageUrl = await this.aiService.generateVisualization(parsed.data)

    return imageUrl
  }
}
