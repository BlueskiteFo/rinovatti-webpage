import type { IProductRepository, IAIVisualizerService } from '@/core/application/ports'
import { GenerateRoomVisualizationUseCase } from '@/core/application/use-cases'
import { FalAiVisualizerService } from '@/core/infrastructure/services/fal-ai/FalAiVisualizerService'
import { InMemoryProductRepository } from '@/core/infrastructure/database/memory/InMemoryProductRepository'

// ─── Servicios ────────────────────────────────────────────────────────────────

export const aiVisualizerService: IAIVisualizerService = new FalAiVisualizerService()

// ─── Repositorios ─────────────────────────────────────────────────────────────

export const productRepository: IProductRepository = new InMemoryProductRepository()

// ─── Casos de uso ─────────────────────────────────────────────────────────────

export const generateRoomVisualizationUseCase = new GenerateRoomVisualizationUseCase(
  aiVisualizerService,
)
