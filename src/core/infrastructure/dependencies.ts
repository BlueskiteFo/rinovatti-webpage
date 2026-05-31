import { createClient } from '@supabase/supabase-js'
import type { IProductRepository, IAIVisualizerService, IStorageService } from '@/core/application/ports'
import { GenerateRoomVisualizationUseCase, CreateProductUseCase } from '@/core/application/use-cases'
import { GeminiAiVisualizerService } from '@/core/infrastructure/services/gemini/GeminiAiVisualizerService'
import { SupabaseProductRepository } from '@/core/infrastructure/database/supabase/SupabaseProductRepository'
import { SupabaseStorageService } from '@/core/infrastructure/storage/SupabaseStorageService'

// ─── Cliente Supabase (singleton server-side) ─────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Servicios ────────────────────────────────────────────────────────────────

export const aiVisualizerService: IAIVisualizerService = new GeminiAiVisualizerService()
export const storageService: IStorageService = new SupabaseStorageService(supabase)

// ─── Repositorios ─────────────────────────────────────────────────────────────

export const productRepository: IProductRepository = new SupabaseProductRepository(supabase)

// ─── Casos de uso ─────────────────────────────────────────────────────────────

export const generateRoomVisualizationUseCase = new GenerateRoomVisualizationUseCase(
  aiVisualizerService,
)

export const createProductUseCase = new CreateProductUseCase(
  productRepository,
  storageService,
)
