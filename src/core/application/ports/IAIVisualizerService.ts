import type { VisualizerRequest } from '@/core/domain/entities'

/**
 * Puerto de salida para el servicio de visualización con IA.
 * La capa de infraestructura provee la implementación concreta
 * (fal.ai FLUX Kontext Max, ComfyUI, mock, etc.).
 */
export interface IAIVisualizerService {
  /**
   * Genera 4 perspectivas del mueble integrado en la sala del usuario
   * (Centro, Izquierda, Derecha, Fondo) en paralelo.
   * @param request - Datos validados de la petición de visualización
   * @returns Array con las URLs de las 4 imágenes generadas
   * @throws InfrastructureError si la generación falla en el proveedor externo
   */
  generateVisualization(request: VisualizerRequest): Promise<string[]>
}
