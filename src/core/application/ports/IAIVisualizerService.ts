import type { VisualizerRequest } from '@/core/domain/entities'

/**
 * Puerto de salida para el servicio de visualización con IA.
 * La capa de infraestructura provee la implementación concreta
 * (fal.ai FLUX Kontext, ComfyUI, mock, etc.).
 */
export interface IAIVisualizerService {
  /**
   * Genera una imagen con el mueble integrado en la foto de la sala del usuario.
   * @param request - Datos validados de la petición de visualización
   * @returns URL de la imagen generada
   * @throws DomainError si la generación falla en el proveedor externo
   */
  generateVisualization(request: VisualizerRequest): Promise<string>
}
