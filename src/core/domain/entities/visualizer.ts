import { z } from 'zod'
import { TranslationDirection } from './transformation'

// ─── Esquemas Zod ─────────────────────────────────────────────────────────────

/** Esquema de la petición que el frontend envía a POST /api/visualizer */
export const VisualizerRequestSchema = z.object({
  /** Foto de la sala del usuario codificada en base64 (data URL o base64 puro) */
  roomImageBase64: z.string().min(1),
  /** URL pública de la imagen del producto en el catálogo */
  productImageUrl: z.string().url(),
  /** Nombre del producto seleccionado */
  productName: z.string().min(1),
  /** Nombre del color elegido por el usuario */
  colorName: z.string().min(1),
  /** Descripción del material del producto */
  material: z.string(),
  referenceImageUrls: z.array(z.string().url()).optional(),
  /** Dirección opcional para trasladar el mueble (izquierda o derecha) */
  translation: z.nativeEnum(TranslationDirection).optional(),
})

/** Esquema de la respuesta exitosa del visualizador */
export const VisualizerResponseSchema = z.object({
  /** URLs de las 4 imágenes generadas por IA (Centro, Izquierda, Derecha, Fondo) */
  imageUrls: z.array(z.string().url()).min(1),
})

/** Esquema de la respuesta de error del visualizador */
export const VisualizerErrorResponseSchema = z.object({
  error: z.string(),
})

// ─── Tipos inferidos ──────────────────────────────────────────────────────────

export type VisualizerRequest = z.infer<typeof VisualizerRequestSchema>
export type VisualizerResponse = z.infer<typeof VisualizerResponseSchema>  // { imageUrls: string[] }
export type VisualizerErrorResponse = z.infer<typeof VisualizerErrorResponseSchema>
