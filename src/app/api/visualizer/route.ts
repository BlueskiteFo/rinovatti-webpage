import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateWithFluxKontext } from '@/lib/visualizer/server/flux-kontext'
import { generateWithComfyUI } from '@/lib/visualizer/server/comfyui'

const bodySchema = z.object({
  roomImageBase64: z.string().min(1),
  productImageUrl: z.string().url(),
  productName: z.string().min(1),
  colorName: z.string().min(1),
  material: z.string(),
  referenceImageUrls: z.array(z.string().url()).optional(),
})

export async function POST(request: Request) {
  try {
    const raw: unknown = await request.json()
    const parsed = bodySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
    }

    const params = parsed.data

    if (process.env.MOCK_AI === 'true') {
      await new Promise((r) => setTimeout(r, 3000))
      return NextResponse.json({
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
      })
    }

    const engine = process.env.AI_ENGINE ?? 'flux-kontext'
    const result =
      engine === 'comfyui'
        ? await generateWithComfyUI(params)
        : await generateWithFluxKontext(params)

    if (result.error || !result.data) {
      return NextResponse.json({ error: result.error ?? 'Error generando imagen' }, { status: 500 })
    }

    return NextResponse.json({ imageUrl: result.data.imageUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
