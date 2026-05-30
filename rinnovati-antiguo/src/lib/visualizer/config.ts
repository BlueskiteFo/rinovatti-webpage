import type { VisualizerEngineConfig } from './types'

// ─── Cambiar aquí para activar otro modo ─────────────────────────────────────
// "canvas"      → Opción 2: superposición PNG client-side (activo)
// "ai"          → Opción 1: generación con IA (fal.ai / Replicate) — ver engines/ai.ts
// "perspective" → Futura: corrección de plano + homografía — ver engines/perspective.ts

export const VISUALIZER_CONFIG: VisualizerEngineConfig = {
  mode: 'ai',
  aiOptions: {
    apiRoute: '/api/visualizer',
    provider: 'fal',
  },
  canvasOptions: {
    defaultScalePercent: 42,
    overlayOpacity: 0.92,
  },
}
