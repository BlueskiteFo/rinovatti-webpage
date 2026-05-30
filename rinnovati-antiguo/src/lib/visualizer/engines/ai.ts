import { VISUALIZER_CONFIG } from '../config'
import type { Product } from '@/lib/constants/rinnovati'

export async function generateWithAI(params: {
  roomImageBase64: string
  product: Product
  colorName: string
}): Promise<{ data: { imageUrl: string } | null; error: string | null }> {
  const apiRoute = VISUALIZER_CONFIG.aiOptions?.apiRoute ?? '/api/visualizer'

  try {
    const response = await fetch(apiRoute, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomImageBase64: params.roomImageBase64,
        productImageUrl: params.product.imageUrl,
        productName: params.product.name,
        colorName: params.colorName,
        material: params.product.material,
        referenceImageUrls: params.product.referenceImageUrls ?? [],
      }),
    })

    const json: unknown = await response.json()

    if (!response.ok || typeof json !== 'object' || json === null || 'error' in json) {
      const msg = (json as Record<string, unknown>)?.error
      return {
        data: null,
        error: typeof msg === 'string' ? msg : 'Error al generar imagen',
      }
    }

    const imageUrl = (json as Record<string, unknown>).imageUrl
    if (typeof imageUrl !== 'string') {
      return { data: null, error: 'Respuesta inesperada del servidor' }
    }

    return { data: { imageUrl }, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Error de conexión',
    }
  }
}
