import { VISUALIZER_CONFIG } from '../config'
import type { Product } from '@/core/domain/entities'

/**
 * Sube una data URL de imagen al servidor para obtener una URL pública HTTPS.
 * fal.ai solo acepta URLs públicas, no base64 ni blob URLs.
 */
async function uploadRoomImage(dataUrl: string): Promise<string> {
  const response = await fetch('/api/upload-room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataUrl }),
  })

  const json = await response.json() as Record<string, unknown>

  if (!response.ok || typeof json.url !== 'string') {
    throw new Error(
      typeof json.error === 'string' ? json.error : 'Error al subir la foto de la sala',
    )
  }

  return json.url
}

/**
 * Llama a la API del visualizador y obtiene las 4 URLs de perspectiva.
 * Retorna { data: { imageUrls: string[] } } en caso de éxito.
 */
export async function generateWithAI(params: {
  roomImageBase64: string
  product: Product
  colorName: string
  translation?: string
}): Promise<{ data: { imageUrls: string[] } | null; error: string | null }> {
  const apiRoute = VISUALIZER_CONFIG.aiOptions?.apiRoute ?? '/api/visualizer'

  try {
    // ── 1. Si la imagen es un data URL (base64) o blob URL, subirla primero
    //    para obtener una URL pública HTTPS que fal.ai pueda consumir.
    let roomImageUrl = params.roomImageBase64

    if (
      roomImageUrl.startsWith('data:') ||
      roomImageUrl.startsWith('blob:')
    ) {
      roomImageUrl = await uploadRoomImage(params.roomImageBase64)
    }

    // ── 2. Llamar al visualizador con la URL pública
    const response = await fetch(apiRoute, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomImageBase64: roomImageUrl,
        productImageUrl: params.product.imageUrl,
        productName: params.product.name,
        colorName: params.colorName,
        material: params.product.material,
        referenceImageUrls: params.product.referenceImageUrls ?? [],
        translation: params.translation,
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

    const imageUrls = (json as Record<string, unknown>).imageUrls
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return { data: null, error: 'Respuesta inesperada del servidor' }
    }

    return { data: { imageUrls: imageUrls as string[] }, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Error de conexión',
    }
  }
}
