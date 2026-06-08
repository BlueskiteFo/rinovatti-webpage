import { fal } from '@fal-ai/client'

fal.config({ credentials: process.env.FAL_KEY })

type FalOutput = {
  images?: Array<{ url: string; width: number; height: number }>
}

export async function generateWithFluxKontext(params: {
  roomImageBase64: string
  productImageUrl: string
  productName: string
  colorName: string
  material: string
  referenceImageUrls?: string[] // reservado para IP-Adapter — ignorado por FLUX Kontext
}): Promise<{ data: { imageUrl: string } | null; error: string | null }> {
  try {
    const prompt =
      `Integrate the ${params.colorName} ${params.productName} furniture piece ` +
      `(${params.material}) shown in the reference image into this room photo. ` +
      `Place it naturally with realistic perspective, lighting, and shadows. ` +
      `Preserve the room exactly — only add the furniture piece.`

    // Nota: verificar nombre exacto de parámetros en fal.ai/models/fal-ai/flux-pro/kontext
    const result = await fal.subscribe('fal-ai/flux-pro/kontext', {
      input: {
        prompt,
        image_url: params.roomImageBase64,
      },
    })

    const output = result.data as unknown as FalOutput
    const imageUrl = output?.images?.[0]?.url
    if (!imageUrl) return { data: null, error: 'fal.ai no devolvió imagen' }

    return { data: { imageUrl }, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Error desconocido en fal.ai',
    }
  }
}
